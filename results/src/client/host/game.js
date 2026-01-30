/**
 * Paddle Panic - Host Screen Game Renderer
 * 
 * This script:
 * 1. Connects to the server via Socket.io
 * 2. Receives game state updates
 * 3. Renders the game on the canvas
 */

// --- Canvas Setup ---
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = 1200;
canvas.height = 700;

// --- Game State (received from server) ---
let gameState = {
  paddle: {
    x: 50,
    y: 300,
    width: 20,
    height: 100,
    color: '#e74c3c'
  },
  table: {
    width: 1200,
    height: 700,
    color: '#1a5f2a'
  }
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

// --- Rendering ---

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
  
  // Top and bottom borders
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, 5);
  ctx.fillRect(0, canvas.height - 5, canvas.width, 5);
}

/**
 * Draw the paddle
 */
function drawPaddle() {
  const { x, y, width, height, color } = gameState.paddle;
  
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

// Title is now rendered in HTML above the canvas

/**
 * Main render loop
 * Runs 60 times per second using requestAnimationFrame
 */
function render() {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw game elements
  drawTable();
  drawPaddle();
  
  // Schedule next frame
  requestAnimationFrame(render);
}

// Start the render loop
render();

console.log('Paddle Panic Host Screen loaded');
