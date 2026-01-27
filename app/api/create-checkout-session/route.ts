import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma';

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

/**
 * POST /api/create-checkout-session
 * 
 * Creates a Stripe Checkout session for tree adoption
 * Supports two modes:
 * 1. Type-based adoption (no specific tree selected)
 * 2. Specific tree adoption (with tree ID)
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { treeType, treeId } = body

    // Validate input
    if (!treeType && !treeId) {
      return NextResponse.json(
        { error: 'Se requiere treeType o treeId' },
        { status: 400 }
      )
    }

    let type: 'almond' | 'olive' = 'almond';
    let price = 9600; // 96 EUR in cents
    let priceId: string | undefined;
    let treeName = '';
    let treeDescription = '';

    if (treeId) {
      // Busca árvore específica e verifica disponibilidade
      const tree = await prisma.tree.findUnique({ where: { id: treeId } });
      if (!tree) {
        return NextResponse.json({ error: 'Árvore não encontrada.' }, { status: 404 });
      }
      if (tree.status !== 'available') {
        return NextResponse.json({ error: 'Esta árvore já foi adotada.' }, { status: 409 });
      }
      type = tree.type === 'olive' ? 'olive' : 'almond';
      treeName = tree.name || '';
      treeDescription = tree.description || '';
      if (type === 'olive') {
        price = 12500;
        priceId = process.env.STRIPE_PRICE_OLIVE_YEARLY;
      /**
       * POST /api/create-checkout-session
       * Handler para criar sessão de checkout Stripe para adoção de árvore.
       * Suporta dois modos:
       * 1. Adoção por tipo (sem árvore específica)
       * 2. Adoção de árvore específica (com ID)
       *
       * Fluxo:
       * 1. Recebe dados do frontend (tipo ou ID da árvore).
       * 2. Valida existência e disponibilidade da árvore.
       * 3. Cria sessão Stripe com metadados.
       * 4. Retorna URL da sessão ou erro.
       *
       * Em caso de erro, retorna status apropriado e mensagem.
       */
      export async function POST(req: NextRequest) {
        // Validação básica do corpo do request
        let body: any;
        try {
          body = await req.json();
        } catch {
          return NextResponse.json({ error: 'JSON inválido.' }, { status: 400 });
        }

        // Proteção contra XSS: sanitizar strings recebidas
        const sanitize = (str: string) => str.replace(/[<>"'`]/g, '');

        const treeId = sanitize(body.treeId || '');
        const treeType = sanitize(body.treeType || '');

        // Validação de tipo
        if (treeType && !['olive', 'almond', 'olivo', 'almendro'].includes(treeType)) {
          return NextResponse.json({ error: 'Tipo de árvore inválido.' }, { status: 400 });
        }

        // Validação de ID
        if (treeId && !/^[-\w]+$/.test(treeId)) {
          return NextResponse.json({ error: 'ID de árvore inválido.' }, { status: 400 });
        }

        // ...continuação do fluxo original...
        try {
          const tree = treeId ? await prisma.tree.findUnique({ where: { id: treeId } }) : null;
          if (treeId && !tree) {
            return NextResponse.json({ error: 'Árvore não encontrada.' }, { status: 404 });
          }
          if (tree && tree.status !== 'available') {
            return NextResponse.json({ error: 'Esta árvore já foi adotada.' }, { status: 409 });
          }
          // ...continuação da lógica de criação da sessão Stripe...
        } catch (error) {
          return NextResponse.json({ error: 'Erro interno.' }, { status: 500 });
        }
      }
        : 'Adopción anual de un almendro en el norte de España. Incluye informe de progreso y giftbox estacional.')
      : type === 'olive'
        ? 'Adopción anual de un olivo en el norte de España. Incluye informe de progreso y giftbox estacional.'
        : 'Adopción anual de un almendro en el norte de España. Incluye informe de progreso y giftbox estacional.';

    const imageUrl = type === 'olive'
      ? 'https://images.unsplash.com/photo-1474440692490-2e83ae13ba29?w=800'
      : 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800';

    // Create Checkout Session
    // Use Price ID if available (for recurring payments), otherwise use price_data
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = priceId
      ? [{
          price: priceId,
          quantity: 1,
        }]
      : [{
          price_data: {
            currency: 'eur',
            product_data: {
              name: productName,
              description,
              images: [imageUrl],
            },
            unit_amount: price,
          },
          quantity: 1,
        }]

    const session = await stripeClient.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/adopt/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/adopt`,
      metadata: {
        treeType: type,
        treeId: treeId || '',
      },
    });

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error('Stripe error:', error)
    return NextResponse.json(
      { error: error.message || 'Error al crear la sesión de pago' },
      { status: 500 }
    )
  }
}
