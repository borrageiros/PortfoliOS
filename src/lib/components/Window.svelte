<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte';
  import type { ComponentType } from 'svelte';
  import Icon from './Icon.svelte';
  import { theme } from '$lib/theme/theme';
  import { t } from '$lib/i18n/i18n';

  // Component Props
  export let title: string = "Window";
  export let icon: string = "";
  export let width: string = "600px";
  export let height: string = "400px";
  export let x: number = 100;
  export let y: number = 100;
  export let zIndex: number = 1;
  export let isMaximized: boolean = false;
  export let isMinimized: boolean = false;
  export let resizable: boolean = true;
  export let minWidth: number = 250;
  export let minHeight: number = 150;
  export let content: ComponentType;
  export let props: Record<string, unknown> = {};
  
  // Internal State
  let isDragging: boolean = false;
  let isResizing: boolean = false;
  let dragOffsetX: number = 0;
  let dragOffsetY: number = 0;
  let resizeStartX: number = 0;
  let resizeStartY: number = 0;
  let resizeStartWidth: number = 0;
  let resizeStartHeight: number = 0;
  let windowElement: HTMLElement;
  let previousDimensions = { width, height, x, y }; // To restore after maximizing

  // Event dispatcher to communicate events to the parent component
  const dispatch = createEventDispatcher();

  // Start dragging the window
  function startDrag(event: MouseEvent) {
    // Only allow dragging from the title bar and if not maximized
    if (isMaximized) return;
    
    isDragging = true;
    dragOffsetX = event.clientX - x;
    dragOffsetY = event.clientY - y;
    
    dispatch('focus');
    
    // Prevent text selection during dragging
    event.preventDefault();
  }

  // Start resizing the window
  function startResize(event: MouseEvent) {
    if (isMaximized || !resizable) return;
    
    isResizing = true;
    resizeStartX = event.clientX;
    resizeStartY = event.clientY;
    resizeStartWidth = parseInt(width);
    resizeStartHeight = parseInt(height);
    
    dispatch('focus');
    
    // Prevent text selection during resizing
    event.preventDefault();
  }

  // Handle the window dragging
  function onDrag(event: MouseEvent) {
    if (isDragging) {
      x = event.clientX - dragOffsetX;
      y = event.clientY - dragOffsetY;
      
      // Keep the window within the screen boundaries
      if (x < 0) x = 0;
      if (y < 0) y = 0;
      
      let maxX = window.innerWidth - parseInt(width);
      let maxY = window.innerHeight - parseInt(height);
      
      if (x > maxX) x = maxX;
      if (y > maxY) y = maxY;
    } else if (isResizing) {
      // Calculate new dimensions
      let newWidth = resizeStartWidth + (event.clientX - resizeStartX);
      let newHeight = resizeStartHeight + (event.clientY - resizeStartY);
      
      // Apply minimum size constraints
      newWidth = Math.max(newWidth, minWidth);
      newHeight = Math.max(newHeight, minHeight);
      
      // Update dimensions
      width = `${newWidth}px`;
      height = `${newHeight}px`;
    }
  }

  // Finalize the dragging or resizing
  function endDrag() {
    isDragging = false;
    isResizing = false;
  }

  // Minimize the window
  function minimize() {
    isMinimized = true;
    dispatch('minimize');
  }

  // Maximize or restore the window
  function maximize() {
    if (isMaximized) {
      // Restore previous dimensions
      width = previousDimensions.width;
      height = previousDimensions.height;
      x = previousDimensions.x;
      y = previousDimensions.y;
    } else {
      // Save current dimensions
      previousDimensions = { width, height, x, y };
      // Maximize
      x = 0;
      y = 0;
      width = "100%";
      height = "calc(100vh - var(--taskbar-min-height))";
    }
    
    isMaximized = !isMaximized;
    dispatch('maximize', { isMaximized });
  }

  // Close the window
  function close() {
    dispatch('close');
  }

  // Bring the window to the front
  function focus() {
    dispatch('focus');
  }

  function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			//
		}
	}

  onMount(() => {
    // Configure global events for dragging and resizing
    window.addEventListener('mousemove', onDrag);
    window.addEventListener('mouseup', endDrag);

    return () => {
      // Clean up events
      window.removeEventListener('mousemove', onDrag);
      window.removeEventListener('mouseup', endDrag);
    };
  });
