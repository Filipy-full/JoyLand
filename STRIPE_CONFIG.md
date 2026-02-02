# 💳 Configuración de Stripe - JoyLand

## ✅ Estado Actual

Stripe está configurado en **modo TEST** (pruebas).

### 🔑 Variables de Entorno Configuradas

```env
STRIPE_SECRET_KEY=sk_test_51RI9TZ04NdoWdL8S...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51RI9TZ04NdoWdL8S...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## 🚀 Cómo Usar Stripe en Desarrollo

### 1. Iniciar el Servidor
```bash
npm run dev
```

### 2. Configurar Webhook (Opcional para desarrollo)

En una terminal separada:
```bash
./stripe-webhook.sh
```

O manualmente:
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Esto generará un `webhook secret` que debes copiar a `.env.local`.

## 🧪 Probar Pagos

### Tarjetas de Prueba de Stripe

| Tipo | Número | Resultado |
|------|--------|-----------|
| **Éxito** | `4242 4242 4242 4242` | Pago exitoso |
| **Requiere 3D Secure** | `4000 0027 6000 3184` | Requiere autenticación |
| **Rechazada** | `4000 0000 0000 0002` | Tarjeta rechazada |
| **Fondos insuficientes** | `4000 0000 0000 9995` | Fondos insuficientes |

- **CVV**: Cualquier 3 dígitos (ej: `123`)
- **Fecha**: Cualquier fecha futura (ej: `12/34`)
- **ZIP**: Cualquier código postal (ej: `12345`)

## 📍 Endpoints de la API

### 1. Crear Sesión de Checkout
```
POST /api/create-checkout-session
```

**Body:**
```json
{
  "treeType": "olivo",
  "treeId": "abc123",
  "treeName": "Árbol #1",
  "userId": "user_id",
  "userName": "Juan",
  "userEmail": "juan@example.com"
}
```

**Response:**
```json
{
  "url": "https://checkout.stripe.com/..."
}
```

### 2. Webhook de Stripe
```
POST /api/webhooks/stripe
```

Recibe eventos de Stripe:
- ✅ `checkout.session.completed` - Pago completado
  - Crea adopción en DB
  - Actualiza status del árbol a "adopted"
  - Genera código de certificado

## 🔄 Flujo de Adopción

```
Usuario clickea "Adoptar" 
    ↓
POST /api/create-checkout-session
    ↓
Stripe Checkout (pago)
    ↓
Webhook: checkout.session.completed
    ↓
Se crea registro en tabla "adoptions"
    ↓
Se actualiza árbol a status "adopted"
    ↓
Usuario ve éxito en /adopt/success
```

## 🛡️ Seguridad Implementada

- ✅ Validación de árbol disponible antes de crear checkout
- ✅ No permite adoptar árboles ya adoptados
- ✅ Verificación de firma de webhook
- ✅ Claves secretas en variables de entorno (no en código)

## 🌐 Producción

Para usar en producción:

1. **Obtén claves de producción** en Stripe Dashboard
2. **Actualiza `.env.local`** (o variables en Vercel):
   ```env
   STRIPE_SECRET_KEY=sk_live_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
   ```

3. **Configura webhook en Stripe Dashboard**:
   - URL: `https://tu-dominio.com/api/webhooks/stripe`
   - Eventos: `checkout.session.completed`
   - Copia el signing secret a `STRIPE_WEBHOOK_SECRET`

## 📊 Dashboard de Stripe

- **Test Mode**: https://dashboard.stripe.com/test/dashboard
- **Pagos**: https://dashboard.stripe.com/test/payments
- **Webhooks**: https://dashboard.stripe.com/test/webhooks

## 🐛 Debugging

### Ver logs del webhook:
```bash
stripe logs tail
```

### Probar webhook manualmente:
```bash
stripe trigger checkout.session.completed
```

### Ver eventos:
```bash
stripe events list
```

## ⚠️ Importante

- **NO** compartas tus claves secretas públicamente
- **NO** commits `.env.local` al repositorio
- **Revoca** claves comprometidas inmediatamente en Stripe Dashboard
- Usa **diferentes claves** para desarrollo y producción

## 📚 Recursos

- [Stripe Docs](https://stripe.com/docs)
- [Testing Cards](https://stripe.com/docs/testing)
- [Webhooks Guide](https://stripe.com/docs/webhooks)
- [Stripe CLI](https://stripe.com/docs/stripe-cli)
