'Use client';
import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

function getJoylandEmailHtml(subject: string, message: string) {
  return `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f6f8fa; border-radius: 24px; box-shadow: 0 4px 24px #a7f3d0; padding: 40px 32px; max-width: 540px; margin: 32px auto; color: #1f2937;">
      <div style="text-align:center; margin-bottom:32px;">
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

  // Get all profile emails from Supabase
  const { data: profiles, error } = await supabase.from('profiles').select('email');
  if (error) {
    return res.status(500).json({ success: false, error: 'Error fetching profiles' });
  }

  const emails = profiles?.map((p: { email: string }) => p.email).filter(Boolean);
  console.log('Profiles fetched:', profiles);
  console.log('Emails fetched from profiles table:', emails);
  if (!emails || emails.length === 0) {
    return res.status(404).json({ success: false, error: 'No profiles found', profiles });
  }

  const html = getJoylandEmailHtml(subject, message);
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    // Send to all emails one by one
    const results = [];
    for (const email of emails) {
      const result = await resend.emails.send({
        from: process.env.RESEND_FROM || 'admin@joylandweb.com',
        to: email,
        subject,
        html,
      });
      results.push({ email, result });
      if (result.error) {
        console.error('Resend error for', email, result.error);
      }
    }
    // ...existing code...

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

    const anySuccess = results.some(r => !r.result.error);
    if (anySuccess) {
      return res.status(200).json({ success: true, results });
    } else {
      return res.status(500).json({ success: false, results });
    }
  } catch (err) {
    console.error('Error sending mass email:', err);
    return res.status(500).json({ success: false, error: err instanceof Error ? err.message : String(err) });
  }
}
