# 🚀 Migración a Supabase - Resumen Ejecutivo

## 📋 Lo que ya está hecho

✅ **APIs actualizados** - Migrados de Prisma a Supabase
- `/api/user/adoptions/route.ts` - Consulta adopciones del usuario
- `/api/webhooks/stripe/route.ts` - Procesa pagos y crea adopciones

✅ **Variables de entorno** - Actualizado `.env.example`

✅ **Configuración de Supabase Admin** - `/lib/supabaseAdmin.ts`

✅ **Scripts de seeding**
- `scripts/seed-trees-supabase.js` - Importa 90 árboles
- `scripts/seed-users-supabase.js` - Crea usuarios de prueba

---

## 🎯 Pasos que debes hacer en Supabase

### 1️⃣ Crear Proyecto en Supabase

Ir a https://supabase.com/dashboard

1. Hacer login o crear cuenta
2. Crear nuevo proyecto
3. Guardar:
   - 🔗 Project URL: `https://xxxxx.supabase.co`
   - 🔑 Service Role Key (completamente secreto)
   - 🔑 Anon Key (público, se usa en el cliente)

### 2️⃣ Crear Tablas (SQL Editor)

Copiar y ejecutar cada script en: **SQL Editor** → **New Query**

#### Tabla 1: `users`
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);
```
✅ Ejecutar

#### Tabla 2: `trees`
```sql
CREATE TABLE trees (
  id TEXT PRIMARY KEY,
  name TEXT,
  type TEXT CHECK (type IN ('olive', 'almond')),
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'adopted', 'reserved')),
  description TEXT,
  yearly_report TEXT,
  images TEXT,
  videos TEXT,
  latitude FLOAT,
  longitude FLOAT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_trees_status ON trees(status);
CREATE INDEX idx_trees_type ON trees(type);
CREATE INDEX idx_trees_location ON trees(latitude, longitude);
```
✅ Ejecutar

#### Tabla 3: `adoptions` (LA PRINCIPAL)
```sql
CREATE TABLE adoptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  tree_id TEXT NOT NULL REFERENCES trees(id),
  status TEXT DEFAULT 'adopted' CHECK (status IN ('available', 'adopted', 'reserved')),
  payment_status TEXT DEFAULT 'completed' CHECK (payment_status IN ('pending', 'completed', 'failed')),
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  stripe_session_id TEXT UNIQUE,
  certificate_url TEXT,
  certificate_code TEXT UNIQUE,
  tree_name TEXT,
  gift_message TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE adoptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own adoptions" ON adoptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their adoptions" ON adoptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_adoptions_user_id ON adoptions(user_id);
CREATE INDEX idx_adoptions_tree_id ON adoptions(tree_id);
CREATE INDEX idx_adoptions_payment_status ON adoptions(payment_status);
CREATE INDEX idx_adoptions_certificate_code ON adoptions(certificate_code);
```
✅ Ejecutar

---

## 🔧 Configurar Variables de Entorno

### 1. Copiar archivo de ejemplo
```bash
cp .env.example .env.local
```

### 2. Editar `.env.local` con tus valores
```env
# Desde Supabase dashboard
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_KEY=eyJ...

# Desde Stripe dashboard
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# URL de tu app
NEXT_PUBLIC_URL=http://localhost:3000
```

---

## 📊 Importar Datos (90 árboles)

### Comando
```bash
node scripts/seed-trees-supabase.js
```

### Resultado esperado
```
📖 Leyendo geojson-map.json...
🌳 Se encontraron 90 árboles
✅ Insertados 90/90 árboles...
🎉 ¡Éxito! Se importaron 90 árboles a Supabase
```

---

## ✅ Verificar que Funciona

### 1. Tabla `trees` tiene 90 filas
En Supabase → **Table Editor** → `trees`

```sql
SELECT COUNT(*) FROM trees;  -- Debe ser 90
```

### 2. Tabla `adoptions` está vacía (sin usuarios)
```sql
SELECT COUNT(*) FROM adoptions;  -- Debe ser 0 inicialmente
```

### 3. Test de compra en tu app
1. Ir a `http://localhost:3000/adopt/map`
2. Ver mapa con 90 árboles
3. Hacer checkout con tarjeta de prueba: `4242 4242 4242 4242`
4. Verificar que aparece en Supabase → `adoptions`

