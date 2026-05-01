<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import { t } from '$lib/i18n/i18n';
	import type { Informatic as InformaticData } from '$lib/types/data';
	export let informatic: InformaticData;
	export let isMobileVersion = false;

	const LEVEL_ADVANCED = ['avanzado', 'advanced'];
	const LEVEL_BASIC = ['básico', 'basic'];

	function levelVariant(level: string): 'advanced' | 'intermediate' | 'basic' {
		const l = level.toLowerCase();
		if (LEVEL_ADVANCED.includes(l)) return 'advanced';
		if (LEVEL_BASIC.includes(l)) return 'basic';
		return 'intermediate';
	}
</script>

<div class="informatic-section" class:mobile={isMobileVersion}>
	<h2 class="informatic-title">
		<Icon name="profile_informatic" size="22" />
		<span>{$t('profile.programmingLanguages')}</span>
	</h2>
	<div class="informatic-grid" class:mobile={isMobileVersion}>
		{#each informatic.programming as item, i (i)}
			<div class="informatic-card" class:mobile={isMobileVersion}>
				<div class="item-initial variant-{levelVariant(item.level)}">
					{item.icon.charAt(0).toUpperCase()}
				</div>
				<div class="item-info">
					<span class="item-name">{item.name}</span>
					<span class="item-level variant-{levelVariant(item.level)}">{item.level}</span>
				</div>
			</div>
		{/each}
	</div>

	<h2 class="informatic-title">
		<Icon name="profile_informatic" size="22" />
		<span>{$t('profile.aiTools')}</span>
	</h2>
	<div class="informatic-grid" class:mobile={isMobileVersion}>
		{#each informatic.ai as item, i (i)}
			<div class="informatic-card" class:mobile={isMobileVersion}>
				<div class="item-initial variant-{levelVariant(item.level)}">
					{item.icon.charAt(0).toUpperCase()}
				</div>
				<div class="item-info">
					<span class="item-name">{item.name}</span>
					<span class="item-level variant-{levelVariant(item.level)}">{item.level}</span>
				</div>
			</div>
		{/each}
	</div>

	<h2 class="informatic-title">
		<Icon name="tool" size="22" />
		<span>{$t('profile.softwareTools')}</span>
	</h2>
	<div class="informatic-grid" class:mobile={isMobileVersion}>
		{#each informatic.software as item, i (i)}
			<div class="informatic-card" class:mobile={isMobileVersion}>
				<div class="item-initial variant-{levelVariant(item.level)}">
					{item.icon.charAt(0).toUpperCase()}
				</div>
				<div class="item-info">
					<span class="item-name">{item.name}</span>
					<span class="item-level variant-{levelVariant(item.level)}">{item.level}</span>
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.informatic-section {
		padding: 0 10px;
		display: flex;
		flex-direction: column;
		gap: 0;
	}

	.informatic-title {
		color: var(--win-accent);
		font-size: 22px;
		margin: 0 0 16px 0;
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.informatic-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 10px;
		margin-bottom: 32px;
	}

	.informatic-card {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 12px 14px;
		background-color: var(--window-header);
		border-radius: 8px;
		box-shadow: var(--shadow-light);
		transition:
			transform 0.2s,
			box-shadow 0.2s;
		border-left: 3px solid transparent;
	}

	.informatic-card:hover {
		transform: translateY(-2px);
		box-shadow: var(--shadow-medium);
	}

	.informatic-card:hover .item-initial.variant-advanced {
		border-left-color: var(--win-accent);
	}

	.item-initial {
		width: 40px;
		height: 40px;
		border-radius: 8px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.1rem;
		font-weight: 700;
		flex-shrink: 0;
		color: white;
	}

	.item-initial.variant-advanced {
		background-color: var(--win-accent);
	}

	.item-initial.variant-intermediate {
		background-color: var(--text-secondary);
	}

	.item-initial.variant-basic {
		background-color: var(--taskbar-active);
		color: var(--text-secondary);
	}

	.item-info {
		display: flex;
		flex-direction: column;
		gap: 4px;
		min-width: 0;
	}

	.item-name {
		font-weight: 600;
		font-size: 0.95rem;
		color: var(--text-primary);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.item-level {
		font-size: 0.72rem;
		padding: 2px 8px;
		border-radius: 20px;
		width: fit-content;
		font-weight: 500;
	}

	.item-level.variant-advanced {
		background-color: color-mix(in srgb, var(--win-accent) 20%, transparent);
		color: var(--win-accent);
	}

	.item-level.variant-intermediate {
		background-color: var(--taskbar-active);
		color: var(--text-secondary);
	}

	.item-level.variant-basic {
		background-color: var(--taskbar-hover);
		color: var(--text-secondary);
	}

	.informatic-grid.mobile {
		grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
		margin-bottom: 24px;
	}

	.informatic-card.mobile {
		padding: 10px 12px;
	}
</style>
