import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

const resendApiKey = process.env.RESEND_API_KEY;
const resendFrom = process.env.RESEND_FROM || 'no-reply@joylandweb.com';

export async function POST(req: NextRequest) {
  if (!resendApiKey) {
    return NextResponse.json({ error: 'Missing RESEND_API_KEY' }, { status: 500 });
  }

  // Busca todas las adopciones que no tengan confirmation_sent_at
  const { data: adoptions, error } = await supabaseAdmin
    .from('adoptions')
    .select('*')
    .is('confirmation_sent_at', null);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const resend = new Resend(resendApiKey);
  let successCount = 0;
  let failCount = 0;

  for (const adoption of adoptions || []) {
    if (!adoption.user_email || !adoption.tree_name || !adoption.start_date || !adoption.end_date) {
      failCount++;
      continue;
    }
    try {
      // Chama o endpoint centralizado para gerar certificado e enviar e-mail bonito
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/api/certificate/generate-and-send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adoptionId: adoption.id }),
      });
      if (res.ok) {
        await supabaseAdmin
          .from('adoptions')
          .update({ confirmation_sent_at: new Date().toISOString() })
          .eq('id', adoption.id);
        successCount++;
      } else {
        failCount++;
      }
    } catch (err) {
      failCount++;
    }
  }

  return NextResponse.json({ success: true, sent: successCount, failed: failCount });
}
