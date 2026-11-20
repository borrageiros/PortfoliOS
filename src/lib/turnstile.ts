const SCRIPT_ID = 'cf-turnstile-script';
const SCRIPT_URL = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

let loadPromise: Promise<void> | null = null;

export function loadTurnstile(): Promise<void> {
	if (typeof window === 'undefined') {
		return Promise.resolve();
	}

	if (window.turnstile) {
		return Promise.resolve();
	}

	if (loadPromise) {
		return loadPromise;
	}

	loadPromise = new Promise((resolve, reject) => {
		const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
		const script = existing ?? document.createElement('script');

		script.addEventListener('load', () => resolve(), { once: true });
		script.addEventListener('error', () => reject(new Error('Turnstile failed to load')), {
			once: true
		});

		if (!existing) {
			script.id = SCRIPT_ID;
			script.src = SCRIPT_URL;
			script.async = true;
			script.defer = true;
			document.head.appendChild(script);
		}
	});

	return loadPromise;
}
