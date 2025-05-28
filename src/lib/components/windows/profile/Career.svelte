<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import { t } from '$lib/i18n/i18n';
	export let career: any;

	export let isMobileVersion = false;
</script>

<div class="career-section" class:mobile={isMobileVersion}>
	<h2 class:mobile={isMobileVersion}>
		<Icon name="profile_career" size="22" />
		<span>{$t('profile.career')}</span>
	</h2>

	<div class="timeline-container" class:mobile={isMobileVersion}>
		{#each career.steps as entry, index}
			<div
				class="timeline-item {index % 2 === 0 ? 'left' : 'right'}"
				class:mobile={isMobileVersion}
			>
				<div class="timeline-marker" class:mobile={isMobileVersion}>
					<div
						class="timeline-icon {entry.type === 'school' ? 'school' : 'work'}"
						class:mobile={isMobileVersion}
					>
						<Icon name={entry.type === 'school' ? 'school' : 'briefcase'} size="18" />
					</div>
				</div>
				<a
					href={entry.url}
					target="_blank"
					rel="noopener noreferrer"
					class="timeline-content-link"
					class:mobile={isMobileVersion}
				>
					<div class="timeline-content" class:mobile={isMobileVersion}>
						<div class="timeline-header" class:mobile={isMobileVersion}>
							<h3 class="timeline-title" class:mobile={isMobileVersion}>
								{entry.where}
							</h3>
							<span class="timeline-date" class:mobile={isMobileVersion}
								>{entry.from} - {entry.to}</span
							>
						</div>
						<div class="timeline-body" class:mobile={isMobileVersion}>
							<p class:mobile={isMobileVersion}>{entry.what}</p>
						</div>
					</div>
				</a>
			</div>
		{/each}
	</div>
</div>

<style>
	.career-section {
		display: flex;
		flex-direction: column;
		gap: 15px;
		padding: 0 10px;
	}

	.career-section h2 {
		color: var(--win-accent);
		margin: 0;
		font-size: 22px;
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.timeline-container {
		position: relative;
		margin: 20px auto;
		padding: 20px 0;
		max-width: 900px;
	}

	.timeline-container::before {
		content: '';
		position: absolute;
		top: 0;
		bottom: 0;
		left: 50%;
		width: 2px;
		margin-left: -1px;
		background-color: var(--taskbar-active);
	}

	.timeline-item {
		position: relative;
		margin-bottom: 50px;
		width: 50%;
		box-sizing: border-box;
	}

	.timeline-item:last-child {
		margin-bottom: 0;
	}

	.timeline-item.left {
		float: left;
		padding-right: 40px;
		clear: both;
	}

	.timeline-item.right {
		float: right;
		padding-left: 40px;
		clear: both;
	}

	.timeline-marker {
		position: absolute;
		top: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.timeline-item.left .timeline-marker {
		right: -20px;
	}

	.timeline-item.right .timeline-marker {
		left: -20px;
	}

	.timeline-icon {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background-color: var(--win-accent);
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		z-index: 1;
		box-shadow: 0 0 0 4px var(--window-bg);
	}

	.timeline-icon.school {
		background-color: #4caf50;
	}

	.timeline-icon.work {
		background-color: #2196f3;
	}

	.timeline-content-link {
		text-decoration: none;
		color: inherit;
		display: block;
		width: 100%;
	}

	.timeline-content {
		background-color: var(--window-header);
		border-radius: 8px;
		padding: 15px 20px;
		box-shadow: var(--shadow-light);
		transition:
			transform 0.2s,
			box-shadow 0.2s;
		position: relative;
	}

	.timeline-item.left .timeline-content {
		border-right: 4px solid transparent;
	}

	.timeline-item.right .timeline-content {
		border-left: 4px solid transparent;
	}

	.timeline-item.left .timeline-content-link:hover .timeline-content {
		transform: translateX(-5px);
		box-shadow: var(--shadow-medium);
		border-right: 4px solid var(--win-accent);
	}

	.timeline-item.right .timeline-content-link:hover .timeline-content {
		transform: translateX(5px);
		box-shadow: var(--shadow-medium);
		border-left: 4px solid var(--win-accent);
	}

	.timeline-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 10px;
		flex-wrap: wrap;
		gap: 8px;
	}

	.timeline-title {
		margin: 0;
		font-size: 1.1rem;
		color: var(--text-primary);
	}

	.timeline-date {
		color: var(--text-secondary);
		font-size: 0.9rem;
		background-color: var(--taskbar-active);
		padding: 3px 8px;
		border-radius: 4px;
	}

	.timeline-body {
		color: var(--text-primary);
	}

	.timeline-body p {
		margin: 0;
		line-height: 1.5;
	}

	/* Flechas o triángulos para los elementos de la línea del tiempo */
	.timeline-item.left .timeline-content::after {
		content: '';
		position: absolute;
		top: 10px;
		right: -10px;
		width: 0;
		height: 0;
		border-top: 10px solid transparent;
		border-bottom: 10px solid transparent;
		border-left: 10px solid var(--window-header);
	}

	.timeline-item.right .timeline-content::after {
		content: '';
		position: absolute;
		top: 10px;
		left: -10px;
		width: 0;
		height: 0;
		border-top: 10px solid transparent;
		border-bottom: 10px solid transparent;
		border-right: 10px solid var(--window-header);
	}

	/* Clearfix para los elementos flotantes */
	.timeline-container::after {
		content: '';
		display: table;
		clear: both;
	}

	@media (max-width: 768px) {
		.timeline-container::before {
			left: 20px;
		}

		.timeline-item {
			width: 100%;
			padding-left: 60px;
			padding-right: 0;
		}

		.timeline-item.left,
		.timeline-item.right {
			float: none;
			clear: both;
			padding-left: 60px;
			padding-right: 0;
		}

		.timeline-item.left .timeline-marker,
		.timeline-item.right .timeline-marker {
			left: 0;
			right: auto;
		}

		.timeline-item.left .timeline-content::after,
		.timeline-item.right .timeline-content::after {
			left: -10px;
			right: auto;
			border-right: 10px solid var(--window-header);
			border-left: 0;
		}

		.timeline-item.left .timeline-content-link:hover .timeline-content,
		.timeline-item.right .timeline-content-link:hover .timeline-content {
			transform: translateX(5px);
			border-left: 4px solid var(--win-accent);
			border-right: none;
		}
	}

	/* Phone version styles */
	.career-section.mobile {
		display: flex;
		flex-direction: column;
		gap: 15px;
		padding: 0 10px;
		margin-bottom: 60px;
	}

	.career-section.mobile h2 {
		color: var(--win-accent);
		margin: 0;
		font-size: 22px;
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.timeline-container.mobile {
		position: relative;
		margin: 20px auto;
		padding: 20px 0;
		max-width: 900px;
	}

	.timeline-container.mobile::before {
		content: '';
		position: absolute;
		top: 0;
		bottom: 0;
		left: 20px;
		width: 2px;
		margin-left: -1px;
		background-color: var(--taskbar-active);
	}

	.timeline-item.mobile {
		position: relative;
		margin-bottom: 50px;
		width: 100%;
		box-sizing: border-box;
		padding-left: 60px;
		padding-right: 0;
		float: none;
		clear: both;
	}

	.timeline-item.mobile:last-child {
		margin-bottom: 0;
	}

	.timeline-item.left.mobile,
	.timeline-item.right.mobile {
		float: none;
		clear: both;
		padding-left: 60px;
		padding-right: 0;
	}

	.timeline-marker.mobile {
		position: absolute;
		top: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.timeline-item.left.mobile .timeline-marker,
	.timeline-item.right.mobile .timeline-marker {
		left: 0;
		right: auto;
	}

	.timeline-icon.mobile {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background-color: var(--win-accent);
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		z-index: 1;
		box-shadow: 0 0 0 4px var(--window-bg);
	}

	.timeline-icon.school.mobile {
		background-color: #4caf50;
	}

	.timeline-icon.work.mobile {
		background-color: #2196f3;
	}

	.timeline-content-link.mobile {
		text-decoration: none;
		color: inherit;
		display: block;
		width: 100%;
	}

	.timeline-content.mobile {
		background-color: var(--window-header);
		border-radius: 8px;
		padding: 15px 20px;
		box-shadow: var(--shadow-light);
		transition:
			transform 0.2s,
			box-shadow 0.2s;
		position: relative;
	}

	.timeline-item.left.mobile .timeline-content::after,
	.timeline-item.right.mobile .timeline-content::after {
		content: '';
		position: absolute;
		top: 10px;
		left: -10px;
		width: 0;
		height: 0;
		border-top: 10px solid transparent;
		border-bottom: 10px solid transparent;
		border-right: 10px solid var(--window-header);
		border-left: 0;
	}

	.timeline-item.left.mobile .timeline-content-link:hover .timeline-content,
	.timeline-item.right.mobile .timeline-content-link:hover .timeline-content {
		transform: translateX(5px);
		box-shadow: var(--shadow-medium);
		border-left: 4px solid var(--win-accent);
		border-right: none;
	}

	.timeline-header.mobile {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 10px;
		flex-wrap: wrap;
		gap: 8px;
	}

	.timeline-title.mobile {
		margin: 0;
		font-size: 1.1rem;
		color: var(--text-primary);
	}

	.timeline-date.mobile {
		color: var(--text-secondary);
		font-size: 0.9rem;
		background-color: var(--taskbar-active);
		padding: 3px 8px;
		border-radius: 4px;
	}

	.timeline-body.mobile {
		color: var(--text-primary);
	}

	.timeline-body.mobile p {
		margin: 0;
		line-height: 1.5;
	}
</style>
