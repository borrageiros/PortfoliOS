<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { isMobile } from '$lib/helpers';
	import { goto } from '$app/navigation';
	import Icon from '$lib/components/Icon.svelte';
	import VersionSwitchButton from '$lib/components/VersionSwitchButton.svelte';
	import { t } from '$lib/i18n/i18n';

	let bootTimeout: ReturnType<typeof setTimeout> | undefined;

	onMount(() => {
		if (isMobile()) {
			goto('/basic');
			return;
		}
		bootTimeout = setTimeout(() => {
			if (!isMobile()) {
				goto('/login');
			}
		}, 3000);
	});

	onDestroy(() => {
		if (bootTimeout) {
			clearTimeout(bootTimeout);
		}
	});
</script>

<div class="content">
	<div class="loading-screen">
		<div class="loading-window">
			<div class="loading-logo">
				<div class="windows-logo">
					<Icon name="windows" size="120" viewBox="0 0 256 256" />
				</div>
			</div>

			<div class="loading-spinner">
				<div class="dot dot1"></div>
				<div class="dot dot2"></div>
				<div class="dot dot3"></div>
				<div class="dot dot4"></div>
				<div class="dot dot5"></div>
			</div>

			<div class="loading-text">
				{$t('system.loading')}
			</div>

			<div class="loading-actions">
				<VersionSwitchButton
					label={$t('login.switchToMobile')}
					title={$t('login.switchToMobile')}
					destination="/basic"
					variant="pill"
				/>
			</div>
		</div>
	</div>
</div>

<style>
	.content {
		width: 100%;
		height: 100vh;
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: var(--win-accent);
		color: var(--text-primary);
		overflow: hidden;
	}

	.loading-screen {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.loading-window {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.loading-logo {
		margin-bottom: 60px;
	}

	.windows-logo {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 120px;
		height: 120px;
		color: white;
	}

	.loading-spinner {
		position: relative;
		width: 120px;
		height: 40px;
		margin: 20px 0;
	}

	.dot {
		position: absolute;
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background-color: white;
		animation-name: loading-animation;
		animation-duration: 3s;
		animation-iteration-count: infinite;
		animation-timing-function: ease-in-out;
	}

	.dot1 {
		left: 0;
		animation-delay: 0s;
	}
	.dot2 {
		left: 25px;
		animation-delay: 0.2s;
	}
	.dot3 {
		left: 50px;
		animation-delay: 0.4s;
	}
	.dot4 {
		left: 75px;
		animation-delay: 0.6s;
	}
	.dot5 {
		left: 100px;
		animation-delay: 0.8s;
	}

	@keyframes loading-animation {
		0%,
		100% {
			transform: translateY(0);
			opacity: 0.2;
		}
		50% {
			transform: translateY(-15px);
			opacity: 1;
		}
	}

	.loading-text {
		margin-top: 30px;
		font-size: 18px;
		font-weight: 300;
		color: white;
	}

	.loading-actions {
		margin-top: 28px;
	}

	.loading-actions :global(.version-switch-button.pill) {
		background-color: rgba(255, 255, 255, 0.18);
		color: white;
	}

	.loading-actions :global(.version-switch-button.pill:hover) {
		background-color: rgba(255, 255, 255, 0.3);
		color: white;
	}
</style>
