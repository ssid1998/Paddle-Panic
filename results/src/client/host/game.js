/**
 * Paddle Panic - Host Screen
 * 
 * This script:
 * 1. Connects to the server via Socket.io
 * 2. Displays lobby with QR code for joining
 * 3. Receives game state updates
 * 4. Renders the game on the canvas (table, paddles, ball, scores, etc.)
 */

// --- DOM Elements ---
const lobbyScreen = document.getElementById('lobby-screen');
const qrSection = document.getElementById('qr-section');
const qrCodeContainer = document.getElementById('qr-code');
const controllerUrlText = document.getElementById('controller-url');
const player1Name = document.getElementById('player1-name');
const player1Status = document.getElementById('player1-status');
const player1Indicator = document.getElementById('player1-indicator');
const player2Name = document.getElementById('player2-name');
const player2Status = document.getElementById('player2-status');
const player2Indicator = document.getElementById('player2-indicator');
const lobbyStatusText = document.getElementById('lobby-status');

// --- Canvas Setup ---
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = 1200;
canvas.height = 700;

// --- State ---
let lobbyState = {
  state: 'WAITING_FOR_P1',
  showQR: true,
  controllerUrl: '',
  player1: null,
  player2: null,
  gameMode: null,
  aiDifficulty: null
};

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

let isInGame = false;
let isPaused = false;
let pauseCountdown = 0;
let pausedPlayerName = '';

// --- Voice Announcement (REMOVED) ---
// Voice feature has been removed per user request

// --- Socket.io Connection ---
const socket = io();

