<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { t } from '$lib/i18n/i18n';

  // Game state
  let gameRunning = false;
  let gameOver = false;
  let score = 0;
  let highScore = 0;
  let jumpActive = false;
  let duckActive = false;
  let speed = 4;
  let groundSpeed = 4;
  let gameLoop: number;
  let animationFrame: number;
  let gameTime = 0;
  
  // Game elements
  let dino: DinoCharacter;
  let obstacles: Obstacle[] = [];
  let ground: Ground[] = [];
  let clouds: Cloud[] = [];
  
  // Canvas elements
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  let spriteSheet: HTMLImageElement;
  
  // Game dimensions
  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 300;
  const GROUND_HEIGHT = 20;
  const GRAVITY = 0.4;
  const JUMP_FORCE = 10;
  const GROUND_OFFSET = 20;
  const COLLISION_PADDING = 15;
  
  // Sprite positions (x, y, width, height) from sprite sheet
  const SPRITE = {
    DINO_IDLE: { x: 1338, y: 3, width: 89, height: 97 },
    DINO_RUNNING: [
      { x: 1514, y: 3, width: 89, height: 97 },
      { x: 1602, y: 3, width: 89, height: 97 }
    ],
    DINO_JUMPING: { x: 1338, y: 3, width: 89, height: 97 },
    DINO_DUCKING: [
      { x: 1866, y: 37, width: 119, height: 59 },
      { x: 1988, y: 37, width: 119, height: 59 }
    ],
    DINO_DEAD: { x: 1691, y: 3, width: 89, height: 97 },
    GROUND: { x: 2, y: 104, width: 2400, height: 26 },
    PTERODACTYL: [
      { x: 260, y: 14, width: 92, height: 60 },
      { x: 353, y: 3, width: 92, height: 60 }
    ],
    CLOUD: { x: 166, y: 3, width: 92, height: 27 },

    
    CACTUS_SMALL: [
      { x: 446, y: 3, width: 34, height: 70 },
      { x: 514, y: 3, width: 34, height: 70 }
    ],
    CACTUS_LARGE: [
      { x: 653, y: 3, width: 50, height: 96 },
      { x: 752, y: 3, width: 50, height: 96 }
    ],
    GAME_OVER: { x: 954, y: 29, width: 381, height: 21 },
    RESTART: { x: 2, y: 2, width: 72, height: 64 }
  };
   
  // Classes for game elements
  class DinoCharacter {
    x: number;
    y: number;
    width: number;
    height: number;
    velY: number;
    originalHeight: number;
    jumpCount: number;
    frameX: number;
    frameTimer: number;
    
    constructor() {
      this.x = 50;
      this.y = CANVAS_HEIGHT - GROUND_HEIGHT - SPRITE.DINO_IDLE.height + GROUND_OFFSET;
      this.width = SPRITE.DINO_IDLE.width;
      this.height = SPRITE.DINO_IDLE.height;
      this.originalHeight = SPRITE.DINO_IDLE.height;
      this.velY = 0;
      this.jumpCount = 0;
      this.frameX = 0;
      this.frameTimer = 0;
    }
    
    draw() {
      let sprite;
      
      if (gameOver) {
        sprite = SPRITE.DINO_DEAD;
        drawSprite(sprite.x, sprite.y, sprite.width, sprite.height, this.x, this.y, this.width, this.height);
      } else if (jumpActive) {
        sprite = SPRITE.DINO_JUMPING;
        drawSprite(sprite.x, sprite.y, sprite.width, sprite.height, this.x, this.y, this.width, this.height);
      } else if (duckActive) {
        sprite = SPRITE.DINO_DUCKING[Math.floor(this.frameX) % 2];
        drawSprite(sprite.x, sprite.y, sprite.width, sprite.height, this.x, this.y + this.originalHeight - sprite.height, sprite.width, sprite.height);
      } else {
        sprite = SPRITE.DINO_RUNNING[Math.floor(this.frameX) % 2];
        drawSprite(sprite.x, sprite.y, sprite.width, sprite.height, this.x, this.y, this.width, this.height);
      }
      
      // Animate running or ducking
      if (gameRunning && !jumpActive) {
        this.frameTimer++;
        if (this.frameTimer > 8) {
          this.frameX++;
          this.frameTimer = 0;
        }
      }
    }
    
    update() {
      // Jumping physics
      if (jumpActive) {
        this.y += this.velY;
        this.velY += GRAVITY;
        
        // Check if landed
        if (this.y >= CANVAS_HEIGHT - GROUND_HEIGHT - this.height + GROUND_OFFSET) {
          this.y = CANVAS_HEIGHT - GROUND_HEIGHT - this.height + GROUND_OFFSET;
          jumpActive = false;
          this.velY = 0;
          this.jumpCount = 0;
        }
      }
      
      // Ducking adjustments
      if (duckActive) {
        this.height = SPRITE.DINO_DUCKING[0].height;
        this.width = SPRITE.DINO_DUCKING[0].width;
      } else {
        this.height = this.originalHeight;
        this.width = SPRITE.DINO_IDLE.width;
      }
    }
    
    jump() {
      if (!jumpActive || this.jumpCount < 1) {
        jumpActive = true;
        this.velY = -JUMP_FORCE;
        this.jumpCount++;
      }
    }
    
    duck(active: boolean) {
      duckActive = active;
    }
    
    getHitbox() {
      // Smaller hitbox than the actual sprite for better gameplay
      const padding = COLLISION_PADDING;
      return {
        x: this.x + padding,
        y: this.y + padding,
        width: this.width - padding * 2,
        height: this.height - padding * 2
      };
    }
  }
  
  class Obstacle {
    x: number;
    y: number = 0;
    width: number = 0;
    height: number = 0;
    type: string;
    spriteIndex: number = 0;
    frameX: number;
    frameTimer: number;
    
    constructor(type: string) {
      this.type = type;
      this.x = CANVAS_WIDTH;
      this.frameX = 0;
      this.frameTimer = 0;
      
      if (type === 'cactusSmall') {
        this.spriteIndex = Math.floor(Math.random() * SPRITE.CACTUS_SMALL.length);
        const sprite = SPRITE.CACTUS_SMALL[this.spriteIndex];
        this.width = sprite.width;
        this.height = sprite.height;
        this.y = CANVAS_HEIGHT - GROUND_HEIGHT - this.height + GROUND_OFFSET;
      } else if (type === 'cactusLarge') {
        this.spriteIndex = Math.floor(Math.random() * SPRITE.CACTUS_LARGE.length);
        const sprite = SPRITE.CACTUS_LARGE[this.spriteIndex];
        this.width = sprite.width;
        this.height = sprite.height;
        this.y = CANVAS_HEIGHT - GROUND_HEIGHT - this.height + GROUND_OFFSET;
      } else if (type === 'pterodactyl') {
        this.spriteIndex = 0;
        this.width = SPRITE.PTERODACTYL[0].width;
        this.height = SPRITE.PTERODACTYL[0].height;
        // Random height for pterodactyl with ground offset applied
        const heightOptions = [
          CANVAS_HEIGHT - GROUND_HEIGHT - this.height - 10 + GROUND_OFFSET, // Little height
          CANVAS_HEIGHT - GROUND_HEIGHT - this.height - 75 + GROUND_OFFSET, // Medium height
          CANVAS_HEIGHT - GROUND_HEIGHT - this.height - 130 + GROUND_OFFSET // Big height
        ];
        this.y = heightOptions[Math.floor(Math.random() * heightOptions.length)];
      }
    }
    
    draw() {
      let sprite;
      
      if (this.type === 'cactusSmall') {
        sprite = SPRITE.CACTUS_SMALL[this.spriteIndex];
        drawSprite(sprite.x, sprite.y, sprite.width, sprite.height, this.x, this.y, this.width, this.height);
      } else if (this.type === 'cactusLarge') {
        sprite = SPRITE.CACTUS_LARGE[this.spriteIndex];
        drawSprite(sprite.x, sprite.y, sprite.width, sprite.height, this.x, this.y, this.width, this.height);
      } else if (this.type === 'pterodactyl') {
        sprite = SPRITE.PTERODACTYL[Math.floor(this.frameX) % 2];
        drawSprite(sprite.x, sprite.y, sprite.width, sprite.height, this.x, this.y, this.width, this.height);
        
        // Animate pterodactyl wings
        this.frameTimer++;
        if (this.frameTimer > 15) {
          this.frameX++;
          this.frameTimer = 0;
        }
      }
    }
    
    update() {
      this.x -= speed;
    }
    
    getHitbox() {
      // Smaller hitbox than the actual sprite for better gameplay
      const padding = COLLISION_PADDING;
      return {
        x: this.x + padding,
        y: this.y + padding,
        width: this.width - padding * 2,
        height: this.height - padding * 2
      };
    }
  }
  
  class Ground {
    x: number;
    y: number;
    width: number;
    height: number;
    
    constructor(x: number) {
      this.x = x;
      this.y = CANVAS_HEIGHT - GROUND_HEIGHT;
      this.width = SPRITE.GROUND.width;
      this.height = SPRITE.GROUND.height;
    }
    
    draw() {
      drawSprite(
        SPRITE.GROUND.x, 
        SPRITE.GROUND.y, 
        SPRITE.GROUND.width, 
        SPRITE.GROUND.height, 
        this.x, 
        this.y, 
        this.width, 
        this.height
      );
    }
    
    update() {
      this.x -= groundSpeed;
      
      // Reset ground position when it moves off-screen
      if (this.x <= -this.width) {
        this.x = CANVAS_WIDTH;
      }
    }
  }
  
  class Cloud {
    x: number;
    y: number;
    width: number;
    height: number;
    speed: number;
    
    constructor() {
      this.x = CANVAS_WIDTH;
      this.y = Math.random() * 100 + 50;
      this.width = SPRITE.CLOUD.width;
      this.height = SPRITE.CLOUD.height;
      this.speed = 0.5 + Math.random() * 1.5;
    }
    
    draw() {
      drawSprite(
        SPRITE.CLOUD.x,
        SPRITE.CLOUD.y,
        SPRITE.CLOUD.width,
        SPRITE.CLOUD.height,
        this.x,
        this.y,
        this.width,
        this.height
      );
    }
    
    update() {
      this.x -= this.speed;
    }
  }
  
  // Helper function to draw sprites from the sprite sheet
  function drawSprite(
    sx: number, sy: number, sWidth: number, sHeight: number,
    dx: number, dy: number, dWidth: number, dHeight: number
  ) {
    ctx.drawImage(spriteSheet, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
  }
  
  // Initialize the game
  function initGame() {
    // Limpiar cualquier frame de animación anterior
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
    }
    
    // Reset game state
    gameOver = false;
    score = 0;
    speed = 4;
    groundSpeed = 4;
    gameTime = 0;
    obstacles = [];
    clouds = [];
    
    // Create dino character
    dino = new DinoCharacter();
    
    // Create initial ground
    ground = [
      new Ground(0),
      new Ground(SPRITE.GROUND.width)
    ];
    
    // Start game loop if not already running
    gameRunning = true;
    startGameLoop();
  }
  
  // Main game loop
  function gameUpdate() {
    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Update game time
    if (!gameOver) {
      gameTime++;
    }
    
    // Update score
    if (!gameOver) {
      score += 0.15;
      if (score > highScore) {
        highScore = score;
      }
      
      // Increase speed over time but more slowly
      if (gameTime % 800 === 0) {
        speed += 0.15;
        groundSpeed = speed;
      }
    }
    
    // Update and draw clouds
    for (let i = clouds.length - 1; i >= 0; i--) {
      if (!gameOver) {
        clouds[i].update();
      }
      clouds[i].draw();
      
      if (clouds[i].x + clouds[i].width < 0) {
        clouds.splice(i, 1);
      }
    }
    
    // Randomly add new clouds
    if (!gameOver && gameTime % 300 === 0) {
      clouds.push(new Cloud());
    }
    
    // Update and draw ground
    for (let i = 0; i < ground.length; i++) {
      if (!gameOver) {
        ground[i].update();
      }
      ground[i].draw();
    }
    
    // Update and draw dino
    if (!gameOver) {
      dino.update();
    }
    dino.draw();
    
    // Update and draw obstacles
    for (let i = obstacles.length - 1; i >= 0; i--) {
      if (!gameOver) {
        obstacles[i].update();
      }
      obstacles[i].draw();
      
      // Check collision
      if (!gameOver && checkCollision(dino, obstacles[i])) {
        gameOver = true;
        gameRunning = false;
        cancelAnimationFrame(animationFrame);
      }
      
      // Remove off-screen obstacles
      if (obstacles[i].x + obstacles[i].width < 0) {
        obstacles.splice(i, 1);
      }
    }
    
    // Randomly add new obstacles with lower frequency
    if (!gameOver && gameTime % Math.floor(150 - (speed * 2)) === 0 && obstacles.length < 3) {
      addRandomObstacle();
    }
    
    // Draw score
    ctx.fillStyle = '#000';
    ctx.font = '20px monospace';
    ctx.fillText(`Score: ${Math.floor(score)}`, 20, 30);
    ctx.fillText(`High Score: ${Math.floor(highScore)}`, 600, 30);
    
    // Draw game over screen
    if (gameOver) {
      ctx.drawImage(
        spriteSheet, 
        SPRITE.GAME_OVER.x, 
        SPRITE.GAME_OVER.y, 
        SPRITE.GAME_OVER.width, 
        SPRITE.GAME_OVER.height,
        CANVAS_WIDTH / 2 - SPRITE.GAME_OVER.width / 2,
        CANVAS_HEIGHT / 2 - 50,
        SPRITE.GAME_OVER.width,
        SPRITE.GAME_OVER.height
      );
      
      ctx.drawImage(
        spriteSheet,
        SPRITE.RESTART.x,
        SPRITE.RESTART.y,
        SPRITE.RESTART.width,
        SPRITE.RESTART.height,
        CANVAS_WIDTH / 2 - SPRITE.RESTART.width / 2,
        CANVAS_HEIGHT / 2,
        SPRITE.RESTART.width,
        SPRITE.RESTART.height
      );
    }
    
    // Request next frame if game is running or just ended
    if (gameRunning || gameOver) {
      animationFrame = requestAnimationFrame(gameUpdate);
    }
  }
  
  // Check collision between two objects
  function checkCollision(a: DinoCharacter, b: Obstacle) {
    const aHitbox = a.getHitbox();
    const bHitbox = b.getHitbox();
    
    return !(
      aHitbox.x + aHitbox.width < bHitbox.x ||
      aHitbox.x > bHitbox.x + bHitbox.width ||
      aHitbox.y + aHitbox.height < bHitbox.y ||
      aHitbox.y > bHitbox.y + bHitbox.height
    );
  }
  
  // Add a random obstacle to the game
  function addRandomObstacle() {
    const random = Math.random();
    
    if (random < 0.5) {
      obstacles.push(new Obstacle('cactusSmall'));
    } else if (random < 0.9) {
      obstacles.push(new Obstacle('cactusLarge'));
    } else {
      obstacles.push(new Obstacle('pterodactyl'));
    }
  }
  
  // Start the game loop
  function startGameLoop() {
    gameUpdate();
  }
  
  // Handle key down events
  function handleKeyDown(event: KeyboardEvent) {
    // Jump with spacebar or up arrow
    if ((event.code === 'Space' || event.code === 'ArrowUp')) {
      event.preventDefault();
      if (gameOver) {
        initGame();
      } else if (gameRunning) {
        dino.jump();
      }
    }
    
    // Duck with down arrow
    if (event.code === 'ArrowDown' && gameRunning) {
      event.preventDefault();
      dino.duck(true);
    }
    
    // Restart with Enter
    if (event.code === 'Enter' && gameOver) {
      initGame();
    }
  }
  
  // Handle key up events
  function handleKeyUp(event: KeyboardEvent) {
    // Stop ducking when arrow down is released
    if (event.code === 'ArrowDown') {
      dino.duck(false);
    }
  }
  
  // Handle canvas click
  function handleCanvasClick(event: MouseEvent) {
    if (gameOver) {
      initGame();
    } else {
      dino.jump();
    }
  }
  
  // Touch events for mobile
  function handleTouchStart(event: TouchEvent) {
    event.preventDefault();
    
    if (gameOver) {
      initGame();
    } else {
      dino.jump();
    }
  }
  
  // Pause the game
  function pauseGame() {
    if (!gameOver && gameRunning) {
      gameRunning = false;
      cancelAnimationFrame(animationFrame);
    }
  }
  
  // Resume the game
  function resumeGame() {
    if (!gameOver && !gameRunning) {
      gameRunning = true;
      startGameLoop();
    }
  }
  
  // Reset high score
  function resetHighScore() {
    highScore = 0;
  }
  
  // Load sprite sheet
  function loadSprites() {
    spriteSheet = new Image();
    spriteSheet.src = '/images/games/dino.png';
    
    spriteSheet.onload = () => {
      // Initialize game once sprites are loaded
      initGame();
    };
  }
  
  // Initialize everything when component mounts
  onMount(() => {
    // Get canvas context
    ctx = canvas.getContext('2d')!;
    
    // Set canvas dimensions
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    
    // Load sprite sheet
    loadSprites();
    
    // Add event listeners
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    canvas.addEventListener('click', handleCanvasClick);
    canvas.addEventListener('touchstart', handleTouchStart);
    
    // Clean up on unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      canvas.removeEventListener('click', handleCanvasClick);
      canvas.removeEventListener('touchstart', handleTouchStart);
      cancelAnimationFrame(animationFrame);
      gameRunning = false;
    };
  });
  
  onDestroy(() => {
    // Make sure to clean up on component destroy
    cancelAnimationFrame(animationFrame);
    gameRunning = false;
  });
