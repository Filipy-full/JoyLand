import { supabaseAdmin } from '../lib/supabaseAdmin'

interface ReminderAdoption {
  id: string;
  user_email: string;
  user_name: string;
  end_date: string;
  tree_id: string;
  trees: Array<{ name: string; type: string }>;
}

interface SendRemindersParams {
  nowIso: string;
  reminderAdoptions: ReminderAdoption[];
  sendResendEmail: (adoption: ReminderAdoption) => Promise<boolean>;
}

export async function sendReminders({ nowIso, reminderAdoptions, sendResendEmail }: SendRemindersParams) {
  let remindersSent = 0
  let emailsSent = 0
  let errors: string[] = []

  for (const adoption of reminderAdoptions) {
    try {
      if (!adoption.user_email) {
        errors.push(`Reminder ${adoption.id}: missing user_email`)
        continue
      }
      const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'
      const treeObj = Array.isArray(adoption.trees) ? adoption.trees[0] : adoption.trees
      const treeName = treeObj?.name ? `“${treeObj.name}”` : `#${adoption.tree_id}`
      const treeType = treeObj?.type ? treeObj.type : 'tree'
      const endDate = new Date(adoption.end_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
      const subject = 'Your adoption is about to end 🌿'
      const html = `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f6f8fa; border-radius: 24px; box-shadow: 0 4px 24px #a7f3d0; padding: 40px 32px; max-width: 540px; margin: 32px auto; color: #1f2937;">
          <div style="text-align:center; margin-bottom:32px;">
            <img src="https://joylandweb.com/emoji/tree.png" alt="Tree" style="width:56px;height:56px; margin-bottom:8px;" />
            <h2 style="font-size:2.2em; color:#16a34a; margin:0; letter-spacing:-1px;">🌳 Your adoption is about to end</h2>
          </div>
          <div style="background:#e7f6e7; border-radius:16px; padding:20px; margin:24px 0; box-shadow:0 2px 8px #d1d5db;">
            <p style="font-size:1.15em; margin:0;">Hello <b>${adoption.user_name || ''}</b>,</p>
            <p style="margin:8px 0 0 0;">Your adoption of the <b>${treeType} ${treeName}</b> ends on <strong>${endDate}</strong>.</p>
          </div>
          <div style="text-align:center; margin:32px 0;">
            <a href="${baseUrl}/adopt" style="display:inline-block;padding:16px 32px;background:#16a34a;color:#fff;text-decoration:none;font-weight:bold;font-size:1.15em;border-radius:12px;box-shadow:0 2px 8px #a7f3d0;transition:background 0.2s;">🌱 Renew / adopt another tree</a>
          </div>
          <div style="text-align:center; margin-bottom:32px;">
            <a href="${baseUrl}/dashboard" style="color:#2563eb;text-decoration:underline;font-weight:bold;font-size:1.1em;">Go to dashboard</a>
          </div>
          <div style="background:#fff; border-radius:12px; box-shadow:0 2px 8px #d1d5db; padding:18px; margin-bottom:24px;">
            <p style="text-align:center;font-size:1.1em; margin:0;">Thank you for supporting JoyLand 💚<br>We hope to see you again soon!</p>
          </div>
          <div style="text-align:center; margin-top:16px; color:#94a3b8; font-size:0.95em;">Joyland Sanctuary · joylandweb.com</div>
        </div>
      `
      const emailSent = await sendResendEmail(adoption)
      // Atualiza reminder_sent_at mesmo se o e-mail falhar
      const { error: reminderUpdateError } = await supabaseAdmin
        .from('adoptions')
        .update({ reminder_sent_at: nowIso })
        .eq('id', adoption.id)
      if (reminderUpdateError) {
        errors.push(`Reminder update ${adoption.id}: ${reminderUpdateError.message}`)
      }
      remindersSent++
      if (emailSent) emailsSent++
    } catch (error: any) {
      errors.push(`Reminder ${adoption.id}: ${error.message}`)
    }
  }
  return { remindersSent, emailsSent, errors }
}
