# 🗄️ Migración a Supabase - Configuración Completa

## 1. Variables de Entorno Necesarias

Agrega estas variables a tu `.env.local`:

```env
# Base
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
SUPABASE_SERVICE_KEY=tu_service_role_key

# Stripe
STRIPE_SECRET_KEY=tu_stripe_secret
STRIPE_PUBLISHABLE_KEY=tu_stripe_publishable
STRIPE_WEBHOOK_SECRET=tu_stripe_webhook_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=tu_stripe_publishable

# Svix (para webhooks)
SVIX_WEBHOOK_SECRET=whsec_XsIdux1bPSXwMsuoh3FmBCE7NVWL1u89
```

---

## 2. Crear Tablas en Supabase

Accede a tu panel de Supabase y ejecuta este SQL en el SQL Editor:

### Tabla: users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- RLS Policy
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);
```

### Tabla: trees
```sql
CREATE TABLE trees (
  id TEXT PRIMARY KEY,
  name TEXT,
  type TEXT CHECK (type IN ('olive', 'almond')),
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'adopted', 'reserved')),
  description TEXT,
  yearly_report TEXT,
  images TEXT, -- JSON array
  videos TEXT, -- JSON array
  latitude FLOAT,
  longitude FLOAT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para búsquedas rápidas
CREATE INDEX idx_trees_status ON trees(status);
CREATE INDEX idx_trees_type ON trees(type);
CREATE INDEX idx_trees_location ON trees(latitude, longitude);
```

### Tabla: adoptions (Principal)
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

-- RLS Policies
ALTER TABLE adoptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own adoptions" ON adoptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their adoptions" ON adoptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Índices
CREATE INDEX idx_adoptions_user_id ON adoptions(user_id);
CREATE INDEX idx_adoptions_tree_id ON adoptions(tree_id);
CREATE INDEX idx_adoptions_payment_status ON adoptions(payment_status);
CREATE INDEX idx_adoptions_certificate_code ON adoptions(certificate_code);
```

### Tabla: certificates (Opcional pero recomendado)
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

---

## 3. Actualizar APIs para usar Supabase

### Actualizar `/api/user/adoptions`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.slice(7)
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)

    if (error || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Obtener adopciones de Supabase
    const { data: adoptions, error: queryError } = await supabaseAdmin
      .from('adoptions')
      .select(`
        id,
        user_id,
        tree_id,
        status,
        payment_status,
        start_date,
        end_date,
        certificate_code,
        certificate_url,
        tree_name,
        gift_message,
        created_at,
        trees(id, name, type, status, latitude, longitude)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (queryError) throw queryError

    return NextResponse.json({
      adoptions: adoptions || [],
      count: adoptions?.length || 0,
    })
  } catch (error: any) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
```

### Actualizar Webhook de Stripe (`/api/webhooks/stripe/route.ts`):

```typescript
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-01-28.clover'
})

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature')
  const buf = await req.arrayBuffer()
  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      Buffer.from(buf),
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    
    const userId = session.metadata?.userId
    const treeId = session.metadata?.treeId
    const userName = session.metadata?.userName
    const userEmail = session.metadata?.userEmail

    if (userId && treeId) {
      try {
        // Crear adopción en Supabase
        const { data: adoption, error: adoptionError } = await supabaseAdmin
          .from('adoptions')
          .insert({
            user_id: userId,
            tree_id: treeId,
            status: 'adopted',
            payment_status: 'completed',
            stripe_session_id: session.id,
            start_date: new Date().toISOString(),
            end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          })
          .select()

        if (adoptionError) throw adoptionError

        // Actualizar estado del árbol a adoptado
        await supabaseAdmin
          .from('trees')
          .update({ status: 'adopted' })
          .eq('id', treeId)

        // TODO: Generar certificado PDF
        // TODO: Enviar email de confirmación

        console.log('Adoption created:', adoption)
      } catch (error) {
        console.error('Error creating adoption:', error)
        return NextResponse.json({ error: 'Failed to process adoption' }, { status: 500 })
      }
    }
  }

  return NextResponse.json({ received: true })
}
```

### Crear API para Crear Checkout (`/api/create-checkout-session/route.ts`):

```typescript
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
  try {
    const { treeType, treeId, userId, userName, userEmail } = await req.json()

    let unit_amount = 0
    if (treeType === 'almendro') unit_amount = 12500 // €125
    else if (treeType === 'olivo') unit_amount = 17500 // €175
    else unit_amount = 10000

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Adopción de árbol #${treeId || treeType}`,
            },
            unit_amount,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_URL}/adopt/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/adopt`,
      metadata: {
        userId: userId || '',
        userName: userName || '',
        userEmail: userEmail || '',
        treeId: treeId || '',
        treeType: treeType || '',
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error('Stripe error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
```

