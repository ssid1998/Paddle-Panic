/**
 * Paddle Panic - Game Engine
 * 
 * This is the authoritative game loop that:
 * 1. Runs at 60 ticks per second
 * 2. Updates ball position and checks collisions
 * 3. Manages scoring and game state
 * 4. Broadcasts state to all clients
 * 5. Controls RoboPaddle AI when in PvC mode
 */

const RoboPaddleAI = require('./RoboPaddleAI');

class GameEngine {
  constructor(io) {
    this.io = io;
    this.tickRate = 60; // 60 FPS
    this.tickInterval = 1000 / this.tickRate; // ~16.67ms
    this.gameLoop = null;
    
    // AI opponent
    this.roboPaddle = null;
    this.gameMode = null;    // 'PVP' or 'PVC'
    this.aiDifficulty = null; // 'EASY', 'MEDIUM', 'HARD'
    this.lastTickTime = Date.now();
    
    // Callback for game over
    this.onGameOver = null;
    
    // Game states
    this.STATE = {
      IDLE: 'IDLE',
      COUNTDOWN: 'COUNTDOWN',
      PLAYING: 'PLAYING',
      POINT_SCORED: 'POINT_SCORED',
      GAME_OVER: 'GAME_OVER'
    };
    
    // Initialize game state
    this.initializeGameState();
  }
  
  /**
   * Initialize or reset the game state
   */
  initializeGameState() {
    this.state = {
      // Current game phase
      phase: this.STATE.IDLE,
      
      // Table dimensions
      table: {
        width: 1200,
        height: 700,
        color: '#1a5f2a'
      },
      
      // Ball properties
      ball: {
        x: 600,           // Center of table
        y: 350,
        radius: 12,
        velocityX: 0,
        velocityY: 0,
        baseSpeed: 7,     // Initial speed
        maxSpeedMultiplier: 2,
        currentSpeedMultiplier: 1,
        color: '#ffffff'
      },
      
      // Left paddle (Player 1)
      paddle1: {
        x: 50,
        y: 300,
        width: 20,
        height: 100,
        speed: 15,
        color: '#e74c3c',  // Red
        playerId: null
      },
      
      // Right paddle (Player 2)
      paddle2: {
        x: 1130,           // Right side (1200 - 50 - 20)
        y: 300,
        width: 20,
        height: 100,
        speed: 15,
        color: '#3498db',  // Blue
        playerId: null
      },
      
      // Scores
      player1Score: 0,
      player2Score: 0,
      winningScore: 11,  // First to 11 wins
      
      // Serving
      servingPlayer: 1,    // 1 or 2
      
      // Countdown
      countdown: 3,
      
      // Winner
      winner: null
    };
  }
  
  /**
   * Start the game loop
   */
  start() {
    if (this.gameLoop) return; // Already running
    
    console.log('🎮 Game engine started');
    
    // Reset tick timing
    this.lastTickTime = Date.now();
    
    // Reset AI state for new game
    if (this.roboPaddle) {
      this.roboPaddle.reset();
    }
    
    // Start with countdown
    this.startCountdown();
    
    this.gameLoop = setInterval(() => {
      this.tick();
    }, this.tickInterval);
  }
  
  /**
   * Stop the game loop
   */
  stop() {
    if (this.gameLoop) {
      clearInterval(this.gameLoop);
      this.gameLoop = null;
      console.log('🛑 Game engine stopped');
    }
  }
  
  /**
   * Reset the game for a new match
   */
  reset() {
    this.stop();
    this.initializeGameState();
    this.roboPaddle = null;
    this.gameMode = null;
    this.aiDifficulty = null;
    this.broadcastState();
  }
  
  /**
   * Set game mode and AI difficulty (called before start)
   */
  setGameMode(mode, difficulty = null) {
    this.gameMode = mode;
    this.aiDifficulty = difficulty;
    
    if (mode === 'PVC' && difficulty) {
      this.roboPaddle = new RoboPaddleAI(difficulty);
      console.log(`🤖 RoboPaddle AI created with ${difficulty} difficulty`);
    } else {
      this.roboPaddle = null;
    }
  }
  
  /**
   * Start the 3-2-1 countdown
   */
  startCountdown() {
    this.state.phase = this.STATE.COUNTDOWN;
    this.state.countdown = 3;
    this.resetBall();
    
    // Emit initial countdown sound
    this.io.emit('soundEffect', { type: 'countdown', number: 3 });
    
    // Countdown timer
    const countdownInterval = setInterval(() => {
      this.state.countdown--;
      this.broadcastState();
      
      // Emit countdown sound for each number
      if (this.state.countdown > 0) {
        this.io.emit('soundEffect', { type: 'countdown', number: this.state.countdown });
      } else {
        // Emit "GO!" sound
        this.io.emit('soundEffect', { type: 'go' });
      }
      
      if (this.state.countdown <= 0) {
        clearInterval(countdownInterval);
        this.state.phase = this.STATE.PLAYING;
        this.launchBall();
        this.broadcastState();
      }
    }, 1000);
  }
  
