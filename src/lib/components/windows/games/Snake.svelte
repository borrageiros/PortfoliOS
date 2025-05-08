<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { t } from '$lib/i18n/i18n';

  // Game state
  let grid: Cell[][] = [];
  let snake: Point[] = [];
  let direction: Direction = 'RIGHT';
  let nextDirection: Direction = 'RIGHT';
  let food: Point | null = null;
  let gameOver = false;
  let gameWon = false;
  let score = 0;
  let timerValue = 0;
  let timerInterval: number;
  let gameInterval: number;
  let difficulty = 'beginner';
  let isPaused = false;
  
  // Types
  type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
  
  interface Point {
    row: number;
    col: number;
  }
  
  interface Cell {
    row: number;
    col: number;
    isSnake: boolean;
    isFood: boolean;
    isHead: boolean;
  }
  
  // Grid sizes and speeds for different difficulties
  const difficulties = {
    beginner: { rows: 15, cols: 15, speed: 200 },
    intermediate: { rows: 20, cols: 20, speed: 150 },
    expert: { rows: 25, cols: 25, speed: 100 }
  };
  
  // Initialize the game based on difficulty
  function initializeGame(diff: string) {
    difficulty = diff;
    const { rows, cols } = difficulties[diff as keyof typeof difficulties];
    
    gameOver = false;
    gameWon = false;
    isPaused = false;
    score = 0;
    timerValue = 0;
    direction = 'RIGHT';
    nextDirection = 'RIGHT';
    
    clearInterval(timerInterval);
    clearInterval(gameInterval);
    
    // Create empty grid
    grid = Array(rows).fill(null).map((_, rowIndex) => 
      Array(cols).fill(null).map((_, colIndex) => ({
        row: rowIndex,
        col: colIndex,
        isSnake: false,
        isFood: false,
        isHead: false
      }))
    );
    
    // Initialize snake at center
    const startRow = Math.floor(rows / 2);
    const startCol = Math.floor(cols / 2);
    snake = [
      { row: startRow, col: startCol },
      { row: startRow, col: startCol - 1 },
      { row: startRow, col: startCol - 2 }
    ];
    
    // Update grid with snake
    updateGrid();
    
    // Place food
    placeFood();
    
    // Start timer
    startTimer();
    
    // Start game loop
    startGameLoop();
  }
  
  // Update the grid based on snake and food positions
  function updateGrid() {
    const { rows, cols } = difficulties[difficulty as keyof typeof difficulties];
    
    // Reset grid
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        grid[row][col].isSnake = false;
        grid[row][col].isFood = false;
        grid[row][col].isHead = false;
      }
    }
    
    // Update snake cells
    for (let i = 0; i < snake.length; i++) {
      const { row, col } = snake[i];
      if (row >= 0 && row < rows && col >= 0 && col < cols) {
        grid[row][col].isSnake = true;
        if (i === 0) {
          grid[row][col].isHead = true;
        }
      }
    }
    
    // Update food cell
    if (food) {
      grid[food.row][food.col].isFood = true;
    }
    
    // Trigger reactivity
    grid = grid;
  }
  
  // Place food at random empty location
  function placeFood() {
    const { rows, cols } = difficulties[difficulty as keyof typeof difficulties];
    
    // Find all empty cells
    const emptyCells: Point[] = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (!grid[row][col].isSnake) {
          emptyCells.push({ row, col });
        }
      }
    }
    
    // Choose random empty cell for food
    if (emptyCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      food = emptyCells[randomIndex];
    } else {
      // Game won if no empty cells!
      gameWon = true;
      clearInterval(gameInterval);
      clearInterval(timerInterval);
    }
    
    updateGrid();
  }
  
  // Game logic - move snake once
  function moveSnake() {
    if (gameOver || gameWon || isPaused) return;
    
    // Update direction based on nextDirection
    direction = nextDirection;
    
    // Calculate new head position
    const head = { ...snake[0] };
    
    switch (direction) {
      case 'UP':
        head.row--;
        break;
      case 'DOWN':
        head.row++;
        break;
      case 'LEFT':
        head.col--;
        break;
      case 'RIGHT':
        head.col++;
        break;
    }
    
    // Check for collision with walls
    const { rows, cols } = difficulties[difficulty as keyof typeof difficulties];
    if (head.row < 0 || head.row >= rows || head.col < 0 || head.col >= cols) {
      gameOver = true;
      clearInterval(gameInterval);
      clearInterval(timerInterval);
      return;
    }
    
    // Check for collision with self (excluding tail which will move)
    for (let i = 0; i < snake.length - 1; i++) {
      if (head.row === snake[i].row && head.col === snake[i].col) {
        gameOver = true;
        clearInterval(gameInterval);
        clearInterval(timerInterval);
        return;
      }
    }
    
    // Check if eating food
    let growing = false;
    if (food && head.row === food.row && head.col === food.col) {
      growing = true;
      score += 10;
      food = null;
      placeFood();
    }
    
    // Move snake
    snake.unshift(head);
    if (!growing) {
      snake.pop();
    }
    
    // Update grid with new snake position
    updateGrid();
  }
  
  // Start game loop
  function startGameLoop() {
    const speed = difficulties[difficulty as keyof typeof difficulties].speed;
    gameInterval = setInterval(() => {
      moveSnake();
    }, speed);
  }
  
  // Start timer
  function startTimer() {
    timerInterval = setInterval(() => {
      timerValue++;
      if (timerValue >= 999) clearInterval(timerInterval);
    }, 1000);
  }
  
  // Reset the game
  function resetGame() {
    initializeGame(difficulty);
  }
  
  // Toggle pause
  function togglePause() {
    isPaused = !isPaused;
    if (isPaused) {
      clearInterval(gameInterval);
      clearInterval(timerInterval);
    } else {
      startGameLoop();
      startTimer();
    }
  }
  
  // Handle keyboard input
  function handleKeydown(event: KeyboardEvent) {
    if (gameOver || gameWon) return;
    
    switch (event.key) {
      case 'ArrowUp':
        if (direction !== 'DOWN') nextDirection = 'UP';
        break;
      case 'ArrowDown':
        if (direction !== 'UP') nextDirection = 'DOWN';
        break;
      case 'ArrowLeft':
        if (direction !== 'RIGHT') nextDirection = 'LEFT';
        break;
      case 'ArrowRight':
        if (direction !== 'LEFT') nextDirection = 'RIGHT';
        break;
      case 'p':
      case 'P':
        togglePause();
        break;
      case 'r':
      case 'R':
        resetGame();
        break;
    }
  }
  
  // Direction button press
  function handleDirectionButton(newDirection: Direction) {
    if (gameOver || gameWon) return;
    
    switch (newDirection) {
      case 'UP':
        if (direction !== 'DOWN') nextDirection = 'UP';
        break;
      case 'DOWN':
        if (direction !== 'UP') nextDirection = 'DOWN';
        break;
      case 'LEFT':
        if (direction !== 'RIGHT') nextDirection = 'LEFT';
        break;
      case 'RIGHT':
        if (direction !== 'LEFT') nextDirection = 'RIGHT';
        break;
    }
  }
  
  // Initialize the game on mount
  onMount(() => {
    initializeGame('beginner');
    
    // Add keyboard event listener
    window.addEventListener('keydown', handleKeydown);
  });
  
  // Clean up on destroy
  onDestroy(() => {
    clearInterval(gameInterval);
    clearInterval(timerInterval);
    window.removeEventListener('keydown', handleKeydown);
  });
