# Deploy Instructions for Joyland

## Prerequisites

Before deploying, make sure you have:
- A GitHub account
- A Vercel account (free tier is fine)
- A Stripe account (test mode is fine for initial setup)

## Step 1: Prepare Your Repository

1. Make sure all your code is committed to git:
```bash
git add .
git commit -m "Initial Joyland website"
```

2. Push to GitHub:
```bash
git remote add origin https://github.com/YOUR_USERNAME/joyland.git
git push -u origin main
```

## Step 2: Set Up Stripe

1. Go to https://dashboard.stripe.com
2. Get your API keys:
   - Click "Developers" → "API keys"
   - Copy the "Publishable key" (starts with `pk_test_`)
   - Copy the "Secret key" (starts with `sk_test_`)
   
3. Set up webhook:
   - Go to "Developers" → "Webhooks"
   - Click "Add endpoint"
   - URL will be: `https://your-domain.vercel.app/api/webhooks/stripe`
   - Select events: `checkout.session.completed`
   - Copy the webhook signing secret (starts with `whsec_`)

## Step 3: Deploy to Vercel

1. Go to https://vercel.com and sign in
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure environment variables:

Click "Environment Variables" and add:

```
DATABASE_URL="file:./dev.db"
STRIPE_SECRET_KEY="sk_test_YOUR_KEY_HERE"
STRIPE_WEBHOOK_SECRET="whsec_YOUR_WEBHOOK_SECRET_HERE"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_YOUR_KEY_HERE"
NEXT_PUBLIC_URL="https://your-domain.vercel.app"
```

5. Click "Deploy"

## Step 4: Update Stripe Webhook URL

After deployment:
1. Go back to Stripe → Developers → Webhooks
2. Update your webhook endpoint URL to: `https://your-actual-vercel-domain.vercel.app/api/webhooks/stripe`
3. Update `NEXT_PUBLIC_URL` in Vercel environment variables to match your domain

## Step 5: Switch to PostgreSQL (Recommended for Production)

SQLite doesn't work well on Vercel. Switch to PostgreSQL:

1. In Vercel project, go to "Storage" tab
2. Create a new Postgres database
3. Copy the connection string
4. Update environment variables:
   - Change `DATABASE_URL` to the Postgres connection string
   
5. Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"  // Changed from "sqlite"
}
```

6. Push the schema to your new database:
```bash
npx prisma db push
```

7. Redeploy on Vercel

## Step 6: Add Trees to Your Database

You can add trees in two ways:

### Option A: Use Prisma Studio
```bash
npx prisma studio
```
Then manually create trees through the UI.

### Option B: Create a script
Create a simple API route to add trees, or use the seed script after fixing Prisma configuration.

## Step 7: Test Everything

1. Visit your deployed site
2. Try selecting a tree on the map
3. Go through the adoption flow (use Stripe test cards)
4. Test card: 4242 4242 4242 4242, any future date, any CVC

## Optional: Custom Domain

1. In Vercel, go to "Settings" → "Domains"
2. Add your custom domain
3. Follow DNS instructions
4. Update `NEXT_PUBLIC_URL` environment variable
5. Update Stripe webhook URL

## Optional: Email Integration

To send confirmation emails:

1. Sign up for Resend: https://resend.com
2. Verify your domain
3. Get API key
4. Add to Vercel environment variables:
```
RESEND_API_KEY="re_YOUR_KEY_HERE"
```
5. Update `app/api/webhooks/stripe/route.ts` to send emails

## Troubleshooting

### Trees not showing on map
- Make sure you've added trees to the database
- Check Vercel logs for errors

### Stripe payments failing
- Verify all Stripe environment variables are correct
- Check webhook is pointing to correct URL
- Use Stripe test cards for testing

### Map not loading
- Leaflet CSS might be missing
- Check browser console for errors

## Support

If you encounter issues, check:
- Vercel deployment logs
- Browser console for errors
- Stripe webhook logs in Stripe dashboard

---

Need help? Open an issue on GitHub.
