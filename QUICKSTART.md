# Joyland Project - Quick Start Guide

## 🎯 What You Have

A complete Next.js website for tree adoption with:
- ✅ Interactive map with Leaflet
- ✅ Tree adoption flow with Stripe payments
- ✅ Individual tree pages
- ✅ Static pages (Home, About, FAQ, Contact, Giftbox)
- ✅ Database with Prisma (SQLite locally, ready for PostgreSQL)
- ✅ Responsive design with Tailwind
- ✅ TypeScript throughout

## 🚀 Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your values (see below).

3. **Set up database:**
   ```bash
   npx prisma generate
   ```

4. **Add sample trees:**
   Open Prisma Studio:
   ```bash
   npx prisma studio
   ```
   Then manually create some trees with:
   - type: "olive" or "almond"
   - latitude/longitude: Use coordinates from northern Spain (e.g., 42.8, -5.5)
   - status: "available"
   - description: A nice description

5. **Run development server:**
   ```bash
   npm run dev
   ```
   Open http://localhost:3000

## 🔑 Required Environment Variables

### For Development (`.env`)
```
DATABASE_URL="file:./dev.db"
STRIPE_SECRET_KEY="sk_test_YOUR_KEY"
STRIPE_WEBHOOK_SECRET="whsec_YOUR_KEY"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_YOUR_KEY"
NEXT_PUBLIC_URL="http://localhost:3000"
```

### Getting Stripe Keys
1. Go to https://dashboard.stripe.com
2. Create account (free)
3. Get test keys from Developers → API Keys
4. Set up webhook (see DEPLOYMENT.md)

## 📁 Project Structure

```
joyland/
├── app/                    # All pages and routes
│   ├── (pages)/
│   │   ├── page.tsx       # Homepage
│   │   ├── about/         # About page
│   │   ├── adopt/         # Adoption flow
│   │   ├── contact/       # Contact form
│   │   ├── faq/           # FAQ
│   │   ├── giftbox/       # Giftbox info
│   │   └── tree/[id]/     # Individual tree pages
│   ├── api/               # API routes
│   │   ├── create-checkout-session/
│   │   ├── contact/
│   │   └── webhooks/stripe/
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── TreeMap.tsx        # Leaflet map
│   ├── AdoptPageClient.tsx
│   └── CheckoutForm.tsx
├── lib/
│   └── prisma.ts          # Database client
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Seed script (currently has issues)
└── public/                # Static files
```

## 🗺️ Map Configuration

The map is currently centered on northern Spain. To change:

Edit `components/TreeMap.tsx`:
```typescript
const center: [number, number] = [YOUR_LAT, YOUR_LONG]
const zoom = 15 // Adjust zoom level
```

## 🎨 Customization

### Colors
Edit `app/globals.css` - sage color variables are defined there.

### Fonts
Currently using:
- **Serif:** Libre Baskerville (for headings)
- **Sans:** Inter (for body text)

Change in `app/layout.tsx`.

### Content
All text is directly in the page components. Edit them to match your story.

## 🌳 Adding Trees

Use Prisma Studio (easiest for now):
```bash
npx prisma studio
```

Required fields:
- `type`: "olive" or "almond"
- `latitude`: Number (e.g., 42.8001)
- `longitude`: Number (e.g., -5.5001)
- `status`: "available" or "adopted"

Optional fields:
- `name`: Tree name (set by adopter)
- `description`: About the tree
- `images`: JSON array of image URLs
- `videos`: JSON array of video URLs
- `yearlyReport`: Annual report text

Example tree data:
```json
{
  "type": "olive",
  "latitude": 42.8001,
  "longitude": -5.5001,
  "status": "available",
  "description": "A beautiful century-old olive tree with a twisted trunk."
}
```

## 💳 Testing Stripe

Use these test cards:
- **Success:** 4242 4242 4242 4242
- **Decline:** 4000 0000 0000 0002
- Any future expiry date
- Any 3-digit CVC

## 📦 What Still Needs Work

1. **Seed script** - Currently has issues with Prisma v7. Add trees manually via Prisma Studio for now.

2. **Email integration** - Code is ready but needs Resend API key. See `app/api/webhooks/stripe/route.ts`.

3. **Image uploads** - Currently expects image URLs. You'll need to add image upload functionality or use external hosting.

4. **Admin dashboard** - Not included. You can use Prisma Studio or build your own.

## 🚢 Deploying

See `DEPLOYMENT.md` for detailed instructions.

Quick version:
1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Switch to PostgreSQL
5. Add trees to database
6. Done!

## 🐛 Common Issues

### "PrismaClient needs options"
- Make sure `.env` file exists with `DATABASE_URL`
- Run `npx prisma generate`

### Map not showing
- Leaflet CSS might be missing
- Check browser console for errors

### Stripe webhook not working
- URL must match exactly: `https://your-domain.com/api/webhooks/stripe`
- Check webhook secret is correct
- View logs in Stripe dashboard

## 📚 Documentation

- Next.js: https://nextjs.org/docs
- Prisma: https://www.prisma.io/docs
- Stripe: https://stripe.com/docs
- Leaflet: https://leafletjs.com/reference.html
- React Leaflet: https://react-leaflet.js.org/

## 💬 Need Help?

Check:
1. Browser console for frontend errors
2. Terminal for backend errors
3. Stripe dashboard for payment issues
4. Vercel logs for deployment issues

---

Built with ❤️ for regenerative agriculture 🌿
