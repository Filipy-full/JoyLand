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

    // Obtener los precios actuales de la base de datos
    const { data: pricingConfig } = await supabaseAdmin
      .from('config')
      .select('key, price')
      .in('key', ['tree_price_almond', 'tree_price_olive'])

    let ALMOND_PRICE = 200
    let OLIVE_PRICE = 200

    pricingConfig?.forEach((item: any) => {
      if (item.key === 'tree_price_almond') ALMOND_PRICE = item.price
      if (item.key === 'tree_price_olive') OLIVE_PRICE = item.price
    })

    // Obtener adopciones con información del árbol
    const { data: adoptions, error: adoptError } = await supabaseAdmin
      .from('adoptions')
      .select(`
        *,
        trees:tree_id (
          id,
          type,
          name
        )
      `)
      .eq('payment_status', 'completed')

    if (adoptError) {
      return NextResponse.json({ error: adoptError.message }, { status: 500 })
    }

    // Obtener total de árboles en el mapa
    const { data: allTrees, error: treesError } = await supabaseAdmin
      .from('trees')
      .select('id, type, status')

    if (treesError) {
      return NextResponse.json({ error: treesError.message }, { status: 500 })
    }

    // Calcular estadísticas
    const totalAdoptions = adoptions?.length || 0
    const almondAdoptions = adoptions?.filter(a => a.trees?.type === 'almond').length || 0
    const oliveAdoptions = adoptions?.filter(a => a.trees?.type === 'olive').length || 0

    const almondRevenue = almondAdoptions * ALMOND_PRICE
    const oliveRevenue = oliveAdoptions * OLIVE_PRICE
    const totalRevenue = almondRevenue + oliveRevenue

    const totalTrees = allTrees?.length || 0
    const totalAlmondTrees = allTrees?.filter(t => t.type === 'almond').length || 0
    const totalOliveTrees = allTrees?.filter(t => t.type === 'olive').length || 0

    const maxAlmondRevenue = totalAlmondTrees * ALMOND_PRICE
    const maxOliveRevenue = totalOliveTrees * OLIVE_PRICE
    const maxRevenue = maxAlmondRevenue + maxOliveRevenue

    const availableTrees = allTrees?.filter(t => t.status === 'available').length || 0
    const availableAlmond = allTrees?.filter(t => t.type === 'almond' && t.status === 'available').length || 0
    const availableOlive = allTrees?.filter(t => t.type === 'olive' && t.status === 'available').length || 0

    return NextResponse.json({
      stats: {
        totalAdoptions,
        almondAdoptions,
        oliveAdoptions,
        totalRevenue,
        almondRevenue,
        oliveRevenue,
        totalTrees,
        totalAlmondTrees,
        totalOliveTrees,
        maxRevenue,
        maxAlmondRevenue,
        maxOliveRevenue,
        availableTrees,
        availableAlmond,
        availableOlive,
        almondPrice: ALMOND_PRICE,
        olivePrice: OLIVE_PRICE,
      }
    })
  } catch (error: any) {
    console.error('Error fetching stats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
