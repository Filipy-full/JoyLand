import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

// GET /api/trees?type=almendro|olivo&id=treeId
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type');
  const id = searchParams.get('id');
  const sync = searchParams.get('sync'); // Sincronizar adopciones

  // Si se pide sincronización, actualizar estados desde adoptions table
  if (sync === 'true') {
    try {
      // Obtener todos los tree_ids de la tabla adoptions donde status es 'adopted'
      const { data: adoptions, error: adoptError } = await supabaseAdmin
        .from('adoptions')
        .select('tree_id')
        .eq('status', 'adopted');

      if (!adoptError && adoptions && adoptions.length > 0) {
        // Obtener IDs únicos de árboles adoptados
        const adoptedTreeIds = [...new Set(adoptions.map((a) => a.tree_id))];
        
        // Actualizar el status de esos árboles a 'adopted'
        const { error: updateError } = await supabaseAdmin
          .from('trees')
          .update({ status: 'adopted' })
          .in('id', adoptedTreeIds);

        if (updateError) {
          console.error('Error syncing adoption status:', updateError);
        } else {
          console.log(`✅ Synced ${adoptedTreeIds.length} adopted trees`);
        }
      }
    } catch (error) {
      console.error('Error during sync:', error);
    }
  }

  if (id) {
    const { data: tree, error } = await supabaseAdmin
      .from('trees')
      .select('id, name, type, status, description, latitude, longitude, year, width, height, area')
      .eq('id', id)
      .single();

    if (error || !tree) {
      return NextResponse.json({ error: 'Tree not found in database' }, { status: 404 });
    }

    return NextResponse.json({ tree });
  }

  let query = supabaseAdmin
    .from('trees')
    .select('id, name, type, status, description, latitude, longitude, year, width, height, area')
    .order('created_at', { ascending: true });

  if (type) {
    if (type !== 'almendro' && type !== 'olivo') {
      return NextResponse.json({ error: 'Invalid tree type' }, { status: 400 });
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
