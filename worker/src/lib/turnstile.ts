import type { Env } from '../env';

const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export async function verifyTurnstile(
	env: Env,
	token: string | undefined,
	remoteIp: string | undefined
): Promise<boolean> {
	if (!env.TURNSTILE_SECRET) {
		return true;
	}

	if (!token) {
		return false;
	}

	const body = new FormData();
	body.append('secret', env.TURNSTILE_SECRET);
	body.append('response', token);
	if (remoteIp) {
		body.append('remoteip', remoteIp);
	}

	const response = await fetch(VERIFY_URL, { method: 'POST', body });

	if (!response.ok) {
		return false;
	}

	const result = (await response.json()) as { success?: boolean };
	return result.success === true;
}
