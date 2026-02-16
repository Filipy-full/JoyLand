import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

// GET /api/trees-with-adoptions
export async function GET() {
  // Busca todas as árvores
  const { data: trees, error: treesError } = await supabaseAdmin
    .from('trees')
    .select('id, name, type, status, description, latitude, longitude, year, width, height, root_zone, orientation, images')
    .order('created_at', { ascending: true });

  if (treesError) {
    return NextResponse.json({ error: treesError.message }, { status: 500 });
  }

  // Busca as últimas adoções para cada árvore

  let adoptions, adoptionsError;
  try {
    const result = await supabaseAdmin
      .from('adoptions')
      .select('tree_id, user_name, tree_name')
      .order('created_at', { ascending: false });
    adoptions = result.data;
    adoptionsError = result.error;
    if (adoptionsError) {
      console.error('Supabase adoptionsError:', adoptionsError);
      return NextResponse.json({ error: adoptionsError.message }, { status: 500 });
    }
    if (!Array.isArray(adoptions)) {
      console.error('Supabase adoptions result is not array:', adoptions);
      return NextResponse.json({ error: 'Adoptions result is not array' }, { status: 500 });
    }
  } catch (err) {
    console.error('Unexpected error fetching adoptions:', err);
    return NextResponse.json({ error: 'Unexpected error fetching adoptions' }, { status: 500 });
  }

  // Mapeia o último nome de usuário e nome personalizado para cada árvore
  // y si tiene adopción activa
  const adoptionMap: Record<string, { user_name?: string; tree_name?: string }> = {};
  const adoptedSet = new Set();
  for (const adoption of adoptions) {
    if (!adoptionMap[adoption.tree_id]) {
      adoptionMap[adoption.tree_id] = {
        user_name: adoption.user_name,
        tree_name: adoption.tree_name,
      };
      adoptedSet.add(adoption.tree_id);
    }
  }

  // Junta os dados y fuerza status 'adopted' si corresponde

  const treesWithAdoptions = (trees || []).map(tree => ({
    ...tree,
    year: tree.year ?? '', // Permitir string, número o rango
    status: adoptedSet.has(tree.id) ? 'adopted' : tree.status,
    user_name: adoptionMap[tree.id]?.user_name || null,
    tree_name: adoptionMap[tree.id]?.tree_name || null,
  }));

  return NextResponse.json({ trees: treesWithAdoptions });
}
