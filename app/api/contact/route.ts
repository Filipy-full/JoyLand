import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { Resend } from 'resend'

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json()

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Save to Supabase
    const { error: dbError } = await supabaseAdmin
      .from('contact_messages')
      .insert([
        {
          name,
          email,
          subject,
          message,
        }
      ])

    if (dbError) {
      // ...existing code...
    }

    // ...envio via Resend já implementado abaixo...

    // Enviar email via Resend para admin
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: process.env.RESEND_FROM || 'no-reply@joylandweb.com',
        to: process.env.RESEND_FROM || 'admin@joylandweb.com',
        subject: `Nuevo mensaje de contacto: ${subject}`,
        html: `
          <h2>Nuevo mensaje de contacto</h2>
          <p><strong>De:</strong> ${name} (${email})</p>
          <p><strong>Asunto:</strong> ${subject}</p>
          <p><strong>Mensaje:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        `
      });
      // ...existing code...
    } catch (emailError) {
      console.error('Error sending confirmation email to user:', emailError);
    }

    // Enviar email de confirmação ao usuário
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: process.env.RESEND_FROM || 'no-reply@joylandweb.com',
        to: email,
        subject: 'Hemos recibido tu mensaje - Joyland',
        html: `
          <h2>Hola ${name},</h2>
          <p>Gracias por contactarnos. Hemos recibido tu mensaje y te responderemos pronto.</p>
          <p><strong>Tu mensaje:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
          <br>
          <p>Saludos,<br>Equipo Joyland</p>
        `
      });
      // ...existing code...
    } catch (emailError) {
      // ...existing code...
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    // ...existing code...
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
