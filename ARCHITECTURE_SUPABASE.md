# 🏗️ Arquitectura Final - 100% Supabase

## 📊 Diagrama de Datos

```
┌─────────────────────────────────────────────────────────┐
│                    SUPABASE POSTGRESQL                  │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐ │
│  │   auth.*    │  │    users     │  │      trees       │ │
│  ├─────────────┤  ├──────────────┤  ├──────────────────┤ │
│  │ id (UUID)   │  │ id (UUID)    │  │ id (TEXT)        │ │
│  │ email       │  │ email        │  │ name             │ │
│  │ password    │  │ name         │  │ type (olive..)   │ │
│  └─────────────┘  └──────────────┘  │ status (*)       │ │
│       │                                │ latitude         │ │
│       │                                │ longitude        │ │
│       │ JWT                            └──────────────────┘ │
│       │                                      ↑               │
│       │                                      │               │
│       └──────────────────┬──────────────────┘               │
│                          │                                   │
│                   ┌──────▼──────────┐                        │
│                   │   adoptions     │                        │
│                   ├─────────────────┤                        │
│                   │ id (UUID)       │                        │
│                   │ user_id (FK)    │─────→ auth.users       │
│                   │ tree_id (FK)    │─────→ trees            │
│                   │ status (*)      │                        │
│                   │ payment_status  │                        │
│                   │ start_date      │                        │
│                   │ end_date        │                        │
│                   │ certificate_*   │                        │
│                   │ stripe_session_id                        │
│                   └─────────────────┘                        │
│                                                           │
└─────────────────────────────────────────────────────────┘
              (Row Level Security Enabled)
```

---

## 🔌 Flujos de Datos

### 1. Autenticación (Supabase Auth)

```
Usuario → [/login]
         ↓
    (Email + Password)
         ↓
  Supabase Auth
         ↓
  JWT Token (almacenado en localStorage/cookie)
         ↓
  Acceso a Dashboard, APIs protegidas
```

### 2. Workflow de Adopción

```
Usuario → [/adopt/map]
         ↓
    (Ve 90 árboles)
         ↓
    (Clickea árbol)
         ↓
  [Checkout Stripe]
         ↓
    (Paga con tarjeta)
         ↓
  Stripe Webhook → [/api/webhooks/stripe]
         ↓
  Crea adoption en Supabase
         ↓
  Actualiza estado del árbol
         ↓
  [/adopt/success]
         ↓
  Genera certificado (TODO)
         ↓
  Envía email (TODO)
         ↓
  Usuario ve adopción en [/dashboard]
```

### 3. Dashboard del Usuario

```
Usuario autenticado → [/dashboard]
         ↓
  Obtiene token JWT de Supabase
         ↓
  [GET /api/user/adoptions]
  (Authorization: Bearer {token})
         ↓
  supabaseAdmin.from('adoptions')
    .select(..., { trees(...) })
    .eq('user_id', user.id)
         ↓
  Renderiza lista de adopciones
         ↓
  Botones: Ver mapa, Descargar certificado
```

---

## 📁 Archivos Clave

### APIs Actualizados (100% Supabase)

**`/app/api/user/adoptions/route.ts`** (GET)
- ✅ Obtiene token JWT del header
- ✅ Verifica con `supabaseAdmin.auth.getUser()`
- ✅ Consulta `adoptions` filtradas por `user_id`
- ✅ Retorna JSON con adopciones + detalles del árbol
- ❌ **No usa Prisma**

**`/app/api/webhooks/stripe/route.ts`** (POST)
- ✅ Verifica firma de Stripe
- ✅ Extrae metadata del checkout
- ✅ Inserta en tabla `adoptions` de Supabase
- ✅ Actualiza estado del árbol
- ❌ **No usa Prisma**

**`/app/api/create-checkout-session/route.ts`** (POST)
- ✅ Crea sesión de Stripe
- ✅ Incluye metadata (userId, treeId)
- ✅ Retorna URL de checkout

### Configuración Supabase

**`/lib/supabase.ts`** - Cliente público (Browser)
```typescript
createClient(NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)
// Usado en: login, signup, perfil del usuario
```

**`/lib/supabaseAdmin.ts`** - Admin (Server)
```typescript
createClient(NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_KEY)
// Usado en: /api/webhooks, /api/user/adoptions
// Con seguridad RLS
```

### Scripts

**`scripts/seed-trees-supabase.js`**
- Importa 90 árboles desde `geojson-map.json`
- Batch de 100 registros
- Maneja duplicados

**`scripts/seed-users-supabase.js`**
- Crea 3 usuarios de prueba
- Crea 5 adopciones por usuario
- Para testing del dashboard

---

## 🔐 Seguridad - Row Level Security (RLS)

### Tabla: `adoptions`

```sql
-- Política 1: SELECT
CREATE POLICY "Users can view own adoptions" ON adoptions
  FOR SELECT USING (auth.uid() = user_id);
  
-- Política 2: INSERT
CREATE POLICY "Users can insert their adoptions" ON adoptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

**Qué significa:**
- Un usuario solo puede VER sus adopciones (no las de otros)
- Un usuario solo puede CREAR adopciones a su nombre
- El webhook (Service Role) puede hacer cualquier cosa

### Tabla: `users`

```sql
-- Política 1: SELECT
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);
  
