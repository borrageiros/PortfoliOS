<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import { t } from '$lib/i18n/i18n';
	import type { Career as CareerData } from '$lib/types/data';
	export let career: CareerData;

	export let isMobileVersion = false;
	export let isDesktopInMobileVersion = false;

	$: useMobileSingleColumn = isMobileVersion && !isDesktopInMobileVersion;

	function parseDate(dateStr: string): Date | null {
		if (!dateStr || dateStr === 'Presente' || dateStr === 'Present') {
			return new Date();
		}
		const parts = dateStr.split('/');
		if (parts.length === 3) {
			const day = parseInt(parts[0], 10);
			const month = parseInt(parts[1], 10) - 1;
			const year = parseInt(parts[2], 10);
			return new Date(year, month, day);
		}
		return null;
	}

	function calculateDuration(
		from: string,
		to: string
	): { years: number; months: number; days: number } {
		const fromDate = parseDate(from);
		const toDate = parseDate(to);

		if (!fromDate || !toDate) {
			return { years: 0, months: 0, days: 0 };
		}

		let years = toDate.getFullYear() - fromDate.getFullYear();
		let months = toDate.getMonth() - fromDate.getMonth();
		let days = toDate.getDate() - fromDate.getDate();

		if (days < 0) {
			months--;
			const lastMonth = new Date(toDate.getFullYear(), toDate.getMonth(), 0);
			days += lastMonth.getDate();
		}

		if (months < 0) {
			years--;
			months += 12;
		}

		return { years, months, days };
	}

	function formatDuration(duration: { years: number; months: number; days: number }): string[] {
		const badges: string[] = [];

		if (duration.years > 0) {
			badges.push(
				`${duration.years} ${duration.years === 1 ? $t('profile.year') : $t('profile.years')}`
			);

			if (duration.months > 0) {
				badges.push(
					`${duration.months} ${duration.months === 1 ? $t('profile.month') : $t('profile.months')}`
				);
			}
		} else if (duration.months > 0) {
			badges.push(
				`${duration.months} ${duration.months === 1 ? $t('profile.month') : $t('profile.months')}`
			);
		} else if (duration.days > 0) {
			badges.push(
				`${duration.days} ${duration.days === 1 ? $t('profile.day') : $t('profile.days')}`
			);
		}

		return badges;
	}
</script>

<div class="career-section" class:mobile={useMobileSingleColumn}>
	<h2 class:mobile={useMobileSingleColumn}>
		<Icon name="profile_career" size="22" />
		<span>{$t('profile.career')}</span>
	</h2>

	<div class="timeline-container" class:mobile={useMobileSingleColumn}>
		{#each career.steps as entry, index (index)}
			<div
				class="timeline-item {index % 2 === 0 ? 'left' : 'right'}"
				class:mobile={useMobileSingleColumn}
			>
				<div class="timeline-marker" class:mobile={useMobileSingleColumn}>
					<div
						class="timeline-icon {entry.type === 'school' ? 'school' : 'work'}"
						class:mobile={useMobileSingleColumn}
					>
						<Icon name={entry.type === 'school' ? 'school' : 'briefcase'} size="18" />
					</div>
				</div>
				<a
					href={entry.url}
					target="_blank"
					rel="noopener noreferrer"
					class="timeline-content-link"
					class:mobile={useMobileSingleColumn}
				>
					<div class="timeline-content" class:mobile={useMobileSingleColumn}>
						<div class="timeline-header" class:mobile={useMobileSingleColumn}>
							<div class="timeline-title-container" class:mobile={useMobileSingleColumn}>
								{#if entry.logo}
									<img
										src={entry.logo}
										alt={entry.where}
										class="timeline-logo"
										class:mobile={useMobileSingleColumn}
									/>
								{/if}
								<h3 class="timeline-title" class:mobile={useMobileSingleColumn}>
									{entry.where}
								</h3>
							</div>
							<div class="timeline-date-container" class:mobile={useMobileSingleColumn}>
								<span class="timeline-date" class:mobile={useMobileSingleColumn}
									>{entry.from} - {entry.to}</span
								>
								{#each formatDuration(calculateDuration(entry.from, entry.to)) as badge, i (i)}
									<span class="duration-badge" class:mobile={useMobileSingleColumn}>{badge}</span>
								{/each}
							</div>
						</div>
						<div class="timeline-body" class:mobile={useMobileSingleColumn}>
							<p class:mobile={useMobileSingleColumn}>{entry.what}</p>
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

	.timeline-title-container {
		display: flex;
		align-items: center;
		gap: 10px;
		flex: 1;
	}

	.timeline-logo {
		width: 32px;
		height: 32px;
		object-fit: contain;
		border-radius: 4px;
		flex-shrink: 0;
	}

	.timeline-title {
		margin: 0;
		font-size: 1.1rem;
		color: var(--text-primary);
	}

	.timeline-date-container {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		align-items: center;
	}

	.timeline-date {
		color: var(--text-secondary);
		font-size: 0.9rem;
		background-color: var(--taskbar-active);
		padding: 3px 8px;
		border-radius: 4px;
	}

	.duration-badge {
		color: var(--text-secondary);
		font-size: 0.85rem;
		background-color: var(--win-accent);
		padding: 3px 8px;
		border-radius: 4px;
		color: white;
		white-space: nowrap;
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

	.timeline-title-container.mobile {
		display: flex;
		align-items: center;
		gap: 10px;
		flex: 1;
	}

	.timeline-logo.mobile {
		width: 32px;
		height: 32px;
		object-fit: contain;
		border-radius: 4px;
		flex-shrink: 0;
	}

	.timeline-title.mobile {
		margin: 0;
		font-size: 1.1rem;
		color: var(--text-primary);
	}

	.timeline-date-container.mobile {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		align-items: center;
	}

	.timeline-date.mobile {
		color: var(--text-secondary);
		font-size: 0.9rem;
		background-color: var(--taskbar-active);
		padding: 3px 8px;
		border-radius: 4px;
	}

	.duration-badge.mobile {
		color: var(--text-secondary);
		font-size: 0.85rem;
		background-color: var(--win-accent);
		padding: 3px 8px;
		border-radius: 4px;
		color: white;
		white-space: nowrap;
	}

	.timeline-body.mobile {
		color: var(--text-primary);
	}

	.timeline-body.mobile p {
		margin: 0;
		line-height: 1.5;
	}
</style>
