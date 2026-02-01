import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

// GET /api/trees?type=almendro|olivo&id=treeId
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type');
  const id = searchParams.get('id');

  if (id) {
    const { data: tree, error } = await supabaseAdmin
      .from('trees')
      .select('id, name, type, status, description, latitude, longitude')
      .eq('id', id)
      .single();

    if (error || !tree) {
      return NextResponse.json({ error: 'Árbol no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ tree });
  }

  let query = supabaseAdmin
    .from('trees')
    .select('id, name, type, status, description, latitude, longitude')
    .order('created_at', { ascending: true });

  if (type) {
    if (type !== 'almendro' && type !== 'olivo') {
      return NextResponse.json({ error: 'Tipo de árbol inválido' }, { status: 400 });
    }
    const dbType = type === 'almendro' ? 'almond' : 'olive';
    query = query.eq('type', dbType);
  }

  const { data: trees, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ trees: trees || [] });
}
