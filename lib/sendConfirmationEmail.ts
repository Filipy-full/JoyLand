import nodemailer from 'nodemailer';

export async function sendConfirmationEmail({ to, userName, treeName, startDate, endDate, attachmentUrl }: {
  to: string;
  userName: string;
  treeName: string;
  startDate: string;
  endDate: string;
  attachmentUrl?: string;
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

  // Gerar PDF correto (visual)
  const { fillCertificatePDF } = await import('./fillCertificatePDF');
  const path = await import('path');
  const fs = await import('fs/promises');
  let templatePath = '';
  let pdfFields: any = {};
  if ((treeName || '').toLowerCase().includes('olive')) {
    templatePath = path.join(process.cwd(), 'app/pdf/OliveTreeAdoptionCertificate.pdf');
    pdfFields = {
      tree_name: treeName,
      user_name: userName,
      startDate,
      endDate,
    };
  } else {
    templatePath = path.join(process.cwd(), 'app/pdf/AlmondTreeAdoptionCertificate.pdf');
    pdfFields = {
      'Chosen tree name': treeName,
      'Adopter': userName,
      'year': startDate ? new Date(startDate).getFullYear().toString() : '',
    };
  }
  const tmpPath = path.join('/tmp', `certificate-email-${Date.now()}.pdf`);
  await fillCertificatePDF(templatePath, tmpPath, pdfFields);
  const pdfBuffer = await fs.readFile(tmpPath);

  let pdfFileName = 'Joyland-Certificate.pdf';
  if ((treeName || '').toLowerCase().includes('olive')) {
    pdfFileName = 'OliveCertificate.pdf';
  } else {
    pdfFileName = 'AlmondsCertificate.pdf';
  }
  const mailOptions = {
    from: process.env.SMTP_FROM || 'admin@joylandweb.com',
    to,
    subject: 'JoyLand - Adoption Confirmation',
    html: `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f6f8fa; border-radius: 24px; box-shadow: 0 4px 24px #a7f3d0; padding: 40px 32px; max-width: 540px; margin: 32px auto; color: #1f2937;">
      <div style="text-align:center; margin-bottom:32px;">
        <h2 style="font-size:2.1em; color:#16a34a; margin:0; letter-spacing:-1px; font-weight:800;">Adoption Confirmation</h2>
      </div>
      <div style="background:#e7f6e7; border-radius:16px; padding:20px; margin:24px 0; box-shadow:0 2px 8px #d1d5db;">
        <p style="font-size:1.15em; margin:0;">Hello <b>${userName || 'Friend'}</b>,</p>
        <p style="margin:8px 0 0 0;">Thank you for choosing to adopt a tree at Joyland!<br/>You have adopted the tree <b>${treeName}</b>.</p>
        <p style="margin:8px 0 0 0;">Adoption period: <b>${new Date(startDate).toLocaleDateString()}</b> to <b>${new Date(endDate).toLocaleDateString()}</b>.</p>
      </div>
      <div style="background:#fff; border-radius:12px; box-shadow:0 2px 8px #d1d5db; padding:18px; margin-bottom:24px;">
        <p style="text-align:center;font-size:1.1em; margin:0;">We are so happy you felt the call to join the grove and officially start your tree journey 🌳<br/>Your support nourishes the land, the trees, the bees, and this small-scale project. Your tree is now part of your extended green family ☘️<br/>From gentle seasonal updates to your artisanal Joyland giftbox, you’ll receive little echoes of the land throughout the year. Our online portal is still sprouting but will soon bloom with details on your personal tree 🏵️</p>
      </div>
      <div style="text-align:center; margin:32px 0;">
        <a href="https://joylandweb.com/dashboard" style="display:inline-block;padding:16px 32px;background:#16a34a;color:#fff;text-decoration:none;font-weight:bold;font-size:1.15em;border-radius:12px;box-shadow:0 2px 8px #a7f3d0;transition:background 0.2s;">🌱 Go to your Joyland Dashboard</a>
      </div>
      <div style="text-align:center;margin-bottom:24px;">
        <a href="${attachmentUrl || '#'}" style="color:#4b8c4a;text-decoration:underline;font-weight:bold;font-size:1.1em;">📎 Download your adoption certificate (PDF)</a>
      </div>
      <div style="background:#fff; border-radius:12px; box-shadow:0 2px 8px #d1d5db; padding:18px; margin-bottom:24px;">
        <p style="text-align:center;font-size:1.1em; margin:0;">Thank you for growing together with Joyland 💚<br/>More magic soon!</p>
      </div>
      <div style="text-align:center; margin-top:16px; color:#94a3b8; font-size:0.95em;">Smiley,<br/>Joyland Sanctuary · joylandweb.com</div>
    </div>
    `,
    attachments: [
      {
        filename: pdfFileName,
        content: pdfBuffer,
        contentType: 'application/pdf',
      },
    ],
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (err) {
    // ...existing code...
    return false;
  }
}
