export async function POST(req: NextRequest) {
  // ...existing code...
  const body = await req.json();
  const { tree_id, user_id, giftMessage, status, durationYears } = body;
  // Buscar dados do usuário
  let user_name = null;
  let user_email = null;
  const { data: userData } = await supabaseAdmin
    .from('users')
    .select('name,email')
    .eq('id', user_id)
    .single();
  if (userData) {
    user_name = userData.name || null;
    user_email = userData.email || null;
  }
  // Buscar nome do árvore, mas permitir override manual
  let tree_name = null;
  if (body.tree_name) {
    tree_name = body.tree_name;
  } else {
    const { data: treeData } = await supabaseAdmin
      .from('trees')
      .select('name')
      .eq('id', tree_id)
      .single();
    if (treeData) {
      tree_name = treeData.name || null;
    }
  }
  // Calcular datas
  const startDate = new Date();
  const endDate = new Date(startDate);
  const years = Number(durationYears) || 1;
  endDate.setFullYear(endDate.getFullYear() + years);
  // Log dos dados do e-mail de confirmação
  console.log('[CONFIRMATION EMAIL]', {
    to: user_email,
    userName: user_name,
    treeName: tree_name,
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
  });
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const token = authHeader.slice(7)
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
    if (error || !user || !adminEmails.includes(user.email || '')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    const body = await req.json()
    const { tree_id, user_id, giftMessage, status, durationYears } = body
    if (!tree_id || !user_id) {
      return NextResponse.json({ error: 'Missing tree_id or user_id' }, { status: 400 })
    }
    // Buscar dados do usuário
    let user_name = null;
    let user_email = null;
    const { data: userData } = await supabaseAdmin
      .from('users')
      .select('name,email')
      .eq('id', user_id)
      .single();
    if (userData) {
      user_name = userData.name || null;
      user_email = userData.email || null;
    }
    // Buscar nome do árvore, mas permitir override manual
    let tree_name = null;
    if (body.tree_name) {
      tree_name = body.tree_name;
    } else {
      const { data: treeData } = await supabaseAdmin
        .from('trees')
        .select('name')
        .eq('id', tree_id)
        .single();
      if (treeData) {
        tree_name = treeData.name || null;
      }
    }
    // Calcular datas
    const startDate = new Date();
    const endDate = new Date(startDate);
    const years = Number(durationYears) || 1;
    endDate.setFullYear(endDate.getFullYear() + years);
    // payment_status deve ser 'completed' para passar pelo constraint
    const { data, error: insertError } = await supabaseAdmin
      .from('adoptions')
      .insert([
        {
          tree_id,
          user_id,
          user_name,
          user_email,
          tree_name,
          gift_message: giftMessage || null,
          status: status || 'adopted',
          payment_status: 'completed',
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
        },
      ])
      .select()
      .single()
    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }
    // Atualizar status do tree para 'adopted'
    await supabaseAdmin
      .from('trees')
      .update({ status: 'adopted' })
      .eq('id', tree_id);

    // Enviar e-mail de confirmação com Resend (mesma estrutura do vencimento)
    try {
      const { sendResendEmail } = await import('@/lib/sendResendEmail');
      const subject = 'JoyLand - Adoption Confirmation';
      const html = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937;">
          <h2>Adoption Confirmation</h2>
          <p>Dear ${user_name || 'Friend'},</p>
          <p>We are delighted to confirm your adoption of the tree <strong>${tree_name}</strong> at JoyLand.</p>
          <p>Your adoption period is from <strong>${new Date(startDate).toLocaleDateString()}</strong> to <strong>${new Date(endDate).toLocaleDateString()}</strong>.</p>
          <p>Thank you for supporting our project and making a positive impact on nature!</p>
          <p>If you have any questions or need assistance, please reply to this email and our team will be happy to help.</p>
          <br />
          <p>Best regards,<br />JoyLand Team</p>
        </div>
      `;
      await sendResendEmail({
        to: user_email,
        subject,
        html,
      });
    } catch (err) {
      console.error('Erro ao enviar e-mail de confirmação com Resend:', err);
    }

    return NextResponse.json({ adoption: data })
  } catch (error: any) {
    console.error('Error creating adoption:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

const adminEmails = ['filipyhenrique54@gmail.com', 'joylandspain@gmail.com']

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.slice(7)
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)

    if (error || !user || !adminEmails.includes(user.email || '')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { data: adoptions, error: queryError } = await supabaseAdmin
      .from('adoptions')
      .select(`
        *,
        trees:tree_id (
          id,
          type,
          name
        )
      `)
      .order('created_at', { ascending: false })

    if (queryError) {
      console.error('Query error:', queryError)
      return NextResponse.json({ error: queryError.message }, { status: 500 })
    }

    console.log('Adoptions with trees:', JSON.stringify(adoptions?.slice(0, 2), null, 2))
    return NextResponse.json({ adoptions: adoptions || [] })
  } catch (error: any) {
    console.error('Error fetching adoptions:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
