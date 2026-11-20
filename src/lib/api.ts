import { PUBLIC_API_BASE_URL } from '$env/static/public';
import type { ApiResponse, ContactPayload, ReviewPayload } from '../../shared/contracts';

const API_BASE_URL = (PUBLIC_API_BASE_URL ?? '').replace(/\/$/, '');

async function post(path: string, payload: unknown): Promise<ApiResponse> {
	try {
		const response = await fetch(`${API_BASE_URL}${path}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(payload)
		});

		const data = (await response.json().catch(() => null)) as ApiResponse | null;

		if (!data || typeof data.success !== 'boolean') {
			return { success: false, message: `Request failed (${response.status})` };
		}

		return data;
	} catch (error) {
		console.error(`API request to ${path} failed`, error);
		return { success: false, message: 'Network error' };
	}
}

export async function sendEmail(payload: ContactPayload): Promise<ApiResponse> {
	return post('/api/contact', payload);
}

export async function sendReview(payload: ReviewPayload): Promise<ApiResponse> {
	return post('/api/review', payload);
}
