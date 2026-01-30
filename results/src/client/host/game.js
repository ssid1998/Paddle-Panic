/**
 * Paddle Panic - Host Screen Game Renderer
 * 
 * This script:
 * 1. Connects to the server via Socket.io
 * 2. Receives game state updates
 * 3. Renders the game on the canvas (table, paddles, ball, scores, etc.)
 */

// --- Canvas Setup ---
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = 1200;
canvas.height = 700;

// --- Game State (received from server) ---
let gameState = {
  phase: 'IDLE',
  table: {
    width: 1200,
    height: 700,
    color: '#1a5f2a'
  },
  ball: {
    x: 600,
    y: 350,
    radius: 12,
    color: '#ffffff'
  },
  paddle1: {
    x: 50,
    y: 300,
    width: 20,
    height: 100,
    color: '#e74c3c'
  },
  paddle2: {
    x: 1130,
    y: 300,
    width: 20,
    height: 100,
    color: '#3498db'
  },
  player1Score: 0,
  player2Score: 0,
  countdown: 3,
  winner: null
};

// --- Socket.io Connection ---
const socket = io();

socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

// Receive game state updates from server
socket.on('gameState', (state) => {
  gameState = state;
});

// --- Rendering Functions ---

/**
 * Draw the table background
 */
function drawTable() {
  // Main table color
  ctx.fillStyle = gameState.table.color;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Center line (dashed)
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 4;
  ctx.setLineDash([20, 15]);
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.stroke();
  ctx.setLineDash([]); // Reset dash
  
  // Center circle
  ctx.beginPath();
  ctx.arc(canvas.width / 2, canvas.height / 2, 50, 0, Math.PI * 2);
  ctx.stroke();
  
  // Top and bottom borders
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, 5);
  ctx.fillRect(0, canvas.height - 5, canvas.width, 5);
}

/**
 * Draw a paddle
 */
function drawPaddle(paddle) {
  const { x, y, width, height, color } = paddle;
  
  // Paddle shadow (for depth effect)
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.fillRect(x + 4, y + 4, width, height);
  
  // Main paddle
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
  
  // Paddle highlight
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.fillRect(x, y, width, 5);
}

/**
 * Draw the ball
 */
function drawBall() {
  const { x, y, radius, color } = gameState.ball;
  
  // Ball shadow
  ctx.beginPath();
  ctx.arc(x + 3, y + 3, radius, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.fill();
  
  // Main ball
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  
  // Ball highlight (makes it look 3D)
  ctx.beginPath();
  ctx.arc(x - 3, y - 3, radius / 3, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.fill();
}

/**
 * Draw the scores
 */
function drawScores() {
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.font = 'bold 72px Arial';
  ctx.textAlign = 'center';
  
  // Player 1 score (left side)
  ctx.fillText(gameState.player1Score, canvas.width / 4, 80);
  
  // Player 2 score (right side)
  ctx.fillText(gameState.player2Score, (canvas.width / 4) * 3, 80);
  
  // Separator
  ctx.font = 'bold 48px Arial';
  ctx.fillText('-', canvas.width / 2, 75);
}

/**
 * Draw the countdown overlay
 */
function drawCountdown() {
  // Semi-transparent overlay
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Countdown number
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 200px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  const text = gameState.countdown > 0 ? gameState.countdown.toString() : 'GO!';
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);
  
  ctx.textBaseline = 'alphabetic'; // Reset
}

/**
 * Draw the game over screen
 */
function drawGameOver() {
  // Semi-transparent overlay
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Winner announcement
  ctx.fillStyle = '#f1c40f'; // Gold color
  ctx.font = 'bold 72px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  const winnerText = `Player ${gameState.winner} Wins!`;
  ctx.fillText(winnerText, canvas.width / 2, canvas.height / 2 - 50);
  
  // Final score
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 48px Arial';
  ctx.fillText(
    `${gameState.player1Score} - ${gameState.player2Score}`, 
    canvas.width / 2, 
    canvas.height / 2 + 30
  );
  
  // Restart instruction
  ctx.font = '28px Arial';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.fillText('Press any button on controller to play again', canvas.width / 2, canvas.height / 2 + 100);
  
  ctx.textBaseline = 'alphabetic'; // Reset
}

/**
 * Draw idle/waiting screen
 */
function drawIdleScreen() {
  // Semi-transparent overlay
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Waiting message
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 48px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Waiting for players...', canvas.width / 2, canvas.height / 2 - 30);
  
  ctx.font = '28px Arial';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.fillText('Scan QR code or open /controller on your phone', canvas.width / 2, canvas.height / 2 + 30);
  
  ctx.textBaseline = 'alphabetic'; // Reset
}

/**
 * Main render loop
 * Runs 60 times per second using requestAnimationFrame
 */
function render() {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Always draw the base game elements
  drawTable();
  drawPaddle(gameState.paddle1);
  drawPaddle(gameState.paddle2);
  drawBall();
  drawScores();
  
  // Draw overlays based on game phase
  switch (gameState.phase) {
    case 'IDLE':
      drawIdleScreen();
      break;
    case 'COUNTDOWN':
      drawCountdown();
      break;
    case 'GAME_OVER':
      drawGameOver();
      break;
    // 'PLAYING' and 'POINT_SCORED' just show the game
  }
  
  // Schedule next frame
  requestAnimationFrame(render);
}

// Start the render loop
render();

console.log('Paddle Panic Host Screen loaded');
