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

    const { data: trees, error: queryError } = await supabaseAdmin
      .from('trees')
      .select('id, name, type, status, description, yearly_report, videos, latitude, longitude, year, width, height, images')
      .order('created_at', { ascending: true })

    if (queryError) {
      const message = (queryError.message || '').toLowerCase()
      if (message.includes('column') && message.includes('year')) {
        const { data: fallbackTrees, error: fallbackError } = await supabaseAdmin
          .from('trees')
          .select('id, name, type, status, description, yearly_report, videos, latitude, longitude, images')
          .order('created_at', { ascending: true })

        if (fallbackError) {
          return NextResponse.json({ error: fallbackError.message }, { status: 500 })
        }

        return NextResponse.json({
          trees: (fallbackTrees || []).map((tree) => ({ ...tree, year: null })),
          yearAvailable: false,
          warning: 'Missing year column in trees table',
        })
      }

      return NextResponse.json({ error: queryError.message }, { status: 500 })
    }

    return NextResponse.json({ trees: trees || [], yearAvailable: true })
  } catch (error: any) {
    console.error('Error fetching trees:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
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
    const { id, name, status, description, yearly_report, videos, latitude, longitude, year, width, height, root_zone, orientation, images } = body || {}

    if (!id) {
      return NextResponse.json({ error: 'Missing tree id' }, { status: 400 })
    }

    const updates: Record<string, any> = {}
    if (name !== undefined) updates.name = name
    if (status !== undefined) updates.status = status
    if (description !== undefined) updates.description = description
    if (yearly_report !== undefined) updates.yearly_report = yearly_report
    if (videos !== undefined) updates.videos = videos
    if (latitude !== undefined) updates.latitude = latitude
    if (longitude !== undefined) updates.longitude = longitude
    if (year !== undefined) updates.year = year
    if (width !== undefined) updates.width = width
    if (height !== undefined) updates.height = height
    if (root_zone !== undefined) updates.root_zone = root_zone
    if (orientation !== undefined) updates.orientation = orientation
    if (images !== undefined) updates.images = images

    const { data: tree, error: updateError } = await supabaseAdmin
      .from('trees')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single()

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({ tree })
  } catch (error: any) {
    console.error('Error updating tree:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
