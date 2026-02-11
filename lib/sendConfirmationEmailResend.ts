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
    <p>Hello ${userName || 'Friend'},</p>
    <p>Thank you for choosing to adopt a tree at Joyland  You have adopted the tree ${treeName} </p>
    <p>Adoption period: ${new Date(startDate).toLocaleDateString()} to ${new Date(endDate).toLocaleDateString()}.</p>
    <p>We are so happy you felt the call to join the grove and officially start your tree journey  Your support nourishes the land, the trees, the bees, and this small-scale project. Your tree is now part of your extended green family  From gentle seasonal updates to your artisanal Joyland giftbox, you’ll receive little echoes of the land throughout the year. Our online portal is still sprouting but will soon bloom with details on your personal tree </p>
    <p><a href="https://joyland.earth/dashboard" style="color:#4b8c4a;text-decoration:underline;font-weight:bold;">Go to your Joyland Dashboard</a></p>
    <p>Thank you for growing together with Joyland  More magic soon!</p>
    <p>Smiley,<br/><br/>Joyland</p>
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
