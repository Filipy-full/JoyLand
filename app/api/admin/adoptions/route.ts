export async function POST(req: NextRequest) {
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
    // Buscar dados da árvore
    let tree_name = null;
    const { data: treeData } = await supabaseAdmin
      .from('trees')
      .select('name')
      .eq('id', tree_id)
      .single();
    if (treeData) {
      tree_name = treeData.name || null;
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
