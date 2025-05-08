<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { t } from '$lib/i18n/i18n';

  // Game state
  let grid: Cell[][] = [];
  let currentPiece: Piece | null = null;
  let nextPiece: Piece | null = null;
  let gameOver = false;
  let isPaused = false;
  let score = 0;
  let level = 1;
  let lines = 0;
  let timerValue = 0;
  let timerInterval: number;
  let gameInterval: number;
  let difficulty = 'normal';
  
  // Grid dimensions
  const GRID_HEIGHT = 20;
  const GRID_WIDTH = 10;
  
  // Types
  interface Cell {
    filled: boolean;
    color: string;
  }
  
  interface Piece {
    shape: boolean[][];
    color: string;
    row: number;
    col: number;
  }
  
  // Tetromino shapes
  const SHAPES = [
    // I piece
    {
      shape: [
        [false, false, false, false],
        [true, true, true, true],
        [false, false, false, false],
        [false, false, false, false]
      ],
      color: '#00FFFF' // Cyan
    },
    // J piece
    {
      shape: [
        [true, false, false],
        [true, true, true],
        [false, false, false]
      ],
      color: '#0000FF' // Blue
    },
    // L piece
    {
      shape: [
        [false, false, true],
        [true, true, true],
        [false, false, false]
      ],
      color: '#FF7F00' // Orange
    },
    // O piece
    {
      shape: [
        [true, true],
        [true, true]
      ],
      color: '#FFFF00' // Yellow
    },
    // S piece
    {
      shape: [
        [false, true, true],
        [true, true, false],
        [false, false, false]
      ],
      color: '#00FF00' // Green
    },
    // T piece
    {
      shape: [
        [false, true, false],
        [true, true, true],
        [false, false, false]
      ],
      color: '#8B00FF' // Purple
    },
    // Z piece
    {
      shape: [
        [true, true, false],
        [false, true, true],
        [false, false, false]
      ],
      color: '#FF0000' // Red
    }
  ];
  
  // Difficulty settings (speed in ms)
  const DIFFICULTIES = {
    easy: 800,
    normal: 500,
    hard: 300
  };
  
  // Initialize the game
  function initializeGame(diff: string) {
    difficulty = diff;
    
    gameOver = false;
    isPaused = false;
    score = 0;
    level = 1;
    lines = 0;
    timerValue = 0;
    
    clearInterval(timerInterval);
    clearInterval(gameInterval);
    
    // Create empty grid
    grid = Array(GRID_HEIGHT).fill(null).map(() => 
      Array(GRID_WIDTH).fill(null).map(() => ({
        filled: false,
        color: ''
      }))
    );
    
    // Create first piece
    currentPiece = createRandomPiece();
    nextPiece = createRandomPiece();
    
    // Start timer
    startTimer();
    
    // Start game loop
    startGameLoop();
  }
  
  // Create a random piece
  function createRandomPiece(): Piece {
    const randomIndex = Math.floor(Math.random() * SHAPES.length);
    const pieceTemplate = SHAPES[randomIndex];
    
    return {
      shape: [...pieceTemplate.shape],
      color: pieceTemplate.color,
      row: 0,
      col: Math.floor(GRID_WIDTH / 2) - Math.floor(pieceTemplate.shape[0].length / 2)
    };
  }
  
  // Check if piece can move to specified position
  function canMove(piece: Piece, rowOffset: number, colOffset: number): boolean {
    for (let r = 0; r < piece.shape.length; r++) {
      for (let c = 0; c < piece.shape[r].length; c++) {
        if (piece.shape[r][c]) {
          const newRow = piece.row + r + rowOffset;
          const newCol = piece.col + c + colOffset;
          
          if (
            newRow < 0 || 
            newRow >= GRID_HEIGHT || 
            newCol < 0 || 
            newCol >= GRID_WIDTH || 
            (newRow >= 0 && grid[newRow][newCol].filled)
          ) {
            return false;
          }
        }
      }
    }
    return true;
  }
  
  // Check if piece can rotate
  function canRotate(piece: Piece): boolean {
    const rotatedShape = rotateMatrix(piece.shape);
    
    for (let r = 0; r < rotatedShape.length; r++) {
      for (let c = 0; c < rotatedShape[r].length; c++) {
        if (rotatedShape[r][c]) {
          const newRow = piece.row + r;
          const newCol = piece.col + c;
          
          if (
            newRow < 0 || 
            newRow >= GRID_HEIGHT || 
            newCol < 0 || 
            newCol >= GRID_WIDTH || 
            (newRow >= 0 && grid[newRow][newCol].filled)
          ) {
            return false;
          }
        }
      }
    }
    return true;
  }
  
  // Rotate a matrix 90 degrees clockwise
  function rotateMatrix(matrix: boolean[][]): boolean[][] {
    const n = matrix.length;
    const result = Array(n).fill(null).map(() => Array(n).fill(false));
    
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        result[c][n - 1 - r] = matrix[r][c];
      }
    }
    
    return result;
  }
  
  // Update the grid based on current piece
  function updateGrid() {
    // Clear the grid of any active piece (not fixed pieces)
    for (let r = 0; r < GRID_HEIGHT; r++) {
      for (let c = 0; c < GRID_WIDTH; c++) {
        if (!grid[r][c].filled) {
          grid[r][c].color = '';
        }
      }
    }
    
    // Draw current piece
    if (currentPiece) {
      for (let r = 0; r < currentPiece.shape.length; r++) {
        for (let c = 0; c < currentPiece.shape[r].length; c++) {
          if (currentPiece.shape[r][c]) {
            const gridRow = currentPiece.row + r;
            const gridCol = currentPiece.col + c;
            
            if (gridRow >= 0 && gridRow < GRID_HEIGHT && gridCol >= 0 && gridCol < GRID_WIDTH) {
              grid[gridRow][gridCol].color = currentPiece.color;
            }
          }
        }
      }
    }
    
    // Trigger reactivity
    grid = grid;
  }
  
  // Lock current piece to grid and check for completed lines
  function lockPiece() {
    if (!currentPiece) return;
    
    // Lock piece to grid
    for (let r = 0; r < currentPiece.shape.length; r++) {
      for (let c = 0; c < currentPiece.shape[r].length; c++) {
        if (currentPiece.shape[r][c]) {
          const gridRow = currentPiece.row + r;
          const gridCol = currentPiece.col + c;
          
          if (gridRow >= 0 && gridRow < GRID_HEIGHT && gridCol >= 0 && gridCol < GRID_WIDTH) {
            grid[gridRow][gridCol].filled = true;
            grid[gridRow][gridCol].color = currentPiece.color;
          }
        }
      }
    }
    
    // Check for completed lines
    const completedLines = [];
    for (let r = GRID_HEIGHT - 1; r >= 0; r--) {
      if (grid[r].every(cell => cell.filled)) {
        completedLines.push(r);
      }
    }
    
    // Handle completed lines
    if (completedLines.length > 0) {
      // Remove completed lines
      for (const row of completedLines) {
        // Remove the line
        grid.splice(row, 1);
        // Add a new empty line at the top
        grid.unshift(Array(GRID_WIDTH).fill(null).map(() => ({
          filled: false,
          color: ''
        })));
      }
      
      // Update score and level
      const linesCleared = completedLines.length;
      lines += linesCleared;
      
      // Scoring system
      switch (linesCleared) {
        case 1:
          score += 100 * level;
          break;
        case 2:
          score += 300 * level;
          break;
        case 3:
          score += 500 * level;
          break;
        case 4:
          score += 800 * level; // Tetris
          break;
      }
      
      // Level up every 10 lines
      level = Math.floor(lines / 10) + 1;
      
      // Adjust game speed based on level
      clearInterval(gameInterval);
      const baseSpeed = DIFFICULTIES[difficulty as keyof typeof DIFFICULTIES];
      const speed = Math.max(100, baseSpeed - (level - 1) * 50);
      gameInterval = setInterval(gameStep, speed);
    }
    
    // Get new piece
    currentPiece = nextPiece;
    nextPiece = createRandomPiece();
    
    // Check for game over
    if (currentPiece && !canMove(currentPiece, 0, 0)) {
      gameOver = true;
      clearInterval(gameInterval);
      clearInterval(timerInterval);
    }
    
    updateGrid();
  }
  
  // Move the current piece down
  function moveDown() {
    if (!currentPiece || gameOver || isPaused) return;
    
    if (canMove(currentPiece, 1, 0)) {
      currentPiece.row++;
      updateGrid();
    } else {
      lockPiece();
    }
  }
  
  // Move the current piece left
  function moveLeft() {
    if (!currentPiece || gameOver || isPaused) return;
    
    if (canMove(currentPiece, 0, -1)) {
      currentPiece.col--;
      updateGrid();
    }
  }
  
  // Move the current piece right
  function moveRight() {
    if (!currentPiece || gameOver || isPaused) return;
    
    if (canMove(currentPiece, 0, 1)) {
      currentPiece.col++;
      updateGrid();
    }
  }
  
  // Rotate the current piece
  function rotatePiece() {
    if (!currentPiece || gameOver || isPaused) return;
    
    if (canRotate(currentPiece)) {
      currentPiece.shape = rotateMatrix(currentPiece.shape);
      updateGrid();
    }
  }
  
  // Drop the current piece to the bottom
  function hardDrop() {
    if (!currentPiece || gameOver || isPaused) return;
    
    let dropDistance = 0;
    while (canMove(currentPiece, dropDistance + 1, 0)) {
      dropDistance++;
    }
    
    currentPiece.row += dropDistance;
    updateGrid();
    lockPiece();
  }
  
  // Game step - called on interval
  function gameStep() {
    moveDown();
  }
  
  // Start timer
  function startTimer() {
    timerInterval = setInterval(() => {
      timerValue++;
      if (timerValue >= 999) clearInterval(timerInterval);
    }, 1000);
  }
  
  // Start game loop
  function startGameLoop() {
    const speed = DIFFICULTIES[difficulty as keyof typeof DIFFICULTIES];
    gameInterval = setInterval(gameStep, speed);
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
    if (gameOver) return;
    
    switch (event.key) {
      case 'ArrowLeft':
        moveLeft();
        break;
      case 'ArrowRight':
        moveRight();
        break;
      case 'ArrowDown':
        moveDown();
        break;
      case 'ArrowUp':
        rotatePiece();
        break;
      case ' ':
        hardDrop();
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
  
  // Initialize the game on mount
  onMount(() => {
    initializeGame('normal');
    
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

<div class="content tetris">
  <div class="game-container">
    <div class="panel left-panel">
      <div class="score-section">
        <div class="score-label">{$t('games.tetris.score')}</div>
        <div class="score-value">{score}</div>
      </div>
      
      <div class="level-section">
        <div class="level-label">{$t('games.tetris.level')}</div>
        <div class="level-value">{level}</div>
      </div>
      
      <div class="lines-section">
        <div class="lines-label">{$t('games.tetris.lines')}</div>
        <div class="lines-value">{lines}</div>
      </div>
      
      <div class="timer-section">
        <div class="timer-label">{$t('games.tetris.time')}</div>
        <div class="timer-value">{timerValue.toString().padStart(3, '0')}</div>
      </div>
      
      <div class="difficulty-selector">
        <button class:selected={difficulty === 'easy'} on:click={() => initializeGame('easy')}>
          {$t('games.tetris.easy')}
        </button>
        <button class:selected={difficulty === 'normal'} on:click={() => initializeGame('normal')}>
          {$t('games.tetris.normal')}
        </button>
        <button class:selected={difficulty === 'hard'} on:click={() => initializeGame('hard')}>
          {$t('games.tetris.hard')}
        </button>
      </div>
      
      <div class="controls">
        <button class="control-button" on:click={resetGame}>
          {$t('games.tetris.reset')}
        </button>
        <button class="control-button" on:click={togglePause}>
          {isPaused ? $t('games.tetris.resume') : $t('games.tetris.pause')}
        </button>
      </div>
    </div>
    
    <div class="game-board">
      {#each grid as row}
        <div class="grid-row">
          {#each row as cell}
            <div class="grid-cell" style="background-color: {cell.filled || cell.color ? cell.color : '#111'}"></div>
          {/each}
        </div>
      {/each}
      
      {#if gameOver}
        <div class="game-overlay">
          <div class="game-over-message">{$t('games.tetris.gameover')}</div>
          <button class="control-button" on:click={resetGame}>
            {$t('games.tetris.playagain')}
          </button>
        </div>
      {/if}
      
      {#if isPaused}
        <div class="game-overlay">
          <div class="pause-message">{$t('games.tetris.paused')}</div>
          <button class="control-button" on:click={togglePause}>
            {$t('games.tetris.resume')}
          </button>
        </div>
      {/if}
    </div>
    
    <div class="panel right-panel">
      <div class="next-piece-label">{$t('games.tetris.next')}</div>
      <div class="next-piece">
        {#if nextPiece}
          <div class="next-piece-grid" style="grid-template-rows: repeat({nextPiece.shape.length}, 1fr); grid-template-columns: repeat({nextPiece.shape[0].length}, 1fr);">
            {#each nextPiece.shape as row}
              {#each row as cell}
                <div class="next-piece-cell" style="background-color: {cell ? nextPiece.color : 'transparent'}"></div>
              {/each}
            {/each}
          </div>
        {/if}
      </div>
      
      <div class="controls-help">
        <div class="help-title">{$t('games.tetris.controls')}</div>
        <div class="help-item">⬅️ {$t('games.tetris.moveleft')}</div>
        <div class="help-item">➡️ {$t('games.tetris.moveright')}</div>
        <div class="help-item">⬇️ {$t('games.tetris.movedown')}</div>
        <div class="help-item">⬆️ {$t('games.tetris.rotate')}</div>
        <div class="help-item">Space {$t('games.tetris.harddrop')}</div>
        <div class="help-item">P {$t('games.tetris.pause')}</div>
        <div class="help-item">R {$t('games.tetris.reset')}</div>
      </div>
    </div>
  </div>
</div>

<style>
  .content {
    width: 100%;
    height: 100%;
    background-color: #c0c0c0;
    padding: 16px;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .game-container {
    display: flex;
    background-color: #c0c0c0;
    border: 3px outset #ffffff;
    padding: 10px;
  }
  
  .panel {
    display: flex;
    flex-direction: column;
    width: 150px;
    background-color: #c0c0c0;
    border: 2px inset #ffffff;
    padding: 10px;
    margin: 5px;
  }
  
  .left-panel, .right-panel {
    justify-content: space-between;
  }
  
  .game-board {
    background-color: #000;
    border: 4px inset #333;
    position: relative;
  }
  
  .grid-row {
    display: flex;
  }
  
  .grid-cell {
    width: 25px;
    height: 25px;
    border: 1px solid #333;
  }
  
  .next-piece {
    background-color: #000;
    border: 2px inset #333;
    padding: 15px;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 10px 0;
  }
  
  .next-piece-grid {
    display: grid;
    gap: 2px;
    width: 100%;
    height: 100%;
  }
  
  .next-piece-cell {
    border: 1px solid #333;
  }
  
  .score-section, .level-section, .lines-section, .timer-section, .next-piece-label {
    margin-bottom: 10px;
    text-align: center;
  }
  
  .score-label, .level-label, .lines-label, .timer-label, .next-piece-label {
    font-weight: bold;
    margin-bottom: 5px;
  }
  
  .score-value, .level-value, .lines-value, .timer-value {
    background-color: black;
    color: red;
    font-family: 'Digital', monospace;
    font-size: 20px;
    padding: 3px 0;
    text-align: center;
    border: 2px inset #808080;
  }
  
  .difficulty-selector {
    display: flex;
    flex-direction: column;
    margin-bottom: 15px;
  }
  
  .difficulty-selector button {
    background-color: #c0c0c0;
    border: 2px outset #ffffff;
    padding: 5px;
    margin: 2px 0;
    cursor: pointer;
  }
  
  .difficulty-selector button:active, .difficulty-selector button.selected {
    border: 2px inset #ffffff;
    background-color: #a0a0a0;
  }
  
  .controls {
    display: flex;
    flex-direction: column;
  }
  
  .control-button {
    background-color: #c0c0c0;
    border: 2px outset #ffffff;
    padding: 8px 5px;
    margin: 5px 0;
    cursor: pointer;
    font-weight: bold;
  }
  
  .control-button:active {
    border: 2px inset #ffffff;
    background-color: #a0a0a0;
  }
  
  .game-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 10;
  }
  
  .game-over-message, .pause-message {
    color: white;
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
    text-align: center;
  }
  
  .controls-help {
    text-align: left;
    font-size: 12px;
  }
  
  .help-title {
    font-weight: bold;
    margin-bottom: 5px;
    text-align: center;
  }
  
  .help-item {
    margin-bottom: 3px;
  }
</style> 