socket.on('connect', () => {
  console.log('Connected to server');
  socket.emit('registerHost');
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

// Receive lobby state updates
socket.on('lobbyState', (state) => {
  lobbyState = state;
  updateLobbyUI();
  
  // If lobby resets to waiting, go back to lobby view
  if (state.state === 'WAITING_FOR_P1' && isInGame) {
    showLobbyView();
  }
});

// Receive game state updates from server
socket.on('gameState', (state) => {
  gameState = state;
  
  // Check if we should switch to game view
  if (state.phase === 'COUNTDOWN' || state.phase === 'PLAYING' || state.phase === 'GAME_OVER') {
    if (!isInGame) {
      showGameView();
    }
  }
  
  // Reset flag when a new game starts
  if (state.phase === 'COUNTDOWN') {
    // Game starting
  }
  
  // Game over - no voice announcement (removed)
});

// Handle game paused (player disconnected)
socket.on('gamePaused', (data) => {
  console.log('Game paused:', data);
  isPaused = true;
  pauseCountdown = data.countdown;
  pausedPlayerName = data.playerName;
});

// Handle pause countdown
socket.on('pauseCountdown', (data) => {
  pauseCountdown = data.countdown;
});

// Handle game resumed
socket.on('gameResumed', () => {
  console.log('Game resumed!');
  isPaused = false;
  pauseCountdown = 0;
  pausedPlayerName = '';
});

// Handle forfeit win
socket.on('forfeitWin', (data) => {
  console.log('Forfeit win:', data);
  isPaused = false;
  // Voice announcement removed
});

// --- QR Code Generation ---
function generateQRCode(url) {
  if (!qrCodeContainer) return;
  
  // Clear previous QR code
  qrCodeContainer.innerHTML = '';
  
  try {
    // Use QRCode library (loaded via CDN)
    if (typeof QRCode !== 'undefined') {
      // Create a canvas element
      const canvas = document.createElement('canvas');
      qrCodeContainer.appendChild(canvas);
      
      // Generate QR code on the canvas
      QRCode.toCanvas(canvas, url, {
        width: 250,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      }, function(error) {
        if (error) {
          console.error('QR Code generation error:', error);
          qrCodeContainer.innerHTML = '<p style="color: #666;">QR Code error</p>';
        } else {
          console.log('QR Code generated successfully for:', url);
        }
      });
    } else {
      console.error('QRCode library not loaded');
      qrCodeContainer.innerHTML = '<p style="color: #666;">QR Code library not loaded</p>';
    }
  } catch (error) {
    console.error('Failed to generate QR code:', error);
    qrCodeContainer.innerHTML = '<p style="color: #666;">QR Code unavailable</p>';
  }
}

// --- Lobby UI Updates ---
function updateLobbyUI() {
  // Update QR code visibility
  if (qrSection) {
    if (lobbyState.showQR) {
      qrSection.classList.remove('hidden');
      if (lobbyState.controllerUrl) {
        generateQRCode(lobbyState.controllerUrl);
        if (controllerUrlText) {
          controllerUrlText.textContent = lobbyState.controllerUrl;
        }
      }
    } else {
      qrSection.classList.add('hidden');
    }
  }
  
  // Update Player 1 display
  if (player1Name && player1Status) {
    if (lobbyState.player1) {
      player1Name.textContent = lobbyState.player1.name || 'Player 1';
      if (lobbyState.player1.ready) {
        player1Status.textContent = 'READY!';
        player1Status.className = 'player-status';
      } else {
        player1Status.textContent = 'Joining...';
        player1Status.className = 'player-status waiting';
      }
      // Update player 1 indicator color
      if (player1Indicator && lobbyState.player1.color) {
        player1Indicator.style.backgroundColor = lobbyState.player1.color;
      }
    } else {
      player1Name.textContent = 'Waiting...';
      player1Status.textContent = '';
      if (player1Indicator) {
        player1Indicator.style.backgroundColor = '#e74c3c'; // Default red
      }
    }
  }
  
  // Update Player 2 display
  if (player2Name && player2Status) {
    if (lobbyState.player2) {
      player2Name.textContent = lobbyState.player2.name || 'Player 2';
      if (lobbyState.player2.ready) {
        player2Status.textContent = 'READY!';
        player2Status.className = 'player-status';
      } else {
        player2Status.textContent = 'Joining...';
        player2Status.className = 'player-status waiting';
      }
      // Update player 2 indicator color
      if (player2Indicator && lobbyState.player2.color) {
        player2Indicator.style.backgroundColor = lobbyState.player2.color;
      }
    } else if (lobbyState.gameMode === 'PVP') {
      player2Name.textContent = 'Scan to join!';
      player2Status.textContent = '';
      if (player2Indicator) {
        player2Indicator.style.backgroundColor = '#3498db'; // Default blue
      }
    } else {
      player2Name.textContent = 'Waiting...';
      player2Status.textContent = '';
      if (player2Indicator) {
        player2Indicator.style.backgroundColor = '#3498db'; // Default blue
      }
    }
  }
  
  // Update lobby status message
  if (lobbyStatusText) {
    switch (lobbyState.state) {
      case 'WAITING_FOR_P1':
        lobbyStatusText.textContent = 'Scan the QR code to join!';
        break;
      case 'P1_ENTERING_NAME':
        lobbyStatusText.textContent = `${lobbyState.player1?.name || 'Player 1'} is entering their name...`;
        break;
      case 'P1_SELECTING_MODE':
        lobbyStatusText.textContent = `${lobbyState.player1?.name || 'Player 1'} is choosing game mode...`;
        break;
      case 'P1_SELECTING_DIFFICULTY':
        lobbyStatusText.textContent = `${lobbyState.player1?.name || 'Player 1'} is selecting AI difficulty...`;
        break;
      case 'WAITING_FOR_P2':
        lobbyStatusText.textContent = 'Waiting for Player 2 to scan...';
        break;
      case 'P2_ENTERING_NAME':
        lobbyStatusText.textContent = 'Player 2 is entering their name...';
        break;
      case 'READY_CHECK':
        lobbyStatusText.textContent = 'Press READY to start!';
        break;
      case 'GAME_STARTING':
        lobbyStatusText.textContent = 'Game starting...';
        break;
      case 'PLAYING':
        showGameView();
        break;
      default:
        lobbyStatusText.textContent = 'Waiting for players...';
    }
  }
}

// --- View Switching ---
function showGameView() {
  isInGame = true;
  if (lobbyScreen) lobbyScreen.classList.add('hidden');
  if (canvas) canvas.classList.add('visible');
}

function showLobbyView() {
  isInGame = false;
  if (lobbyScreen) lobbyScreen.classList.remove('hidden');
  if (canvas) canvas.classList.remove('visible');
}

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
 * Draw the scores with player names
 */
function drawScores() {
  // Player names
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.font = '24px Arial';
  ctx.textAlign = 'center';
  
  const p1Name = lobbyState.player1?.name || 'Player 1';
  const p2Name = lobbyState.player2?.name || 'Player 2';
  
  ctx.fillText(p1Name, canvas.width / 4, 40);
  ctx.fillText(p2Name, (canvas.width / 4) * 3, 40);
  
  // Scores
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.font = 'bold 72px Arial';
  
  // Player 1 score (left side)
  ctx.fillText(gameState.player1Score, canvas.width / 4, 110);
  
  // Player 2 score (right side)
  ctx.fillText(gameState.player2Score, (canvas.width / 4) * 3, 110);
  
  // Separator
  ctx.font = 'bold 48px Arial';
  ctx.fillText('-', canvas.width / 2, 100);
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
 * Draw the pause overlay (player disconnected)
 */
function drawPauseOverlay() {
  // Semi-transparent overlay
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Pause message
  ctx.fillStyle = '#f39c12'; // Orange/warning color
  ctx.font = 'bold 48px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  ctx.fillText(`${pausedPlayerName} disconnected`, canvas.width / 2, canvas.height / 2 - 60);
  
  // Countdown
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 72px Arial';
  ctx.fillText(pauseCountdown.toString(), canvas.width / 2, canvas.height / 2 + 30);
  
  // Subtitle
  ctx.font = '24px Arial';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.fillText('Waiting for reconnection...', canvas.width / 2, canvas.height / 2 + 100);
  
  ctx.textBaseline = 'alphabetic';
}

/**
 * Draw the game over screen
 */
function drawGameOver() {
  // Semi-transparent overlay
  ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Get winner info
  const winnerName = gameState.winner === 1 
    ? (lobbyState.player1?.name || 'Player 1')
    : (lobbyState.player2?.name || 'Player 2');
  
  const winnerColor = gameState.winner === 1
    ? (lobbyState.player1?.color || '#e74c3c')
    : (lobbyState.player2?.color || '#3498db');
  
  // Winner banner with color
  ctx.fillStyle = winnerColor;
  ctx.fillRect(0, canvas.height / 2 - 120, canvas.width, 180);
  
  // Winner announcement
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 80px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`${winnerName} Wins!`, canvas.width / 2, canvas.height / 2 - 50);
  
  // Trophy emoji
  ctx.font = '60px Arial';
  ctx.fillText('🏆', canvas.width / 2, canvas.height / 2 - 140);
  
  // Final score
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 48px Arial';
  ctx.fillText(
    `${gameState.player1Score} - ${gameState.player2Score}`, 
    canvas.width / 2, 
    canvas.height / 2 + 80
  );
  
  // Instructions
  ctx.font = '24px Arial';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.fillText('Thanks for playing! New game starting soon...', canvas.width / 2, canvas.height / 2 + 150);
  
  ctx.textBaseline = 'alphabetic'; // Reset
}

/**
 * Main render loop
 * Runs 60 times per second using requestAnimationFrame
 */
function render() {
  // Only render game canvas if in game mode
  if (isInGame) {
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
      case 'COUNTDOWN':
        drawCountdown();
        break;
      case 'GAME_OVER':
        drawGameOver();
        break;
      // 'PLAYING' and 'POINT_SCORED' just show the game
    }
    
    // Draw pause overlay if paused
    if (isPaused) {
      drawPauseOverlay();
    }
  }
  
  // Schedule next frame
  requestAnimationFrame(render);
}

// --- Initialization ---

// Generate initial QR code
fetch('/api/server-info')
  .then(res => res.json())
  .then(info => {
    if (info.controllerUrl) {
      generateQRCode(info.controllerUrl);
      if (controllerUrlText) {
        controllerUrlText.textContent = info.controllerUrl;
      }
    }
  })
  .catch(err => console.error('Failed to get server info:', err));

// Start the render loop
render();

console.log('Paddle Panic Host Screen loaded');
