/**
 * Paddle Panic - Mobile Controller
 * 
 * This script:
 * 1. Connects to the server via Socket.io
 * 2. Sends input events when UP/DOWN buttons are pressed
 * 3. Uses touchstart for faster response (no 300ms delay like click)
 * 4. Displays player assignment (which paddle color you control)
 */

// --- DOM Elements ---
const btnUp = document.getElementById('btn-up');
const btnDown = document.getElementById('btn-down');
const connectionStatus = document.getElementById('connection-status');
const playerInfo = document.getElementById('player-info');

// --- Player State ---
let myPaddleNumber = null;
let myColor = null;

// --- Socket.io Connection ---
const socket = io();

// Connection status handling
socket.on('connect', () => {
  console.log('Connected to server');
  connectionStatus.textContent = 'Connected';
  connectionStatus.className = 'connected';
  
  // Automatically join the game when connected
  socket.emit('joinGame', { name: 'Player' });
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
  connectionStatus.textContent = 'Disconnected';
  connectionStatus.className = 'disconnected';
  myPaddleNumber = null;
});

socket.on('connect_error', () => {
  connectionStatus.textContent = 'Connection Error';
  connectionStatus.className = 'disconnected';
});

// Handle player assignment
socket.on('playerAssigned', (data) => {
  myPaddleNumber = data.paddleNumber;
  myColor = data.color;
  console.log(`Assigned as Player ${myPaddleNumber} with color ${myColor}`);
  
  // Update UI to show player info
  if (playerInfo) {
    playerInfo.textContent = `Player ${myPaddleNumber}`;
    playerInfo.style.backgroundColor = myColor;
  }
  
  // Update button colors to match paddle
  updateButtonColors(myColor);
});

// Handle game full
socket.on('gameFull', (data) => {
  connectionStatus.textContent = 'Game Full';
  connectionStatus.className = 'disconnected';
  if (playerInfo) {
    playerInfo.textContent = 'Spectating';
  }
});

// Handle game state updates (for restart detection)
socket.on('gameState', (state) => {
  // If game is over and player presses a button, they can restart
  if (state.phase === 'GAME_OVER') {
    // Allow restart on next button press
  }
});

// Initial connecting state
connectionStatus.textContent = 'Connecting...';
connectionStatus.className = 'connecting';

// --- UI Updates ---

/**
 * Update button colors to match assigned paddle color
 */
function updateButtonColors(color) {
  // Create gradient based on paddle color
  const lighterColor = color;
  const darkerColor = adjustBrightness(color, -30);
  
  btnUp.style.background = `linear-gradient(180deg, ${lighterColor} 0%, ${darkerColor} 100%)`;
  btnDown.style.background = `linear-gradient(180deg, ${lighterColor} 0%, ${darkerColor} 100%)`;
}

/**
 * Adjust color brightness
 */
function adjustBrightness(hex, percent) {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max(0, Math.min(255, (num >> 16) + amt));
  const G = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amt));
  const B = Math.max(0, Math.min(255, (num & 0x0000FF) + amt));
  return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
}

// --- Input Handling ---

/**
 * Send input to server
 * @param {string} direction - 'UP' or 'DOWN'
 */
function sendInput(direction) {
  socket.emit('input', { direction });
}

/**
 * Handle button press (touchstart or mousedown)
 * @param {HTMLElement} button - The button element
 * @param {string} direction - 'UP' or 'DOWN'
 */
function handlePress(button, direction) {
  button.classList.add('pressed');
  sendInput(direction);
}

/**
 * Handle button release (touchend or mouseup)
 * @param {HTMLElement} button - The button element
 */
function handleRelease(button) {
  button.classList.remove('pressed');
}

// --- Event Listeners ---

// UP Button
btnUp.addEventListener('touchstart', (e) => {
  e.preventDefault(); // Prevent default touch behavior (zoom, scroll)
  handlePress(btnUp, 'UP');
}, { passive: false });

btnUp.addEventListener('touchend', (e) => {
  e.preventDefault();
  handleRelease(btnUp);
}, { passive: false });

// Mouse events for desktop testing
btnUp.addEventListener('mousedown', (e) => {
  handlePress(btnUp, 'UP');
});

btnUp.addEventListener('mouseup', (e) => {
  handleRelease(btnUp);
});

btnUp.addEventListener('mouseleave', (e) => {
  handleRelease(btnUp);
});

// DOWN Button
btnDown.addEventListener('touchstart', (e) => {
  e.preventDefault();
  handlePress(btnDown, 'DOWN');
}, { passive: false });

btnDown.addEventListener('touchend', (e) => {
  e.preventDefault();
  handleRelease(btnDown);
}, { passive: false });

// Mouse events for desktop testing
btnDown.addEventListener('mousedown', (e) => {
  handlePress(btnDown, 'DOWN');
});

btnDown.addEventListener('mouseup', (e) => {
  handleRelease(btnDown);
});

btnDown.addEventListener('mouseleave', (e) => {
  handleRelease(btnDown);
});

// --- Continuous Movement (Hold Button) ---

let upInterval = null;
let downInterval = null;

// Hold UP button for continuous movement
btnUp.addEventListener('touchstart', () => {
  upInterval = setInterval(() => sendInput('UP'), 50);
}, { passive: true });

btnUp.addEventListener('touchend', () => {
  if (upInterval) {
    clearInterval(upInterval);
    upInterval = null;
  }
});

btnUp.addEventListener('mousedown', () => {
  upInterval = setInterval(() => sendInput('UP'), 50);
});

btnUp.addEventListener('mouseup', () => {
  if (upInterval) {
    clearInterval(upInterval);
    upInterval = null;
  }
});

// Hold DOWN button for continuous movement
btnDown.addEventListener('touchstart', () => {
  downInterval = setInterval(() => sendInput('DOWN'), 50);
}, { passive: true });

btnDown.addEventListener('touchend', () => {
  if (downInterval) {
    clearInterval(downInterval);
    downInterval = null;
  }
});

btnDown.addEventListener('mousedown', () => {
  downInterval = setInterval(() => sendInput('DOWN'), 50);
});

btnDown.addEventListener('mouseup', () => {
  if (downInterval) {
    clearInterval(downInterval);
    downInterval = null;
  }
});

// Clean up intervals on mouse leave
btnUp.addEventListener('mouseleave', () => {
  if (upInterval) {
    clearInterval(upInterval);
    upInterval = null;
  }
});

btnDown.addEventListener('mouseleave', () => {
  if (downInterval) {
    clearInterval(downInterval);
    downInterval = null;
  }
});

// Prevent context menu on long press
document.addEventListener('contextmenu', (e) => {
  e.preventDefault();
});

console.log('Paddle Panic Controller loaded');
