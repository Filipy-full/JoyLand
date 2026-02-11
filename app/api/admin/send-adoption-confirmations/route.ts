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
    const html = `
      <div style="font-family: 'Montserrat', Arial, sans-serif; background: #f6f8fa; padding: 32px; border-radius: 16px; color: #1f2937; max-width: 480px; margin: auto;">
        <h2 style="color: #16a34a; font-size: 2rem; margin-bottom: 12px;">🌳 Adoption Confirmed!</h2>
        <p style="font-size: 1.1rem; margin-bottom: 16px;">Hello ${adoption.user_name || 'Friend'},</p>
        <p style="margin-bottom: 12px;">You have adopted the tree <strong style="color: #16a34a;">${adoption.tree_name}</strong> at Joyland Sanctuary.</p>
        <p style="margin-bottom: 12px;">Adoption period: <strong>${new Date(adoption.start_date).toLocaleDateString()}</strong> to <strong>${new Date(adoption.end_date).toLocaleDateString()}</strong>.</p>
        <p style="margin-bottom: 24px;">Thank you for helping us grow a greener world! 🌱</p>
        <a href="https://joylandweb.com/dashboard" style="display:inline-block;padding:12px 24px;background:#16a34a;color:#fff;text-decoration:none;border-radius:8px;font-weight:bold;font-size:1rem;margin-bottom:24px;">Go to your Joyland Dashboard</a>
        <br />
        <p style="font-size: 0.95rem; color: #64748b; margin-top: 24px;">With love,<br />The Joyland Team</p>
        <hr style="margin:32px 0; border:none; border-top:1px solid #e5e7eb;" />
        <p style="margin-bottom: 24px;">Thank you for choosing to adopt a tree at Joyland 🌿</p>
        <p style="margin-bottom: 24px;">We are so happy you felt the call to join the grove and officially start your tree journey 🌳 Your support nourishes the land, the trees, the bees, and this small-scale project. Your tree is now part of your extended green family 🌱 From gentle seasonal updates to your artisanal Joyland giftbox, you’ll receive little echoes of the land throughout the year. Our online portal is still sprouting but will soon bloom with details on your personal tree 🌼</p>
        <p style="margin-bottom: 24px;">Thank you for growing together with Joyland 💚 More magic soon!</p>
        <p style="font-size: 0.95rem; color: #64748b; margin-top: 24px;">Smiley,<br />Joyland</p>
      </div>
    `;
    try {
      const response = await resend.emails.send({
        from: resendFrom,
        to: adoption.user_email,
        subject: 'JoyLand - Adoption Confirmation',
        html,
      });
      if (!response.error) {
        // Marca la adopción como confirmada
        await supabaseAdmin
          .from('adoptions')
          .update({ confirmation_sent_at: new Date().toISOString() })
          .eq('id', adoption.id);
        successCount++;
      } else {
        failCount++;
      }
    } catch {
      failCount++;
    }
  }

  return NextResponse.json({ success: true, sent: successCount, failed: failCount });
}
