import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json()

    // Send email using Resend
    // Make sure to set RESEND_API_KEY in your environment variables
    const { Resend } = require('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: 'Joyland <contact@joyland.com>',
      to: 'filipyhenrique54@gmail.com',
      subject: `Contact Form: ${subject}`,
      html: `
        <h2>New contact form submission</h2>
        <p><strong>From:</strong> ${name} (${email})</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Error sending the message' },
      { status: 500 }
    )
  }
}
