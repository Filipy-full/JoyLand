// TEMPORAL: Ruta para depuración de variables de entorno en Vercel
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.json({
    ADMIN_SECRET: process.env.ADMIN_SECRET,
    NEXT_PUBLIC_APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    SVIX_WEBHOOK_SECRET: process.env.SVIX_WEBHOOK_SECRET,
    CRON_SECRET: process.env.CRON_SECRET,
    NEXT_PUBLIC_SITE_PASSWORD: process.env.NEXT_PUBLIC_SITE_PASSWORD,
    GMAIL_PASSWORD: process.env.GMAIL_PASSWORD,
    GMAIL_USER: process.env.GMAIL_USER,
  });
}
