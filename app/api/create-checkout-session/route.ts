import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'

// Disable static generation for this route
export const dynamic = 'force-dynamic'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
})

export async function POST(req: NextRequest) {
  try {
    const { treeId, adopterName, adopterEmail, treeName, giftMessage, isGift, price } = await req.json()

    // Verify tree is available
    const tree = await prisma.tree.findUnique({
      where: { id: treeId },
    })

    if (!tree || tree.status !== 'available') {
      return NextResponse.json(
        { error: 'Este árbol no está disponible' },
        { status: 400 }
      )
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Adopción de ${tree.type === 'olive' ? 'Olivo' : 'Almendro'} - Joyland`,
              description: treeName
                ? `Adopción de "${treeName}" por 1 año`
                : `Adopción de árbol ${tree.id.slice(0, 8)} por 1 año`,
              images: ['https://images.unsplash.com/photo-1583669274349-82cc03a5d640?w=500'],
            },
            unit_amount: price, // in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_URL}/adopt/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/adopt/${treeId}`,
      customer_email: adopterEmail,
      metadata: {
        treeId,
        adopterName,
        adopterEmail,
        treeName: treeName || '',
        giftMessage: giftMessage || '',
        isGift: isGift ? 'true' : 'false',
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error('Stripe error:', error)
    return NextResponse.json(
      { error: error.message || 'Error al crear la sesión de pago' },
      { status: 500 }
    )
  }
}
