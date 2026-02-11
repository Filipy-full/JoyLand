import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);


export async function sendConfirmationEmailResend({ to, userName, treeName, startDate, endDate, attachmentUrl }: {
  to: string;
  userName: string;
  treeName: string;
  startDate: string;
  endDate: string;
  attachmentUrl?: string;
}) {
  // Monta corpo do e-mail com emojis e link do certificado
  const html = `
    <h2>📜 Adoption Confirmation</h2>
    <p>Hello ${userName || 'Friend'},</p>
    <p>Thank you for choosing to adopt a tree at Joyland 🌿<br/>You have adopted the tree <b>${treeName}</b>.</p>
    <p>Adoption period: <b>${new Date(startDate).toLocaleDateString()}</b> to <b>${new Date(endDate).toLocaleDateString()}</b>.</p>
    <p>We are so happy you felt the call to join the grove and officially start your tree journey 🌳<br/>Your support nourishes the land, the trees, the bees, and this small-scale project. Your tree is now part of your extended green family ☘️<br/>From gentle seasonal updates to your artisanal Joyland giftbox, you’ll receive little echoes of the land throughout the year. Our online portal is still sprouting but will soon bloom with details on your personal tree 🏵️</p>
    <p><a href="https://joylandweb.com/dashboard" style="color:#4b8c4a;text-decoration:underline;font-weight:bold;">Go to your Joyland Dashboard</a></p>
    ${attachmentUrl ? `<p>📎 <a href="${attachmentUrl}" style="color:#4b8c4a;text-decoration:underline;font-weight:bold;">Download your adoption certificate (PDF)</a></p>` : ''}
    <p>Thank you for growing together with Joyland 💚 More magic soon!</p>
    <p>Smiley,<br/>Joyland</p>
  `;

  try {
    const response = await resend.emails.send({
      from: process.env.SMTP_FROM || 'no-reply@joyland.com',
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