</script>

{#if !isMinimized}
<div 
  class="window"
  class:maximized={isMaximized}
  class:dark-mode={$theme === 'dark'}
  class:light-mode={$theme === 'light'}
  bind:this={windowElement}
  on:click={focus}
  on:keydown={handleKeydown}
  role="button"
  tabindex="0"
  style="
    width: {width};
    height: {height};
    transform: translate({x}px, {y}px);
    z-index: {zIndex};
    {isMaximized ? 'top: 0; left: 0;' : ''}
  "
>
  <div class="window-titlebar" on:mousedown={startDrag} on:keydown={handleKeydown} role="button" tabindex="0">
    <div class="window-titlebar-icon">
      {#if icon}
        <Icon name={icon} size="1.5rem" />
      {/if}
    </div>
    <div class="window-titlebar-title">{$t(title)}</div>
    <div class="window-titlebar-controls">
      <button class="control-button minimize" on:click={minimize} title={$t('window.minimize')}>
        <span>-</span>
      </button>
      <button class="control-button maximize" on:click={maximize} title={isMaximized ? $t('window.restore') : $t('window.maximize')}>
        {#if isMaximized}
          <div class="restore-icon"></div>
        {:else}
          <div class="maximize-icon"></div>
        {/if}
      </button>
      <button class="control-button close" on:click={close} title={$t('window.close')}>
        <span>×</span>
      </button>
    </div>
  </div>
  <div class="window-content">
    <svelte:component this={content} {...props} on:createWindow />
  </div>
  {#if resizable && !isMaximized}
  <div 
    class="resize-handle resize-handle-se"
    on:mousedown={startResize}
    role="button" 
    tabindex="0"
    title={$t('window.resize')}
  ></div>
  {/if}
</div>
{/if}

<style>
  .window {
    position: absolute;
    display: flex;
    flex-direction: column;
    background-color: var(--window-bg);
    border: 1px solid var(--border-light);
    border-radius: 3px;
    box-shadow: var(--shadow-medium);
    overflow: hidden;
    transition: box-shadow 0.3s ease;
  }
  
  .window:hover {
    box-shadow: var(--shadow-heavy);
  }
  
  .maximized {
    border-radius: 0;
    border: none;
  }
  
  .window-titlebar {
    display: flex;
    align-items: center;
    background-color: var(--window-header);
    color: var(--text-primary);
    height: 32px;
    padding: 0 8px;
    cursor: default;
    user-select: none;
  }
  
  .window-titlebar-icon {
    margin-right: 8px;
    display: flex;
    align-items: center;
    color: var(--win-accent);
  }
  
  .window-titlebar-title {
    flex: 1;
    font-size: 0.9rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .window-titlebar-controls {
    display: flex;
  }
  
  .control-button {
    width: 46px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    color: var(--text-primary);
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .control-button:hover {
    background-color: var(--taskbar-hover);
  }
  
  .close:hover {
    background-color: #e81123;
    color: white;
  }
  
  .maximize-icon {
    width: 10px;
    height: 10px;
    border: 1px solid var(--text-primary);
    background: transparent;
  }
  
  .restore-icon {
    width: 10px;
    height: 10px;
    border: 1px solid var(--text-primary);
    background: transparent;
    position: relative;
  }
  
  .restore-icon::before {
    content: '';
    position: absolute;
    width: 8px;
    height: 8px;
    border: 1px solid var(--text-primary);
    border-bottom: none;
    border-right: none;
    top: -4px;
    left: 3px;
  }
  
  .window-content {
    flex: 1;
    overflow: auto;
    background-color: var(--window-bg);
  }
  
  .resize-handle {
    position: absolute;
    background: transparent;
  }
  
  .resize-handle-se {
    width: 16px;
    height: 16px;
    right: 0;
    bottom: 0;
    cursor: nwse-resize;
  }

  /* Indicador visual sutíl para el área de redimensionamiento */
  .resize-handle-se::after {
    content: '';
    position: absolute;
    right: 4px;
    bottom: 4px;
    width: 6px;
    height: 6px;
    border-right: 2px solid var(--border-color);
    border-bottom: 2px solid var(--border-color);
  }
</style> 