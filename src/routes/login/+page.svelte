<script lang="ts">
  import { t, locale, changeLocale, getLocaleText } from '$lib/i18n/i18n';
  import { theme, toggleTheme, getThemeIcon } from '$lib/theme/theme';
  import { goto } from '$app/navigation';
  import Icon from '$lib/components/Icon.svelte';
  import { onMount } from 'svelte';

  const users = [
    { id: 'recruiter', fallbackIcon: '👔' },
    { id: 'developer', fallbackIcon: '💻' },
    { id: 'stalker', fallbackIcon: '🕵️' },
    { id: 'adventurer', fallbackIcon: '🧭' }
  ];

  let loading = false;
  let selectedUser = '';
  
  function selectUser(userId: string) {
    loading = true;
    selectedUser = userId;
    
    setTimeout(() => {
      goto(`/desktop/?session=${userId}`);
    }, 2000);
  }
  
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      const target = event.currentTarget as HTMLElement;
      const userId = target.getAttribute('data-user-id') || '';
      selectUser(userId);
    }
  }
</script>

<div class="login-container">
  <div class="login-background"></div>
  
  {#if loading}
    <div class="loading-screen">
      <div class="user-info">
        <div class="loading-avatar">
          <span class="loading-fallback-icon">
            {users.find(u => u.id === selectedUser)?.fallbackIcon || '👤'}
          </span>
        </div>
        <div class="loading-name">
          {$t(`login.users.${selectedUser}`)}
        </div>
      </div>
      
      <div class="loading-spinner">
        <div class="dot dot1"></div>
        <div class="dot dot2"></div>
        <div class="dot dot3"></div>
        <div class="dot dot4"></div>
        <div class="dot dot5"></div>
      </div>
      
      <div class="loading-message">
        {$t('login.welcomeMessage').replace('{user}', $t(`login.users.${selectedUser}`))}
      </div>
    </div>
  {:else}
    <div class="login-window">
      <div class="login-header">
        <h1>{$t('login.title')}</h1>
        <p>{$t('login.subtitle')}</p>
      </div>
      
      <div class="users-container">
        {#each users as user}
          <div 
            class="user-card" 
            on:click={() => selectUser(user.id)} 
            on:keydown={handleKeydown}
            role="button"
            tabindex="0"
            data-user-id={user.id}
          >
            <div class="user-avatar">
              <span class="fallback-icon">{user.fallbackIcon}</span>
            </div>
            <div class="user-name">{$t(`login.users.${user.id}`)}</div>
          </div>
        {/each}
      </div>
      
      <div class="login-actions">
        <div class="theme-toggle" on:click={toggleTheme} on:keydown={(e) => e.key === 'Enter' && toggleTheme()} role="button" tabindex="0" title={$t('taskbar.theme')}>
          <Icon name={getThemeIcon($theme)} size="20" />
        </div>
        
        <div class="language-selector" on:click={changeLocale} on:keydown={(e) => e.key === 'Enter' && changeLocale()} role="button" tabindex="0" title={$t('taskbar.language')}>
          <span>{getLocaleText($locale)}</span>
        </div>
      </div>
    </div>
    
    <div class="power-button" role="button" tabindex="0">
      <Icon name="power" size="24" />
    </div>
  {/if}
</div>

<style>
  .login-container {
    width: 100%;
    height: 100vh;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--text-primary);
    overflow: hidden;
  }

  .login-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background-image: url('/images/background.jpg');
    background-size: cover;
    background-position: center;
    filter: blur(5px);
  }

  .login-window {
    background-color: var(--window-bg);
    border-radius: 8px;
    padding: 40px;
    width: 80%;
    max-width: 600px;
    display: flex;
    flex-direction: column;
    align-items: center;
    backdrop-filter: blur(10px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
    border: 1px solid var(--taskbar-active);
  }

  .login-header {
    text-align: center;
    margin-bottom: 40px;
  }

  .login-header h1 {
    font-size: 28px;
    font-weight: 300;
    margin: 0 0 10px 0;
    color: var(--win-accent);
  }

  .login-header p {
    color: var(--text-secondary);
    margin: 0;
  }

  .users-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 20px;
    width: 100%;
    margin-bottom: 40px;
  }

  .user-card {
    background-color: var(--window-header);
    border-radius: 8px;
    padding: 15px;
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    transition: background-color 0.2s, transform 0.2s;
    box-shadow: var(--shadow-light);
  }

  .user-card:hover {
    background-color: var(--taskbar-hover);
    transform: translateY(-5px);
    box-shadow: var(--shadow-medium);
  }

  .user-card:active {
    transform: translateY(0);
  }

  .user-avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 15px;
    position: relative;
    overflow: hidden;
    color: white;
  }

  .fallback-icon {
    font-size: 40px;
    position: absolute;
  }

  .user-name {
    font-size: 16px;
    text-align: center;
    color: var(--text-primary);
  }

  .login-actions {
    display: flex;
    gap: 15px;
  }

  .theme-toggle,
  .language-selector {
    background-color: var(--taskbar-hover);
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.2s;
    color: var(--text-primary);
  }

  .theme-toggle:hover,
  .language-selector:hover {
    background-color: var(--taskbar-active);
  }

  .language-selector {
    font-size: 14px;
    font-weight: bold;
  }

  .power-button {
    position: absolute;
    bottom: 30px;
    right: 30px;
    background-color: var(--taskbar-hover);
    border-radius: 50%;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.2s;
    color: var(--text-primary);
  }

  .power-button:hover {
    background-color: var(--alert-error);
    color: white;
  }

  .loading-screen {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    background-color: var(--window-bg);
    border-radius: 8px;
    padding: 40px;
    width: 80%;
    max-width: 600px;
    display: flex;
    flex-direction: column;
    align-items: center;
    backdrop-filter: blur(10px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
    border: 1px solid var(--taskbar-active);
  }

  .user-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 40px;
  }

  .loading-avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
    position: relative;
    overflow: hidden;
    color: var(--text-primary);
  }

  .loading-fallback-icon {
    font-size: 60px;
    position: absolute;
  }

  .loading-name {
    font-size: 24px;
    font-weight: 300;
    color: var(--text-primary);
    text-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
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
    background-color: var(--win-accent);
    animation-name: loading-animation;
    animation-duration: 3s;
    animation-iteration-count: infinite;
    animation-timing-function: ease-in-out;
  }

  .dot1 { left: 0; animation-delay: 0s; }
  .dot2 { left: 25px; animation-delay: 0.2s; }
  .dot3 { left: 50px; animation-delay: 0.4s; }
  .dot4 { left: 75px; animation-delay: 0.6s; }
  .dot5 { left: 100px; animation-delay: 0.8s; }

  @keyframes loading-animation {
    0%, 100% {
      transform: translateY(0);
      opacity: 0.2;
    }
    50% {
      transform: translateY(-15px);
      opacity: 1;
    }
  }

  .loading-message {
    margin-top: 30px;
    font-size: 18px;
    font-weight: 300;
    color: var(--text-primary);
    text-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  }

  @media (max-width: 600px) {
    .login-window {
      width: 90%;
      padding: 20px;
    }

    .users-container {
      grid-template-columns: repeat(2, 1fr);
    }
  }
</style>