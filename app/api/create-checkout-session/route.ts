import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

interface TreeItem {
  id: string;
  name: string;
  type: string;
  price: number;
}

export async function POST(req: NextRequest) {
  const { 
    treeType, 
    treeId, 
    treeName, 
    giftMessage, 
    userId, 
    userName, 
    userEmail,
    trees, // Nueva prop para múltiples árboles
    isGift
  } = await req.json();
  
  // Usar el origin del request header en lugar de NEXT_PUBLIC_URL
  const origin = req.headers.get('origin') || req.headers.get('referer')?.split('?')[0] || 'http://localhost:3000';

  console.log('🛒 Checkout session request:', {
    userId,
    userName,
    userEmail,
    trees: trees?.length,
    treeId,
  });

  // Determinar si es múltiples árboles o uno solo
  const isMultiple = trees && Array.isArray(trees) && trees.length > 0;
  const treeList: TreeItem[] = isMultiple ? trees : [{ id: treeId, name: treeName, type: treeType, price: 200 }];

  // Validar que los árboles no estén ya adoptados
  try {
    for (const tree of treeList) {
      const { data: dbTree, error } = await supabaseAdmin
        .from('trees')
        .select('id, status')
        .eq('id', tree.id)
        .single();

      if (error || !dbTree) {
        return NextResponse.json({ error: `Árbol ${tree.id} no encontrado` }, { status: 404 });
      }

      if (dbTree.status === 'adopted') {
        return NextResponse.json(
          { error: `Árbol ${tree.id} ya ha sido adoptado` },
          { status: 400 }
        );
      }
    }
  } catch (err) {
    console.error('Error checking tree status:', err);
    return NextResponse.json({ error: 'Error checking tree availability' }, { status: 500 });
  }

  // Crear line items para Stripe
  // Nota: Stripe espera unit_amount en centavos, no euros
  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = treeList.map((tree) => ({
    price_data: {
      currency: 'eur',
      product_data: {
        name: `Adopción de ${tree.type === 'olivo' ? 'Olivo' : 'Almendro'} ${tree.name ? `"${tree.name}"` : `#${tree.id}`}`,
      },
      unit_amount: Math.round(tree.price * 100), // Convertir a centavos
    },
    quantity: 1,
  }));

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: userEmail || undefined, // Pre-rellenar email en Stripe
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: ['DE', 'AT', 'BE', 'BG', 'HR', 'DK', 'SK', 'SI', 'ES', 'FI', 'FR', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'NO', 'NL'],
      },
      line_items,
      success_url: `${origin}/adopt/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/adopt`,
      metadata: {
        userId: userId || '',
        userName: userName || '',
        userEmail: userEmail || '',
        treeIds: treeList.map(t => t.id).join(','),
        treeNames: treeList.map(t => t.name).join(','),
        treeCount: String(treeList.length),
        giftMessage: giftMessage || '',
        isGift: String(isGift || false),
      },
    });
    
    console.log('✅ Checkout session created:', {
      sessionId: session.id,
      url: session.url ? '✓ URL disponible' : '❌ URL no disponible',
      metadata: session.metadata,
    });
    
    if (!session.url) {
      console.error('❌ ERROR: Session created but URL is null');
      return NextResponse.json({ error: 'Session created but no URL returned' }, { status: 500 });
    }
    
    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('❌ Stripe error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
