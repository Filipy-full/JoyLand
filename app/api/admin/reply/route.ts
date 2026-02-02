import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import nodemailer from 'nodemailer'

export async function POST(req: NextRequest) {
  console.log('=== REPLY API CALLED ===')
  try {
    const body = await req.json()
    console.log('Body received:', body)
    const { toEmail, toName, subject, message, messageId } = body

    console.log('Parsed fields:', { toEmail, toName, subject, messageLength: message?.length })

    if (!toEmail || !toName || !subject || !message) {
      console.error('Missing fields detected')
      const response = {
        success: false,
        error: 'Missing required fields',
        received: { toEmail: !!toEmail, toName: !!toName, subject: !!subject, message: !!message }
      }
      console.log('Returning 400 with:', response)
      return NextResponse.json(response, { status: 400 })
    }

    // Check Gmail credentials
    if (!process.env.GMAIL_USER || !process.env.GMAIL_PASSWORD) {
      console.error('Gmail credentials not configured')
      const response = { success: false, error: 'Email service not configured' }
      console.log('Returning 500 with:', response)
      return NextResponse.json(response, { status: 500 })
    }

    // Send email via Gmail
    console.log('Setting up Gmail transporter...')
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASSWORD,
        },
      })

      const mailOptions = {
        from: process.env.GMAIL_USER,
        to: toEmail,
        subject: subject,
        html: `
          <h2>Hola ${toName},</h2>
          <p>${message.replace(/\n/g, '<br>')}</p>
          <br>
          <p>Saludos,<br>Equipo Joyland</p>
        `
      }

      console.log('Sending email to:', toEmail)
      const info = await transporter.sendMail(mailOptions)
      console.log('Email sent successfully:', info.messageId)

      // Save reply to database
      console.log('Saving reply to database...')
      const { error: dbError } = await supabaseAdmin
        .from('message_replies')
        .insert([
          {
            original_message_id: messageId,
            recipient_email: toEmail,
            recipient_name: toName,
            subject: subject,
            message: message,
            sent_from: process.env.GMAIL_USER,
            email_message_id: info.messageId
          }
        ])

      if (dbError) {
        console.error('Database error:', dbError)
        // Email was sent but DB save failed
        const response = { success: true, message: 'Email sent but database save failed', warning: dbError }
        console.log('Returning 200 with warning:', response)
        return NextResponse.json(response, { status: 200 })
      }

      console.log('Reply saved to database successfully')
      const response = { success: true, message: 'Reply sent and saved successfully' }
      console.log('Returning 200 with:', response)
      return NextResponse.json(response, { status: 200 })
    } catch (emailError) {
      console.error('Exception during email send:', emailError)
      const response = { success: false, error: 'Failed to send email', exception: String(emailError) }
      console.log('Returning 500 with:', response)
      return NextResponse.json(response, { status: 500 })
    }
  } catch (error) {
    console.error('Exception in reply handler:', error)
    const response = { success: false, error: 'Internal server error', exception: String(error) }
    console.log('Returning 500 with:', response)
    return NextResponse.json(response, { status: 500 })
  }
}
