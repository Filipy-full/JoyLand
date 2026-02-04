import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

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
      emailsSent: 0,
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

        // Enviar email al usuario
        if (adoption.user_email) {
          try {
            const treeName = adoption.trees?.name || `#${adoption.tree_id}`
            const endDate = new Date(adoption.end_date).toLocaleDateString('es-ES')

            await resend.emails.send({
              from: 'JoyLand <noreply@joylandweb.com>',
              to: adoption.user_email,
              subject: `Tu adopción de ${treeName} ha expirado`,
              html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                  <h2 style="color: #4a5568;">Hola ${adoption.user_name || 'amigo/a'},</h2>
                  
                  <p>Tu adopción del árbol <strong>${treeName}</strong> ha llegado a su fin el ${endDate}.</p>
                  
                  <p>Ha sido un placer tenerte como parte de nuestra comunidad durante este año. Tu apoyo ha contribuido al cuidado y regeneración de nuestras tierras.</p>
                  
                  <div style="background: #f7fafc; border-radius: 8px; padding: 20px; margin: 20px 0;">
                    <h3 style="color: #2d3748; margin-top: 0;">¿Quieres renovar tu adopción?</h3>
                    <p>Puedes volver a adoptar este árbol u otro de nuestro mapa:</p>
                    <a href="https://joylandweb.com/adopt/map" style="display: inline-block; background: #059669; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin-top: 10px;">
                      🌳 Explorar árboles disponibles
                    </a>
                  </div>
                  
                  <p style="color: #718096; font-size: 14px; margin-top: 30px;">
                    Puedes ver tu historial de adopciones en tu <a href="https://joylandweb.com/dashboard" style="color: #059669;">dashboard</a>.
                  </p>
                  
                  <p style="margin-top: 30px;">
                    Gracias por tu apoyo,<br>
                    <strong>El equipo de JoyLand</strong>
                  </p>
                </div>
              `,
            })

            results.emailsSent++
          } catch (emailError: any) {
            console.error(`Error sending email to ${adoption.user_email}:`, emailError)
            results.errors.push(`Email ${adoption.user_email}: ${emailError.message}`)
          }
        }
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
