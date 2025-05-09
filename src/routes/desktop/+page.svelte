<script lang="ts">
  import Window from '$lib/components/Window.svelte';
  import Icon from '$lib/components/Icon.svelte';
  import Taskbar from '$lib/components/Taskbar.svelte';
  import type { WindowData } from '$lib/types/window';
  import Profile from '$lib/components/windows/profile/Profile.svelte';
  import ChatBot from '$lib/components/ChatBot.svelte';
  import Browser from '$lib/components/windows/softwares/Browser.svelte';
  import Folder from '$lib/components/windows/Folder.svelte';
  import Paint from '$lib/components/windows/softwares/Paint.svelte';
  import Calculator from '$lib/components/windows/softwares/Calculator.svelte';
  import Terminal from '$lib/components/windows/softwares/Terminal.svelte';
  import type { SvelteComponent } from 'svelte';
  import { t } from '$lib/i18n/i18n';
  import Minesweeper from '$lib/components/windows/games/Minesweeper.svelte';
  import Snake from '$lib/components/windows/games/Snake.svelte';
  import Tetris from '$lib/components/windows/games/Tetris.svelte';
  import Dino from '$lib/components/windows/games/Dino.svelte';
  import Sudoku from '$lib/components/windows/games/Sudoku.svelte';
  
  // ICONS
  const desktopIcons = [
    {
      name: 'profile.title',
      icon: 'user',
      color: '#3498db',
      onClick: () => createNewWindow(profileWindow)
    },
    {
      name: 'profile.projects',
      icon: 'profile_projects',
      color: '#2ecc71',
      onClick: () => createNewWindow(profileWindow, 'projects')
    },
    {
      name: 'softwares.browser.title',
      icon: 'globe',
      color: '#9b59b6',
      onClick: () => createNewWindow(browserWindow)
    },
    {
      name: 'games.title',
      icon: 'gamepad',
      color: '#e74c3c',
      onClick: () => createNewWindow(
        gamesWindow
      )
    },
    {
      name: 'softwares.terminal.title',
      icon: 'terminal',
      color: '#34495e',
      onClick: () => createNewWindow(terminalWindow)
    },
    {
      name: 'softwares.paint.title',
      icon: 'paint',
      color: '#f39c12',
      onClick: () => createNewWindow(paintWindow)
    },
    {
      name: 'softwares.calculator.title',
      icon: 'calculator',
      color: '#1abc9c',
      onClick: () => createNewWindow(calculatorWindow)
    },
    {
      name: 'chatbot.title',
      icon: 'message-circle',
      color: '#000',
      onClick: () => createNewWindow(chatbotWindow)
    }
  ]

  // WINDOWS
  const profileWindow = {
    id: 1,
    title: 'profile.title',
    icon: 'user',
    width: '60vw',
    height: '80vh',
    x: 300,
    y: 50,
    zIndex: 10,
    isMaximized: false,
    isMinimized: false,
    content: Profile as typeof SvelteComponent,
    props: { initialTab: 'information' }
  }

  const chatbotWindow = {
    id: 8,
    title: 'chatbot.title',
    icon: 'user',
    width: '30vw',
    height: '80vh',
    x: 300,
    y: 50,
    zIndex: 10,
    isMaximized: false,
    isMinimized: false,
    content: ChatBot as typeof SvelteComponent
  }

  const browserWindow = {
    id: 2,
    title: 'softwares.browser.title',
    icon: 'globe',
    width: '60vw',
    height: '80vh',
    x: 250,
    y: 100,
    zIndex: 10,
    isMaximized: false,
    isMinimized: false,
    content: Browser as typeof SvelteComponent
  }

  const gamesWindow = {
    id: 3,
    title: 'games.title',
    icon: 'gamepad',
    width: '60vw',
    height: '80vh',
    x: 200,
    y: 150,
    zIndex: 10,
    isMaximized: false,
    isMinimized: false,
    content: Folder as typeof SvelteComponent,
    props: {
      items: [
        {
          id: 4,
          title: "games.minesweeper.title",
          icon: 'mine',
          color: '#e74c3c',
          width: '',
          height: '',
          x: 200,
          y: 150,
          zIndex: 100,
          isMaximized: false,
          isMinimized: false,
          content: Minesweeper as typeof SvelteComponent
        },
        {
          id: 9,
          title: "games.snake.title",
          icon: 'snake',
          color: '#2ecc71',
          width: '',
          height: '',
          x: 250,
          y: 200,
          zIndex: 100,
          isMaximized: false,
          isMinimized: false,
          content: Snake as typeof SvelteComponent
        },
        {
          id: 10,
          title: "games.tetris.title",
          icon: 'tetris',
          color: '#3498db',
          width: '',
          height: '',
          x: 300,
          y: 250,
          zIndex: 100,
          isMaximized: false,
          isMinimized: false,
          content: Tetris as typeof SvelteComponent
        },
        {
          id: 11,
          title: "games.dino.title",
          icon: 'gamepad',
          color: '#9b59b6',
          width: '',
          height: '',
          x: 350,
          y: 300,
          zIndex: 100,
          isMaximized: false,
          isMinimized: false,
          content: Dino as typeof SvelteComponent
        },
        {
          id: 12,
          title: "games.sudoku.title",
          icon: 'sudoku',
          color: '#f39c12',
          width: '',
          height: '',
          x: 400,
          y: 350,
          zIndex: 100,
          isMaximized: false,
          isMinimized: false,
          content: Sudoku as typeof SvelteComponent
        }
      ]
    }
  }

  const paintWindow = {
    id: 5,
    title: 'softwares.paint.title',
    icon: 'paint',
    width: '',
    height: '',
    x: 200,
    y: 150,
    zIndex: 10,
    isMaximized: false,
    isMinimized: false,
    content: Paint as typeof SvelteComponent
  }
  
  const calculatorWindow = {
    id: 6,
    title: 'softwares.calculator.title',
    icon: 'calculator',
    width: '',
    height: '',
    x: 300,
    y: 150,
    zIndex: 10,
    isMaximized: false,
    isMinimized: false,
    content: Calculator as typeof SvelteComponent
  }
  
  const terminalWindow = {
    id: 7,
    title: 'softwares.terminal.title',
    icon: 'terminal',
    width: '700px',
    height: '500px',
    x: 350,
    y: 150,
    zIndex: 10,
    isMaximized: false,
    isMinimized: false,
    content: Terminal as typeof SvelteComponent
  }

  let windows: WindowData[] = [profileWindow];

  // Variables to manage the state of the windows
  let nextId = 8;
  let activeWindowIndex = 0;

  // Array to store window component references
  let windowRefs: any[] = [];

  // Functions to manage the windows
  function bringToFront(index: number): void {
    activeWindowIndex = index;

    const maxZIndex = Math.max(...windows.map(win => win.zIndex));
    
    windows = windows.map((win, i) => {
      if (i === index) {
        win.zIndex = maxZIndex + 100;
      }
      return win;
    });
  }

  function closeWindow(index: number): void {
    windows = windows.filter((_, i) => i !== index);
    if (windows.length > 0) {
      activeWindowIndex = 0;
    }
  }

  function minimizeWindow(index: number): void {
    windows = windows.map((win, i) => {
      if (i === index) {
        win.isMinimized = true;
      }
      return win;
    });
  }

  function maximizeWindow(index: number, isMaximized: boolean): void {
    windows = windows.map((win, i) => {
      if (i === index) {
        win.isMaximized = isMaximized;
      }
      return win;
    });
  }

  function createNewWindow(window: WindowData, tab?: string): void {
    const maxZIndex = windows.length > 0 
      ? Math.max(...windows.map(win => win.zIndex)) 
      : 0;

    windows = [...windows, {
      ...window,
      id: nextId,
      zIndex: maxZIndex + 100,
      x: 250 + Math.random() * 50,
      y: 80 + Math.random() * 50,
      props: tab ? { ...window.props, initialTab: tab } : window.props
    }];
    nextId++;
    activeWindowIndex = windows.length - 1;
  }

  function restoreWindow(index: number): void {
    windows = windows.map((win, i) => {
      if (i === index) {
        win.isMinimized = false;
      }
      return win;
    });
    bringToFront(index);
  }

  // Function to restore the window from the taskbar
  function restoreWindowFromTaskbar(index: number): void {
    if (windowRefs[index] && typeof windowRefs[index].restore === 'function') {
      windowRefs[index].restore();
      windows = windows.map((win, i) => {
        if (i === index) {
          win.isMinimized = false;
        }
        return win;
      });
      bringToFront(index);
    } else {
      restoreWindow(index);
    }
  }

  function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			//
		}
	}

  // Handle the creation of windows from the Taskbar
  function handleCreateWindow(event: CustomEvent<WindowData>) {
    createNewWindow(event.detail);
    // Ensure the newly created window is in the front
    const newWindowIndex = windows.length - 1;
    bringToFront(newWindowIndex);
  }

  // Selection rectangle variables
  let isSelecting = false;
  let selectionRect = {
    startX: 0,
    startY: 0,
    width: 0,
    height: 0,
    left: 0,
    top: 0,
    display: 'none'
  };

  function handleDesktopMouseDown(event: MouseEvent) {
    // Only start selection if it's a left click directly on the desktop
    if (event.button === 0 && (event.target as HTMLElement).classList.contains('desktop') || 
        (event.target as HTMLElement).classList.contains('desktop-icons')) {
      isSelecting = true;
      
      // Get the position of the mouse relative to the desktop
      const initialX = event.clientX;
      const initialY = event.clientY;
      selectionRect.startX = initialX;
      selectionRect.startY = initialY;
      selectionRect.left = initialX;
      selectionRect.top = initialY;
      selectionRect.width = 0;
      selectionRect.height = 0;
      selectionRect.display = 'block';
    }
  }

  function handleDesktopMouseMove(event: MouseEvent) {
    if (isSelecting) {
      // Calculate the dimensions of the selection rectangle
      const currentX = event.clientX;
      const currentY = event.clientY;
      
      // Calculate width and position based on drag direction
      if (currentX < selectionRect.startX) {
        selectionRect.width = selectionRect.startX - currentX;
        selectionRect.left = currentX;
      } else {
        selectionRect.width = currentX - selectionRect.startX;
        selectionRect.left = selectionRect.startX;
      }
      
      // Calculate height and position based on drag direction
      if (currentY < selectionRect.startY) {
        selectionRect.height = selectionRect.startY - currentY;
        selectionRect.top = currentY;
      } else {
        selectionRect.height = currentY - selectionRect.startY;
        selectionRect.top = selectionRect.startY;
      }
    }
  }

  function handleDesktopMouseUp() {
    if (isSelecting) {
      isSelecting = false;
      selectionRect.display = 'none';
    }
  }
