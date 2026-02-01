import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function GET(req: NextRequest) {
  try {
    // Obtener el token del header
    const authHeader = req.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.slice(7)

    // Verificar el token con Supabase
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)

    if (error || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Obtener las adopciones del usuario desde Supabase
    const { data: adoptions, error: queryError } = await supabaseAdmin
      .from('adoptions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (queryError) throw queryError

    return NextResponse.json({
      adoptions: adoptions || [],
      count: (adoptions || []).length,
    })
  } catch (error: any) {
    console.error('Error fetching adoptions:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
