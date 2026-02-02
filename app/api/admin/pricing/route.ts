import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

const adminEmails = ['filipyhenrique54@gmail.com', 'joylandspain@gmail.com']

export async function GET(req: NextRequest) {
  try {
    const { data: pricing, error } = await supabaseAdmin
      .from('config')
      .select('key, price')
      .in('key', ['tree_price_almond', 'tree_price_olive'])

    if (error) {
      return NextResponse.json({ 
        almondPrice: 200,
        olivePrice: 200
      })
    }

    const prices: any = {
      almondPrice: 200,
      olivePrice: 200
    }

    pricing?.forEach((item: any) => {
      if (item.key === 'tree_price_almond') prices.almondPrice = item.price
      if (item.key === 'tree_price_olive') prices.olivePrice = item.price
    })

    return NextResponse.json(prices)
  } catch (error: any) {
    console.error('Error fetching pricing:', error)
    return NextResponse.json({ 
      almondPrice: 200,
      olivePrice: 200
    })
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

    const { almondPrice, olivePrice } = await req.json()

    if (!almondPrice || !olivePrice || almondPrice < 0 || olivePrice < 0) {
      return NextResponse.json({ error: 'Invalid prices' }, { status: 400 })
    }

    const { error: updateError } = await supabaseAdmin
      .from('config')
      .upsert([
        { key: 'tree_price_almond', price: almondPrice },
        { key: 'tree_price_olive', price: olivePrice }
      ], { onConflict: 'key' })

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, almondPrice, olivePrice })
  } catch (error: any) {
    console.error('Error updating pricing:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
