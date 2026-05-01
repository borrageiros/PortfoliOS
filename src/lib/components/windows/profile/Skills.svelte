<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import { t } from '$lib/i18n/i18n';
	import type { Skills as SkillsData } from '$lib/types/data';
	export let skills: SkillsData;
	export let isMobileVersion = false;
</script>

<div class="skills-section" class:mobile={isMobileVersion}>
	<h2 class="skills-title">
		<Icon name="profile_skills" size="22" />
		<span>{$t('profile.skills')}</span>
	</h2>
	<div class="skills-grid" class:mobile={isMobileVersion}>
		{#each skills.skills as skill, i (i)}
			<div class="skill-card" class:mobile={isMobileVersion}>
				<h3 class="skill-name">{skill.name}</h3>
				{#if skill.items.length > 0}
					<div class="skill-tags">
						{#each skill.items as item, j (j)}
							<span class="skill-tag">{item}</span>
						{/each}
					</div>
				{/if}
			</div>
		{/each}
	</div>
</div>

<style>
	.skills-section {
		padding: 0 10px;
	}

	.skills-title {
		color: var(--win-accent);
		font-size: 22px;
		margin: 0 0 20px 0;
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.skills-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 16px;
	}

	.skill-card {
		background-color: var(--window-header);
		border-radius: 10px;
		padding: 18px 20px;
		box-shadow: var(--shadow-light);
		display: flex;
		flex-direction: column;
		gap: 12px;
		transition:
			transform 0.2s,
			box-shadow 0.2s;
		border-left: 3px solid transparent;
	}

	.skill-card:hover {
		transform: translateY(-3px);
		box-shadow: var(--shadow-medium);
		border-left-color: var(--win-accent);
	}

	.skill-name {
		font-size: 1rem;
		font-weight: 600;
		color: var(--win-accent);
		margin: 0;
	}

	.skill-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
	}

	.skill-tag {
		background-color: var(--taskbar-active);
		color: var(--text-primary);
		padding: 4px 10px;
		border-radius: 20px;
		font-size: 0.78rem;
		transition: background-color 0.2s;
	}

	.skill-card:hover .skill-tag {
		background-color: color-mix(in srgb, var(--win-accent) 15%, var(--taskbar-active));
	}

	.skills-grid.mobile {
		grid-template-columns: 1fr;
		margin-bottom: 60px;
	}

	.skill-card.mobile {
		padding: 14px 16px;
	}
</style>
