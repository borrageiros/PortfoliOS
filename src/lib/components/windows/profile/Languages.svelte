<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import { icons } from '$lib/icons';
	import { t } from '$lib/i18n/i18n';
	import type { Languages as LanguagesData } from '$lib/types/data';
	export let languages: LanguagesData;
	export let isMobileVersion = false;
</script>

<div class="languages-section" class:mobile={isMobileVersion}>
	<h2>
		<Icon name="profile_languages" size="22" />
		<span>{$t('profile.languages')}</span>
	</h2>
	<div class="languages-grid" class:mobile={isMobileVersion}>
		{#each languages.languages as language, i (i)}
			<div class="language-card" class:mobile={isMobileVersion}>
				<div class="language-header">
					<!-- eslint-disable-next-line svelte/no-at-html-tags -->
					<div class="language-flag">{@html icons[language.flag]}</div>
					<div class="language-info">
						<h3 class="language-name">{language.name}</h3>
						<span class="language-level">{language.level}</span>
					</div>
				</div>
				<div class="language-bar-track">
					<div class="language-bar-fill" style="width: {language.percentage}%"></div>
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.languages-section {
		display: flex;
		flex-direction: column;
		gap: 15px;
		padding: 0 10px;
	}

	.languages-section h2 {
		color: var(--win-accent);
		margin: 0;
		font-size: 22px;
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.languages-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 20px;
		margin-top: 10px;
	}

	.language-card {
		background-color: var(--window-header);
		border-radius: 10px;
		padding: 20px 24px;
		box-shadow: var(--shadow-light);
		display: flex;
		flex-direction: column;
		gap: 16px;
		transition:
			transform 0.2s,
			box-shadow 0.2s;
	}

	.language-card:hover {
		transform: translateY(-4px);
		box-shadow: var(--shadow-medium);
	}

	.language-header {
		display: flex;
		align-items: center;
		gap: 16px;
	}

	.language-flag {
		width: 54px;
		height: 36px;
		flex-shrink: 0;
		border-radius: 4px;
		overflow: hidden;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
		display: flex;
		align-items: stretch;
	}

	.language-flag :global(svg) {
		display: block;
		width: 100%;
		height: 100%;
	}

	.language-info {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.language-name {
		font-size: 1.2rem;
		font-weight: 600;
		color: var(--win-accent);
		margin: 0;
	}

	.language-level {
		font-size: 0.8rem;
		color: var(--text-secondary);
		background-color: var(--taskbar-active);
		padding: 3px 10px;
		border-radius: 20px;
		display: inline-block;
		width: fit-content;
	}

	.language-bar-track {
		width: 100%;
		height: 6px;
		background-color: var(--taskbar-active);
		border-radius: 999px;
		overflow: hidden;
	}

	.language-bar-fill {
		height: 100%;
		background-color: var(--win-accent);
		border-radius: 999px;
		transition: width 0.6s ease;
	}

	.languages-grid.mobile {
		grid-template-columns: 1fr;
		margin-bottom: 60px;
	}

	.language-card.mobile {
		padding: 16px 18px;
	}
</style>
