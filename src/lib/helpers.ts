import { locale } from '$lib/i18n/i18n';
import { get } from 'svelte/store';

function isMobileUserAgent() {
	if (typeof navigator === 'undefined') return false;
	return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function isMobileScreen() {
	if (typeof window === 'undefined') return false;
	return window.innerWidth <= 768;
}

export function isMobile() {
	return isMobileUserAgent() || isMobileScreen();
}

const LOCALE_KEYS = new Set(['es', 'en']);

function isLocaleMap(value: unknown): value is Record<string, unknown> {
	if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
	const keys = Object.keys(value as object);
	return keys.length > 0 && keys.every((k) => LOCALE_KEYS.has(k));
}

function resolveValue(value: unknown, loc: string): unknown {
	if (isLocaleMap(value)) {
		const map = value as Record<string, unknown>;
		return map[loc] ?? map['en'];
	}
	if (Array.isArray(value)) {
		return value.map((item) => resolveValue(item, loc));
	}
	if (value && typeof value === 'object') {
		return resolveFieldFirst(value as Record<string, unknown>, loc);
	}
	return value;
}

function resolveFieldFirst(data: Record<string, unknown>, loc: string): Record<string, unknown> {
	const result: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(data)) {
		result[key] = resolveValue(value, loc);
	}
	return result;
}

export async function loadData<T>(section: string): Promise<T | null> {
	try {
		const response = await fetch(`/data/${section}.json`);
		if (!response.ok) {
			throw new Error(`Error loading ${section} data`);
		}
		const responseData = (await response.json()) as Record<string, unknown>;
		const currentLocale = get(locale);
		return resolveFieldFirst(responseData, currentLocale) as T;
	} catch (error) {
		console.error(`Failed to load ${section} data:`, error);
		return null;
	}
}
