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
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937;">
          <h2>Your adoption is about to end</h2>
          <p>Hello ${adoption.user_name || ''},</p>
          <p>Your adoption of the ${treeType} ${treeName} ends on <strong>${endDate}</strong>.</p>
          <p>If you want to renew it or adopt another tree, you can do it here:</p>
          <p>
            <a href="${baseUrl}/adopt" style="display:inline-block;padding:10px 16px;background:#16a34a;color:#fff;text-decoration:none;border-radius:6px;">
              Renew / adopt another tree
            </a>
          </p>
          <p>You can also check your dashboard:</p>
          <p><a href="${baseUrl}/dashboard">Go to dashboard</a></p>
          <p>Thank you for supporting JoyLand 💚</p>
        </div>
      `
      const emailSent = await sendResendEmail({
        to: adoption.user_email,
        subject,
        html,
      })
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
