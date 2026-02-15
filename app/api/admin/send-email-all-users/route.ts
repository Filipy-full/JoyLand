import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;
const resendFrom = process.env.RESEND_FROM || 'admin@joylandweb.com';

export async function POST(req: NextRequest) {
  if (!resendApiKey) {
    return NextResponse.json({ error: 'Missing RESEND_API_KEY' }, { status: 500 });
  }

  const { message, subject } = await req.json();
  if (!message || !subject) {
    return NextResponse.json({ error: 'Missing message or subject' }, { status: 400 });
  }

  // Obtener todos los usuarios
  const { data: users, error } = await supabaseAdmin
    .from('users')
    .select('email, name');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const resend = new Resend(resendApiKey);
  let successCount = 0;
  let failCount = 0;

  for (const user of users || []) {
    if (!user.email) continue;
    try {
      await resend.emails.send({
        from: resendFrom,
        to: user.email,
        subject,
        html: `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937;"><h2>${subject}</h2><p>Hola ${user.name || 'amigo'},</p><p>${message}</p></div>`,
      });
      successCount++;
    } catch {
      failCount++;
    }
  }

  return NextResponse.json({ success: true, sent: successCount, failed: failCount });
}
