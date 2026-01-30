import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const { treeType, treeId, userId, userName, userEmail } = await req.json();
  // Precios: almendro 125 EUR, olivo 175 EUR
  let unit_amount = 0;
  if (treeType === 'almendro') unit_amount = 12500;
  else if (treeType === 'olivo') unit_amount = 17500;
  else unit_amount = 10000; // fallback
  try {
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
    });
    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
