
jest.mock('../lib/supabaseAdmin', () => ({
  supabaseAdmin: {
    from: () => ({
      update: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
    }),
  },
}))

import { sendReminders } from '../lib/cronReminderService'
jest.mock('../lib/supabaseAdmin', () => ({
  supabaseAdmin: {
    from: () => ({
      update: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
    }),
  },
}))

import { sendReminders } from '../lib/cronReminderService'

describe('sendReminders', () => {
  it('should update reminder_sent_at even if email fails', async () => {
    const nowIso = new Date().toISOString()
    const reminderAdoptions = [
      {
        id: 'test-id',
        user_email: 'test@example.com',
        user_name: 'Test User',
        end_date: nowIso,
        tree_id: 'tree-1',
        trees: [{ name: '1', type: 'olive' }],
      },
    ]
    const sendResendEmail = jest.fn().mockResolvedValue(false)
    const result = await sendReminders({ nowIso, reminderAdoptions, sendResendEmail })
    expect(result.remindersSent).toBe(1)
  })
})
