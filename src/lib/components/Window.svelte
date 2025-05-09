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
  let previousMinimizedState = { width, height, x, y }; // To restore after minimizing

  // Shake detection variables
  let lastDragTime = 0;
  let dragPoints: { x: number; time: number }[] = [];
  let shakeThreshold = 3;
  let shakeTimeout: NodeJS.Timeout | null = null;

  // Add new state variable for shaking
  let isShaking = false;

  // Deformation variables
  let lastX = 0;
  let lastY = 0;
  let velocityX = 0;
  let skewAmount = 0;
  let lastMoveTime = 0;
  let deformationTimeout: NodeJS.Timeout | null = null;

  // Snap zones
  const SNAP_THRESHOLD = 20; // Pixels from the top/bottom to trigger maximize/minimize
  let wasMaximized = false; // To remember if it was maximized before the drag

  // Event dispatcher to communicate events to the parent component
  const dispatch = createEventDispatcher();

  function extractPixelValue(dimension: string | number, element?: HTMLElement, defaultValue: number = 300, isHeight: boolean = false): number {
    if (typeof dimension === 'number') return dimension;
    
    if (typeof dimension === 'string') {
      if (dimension.includes('px')) {
        const value = parseInt(dimension);
        return isNaN(value) ? defaultValue : value;
      }
      
      if (element) {
        return isHeight 
          ? element.getBoundingClientRect().height 
          : element.getBoundingClientRect().width;
      }
    }
    
    return defaultValue;
  }

  function detectShake(currentX: number, currentTime: number) {
    dragPoints.push({ x: currentX, time: currentTime });
    
    if (dragPoints.length > 6) {
      dragPoints.shift();
    }

    if (dragPoints.length >= 6) {
      let directions = 0;
      for (let i = 1; i < dragPoints.length; i++) {
        const prevPoint = dragPoints[i - 1];
        const currentPoint = dragPoints[i];
        
        if (Math.abs(currentPoint.x - prevPoint.x) > 100) {
          directions++;
        }
      }

      if (directions >= shakeThreshold) {
        if (shakeTimeout) clearTimeout(shakeTimeout);
        
        isShaking = true;
        dispatch('shake');
        dragPoints = [];
        
        shakeTimeout = setTimeout(() => {
          isShaking = false;
          dispatch('shakeEnd');
        }, 250);
      }
    }
  }

  function resetDeformation() {
    skewAmount = 0;
    if (deformationTimeout) {
      clearTimeout(deformationTimeout);
      deformationTimeout = null;
    }
  }

  // Start dragging the window
  function startDrag(event: MouseEvent) {
    // Only allow dragging from the title bar
    if (isMaximized) {
      const mouseX = event.clientX;
      const mouseY = event.clientY;
      const windowWidth = parseInt(previousDimensions.width);
      const windowHeight = parseInt(previousDimensions.height);
      
      x = mouseX;
      y = mouseY;
      
      x = Math.max(0, Math.min(x, window.innerWidth - windowWidth));
      y = Math.max(0, Math.min(y, window.innerHeight - windowHeight));
      
      width = previousDimensions.width;
      height = previousDimensions.height;
      isMaximized = false;
      wasMaximized = true;
    }
    
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
    
    resizeStartWidth = extractPixelValue(width, windowElement, minWidth, false);
    resizeStartHeight = extractPixelValue(height, windowElement, minHeight, true);
    
    dispatch('focus');
    
    // Prevent text selection during resizing
    event.preventDefault();
  }

  // Handle the window dragging
  function onDrag(event: MouseEvent) {
    if (isDragging) {
      const currentTime = Date.now();
      const currentX = event.clientX - dragOffsetX;
      const currentY = event.clientY - dragOffsetY;
      
      // Limit maximum deformation
      velocityX = currentX - lastX;
      // Limitar la deformación máxima
      skewAmount = Math.max(Math.min(velocityX * 0.5, 15), -15);
      
      // Check for maximize zone (top of the screen)
      if (currentY <= SNAP_THRESHOLD && !isMaximized && !wasMaximized) {
        maximize();
        endDrag(); // Forzar la liberación del arrastre
        return;
      }

      // Check for minimize zone (bottom of the screen)
      if (currentY >= window.innerHeight - SNAP_THRESHOLD && !isMinimized) {
        minimize();
        endDrag(); // Forzar la liberación del arrastre
        return;
      }
      
      // If the window was maximized and now is moving outside the top zone
      if (wasMaximized && currentY > SNAP_THRESHOLD) {
        wasMaximized = false;
      }

      if (!isMaximized) {
        x = currentX;
        y = currentY;
        
        // Keep the window within the screen boundaries
        if (x < 0) x = 0;
        if (y < 0) y = 0;
        
        let maxX = window.innerWidth - parseInt(width);
        let maxY = window.innerHeight - parseInt(height);
        
        if (x > maxX) x = maxX;
        if (y > maxY) y = maxY;
      }

      lastX = currentX;
      lastY = currentY;
      lastMoveTime = currentTime;

      // Reset deformation if the mouse stops
      if (deformationTimeout) {
        clearTimeout(deformationTimeout);
      }
      deformationTimeout = setTimeout(resetDeformation, 50);

      // Detect shake movement
      detectShake(currentX, currentTime);
    } else if (isResizing) {
      // Calculate the original aspect ratio for a more natural resizing
      const aspectRatio = resizeStartWidth / resizeStartHeight;
      
      // Calculate the change in X and Y since the resizing started
      const deltaX = event.clientX - resizeStartX;
      const deltaY = event.clientY - resizeStartY;
      
      // Calculate new dimensions while keeping the mouse position
      let newWidth = resizeStartWidth + deltaX;
      let newHeight = resizeStartHeight + deltaY;
      
      // Validate that the values are numeric and positive
      if (isNaN(newWidth) || newWidth <= 0) {
        newWidth = minWidth;
      }
      
      if (isNaN(newHeight) || newHeight <= 0) {
        newHeight = minHeight;
      }
      
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
    wasMaximized = false;
    resetDeformation();
  }

  // Minimize the window
  function minimize() {
    if (!isMinimized) {
      // Save current dimensions and position before minimizing
      previousMinimizedState = { 
        width, 
        height, 
        x, 
        y 
      };
    }
    isMinimized = true;
    dispatch('minimize');
  }

  // Function to restore the window from minimized state
  export function restore() {
    if (isMinimized) {
      // Restore dimensions and position
      width = previousMinimizedState.width;
      height = previousMinimizedState.height;
      x = previousMinimizedState.x;
      y = previousMinimizedState.y;
      isMinimized = false;
      dispatch('restore');
    }
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

    function initializeWindowState() {

    
    previousDimensions = { width, height, x, y };
    previousMinimizedState = { width, height, x, y };
    
    if (isMaximized) {
      x = 0;
      y = 0;
      width = "100%";
      height = "calc(100vh - var(--taskbar-min-height))";
      dispatch('maximize', { isMaximized });
    }

    if (isMinimized) {
      dispatch('minimize');
    }
  }

  onMount(() => {
    initializeWindowState();
    
    // Ensure initial sizes are correct
    setTimeout(() => {
      if (!width.includes('px') && !width.includes('%')) {
        width = `${windowElement.getBoundingClientRect().width}px`;
      }
      if (!height.includes('px') && !height.includes('%')) {
        height = `${windowElement.getBoundingClientRect().height}px`;
      }
    }, 0);
    
    // Configure global events for dragging and resizing
    window.addEventListener('mousemove', onDrag);
    window.addEventListener('mouseup', endDrag);

    return () => {
      // Clean up events
      window.removeEventListener('mousemove', onDrag);
      window.removeEventListener('mouseup', endDrag);
      if (deformationTimeout) {
        clearTimeout(deformationTimeout);
      }
    };
  });
</script>

{#if !isMinimized}
<div 
  class="window"
  class:maximized={isMaximized}
  class:dark-mode={$theme === 'dark'}
  class:light-mode={$theme === 'light'}
  class:shaking={isShaking}
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
      <button 
        class="control-button minimize" 
        on:click={minimize} 
        on:mousedown|stopPropagation 
        title={$t('window.minimize')}
      >
        <span>-</span>
      </button>
      <button 
        class="control-button maximize" 
        on:click={maximize} 
        on:mousedown|stopPropagation 
        title={isMaximized ? $t('window.restore') : $t('window.maximize')}
      >
        {#if isMaximized}
          <div class="restore-icon"></div>
        {:else}
          <div class="maximize-icon"></div>
        {/if}
      </button>
      <button 
        class="control-button close" 
        on:click={close} 
        on:mousedown|stopPropagation 
        title={$t('window.close')}
      >
        <span>×</span>
      </button>
    </div>
  </div>
  <div 
    class="window-content"
    style="transform: skewX({skewAmount}deg)"
  >
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
    will-change: transform;
  }
  
  .window:hover {
    box-shadow: var(--shadow-heavy);
  }

  .window:active {
    cursor: move;
  }

  .window-content {
    flex: 1;
    overflow: auto;
    background-color: var(--window-bg);
    transform-origin: bottom;
    transition: transform 0.05s ease-out;
    will-change: transform;
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }

  .window.shaking {
    animation: shake 0.1s ease-in-out infinite;
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

  /* Visual subtle indicator for the resizing area */
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