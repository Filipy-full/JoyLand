import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json()

    // Here you would integrate with your email service (Resend, Nodemailer, etc.)
    // For now, we'll just log it
    console.log('Contact form submission:', { name, email, subject, message })

    // TODO: Send email using Resend or similar service
    // Example with Resend:
    // const resend = new Resend(process.env.RESEND_API_KEY)
    // await resend.emails.send({
    //   from: 'Joyland <contact@joyland.es>',
    //   to: 'info@joyland.es',
    //   subject: `Contact Form: ${subject}`,
    //   html: `
    //     <h2>New contact form submission</h2>
    //     <p><strong>From:</strong> ${name} (${email})</p>
    //     <p><strong>Subject:</strong> ${subject}</p>
    //     <p><strong>Message:</strong></p>
    //     <p>${message}</p>
    //   `
    // })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Error al enviar el mensaje' },
      { status: 500 }
    )
  }
}
