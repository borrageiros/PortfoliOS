<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { slide } from 'svelte/transition';
  import Icon from './Icon.svelte';
  import { locale, changeLocale, getLocaleText } from '$lib/i18n/i18n';
  import { t } from '$lib/i18n/i18n';
  import { theme, toggleTheme, getThemeIcon } from '$lib/theme/theme';
	import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import type { WindowData } from '$lib/types/window';
  import Profile from '$lib/components/windows/Profile.svelte';
  import type { SvelteComponent } from 'svelte';
  import { loadData } from '$lib/helpers';

  // Exportar evento para crear ventanas
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

	let currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
	let currentDate = formatDate(new Date());
	let timeInterval: ReturnType<typeof setInterval> | undefined;
	let startMenuOpen = false;
  let sessionUser = '';

  // Links for the startmenu
  let socialLinks: any;

  // Navigation items
  const navItems = [
    { name: $t('profile.information'), icon: 'profile_information', path: 'information' },
    { name: $t('profile.about'), icon: 'profile_about', path: 'about' },
    { name: $t('profile.projects'), icon: 'profile_projects', path: 'projects' },
    { name: $t('profile.carrer'), icon: 'profile_carrer', path: 'carrer' },
    { name: $t('profile.languages'), icon: 'profile_languages', path: 'languages' },
    { name: $t('profile.skills'), icon: 'profile_skills', path: 'skills' },
    { name: $t('profile.informatic'), icon: 'profile_informatic', path: 'informatic' },
    { name: $t('profile.certifications'), icon: 'profile_certifications', path: 'certifications' },
    { name: $t('profile.contact'), icon: 'profile_contact', path: 'contact' },
    { name: $t('profile.reviews'), icon: 'profile_reviews', path: 'reviews' },
    { name: $t('profile.complementary'), icon: 'profile_complementary', path: 'complementary' }
  ];

	function formatDate(date: Date): string {
		const day = String(date.getDate()).padStart(2, '0');
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const year = date.getFullYear();
		return `${day}/${month}/${year}`;
	}

	function toggleStartMenu() {
		startMenuOpen = !startMenuOpen;
	}

  function openURL(url: string) {
    window.open(url, '_blank', 'noopener,noreferrer');
    startMenuOpen = false;
  }

  function logout() {
    goto('/login');
  }
  
  // Function to create a profile window with the specified tab
  function openProfileWindow(tab: string) {
    // Create new window with the corresponding tab
    const profileWindow: WindowData = {
      id: 0, // Will be overwritten by the Page component
      title: $t('desktop.profile'),
      icon: tab === 'information' ? 'user' : `profile_${tab}`,
      width: '60vw',
      height: '80vh',
      x: 250 + Math.random() * 50, // Random position to avoid exact overlap
      y: 80 + Math.random() * 50,
      zIndex: 1,
      isMaximized: false,
      isMinimized: false,
      content: Profile as typeof SvelteComponent,
      props: { initialTab: tab }
    };
    
    // Send event to the parent component to create the window
    dispatch('createWindow', profileWindow);
    
    // Close the start menu if it is open
    startMenuOpen = false;
  }

	onMount(async () => {
    const contact = await loadData('contact');
    socialLinks = contact.rrss;
		// Update the time every minute
		timeInterval = setInterval(() => {
			const now = new Date();
			currentTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
			currentDate = formatDate(now);
		}, 60000);
    
    // Get session parameter from URL
    sessionUser = $page.url.searchParams.get('session') || '';
	});

	onDestroy(() => {
		// Clean the interval when the component is unmounted
		if (timeInterval) clearInterval(timeInterval);
	});

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			//
		}
	}
</script>

<div class="taskbar">
	<div class="start-button" class:active={startMenuOpen} on:click={toggleStartMenu} on:keydown={handleKeydown} role="button" tabindex="0">
		<Icon name="windows" viewBox="0 0 256 256"/>
	</div>
	<div class="search-box" role="searchbox" tabindex="0">
		<div class="search-icon">
      <Icon name="search" />
    </div>
		<div class="search-text">{$t('taskbar.search')}</div>
	</div>

	<div class="taskbar-items">
		<slot name="taskbar-items"></slot>
	</div>

	<div class="system-tray">
    <div class="theme-toggle" on:click={toggleTheme} on:keydown={handleKeydown} role="button" tabindex="0" title={$t('taskbar.theme')}>
      <Icon name={getThemeIcon($theme)} size="16" />
    </div>
    <div class="language-selector" on:click={changeLocale} on:keydown={handleKeydown} role="button" tabindex="0" title={$t('taskbar.language')}>
      <span>{getLocaleText($locale)}</span>
    </div>
		<div class="datetime" role="status">
			<div class="time">{currentTime}</div>
			<div class="date">{currentDate}</div>
		</div>
		<div class="date-button"></div>
	</div>
