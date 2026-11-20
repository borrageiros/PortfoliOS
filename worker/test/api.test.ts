import { afterEach, describe, expect, it, vi } from 'vitest';
import app from '../src/index';
import type { Env } from '../src/env';

const baseEnv: Env = {
	RESEND_API_KEY: 're_test',
	EMAIL_FROM: 'contact@example.com',
	EMAIL_TO: 'owner@example.com',
	TELEGRAM_BOT_TOKEN: 'test-token',
	TELEGRAM_CHAT_ID: '123456',
	ALLOWED_ORIGINS: 'http://localhost:5173'
};

function mockFetch() {
	const fn = vi.fn(async () => new Response('{}', { status: 200 }));
	vi.stubGlobal('fetch', fn);
	return fn;
}

function post(path: string, body: unknown, env: Env = baseEnv) {
	return app.request(
		path,
		{
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body)
		},
		env
	);
}

afterEach(() => {
	vi.unstubAllGlobals();
});

describe('POST /api/contact', () => {
	it('sends an email and a Telegram notification', async () => {
		const fetchMock = mockFetch();

		const response = await post('/api/contact', {
			name: 'Ada',
			message: 'Hola',
			email: 'ada@example.com'
		});

		expect(response.status).toBe(200);
		expect(await response.json()).toMatchObject({ success: true });
		expect(fetchMock).toHaveBeenCalledTimes(2);
	});

	it('rejects invalid payloads', async () => {
		const fetchMock = mockFetch();

		const response = await post('/api/contact', { name: '', message: '' });

		expect(response.status).toBe(400);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('silently drops honeypot submissions', async () => {
		const fetchMock = mockFetch();

		const response = await post('/api/contact', {
			name: 'Bot',
			message: 'spam',
			website: 'https://spam.example'
		});

		expect(response.status).toBe(200);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects requests when Turnstile fails', async () => {
		const fetchMock = vi.fn(async (url: string) => {
			if (url.includes('siteverify')) {
				return new Response(JSON.stringify({ success: false }), { status: 200 });
			}
			return new Response('{}', { status: 200 });
		});
		vi.stubGlobal('fetch', fetchMock);

		const response = await post(
			'/api/contact',
			{ name: 'Ada', message: 'Hola', turnstileToken: 'invalid' },
			{ ...baseEnv, TURNSTILE_SECRET: 'secret' }
		);

		expect(response.status).toBe(400);
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});
});

describe('POST /api/review', () => {
	it('sends the review and accepts optional fields', async () => {
		const fetchMock = mockFetch();

		const response = await post('/api/review', {
			name: 'Grace',
			review: 'Great work',
			job: 'CTO',
			url: 'https://example.com'
		});

		expect(response.status).toBe(200);
		expect(await response.json()).toMatchObject({ success: true });
		expect(fetchMock).toHaveBeenCalledTimes(2);
	});
});

describe('CORS', () => {
	it('answers preflight requests for allowed origins', async () => {
		const response = await app.request(
			'/api/contact',
			{
				method: 'OPTIONS',
				headers: { Origin: 'http://localhost:5173' }
			},
			baseEnv
		);

		expect(response.status).toBe(204);
		expect(response.headers.get('Access-Control-Allow-Origin')).toBe('http://localhost:5173');
	});
});
