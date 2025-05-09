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
  import Profile from '$lib/components/windows/profile/Profile.svelte';
  // @ts-ignore
  import ChatBot from '$lib/components/ChatBot.svelte';
  import type { SvelteComponent } from 'svelte';
  import { loadData } from '$lib/helpers';
  import { profileItems } from '$lib/interfaces/profileItems';
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

	let currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
	let currentDate = formatDate(new Date());
	let timeInterval: ReturnType<typeof setInterval> | undefined;
	let startMenuOpen = false;
  let sessionUser = '';
  
  // Search functionality
  let searchValue = '';
  let isSearchFocused = false;
  let searchResults = '';
  let showSearchResults = false;
  let isSearching = false;
  let currentQuery = ''; // Current query to send to ChatBot
  let chatHistoryContainer: HTMLDivElement; // Reference to chat history container

  // Links for the startmenu
  let socialLinks: any;

  // Get chat history from ChatBot
  let chatHistory: {text: string, isUser: boolean}[] = [];

  let searchBoxRef: HTMLDivElement;

	function formatDate(date: Date): string {
		const day = String(date.getDate()).padStart(2, '0');
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const year = date.getFullYear();
		return `${day}/${month}/${year}`;
	}

	function toggleStartMenu() {
		startMenuOpen = !startMenuOpen;
    // Close search results if open
    if (startMenuOpen) {
      showSearchResults = false;
    }
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
  
  // Function to open the ChatBot window
  function openChatBotWindow() {
    const chatBotWindow: WindowData = {
      id: 0, // Will be overwritten by the Page component
      title: $t('desktop.chatbot'),
      icon: 'chat',
      width: '40vw',
      height: '70vh',
      x: 300 + Math.random() * 50, // Random position to avoid exact overlap
      y: 100 + Math.random() * 50,
      zIndex: 1,
      isMaximized: false,
      isMinimized: false,
      content: ChatBot as typeof SvelteComponent,
      props: { }
    };
    
    // Send event to the parent component to create the window
    dispatch('createWindow', chatBotWindow);
    
    // Close search results
    showSearchResults = false;
  }
  
  // Search functions
  function handleSearchFocus() {
    isSearchFocused = true;
    showSearchResults = true;
    // Close start menu if open
    if (startMenuOpen) {
      startMenuOpen = false;
    }
  }
  
  function handleSearchBlur() {
    // Delay to allow clicking on results
    setTimeout(() => {
      isSearchFocused = false;
      if (!isSearching) {
        showSearchResults = false;
      }
    }, 200);
  }
  
  function handleSearchSubmit() {
    if (searchValue.trim()) {
      currentQuery = searchValue.trim();
      isSearching = true;
      searchValue = '';
    }
  }
  
  // Function to scroll to the bottom of chat history
  function scrollChatToBottom() {
    if (chatHistoryContainer) {
      setTimeout(() => {
        chatHistoryContainer.scrollTop = chatHistoryContainer.scrollHeight;
      }, 100);
    }
  }
  
  // Get chat history from ChatBot
  function handleChatHistoryUpdate(history: {text: string, isUser: boolean}[]) {
    chatHistory = history;
    // Scroll to bottom when history updates
    scrollChatToBottom();
  }
  
  // Handle ChatBot response
  function handleChatResponse(response: string) {
    searchResults = response;
    isSearching = false;
    currentQuery = ''; // Clear query after response
    // Scroll to bottom when response arrives
    scrollChatToBottom();
  }
  
  // Reset search
  function resetSearch() {
    searchValue = '';
    showSearchResults = false;
    searchResults = '';
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
    
    // Add global click handler to detect clicks outside searchbox
    // Only in browser environment
    if (typeof window !== 'undefined') {
      document.addEventListener('click', handleGlobalClick);
      document.addEventListener('mousedown', handleGlobalMouseDown);
    }
	});

	onDestroy(() => {
		// Clean the interval when the component is unmounted
		if (timeInterval) clearInterval(timeInterval);
		
		// Remove global click handler
    // Only in browser environment
    if (typeof window !== 'undefined') {
		  document.removeEventListener('click', handleGlobalClick);
      document.removeEventListener('mousedown', handleGlobalMouseDown);
    }
	});

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
      if (isSearchFocused) {
        handleSearchSubmit();
      }
		}
	}

  // Handle clicks outside of searchbox
  function handleGlobalClick(event: MouseEvent) {
    // If search results are showing and click is outside searchbox
    if (showSearchResults && searchBoxRef && !searchBoxRef.contains(event.target as Node)) {
      // Check if the click was on the open chatbot button before closing
      const target = event.target as HTMLElement;
      const isOpenChatbotButton = target.closest('.open-chatbot-button');
      
      if (isOpenChatbotButton) {
        // If clicking on the open chatbot button, let the click event propagate
        // before closing the search results
        setTimeout(() => {
          isSearchFocused = false;
          showSearchResults = false;
        }, 100);
      } else {
        // Otherwise close immediately
        isSearchFocused = false;
        showSearchResults = false;
      }
    }
  }
  
  // Add a mousedown handler on the window to catch drag operations
  function handleGlobalMouseDown(event: MouseEvent) {
    // If we're starting a drag on a window (likely has window-header class)
    const target = event.target as HTMLElement;
    if (showSearchResults && target.closest('.window-header, .window')) {
      // Close the search results when a window drag likely starts
      isSearchFocused = false;
      showSearchResults = false;
    }
  }
</script>

