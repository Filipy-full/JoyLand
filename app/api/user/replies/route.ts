import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    // Buscar replies para o e-mail do usuário
    const { data: replies, error: queryError } = await supabaseAdmin
      .from('message_replies')
      .select('*')
      .eq('recipient_email', user.email)
      .order('created_at', { ascending: false });
    if (queryError) {
      return NextResponse.json({ error: queryError.message }, { status: 500 });
    }
    return NextResponse.json({ replies: replies || [] });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: 'Internal server error', details: errorMessage }, { status: 500 });
  }
}
