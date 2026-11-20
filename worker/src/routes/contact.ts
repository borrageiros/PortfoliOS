import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import type { ApiResponse } from '../../../shared/contracts';
import type { Env } from '../env';
import { sendEmail } from '../lib/email';
import { escapeHtml, textToHtml } from '../lib/html';
import { contactSchema } from '../lib/schemas';
import { isTelegramConfigured, notifyTelegram } from '../lib/telegram';
import { verifyTurnstile } from '../lib/turnstile';

export const contact = new Hono<{ Bindings: Env }>();

contact.post(
	'/',
	zValidator('json', contactSchema, (result, c) => {
		if (!result.success) {
			return c.json<ApiResponse>({ success: false, message: 'Invalid contact payload' }, 400);
		}
	}),
	async (c) => {
		const data = c.req.valid('json');

		// Honeypot: silently accept and drop bot submissions.
		if (data.website) {
			return c.json<ApiResponse>({ success: true, message: 'Message sent' });
		}

		const human = await verifyTurnstile(
			c.env,
			data.turnstileToken,
			c.req.header('CF-Connecting-IP')
		);

		if (!human) {
			return c.json<ApiResponse>({ success: false, message: 'Captcha verification failed' }, 400);
		}

		const text = [
			`Name: ${data.name}`,
			data.email ? `Email: ${data.email}` : '',
			data.phone ? `Phone: ${data.phone}` : '',
			data.company ? `Company: ${data.company}` : '',
			'',
			'Message:',
			data.message
		]
			.filter((line) => line !== '')
			.join('\n');

		const html = [
			`<p><strong>Name:</strong> ${escapeHtml(data.name)}</p>`,
			data.email ? `<p><strong>Email:</strong> ${escapeHtml(data.email)}</p>` : '',
			data.phone ? `<p><strong>Phone:</strong> ${escapeHtml(data.phone)}</p>` : '',
			data.company ? `<p><strong>Company:</strong> ${escapeHtml(data.company)}</p>` : '',
			'<p><strong>Message:</strong></p>',
			`<p>${textToHtml(data.message)}</p>`
		]
			.filter(Boolean)
			.join('\n');

		try {
			await sendEmail(c.env, {
				subject: `Portfolio Contact: ${data.name}`,
				text,
				html,
				replyTo: data.email || undefined
			});
		} catch (error) {
			console.error('Failed to send contact email', error);
			return c.json<ApiResponse>({ success: false, message: 'Failed to send email' }, 500);
		}

		if (isTelegramConfigured(c.env)) {
			const telegramText = [
				'📨 <b>New portfolio contact</b>',
				'',
				`<b>Name:</b> ${escapeHtml(data.name)}`,
				data.email ? `<b>Email:</b> ${escapeHtml(data.email)}` : '',
				data.phone ? `<b>Phone:</b> ${escapeHtml(data.phone)}` : '',
				data.company ? `<b>Company:</b> ${escapeHtml(data.company)}` : '',
				'',
				`<b>Message:</b>\n${escapeHtml(data.message)}`
			]
				.filter(Boolean)
				.join('\n');

			try {
				await notifyTelegram(c.env, telegramText);
			} catch (error) {
				console.error('Failed to send Telegram notification', error);
			}
		}

		return c.json<ApiResponse>({
			success: true,
			message: isTelegramConfigured(c.env)
				? 'Email and Telegram notification sent successfully'
				: 'Email sent successfully'
		});
	}
);
