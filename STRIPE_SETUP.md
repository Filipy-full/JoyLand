# Stripe Integration Setup for Joyland

This guide explains how to set up Stripe for tree adoption payments in the Joyland project.

## Overview

The adoption system supports two payment modes:
- **One-time payment**: User pays once for yearly adoption (default)
- **Subscription**: Recurring yearly payments (optional, requires Price IDs)

## 1. Create a Stripe Account

1. Go to [stripe.com](https://stripe.com) and create an account
2. Complete the onboarding process
3. Switch to **Test mode** for development

## 2. Get Your API Keys

From the [Stripe Dashboard](https://dashboard.stripe.com/apikeys):

1. Copy your **Publishable key** (starts with `pk_test_`)
2. Copy your **Secret key** (starts with `sk_test_`)
3. Add them to your `.env.local`:

```bash
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

## 3. Create Products (Optional)

If you want to use Stripe Price IDs for subscriptions:

### Create Almond Tree Product

1. Go to [Products](https://dashboard.stripe.com/products)
2. Click **+ Add product**
3. Fill in:
   - **Name**: Adopción de Almendro - Joyland
   - **Description**: Adopción anual de un almendro en el norte de España
   - **Pricing model**: Standard pricing
   - **Price**: 96 EUR
   - **Billing period**: Yearly
4. Click **Save product**
5. Copy the **Price ID** (starts with `price_`)

### Create Olive Tree Product

1. Repeat the same process with:
   - **Name**: Adopción de Olivo - Joyland
   - **Price**: 125 EUR
   - **Billing period**: Yearly
2. Copy the **Price ID**

### Add Price IDs to Environment

```bash
STRIPE_PRICE_ALMOND_YEARLY="price_..."
STRIPE_PRICE_OLIVE_YEARLY="price_..."
```

**Note**: If you don't provide Price IDs, the checkout will create prices dynamically using `price_data`.

## 4. Configure Webhooks (For Production)

Webhooks allow Stripe to notify your app when payments succeed/fail.

### Local Development (Stripe CLI)

1. Install [Stripe CLI](https://stripe.com/docs/stripe-cli)
2. Login: `stripe login`
3. Forward webhooks: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
4. Copy the webhook signing secret and add to `.env.local`:

```bash
STRIPE_WEBHOOK_SECRET="whsec_..."
```


### Production Deployment

1. Go to [Webhooks](https://dashboard.stripe.com/webhooks)
2. Click **+ Add endpoint**
3. Set endpoint URL: `https://yourdomain.com/api/webhooks/stripe`
4. Select events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copy the signing secret and add to your environment variables

## 5. Test the Integration

### Test Cards

Use these test cards in development:

| Card Number         | Scenario        |
|---------------------|-----------------|
| 4242 4242 4242 4242 | Success         |
| 4000 0000 0000 9995 | Declined        |
| 4000 0025 0000 3155 | Requires auth   |

- Use any future expiry date (e.g., 12/34)
- Use any 3-digit CVC
- Use any postal code

### Test Flow

1. Start dev server: `npm run dev`
2. Go to http://localhost:3000/adopt
3. Click "Adoptar un almendro" or "Adoptar un olivo"
4. Complete checkout with test card
5. Verify redirect to `/adopt/success`


## 6. Deploy to Production

### Environment Variables

Add all Stripe variables to your server or hosting provider:

```bash
export STRIPE_SECRET_KEY=sk_test_...
export NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
export STRIPE_WEBHOOK_SECRET=whsec_...
export STRIPE_PRICE_ALMOND_YEARLY=price_...
export STRIPE_PRICE_OLIVE_YEARLY=price_...
```

Or usa el panel de variables de entorno de tu proveedor de hosting.

### Switch to Production Mode

When ready for production:

1. Switch to **Live mode** in Stripe Dashboard
2. Get new production API keys
3. Create products again in production mode
4. Update environment variables in tu servidor/hosting con las claves de producción
5. Set up production webhook endpoint

## API Routes

### POST /api/create-checkout-session

Creates a Stripe Checkout session for tree adoption.

**Request Body:**
```json
{
  "treeType": "almond" | "olive"
}
```

**Response:**
```json
{
  "url": "https://checkout.stripe.com/..."
}
```

**Prices:**
- Almond: 96 EUR/year
- Olive: 125 EUR/year

### POST /api/webhooks/stripe

Handles Stripe webhook events (payment confirmations, etc.)

## Security Notes

- ✅ Never expose `STRIPE_SECRET_KEY` in client-side code
- ✅ Always validate webhook signatures using `STRIPE_WEBHOOK_SECRET`
- ✅ Use HTTPS in production
- ✅ Keep API keys in environment variables, never in code

## Troubleshooting

### "STRIPE_SECRET_KEY is not set"
- Make sure `.env.local` exists and contains the key
- Restart the dev server after adding environment variables

### Checkout redirects to cancel URL
- Check browser console for errors
- Verify API keys are correct
- Test with a different card

### Webhook not receiving events
- Verify webhook secret matches
- Check endpoint URL is correct and accessible
- Ensure correct events are selected

## Support

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Dashboard](https://dashboard.stripe.com)
- [Test Cards](https://stripe.com/docs/testing)
