export const sendResendEmail = async ({
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
  const apiKey = process.env.RESEND_API_KEY
  const from = 'admin@joylandweb.com'

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

    const result = await response.json()
    console.log('Resend API response:', result)
    return true
  } catch (error) {
    console.error('❌ Resend request failed:', error)
    return false
  }
}
