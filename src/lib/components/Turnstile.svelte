<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { PUBLIC_TURNSTILE_SITE_KEY } from '$env/static/public';
	import { loadTurnstile } from '$lib/turnstile';

	export let onToken: (token: string) => void = () => {};

	const siteKey = PUBLIC_TURNSTILE_SITE_KEY;

	let container: HTMLDivElement;
	let widgetId: string | null = null;
	let disposed = false;

	onMount(() => {
		if (!siteKey) {
			return;
		}

		loadTurnstile()
			.then(() => {
				if (disposed || !window.turnstile || !container) {
					return;
				}

				widgetId = window.turnstile.render(container, {
					sitekey: siteKey,
					theme: 'auto',
					callback: (token) => onToken(token),
					'expired-callback': () => onToken(''),
					'error-callback': () => onToken('')
				});
			})
			.catch((error) => console.error('Turnstile failed to load', error));
	});

	onDestroy(() => {
		disposed = true;
		if (widgetId && window.turnstile) {
			window.turnstile.remove(widgetId);
		}
	});
</script>

{#if siteKey}
	<div class="turnstile" bind:this={container}></div>
{/if}

<style>
	.turnstile {
		display: flex;
		justify-content: center;
	}
</style>
