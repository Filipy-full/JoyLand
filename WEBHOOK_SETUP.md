# 🔗 Configuración del Webhook de Stripe para Desarrollo Local

## Problema
Los pagos se completan en Stripe, pero el webhook no se ejecuta en localhost, por lo que los árboles no se marcan como adoptados en la base de datos.

## Solución: Usar Stripe CLI

### Paso 1: Instalar Stripe CLI
```bash
# En tu máquina host (no en el contenedor)
brew install stripe/stripe-cli/stripe  # En Mac
# o en Linux:
wget -q https://files.stripe.com/stripe-cli/releases/latest/linux/stripe_linux_x86_64.tar.gz -O stripe.tar.gz && tar -zxf stripe.tar.gz
```

### Paso 2: Autentica Stripe CLI
```bash
stripe login
# Esto abrirá tu navegador para autenticarte
# Copia el código que te da
```

### Paso 3: Redirigir Webhooks a tu Máquina Local

En una terminal separada de tu máquina host:

```bash
stripe listen --forward-to http://localhost:3000/api/webhooks/stripe
```

Esto mostrará tu webhook signing secret. **Cópialo y actualiza el `.env.local`:**

```
STRIPE_WEBHOOK_SECRET=whsec_[tu_nuevo_secret_aqui]
```

### Paso 4: Probar el Flujo Completo

1. **Haz clic en un árbol en el mapa**
2. **Haz clic en "Agregar al Carrito"**
3. **Ve al checkout y completa el formulario**
4. **Usa estas tarjetas de prueba:**
   - **Éxito**: `4242 4242 4242 4242`
   - **Requiere confirmación**: `4000 0025 0000 3155`
   - **Declina**: `4000 0000 0000 0002`

5. **Expiry**: `12/25` (cualquier mes/año futuro)
6. **CVC**: `123` (cualquier número)

### Paso 5: Monitorear los Logs

En tu terminal con `stripe listen`, verás:

```
🔔 Webhook received!
📌 Processing event type: checkout.session.completed
💳 Session data: {...}
🌳 Processing trees: {...}
✅ Adoption inserted for tree [id]
✅ Tree [id] status updated to adopted
```

En tu terminal de `npm run dev`, verás:

```
POST /api/webhooks/stripe 200 in XXms
```

### Paso 6: Verificar en Supabase

Ve a tu **Dashboard de Supabase** → **Tables** → **adoptions**

Deberías ver nuevos registros con:
- `tree_id`: ID del árbol
- `status`: `adopted`
- `certificate_code`: Código único
- `user_name`: Tu nombre
- `user_email`: Tu email

## Alternativa: Usar Dashboard de Stripe (Sin CLI)

Si no quieres instalar Stripe CLI, puedes:

1. Ir a [Stripe Dashboard](https://dashboard.stripe.com/test/payments)
2. Ver el pago completado
3. **Manualmente crear adoptions en Supabase**

Pero esto NO es recomendado porque el webhook es crítico para la automatización.

## Variables de Entorno Necesarias

```env
# Stripe
STRIPE_SECRET_KEY=sk_test_YOUR_KEY_HERE
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_[TU_SECRET_DEL_CLI]  # ← Reemplazar con el del CLI

# Supabase
SUPABASE_SERVICE_KEY=sb_secret_YOUR_KEY_HERE
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_ygQuZ_5njDgxEz-AXvYJsw_K-11fW69
```

## Debugging

Si algo falla, revisa:

1. **¿Aparece el webhook en `stripe listen`?**
   - Si NO: El cliente no está enviando la request a `/api/webhooks/stripe`
   - Verifica la URL de success en `create-checkout-session`

2. **¿Se verifica la firma?**
   - Si NO: El `STRIPE_WEBHOOK_SECRET` no coincide
   - Cópialo de nuevo de `stripe listen`

3. **¿Falla la inserción en BD?**
   - Revisa los permisos de `SUPABASE_SERVICE_KEY`
   - Verifica que la tabla `adoptions` exista

4. **¿Se completa pero no aparece la adopción?**
   - Los logs mostrarán exactamente dónde falla
   - Busca líneas con ❌ en los logs