  /**
   * Reset ball to center
   */
  resetBall() {
    this.state.ball.x = this.state.table.width / 2;
    this.state.ball.y = this.state.table.height / 2;
    this.state.ball.velocityX = 0;
    this.state.ball.velocityY = 0;
    this.state.ball.currentSpeedMultiplier = 1;
  }
  
  /**
   * Launch the ball toward the receiving player
   */
  launchBall() {
    const ball = this.state.ball;
    const speed = ball.baseSpeed;
    
    // Determine direction based on serving player
    // Ball goes TOWARD the opponent (away from server)
    const directionX = this.state.servingPlayer === 1 ? 1 : -1;
    
    // Random Y angle between -0.5 and 0.5
    const angleY = (Math.random() - 0.5);
    
    ball.velocityX = speed * directionX;
    ball.velocityY = speed * angleY;
  }
  
  /**
   * Main game tick - runs 60 times per second
   */
  tick() {
    if (this.state.phase !== this.STATE.PLAYING) {
      return; // Only update during active play
    }
    
    // Calculate delta time
    const now = Date.now();
    const deltaTime = now - this.lastTickTime;
    this.lastTickTime = now;
    
    // Update AI if in PvC mode
    if (this.gameMode === 'PVC' && this.roboPaddle) {
      const aiResult = this.roboPaddle.update(this.state, deltaTime);
      if (aiResult && typeof aiResult.paddleY === 'number') {
        this.state.paddle2.y = aiResult.paddleY;
      }
    }
    
    this.updateBall();
    this.checkWallCollision();
    this.checkPaddleCollision();
    this.checkScoring();
    
    this.broadcastState();
  }
  
  /**
   * Update ball position
   */
  updateBall() {
    const ball = this.state.ball;
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
  }
  
  /**
   * Check and handle wall collisions (top/bottom)
   */
  checkWallCollision() {
    const ball = this.state.ball;
    const table = this.state.table;
    
    // Top wall
    if (ball.y - ball.radius <= 0) {
      ball.y = ball.radius;
      ball.velocityY = -ball.velocityY;
      this.io.emit('soundEffect', { type: 'wallHit' });
    }
    
    // Bottom wall
    if (ball.y + ball.radius >= table.height) {
      ball.y = table.height - ball.radius;
      ball.velocityY = -ball.velocityY;
      this.io.emit('soundEffect', { type: 'wallHit' });
    }
  }
  
  /**
   * Check and handle paddle collisions
   */
  checkPaddleCollision() {
    const ball = this.state.ball;
    
    // Check collision with paddle 1 (left)
    if (this.isBallCollidingWithPaddle(ball, this.state.paddle1)) {
      this.handlePaddleBounce(ball, this.state.paddle1, 1);
    }
    
    // Check collision with paddle 2 (right)
    if (this.isBallCollidingWithPaddle(ball, this.state.paddle2)) {
      this.handlePaddleBounce(ball, this.state.paddle2, -1);
    }
  }
  
  /**
   * Check if ball is colliding with a paddle (AABB collision)
   */
  isBallCollidingWithPaddle(ball, paddle) {
    return (
      ball.x - ball.radius < paddle.x + paddle.width &&
      ball.x + ball.radius > paddle.x &&
      ball.y - ball.radius < paddle.y + paddle.height &&
      ball.y + ball.radius > paddle.y
    );
  }
  
  /**
   * Handle ball bouncing off a paddle
   */
  handlePaddleBounce(ball, paddle, directionMultiplier) {
    // Calculate where on the paddle the ball hit (0 = top, 1 = bottom)
    const hitPosition = (ball.y - paddle.y) / paddle.height;
    
    // Convert to angle factor (-1 to 1)
    const angleFactor = (hitPosition - 0.5) * 2;
    
    // Increase speed (up to max)
    if (ball.currentSpeedMultiplier < ball.maxSpeedMultiplier) {
      ball.currentSpeedMultiplier *= 1.05;
      if (ball.currentSpeedMultiplier > ball.maxSpeedMultiplier) {
        ball.currentSpeedMultiplier = ball.maxSpeedMultiplier;
      }
    }
    
    const speed = ball.baseSpeed * ball.currentSpeedMultiplier;
    
    // Set new velocity
    ball.velocityX = speed * directionMultiplier;
    ball.velocityY = speed * angleFactor * 0.8; // Dampen Y a bit
    
    // Move ball outside paddle to prevent multiple collisions
    if (directionMultiplier === 1) {
      // Hit left paddle, move ball to right of paddle
      ball.x = paddle.x + paddle.width + ball.radius;
    } else {
      // Hit right paddle, move ball to left of paddle
      ball.x = paddle.x - ball.radius;
    }
    
    // Emit paddle hit sound event
    this.io.emit('soundEffect', { type: 'paddleHit' });
  }
  
