<script lang="ts">
  import { onMount } from 'svelte';
  import { t } from '$lib/i18n/i18n';

  // Canvas properties
  let canvasElement: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  let canvasWidth = 800;
  let canvasHeight = 600;
  let isDrawing = false;
  let lastX = 0;
  let lastY = 0;

  // Drawing settings
  let currentColor = '#000000';
  let brushSize = 5;
  let currentTool = 'pencil';

  // Drawing history for undo/redo
  let history: ImageData[] = [];
  let historyIndex = -1;
  const MAX_HISTORY = 10;

  // Color palette
  const colors = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', 
    '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080', 
    '#008000', '#800000', '#008080', '#808080', '#C0C0C0'
  ];

  // Available tools
  const tools = [
    { id: 'pencil', icon: '✏️', name: $t('softwarespaint.pencil') },
    { id: 'line', icon: '📏', name: $t('softwarespaint.line') },
    { id: 'rectangle', icon: '⬜', name: $t('softwarespaint.rectangle') },
    { id: 'circle', icon: '⭕', name: $t('softwarespaint.circle') },
    { id: 'eraser', icon: '🧽', name: $t('softwarespaint.eraser') },
    { id: 'fill', icon: '🪣', name: $t('softwarespaint.fill') }
  ];

  // Available brush sizes
  const brushSizes = [1, 2, 5, 10, 20];

  // Initialize canvas
  onMount(() => {
    ctx = canvasElement.getContext('2d') as CanvasRenderingContext2D;
    
    // Set initial canvas state
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    // Save initial state to history
    saveToHistory();

    return () => {
      // Cleanup if needed
    };
  });

  // Save current state to history
  function saveToHistory() {
    if (!ctx) return;
    
    // Remove any future states if we've gone back in time
    if (historyIndex < history.length - 1) {
      history = history.slice(0, historyIndex + 1);
    }
    
    // Add current state to history
    const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
    history.push(imageData);
    
    // Limit history size
    if (history.length > MAX_HISTORY) {
      history.shift();
    }
    
    historyIndex = history.length - 1;
  }

  // Undo last action
  function undo() {
    if (historyIndex > 0) {
      historyIndex--;
      ctx.putImageData(history[historyIndex], 0, 0);
    }
  }

  // Redo last undone action
  function redo() {
    if (historyIndex < history.length - 1) {
      historyIndex++;
      ctx.putImageData(history[historyIndex], 0, 0);
    }
  }

  // Clear canvas
  function clearCanvas() {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    saveToHistory();
  }

  // Start drawing
  function startDrawing(e: MouseEvent) {
    isDrawing = true;
    
    // Get mouse position relative to canvas
    const rect = canvasElement.getBoundingClientRect();
    lastX = e.clientX - rect.left;
    lastY = e.clientY - rect.top;
    
    // For tools that draw on click rather than drag
    if (currentTool === 'fill') {
      fillArea(lastX, lastY);
      isDrawing = false;
    } else if (currentTool === 'line' || currentTool === 'rectangle' || currentTool === 'circle') {
      // Save the current state to restore when dragging
      saveToHistory();
    }
  }

  // Draw while moving
  function draw(e: MouseEvent) {
    if (!isDrawing) return;
    
    // Get current mouse position
    const rect = canvasElement.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;
    
    // Set drawing properties
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.lineWidth = brushSize;
    
    // Different drawing based on selected tool
    switch (currentTool) {
      case 'pencil':
        ctx.strokeStyle = currentColor;
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(currentX, currentY);
        ctx.stroke();
        
        // Update last position
        lastX = currentX;
        lastY = currentY;
        break;
        
      case 'eraser':
        ctx.strokeStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(currentX, currentY);
        ctx.stroke();
        
        // Update last position
        lastX = currentX;
        lastY = currentY;
        break;
        
      case 'line':
        // Restore the original state before drawing preview
        if (historyIndex >= 0) {
          ctx.putImageData(history[historyIndex], 0, 0);
        }
        
        // Draw the line
        ctx.strokeStyle = currentColor;
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(currentX, currentY);
        ctx.stroke();
        break;
        
      case 'rectangle':
        // Restore the original state before drawing preview
        if (historyIndex >= 0) {
          ctx.putImageData(history[historyIndex], 0, 0);
        }
        
        // Draw the rectangle
        ctx.strokeStyle = currentColor;
        ctx.beginPath();
        ctx.rect(
          lastX, 
          lastY, 
          currentX - lastX, 
          currentY - lastY
        );
        ctx.stroke();
        break;
        
      case 'circle':
        // Restore the original state before drawing preview
        if (historyIndex >= 0) {
          ctx.putImageData(history[historyIndex], 0, 0);
        }
        
        // Calculate radius
        const radius = Math.sqrt(
          Math.pow(currentX - lastX, 2) + Math.pow(currentY - lastY, 2)
        );
        
        // Draw the circle
        ctx.strokeStyle = currentColor;
        ctx.beginPath();
        ctx.arc(lastX, lastY, radius, 0, Math.PI * 2);
        ctx.stroke();
        break;
    }
  }

  // Stop drawing
  function stopDrawing() {
    if (isDrawing) {
      isDrawing = false;
      
      // Save state to history only for tools that need it
      if (currentTool !== 'fill') {
        saveToHistory();
      }
    }
  }

  // Fill area with flood fill algorithm
  function fillArea(startX: number, startY: number) {
    const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
    const pixels = imageData.data;
    
    // Get target color
    const targetColorPos = (Math.floor(startY) * canvasWidth + Math.floor(startX)) * 4;
    const targetR = pixels[targetColorPos];
    const targetG = pixels[targetColorPos + 1];
    const targetB = pixels[targetColorPos + 2];
    
    // Get fill color
    const fillColor = hexToRgb(currentColor);
    if (!fillColor) return;
    
    // Don't fill if target is already fill color
    if (
      targetR === fillColor.r &&
      targetG === fillColor.g &&
      targetB === fillColor.b
    ) {
      return;
    }
    
    // Stack for flood fill
    const stack: [number, number][] = [[startX, startY]];
    
    while (stack.length > 0) {
      const [x, y] = stack.pop()!;
      
      // Get current position
      const currentPos = (Math.floor(y) * canvasWidth + Math.floor(x)) * 4;
      
      // Skip if out of bounds
      if (
        x < 0 || y < 0 || x >= canvasWidth || y >= canvasHeight ||
        pixels[currentPos] !== targetR ||
        pixels[currentPos + 1] !== targetG ||
        pixels[currentPos + 2] !== targetB
      ) {
        continue;
      }
      
      // Fill pixel
      pixels[currentPos] = fillColor.r;
      pixels[currentPos + 1] = fillColor.g;
      pixels[currentPos + 2] = fillColor.b;
      
      // Add neighbors to stack
      stack.push([x + 1, y]);
      stack.push([x - 1, y]);
      stack.push([x, y + 1]);
      stack.push([x, y - 1]);
    }
    
    // Update canvas
    ctx.putImageData(imageData, 0, 0);
    saveToHistory();
  }

  // Convert hex color to RGB
  function hexToRgb(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  // Download canvas as image
  function downloadImage() {
    const link = document.createElement('a');
    link.download = 'paint-drawing.png';
    link.href = canvasElement.toDataURL('image/png');
    link.click();
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      // Execute element action when Enter is pressed
      const target = e.currentTarget as HTMLElement;
      target.click();
    }
  }
