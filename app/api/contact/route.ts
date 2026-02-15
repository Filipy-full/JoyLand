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
        from: 'admin@joylandweb.com',
        to: 'admin@joylandweb.com',
        subject: `New Contact Message: ${subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; color: #222; background: #f8fafc; padding: 40px 32px; border-radius: 16px; max-width: 560px; margin: 0 auto; border: 1px solid #e0e0e0; box-shadow: 0 2px 16px rgba(56,142,60,0.10);">
            <h2 style="color: #388e3c; margin-bottom: 20px; font-size: 1.7em; letter-spacing: 0.5px; text-align:center;">Thank you for your message!</h2>
            <p style="font-size: 18px; margin-bottom: 22px; color: #222; text-align:center;">Hi ${name || 'Friend'},</p>
            <div style="background: #e8f5e9; border-left: 5px solid #388e3c; padding: 20px 22px; margin-bottom: 24px; border-radius: 8px;">
              <p style="margin: 0 0 12px 0; font-weight: bold; color: #388e3c;">Regarding: <span style='color:#222'>${subject}</span></p>
              <p style="margin: 0 0 12px 0; color: #222;">We're here to help! Your request has been received and we'll assist you as soon as possible.<br>If you need to try again, please wait about 10 minutes and then retry. For any other questions, just reply to this email and we'll be happy to help!</p>
            </div>
            <p style="font-size: 16px; margin-bottom: 20px; color: #222; text-align:center;">Thank you for being part of Joyland 🌳<br>Wishing you a wonderful day!</p>
            <p style="font-size: 16px; margin-bottom: 0; text-align:center;">With joy,<br><span style="color: #388e3c; font-weight: bold;">Filipy<br>Joyland Team</span></p>
            <div style="margin-top: 28px; text-align: center;">
              <span style="display: inline-block; background: #388e3c; color: #fff; font-weight: bold; padding: 10px 28px; border-radius: 7px; font-size: 16px; letter-spacing: 0.5px;">joylandweb.com</span>
            </div>
          </div>
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
        from: 'admin@joylandweb.com',
        to: email,
        subject: 'Thank you for contacting Joyland! 🌳',
        html: `
          <div style="font-family: Arial, sans-serif; color: #222; background: #f8fafc; padding: 32px 24px; border-radius: 12px; max-width: 520px; margin: 0 auto;">
            <h2 style="color: #388e3c; margin-bottom: 12px;">Hello ${name || 'Friend'},</h2>
            <p style="font-size: 16px; margin-bottom: 18px;">Thank you for reaching out to Joyland! We have received your message and our team will get back to you as soon as possible.</p>
            <div style="background: #e8f5e9; border-left: 4px solid #388e3c; padding: 16px 18px; margin-bottom: 18px; border-radius: 6px;">
              <p style="margin: 0 0 8px 0; font-weight: bold; color: #388e3c;">Your message:</p>
              <p style="margin: 0; color: #222;">${message.replace(/\n/g, '<br>')}</p>
            </div>
            <p style="font-size: 15px; margin-bottom: 18px;">If you have any urgent questions, feel free to reply to this email.<br>We are here to help you grow your Joyland experience!</p>
            <p style="font-size: 15px; margin-bottom: 0;">With joy,<br><span style="color: #388e3c; font-weight: bold;">Joyland</span></p>
          </div>
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