</script>

<div class="content dino-game">
  <div class="game-container">
    <div class="game-header">
      <div class="title">{$t('games.dino.title')}</div>
      <div class="controls">
        <button class="control-button" on:click={pauseGame} disabled={!gameRunning || gameOver}>
          {$t('games.dino.pause')}
        </button>
        <button class="control-button" on:click={resumeGame} disabled={gameRunning || gameOver}>
          {$t('games.dino.resume')}
        </button>
        <button class="control-button" on:click={initGame}>
          {$t('games.dino.restart')}
        </button>
        <button class="control-button" on:click={resetHighScore}>
          {$t('games.dino.resetScore')}
        </button>
      </div>
    </div>
    
    <canvas bind:this={canvas} class="game-canvas"></canvas>
    
    <div class="game-instructions">
      <div class="instruction-title">{$t('games.dino.howToPlay')}</div>
      <div class="instruction-item">
        <span class="key">Space / ↑ / Click</span> - {$t('games.dino.jump')}
      </div>
      <div class="instruction-item">
        <span class="key">↓</span> - {$t('games.dino.duck')}
      </div>
      <div class="instruction-item">
        <span class="key">Enter</span> - {$t('games.dino.restart')}
      </div>
    </div>
  </div>
</div>

<style>
  .content {
    width: 100%;
    height: 100%;
    background-color: #f7f7f7;
    padding: 16px;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .game-container {
    display: flex;
    flex-direction: column;
    background-color: #fff;
    border: 2px solid #ccc;
    border-radius: 8px;
    padding: 15px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .game-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }
  
  .title {
    font-size: 24px;
    font-weight: bold;
  }
  
  .controls {
    display: flex;
    gap: 10px;
  }
  
  .control-button {
    padding: 8px 12px;
    background-color: #f0f0f0;
    border: 1px solid #ccc;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .control-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .control-button:hover:not(:disabled) {
    background-color: #e0e0e0;
  }
  
  .game-canvas {
    border: 1px solid #ddd;
    background-color: #fff;
    margin: 0 auto;
  }
  
  .game-instructions {
    margin-top: 15px;
    border-top: 1px solid #eee;
    padding-top: 10px;
  }
  
  .instruction-title {
    font-weight: bold;
    margin-bottom: 5px;
  }
  
  .instruction-item {
    margin-bottom: 5px;
  }
  
  .key {
    display: inline-block;
    background-color: #f0f0f0;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 2px 6px;
    font-family: monospace;
    margin-right: 5px;
  }
</style> 