  /**
   * Check if a point was scored
   */
  checkScoring() {
    const ball = this.state.ball;
    const table = this.state.table;
    
    // Ball passed left side - Player 2 scores
    if (ball.x + ball.radius < 0) {
      this.scorePoint(2);
    }
    
    // Ball passed right side - Player 1 scores
    if (ball.x - ball.radius > table.width) {
      this.scorePoint(1);
    }
  }
  
  /**
   * Award a point to a player
   */
  scorePoint(player) {
    if (player === 1) {
      this.state.player1Score++;
    } else {
      this.state.player2Score++;
    }
    
    console.log(`⚽ Point scored! Player 1: ${this.state.player1Score}, Player 2: ${this.state.player2Score}`);
    
    // Emit score sound event
    this.io.emit('soundEffect', { type: 'score', player: player });
    
    // Check for winner
    if (this.state.player1Score >= this.state.winningScore) {
      this.endGame(1);
    } else if (this.state.player2Score >= this.state.winningScore) {
      this.endGame(2);
    } else {
      // Continue game - switch serve and start countdown
      this.state.servingPlayer = this.state.servingPlayer === 1 ? 2 : 1;
      this.state.phase = this.STATE.POINT_SCORED;
      this.broadcastState();
      
      // Brief pause then countdown
      setTimeout(() => {
        this.startCountdown();
      }, 500);
    }
  }
  
  /**
   * End the game with a winner
   */
  endGame(winner) {
    this.state.phase = this.STATE.GAME_OVER;
    this.state.winner = winner;
    this.resetBall();
    this.stop(); // Stop the game loop
    console.log(`🏆 Game Over! Player ${winner} wins!`);
    this.broadcastState();
    
    // Notify server if callback is set
    if (this.onGameOver) {
      this.onGameOver(winner);
    }
  }
  
  /**
   * Handle player input (UP/DOWN)
   */
  handleInput(playerId, direction, paddleNumber) {
    const paddle = paddleNumber === 1 ? this.state.paddle1 : this.state.paddle2;
    
    if (direction === 'UP') {
      paddle.y -= paddle.speed;
    } else if (direction === 'DOWN') {
      paddle.y += paddle.speed;
    }
    
    // Keep paddle within bounds
    const minY = 0;
    const maxY = this.state.table.height - paddle.height;
    paddle.y = Math.max(minY, Math.min(maxY, paddle.y));
    
    // Broadcast immediately for responsive feel
    this.broadcastState();
  }
  
  /**
   * Broadcast current game state to all connected clients
   */
  broadcastState() {
    this.io.emit('gameState', this.state);
  }
  
  /**
   * Get current game state (for new connections)
   */
  getState() {
    return this.state;
  }
  
  /**
   * Assign a player to a paddle
   */
  assignPlayer(socketId, paddleNumber) {
    if (paddleNumber === 1) {
      this.state.paddle1.playerId = socketId;
    } else if (paddleNumber === 2) {
      this.state.paddle2.playerId = socketId;
    }
  }
  
  /**
   * Set paddle color
   */
  setPaddleColor(paddleNumber, color) {
    if (paddleNumber === 1) {
      this.state.paddle1.color = color;
    } else if (paddleNumber === 2) {
      this.state.paddle2.color = color;
    }
    this.broadcastState();
  }
  
  /**
   * Remove a player
   */
  removePlayer(socketId) {
    if (this.state.paddle1.playerId === socketId) {
      this.state.paddle1.playerId = null;
    }
    if (this.state.paddle2.playerId === socketId) {
      this.state.paddle2.playerId = null;
    }
  }
  
  /**
   * Get the paddle number for a player
   */
  getPlayerPaddle(socketId) {
    if (this.state.paddle1.playerId === socketId) return 1;
    if (this.state.paddle2.playerId === socketId) return 2;
    return null;
  }
  
  /**
   * Assign player to next available paddle
   */
  assignToNextAvailablePaddle(socketId) {
    if (!this.state.paddle1.playerId) {
      this.state.paddle1.playerId = socketId;
      return 1;
    } else if (!this.state.paddle2.playerId) {
      this.state.paddle2.playerId = socketId;
      return 2;
    }
    return null; // No paddle available
  }
}

module.exports = GameEngine;
