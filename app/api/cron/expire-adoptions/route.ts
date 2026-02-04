import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function POST(req: NextRequest) {
  try {
    // Verificar token de autenticación para el cron job
    const authHeader = req.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET || 'your-secret-token-here'
    
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const now = new Date().toISOString()

    // Buscar adopciones expiradas
    const { data: expiredAdoptions, error: fetchError } = await supabaseAdmin
      .from('adoptions')
      .select('id, tree_id, user_id, user_email, user_name, end_date, trees(id, name, type)')
      .lt('end_date', now)
      .eq('status', 'adopted')

    if (fetchError) {
      console.error('Error fetching expired adoptions:', fetchError)
      return NextResponse.json({ error: fetchError.message }, { status: 500 })
    }

    if (!expiredAdoptions || expiredAdoptions.length === 0) {
      return NextResponse.json({ message: 'No expired adoptions found', expired: 0 })
    }

    const results = {
      expired: 0,
      treesFreed: 0,
      errors: [] as string[],
    }

    // Procesar cada adopción expirada
    for (const adoption of expiredAdoptions) {
      try {
        // Actualizar estado del árbol a "available"
        const { error: updateTreeError } = await supabaseAdmin
          .from('trees')
          .update({ status: 'available' })
          .eq('id', adoption.tree_id)

        if (updateTreeError) {
          console.error(`Error updating tree ${adoption.tree_id}:`, updateTreeError)
          results.errors.push(`Tree ${adoption.tree_id}: ${updateTreeError.message}`)
          continue
        }

        results.treesFreed++

        // Actualizar estado de la adopción a "expired"
        const { error: updateAdoptionError } = await supabaseAdmin
          .from('adoptions')
          .update({ status: 'expired' })
          .eq('id', adoption.id)

        if (updateAdoptionError) {
          console.error(`Error updating adoption ${adoption.id}:`, updateAdoptionError)
          results.errors.push(`Adoption ${adoption.id}: ${updateAdoptionError.message}`)
        }

        results.expired++

      } catch (error: any) {
        console.error(`Error processing adoption ${adoption.id}:`, error)
        results.errors.push(`Adoption ${adoption.id}: ${error.message}`)
      }
    }

    return NextResponse.json({
      success: true,
      ...results,
      timestamp: now,
    })
  } catch (error: any) {
    console.error('Error in expire-adoptions cron:', error)
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 })
  }
}

// Permitir GET para testing manual (solo con autenticación)
export async function GET(req: NextRequest) {
  return POST(req)
}
