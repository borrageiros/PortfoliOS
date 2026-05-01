<script lang="ts">
	import { goto } from '$app/navigation';
	import Icon from '$lib/components/Icon.svelte';

	export let label = '';
	export let title = '';
	export let destination = '/';
	export let icon = '';
	export let variant: 'pill' | 'menu' = 'pill';
	export let fullWidth = false;

	function navigate() {
		goto(destination);
	}
</script>

<button
	class="version-switch-button {variant} {fullWidth ? 'full-width' : ''}"
	on:click={navigate}
	title={title || label}
>
	{#if icon}
		<Icon name={icon} size={variant === 'pill' ? '16' : '14'} />
	{/if}
	<span>{label}</span>
</button>

<style>
	.version-switch-button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		border: 1px solid var(--border-light);
		background-color: var(--taskbar-hover);
		color: var(--text-secondary);
		cursor: pointer;
		transition: all 0.2s ease;
		white-space: nowrap;
	}

	.version-switch-button.pill {
		border-radius: 20px;
		padding: 0 16px;
		height: 50px;
		font-size: 13px;
	}

	.version-switch-button.menu {
		border-radius: 6px;
		padding: 8px 12px;
		font-size: 0.85rem;
	}

	.version-switch-button.full-width {
		width: 100%;
	}

	.version-switch-button:hover {
		background-color: var(--taskbar-active);
		color: var(--text-primary);
	}

	.version-switch-button.menu:hover {
		background-color: var(--win-accent);
		color: white;
		border-color: var(--win-accent);
	}
</style>