---

## 🔐 Configurar Webhook de Stripe

Este webhook es lo que hace que cuando alguien paga, se registre automáticamente en la base de datos.

### En Desarrollo Local (Con Stripe CLI)

```bash
# 1. Instalar Stripe CLI
brew install stripe/stripe-cli/stripe

# 2. Conectar tu cuenta
stripe login

# 3. Escuchar webhooks locales
stripe listen --forward-to http://localhost:3000/api/webhooks/stripe

# 4. Copiar el secret que aparece (que empieza con whsec_test_)
# Guardar en STRIPE_WEBHOOK_SECRET en .env.local
```

### En Producción (Vercel + Stripe)

1. Ir a https://dashboard.stripe.com/webhooks
2. Agregar nuevo endpoint:
   - URL: `https://tudominio.vercel.app/api/webhooks/stripe`
   - Eventos: `checkout.session.completed`
3. Copiar webhook secret
4. Agregar a variables de Vercel

---

## 🧪 Test Completo

```bash
# 1. Instalar dependencias (si es necesario)
npm install

# 2. Ejecutar en desarrollo
npm run dev

# 3. Importar árboles
node scripts/seed-trees-supabase.js

# 4. Abrir app
# http://localhost:3000/adopt/map

# 5. Buscar un árbol, hacer click "Adoptar"

# 6. Usar tarjeta Stripe de prueba
# 4242 4242 4242 4242
# Fecha: 12/25
# CVC: 123

# 7. Ver en Supabase que se creó la adopción
# Table Editor → adoptions
```

---

## 📋 Webhook Secret Proporcionado

```
SVIX_WEBHOOK_SECRET=whsec_XsIdux1bPSXwMsuoh3FmBCE7NVWL1u89
```

Este es para webhooks de Svix (si lo usas en el futuro). Por ahora úsalo para:
- Notificaciones
- Integración con terceros
- Sistemas de eventos

---

## 🎯 Flujo Completo

```
Usuario
   ↓
[/adopt/map] ← Ver mapa con 90 árboles
   ↓
[Selecciona árbol] ← Click en un árbol
   ↓
[Checkout Stripe] ← Paga con tarjeta
   ↓
[Webhook recibe pago] ← Stripe notifica a tu app
   ↓
[Se crea adoption en Supabase] ← Automático vía webhook
   ↓
[/dashboard] ← Usuario ve su adopción
   ↓
[🎉 Éxito!]
```

---

## 🚀 URL de Referencia

- 📖 Documentación Supabase: https://supabase.com/docs
- 💳 Stripe: https://stripe.com/docs
- 🔑 API Keys Stripe: https://dashboard.stripe.com/apikeys
- 🌐 Supabase Dashboard: https://supabase.com/dashboard

---

## 📞 Soporte Rápido

**Problema**: No aparecen los árboles en el mapa
```sql
-- Verificar
SELECT COUNT(*) FROM trees;
```

**Problema**: Adopción no se guarda después de pagar
```
1. Verificar en Supabase: ¿Llega el webhook?
2. Ver logs en Terminal: npm run dev
3. Verificar: ¿STRIPE_WEBHOOK_SECRET está correcto?
```

**Problema**: Error en .env
```bash
# Verificar
cat .env.local | grep SUPABASE
```

---

## ✨ ¡Listo para Implementar!

Una vez hayas:
1. ✅ Creado proyecto en Supabase
2. ✅ Ejecutado los scripts SQL
3. ✅ Configurado `.env.local`
4. ✅ Importado los 90 árboles
5. ✅ Configurado Stripe webhook

**Tu app está 100% lista para:**
- 🌳 Adoptar árboles
- 💳 Procesar pagos
- 📊 Ver adopciones en dashboard
- 📄 Generar certificados (próximo paso)

---

**Última actualización**: 2026-02-01
**Versión de la app**: 0.1.0
