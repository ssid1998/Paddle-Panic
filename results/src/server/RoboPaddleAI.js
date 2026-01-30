/**
 * Paddle Panic - RoboPaddle AI
 * 
 * An intelligent AI opponent that:
 * 1. Predicts where the ball will arrive
 * 2. Moves smoothly toward the predicted position
 * 3. Has configurable difficulty (reaction time, accuracy)
 * 4. Makes intentional mistakes to be beatable
 */

class RoboPaddleAI {
  constructor(difficulty = 'MEDIUM') {
    this.difficulty = difficulty;
    
    // Difficulty presets
    this.difficultyConfigs = {
      EASY: {
        reactionDelay: 300,      // ms before AI reacts to ball direction change
        missChance: 0.30,        // 30% chance to intentionally miss
        maxSpeed: 8,             // Slower movement
        predictionError: 50,     // Pixels of random error in prediction
        updateInterval: 100      // ms between prediction updates
      },
      MEDIUM: {
        reactionDelay: 150,      // ms before AI reacts
        missChance: 0.10,        // 10% chance to miss
        maxSpeed: 12,            // Moderate speed
        predictionError: 25,     // Less prediction error
        updateInterval: 50       // Update more frequently
      },
      HARD: {
        reactionDelay: 50,       // Almost instant reaction
        missChance: 0.02,        // 2% chance to miss
        maxSpeed: 15,            // Full speed (same as player)
        predictionError: 5,      // Very accurate
        updateInterval: 16       // Update every frame
      }
    };
    
    // Current config based on difficulty
    this.config = this.difficultyConfigs[difficulty] || this.difficultyConfigs.MEDIUM;
    
    // AI state
    this.targetY = null;              // Where the AI wants to move
    this.lastBallVelocityX = 0;       // Track ball direction changes
    this.lastDirectionChangeTime = 0; // When ball direction last changed
    this.lastPredictionTime = 0;      // When we last updated prediction
    this.currentMissOffset = 0;       // Intentional miss offset
    this.decidedToMiss = false;       // Whether AI decided to miss this shot
    
    console.log(`🤖 RoboPaddle AI initialized with ${difficulty} difficulty`);
  }
  
  /**
   * Update AI each game tick
   * @param {Object} gameState - Current game state from GameEngine
   * @param {number} deltaTime - Time since last update (ms)
   * @returns {Object} - { paddleY: number } - New paddle position
   */
  update(gameState, deltaTime) {
    const now = Date.now();
    const ball = gameState.ball;
    const paddle = gameState.paddle2; // AI controls paddle 2 (right side)
    const table = gameState.table;
    
    // Check if ball direction changed (for reaction delay)
    if (Math.sign(ball.velocityX) !== Math.sign(this.lastBallVelocityX)) {
      this.lastDirectionChangeTime = now;
      this.lastBallVelocityX = ball.velocityX;
      
      // Decide if we're going to miss this shot (random chance)
      this.decidedToMiss = Math.random() < this.config.missChance;
      if (this.decidedToMiss) {
        // Calculate miss offset (aim above or below)
        const missDirection = Math.random() > 0.5 ? 1 : -1;
        const missAmount = 50 + Math.random() * 80; // Miss by 50-130 pixels
        this.currentMissOffset = missDirection * missAmount;
      } else {
        this.currentMissOffset = 0;
      }
    }
    
    // Apply reaction delay - don't update prediction until delay passes
    const timeSinceDirectionChange = now - this.lastDirectionChangeTime;
    if (timeSinceDirectionChange < this.config.reactionDelay) {
      // Still "reacting" - use old target or center
      if (this.targetY === null) {
        this.targetY = table.height / 2;
      }
    } else {
      // Update prediction if enough time has passed
      const timeSinceLastPrediction = now - this.lastPredictionTime;
      if (timeSinceLastPrediction >= this.config.updateInterval) {
        this.lastPredictionTime = now;
        
        // Only predict if ball is coming toward us
        if (ball.velocityX > 0) {
          this.targetY = this.predictBallY(ball, paddle, table);
          
          // Add prediction error based on difficulty
          this.targetY += (Math.random() - 0.5) * 2 * this.config.predictionError;
          
          // Add intentional miss offset
          this.targetY += this.currentMissOffset;
          
          // Clamp to valid range
          this.targetY = Math.max(
            paddle.height / 2,
            Math.min(table.height - paddle.height / 2, this.targetY)
          );
        } else {
          // Ball going away - return toward center
          this.targetY = table.height / 2;
        }
      }
    }
    
    // Move paddle toward target
    const newPaddleY = this.moveTowardTarget(paddle, this.targetY, table);
    
    return { paddleY: newPaddleY };
  }
  
