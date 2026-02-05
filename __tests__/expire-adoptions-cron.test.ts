import { createMocks } from 'node-mocks-http'
import handler from '../../app/api/cron/expire-adoptions/route'
import { supabaseAdmin } from '../../lib/supabaseAdmin'

describe('CRON expire-adoptions', () => {
  it('marca reminder_sent_at aunque falle el email', async () => {
    // Simula una adopción elegible
    const adoptionId = 'test-adoption-id'
    const nowIso = new Date().toISOString()
    // Mock supabaseAdmin
    const updateMock = jest.fn().mockResolvedValue({ error: null })
    supabaseAdmin.from = jest.fn().mockReturnValue({
      update: updateMock,
      eq: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      gte: jest.fn().mockReturnThis(),
      lt: jest.fn().mockReturnThis(),
      is: jest.fn().mockReturnThis(),
      // ...otros métodos mockeados si es necesario
    })
    // Mock sendResendEmail para forzar fallo
    jest.spyOn(require('../../app/api/cron/expire-adoptions/route'), 'sendResendEmail').mockResolvedValue(false)

    // Simula request
    const { req, res } = createMocks({
      method: 'POST',
      headers: { authorization: `Bearer ${process.env.CRON_SECRET}` },
    })
    await handler(req, res)
    // Verifica que se intentó actualizar reminder_sent_at
    expect(updateMock).toHaveBeenCalledWith({ reminder_sent_at: expect.any(String) })
  })
})
