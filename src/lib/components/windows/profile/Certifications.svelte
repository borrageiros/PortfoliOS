<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import { t } from '$lib/i18n/i18n';

	interface Certification {
		name: string;
		issuer: string;
		date: string;
		expires?: string;
		url: string;
		icon: string;
		important?: boolean;
	}

	interface CertificationData {
		certifications: Record<string, Certification[]>;
	}

	export let certifications: CertificationData;

	let previewImage: string | null = null;

	function openPreview(imageUrl: string, event: MouseEvent) {
		event.preventDefault();
		event.stopPropagation();
		previewImage = imageUrl;
	}

	function closePreview(event: MouseEvent | KeyboardEvent) {
		const target = event.target as HTMLElement;
		const container = target.closest('.image-preview-container');
		if (event.target === event.currentTarget || !container) {
			previewImage = null;
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && previewImage) {
			previewImage = null;
		}
	}

	function openUrl(url: string, event: MouseEvent) {
		event.preventDefault();
		event.stopPropagation();
		window.open(url, '_blank', 'noopener,noreferrer');
	}
</script>

<div class="certifications-section">
	<h2>
		<Icon name="profile_certifications" size="22" />
		<span>{$t('profile.certifications')}</span>
	</h2>

	{#if certifications.certifications}
		{#each Object.entries(certifications.certifications) as [company, companyCerts]}
			<div class="company-certifications">
				<h3 class="company-title">{company}</h3>
				<div class="certifications-grid">
					{#each companyCerts as cert}
						<div class="certification-card-link">
							<div class="certification-card">
								<div class="certification-icon">
									<img src={cert.icon} alt={cert.name} />
								</div>
								<div class="certification-details">
									<h3 class="certification-name">{cert.name}</h3>
									<div class="certification-meta">
										<div class="certification-date">
											<Icon name="calendar" size="14" />
											<span>{cert.date}</span>
										</div>
										{#if cert.expires}
											<div class="certification-expires">
												<Icon name="clock" size="14" />
												<span>{$t('profile.expires')}: {cert.expires}</span>
											</div>
										{/if}
									</div>
								</div>
								<div class="certification-actions">
									<button
										class="action-button preview-button"
										on:click={(e) => openPreview(cert.icon, e)}
										title={$t('profile.previewImage')}
										aria-label={$t('profile.previewImage')}
									>
										<svg
											width="16"
											height="16"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
										>
											<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
											<circle cx="12" cy="12" r="3" />
										</svg>
									</button>
									<button
										class="action-button url-button"
										on:click={(e) => openUrl(cert.url, e)}
										title={$t('profile.openCertificate')}
										aria-label={$t('profile.openCertificate')}
									>
										<Icon name="globe" size="16" />
									</button>
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/each}
	{/if}
</div>

{#if previewImage}
	<div
		class="image-preview-overlay"
		on:click={closePreview}
		on:keydown={handleKeydown}
		role="button"
		tabindex="0"
		aria-label="Close preview"
	>
		<div class="image-preview-container" role="img" aria-label="Certificate preview">
			<img src={previewImage} alt="Certificate preview" />
			<button
				class="close-preview-button"
				on:click={() => (previewImage = null)}
				title="Close preview"
				aria-label="Close preview"
			>
				<Icon name="x" size="24" />
			</button>
		</div>
	</div>
{/if}

<style>
	.certifications-section {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.certifications-section h2 {
		color: var(--win-accent);
		margin: 0;
		font-size: 22px;
	}

	.certifications-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 20px;
		align-items: stretch;
	}

	.certification-card-link {
		text-decoration: none;
		color: inherit;
		display: flex;
		height: 100%;
		min-height: 0;
	}

	.certification-card {
		display: flex;
		gap: 15px;
		padding: 15px;
		background-color: var(--window-header);
		border-radius: 8px;
		box-shadow: var(--shadow-light);
		color: var(--text-primary);
		transition:
			transform 0.2s,
			box-shadow 0.2s;
		border-left: 4px solid transparent;
		width: 100%;
		height: 100%;
		min-height: 0;
	}

	.certification-card:hover {
		transform: translateX(5px);
		box-shadow: var(--shadow-medium);
		border-left: 4px solid var(--win-accent);
	}

	.certification-icon {
		flex-shrink: 0;
	}

	.certification-icon img {
		width: 50px;
		height: 50px;
		border-radius: 5px;
	}

	.certification-details {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 5px;
		min-height: 0;
		overflow: hidden;
	}

	.certification-name {
		margin: 0;
		font-size: 16px;
		color: var(--text-primary);
		line-height: 1.4;
		height: 2.8em;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.certification-meta {
		flex-shrink: 0;
		margin-top: 5px;
	}

	.certification-date {
		color: var(--text-secondary);
	}

	.certification-actions {
		display: flex;
		flex-direction: column;
		gap: 8px;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		margin-left: auto;
	}

	.action-button {
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: var(--taskbar-active);
		border: 1px solid var(--border-light);
		border-radius: 6px;
		padding: 10px;
		cursor: pointer;
		transition:
			background-color 0.2s,
			transform 0.2s,
			box-shadow 0.2s,
			border-color 0.2s;
		color: var(--text-primary);
		width: 40px;
		height: 40px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.action-button:hover {
		background-color: var(--taskbar-hover);
		border-color: var(--text-secondary);
		transform: translateY(-2px);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
	}

	.action-button:active {
		background-color: var(--taskbar-active);
		transform: translateY(0);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.image-preview-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.85);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 10000;
		cursor: pointer;
	}

	.image-preview-container {
		position: relative;
		width: 30vw;
		height: 30vh;
		min-width: 300px;
		min-height: 300px;
		max-width: 90%;
		max-height: 90%;
		cursor: default;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: rgba(255, 255, 255, 0.05);
		border-radius: 8px;
		padding: 20px;
	}

	.image-preview-container img {
		width: 100%;
		height: 100%;
		object-fit: contain;
		border-radius: 8px;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
	}

	@media (max-width: 768px) {
		.image-preview-container {
			width: 80vw;
			height: 40vh;
			min-width: 250px;
			min-height: 250px;
		}
	}

	@media (max-width: 480px) {
		.image-preview-container {
			width: 90vw;
			height: 35vh;
			min-width: 200px;
			min-height: 200px;
		}
	}

	.close-preview-button {
		position: absolute;
		top: -50px;
		right: 0;
		background-color: rgba(255, 255, 255, 0.2);
		border: 1px solid rgba(255, 255, 255, 0.3);
		border-radius: 50%;
		width: 36px;
		height: 36px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: background-color 0.2s;
		color: white;
	}

	.close-preview-button:hover {
		background-color: rgba(255, 255, 255, 0.3);
	}

	.company-certifications {
		margin-bottom: 30px;
	}

	.company-title {
		color: var(--win-accent);
		font-size: 18px;
		margin: 25px 0 15px 0;
		padding-bottom: 8px;
		border-bottom: 1px solid var(--taskbar-active);
	}
</style>