  /**
   * Predict where the ball will be when it reaches the paddle's X position
   * Accounts for wall bounces
   */
  predictBallY(ball, paddle, table) {
    // Calculate time for ball to reach paddle X
    const distanceX = paddle.x - ball.x;
    
    if (ball.velocityX <= 0 || distanceX <= 0) {
      // Ball not coming toward us
      return table.height / 2;
    }
    
    const timeToReach = distanceX / ball.velocityX;
    
    // Simulate ball Y position with wall bounces
    let predictedY = ball.y + (ball.velocityY * timeToReach);
    
    // Handle wall bounces
    const minY = ball.radius;
    const maxY = table.height - ball.radius;
    const range = maxY - minY;
    
    // Normalize position to handle multiple bounces
    if (range > 0) {
      // How many times we've crossed the range
      let normalizedY = predictedY - minY;
      
      // Handle negative values
      if (normalizedY < 0) {
        normalizedY = -normalizedY;
      }
      
      // Calculate which "segment" we're in (each segment is one direction of travel)
      const segment = Math.floor(normalizedY / range);
      const positionInSegment = normalizedY % range;
      
      // Even segments: moving down (normal), odd segments: moving up (reflected)
      if (segment % 2 === 0) {
        predictedY = minY + positionInSegment;
      } else {
        predictedY = maxY - positionInSegment;
      }
    }
    
    // Clamp to valid range
    predictedY = Math.max(minY, Math.min(maxY, predictedY));
    
    return predictedY;
  }
  
  /**
   * Move paddle toward target Y position at controlled speed
   */
  moveTowardTarget(paddle, targetY, table) {
    if (targetY === null) {
      return paddle.y;
    }
    
    // Calculate center of paddle
    const paddleCenterY = paddle.y + paddle.height / 2;
    
    // Distance to target
    const distance = targetY - paddleCenterY;
    
    // If close enough, don't move (dead zone to prevent jitter)
    if (Math.abs(distance) < 5) {
      return paddle.y;
    }
    
    // Move toward target at max speed
    let movement = Math.sign(distance) * this.config.maxSpeed;
    
    // Don't overshoot
    if (Math.abs(movement) > Math.abs(distance)) {
      movement = distance;
    }
    
    // Calculate new position
    let newY = paddle.y + movement;
    
    // Keep paddle within bounds
    newY = Math.max(0, Math.min(table.height - paddle.height, newY));
    
    return newY;
  }
  
  /**
   * Reset AI state (e.g., when a new point starts)
   */
  reset() {
    this.targetY = null;
    this.lastBallVelocityX = 0;
    this.lastDirectionChangeTime = 0;
    this.lastPredictionTime = 0;
    this.currentMissOffset = 0;
    this.decidedToMiss = false;
  }
  
  /**
   * Update difficulty setting
   */
  setDifficulty(difficulty) {
    this.difficulty = difficulty;
    this.config = this.difficultyConfigs[difficulty] || this.difficultyConfigs.MEDIUM;
    this.reset();
    console.log(`🤖 RoboPaddle difficulty changed to ${difficulty}`);
  }
}

module.exports = RoboPaddleAI;
