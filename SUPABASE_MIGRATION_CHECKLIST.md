# ✅ Checklist de Migración a Supabase

## Fase 1: Preparación (Antes de Empezar)

- [ ] **Crear proyecto en Supabase**
  - Ir a https://supabase.com
  - Crear nuevo proyecto
  - Guardar: `Project URL` y `Service Role Key`

- [ ] **Configurar variables de entorno**
  ```bash
  # Copiar .env.example a .env.local
  cp .env.example .env.local
  
  # Editar y agregar:
  NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
  NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJ..."
  SUPABASE_SERVICE_KEY="eyJ..."
  ```

- [ ] **Webhook secret de Stripe**
  ```
  STRIPE_WEBHOOK_SECRET=whsec_...
  ```

---

## Fase 2: Crear Tablas en Supabase

### Paso 1: Ir a SQL Editor en Supabase

1. Dashboard → SQL Editor
2. Crear nueva query
3. Copiar y ejecutar cada script de abajo

### Paso 2: Crear tabla `users`

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

- [ ] Ejecutar tabla `users`

### Paso 3: Crear tabla `trees`

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

- [ ] Ejecutar tabla `trees`

### Paso 4: Crear tabla `adoptions`

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

- [ ] Ejecutar tabla `adoptions`

### Paso 5: Crear tabla `certificates` (Opcional)

```sql
CREATE TABLE certificates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  adoption_id UUID NOT NULL REFERENCES adoptions(id),
  code TEXT UNIQUE NOT NULL,
  pdf_url TEXT,
  issued_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP
);

CREATE INDEX idx_certificates_code ON certificates(code);
```

- [ ] Ejecutar tabla `certificates` (si es necesario)

---

## Fase 3: Importar Datos

### Importar Árboles (90 árboles desde GeoJSON)

```bash
# Ejecutar desde la raíz del proyecto
node scripts/seed-trees-supabase.js
```

Deberías ver:
```
📖 Leyendo geojson-map.json...
🌳 Se encontraron 90 árboles
✅ Insertados 90/90 árboles...
🎉 ¡Éxito! Se importaron 90 árboles a Supabase
```

- [ ] Importar árboles ✅

### Crear Usuarios de Prueba (Opcional)

```bash
node scripts/seed-users-supabase.js
```

Esto crea 3 usuarios con adopciones de ejemplo:
- juan@example.com
- maria@example.com
- carlos@example.com

- [ ] Crear usuarios de prueba (opcional)

---

## Fase 4: Verificar APIs

### Test 1: Verificar tabla trees

```bash
# En Supabase Dashboard → Table Editor
# Deberías ver 90 filas
SELECT COUNT(*) FROM trees;  -- Debe retornar 90
```

- [ ] Verificar 90 árboles importados

### Test 2: Verificar tabla adoptions (después de payment)

```bash
# Después de hacer un checkout
SELECT * FROM adoptions ORDER BY created_at DESC;
```

- [ ] Al menos 1 adopción en la tabla

### Test 3: Verificar API /api/user/adoptions

```bash
# Con token JWT válido de un usuario autenticado
curl -H "Authorization: Bearer <token_jwt>" \
  http://localhost:3000/api/user/adoptions
```

Deberías ver:
```json
{
  "adoptions": [...],
  "count": 0
}
```

- [ ] API retorna adopciones del usuario

---

## Fase 5: Configurar Webhook de Stripe

### En Stripe Dashboard

1. Ir a https://dashboard.stripe.com/webhooks
2. Crear nuevo endpoint:
   - **URL**: `https://tudominio.com/api/webhooks/stripe`
   - **Eventos**:
     - `checkout.session.completed`
     - `payment_intent.succeeded` (opcional)

3. Copiar el webhook secret
4. Agregar a `.env.local`:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_XXX...
   ```

### En Desarrollo Local (Stripe CLI)

```bash
# Instalar Stripe CLI si no lo tienes
brew install stripe/stripe-cli/stripe

# Conectar con tu cuenta
stripe login

# Escuchar webhooks locales
stripe listen --forward-to http://localhost:3000/api/webhooks/stripe