</script>

<div class="paint-container">
  <div class="toolbar">
    <div class="tool-group">
      {#each tools as tool}
        <button 
          class="tool-button" 
          class:active={currentTool === tool.id}
          on:click={() => currentTool = tool.id}
          on:keydown={handleKeydown}
          title={tool.name}
          aria-label={tool.name}
        >
          <span>{tool.icon}</span>
        </button>
      {/each}
    </div>
    
    <div class="divider"></div>
    
    <div class="tool-group">
      <button class="tool-button" on:click={undo} on:keydown={handleKeydown} title="Undo" aria-label="Undo">↩️</button>
      <button class="tool-button" on:click={redo} on:keydown={handleKeydown} title="Redo" aria-label="Redo">↪️</button>
      <button class="tool-button" on:click={clearCanvas} on:keydown={handleKeydown} title="Clear canvas" aria-label="Clear canvas">🗑️</button>
      <button class="tool-button" on:click={downloadImage} on:keydown={handleKeydown} title="Download image" aria-label="Download image">💾</button>
    </div>
    
    <div class="divider"></div>
    
    <div class="tool-group brush-size">
      <span>{$t('softwarespaint.size')}:</span>
      {#each brushSizes as size}
        <button 
          class="size-button" 
          class:active={brushSize === size}
          on:click={() => brushSize = size}
          on:keydown={handleKeydown}
          style="width: {size + 10}px; height: {size + 10}px;"
          title={`${size}px`}
          tabindex="0"
          aria-label={`Brush size ${size}px`}
        ></button>
      {/each}
    </div>
  </div>
  
  <div class="color-palette">
    <span>{$t('softwarespaint.colors')}:</span>
    {#each colors as color}
      <button 
        class="color-button"
        class:active={currentColor === color}
        style="background-color: {color};"
        on:click={() => currentColor = color}
        on:keydown={handleKeydown}
        aria-label={`Color ${color}`}
        tabindex="0"
      ></button>
    {/each}
    <input 
      type="color" 
      bind:value={currentColor} 
      title={$t('softwarespaint.customColorPicker')}
      aria-label={$t('softwarespaint.customColorPicker')}
    />
  </div>
  
  <div class="canvas-container">
    <canvas 
      bind:this={canvasElement}
      width={canvasWidth} 
      height={canvasHeight}
      on:mousedown={startDrawing}
      on:mousemove={draw}
      on:mouseup={stopDrawing}
      on:mouseleave={stopDrawing}
    ></canvas>
  </div>
</div>

<style>
  .paint-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    background-color: var(--window-bg);
    font-family: 'Segoe UI', sans-serif;
  }
  
  .toolbar {
    display: flex;
    padding: 10px;
    background-color: var(--window-bg);
    border-bottom: 1px solid var(--window-header);
    gap: 10px;
    align-items: center;
    flex-wrap: wrap;
  }
  
  .tool-group {
    display: flex;
    gap: 5px;
    align-items: center;
  }
  
  .tool-button {
    width: 32px;
    height: 32px;
    border: 1px solid var(--window-bg);
    background-color: var(--window-bg);
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    border-radius: 4px;
    padding: 0;
  }
  
  .tool-button:hover {
    background-color: var(--win-accent);
  }
  
  .tool-button.active {
    background-color: var(--win-accent);
  }
  
  .divider {
    width: 1px;
    height: 30px;
    background-color: var(--window-header);
    margin: 0 5px;
  }
  
  .brush-size {
    font-size: 14px;
  }
  
  .size-button {
    border-radius: 50%;
    background-color: #000000;
    border: 1px solid #a0a0a0;
    cursor: pointer;
    min-width: 10px;
    min-height: 10px;
  }
  
  .size-button.active {
    border: 2px solid #0078d7;
  }
  
  .color-palette {
    display: flex;
    padding: 10px;
    background-color: var(--window-bg);
    border-bottom: 1px solid var(--window-header);
    gap: 5px;
    align-items: center;
    flex-wrap: wrap;
    font-size: 14px;
  }
  
  .color-button {
    width: 25px;
    height: 25px;
    border: 1px solid var(--window-header);
    cursor: pointer;
    border-radius: 4px;
  }
  
  .color-button.active {
    border: 2px solid #0078d7;
  }
  
  input[type="color"] {
    width: 25px;
    height: 25px;
    border: 1px solid var(--window-header);
    background: none;
    cursor: pointer;
    padding: 0;
    border-radius: 4px;
  }
  
  .canvas-container {
    flex: 1;
    overflow: auto;
    padding: 10px;
    display: flex;
    justify-content: center;
    align-items: flex-start;
  }
  
  canvas {
    background-color: var(--window-bg);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    cursor: crosshair;
  }
</style>
