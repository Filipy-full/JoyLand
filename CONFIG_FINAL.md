# ✅ Configuración Final - Supabase + Stripe

**Fecha:** 2026-02-01  
**Status:** ✅ Listo para usar

---

## 📝 Tu Schema Actual en Supabase

### Tabla: `adoptions` (Mejorada)

Tienes que ejecutar este SQL en Supabase para agregar los campos faltantes:

```sql
ALTER TABLE adoptions ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'adopted' CHECK (status IN ('available', 'adopted', 'reserved'));
ALTER TABLE adoptions ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'completed' CHECK (payment_status IN ('pending', 'completed', 'failed'));
ALTER TABLE adoptions ADD COLUMN IF NOT EXISTS start_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE adoptions ADD COLUMN IF NOT EXISTS end_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE adoptions ADD COLUMN IF NOT EXISTS stripe_session_id TEXT UNIQUE;
ALTER TABLE adoptions ADD COLUMN IF NOT EXISTS certificate_url TEXT;
ALTER TABLE adoptions ADD COLUMN IF NOT EXISTS certificate_code TEXT UNIQUE;
ALTER TABLE adoptions ADD COLUMN IF NOT EXISTS tree_name TEXT;
ALTER TABLE adoptions ADD COLUMN IF NOT EXISTS gift_message TEXT;

-- Llenar start_date y end_date para adopciones existentes
UPDATE adoptions SET 
  start_date = created_at,
  end_date = created_at + INTERVAL '1 year'
WHERE start_date IS NULL;

-- Activar RLS
ALTER TABLE adoptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Users can view own adoptions" ON adoptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert their adoptions" ON adoptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Crear índices
CREATE INDEX IF NOT EXISTS idx_adoptions_user_id ON adoptions(user_id);
CREATE INDEX IF NOT EXISTS idx_adoptions_payment_status ON adoptions(payment_status);
CREATE INDEX IF NOT EXISTS idx_adoptions_certificate_code ON adoptions(certificate_code);
```

✅ **Ejecuta esto en Supabase SQL Editor**

---

## 🔐 Credenciales Guardadas

```
.env.local actualizado con:
✅ NEXT_PUBLIC_SUPABASE_URL=https://hzajwfifjqdmryycufsp.supabase.co
✅ NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_ygQuZ_5njDgxEz-AXvYJsw_K-11fW69
✅ SUPABASE_SERVICE_KEY=sb_secret_cX5xvB95TodYut8gwtWK6A_jhGfUZta
```

---

## 📊 APIs Actualizados

### 1️⃣ `GET /api/user/adoptions`
```
Headers: Authorization: Bearer {token}
Returns: { adoptions: [...], count: number }

Campos devueltos:
- id, user_id, user_name, user_email, tree_id
- status, payment_status
- start_date, end_date
- certificate_code, certificate_url
- tree_name, gift_message
- created_at
```

### 2️⃣ `POST /api/webhooks/stripe`
```
Cuando se completa un checkout:
1. Crea adopción en Supabase
2. Genera certificate_code único
3. Calcula end_date (1 año después)
4. Guarda user_name, user_email

Eventos procesados:
- checkout.session.completed
```

---

## 🎯 Flujo Completo

```
1. Usuario va a /adopt/map
   ↓
2. Selecciona árbol y clickea "Adoptar"
   ↓
3. POST /api/create-checkout-session
   ↓
4. Redirect a Stripe Checkout
   ↓
5. Usuario paga (4242 4242 4242 4242 en test)
   ↓
6. Stripe envía webhook a /api/webhooks/stripe
   ↓
7. Se crea adopción en Supabase
   ↓
8. Usuario va a /dashboard
   ↓
9. Ve su adopción listada
```

---

## 🧪 Test End-to-End

### 1. Verificar que los campos existan

En Supabase → Table Editor → adoptions

Deberías ver todas estas columnas:
- ✅ id, user_id, user_name, user_email, tree_id
- ✅ status, payment_status
- ✅ start_date, end_date
- ✅ stripe_session_id, certificate_code, certificate_url
- ✅ tree_name, gift_message
- ✅ created_at

### 2. Test del API

```bash
# En terminal
curl http://localhost:3000/api/create-checkout-session \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "treeType": "almendro",
    "treeId": "tree_1",
    "userId": "123e4567-e89b-12d3-a456-426614174000",
    "userName": "Juan García",
    "userEmail": "juan@example.com"
  }'
```

