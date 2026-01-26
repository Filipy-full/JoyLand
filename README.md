# Joyland 🌿

A Next.js website for tree adoption in a regenerative olive and almond grove in northern Spain.

## Features

- 🗺️ Interactive map with Leaflet to visualize and select trees
- 🌳 Individual pages for each tree with photos, videos, and annual reports
- 💳 Secure payments with Stripe
- 📧 Email notifications (ready for Resend integration)
- 🎁 Seasonal giftbox system
- 📱 Fully responsive design
- 🎨 Calm, natural aesthetic

## Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** Prisma + SQLite (easily swappable to PostgreSQL)
- **Payments:** Stripe
- **Maps:** Leaflet + React-Leaflet
- **Email:** Ready for Resend or Nodemailer
- **Deployment:** Vercel-ready

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your credentials.

4. Set up the database:
```bash
npx prisma migrate dev
npx prisma generate
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the website.

## Stripe Setup

1. Create a Stripe account at https://stripe.com
2. Get your API keys from the Dashboard
3. Add them to `.env`
4. Set up webhook endpoint at `/api/webhooks/stripe`

## Deployment

### Opción A: servidor Node (cualquier proveedor)
1. Configura variables de entorno (`.env` o panel del proveedor).
2. Construye: `npm run build`.
3. Arranca: `npm run start` (asegúrate de exponer el puerto 3000 o el que definas en `PORT`).

### Opción B: Vercel solo como hosting
1. Importa el repo en Vercel.
2. Define las variables de entorno (no se usan servicios gestionados de Vercel; solo hosting).
3. Vercel ejecutará `npm run build` automáticamente y servirá el resultado.

---

Made with 🌿 for Joyland