---

## 4. Configuración de Supabase Admin (Actualizar `/lib/supabaseAdmin.ts`)

```typescript
import { createClient } from '@supabase/supabase-js'

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)
```

---

## 5. Datos de Árb oles en Supabase

### Insertar los 90 árboles desde el GeoJSON:

```typescript
// Script para ejecutar una sola vez

import { supabaseAdmin } from '@/lib/supabaseAdmin'

async function seedTrees() {
  const geojson = await fetch('/geojson-map.json').then(r => r.json())
  
  const trees = geojson.features
    .filter((f: any) => f.properties.type === 'tree')
    .map((f: any) => ({
      id: f.id,
      name: f.properties.name,
      type: f.properties.species === 'Oliveira' ? 'olive' : 'almond',
      status: 'available',
      description: `${f.properties.species} tree in ${f.properties.area}`,
      latitude: f.geometry.coordinates[1],
      longitude: f.geometry.coordinates[0],
    }))

  const { error } = await supabaseAdmin.from('trees').insert(trees)
  
  if (error) {
    console.error('Error seeding trees:', error)
  } else {
    console.log('Trees seeded successfully!')
  }
}

seedTrees()
```

---

## 6. Configurar Webhook en Stripe

1. Accede a https://dashboard.stripe.com/webhooks
2. Crea un nuevo endpoint:
   - URL: `https://tudominio.com/api/webhooks/stripe`
   - Eventos: `checkout.session.completed`
3. Copia el webhook secret y agrégalo a `.env.local`

---

## 7. Hooks y Configuración de Supabase (Opcional)

### Crear un trigger para actualizar `updated_at`:

```sql
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trees_updated_at
BEFORE UPDATE ON trees
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_adoptions_updated_at
BEFORE UPDATE ON adoptions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

---

## 8. Ventajas de usar Supabase

✅ **Autenticación integrada** - Ya está en Supabase
✅ **Base de datos PostgreSQL** - Más potente que SQLite
✅ **Row Level Security** - Control de acceso automático
✅ **Realtime** - Suscripciones en tiempo real (opcional)
✅ **Storage** - Para guardar certificados PDF
✅ **Backups automáticos** - Seguridad de datos
✅ **APIs REST y GraphQL** - Sin necesidad de servidor adicional
✅ **Webhooks integrados** - Para eventos como confirmaciones

---

## 9. Checklist de Migración

- [ ] Crear tablas en Supabase
- [ ] Configurar RLS policies
- [ ] Actualizar `.env.local` con credenciales
- [ ] Actualizar APIs para usar Supabase
- [ ] Migrar datos de árboles
- [ ] Configurar webhook de Stripe
- [ ] Probar checkout y webhook
- [ ] Actualizar dashboard para usar datos de Supabase
- [ ] Eliminar dependencia de Prisma/SQLite

---

## 10. Comandos Útiles

```bash
# Ver datos de la tabla
SELECT * FROM adoptions ORDER BY created_at DESC;

# Contar adopciones por árbol
SELECT tree_id, COUNT(*) as count FROM adoptions GROUP BY tree_id;

# Ver árboles disponibles
SELECT * FROM trees WHERE status = 'available';

# Limpiar datos de prueba
DELETE FROM adoptions WHERE created_at < NOW() - INTERVAL '7 days';
```

---

**Webhook Secret Proporcionado:** `whsec_XsIdux1bPSXwMsuoh3FmBCE7NVWL1u89`

Este es tu Svix webhook secret. Úsalo para validar webhooks de Svix en tus APIs.