</div>

{#if startMenuOpen}
<div class="start-menu" transition:slide={{ duration: 200 }}>
	<div class="start-menu-header">
		<div class="user-profile">
			<div class="user-avatar">
        {#if sessionUser}
          {#if sessionUser === 'recruiter'}
					👔
          {:else if sessionUser === 'developer'}
					💻
          {:else if sessionUser === 'stalker'}
					🕵️
          {:else if sessionUser === 'adventurer'}
					🧭
          {:else}
            <div class="session-icon">{sessionUser.charAt(0).toUpperCase()}</div>
          {/if}
        {:else}
          <img src="/favicon.png" alt="avatar" />
        {/if}
			</div>
			<div class="user-name">{sessionUser || 'borrageiros'}</div>
		</div>
	</div>
  
  <div class="start-menu-content">
    <div class="start-menu-left">
      <div class="nav-section">
        {#each navItems as item}
          <div 
            class="nav-item" 
            on:click={() => openProfileWindow(item.path)} 
            on:keydown={(e) => e.key === 'Enter' && openProfileWindow(item.path)}
            role="button" 
            tabindex="0"
          >
            <div class="nav-icon">
              <Icon name={item.icon} size="18" />
            </div>
            <div class="nav-label">{item.name}</div>
          </div>
        {/each}
      </div>
    </div>
    
    <div class="start-menu-right">
      <div class="tiles-container">
        {#each socialLinks as link, i}
          <div 
            class="tile" 
            style="background-color: {link.color};"
            on:click={() => openURL(link.url)}
            on:keydown={(e) => e.key === 'Enter' && openURL(link.url)}
            role="button"
            tabindex="0"
          >
            <div class="tile-content">
              <Icon name={link.icon} size="24" viewBox={link.viewBox} />
              <div class="tile-label">{link.name}</div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
  
	<div class="start-menu-footer">
		<div class="power-button" role="button" tabindex="0" on:click={logout} on:keydown={handleKeydown}>
			<Icon name="power" />
		</div>
	</div>
</div>
{/if}

<style>
	.taskbar {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height: var(--taskbar-height);
		min-height: var(--taskbar-min-height);
		background-color: var(--taskbar-bg);
		display: flex;
		align-items: center;
		z-index: 1000;
		box-shadow: var(--shadow-medium);
	}

	.start-button {
		width: var(--start-button-size);
		min-width: var(--start-button-min-size);
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: background-color 0.1s;
	}

	.start-button.active {
		background-color: var(--win-accent);
	}

	.start-button:hover {
		background-color: var(--taskbar-hover);
	}

	.start-button.active:hover {
		background-color: var(--win-accent);
	}

	.search-box {
		height: 80%;
		margin-left: 0.5vw;
		display: flex;
		align-items: center;
		padding: 0 0.8vw;
		background-color: var(--taskbar-hover);
		border-radius: 4px;
		cursor: pointer;
		max-width: 16vw;
		min-width: 180px;
	}

	.search-icon {
		margin-right: 0.5vw;
		font-size: 1rem;
		color: var(--text-primary);
	}

	.search-text {
		color: var(--text-disabled);
		font-size: 0.9rem;
	}

	.taskbar-items {
		flex: 1;
		display: flex;
		height: 100%;
		padding: 0 1vw;
		margin-left: 1vw;
	}

	.system-tray {
		padding: 0 1.5vw;
		display: flex;
		align-items: center;
		height: 100%;
		background-color: var(--taskbar-bg);
	}

  .theme-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 0.5vw;
    padding: 0 8px;
    height: 70%;
    border-radius: 2px;
    cursor: pointer;
    color: var(--text-primary);
  }

  .theme-toggle:hover {
    background-color: var(--taskbar-hover);
  }

  .language-selector {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 0.8vw;
    padding: 0 8px;
    height: 70%;
    border-radius: 2px;
    cursor: pointer;
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--text-primary);
    background-color: var(--taskbar-bg);
  }

  .language-selector:hover {
    background-color: var(--taskbar-hover);
  }

  .language-selector span {
    padding: 4px 8px;
  }

	.datetime {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 0 0.8vw;
		height: 100%;
		cursor: pointer;
	}

	.datetime:hover {
		background-color: var(--taskbar-hover);
	}

	.time {
		color: var(--text-primary);
		font-size: 0.9rem;
		font-family: 'Segoe UI', sans-serif;
	}

	.date {
		color: var(--text-primary);
		font-size: 0.75rem;
		font-family: 'Segoe UI', sans-serif;
	}

	.date-button {
		width: 0.5vw;
		height: 100%;
	}

	.start-menu {
		position: fixed;
		bottom: var(--taskbar-min-height);
		left: 0;
		width: 30vw;
		min-width: 500px;
		height: 60vh;
		min-height: 500px;
		background-color: var(--start-menu-bg);
		color: var(--text-primary);
		z-index: 10000;
		display: flex;
		flex-direction: column;
    overflow: hidden;
	}

	.start-menu-header {
		height: 60px;
		padding: 1rem;
		border-bottom: var(--border-light);
	}

	.user-profile {
		display: flex;
		align-items: center;
	}

	.user-avatar {
		font-size: 2rem;
		margin-right: 1rem;
		width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		border-radius: 50%;
	}
  
  .session-icon {
    color: white;
    font-weight: bold;
    font-size: 1.5rem;
  }

	.user-avatar img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.user-name {
		font-size: 1.2rem;
    text-transform: capitalize;
	}

  .start-menu-content {
    flex: 1;
    display: flex;
    overflow: hidden;
  }
  
  .start-menu-left {
    width: 250px;
    border-right: var(--border-light);
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: var(--taskbar-active) var(--taskbar-bg);
  }
  
  .start-menu-left::-webkit-scrollbar {
    width: 8px;
  }
  
  .start-menu-left::-webkit-scrollbar-track {
    background: var(--taskbar-bg);
  }
  
  .start-menu-left::-webkit-scrollbar-thumb {
    background-color: var(--taskbar-active);
    border-radius: 4px;
    border: 2px solid var(--taskbar-bg);
  }
  
  .start-menu-left::-webkit-scrollbar-thumb:hover {
    background-color: var(--win-accent);
  }
  
  .nav-section {
    padding: 1rem 0;
  }
  
  .nav-item {
    display: flex;
    align-items: center;
    padding: 0.8rem 1rem;
    cursor: pointer;
    transition: background-color 0.1s;
  }
  
  .nav-item:hover {
    background-color: var(--app-tile-hover);
  }
  
  .nav-icon {
    margin-right: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    color: var(--text-primary);
  }
  
  .nav-label {
    font-size: 0.9rem;
  }
  
  .start-menu-right {
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
    scrollbar-width: thin;
    scrollbar-color: var(--taskbar-active) var(--taskbar-bg);
  }
  
  .start-menu-right::-webkit-scrollbar {
    width: 8px;
  }
  
  .start-menu-right::-webkit-scrollbar-track {
    background: var(--taskbar-bg);
  }
  
  .start-menu-right::-webkit-scrollbar-thumb {
    background-color: var(--taskbar-active);
    border-radius: 4px;
    border: 2px solid var(--taskbar-bg);
  }
  
  .start-menu-right::-webkit-scrollbar-thumb:hover {
    background-color: var(--win-accent);
  }
  
  .tiles-container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-auto-rows: minmax(80px, auto);
    gap: 10px;
  }
  
  .tile {
    color: white;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    cursor: pointer;
    transition: transform 0.2s, opacity 0.2s;
    overflow: hidden;
    position: relative;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  
  .tile:hover {
    transform: translateY(-2px);
    opacity: 0.9;
  }
  
  .tile-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 10px;
    text-align: center;
  }
  
  .tile-label {
    margin-top: 8px;
    font-size: 0.8rem;
    font-weight: 500;
  }

	.start-menu-footer {
		height: 60px;
		border-top: var(--border-light);
		display: flex;
		justify-content: flex-end;
		align-items: center;
		padding: 0 1rem;
	}

	.power-button {
		cursor: pointer;
		padding: 8px 12px;
		border-radius: 4px;
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--text-primary);
	}

	.power-button:hover {
		background-color: var(--app-tile-hover);
    color: var(--alert-error);
	}
</style>
