import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'

// Disable static generation for this route
export const dynamic = 'force-dynamic'

let stripe: Stripe | null = null

function getStripe() {
  const apiKey = process.env.STRIPE_SECRET_KEY
  if (!apiKey) {
    throw new Error('STRIPE_SECRET_KEY is not set')
  }

  if (!stripe) {
    stripe = new Stripe(apiKey, {
      apiVersion: '2025-12-15.clover',
    })
  }

  return stripe
}

function getWebhookSecret() {
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secret) {
    throw new Error('STRIPE_WEBHOOK_SECRET is not set')
  }
  return secret
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing Stripe signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    const stripeClient = getStripe()
    const webhookSecret = getWebhookSecret()
    event = stripeClient.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`)
    return NextResponse.json({ error: err.message }, { status: 400 })
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    try {
      const { treeId, adopterName, adopterEmail, treeName, giftMessage } = session.metadata!

      // Create or get user
      let user = await prisma.user.findUnique({
        where: { email: adopterEmail },
      })

      if (!user) {
        user = await prisma.user.create({
          data: {
            name: adopterName,
            email: adopterEmail,
          },
        })
      }

      // Calculate adoption dates (1 year from now)
      const startDate = new Date()
      const endDate = new Date()
      endDate.setFullYear(endDate.getFullYear() + 1)

      // Create adoption
      await prisma.adoption.create({
        data: {
          userId: user.id,
          treeId,
          startDate,
          endDate,
          stripeSessionId: session.id,
          giftMessage: giftMessage || null,
        },
      })

      // Update tree status and name
      await prisma.tree.update({
        where: { id: treeId },
        data: {
          status: 'adopted',
          name: treeName || null,
        },
      })

      // TODO: Send confirmation email using Resend

      console.log(`Tree ${treeId} adopted by ${adopterEmail}`)
    } catch (error) {
      console.error('Error processing adoption:', error)
      return NextResponse.json({ error: 'Error processing adoption' }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}