<div class="taskbar">
	<div class="start-button" class:active={startMenuOpen} on:click={toggleStartMenu} on:keydown={handleKeydown} role="button" tabindex="0">
		<Icon name="windows" viewBox="0 0 256 256"/>
	</div>
	<div class="search-box" class:focused={isSearchFocused} role="searchbox" tabindex="0" bind:this={searchBoxRef}>
		<div class="search-icon">
      <Icon name="search" />
    </div>
		<input 
      type="text" 
      class="search-input" 
      placeholder={$t('taskbar.search')} 
      bind:value={searchValue}
      on:focus={handleSearchFocus}
      on:blur={handleSearchBlur}
      on:keydown={handleKeydown}
    />
    {#if searchValue}
      <button class="clear-button" on:click={resetSearch}>
        <Icon name="close" size="14" />
      </button>
    {/if}
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

{#if showSearchResults}
<div class="search-results-container" transition:slide={{ duration: 200 }}>  
  <div class="search-results-content">
    {#if chatHistory.length > 0}
      <div class="chat-history" bind:this={chatHistoryContainer}>
        {#each chatHistory as message}
          <div class="message {message.isUser ? 'user-message' : 'bot-message'}">
            <div class="message-content">
              {message.text}
            </div>
          </div>
        {/each}
        {#if isSearching}
          <div class="message bot-message">
            <div class="message-content">
              <span class="loading-dots">
                <span class="dot"></span>
                <span class="dot"></span>
                <span class="dot"></span>
              </span>
            </div>
          </div>
        {/if}
      </div>
    {:else if isSearching}
      <div class="chat-history" bind:this={chatHistoryContainer}>
        <div class="message bot-message">
          <div class="message-content">
            <span class="loading-dots">
              <span class="dot"></span>
              <span class="dot"></span>
              <span class="dot"></span>
            </span>
          </div>
        </div>
      </div>
    {:else}
      <div class="empty-results">{$t('taskbar.typeToSearch')}</div>
    {/if}
  </div>
  
  <!-- Hidden ChatBot component to process search queries -->
  <div class="hidden-chatbot">
    <ChatBot 
      hideInput={true} 
      externalText={currentQuery} 
      onResponse={handleChatResponse}
      onHistoryUpdate={handleChatHistoryUpdate}
    />
  </div>
</div>
{/if}

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
        {#each profileItems as item}
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
            <div class="nav-label">{$t(item.label)}</div>
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
		cursor: text;
		max-width: 20vw;
		min-width: 200px;
    transition: all 0.2s ease;
    position: relative;
	}
  
  .search-box.focused {
    background-color: var(--taskbar-active);
    box-shadow: 0 0 0 1px var(--win-accent);
  }

	.search-icon {
		margin-right: 0.5vw;
		font-size: 1rem;
		color: var(--text-primary);
	}

	.search-input {
    flex: 1;
    border: none;
    background: transparent;
    color: var(--text-primary);
    outline: none;
    font-size: 0.9rem;
    width: 100%;
  }
  
  .search-input::placeholder {
    color: var(--text-disabled);
  }
  
  .clear-button {
    background: none;
    border: none;
    color: var(--text-primary);
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
  }
  
  .clear-button:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  .search-results-container {
    position: fixed;
    bottom: var(--taskbar-min-height);
    left: var(--start-button-min-size);
    width: 50vw;
    max-width: 600px;
    background-color: var(--start-menu-bg);
    border-radius: 8px 8px 0 0;
    box-shadow: var(--shadow-medium);
    z-index: 10000;
    display: flex;
    flex-direction: column;
    max-height: 50vh;
    overflow: hidden;
  }
  
  .search-results-content {
    padding: 16px;
    overflow-y: auto;
    max-height: calc(50vh - 120px);
    min-height: 150px;
    display: flex;
    flex-direction: column;
  }
  
  .chat-history {
    display: flex;
    flex-direction: column;
    gap: 8px;
    max-height: 100%;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: var(--taskbar-active) var(--start-menu-bg);
    padding-right: 4px;
  }
  
  .chat-history::-webkit-scrollbar {
    width: 6px;
  }
  
  .chat-history::-webkit-scrollbar-track {
    background: var(--start-menu-bg);
  }
  
  .chat-history::-webkit-scrollbar-thumb {
    background-color: var(--taskbar-active);
    border-radius: 3px;
  }
  
  .message {
    max-width: 80%;
    padding: 8px 12px;
    border-radius: 16px;
    margin-bottom: 4px;
    word-break: break-word;
  }
  
  .user-message {
    background-color: var(--win-accent);
    color: var(--text-primary);
    align-self: flex-end;
    border-bottom-right-radius: 4px;
  }
  
  .bot-message {
    background-color: var(--taskbar-active);
    color: var(--text-primary);
    align-self: flex-start;
    border-bottom-left-radius: 4px;
  }
  
  .empty-results {
    color: var(--text-secondary);
    text-align: center;
    padding: 24px;
    font-style: italic;
  }
  
  .hidden-chatbot {
    display: none;
  }
  
  .loading-dots {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
  }
  
  .dot {
    width: 8px;
    height: 8px;
    background-color: var(--text-secondary);
    border-radius: 50%;
    display: inline-block;
    animation: dot-flashing 1s infinite alternate;
  }
  
  .dot:nth-child(2) {
    animation-delay: 0.2s;
  }
  
  .dot:nth-child(3) {
    animation-delay: 0.4s;
  }
  
  @keyframes dot-flashing {
    0% {
      opacity: 0.2;
    }
    100% {
      opacity: 1;
    }
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
