import nodemailer from 'nodemailer';

export async function sendConfirmationEmail({ to, userName, treeName, startDate, endDate }: {
  to: string;
  userName: string;
  treeName: string;
  startDate: string;
  endDate: string;
}) {
  // Configure o transport com suas credenciais SMTP
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_FROM || 'no-reply@joyland.com',
    to,
    subject: 'JoyLand - Adoption Confirmation',
    html: `
      <h2>Adoption Confirmation</h2>
      <p>Dear ${userName || 'Friend'},</p>
      <p>We are delighted to confirm your adoption of the tree <strong>${treeName}</strong> at JoyLand.</p>
      <p>Your adoption period is from <strong>${new Date(startDate).toLocaleDateString()}</strong> to <strong>${new Date(endDate).toLocaleDateString()}</strong>.</p>
      <p>Thank you for supporting our project and making a positive impact on nature!</p>
      <p>If you have any questions or need assistance, please reply to this email and our team will be happy to help.</p>
      <br />
      <p>Best regards,<br />JoyLand Team</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (err) {
    console.error('Error sending confirmation email:', err);
    return false;
  }
}
