import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-01-28.clover' })

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const sessionId = searchParams.get('session_id')

    if (!sessionId) {
      return NextResponse.json({ error: 'Missing session_id' }, { status: 400 })
    }

    console.log('📋 Retrieving checkout session:', sessionId)
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    
    console.log('✅ Session retrieved:', {
      id: session.id,
      paymentStatus: session.payment_status,
      metadata: session.metadata,
    })

    return NextResponse.json({
      id: session.id,
      customer_email: session.customer_details?.email || session.customer_email,
      payment_status: session.payment_status,
      metadata: session.metadata || {},
    })
  } catch (error: any) {
    console.error('❌ Error retrieving checkout session:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
