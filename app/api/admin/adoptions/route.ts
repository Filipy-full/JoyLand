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
