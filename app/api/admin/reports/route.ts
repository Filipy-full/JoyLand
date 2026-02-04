import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

const adminEmails = ['filipyhenrique54@gmail.com', 'joylandspain@gmail.com']
const REPORTS_BUCKET = 'reports'

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

    const { data: reports, error: queryError } = await supabaseAdmin
      .from('reports')
      .select('*')
      .eq('hidden_from_admin', false)
      .order('created_at', { ascending: false })

    if (queryError) {
      return NextResponse.json({ error: queryError.message }, { status: 500 })
    }

    return NextResponse.json({ reports: reports || [] })
  } catch (error: any) {
    console.error('Error fetching reports:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
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

    const formData = await req.formData()
    const adoptionId = formData.get('adoption_id')?.toString() || null
    const userId = formData.get('user_id')?.toString() || null
    const treeId = formData.get('tree_id')?.toString() || ''
    const title = formData.get('title')?.toString() || ''
    const body = formData.get('body')?.toString() || ''

    if (!treeId || !title) {
      return NextResponse.json({ error: 'Missing required fields (tree_id and title)' }, { status: 400 })
    }

    const pdfFile = formData.get('pdf') as File | null
    const photos = formData.getAll('photos') as File[]

    let pdfUrl: string | null = null
    const photoUrls: string[] = []

    if (pdfFile && pdfFile.size > 0) {
      const pdfBuffer = Buffer.from(await pdfFile.arrayBuffer())
      const pdfPath = `reports/${treeId}/${Date.now()}_${pdfFile.name}`
      const { error: pdfError } = await supabaseAdmin
        .storage
        .from(REPORTS_BUCKET)
        .upload(pdfPath, pdfBuffer, { contentType: pdfFile.type, upsert: true })

      if (pdfError) {
        return NextResponse.json({ error: pdfError.message }, { status: 500 })
      }

      const { data: pdfPublic } = supabaseAdmin.storage.from(REPORTS_BUCKET).getPublicUrl(pdfPath)
      pdfUrl = pdfPublic.publicUrl
    }

    for (const photo of photos) {
      if (!photo || photo.size === 0) continue
      const photoBuffer = Buffer.from(await photo.arrayBuffer())
      const photoPath = `reports/${treeId}/${Date.now()}_${photo.name}`
      const { error: photoError } = await supabaseAdmin
        .storage
        .from(REPORTS_BUCKET)
        .upload(photoPath, photoBuffer, { contentType: photo.type, upsert: true })

      if (photoError) {
        return NextResponse.json({ error: photoError.message }, { status: 500 })
      }

      const { data: photoPublic } = supabaseAdmin.storage.from(REPORTS_BUCKET).getPublicUrl(photoPath)
      photoUrls.push(photoPublic.publicUrl)
    }

    const { data: report, error: insertError } = await supabaseAdmin
      .from('reports')
      .insert({
        adoption_id: adoptionId,
        user_id: userId,
        tree_id: treeId,
        title,
        body,
        pdf_url: pdfUrl,
        photo_urls: photoUrls,
      })
      .select()
      .single()

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    return NextResponse.json({ report })
  } catch (error: any) {
    console.error('Error creating report:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
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

    // Marcar como ocultos en lugar de eliminar para que los usuarios sigan viéndolos
    const { error: updateError } = await supabaseAdmin
      .from('reports')
      .update({ hidden_from_admin: true })
      .eq('hidden_from_admin', false)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error hiding reports:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
