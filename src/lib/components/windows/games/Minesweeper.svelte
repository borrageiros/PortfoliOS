<script lang="ts">
  import { onMount } from 'svelte';
  import { t } from '$lib/i18n/i18n';

  // Game state
  let grid: Cell[][] = [];
  let gameOver = false;
  let gameWon = false;
  let flagMode = false;
  let mineCount = 10;
  let flagsPlaced = 0;
  let timerValue = 0;
  let timerInterval: number;
  let firstClick = true;
  let difficulty = 'beginner';
  
  // Grid sizes for different difficulties
  const difficulties = {
    beginner: { rows: 9, cols: 9, mines: 10 },
    intermediate: { rows: 16, cols: 16, mines: 40 },
    expert: { rows: 16, cols: 30, mines: 99 }
  };
  
  // Cell interface
  interface Cell {
    row: number;
    col: number;
    isMine: boolean;
    isRevealed: boolean;
    isFlagged: boolean;
    adjacentMines: number;
  }
  
  // Initialize the game based on difficulty
  function initializeGame(diff: string) {
    difficulty = diff;
    const { rows, cols, mines } = difficulties[diff as keyof typeof difficulties];
    mineCount = mines;
    flagsPlaced = 0;
    gameOver = false;
    gameWon = false;
    firstClick = true;
    timerValue = 0;
    
    clearInterval(timerInterval);
    
    // Create empty grid
    grid = Array(rows).fill(null).map((_, rowIndex) => 
      Array(cols).fill(null).map((_, colIndex) => ({
        row: rowIndex,
        col: colIndex,
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        adjacentMines: 0
      }))
    );
  }
  
  // Place mines after first click to ensure first click is safe
  function placeMines(safeRow: number, safeCol: number) {
    const { rows, cols, mines } = difficulties[difficulty as keyof typeof difficulties];
    let minesPlaced = 0;
    
    while (minesPlaced < mines) {
      const randomRow = Math.floor(Math.random() * rows);
      const randomCol = Math.floor(Math.random() * cols);
      
      // Skip if it's the safe cell or already a mine
      if ((randomRow === safeRow && randomCol === safeCol) || grid[randomRow][randomCol].isMine) {
        continue;
      }
      
      grid[randomRow][randomCol].isMine = true;
      minesPlaced++;
    }
    
    // Calculate adjacent mines for each cell
    calculateAdjacentMines();
  }
  
  // Calculate how many mines are adjacent to each cell
  function calculateAdjacentMines() {
    const { rows, cols } = difficulties[difficulty as keyof typeof difficulties];
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (grid[row][col].isMine) continue;
        
        let count = 0;
        for (let r = Math.max(0, row - 1); r <= Math.min(rows - 1, row + 1); r++) {
          for (let c = Math.max(0, col - 1); c <= Math.min(cols - 1, col + 1); c++) {
            if (grid[r][c].isMine) count++;
          }
        }
        
        grid[row][col].adjacentMines = count;
      }
    }
    
    grid = grid; // Trigger reactivity
  }
  
  // Reveal a cell when clicked
  function revealCell(row: number, col: number) {
    if (gameOver || gameWon || grid[row][col].isRevealed || grid[row][col].isFlagged) return;
    
    // For first click, place mines and start timer
    if (firstClick) {
      placeMines(row, col);
      startTimer();
      firstClick = false;
    }
    
    const cell = grid[row][col];
    cell.isRevealed = true;
    
    // Game over if it's a mine
    if (cell.isMine) {
      gameOver = true;
      revealAllMines();
      clearInterval(timerInterval);
      return;
    }
    
    // If cell has no adjacent mines, reveal neighbors recursively
    if (cell.adjacentMines === 0) {
      const { rows, cols } = difficulties[difficulty as keyof typeof difficulties];
      
      for (let r = Math.max(0, row - 1); r <= Math.min(rows - 1, row + 1); r++) {
        for (let c = Math.max(0, col - 1); c <= Math.min(cols - 1, col + 1); c++) {
          if (r === row && c === col) continue;
          if (!grid[r][c].isRevealed && !grid[r][c].isFlagged) {
            revealCell(r, c);
          }
        }
      }
    }
    
    checkWinCondition();
    grid = grid; // Trigger reactivity
  }
  
  // Toggle flag on a cell
  function toggleFlag(row: number, col: number) {
    if (gameOver || gameWon || grid[row][col].isRevealed) return;
    
    const cell = grid[row][col];
    
    if (cell.isFlagged) {
      cell.isFlagged = false;
      flagsPlaced--;
    } else if (flagsPlaced < mineCount) {
      cell.isFlagged = true;
      flagsPlaced++;
    }
    
    grid = grid; // Trigger reactivity
  }
  
  // Reveal all mines when game is over
  function revealAllMines() {
    const { rows, cols } = difficulties[difficulty as keyof typeof difficulties];
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (grid[row][col].isMine) {
          grid[row][col].isRevealed = true;
        }
      }
    }
    
    grid = grid; // Trigger reactivity
  }
  
  // Check if the player has won
  function checkWinCondition() {
    const { rows, cols, mines } = difficulties[difficulty as keyof typeof difficulties];
    let revealedCount = 0;
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (grid[row][col].isRevealed) revealedCount++;
      }
    }
    
    if (revealedCount === rows * cols - mines) {
      gameWon = true;
      clearInterval(timerInterval);
      
      // Flag all mines
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          if (grid[row][col].isMine && !grid[row][col].isFlagged) {
            grid[row][col].isFlagged = true;
            flagsPlaced++;
          }
        }
      }
    }
  }
  
  // Start the timer
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
  
  // Handle cell click
  function handleCellClick(event: MouseEvent, row: number, col: number) {
    if (flagMode || event.button === 2) {
      toggleFlag(row, col);
    } else {
      revealCell(row, col);
    }
  }
  
  // Toggle flag mode
  function toggleFlagMode() {
    flagMode = !flagMode;
  }
  
  // Initialize the game on mount
  onMount(() => {
    initializeGame('beginner');
    
    // Prevent context menu on right-click
    document.addEventListener('contextmenu', (e) => {
      if (e.target instanceof HTMLElement && e.target.closest('.minesweeper')) {
        e.preventDefault();
      }
    });
    
    return () => {
      clearInterval(timerInterval);
    };
  });
