import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-01-28.clover' })

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature')
  const buf = await req.arrayBuffer()
  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      Buffer.from(buf),
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    // Recuperar metadata del usuario
    const userId = session.metadata?.userId
    const userName = session.metadata?.userName
    const userEmail = session.metadata?.userEmail
    const treeId = session.metadata?.treeId
    if (userId && userEmail && treeId) {
      await supabaseAdmin.from('adoptions').insert([
        {
          user_id: userId,
          user_name: userName,
          user_email: userEmail,
          tree_id: treeId,
          created_at: new Date().toISOString(),
        },
      ])
    }
  }

  return NextResponse.json({ received: true })
}
