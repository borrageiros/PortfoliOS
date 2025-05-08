<script lang="ts">
  import { onMount } from 'svelte';
  import { t, locale, getLocaleText } from '$lib/i18n/i18n';

  let wikipediaUrl = `https://${getLocaleText($locale).toLowerCase()}.wikipedia.org/wiki/Main_Page`;

  function updateWikipediaUrl() {
    wikipediaUrl = `https://${getLocaleText($locale).toLowerCase()}.wikipedia.org/wiki/Main_Page`;
  }
  
  let bookMarks = [
    {
      name: "YouTube",
      url: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
    },
    {
      name: "Wikipedia",
      url: wikipediaUrl
    },
    {
      name: "OpenStreetMap",
      url: "https://www.openstreetmap.org/export/embed.html"
    },
    {
      name: "JSFiddle",
      url: "https://jsfiddle.net/"
    },
    {
      name: "Rust Playground",
      url: "https://play.rust-lang.org/"
    }
  ];

  let url = bookMarks[1].url;
  let inputUrl = url;
  let iframeElement: HTMLIFrameElement;
  let isLoading = true;
  let showBookmarks = true;
  
  function navigateTo() {
    // Ensure URL has http/https protocol
    if (!inputUrl.startsWith('http://') && !inputUrl.startsWith('https://')) {
      inputUrl = 'https://' + inputUrl;
    }
    url = inputUrl;
    isLoading = true;
  }
  
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      navigateTo();
    }
  }
  
  function reload() {
    isLoading = true;
    if (iframeElement) {
      iframeElement.src = url;
    }
  }
  
  function handleIframeLoad() {
    isLoading = false;
  }
  
  function navigateToBookmark(bookmarkUrl: string) {
    updateWikipediaUrl();
    inputUrl = bookmarkUrl;
    url = bookmarkUrl;
    isLoading = true;
  }
  
  function toggleBookmarks() {
    showBookmarks = !showBookmarks;
  }
  
  onMount(async () => {
    isLoading = true;
  });
</script>

<div class="browser">
  <div class="browser-toolbar">
    <div class="browser-controls">
      <button class="browser-button" on:click={() => window.history.back()} aria-label={$t('softwares.browser.back')}>
        <svg viewBox="0 0 24 24" width="16" height="16">
          <path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
      </button>
      <button class="browser-button" on:click={() => window.history.forward()} aria-label={$t('softwares.browser.forward')}>
        <svg viewBox="0 0 24 24" width="16" height="16">
          <path fill="currentColor" d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8z"/>
        </svg>
      </button>
      <button class="browser-button" on:click={reload} aria-label={$t('softwares.browser.reload')}>
        <svg viewBox="0 0 24 24" width="16" height="16">
          <path fill="currentColor" d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
        </svg>
      </button>
      <button class="browser-button" on:click={toggleBookmarks} aria-label="Toggle bookmarks">
        <svg viewBox="0 0 24 24" width="16" height="16">
          <path fill="currentColor" d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
        </svg>
      </button>
    </div>
    
    <div class="url-bar">
      <input 
        type="text" 
        bind:value={inputUrl} 
        on:keydown={handleKeydown}
        placeholder={$t('softwares.browser.enterUrl')}
        aria-label={$t('softwares.browser.addressBar')}
      />
      <button class="go-button" on:click={navigateTo} aria-label={$t('softwares.browser.go')}>
        <svg viewBox="0 0 24 24" width="16" height="16">
          <path fill="currentColor" d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8z"/>
        </svg>
      </button>
    </div>
  </div>
  
  {#if showBookmarks}
    <div class="bookmarks-bar">
      {#each bookMarks as bookmark}
        <button 
          class="bookmark-button" 
          on:click={() => navigateToBookmark(bookmark.url)} 
          title={bookmark.name}
        >
          {bookmark.name.length > 15 ? bookmark.name.slice(0, 15) + '...' : bookmark.name}
        </button>
      {/each}
    </div>
  {/if}
  
  <div class="browser-content">
    {#if isLoading}
      <div class="loading-indicator">
        <div class="spinner"></div>
        <span>{$t('softwares.browser.loading')}</span>
      </div>
    {/if}
    <iframe 
      bind:this={iframeElement}
      title={$t('softwares.browser.content')} 
      src={url}
      on:load={handleIframeLoad}
    ></iframe>
  </div>
</div>

<style>
  .browser {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: var(--window-bg, #fff);
  }
  
  .browser-toolbar {
    display: flex;
    align-items: center;
    padding: 8px;
    background-color: var(--taskbar-bg, #f0f0f0);
    border-bottom: 1px solid var(--border-light, #ddd);
  }
  
  .browser-controls {
    display: flex;
    margin-right: 10px;
  }
  
  .browser-button {
    background: none;
    border: none;
    width: 32px;
    height: 32px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: var(--text-primary, #000);
  }
  
  .browser-button:hover {
    background-color: var(--taskbar-hover, #e5e5e5);
  }
  
  .url-bar {
    flex: 1;
    display: flex;
    height: 32px;
    border-radius: 4px;
    overflow: hidden;
    background-color: var(--input-bg, white);
    border: 1px solid var(--border-light, #ddd);
  }
  
  .url-bar input {
    flex: 1;
    border: none;
    padding: 0 10px;
    font-size: 14px;
    outline: none;
    background-color: var(--input-bg, white);
    color: var(--text-primary, #000);
  }
  
  .go-button {
    background: none;
    border: none;
    width: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: var(--text-primary, #000);
    background-color: var(--taskbar-bg, #f0f0f0);
  }
  
  .go-button:hover {
    background-color: var(--taskbar-hover, #e5e5e5);
  }
  
  .bookmarks-bar {
    display: flex;
    overflow-x: auto;
    background-color: var(--window-bg, #fff);
    border-bottom: 1px solid var(--border-light, #ddd);
    padding: 4px 8px;
    white-space: nowrap;
  }
  
  .bookmark-button {
    background: none;
    border: none;
    border-radius: 4px;
    padding: 4px 10px;
    margin-right: 8px;
    font-size: 13px;
    cursor: pointer;
    white-space: nowrap;
    color: var(--text-primary, #000);
    transition: background-color 0.2s;
  }
  
  .bookmark-button:hover {
    background-color: var(--taskbar-hover, #e5e5e5);
  }
  
  .browser-content {
    flex: 1;
    position: relative;
    overflow: hidden;
  }
  
  iframe {
    width: 100%;
    height: 100%;
    border: none;
    background-color: white;
  }
  
  .loading-indicator {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: var(--overlay-bg, rgba(255, 255, 255, 0.9));
    z-index: 1;
    color: var(--text-primary, #000);
  }
  
  .spinner {
    width: 32px;
    height: 32px;
    border: 3px solid var(--win-accent, #0078d7);
    border-top: 3px solid transparent;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 10px;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
</style>