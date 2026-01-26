# 🚀 Deploy Rápido en Vercel

## Paso 1: Conectar GitHub a Vercel (5 min)

1. Ve a https://vercel.com
2. "Add New Project"
3. Importa `Filipy-full/JoyLand`

## Paso 2: Base de Datos en Vercel (3 min)

1. En tu proyecto Vercel → "Storage" → "Create Database"
2. Selecciona "Postgres"
3. Copia el `DATABASE_URL` automáticamente

## Paso 3: Variables de Entorno (3 min)

En Vercel → Settings → Environment Variables:

```env
# Ya copiada automáticamente si usas Vercel Postgres
DATABASE_URL=postgres://...

# Necesitas obtener de Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# URL de tu sitio (después del primer deploy)
NEXT_PUBLIC_URL=https://joyland.vercel.app

# Webhook (agregar después del primer deploy)
STRIPE_WEBHOOK_SECRET=whsec_...
```

## Paso 4: Actualizar Prisma Schema

Cambia en `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"  // Cambiado de "sqlite"
}
```

Commit y push:
```bash
git add prisma/schema.prisma
git commit -m "chore: cambiar a PostgreSQL para producción"
git push
```

## Paso 5: Deploy! 🎉

Vercel hará deploy automáticamente cuando hagas push.

## Paso 6: Configurar Stripe Webhook

1. Ve a https://dashboard.stripe.com/webhooks
2. "Add endpoint"
3. URL: `https://tu-dominio.vercel.app/api/webhooks/stripe`
4. Evento: `checkout.session.completed`
5. Copia el webhook secret
6. Agrégalo en Vercel → Environment Variables

## Paso 7: Agregar Árboles a la BD

Desde Vercel → tu proyecto → Storage → Postgres → Data:
Ejecuta SQL:

```sql
INSERT INTO "Tree" (id, name, type, lat, lng, status) VALUES
('1', 'Olivo Centenario Aurora', 'olive', 42.8234, -5.5234, 'available'),
('2', 'Olivo de la Colina', 'olive', 42.8156, -5.5401, 'available'),
('3', 'Almendro Primavera', 'almond', 42.8289, -5.5178, 'available');
```

## ✅ Listo!

Tu sitio estará en: `https://joyland.vercel.app` (o el dominio que elijas)

## 🔍 Verificar

1. Visita tu sitio
2. Prueba el mapa (debe mostrar árboles)
3. Prueba checkout con tarjeta de test: `4242 4242 4242 4242`
4. Verifica webhook en Stripe

---

**Tiempo total: ~15-20 minutos** ⏱️