</script>

<div 
  class="desktop" 
  on:mousedown={handleDesktopMouseDown}
  on:mousemove={handleDesktopMouseMove}
  on:mouseup={handleDesktopMouseUp}
  on:mouseleave={handleDesktopMouseUp}
  role="button"
  tabindex="0"
>
  <div class="desktop-icons">
    {#each desktopIcons as icon}
      <div class="desktop-icon" on:click={icon.onClick} on:keydown={handleKeydown} role="button" tabindex="0">
        <div class="desktop-icon-image" style="background-color: {icon.color}">
          <Icon name={icon.icon} size="2rem" />
        </div>
        <div class="desktop-icon-label">{$t(icon.name)}</div>
      </div>
    {/each}
  </div>

  {#if selectionRect.display === 'block'}
    <div 
      class="selection-box"
      style="
        left: {selectionRect.left}px;
        top: {selectionRect.top}px;
        width: {selectionRect.width}px;
        height: {selectionRect.height}px;
      "
    ></div>
  {/if}

  {#each windows as window, index (window.id)}
    <Window
      title={window.title}
      icon={window.icon}
      isMaximized={window.isMaximized}
      isMinimized={window.isMinimized}
      zIndex={window.zIndex}
      content={window.content}
      props={window.props}
      on:close={() => closeWindow(index)}
      on:minimize={() => minimizeWindow(index)}
      on:maximize={e => maximizeWindow(index, e.detail.isMaximized)}
      on:focus={() => bringToFront(index)}
      on:restore={() => bringToFront(index)}
      on:createWindow={handleCreateWindow}
      bind:x={window.x}
      bind:y={window.y}
      bind:width={window.width}
      bind:height={window.height}
      bind:this={windowRefs[index]}
    />
  {/each}

  <Taskbar on:createWindow={handleCreateWindow}>
    <svelte:fragment slot="taskbar-items">
      {#each windows as window, index (window.id)}
        <div 
          class="taskbar-items" 
          class:active={!window.isMinimized}
          on:click={() => window.isMinimized ? restoreWindowFromTaskbar(index) : minimizeWindow(index)}
          on:keydown={handleKeydown}
          role="button"
          tabindex="0"
          title={window.title}
        >
          <Icon name={window.icon} size="20" />
          <span class="taskbar-item-title">{$t(window.title)}</span>
        </div>
      {/each}
    </svelte:fragment>
  </Taskbar>
</div>

<style>
  .desktop {
    width: 100%;
    height: 100vh;
    background-image: url('/images/background.jpg');
    background-size: cover;
    background-position: center;
    background-color: var(--win-blue);
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
  }

  .desktop-icons {
    flex: 1;
    padding: 1.5vh 1.5vw;
    display: grid;
    grid-auto-flow: column;
    grid-template-rows: repeat(auto-fill, minmax(6rem, auto));
    grid-auto-columns: 7rem;
    grid-gap: 1.5rem;
    align-content: start;
    overflow: auto;
    justify-content: start;
    width: fit-content;
  }

  .desktop-icon {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    cursor: pointer;
    padding: 8px;
    border-radius: 4px;
    color: white;
    transition: transform 0.2s ease;
    width: 100%;
  }
  
  .desktop-icon:hover {
    background-color: rgba(255, 255, 255, 0.1);
    transform: scale(1.05);
  }
  
  .desktop-icon-image {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 8px;
    font-size: 2rem;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    color: white;
  }
  
  .desktop-icon-label {
    font-size: 0.85rem;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    background-color: rgba(var(--taskbar-bg-rgb), 0.3);
    padding: 3px 6px;
    border-radius: 3px;
    font-weight: 500;
    margin-top: 5px;
    text-align: center;
    color: var(--text-primary);
  }

  .selection-box {
    position: absolute;
    border: 1px dashed rgba(0, 120, 215, 0.8);
    background-color: rgba(0, 120, 215, 0.2);
    pointer-events: none;
    z-index: 1;
  }

  .taskbar-items {
    margin-left: 10px;
    min-width: 180px;
    height: 100%;
    display: flex;
    align-items: center;
    padding: 0 10px;
    cursor: pointer;
    transition: background-color 0.1s;
    position: relative;
    color: var(--text-primary);
    box-sizing: border-box;
    background-color: var(--taskbar-bg);
    border-bottom: 2px solid var(--win-accent);
  }
  
  .taskbar-items:hover {
    background-color: var(--taskbar-hover);
  }

  .taskbar-items.active {
    background-color: var(--taskbar-active);
  }
  
  .taskbar-item-title {
    margin-left: 8px;
    font-size: 0.9rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 120px;
  }

  @media (max-width: 600px) {
    .desktop-icons {
      grid-template-columns: repeat(auto-fill, minmax(4rem, 1fr));
      grid-auto-columns: 6rem;
      grid-auto-rows: minmax(5rem, auto);
      grid-gap: 1rem;
      padding: 1vh 1vw;
    }
  }
</style>