Respuesta:
```json
{ "url": "https://checkout.stripe.com/pay/..." }
```

### 3. Test de Webhook (Stripe CLI)

```bash
# Terminal 1: Ejecutar app
npm run dev

# Terminal 2: Escuchar webhooks
stripe listen --forward-to http://localhost:3000/api/webhooks/stripe

# Terminal 3: Simular evento
stripe trigger checkout.session.completed
```

### 4. Verificar en Supabase

```sql
SELECT * FROM adoptions ORDER BY created_at DESC LIMIT 1;
```

Deberías ver los nuevos campos poblados:
- ✅ certificate_code (ej: JOY-2026-4521)
- ✅ payment_status = 'completed'
- ✅ start_date, end_date (1 año después)

---

## 🔧 Archivos Modificados

### APIs
- ✅ `/app/api/user/adoptions/route.ts` - Simplificado para tu schema
- ✅ `/app/api/webhooks/stripe/route.ts` - Con campos mejorados
- ✅ `/app/api/create-checkout-session/route.ts` - Sin cambios

### Componentes
- ✅ `/components/DashboardClient.tsx` - Actualizado para campos en snake_case

### Configuración
- ✅ `/lib/supabaseAdmin.ts` - Correctamente configurado
- ✅ `.env.local` - Con tus credenciales

---

## 📋 Checklist Final

- [ ] Ejecutar SQL en Supabase SQL Editor
- [ ] Verificar que los campos existan en tabla adoptions
- [ ] `.env.local` tiene las 3 credenciales
- [ ] Build exitoso: `npm run build`
- [ ] Ejecutar dev: `npm run dev`
- [ ] Test de checkout en `/adopt/map`
- [ ] Verificar adopción en Supabase table editor
- [ ] Ver adopción en `/dashboard`

---

## 🚀 Próximos Pasos (TODO)

### Fase 1: Generar PDF de Certificados
```typescript
// En /api/webhooks/stripe/route.ts
// Generar PDF con jsPDF o similar
// Guardar URL en certificate_url
// Enviar a usuario por email
```

### Fase 2: Sistema de Emails
```typescript
// Confirmación de adopción
// Recordatorio de renovación (30 días antes)
// Reporte anual del árbol
```

### Fase 3: Árboles en Supabase
```sql
-- Crear tabla trees con 90 árboles
CREATE TABLE trees (...)
-- Relacionar adoptions.tree_id con trees.id
```

---

## 🆘 Troubleshooting

**Error: "relation adoptions does not exist"**
→ Ejecuta el SQL para crear/actualizar tabla

**Error: "column status does not exist"**
→ Ejecuta el ALTER TABLE para agregar columnas

**Error: "auth.uid() is null"**
→ Asegúrate de estar autenticado en Supabase Auth

**Adopción no se guarda**
→ Verifica Stripe webhook secret en `.env.local`
→ Verifica que Stripe está enviando webhooks

---

## 📊 Datos de Referencia

### URLs
- 🌐 App: http://localhost:3000
- 🗄️  Supabase: https://supabase.com/dashboard
- 💳 Stripe: https://dashboard.stripe.com

### Credenciales
- 🔑 Supabase Service Key: `sb_secret_cX5xvB95TodYut8gwtWK6A_jhGfUZta`
- 🔑 Supabase Public Key: `sb_publishable_ygQuZ_5njDgxEz-AXvYJsw_K-11fW69`
- 🔗 Supabase URL: `https://hzajwfifjqdmryycufsp.supabase.co`

### Webhook
- 🔔 SVIX Secret: `whsec_XsIdux1bPSXwMsuoh3FmBCE7NVWL1u89`
- 🔌 Stripe Webhook: `whsec_Tb5eEJ7PS7b1L3iUfjvs2rrWeLOdMJ2k`

---

## ✨ Estado Actual

```
✅ APIs configurados
✅ Variables de entorno (.env.local)
✅ DashboardClient actualizado
✅ Supabase Admin configurado
✅ Stripe integrado

⏳ Pendiente:
  - Ejecutar SQL en Supabase
  - Verificar que campos existan
  - Testing end-to-end
  - PDF certificates (next)
  - Email system (next)
  - Trees table (next)
```

---

**Versión:** 0.1.0  
**Última actualización:** 2026-02-01  
**Status:** ✅ Configuración Completa - Listo para Testing
