
import { NextRequest, NextResponse } from 'next/server';

// Função para enviar e-mail via Resend API
async function sendResendEmail({ to, subject, html, text }: { to: string, subject: string, html: string, text?: string }) {
	const apiKey = process.env.RESEND_API_KEY;
	const from = process.env.RESEND_FROM || 'admin@joylandweb.com';
	if (!apiKey || !from) {
		console.warn('⚠️ Email not sent: RESEND_API_KEY or RESEND_FROM missing');
		return false;
	}
	try {
		const response = await fetch('https://api.resend.com/emails', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${apiKey}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ from, to, subject, html, text }),
		});
		if (!response.ok) {
			const errorText = await response.text();
			console.error('❌ Resend error:', errorText);
			return false;
		}
		return true;
	} catch (error) {
		console.error('❌ Resend request failed:', error);
		return false;
	}
}

export async function POST(req: NextRequest) {
	try {
		const authHeader = req.headers.get('authorization');
		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}
		// Não precisa validar admin, só autenticação básica
		const { toEmail, toName, subject, message } = await req.json();
		if (!toEmail || !subject || !message) {
			return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
		}
		const html = `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937;"><h2>${subject}</h2><p>Hola ${toName},</p><p>${message}</p></div>`;
		const emailSent = await sendResendEmail({ to: toEmail, subject, html, text: message });
		if (emailSent) {
			return NextResponse.json({ success: true });
		} else {
			return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
		}
	} catch (error: unknown) {
		console.error('Error in admin reply:', error);
		const message = typeof error === 'object' && error !== null && 'message' in error
			? (error as { message: string }).message
			: 'Unknown error';
		return NextResponse.json({ error: 'Internal server error', details: message }, { status: 500 });
	}
}