</script>

<div class="content snake">
  <div class="game-container">
    <div class="controls">
      <div class="counter score">{score}</div>
      
      <button class="reset-button" on:click={resetGame}>
        {#if gameOver}
          😵
        {:else if gameWon}
          😎
        {:else if isPaused}
          ⏸️
        {:else}
          🐍
        {/if}
      </button>
      
      <div class="counter timer">{timerValue.toString().padStart(3, '0')}</div>
    </div>
    
    <div class="difficulty-selector">
      <button class:selected={difficulty === 'beginner'} on:click={() => initializeGame('beginner')}>
        {$t('games.snake.beginner')}
      </button>
      <button class:selected={difficulty === 'intermediate'} on:click={() => initializeGame('intermediate')}>
        {$t('games.snake.intermediate')}
      </button>
      <button class:selected={difficulty === 'expert'} on:click={() => initializeGame('expert')}>
        {$t('games.snake.expert')}
      </button>
    </div>
    
    <div class="directions">
      <button class="direction-button up" on:click={() => handleDirectionButton('UP')}>⬆️</button>
      <div class="direction-row">
        <button class="direction-button left" on:click={() => handleDirectionButton('LEFT')}>⬅️</button>
        <button class="direction-button right" on:click={() => handleDirectionButton('RIGHT')}>➡️</button>
      </div>
      <button class="direction-button down" on:click={() => handleDirectionButton('DOWN')}>⬇️</button>
    </div>
    
    <div class="grid" class:beginner={difficulty === 'beginner'} class:intermediate={difficulty === 'intermediate'} class:expert={difficulty === 'expert'}>
      {#each grid as row}
        {#each row as cell}
          <div 
            class="cell" 
            class:snake={cell.isSnake}
            class:head={cell.isHead}
            class:food={cell.isFood}
          ></div>
        {/each}
      {/each}
    </div>
    
    {#if gameOver}
      <div class="game-over">{$t('games.snake.gameover')}</div>
    {:else if gameWon}
      <div class="game-won">{$t('games.snake.victory')}</div>
    {:else if isPaused}
      <div class="game-paused">{$t('games.snake.paused')}</div>
    {/if}
  </div>
</div>

<style>
  .content {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
    background-color: #c0c0c0;
    padding: 16px;
    box-sizing: border-box;
  }
  
  .game-container {
    display: flex;
    flex-direction: column;
    background-color: #c0c0c0;
    border: 3px outset #ffffff;
    padding: 10px;
  }
  
  .controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #c0c0c0;
    border: 2px inset #ffffff;
    padding: 5px;
    margin-bottom: 10px;
  }
  
  .counter {
    background-color: black;
    color: red;
    font-family: 'Digital', monospace;
    font-size: 24px;
    font-weight: bold;
    padding: 3px 5px;
    min-width: 60px;
    text-align: center;
    border: 2px inset #808080;
  }
  
  .reset-button {
    background-color: #c0c0c0;
    border: 2px outset #ffffff;
    font-size: 24px;
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
  
  .reset-button:active {
    border: 2px inset #ffffff;
  }
  
  .difficulty-selector {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }
  
  .difficulty-selector button {
    background-color: #c0c0c0;
    border: 2px outset #ffffff;
    padding: 5px 10px;
    cursor: pointer;
    flex: 1;
    margin: 0 2px;
  }
  
  .difficulty-selector button:active {
    border: 2px inset #ffffff;
  }
  
  .difficulty-selector button.selected {
    border: 2px inset #ffffff;
    background-color: #a0a0a0;
  }
  
  .directions {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 10px;
  }
  
  .direction-row {
    display: flex;
    gap: 30px;
  }
  
  .direction-button {
    background-color: #c0c0c0;
    border: 2px outset #ffffff;
    width: 40px;
    height: 40px;
    font-size: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    margin: 5px;
  }
  
  .direction-button:active {
    border: 2px inset #ffffff;
  }
  
  .grid {
    display: grid;
    gap: 1px;
    border: 3px inset #ffffff;
    background-color: #000000;
  }
  
  .grid.beginner {
    grid-template-columns: repeat(15, 20px);
    grid-template-rows: repeat(15, 20px);
  }
  
  .grid.intermediate {
    grid-template-columns: repeat(20, 15px);
    grid-template-rows: repeat(20, 15px);
  }
  
  .grid.expert {
    grid-template-columns: repeat(25, 12px);
    grid-template-rows: repeat(25, 12px);
  }
  
  .cell {
    background-color: #000000;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .cell.snake {
    background-color: #4CAF50;
  }
  
  .cell.head {
    background-color: #2E7D32;
  }
  
  .cell.food {
    background-color: #F44336;
    border-radius: 50%;
  }
  
  .game-over, .game-won, .game-paused {
    margin-top: 15px;
    text-align: center;
    font-weight: bold;
    font-size: 18px;
  }
  
  .game-over {
    color: red;
  }
  
  .game-won {
    color: green;
  }
  
  .game-paused {
    color: blue;
  }
</style> 