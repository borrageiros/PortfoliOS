export interface ApiResponse {
	success: boolean;
	message: string;
}

export interface ContactPayload {
	name: string;
	message: string;
	email?: string;
	phone?: string;
	company?: string;
	website?: string;
	turnstileToken?: string;
}

export interface ReviewPayload {
	name: string;
	review: string;
	job?: string;
	url?: string;
	avatarUrl?: string;
	website?: string;
	turnstileToken?: string;
}
