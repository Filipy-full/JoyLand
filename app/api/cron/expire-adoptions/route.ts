import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

const DAY_IN_MS = 24 * 60 * 60 * 1000

const getBaseUrl = () => process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'

const getResendConfig = () => {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM
  return { apiKey, from }
}

const sendResendEmail = async ({
  to,
  subject,
  html,
  text,
}: {
  to: string
  subject: string
  html: string
  text?: string
}) => {
  const { apiKey, from } = getResendConfig()

  if (!apiKey || !from) {
    console.warn('⚠️ Email not sent: RESEND_API_KEY or RESEND_FROM missing')
    return false
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to,
        subject,
        html,
        text,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Resend error:', errorText)
      return false
    }

    return true
  } catch (error) {
    console.error('❌ Resend request failed:', error)
    return false
  }
}

const formatDate = (value: string) => {
  try {
    return new Date(value).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return value
  }
}

export async function POST(req: NextRequest) {
  try {
    // Verificar token de autenticación para el cron job
    const authHeader = req.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET || 'your-secret-token-here'
    
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const now = new Date()
    const nowIso = now.toISOString()
    // Para test: enviar lembrete para adoções que expiram nos próximos 10 dias
    const reminderStart = new Date(now.getTime())
    const reminderEnd = new Date(now.getTime() + 10 * DAY_IN_MS)
    console.log('[CRON] now:', now.toISOString())
    console.log('[CRON] reminderStart:', reminderStart.toISOString())
    console.log('[CRON] reminderEnd:', reminderEnd.toISOString())

    // Buscar adopciones expiradas
    const { data: expiredAdoptions, error: fetchError } = await supabaseAdmin
      .from('adoptions')
      .select('id, tree_id, user_id, user_email, user_name, end_date, trees(id, name, type)')
      .lt('end_date', nowIso)
      .eq('status', 'adopted')

    if (fetchError) {
      console.error('Error fetching expired adoptions:', fetchError)
      return NextResponse.json({ error: fetchError.message }, { status: 500 })
    }

    const results = {
      expired: 0,
      treesFreed: 0,
      remindersSent: 0,
      emailsSent: 0,
      errors: [] as string[],
    }

    const { data: reminderAdoptions, error: reminderError } = await supabaseAdmin
      .from('adoptions')
      .select('id, tree_id, user_id, user_email, user_name, end_date, reminder_sent_at, trees(id, name, type)')
      .gte('end_date', reminderStart.toISOString())
      .lt('end_date', reminderEnd.toISOString())
      .eq('status', 'adopted')
      .is('reminder_sent_at', null)
    console.log('[CRON] reminderAdoptions:', reminderAdoptions)
    if (reminderError) console.error('[CRON] reminderError:', reminderError)

    if (reminderError) {
      console.error('Error fetching reminder adoptions:', reminderError)
      results.errors.push(`Reminder fetch: ${reminderError.message}`)
    }

    if (reminderAdoptions && reminderAdoptions.length > 0) {
      for (const adoption of reminderAdoptions) {
        try {
          if (!adoption.user_email) {
            results.errors.push(`Reminder ${adoption.id}: missing user_email`)
            continue
          }

          const baseUrl = getBaseUrl()
          const treeObj = Array.isArray(adoption.trees) ? adoption.trees[0] : adoption.trees
          const treeName = treeObj?.name ? `“${treeObj.name}”` : `#${adoption.tree_id}`
          const treeType = treeObj?.type ? treeObj.type : 'árbol'
          const endDate = formatDate(adoption.end_date)

          const subject = 'Tu adopción termina en 1 semana 🌿'
          const html = `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937;">
              <h2>Tu adopción está por terminar</h2>
              <p>Hola ${adoption.user_name || ''},</p>
              <p>Tu adopción del ${treeType} ${treeName} termina el <strong>${endDate}</strong>.</p>
              <p>Si quieres renovarla o adoptar otro árbol, puedes hacerlo aquí:</p>
              <p>
                <a href="${baseUrl}/adopt" style="display:inline-block;padding:10px 16px;background:#16a34a;color:#fff;text-decoration:none;border-radius:6px;">
                  Renovar / adoptar otro árbol
                </a>
              </p>
              <p>También puedes revisar tu panel:</p>
              <p><a href="${baseUrl}/dashboard">Ir al dashboard</a></p>
              <p>Gracias por apoyar a JoyLand 💚</p>
            </div>
          `

          const emailSent = await sendResendEmail({
            to: adoption.user_email,
            subject,
            html,
          })

          if (emailSent) {
            const { error: reminderUpdateError } = await supabaseAdmin
              .from('adoptions')
              .update({ reminder_sent_at: nowIso })
              .eq('id', adoption.id)

            if (reminderUpdateError) {
              console.error(`Error updating reminder_sent_at for ${adoption.id}:`, reminderUpdateError)
              results.errors.push(`Reminder update ${adoption.id}: ${reminderUpdateError.message}`)
            }

            results.remindersSent++
            results.emailsSent++
          }
        } catch (error: any) {
          console.error(`Error sending reminder for adoption ${adoption.id}:`, error)
          results.errors.push(`Reminder ${adoption.id}: ${error.message}`)
        }
      }
    }

    // Procesar cada adopción expirada
    for (const adoption of expiredAdoptions || []) {
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

        if (adoption.user_email) {
          const baseUrl = getBaseUrl()
          const treeObj = Array.isArray(adoption.trees) ? adoption.trees[0] : adoption.trees
          const treeName = treeObj?.name ? `“${treeObj.name}”` : `#${adoption.tree_id}`
          const treeType = treeObj?.type ? treeObj.type : 'árbol'
          const endDate = formatDate(adoption.end_date)

          const subject = 'Tu adopción ha expirado 🌿'
          const html = `
            <div style=\"font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937;\">
              <h2>Gracias por tu adopción</h2>
              <p>Hola ${adoption.user_name || ''},</p>
              <p>Tu adopción del ${treeType} ${treeName} finalizó el <strong>${endDate}</strong>.</p>
              <p>Gracias por apoyar a JoyLand. Si deseas renovar o adoptar otro árbol:</p>
              <p>
                <a href=\"${baseUrl}/adopt\" style=\"display:inline-block;padding:10px 16px;background:#16a34a;color:#fff;text-decoration:none;border-radius:6px;\">
                  Renovar / adoptar otro árbol
                </a>
              </p>
              <p>También puedes revisar tu panel:</p>
              <p><a href=\"${baseUrl}/dashboard\">Ir al dashboard</a></p>
              <p>¡Gracias por tu apoyo!</p>
            </div>
          `

          const emailSent = await sendResendEmail({
            to: adoption.user_email,
            subject,
            html,
          })

          if (emailSent) {
            results.emailsSent++
          }
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
      timestamp: nowIso,
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
