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
    <h2>Adoption Confirmed!</h2>
    <p>Hello ${userName || 'Friend'},</p>
    <p>You have adopted the tree <strong>${treeName}</strong> at JoyLand Sanctuary.</p>
    <p>Adoption period: ${new Date(startDate).toLocaleDateString()} to ${new Date(endDate).toLocaleDateString()}.</p>
    <p>Thank you for helping us grow a greener world! 🌱</p>
    <p><a href="https://joyland.com/dashboard" style="display:inline-block;padding:10px 16px;background:#16a34a;color:#fff;text-decoration:none;border-radius:6px;">Go to your JoyLand Dashboard</a></p>
    <p>Thank you for choosing to adopt a tree at JoyLand 🌿</p>
    <p>We're so happy you felt the call to join the grove and officially start your tree journey 🌳 Your support nourishes the land, the trees, the bees, and this small scale project. Your tree is now part of your extended green family 🌱 From gentle seasonal updates to your artisanal JoyLand giftbox, you’ll receive little echoes of the land throughout the year. Our online portal is still sprouting but will soon be blooming with details on your personal tree 🌼</p>
    <p>Thank you for growing together with JoyLand 💚 More magic soon!</p>
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
