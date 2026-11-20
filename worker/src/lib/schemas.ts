import { z } from 'zod';

const optionalEmail = z.union([z.literal(''), z.string().trim().email().max(200)]).optional();

const optionalUrl = z.union([z.literal(''), z.string().trim().url().max(500)]).optional();

export const contactSchema = z.object({
	name: z.string().trim().min(1).max(100),
	message: z.string().trim().min(1).max(5000),
	email: optionalEmail,
	phone: z.string().trim().max(50).optional(),
	company: z.string().trim().max(150).optional(),
	website: z.string().max(500).optional(),
	turnstileToken: z.string().max(4096).optional()
});

export const reviewSchema = z.object({
	name: z.string().trim().min(1).max(120),
	review: z.string().trim().min(1).max(5000),
	job: z.string().trim().max(150).optional(),
	url: optionalUrl,
	avatarUrl: optionalUrl,
	website: z.string().max(500).optional(),
	turnstileToken: z.string().max(4096).optional()
});
