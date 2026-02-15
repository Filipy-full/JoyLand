'Use client';
import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

function getJoylandEmailHtml(subject: string, message: string) {
  return `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f6f8fa; border-radius: 24px; box-shadow: 0 4px 24px #a7f3d0; padding: 40px 32px; max-width: 540px; margin: 32px auto; color: #1f2937;">
      <div style="text-align:center; margin-bottom:32px;">
        <img src="https://joylandweb.com/logo.png" alt="JoyLand Logo" style="height: 60px; margin-bottom: 16px;" />
        <h2 style="font-size:2.1em; color:#16a34a; margin:0; letter-spacing:-1px; font-weight:800;">${subject}</h2>
      </div>
      <div style="background:#e7f6e7; border-radius:16px; padding:20px; margin:24px 0; box-shadow:0 2px 8px #d1d5db;">
        <p style="font-size:1.15em; margin:0;">${message.replace(/\n/g, '<br>')}</p>
      </div>
      <div style="text-align:center; margin:32px 0;">
        <a href="https://joylandweb.com/dashboard" style="display:inline-block;padding:16px 32px;background:#16a34a;color:#fff;text-decoration:none;font-weight:bold;font-size:1.15em;border-radius:12px;box-shadow:0 2px 8px #a7f3d0;transition:background 0.2s;">🌱 Go to your Joyland Dashboard</a>
      </div>
      <div style="background:#fff; border-radius:12px; box-shadow:0 2px 8px #d1d5db; padding:18px; margin-bottom:24px;">
        <p style="text-align:center;font-size:1.1em; margin:0;">Thank you for growing together with Joyland 💚<br/>More magic soon!</p>
      </div>
      <div style="text-align:center; margin-top:16px; color:#94a3b8; font-size:0.95em;">Smiley,<br/>Joyland Sanctuary · joylandweb.com</div>
    </div>
  `;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { subject, message } = req.body;
  if (!subject || !message) {
    return res.status(400).json({ success: false, error: 'Missing subject or message' });
  }

  // Get all user emails from Supabase
  const { data: users, error } = await supabase.from('users').select('email');
  if (error) {
    return res.status(500).json({ success: false, error: 'Error fetching users' });
  }

  const emails = users?.map((u: { email: string }) => u.email).filter(Boolean);
  if (!emails || emails.length === 0) {
    return res.status(404).json({ success: false, error: 'No users found' });
  }

  // Setup nodemailer transporter (same as sendConfirmationEmail)
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const html = getJoylandEmailHtml(subject, message);

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'admin@joylandweb.com',
      bcc: emails,
      subject,
      html,
    });

    // Save the sent message in contact_messages for admin/messages page
    await supabase.from('contact_messages').insert([
      {
        name: 'Admin',
        email: 'admin@joylandweb.com',
        subject,
        message,
        user_name: 'Admin',
        created_at: new Date().toISOString(),
      }
    ]);

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Error sending mass email:', err);
    return res.status(500).json({ success: false, error: err instanceof Error ? err.message : String(err) });
  }
}
