<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { t } from '$lib/i18n/i18n';

  // Game state
  let board: number[][] = [];
  let solution: number[][] = [];
  let initialBoard: number[][] = [];
  let userEnteredValues: boolean[][] = [];
  let selectedCell: { row: number; col: number } | null = null;
  let isPaused = false;
  let gameOver = false;
  let isVictory = false;
  let difficulty = 'beginner';
  let timer = 0;
  let timerInterval: ReturnType<typeof setInterval>;
  let mistakes = 0;
  const MAX_MISTAKES = 3;
  let showNotesMode = false;
  let cellNotes: number[][][] = [];
  
  // Difficulties and related settings
  const difficulties = {
    beginner: { emptyPercentage: 0.4 },
    intermediate: { emptyPercentage: 0.5 },
    expert: { emptyPercentage: 0.65 }
  };
  
  onMount(() => {
    initializeGame(difficulty);
  });
  
  onDestroy(() => {
    clearInterval(timerInterval);
  });
  
  // Initialize a new game with selected difficulty
  function initializeGame(diff: string) {
    difficulty = diff;
    clearInterval(timerInterval);
    
    timer = 0;
    mistakes = 0;
    isPaused = false;
    gameOver = false;
    isVictory = false;
    selectedCell = null;
    showNotesMode = false;
    
    generateSudokuBoard();
    startTimer();
  }
  
  // Start the timer
  function startTimer() {
    timerInterval = setInterval(() => {
      if (!isPaused && !gameOver) {
        timer++;
      }
    }, 1000);
  }
  
  // Format timer display as mm:ss
  function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  
  // Generate a valid sudoku board
  function generateSudokuBoard() {
    // First create an empty board
    board = Array(9).fill(null).map(() => Array(9).fill(0));
    solution = Array(9).fill(null).map(() => Array(9).fill(0));
    
    // Generate a completed sudoku grid solution
    fillSolution(solution);
    
    // Copy the solution
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        board[i][j] = solution[i][j];
      }
    }
    
    // Remove numbers based on difficulty
    const emptyPercentage = difficulties[difficulty as keyof typeof difficulties].emptyPercentage;
    const cellsToRemove = Math.floor(81 * emptyPercentage);
    
    // Track which cells are user entered (initially false for all)
    userEnteredValues = Array(9).fill(null).map(() => Array(9).fill(false));
    
    // Initialize cell notes
    cellNotes = Array(9).fill(null).map(() => 
      Array(9).fill(null).map(() => [])
    );
    
    // Randomly remove cells
    let removed = 0;
    while (removed < cellsToRemove) {
      const row = Math.floor(Math.random() * 9);
      const col = Math.floor(Math.random() * 9);
      
      if (board[row][col] !== 0) {
        board[row][col] = 0;
        userEnteredValues[row][col] = true;
        removed++;
      }
    }
    
    // Save the initial state
    initialBoard = JSON.parse(JSON.stringify(board));
  }
  
  // Fill the solution grid with a valid Sudoku solution
  function fillSolution(grid: number[][]): boolean {
    return fillGrid(grid);
  }
  
  // Recursive function to fill the grid
  function fillGrid(grid: number[][]): boolean {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === 0) {
          // Try each number 1-9
          const numbers = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
          
          for (const num of numbers) {
            if (isValidPlacement(grid, row, col, num)) {
              grid[row][col] = num;
              
              if (fillGrid(grid)) {
                return true;
              }
              
              grid[row][col] = 0;
            }
          }
          
          return false;
        }
      }
    }
    
    return true;
  }
  
  // Check if a number can be placed at a position
  function isValidPlacement(grid: number[][], row: number, col: number, num: number): boolean {
    // Check row
    for (let i = 0; i < 9; i++) {
      if (grid[row][i] === num) {
        return false;
      }
    }
    
    // Check column
    for (let i = 0; i < 9; i++) {
      if (grid[i][col] === num) {
        return false;
      }
    }
    
    // Check 3x3 box
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (grid[boxRow + i][boxCol + j] === num) {
          return false;
        }
      }
    }
    
    return true;
  }
  
  // Shuffle array elements (Fisher-Yates algorithm)
  function shuffleArray(array: number[]): number[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }
  
  // Handle selecting a cell
  function handleCellClick(row: number, col: number) {
    if (!isPaused && !gameOver && userEnteredValues[row][col]) {
      selectedCell = { row, col };
    }
  }
  
  // Handle keyboard input for selected cell
  function handleKeydown(event: KeyboardEvent) {
    if (isPaused || gameOver || !selectedCell) return;
    
    const { row, col } = selectedCell;
    
    if (event.key === 'Escape') {
      // Deselect cell
      selectedCell = null;
    } else if (event.key === 'Delete' || event.key === 'Backspace') {
      // Clear cell
      if (userEnteredValues[row][col]) {
        board[row][col] = 0;
        cellNotes[row][col] = [];
      }
    } else if (/^[1-9]$/.test(event.key)) {
      // Enter a number
      const num = parseInt(event.key);
      
      if (showNotesMode) {
        toggleNote(row, col, num);
      } else {
        if (userEnteredValues[row][col]) {
          const originalValue = board[row][col];
          board[row][col] = num;
          
          if (num !== solution[row][col]) {
            // Wrong answer
            mistakes++;
            setTimeout(() => {
              if (originalValue === 0) {
                board[row][col] = 0;
              } else {
                board[row][col] = originalValue;
              }
              
              if (mistakes >= MAX_MISTAKES) {
                gameOver = true;
                clearInterval(timerInterval);
              }
            }, 500);
          } else {
            // Clear notes when correct value is entered
            cellNotes[row][col] = [];
            
            // Check if solved
            checkForVictory();
          }
        }
      }
    }
  }
  
  // Toggle a note in a cell
  function toggleNote(row: number, col: number, num: number) {
    if (!userEnteredValues[row][col] || board[row][col] !== 0) return;
    
    const noteIndex = cellNotes[row][col].indexOf(num);
    if (noteIndex === -1) {
      cellNotes[row][col].push(num);
      cellNotes[row][col].sort();
    } else {
      cellNotes[row][col].splice(noteIndex, 1);
    }
  }
  
  // Check if the board is solved correctly
  function checkForVictory() {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] !== solution[row][col]) {
          return;
        }
      }
    }
    
    // If we get here, all cells match the solution
    isVictory = true;
    gameOver = true;
    clearInterval(timerInterval);
  }
  
  // Undo most recent move
  function undoMove() {
    // In a real implementation, you would track moves in a history stack
    // This is a simplified version that just resets to the initial puzzle
    resetBoard();
  }
  
  // Reset the board to initial state
  function resetBoard() {
    board = JSON.parse(JSON.stringify(initialBoard));
    mistakes = 0;
    showNotesMode = false;
    selectedCell = null;
    
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        cellNotes[row][col] = [];
      }
    }
  }
  
  // Change to a different difficulty
  function changeDifficulty(diff: string) {
    if (diff !== difficulty) {
      initializeGame(diff);
    }
  }
  
  // Toggle pause state
  function togglePause() {
    isPaused = !isPaused;
  }
  
  // Toggle note mode
  function toggleNoteMode() {
    showNotesMode = !showNotesMode;
  }
  
  // Get cell class based on its state
  function getCellClass(row: number, col: number) {
    const isSelected = selectedCell && selectedCell.row === row && selectedCell.col === col;
    const isInitial = !userEnteredValues[row][col];
    const boxRowStart = Math.floor(row / 3) * 3;
    const boxColStart = Math.floor(col / 3) * 3;
    const isInSameBox = selectedCell && 
      Math.floor(selectedCell.row / 3) === Math.floor(row / 3) && 
      Math.floor(selectedCell.col / 3) === Math.floor(col / 3);
    const isInSameRowOrCol = selectedCell && 
      (selectedCell.row === row || selectedCell.col === col);
    
    return [
      'cell',
      isSelected ? 'selected' : '',
      isInitial ? 'initial' : 'editable',
      isInSameBox ? 'same-box' : '',
      isInSameRowOrCol ? 'same-line' : ''
    ].filter(Boolean).join(' ');
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="sudoku-container">
  <div class="game-header">
    <div class="game-info">
      <div class="game-timer">{formatTime(timer)}</div>
      <div class="game-mistakes">
        {$t('games.sudoku.mistakes')}: {mistakes}/{MAX_MISTAKES}
      </div>
    </div>
    
    <div class="game-controls">
      <div class="difficulty-selector">
        <button class="difficulty-btn {difficulty === 'beginner' ? 'active' : ''}" 
          on:click={() => changeDifficulty('beginner')}>
          {$t('games.sudoku.beginner')}
        </button>
        <button class="difficulty-btn {difficulty === 'intermediate' ? 'active' : ''}"
          on:click={() => changeDifficulty('intermediate')}>
          {$t('games.sudoku.intermediate')}
        </button>
        <button class="difficulty-btn {difficulty === 'expert' ? 'active' : ''}"
          on:click={() => changeDifficulty('expert')}>
          {$t('games.sudoku.expert')}
        </button>
      </div>
      
      <div class="game-actions">
        <button class="action-btn" on:click={resetBoard}>
          {$t('games.sudoku.reset')}
        </button>
        <button class="action-btn" on:click={togglePause}>
          {isPaused ? $t('games.sudoku.resume') : $t('games.sudoku.pause')}
        </button>
        <button class="action-btn note-btn {showNotesMode ? 'active' : ''}" on:click={toggleNoteMode}>
          {$t('games.sudoku.notes')}
        </button>
      </div>
    </div>
  </div>
  
  <div class="board-container" class:paused={isPaused}>
    {#if isPaused}
      <div class="pause-overlay">
        <div class="pause-message">{$t('games.sudoku.paused')}</div>
      </div>
    {/if}
    
    {#if gameOver}
      <div class="gameover-overlay">
        <div class="gameover-message">
          {#if isVictory}
            {$t('games.sudoku.victory')}
          {:else}
            {$t('games.sudoku.gameover')}
          {/if}
        </div>
        <button class="play-again-btn" on:click={() => initializeGame(difficulty)}>
          {$t('games.sudoku.playAgain')}
        </button>
      </div>
    {/if}
    
    <div class="sudoku-board">
      {#each board as row, rowIndex}
        {#each row as cell, colIndex}
          <div 
            class={getCellClass(rowIndex, colIndex)}
            on:click={() => handleCellClick(rowIndex, colIndex)}
            on:keydown={handleKeydown}
            role="button"
            tabindex="0"
          >
            {#if cell !== 0}
              <span class="cell-value">{cell}</span>
            {:else if cellNotes[rowIndex][colIndex]?.length > 0}
              <div class="cell-notes">
                {#each Array(9).fill(0) as _, i}
                  <div class="note-slot">{cellNotes[rowIndex][colIndex].includes(i+1) ? i+1 : ''}</div>
                {/each}
              </div>
            {/if}
          </div>
        {/each}
      {/each}
    </div>
  </div>
  
  <div class="number-pad">
    {#each Array(9).fill(0) as _, i}
      <button class="number-btn" on:click={() => {
        if (selectedCell && !isPaused && !gameOver) {
          const event = { key: (i + 1).toString() } as KeyboardEvent;
          handleKeydown(event);
        }
      }}>
        {i + 1}
      </button>
    {/each}
    <button class="number-btn clear-btn" on:click={() => {
      if (selectedCell && !isPaused && !gameOver) {
        const event = { key: 'Delete' } as KeyboardEvent;
        handleKeydown(event);
      }
    }}>×</button>
  </div>
</div>

<style>
  .sudoku-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    font-family: system-ui, -apple-system, sans-serif;
    color: var(--text-primary);
    min-width: 350px;
    min-height: 600px;
    width: 100%;
  }
  
  .game-header {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
    margin-bottom: 1rem;
  }
  
  .game-info {
    display: flex;
    justify-content: space-between;
    font-size: 1.2rem;
    font-weight: bold;
  }
  
  .game-controls {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .difficulty-selector, .game-actions {
    display: flex;
    gap: 0.5rem;
  }
  
  .difficulty-btn, .action-btn, .play-again-btn, .number-btn {
    padding: 0.5rem 0.75rem;
    background-color: var(--input-bg);
    color: var(--text-primary);
    border: 1px solid var(--border-light);
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background-color 0.2s;
    outline: none;
  }
  
  .difficulty-btn:hover, .action-btn:hover, .play-again-btn:hover, .number-btn:hover {
    background-color: var(--taskbar-hover);
  }
  
  .difficulty-btn.active, .action-btn.active {
    background-color: var(--win-blue);
    color: white;
  }
  
  .board-container {
    position: relative;
    width: 100%;
    max-width: 500px;
    aspect-ratio: 1;
  }
  
  .sudoku-board {
    display: grid;
    grid-template-columns: repeat(9, 1fr);
    grid-template-rows: repeat(9, 1fr);
    width: 100%;
    height: 100%;
    border: 2px solid var(--text-primary);
  }
  
  .cell {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.5rem;
    font-weight: bold;
    border: 1px solid var(--border-light);
    user-select: none;
    cursor: pointer;
    background-color: var(--window-bg);
    transition: background-color 0.15s;
  }
  
  /* Create thick borders between 3x3 boxes */
  .cell:nth-child(3n) {
    border-right: 2px solid var(--text-primary);
  }
  
  .cell:nth-child(9n) {
    border-right: none;
  }
  
  .sudoku-board > .cell:nth-child(n+19):nth-child(-n+27),
  .sudoku-board > .cell:nth-child(n+46):nth-child(-n+54) {
    border-bottom: 2px solid var(--text-primary);
  }
  
  .cell.selected {
    background-color: var(--win-blue);
    color: white;
  }
  
  .cell.same-box, .cell.same-line {
    background-color: var(--taskbar-hover);
  }
  
  .cell.initial {
    cursor: default;
    font-weight: bold;
  }
  
  .cell-value {
    font-size: 1.5rem;
  }
  
  .cell-notes {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(3, 1fr);
    width: 100%;
    height: 100%;
    font-size: 0.7rem;
  }
  
  .note-slot {
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--text-secondary);
  }
  
  .number-pad {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 0.5rem;
    width: 100%;
    max-width: 500px;
    margin-top: 1rem;
  }
  
  .number-btn {
    font-size: 1.2rem;
    padding: 0.75rem;
  }
  
  .clear-btn {
    font-size: 1.5rem;
  }
  
  .pause-overlay, .gameover-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: var(--overlay-bg);
    z-index: 10;
  }
  
  .pause-message, .gameover-message {
    font-size: 2rem;
    font-weight: bold;
    color: var(--text-primary);
    margin-bottom: 1rem;
  }
  
  .game-instructions {
    margin-top: 1rem;
    width: 100%;
    max-width: 500px;
  }
  
  @media (max-width: 600px) {
    .game-info, .difficulty-selector, .game-actions {
      flex-direction: column;
      align-items: center;
    }
    
    .cell-value {
      font-size: 1.2rem;
    }
    
    .cell-notes {
      font-size: 0.6rem;
    }
    
    .number-pad {
      grid-template-columns: repeat(5, 1fr);
    }
  }
</style> 