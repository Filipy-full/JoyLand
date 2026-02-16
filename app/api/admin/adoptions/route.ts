export async function PATCH(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.slice(7);
    await supabaseAdmin.auth.getUser(token);
    const body = await req.json();
    const { adoptionId, newTreeName } = body;
    if (!adoptionId || !newTreeName) {
      return NextResponse.json({ error: 'Missing adoptionId or newTreeName' }, { status: 400 });
    }
    const { error } = await supabaseAdmin
      .from('adoptions')
      .update({ tree_name: newTreeName })
      .eq('id', adoptionId);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('Error updating tree name:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
export async function DELETE(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.slice(7);
    await supabaseAdmin.auth.getUser(token);
    const url = new URL(req.url);
    const adoptionId = url.searchParams.get('id');
    if (!adoptionId) {
      return NextResponse.json({ error: 'Missing adoption id' }, { status: 400 });
    }
    const { error: deleteError } = await supabaseAdmin
      .from('adoptions')
      .delete()
      .eq('id', adoptionId);
    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('Error deleting adoption:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
export async function POST(req: NextRequest) {
  // ...existing code...
  const body = await req.json();
  const { tree_id, user_id, tree_name: override_tree_name, status, durationYears } = body;
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
  if (override_tree_name) {
    tree_name = override_tree_name;
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
    await supabaseAdmin.auth.getUser(token)
    // if (error || !user || !adminEmails.includes(user.email || '')) {
    //   return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    // }
    if (!tree_id || !user_id) {
      return NextResponse.json({ error: 'Missing tree_id or user_id' }, { status: 400 })
    }
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

    // Gerar certificado PDF e enviar e-mail bonito com link
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/api/certificate/generate-and-send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adoptionId: data.id }),
      });
      if (!res.ok) {
        const errText = await res.text();
        console.error('Erro ao gerar/enviar certificado:', errText);
      }
    } catch (err) {
      console.error('Erro ao gerar/enviar certificado:', err);
    }

    return NextResponse.json({ adoption: data })
  } catch (error: unknown) {
    console.error('Error creating adoption:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

const adminEmails = ['filipyhenrique54@gmail.com', 'info@joylandweb.com']

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
  } catch (error: unknown) {
    console.error('Error fetching adoptions:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
