import { Hono } from 'hono';
import type { Env } from './env';
import { contact } from './routes/contact';
import { review } from './routes/review';

const MAX_BODY_BYTES = 64 * 1024;

const app = new Hono<{ Bindings: Env }>();

app.use('*', async (c, next) => {
	const origin = c.req.header('Origin');
	const allowed = (c.env.ALLOWED_ORIGINS ?? '')
		.split(',')
		.map((value) => value.trim())
		.filter(Boolean);

	if (origin && allowed.includes(origin)) {
		c.header('Access-Control-Allow-Origin', origin);
		c.header('Vary', 'Origin');
	}

	c.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
	c.header('Access-Control-Allow-Headers', 'Content-Type');
	c.header('Access-Control-Max-Age', '86400');

	if (c.req.method === 'OPTIONS') {
		return c.body(null, 204);
	}

	if (c.req.method === 'POST') {
		const length = Number(c.req.header('Content-Length') ?? '0');
		if (Number.isFinite(length) && length > MAX_BODY_BYTES) {
			return c.json({ success: false, message: 'Payload too large' }, 413);
		}
	}

	await next();
});

app.get('/', (c) => c.json({ ok: true, service: 'portfolios-api' }));
app.get('/health', (c) => c.json({ ok: true }));

app.route('/api/contact', contact);
app.route('/api/review', review);

app.notFound((c) => c.json({ success: false, message: 'Not found' }, 404));

app.onError((error, c) => {
	console.error('Unhandled error', error);
	return c.json({ success: false, message: 'Internal error' }, 500);
});

export default app;
