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
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    
    // Recuperar metadata del usuario
    const userId = session.metadata?.userId
    const userName = session.metadata?.userName
    const userEmail = session.metadata?.userEmail
    const treeId = session.metadata?.treeId
    const treeName = session.metadata?.treeName
    const giftMessage = session.metadata?.giftMessage

    if (userId && treeId) {
      try {
        // Crear adopción con campos mejorados
        const startDate = new Date()
        const endDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 año
        const certificateCode = `JOY-${startDate.getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`

        const { error: adoptionError } = await supabaseAdmin
          .from('adoptions')
          .insert({
            user_id: userId,
            user_name: userName,
            user_email: userEmail,
            tree_id: treeId,
            status: 'adopted',
            payment_status: 'completed',
            stripe_session_id: session.id,
            start_date: startDate.toISOString(),
            end_date: endDate.toISOString(),
            certificate_code: certificateCode,
            tree_name: treeName || `Árbol #${treeId}`,
            gift_message: giftMessage || null,
          })

        if (adoptionError) throw adoptionError

        const { error: treeError } = await supabaseAdmin
          .from('trees')
          .update({ status: 'adopted' })
          .eq('id', treeId)

        if (treeError) {
          console.error('❌ Error updating tree status:', treeError)
        }

        console.log('✅ Adoption created successfully:', { userId, treeId, certificateCode })
      } catch (error: any) {
        console.error('❌ Error creating adoption:', error)
        return NextResponse.json({ error: 'Failed to process adoption' }, { status: 500 })
      }
    } else {
      console.warn('Missing required metadata:', { userId, treeId })
    }
  }

  return NextResponse.json({ received: true })
}
