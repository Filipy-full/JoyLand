import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import nodemailer from 'nodemailer'

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
      console.error('Database error:', dbError)
    }

    // Send email via Gmail to admin
    try {
      if (!process.env.GMAIL_USER || !process.env.GMAIL_PASSWORD) {
        console.error('Gmail not configured, skipping email notification')
      } else {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASSWORD,
          },
        })

        await transporter.sendMail({
          from: process.env.GMAIL_USER,
          to: process.env.GMAIL_USER,
          subject: `Nuevo mensaje de contacto: ${subject}`,
          html: `
            <h2>Nuevo mensaje de contacto</h2>
            <p><strong>De:</strong> ${name} (${email})</p>
            <p><strong>Asunto:</strong> ${subject}</p>
            <p><strong>Mensaje:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
          `
        })
        console.log('Admin notification email sent')
      }
    } catch (emailError) {
      console.error('Email notification error:', emailError)
      // Don't fail the request if email notification fails
    }

    // Send confirmation email to user
    try {
      if (process.env.GMAIL_USER && process.env.GMAIL_PASSWORD) {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASSWORD,
          },
        })

        await transporter.sendMail({
          from: process.env.GMAIL_USER,
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
        })
        console.log('User confirmation email sent to:', email)
      }
    } catch (emailError) {
      console.error('User confirmation email error:', emailError)
      // Don't fail the request if confirmation email fails
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Error processing the message' },
      { status: 500 }
    )
  }
}
