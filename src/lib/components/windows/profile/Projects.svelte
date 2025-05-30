<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import { t } from '$lib/i18n/i18n';
	export let projects: any;

	export let isMobileVersion = false;

	// Helper to get project categories dynamically
	const getProjectCategories = (proj: any) => {
		return Object.keys(proj).map((key) => ({
			key,
			title: proj[key].title,
			items: proj[key].projects
		}));
	};
</script>

<div class="projects-section" class:mobile={isMobileVersion}>
	<h2 class:mobile={isMobileVersion}>
		<Icon name="profile_projects" size="22" />
		<span>{$t('profile.projects')}</span>
	</h2>

	<div class="projects-container" class:mobile={isMobileVersion}>
		{#each getProjectCategories(projects) as category}
			{#if category.items && category.items.length > 0}
				<h2 class="project-category-title" class:mobile={isMobileVersion}>
					{category.title}
				</h2>
				<div class="projects-list" class:mobile={isMobileVersion}>
					{#each category.items as project}
						<a
							href={project.url}
							target="_blank"
							rel="noopener noreferrer"
							class="project-card-link"
							class:mobile={isMobileVersion}
						>
							<div class="project-card" class:mobile={isMobileVersion}>
								<div class="project-image" class:mobile={isMobileVersion}>
									<img src={project.image} alt={project.name} class:mobile={isMobileVersion} />
								</div>
								<div class="project-details" class:mobile={isMobileVersion}>
									<h3 class:mobile={isMobileVersion}>{project.name}</h3>
									<p class:mobile={isMobileVersion}>{project.description}</p>
								</div>
							</div>
						</a>
					{/each}
				</div>
			{/if}
		{/each}
	</div>
</div>

<style>
	.projects-section {
		display: flex;
		flex-direction: column;
		gap: 25px;
		padding: 0 10px;
	}

	.projects-section h2 {
		color: var(--win-accent);
		margin: 0;
		font-size: 22px;
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.projects-container {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.projects-list {
		display: flex;
		flex-direction: column;
		gap: 15px;
		margin-bottom: 100px;
	}

	.project-card-link {
		text-decoration: none;
		color: inherit;
		cursor: pointer;
		display: block;
	}

	.project-card {
		background-color: var(--window-header);
		border-radius: 8px;
		overflow: hidden;
		box-shadow: var(--shadow-light);
		transition:
			transform 0.2s,
			box-shadow 0.2s;
		display: flex;
		border-left: 4px solid transparent;
	}

	.project-card:hover {
		transform: translateX(5px);
		box-shadow: var(--shadow-medium);
		border-left: 4px solid var(--win-accent);
	}

	.project-image {
		width: 220px;
		min-width: 220px;
		height: 140px;
		overflow: hidden;
	}

	.project-image img {
		width: 100%;
		height: 100%;
		object-fit: contain;
		transition: transform 0.3s ease;
	}

	.project-card:hover .project-image img {
		transform: scale(1.05);
	}

	.project-details {
		padding: 15px 20px;
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	.project-details h3 {
		margin: 0 0 10px 0;
		font-size: 18px;
		color: var(--win-accent);
	}

	.project-details p {
		margin: 0;
		font-size: 14px;
		line-height: 1.5;
		color: var(--text-primary);
	}

	.project-category-title {
		color: var(--text-secondary);
		font-size: 18px;
		margin: 25px 0 15px 0;
		padding-bottom: 8px;
		border-bottom: 1px solid var(--taskbar-active);
	}

	@media (max-width: 700px) {
		.project-card {
			flex-direction: column;
		}

		.project-image {
			width: 100%;
			height: 180px;
		}

		.project-card:hover {
			transform: translateY(-5px);
			border-left: none;
			border-top: 4px solid var(--win-accent);
		}
	}

	/* Phone version styles */
	.projects-section.mobile {
		padding: 0 10px;
	}

	.projects-container.mobile {
		display: flex;
		flex-direction: column;
		gap: 15px;
		margin-bottom: 60px;
	}

	.projects-list.mobile {
		display: flex;
		flex-direction: column;
		gap: 15px;
		margin-bottom: 30px;
	}

	.project-card-link.mobile {
		text-decoration: none;
		color: inherit;
		cursor: pointer;
		display: block;
	}

	.project-card.mobile {
		background-color: var(--window-header);
		border-radius: 8px;
		overflow: hidden;
		box-shadow: var(--shadow-light);
		transition:
			transform 0.2s,
			box-shadow 0.2s;
		display: flex;
		flex-direction: column;
		border-left: 4px solid transparent;
	}

	.project-card.mobile:hover {
		transform: translateX(5px);
		box-shadow: var(--shadow-medium);
		border-left: 4px solid var(--win-accent);
	}

	.project-image.mobile {
		width: 100%;
		height: 160px;
		overflow: hidden;
	}

	.project-image.mobile img {
		width: 100%;
		height: 100%;
		margin-top: 10px;
		object-fit: contain;
		transition: transform 0.3s ease;
	}

	.project-card.mobile:hover .project-image.mobile img {
		transform: scale(1.05);
	}

	.project-details.mobile {
		padding: 15px;
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	.project-details.mobile h3 {
		margin: 0 0 10px 0;
		font-size: 1.1rem;
		color: var(--win-accent);
	}

	.project-details.mobile p {
		margin: 0;
		font-size: 0.9rem;
		line-height: 1.5;
		color: var(--text-primary);
	}

	.project-category-title.mobile {
		color: var(--win-accent);
		font-size: 1.1rem;
		margin: 20px 0 15px 0;
		padding-bottom: 8px;
		border-bottom: 1px solid var(--taskbar-active);
	}

	@media (min-width: 600px) {
		.project-card.mobile {
			flex-direction: row;
		}

		.project-image.mobile {
			width: 200px;
			min-width: 200px;
			height: 140px;
		}
	}
</style>