# Copiar el webhook secret que aparece
# STRIPE_WEBHOOK_SECRET=whsec_test_...
```

- [ ] Webhook secret configurado
- [ ] Stripe CLI escuchando (si es en desarrollo)

---

## Fase 6: Testing End-to-End

### Test Completo de Adopción

1. **Ir a `/adopt/map`**
   - [ ] Ver mapa con 90 árboles
   - [ ] Clickear en un árbol
   - [ ] Ver panel de información

2. **Iniciar checkout**
   - [ ] Clickear botón "Adoptar"
   - [ ] Ir a Stripe checkout
   - [ ] Usar tarjeta de prueba: `4242 4242 4242 4242`
   - [ ] Completar compra

3. **Verificar en Supabase**
   - [ ] Nueva fila en `adoptions` (si webhook funcionó)
   - [ ] Estado del árbol cambió a `adopted`
   - [ ] `payment_status = completed`

4. **Verificar en Dashboard**
   - [ ] Ir a `/dashboard`
   - [ ] Ver adopción listada
   - [ ] Ver certificate code
   - [ ] Ver fecha de renovación

- [ ] Adopción completa registrada
- [ ] Dashboard muestra adopción
- [ ] Webhook procesó correctamente

---

## Fase 7: Limpiar Prisma (Opcional)

Si quieres eliminar completamente Prisma:

```bash
# 1. Eliminar archivos
rm -rf prisma/
rm -f .env.local | grep -v DATABASE_URL

# 2. Desinstalar Prisma
npm uninstall @prisma/client prisma

# 3. Limpiar cualquier referencia a Prisma en el código
```

**NOTA**: Ya está hecho en los archivos:
- ✅ `/app/api/user/adoptions/route.ts` - Solo Supabase
- ✅ `/app/api/webhooks/stripe/route.ts` - Solo Supabase

---

## Fase 8: Configuración de Producción

### Paso 1: Deploy a Vercel

1. Conectar repositorio a Vercel
2. Agregar variables de entorno:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   SUPABASE_SERVICE_KEY=eyJ...
   STRIPE_SECRET_KEY=sk_live_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
   ```

3. Deploy

- [ ] Variables configuradas en Vercel
- [ ] Build exitoso
- [ ] APIs funcionando en producción

### Paso 2: Actualizar URL de Webhook en Stripe

```bash
# En https://dashboard.stripe.com/webhooks
# Cambiar URL a: https://tudominio.vercel.app/api/webhooks/stripe
```

- [ ] URL de webhook actualizada

---

## 🎉 ¡Listo!

Tu aplicación ahora usa **100% Supabase** para:

✅ Autenticación  
✅ Base de datos (árboles, adopciones)  
✅ Row Level Security (privacidad de datos)  
✅ APIs con Supabase client  
✅ Webhooks de Stripe → Supabase  

**Próximos pasos:**
- 📄 Implementar generación de PDF de certificados
- 📧 Configurar emails de confirmación
- 🔔 Crear sistema de notificaciones
- 📊 Crear dashboard de estadísticas

---

## 🆘 Troubleshooting

### Error: "NEXT_PUBLIC_SUPABASE_URL not configured"
```bash
# Solución: Verificar .env.local
cat .env.local | grep SUPABASE
```

### Error: "Row Level Security policy violation"
```
# Solución: Verificar que el usuario esté autenticado
# y que tenga permisos en la tabla
```

### Error: "Foreign key constraint failed"
```
# Solución: Asegurar que tree_id existe en la tabla trees
SELECT * FROM trees WHERE id = 'tree_1';
```

### Los árboles no aparecen en el mapa
```
# Solución: Verificar que la tabla trees esté poblada
SELECT COUNT(*) FROM trees;
```

---

**Webhook Secret proporcionado:**
```
SVIX_WEBHOOK_SECRET=whsec_XsIdux1bPSXwMsuoh3FmBCE7NVWL1u89
```

Este es tu secret de Svix. Úsalo para webhooks de terceros que uses en el futuro.
