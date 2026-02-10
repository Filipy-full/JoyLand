import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendConfirmationEmailResend({ to, userName, treeName, startDate, endDate }: {
  to: string;
  userName: string;
  treeName: string;
  startDate: string;
  endDate: string;
}) {
  const html = `
    <h2>Adoption Confirmation</h2>
    <p>Dear ${userName || 'Friend'},</p>
    <p>We are delighted to confirm your adoption of the tree <strong>${treeName}</strong> at JoyLand.</p>
    <p>Your adoption period is from <strong>${new Date(startDate).toLocaleDateString()}</strong> to <strong>${new Date(endDate).toLocaleDateString()}</strong>.</p>
    <p>Thank you for supporting our project and making a positive impact on nature!</p>
    <p>If you have any questions or need assistance, please reply to this email and our team will be happy to help.</p>
    <br />
    <p>Best regards,<br />JoyLand Team</p>
  `;

  try {
    const response = await resend.emails.send({
      from: 'no-reply@joylandweb.com',
      to,
      subject: 'JoyLand - Adoption Confirmation',
      html,
    });
    console.log('Resend API response:', response);
    if (response.error) {
      console.error('Resend API error:', response.error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Error sending confirmation email with Resend:', err);
    return false;
  }
}
