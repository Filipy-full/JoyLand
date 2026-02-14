import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-01-28.clover' })

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature')
  const buf = await req.arrayBuffer()
  let event: Stripe.Event

  console.log('🔔 Webhook received! Signature:', sig?.slice(0, 20) + '...')

  try {
    event = stripe.webhooks.constructEvent(
      Buffer.from(buf),
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
    console.log('✅ Event verified successfully:', event.type)
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error(' Webhook signature verification failed:', errorMessage)
    return NextResponse.json({ error: `Webhook Error: ${errorMessage}` }, { status: 400 })
  }

  console.log('📌 Processing event type:', event.type)

  if (event.type === 'checkout.session.completed') {
    type CheckoutSessionWithShipping = Stripe.Checkout.Session & {
      shipping_details?: {
        address?: Stripe.Address | null;
        name?: string | null;
      }
    };
    const session = event.data.object as CheckoutSessionWithShipping;
    
    console.log('💳 Session data:', {
      sessionId: session.id,
      metadata: session.metadata,
      shippingDetails: session.shipping_details,
    })
    // Recuperar metadata del usuario
    const userId = session.metadata?.userId
    const treeIds = session.metadata?.treeIds || session.metadata?.treeId // Soportar ambos formatos
    const treeNames = session.metadata?.treeNames || session.metadata?.treeName
    const giftMessage = session.metadata?.giftMessage
    const userName = session.metadata?.userName
    const userEmail = session.metadata?.userEmail
    const treeCount = session.metadata?.treeCount || '1'
    const isGift = session.metadata?.isGift === 'true'

    // Recuperar dirección de envío
    const shippingAddress = session.shipping_details?.address
    const shippingName = session.shipping_details?.name

    if (userId && treeIds) {
      try {
        // Parsear lista de árboles
        const treeIdArray = treeIds.split(',').filter(id => id.trim());
        const treeNameArray = treeNames?.split(',') || [];

        console.log('🌳 Processing trees:', { treeIdArray, treeNameArray });

        // Crear adopción para cada árbol
        for (let i = 0; i < treeIdArray.length; i++) {
          const currentTreeId = treeIdArray[i].trim();
          const currentTreeName = treeNameArray[i]?.trim() || `Árbol #${currentTreeId}`;

          const startDate = new Date();
          const endDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 año
          const certificateCode = `JOY-${startDate.getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;

          console.log(`📝 Creating adoption record for tree ${currentTreeId}...`);

          const { data: adoptionData, error: adoptionError } = await supabaseAdmin
            .from('adoptions')
            .insert({
              user_id: userId,
              user_name: userName || null,
              user_email: userEmail || null,
              tree_id: currentTreeId,
              status: 'adopted',
              payment_status: 'completed',
              stripe_session_id: session.id,
              start_date: startDate.toISOString(),
              end_date: endDate.toISOString(),
              certificate_code: certificateCode,
              tree_name: currentTreeName,
              gift_message: isGift ? (giftMessage || null) : null,
              shipping_name: shippingName || null,
              shipping_address: shippingAddress ? JSON.stringify(shippingAddress) : null,
            });

          if (adoptionError) {
            console.error(` Error inserting adoption for tree ${currentTreeId}:`, adoptionError);
            throw adoptionError;
          }

          console.log(`✅ Adoption inserted for tree ${currentTreeId}:`, adoptionData);

          // Actualizar estado del árbol
          const { error: treeError } = await supabaseAdmin
            .from('trees')
            .update({ status: 'adopted' })
            .eq('id', currentTreeId);

          if (treeError) {
            console.error(' Error updating tree status:', treeError);
          } else {
            console.log(`✅ Tree ${currentTreeId} status updated to adopted`);
          }

          console.log('✅ Adoption created successfully:', { userId, currentTreeId, certificateCode });
        }

        // 📄 CREAR FACTURA EN STRIPE
        console.log('📄 Creating invoice in Stripe...');
        try {
          // 1. Buscar o crear customer en Stripe
          let customerId = session.customer as string | null;
          
          if (!customerId && userEmail) {
            // Buscar si existe un customer con ese email
            const customers = await stripe.customers.list({
              email: userEmail,
              limit: 1,
            });

            if (customers.data.length > 0) {
              customerId = customers.data[0].id;
              console.log('✅ Found existing customer:', customerId);
            } else {
              // Crear nuevo customer
              const customer = await stripe.customers.create({
                email: userEmail,
                name: userName || shippingName || undefined,
                metadata: {
                  userId: userId || '',
                },
              });
              customerId = customer.id;
              console.log('✅ Created new customer:', customerId);
            }
          }

          if (customerId) {
            // 2. Crear invoice
            const invoice = await stripe.invoices.create({
              customer: customerId,
              auto_advance: true, // Auto-finalize
              collection_method: 'charge_automatically',
              description: `Adopción de ${treeCount} árbol${treeCount === '1' ? '' : 'es'} - JoyLand`,
              metadata: {
                sessionId: session.id,
                userId: userId || '',
                treeIds: treeIds,
                treeCount: treeCount,
              },
            });

            // 3. Agregar line items al invoice
            for (let i = 0; i < treeIdArray.length; i++) {
              const currentTreeId = treeIdArray[i].trim();
              const currentTreeName = treeNameArray[i]?.trim() || `Árbol #${currentTreeId}`;
              
              await stripe.invoiceItems.create({
                customer: customerId,
                invoice: invoice.id,
                description: `Adopción de árbol "${currentTreeName}"`,
                amount: 20000, // 200 EUR en centavos
                currency: 'eur',
              });
            }

            // 4. Finalizar y enviar invoice
            const finalizedInvoice = await stripe.invoices.finalizeInvoice(invoice.id);
            
            // 5. Marcar como pagado (porque ya fue pagado via checkout)
            await stripe.invoices.pay(finalizedInvoice.id, {
              paid_out_of_band: true, // Marca como pagado fuera del sistema
            });

            console.log('✅ Invoice created and sent:', {
              invoiceId: finalizedInvoice.id,
              invoiceNumber: finalizedInvoice.number,
              invoicePdf: finalizedInvoice.invoice_pdf,
            });
          }
        } catch (invoiceError: unknown) {
          const errorMessage = invoiceError instanceof Error ? invoiceError.message : String(invoiceError);
          console.error(' Error creating invoice:', errorMessage);
          // No lanzar error porque las adopciones ya fueron creadas exitosamente
        }

      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(' Error creating adoption:', errorMessage);
        return NextResponse.json({ error: 'Failed to process adoption' }, { status: 500 })
      }
    } else {
      console.warn('⚠️ Missing required metadata:', { userId, treeIds, userName, userEmail })
    }
  }

  return NextResponse.json({ received: true })
}
