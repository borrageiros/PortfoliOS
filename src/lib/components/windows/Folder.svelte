<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import Icon from '$lib/components/Icon.svelte';
  import { t } from '$lib/i18n/i18n';
  import type { WindowData } from '$lib/types/window';
  // Props
  export let items: Array<WindowData> = [];

  // Event dispatcher to communicate with the parent component
  const dispatch = createEventDispatcher();

  // Function to open a window
  function openWindow(windowData: WindowData) {
    if (windowData) {
      // Add a small variation of position to avoid exact overlap of windows
      windowData.x += Math.floor(Math.random() * 50);
      windowData.y += Math.floor(Math.random() * 50);
      
      // Send the event to create the window
      dispatch('createWindow', windowData);
    }
  }

  // Function to handle the click on an item
  function handleItemClick(item: any, event: MouseEvent) {
    // Stop the event from propagating to avoid focusing on the Folder window
    event.stopPropagation();
    
    // If the item has a window property, use that
    if (item.window) {
      openWindow(item.window);
    } 
    // If the item is directly a WindowData (has properties like content, id, etc.)
    else if (item.content) {
      openWindow(item);
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      //
    }
  }
</script>

<div class="folder-container">
  
  <div class="folder-sidebar">
    <div class="sidebar-section">
      <div class="sidebar-item">
        <Icon name="folder" size="16" />
        <span>{$t('folder.quickAccess')}</span>
      </div>
      <div class="sidebar-item">
        <Icon name="user" size="16" />
        <span>{$t('folder.thisPC')}</span>
      </div>
    </div>
  </div>
  
  <div class="folder-content">
    <div class="folder-items">
      {#each items as item (item.title)}
        <div 
          class="folder-item"
          on:click={(event) => handleItemClick(item, event)}
          on:keydown={handleKeydown}
          role="button"
          tabindex="0"
        >
          <div class="item-icon" style="background-color: {item.color || 'var(--win-accent)'}">
            <Icon name={item.icon} size="30" />
          </div>
          <div class="item-name">{$t(item.title)}</div>
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  .folder-container {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-rows: auto 1fr;
    grid-template-columns: 200px 1fr;
    grid-template-areas:
      "header header"
      "sidebar content";
    background-color: var(--window-bg);
    color: var(--text-primary);
  }
  
  .folder-sidebar {
    grid-area: sidebar;
    background-color: var(--window-header);
    border-right: 1px solid var(--taskbar-active);
    padding: 16px 0;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: var(--taskbar-active) var(--window-header);
  }

  .folder-sidebar::-webkit-scrollbar {
    width: 8px;
  }
  
  .folder-sidebar::-webkit-scrollbar-track {
    background: var(--window-header);
  }
  
  .folder-sidebar::-webkit-scrollbar-thumb {
    background-color: var(--taskbar-active);
    border-radius: 4px;
    border: 2px solid var(--window-header);
  }
  
  .folder-sidebar::-webkit-scrollbar-thumb:hover {
    background-color: var(--win-accent);
  }
  
  .sidebar-section {
    margin-bottom: 24px;
  }
  
  .sidebar-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 16px;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .sidebar-item:hover {
    background-color: var(--taskbar-hover);
  }
  
  .folder-content {
    grid-area: content;
    padding: 24px;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: var(--taskbar-active) var(--window-bg);
  }

  .folder-content::-webkit-scrollbar {
    width: 8px;
  }
  
  .folder-content::-webkit-scrollbar-track {
    background: var(--window-bg);
  }
  
  .folder-content::-webkit-scrollbar-thumb {
    background-color: var(--taskbar-active);
    border-radius: 4px;
    border: 2px solid var(--window-bg);
  }
  
  .folder-content::-webkit-scrollbar-thumb:hover {
    background-color: var(--win-accent);
  }
  
  .folder-items {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 20px;
    justify-items: center;
  }
  
  .folder-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 120px;
    cursor: pointer;
    padding: 12px;
    border-radius: 4px;
    transition: background-color 0.2s;
  }
  
  .folder-item:hover {
    background-color: var(--taskbar-hover);
  }
  
  .folder-item:focus {
    outline: 2px solid var(--win-accent);
  }
  
  .item-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 12px;
    color: white;
    font-size: 1.2em;
    width: 48px;
    height: 48px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }
  
  .item-name {
    font-size: 0.9rem;
    text-align: center;
    word-break: break-word;
    max-width: 100%;
    background-color: rgba(var(--taskbar-bg-rgb), 0.3);
    padding: 3px 6px;
    border-radius: 3px;
    font-weight: 500;
    width: 100%;
  }
</style> 