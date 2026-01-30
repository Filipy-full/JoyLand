import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const { treeId, userId, userName, userEmail } = await req.json();
  // Ahora solo se guarda la adopción tras el pago exitoso (webhook)
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Adopción de árbol #${treeId}`,
            },
            unit_amount: 50, // 0.50 EUR
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
      },
    });
    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