</script>

<div class="content minesweeper">
  <div class="game-container">
    <div class="controls">
      <div class="counter mines-counter">{mineCount - flagsPlaced}</div>
      
      <button class="reset-button" on:click={resetGame}>
        {#if gameOver}
          😵
        {:else if gameWon}
          😎
        {:else}
          🙂
        {/if}
      </button>
      
      <div class="counter timer">{timerValue.toString().padStart(3, '0')}</div>
    </div>
    
    <div class="difficulty-selector">
      <button class:selected={difficulty === 'beginner'} on:click={() => initializeGame('beginner')}>
        {$t('games.minesweeper.beginner')}
      </button>
      <button class:selected={difficulty === 'intermediate'} on:click={() => initializeGame('intermediate')}>
        {$t('games.minesweeper.intermediate')}
      </button>
      <button class:selected={difficulty === 'expert'} on:click={() => initializeGame('expert')}>
        {$t('games.minesweeper.expert')}
      </button>
    </div>
    
    <div class="flag-mode">
      <button class:active={flagMode} on:click={toggleFlagMode}>
        🚩 {flagMode ? $t('games.minesweeper.flagModeEnabled') : $t('games.minesweeper.flagModeDisabled')}
      </button>
    </div>
    
    <div class="grid" class:beginner={difficulty === 'beginner'} class:intermediate={difficulty === 'intermediate'} class:expert={difficulty === 'expert'}>
      {#each grid as row}
        {#each row as cell}
          <button 
            class="cell" 
            class:revealed={cell.isRevealed}
            class:flagged={cell.isFlagged}
            class:mine={cell.isRevealed && cell.isMine}
            on:click={(e) => handleCellClick(e, cell.row, cell.col)}
            on:contextmenu|preventDefault={(e) => handleCellClick(e, cell.row, cell.col)}
            disabled={gameOver || gameWon}
          >
            {#if cell.isFlagged}
              🚩
            {:else if cell.isRevealed}
              {#if cell.isMine}
                💣
              {:else if cell.adjacentMines > 0}
                <span class="adjacent-{cell.adjacentMines}">{cell.adjacentMines}</span>
              {/if}
            {/if}
          </button>
        {/each}
      {/each}
    </div>
    
    {#if gameOver}
      <div class="game-over">¡You lost!</div>
    {:else if gameWon}
      <div class="game-won">¡You won!</div>
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
  
  .difficulty-selector button, .flag-mode button {
    background-color: #c0c0c0;
    border: 2px outset #ffffff;
    padding: 5px 10px;
    cursor: pointer;
    flex: 1;
    margin: 0 2px;
  }
  
  .difficulty-selector button:active, .flag-mode button:active {
    border: 2px inset #ffffff;
  }
  
  .difficulty-selector button.selected {
    border: 2px inset #ffffff;
    background-color: #a0a0a0;
  }
  
  .flag-mode {
    margin-bottom: 10px;
  }
  
  .flag-mode button.active {
    border: 2px inset #ffffff;
    background-color: #a0a0a0;
  }
  
  .grid {
    display: grid;
    gap: 1px;
    border: 3px inset #ffffff;
  }
  
  .grid.beginner {
    grid-template-columns: repeat(9, 25px);
    grid-template-rows: repeat(9, 25px);
  }
  
  .grid.intermediate {
    grid-template-columns: repeat(16, 25px);
    grid-template-rows: repeat(16, 25px);
  }
  
  .grid.expert {
    grid-template-columns: repeat(30, 25px);
    grid-template-rows: repeat(16, 25px);
  }
  
  .cell {
    width: 25px;
    height: 25px;
    background-color: #c0c0c0;
    border: 2px outset #ffffff;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    font-size: 16px;
    cursor: pointer;
    padding: 0;
  }
  
  .cell.revealed {
    border: 1px solid #808080;
    background-color: #d1d1d1;
  }
  
  .cell.mine {
    background-color: #ff0000;
  }
  
  .cell:active:not(.revealed) {
    border: 2px inset #ffffff;
  }
  
  .adjacent-1 { color: blue; }
  .adjacent-2 { color: green; }
  .adjacent-3 { color: red; }
  .adjacent-4 { color: darkblue; }
  .adjacent-5 { color: brown; }
  .adjacent-6 { color: cyan; }
  .adjacent-7 { color: black; }
  .adjacent-8 { color: gray; }
  
  .game-over, .game-won {
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
</style>
