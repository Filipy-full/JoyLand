import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const { treeType, treeId, treeName, giftMessage, userId, userName, userEmail } = await req.json();
  const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_URL;
  // Precios: almendro 125 EUR, olivo 175 EUR
  let unit_amount = 0;
  if (treeType === 'almendro') unit_amount = 12500;
  else if (treeType === 'olivo') unit_amount = 17500;
  else unit_amount = 12500; // fallback
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
      success_url: `${origin}/adopt/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/adopt`,
      metadata: {
        userId: userId || '',
        userName: userName || '',
        userEmail: userEmail || '',
        treeId: treeId || '',
        treeType: treeType || '',
        treeName: treeName || '',
        giftMessage: giftMessage || '',
      },
    });
    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
