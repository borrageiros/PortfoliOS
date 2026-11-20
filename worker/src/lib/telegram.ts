import type { Env } from '../env';

export function isTelegramConfigured(env: Env): boolean {
	return Boolean(env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID);
}

export async function notifyTelegram(env: Env, text: string): Promise<void> {
	if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) {
		return;
	}

	const response = await fetch(
		`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				chat_id: env.TELEGRAM_CHAT_ID,
				text,
				parse_mode: 'HTML',
				disable_web_page_preview: true
			})
		}
	);

	if (!response.ok) {
		throw new Error(`Telegram request failed (${response.status})`);
	}
}
