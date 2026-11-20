// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	interface TurnstileRenderOptions {
		sitekey: string;
		theme?: 'auto' | 'light' | 'dark';
		callback?: (token: string) => void;
		'expired-callback'?: () => void;
		'error-callback'?: () => void;
	}

	interface TurnstileApi {
		render(container: HTMLElement, options: TurnstileRenderOptions): string;
		reset(widgetId?: string): void;
		remove(widgetId: string): void;
	}

	interface Window {
		turnstile?: TurnstileApi;
	}

	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
