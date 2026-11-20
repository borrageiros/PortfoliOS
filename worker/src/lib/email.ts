import type { Env } from '../env';

interface EmailMessage {
	subject: string;
	text: string;
	html: string;
	replyTo?: string;
}

export async function sendEmail(env: Env, message: EmailMessage): Promise<void> {
	if (!env.RESEND_API_KEY || !env.EMAIL_FROM || !env.EMAIL_TO) {
		throw new Error('Email is not configured');
	}

	const body: Record<string, unknown> = {
		from: env.EMAIL_FROM,
		to: [env.EMAIL_TO],
		subject: message.subject,
		text: message.text,
		html: message.html
	};

	if (message.replyTo) {
		body.reply_to = message.replyTo;
	}

	const response = await fetch('https://api.resend.com/emails', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${env.RESEND_API_KEY}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(body)
	});

	if (!response.ok) {
		throw new Error(`Resend request failed (${response.status}): ${await response.text()}`);
	}
}
