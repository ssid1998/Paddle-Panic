/**
 * Paddle Panic - Mobile Controller
 * 
 * This script:
 * 1. Connects to the server via Socket.io
 * 2. Sends input events when UP/DOWN buttons are pressed
 * 3. Uses touchstart for faster response (no 300ms delay like click)
 */

// --- DOM Elements ---
const btnUp = document.getElementById('btn-up');
const btnDown = document.getElementById('btn-down');
const connectionStatus = document.getElementById('connection-status');

// --- Socket.io Connection ---
const socket = io();

// Connection status handling
socket.on('connect', () => {
  console.log('Connected to server');
  connectionStatus.textContent = 'Connected';
  connectionStatus.className = 'connected';
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
  connectionStatus.textContent = 'Disconnected';
  connectionStatus.className = 'disconnected';
});

socket.on('connect_error', () => {
  connectionStatus.textContent = 'Connection Error';
  connectionStatus.className = 'disconnected';
});

// Initial connecting state
connectionStatus.textContent = 'Connecting...';
connectionStatus.className = 'connecting';

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
