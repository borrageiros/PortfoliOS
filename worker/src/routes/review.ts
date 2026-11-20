import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import type { ApiResponse } from '../../../shared/contracts';
import type { Env } from '../env';
import { sendEmail } from '../lib/email';
import { escapeHtml, textToHtml } from '../lib/html';
import { reviewSchema } from '../lib/schemas';
import { isTelegramConfigured, notifyTelegram } from '../lib/telegram';
import { verifyTurnstile } from '../lib/turnstile';

export const review = new Hono<{ Bindings: Env }>();

review.post(
	'/',
	zValidator('json', reviewSchema, (result, c) => {
		if (!result.success) {
			return c.json<ApiResponse>({ success: false, message: 'Invalid review payload' }, 400);
		}
	}),
	async (c) => {
		const data = c.req.valid('json');

		// Honeypot: silently accept and drop bot submissions.
		if (data.website) {
			return c.json<ApiResponse>({ success: true, message: 'Review submitted successfully' });
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
			'New Review Submission',
			'',
			`Name: ${data.name}`,
			data.job ? `Job: ${data.job}` : '',
			data.url ? `LinkedIn/URL: ${data.url}` : '',
			data.avatarUrl ? `Avatar: ${data.avatarUrl}` : '',
			'',
			'Review:',
			data.review
		]
			.filter((line) => line !== '')
			.join('\n');

		const html = [
			'<h2>New Review Submission</h2>',
			`<p><strong>Name:</strong> ${escapeHtml(data.name)}</p>`,
			data.job ? `<p><strong>Job:</strong> ${escapeHtml(data.job)}</p>` : '',
			data.url
				? `<p><strong>LinkedIn/URL:</strong> <a href="${escapeHtml(data.url)}">${escapeHtml(data.url)}</a></p>`
				: '',
			data.avatarUrl
				? `<p><strong>Avatar:</strong></p><p><img src="${escapeHtml(data.avatarUrl)}" alt="User avatar" style="max-width: 200px; max-height: 200px;"></p>`
				: '',
			'<p><strong>Review:</strong></p>',
			`<p>${textToHtml(data.review)}</p>`
		]
			.filter(Boolean)
			.join('\n');

		try {
			await sendEmail(c.env, {
				subject: `Portfolio Review: ${data.name}`,
				text,
				html,
				replyTo: undefined
			});
		} catch (error) {
			console.error('Failed to send review email', error);
			return c.json<ApiResponse>({ success: false, message: 'Failed to submit review' }, 500);
		}

		if (isTelegramConfigured(c.env)) {
			const telegramText = [
				'⭐ <b>New portfolio review</b>',
				'',
				`<b>Name:</b> ${escapeHtml(data.name)}`,
				data.job ? `<b>Job:</b> ${escapeHtml(data.job)}` : '',
				data.url ? `<b>LinkedIn/URL:</b> ${escapeHtml(data.url)}` : '',
				data.avatarUrl ? `<b>Avatar:</b> ${escapeHtml(data.avatarUrl)}` : '',
				'',
				`<b>Review:</b>\n${escapeHtml(data.review)}`
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
				? 'Review submitted successfully via email and Telegram'
				: 'Review submitted successfully via email'
		});
	}
);