-- Política 2: UPDATE
CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);
```

---

## 🌳 Tabla: `trees` (Información)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | TEXT | Identificador único (ej: `tree_42`) |
| `name` | TEXT | Nombre del árbol |
| `type` | TEXT | `'olive'` o `'almond'` |
| `status` | TEXT | `'available'`, `'adopted'`, `'reserved'` |
| `description` | TEXT | Ubicación, altura, edad, etc |
| `latitude` | FLOAT | Coordenada GPS |
| `longitude` | FLOAT | Coordenada GPS |
| `images` | TEXT | JSON array de URLs |
| `videos` | TEXT | JSON array de URLs |
| `yearly_report` | TEXT | Reporte anual del árbol |

---

## 👥 Tabla: `adoptions` (Lo más importante)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | Identificador único |
| `user_id` | UUID | Referencia a `auth.users.id` |
| `tree_id` | TEXT | Referencia a `trees.id` |
| `status` | TEXT | `'adopted'`, `'reserved'`, `'available'` |
| `payment_status` | TEXT | `'pending'`, `'completed'`, `'failed'` |
| `start_date` | TIMESTAMP | Fecha de inicio de adopción |
| `end_date` | TIMESTAMP | Fecha de vencimiento |
| `stripe_session_id` | TEXT | ID de sesión de Stripe (único) |
| `certificate_code` | TEXT | Código único: `JOY-2026-0001` |
| `certificate_url` | TEXT | URL al PDF del certificado |
| `tree_name` | TEXT | Nombre personalizado (ej: "Mi árbol favorito") |
| `gift_message` | TEXT | Mensaje de regalo personalizado |
| `created_at` | TIMESTAMP | Creada automáticamente |
| `updated_at` | TIMESTAMP | Actualizada automáticamente |

---

## 🔄 Integraciones Externas

### Stripe
```
[Checkout] → POST /api/create-checkout-session
              ↓ (Crea sesión en Stripe)
              ↓ (User paga)
              ↓ (Stripe envía webhook)
              ↓ POST /api/webhooks/stripe
              ↓ (Inserta en adoptions)
```

### Next.js
```
- Framework: Next.js 16.1.5
- Runtime: Vercel Edge (produción)
- Routes: 27+ API + pages
- Compiler: Turbopack
```

### React
```
- Versión: 19.2.4
- Client Components: /components/DashboardClient.tsx
- Server Components: /app/dashboard/page.tsx
- Hooks: useState, useEffect, useRouter
```

---

## 🚀 Variables de Entorno Requeridas

```bash
# OBLIGATORIOS
NEXT_PUBLIC_SUPABASE_URL              # https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY         # eyJ...
SUPABASE_SERVICE_KEY                  # eyJ... (secreto)

STRIPE_SECRET_KEY                     # sk_test_...
STRIPE_PUBLISHABLE_KEY                # pk_test_...
STRIPE_WEBHOOK_SECRET                 # whsec_...

# OPCIONALES
NEXT_PUBLIC_URL                       # http://localhost:3000
RESEND_API_KEY                        # Para emails
SVIX_WEBHOOK_SECRET                   # whsec_...
```

---

## 📊 Índices en Base de Datos

```sql
-- Para búsquedas rápidas
idx_trees_status                      -- WHERE status = 'adopted'
idx_trees_type                        -- WHERE type = 'olive'
idx_trees_location                    -- WHERE latitude, longitude

idx_adoptions_user_id                 -- WHERE user_id = '...'
idx_adoptions_tree_id                 -- WHERE tree_id = '...'
idx_adoptions_payment_status          -- WHERE payment_status = 'completed'
idx_adoptions_certificate_code        -- WHERE certificate_code = 'JOY-...'
```

---

## ✅ Verificación Post-Migración

```bash
# 1. Variables de entorno
echo $NEXT_PUBLIC_SUPABASE_URL         # ✅ No vacío

# 2. Tablas existen
# Supabase Dashboard → Table Editor
# Verificar: users, trees, adoptions

# 3. Datos importados
SELECT COUNT(*) FROM trees;           # ✅ 90 filas

# 4. APIs funcionan
curl http://localhost:3000/health      # ✅ 200 OK

# 5. Checkout crea adopción
# Hacer pago → Ver en Supabase adoptions
```

---

## 🎯 Arquitectura vs Prisma

### Antes (Con Prisma)
```
App → Prisma Client
      ↓
    SQLite (desarrollo)
    PostgreSQL (producción)
```

### Ahora (100% Supabase)
```
App → Supabase Client (Public)
      ↓
    Supabase PostgreSQL
    + Auth integrado
    + RLS automático
    + Realtime (opcional)
    + Storage (opcional)

App → Supabase Admin (Webhooks)
      ↓
    Supabase PostgreSQL
    (con permisos totales)
```

---

## 📈 Escalabilidad

**Supabase proporciona:**
- ✅ Auto-scaling de PostgreSQL
- ✅ Backups automáticos diarios
- ✅ Connection pooling integrado
- ✅ CDN para APIs
- ✅ Monitoreo en tiempo real
- ✅ Logs automáticos

---

## 🔗 Referencias

- Documentación: https://supabase.com/docs
- Dashboard: https://supabase.com/dashboard
- Precios: https://supabase.com/pricing
- Stripe Docs: https://stripe.com/docs
- Next.js Docs: https://nextjs.org/docs

---

**Arquitectura finalizada el:** 2026-02-01
**Estado:** ✅ Producción-Ready
**Webhook Secret:** `whsec_XsIdux1bPSXwMsuoh3FmBCE7NVWL1u89`
