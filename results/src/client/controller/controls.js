/**
 * Paddle Panic - Mobile Controller
 * 
 * This script handles:
 * 1. Multi-screen flow (name entry, mode selection, ready, game controls)
 * 2. Socket.io communication with server
 * 3. Touch input for game controls
 */

// --- DOM Elements ---
const connectionStatus = document.getElementById('connection-status');
const playerInfo = document.getElementById('player-info');

// Screens
const screens = {
  connecting: document.getElementById('screen-connecting'),
  name: document.getElementById('screen-name'),
  mode: document.getElementById('screen-mode'),
  difficulty: document.getElementById('screen-difficulty'),
  waiting: document.getElementById('screen-waiting'),
  ready: document.getElementById('screen-ready'),
  game: document.getElementById('screen-game'),
  gameover: document.getElementById('screen-gameover'),
  full: document.getElementById('screen-full'),
  thanks: document.getElementById('screen-thanks')
};

// Name screen elements
const nameInput = document.getElementById('name-input');
const btnNameSubmit = document.getElementById('btn-name-submit');
const btnNameSkip = document.getElementById('btn-name-skip');

// Mode screen elements
const btnModePvp = document.getElementById('btn-mode-pvp');
const btnModePvc = document.getElementById('btn-mode-pvc');

// Difficulty screen elements
const btnEasy = document.getElementById('btn-easy');
const btnMedium = document.getElementById('btn-medium');
const btnHard = document.getElementById('btn-hard');

// Ready screen elements
const readyTitle = document.getElementById('ready-title');
const readySubtitle = document.getElementById('ready-subtitle');
const btnReady = document.getElementById('btn-ready');
const opponentStatus = document.getElementById('opponent-status');

// Game control elements
const btnUp = document.getElementById('btn-up');
const btnDown = document.getElementById('btn-down');

// Game over elements
const gameoverResult = document.getElementById('gameover-result');
const gameoverScore = document.getElementById('gameover-score');
// REMOVED: btnRematch, btnLeave, rematchStatus - rematch feature removed

// Thanks screen elements
// (No button - screen auto-closes)

// --- Player State ---
let myPlayerNumber = null;
let myColor = null;
let myName = '';
let isFirstPlayer = false;
let currentScreen = 'connecting';

// --- Helper Functions ---

/**
 * Show a specific screen and hide all others
 */
function showScreen(screenName) {
  Object.keys(screens).forEach(name => {
    if (screens[name]) {
      screens[name].classList.remove('active');
    }
  });
  
  if (screens[screenName]) {
    screens[screenName].classList.add('active');
    currentScreen = screenName;
  }
}

/**
 * Update button colors to match assigned paddle color
 */
function updateButtonColors(color) {
  if (!btnUp || !btnDown) return;
  
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

// --- Socket.io Connection ---
const socket = io();

// Connection status handling
socket.on('connect', () => {
  console.log('Connected to server');
  connectionStatus.textContent = 'Connected';
  connectionStatus.className = 'connected';
  
  // Register as a controller
  socket.emit('registerController');
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
  connectionStatus.textContent = 'Disconnected';
  connectionStatus.className = 'disconnected';
  showScreen('connecting');
});

socket.on('connect_error', () => {
  connectionStatus.textContent = 'Connection Error';
  connectionStatus.className = 'disconnected';
});

// --- Server Events ---

// Handle player assignment
socket.on('playerAssigned', (data) => {
  myPlayerNumber = data.playerNumber;
  myColor = data.color;
  isFirstPlayer = data.isFirstPlayer;
  
  console.log(`Assigned as Player ${myPlayerNumber} with color ${myColor}`);
  
  // Update UI
  if (playerInfo) {
    playerInfo.textContent = `Player ${myPlayerNumber}`;
    playerInfo.style.backgroundColor = myColor;
  }
  
  // Update button colors
  updateButtonColors(myColor);
  
  // Show name entry screen
  showScreen('name');
  if (nameInput) {
    nameInput.focus();
  }
});

// Handle name accepted
socket.on('nameAccepted', (data) => {
  myName = data.name;
  console.log(`Name accepted: ${myName}`);
  
  if (playerInfo) {
    playerInfo.textContent = myName;
  }
  
  // First player goes to mode selection, second player goes to ready
  if (isFirstPlayer) {
    showScreen('mode');
  } else {
    showScreen('ready');
  }
});

// Handle player color update (for PvC mode - random red/blue)
socket.on('playerColorUpdate', (data) => {
  myColor = data.color;
  console.log(`Color updated to: ${myColor}`);
  
  if (playerInfo) {
    playerInfo.style.backgroundColor = myColor;
  }
  
  updateButtonColors(myColor);
});

// Handle mode accepted
socket.on('modeAccepted', (data) => {
  console.log(`Mode accepted: ${data.mode}`);
  
  if (data.mode === 'PVC') {
    showScreen('difficulty');
  } else {
    // PVP - wait for Player 2
    showScreen('waiting');
  }
});

// Handle difficulty accepted
socket.on('difficultyAccepted', (data) => {
  console.log(`Difficulty accepted: ${data.difficulty}`);
  showScreen('ready');
});

// Handle player 2 joined (sent to Player 1)
socket.on('player2Joined', (data) => {
  console.log(`🎮 Player 2 joined: ${data.name}`);
  console.log(`🎮 Current screen: ${currentScreen}, myPlayerNumber: ${myPlayerNumber}`);
  // Switch to ready screen
  showScreen('ready');
  console.log(`🎮 After showScreen, currentScreen: ${currentScreen}`);
});

// Handle ready accepted
socket.on('readyAccepted', () => {
  console.log('Ready accepted!');
  btnReady.classList.add('pressed');
  btnReady.textContent = 'WAITING...';
  btnReady.disabled = true;
});

// REMOVED: rematchAccepted handler - rematch feature removed
// REMOVED: rematchPending handler - rematch feature removed

// Handle left game confirmation
socket.on('leftGame', () => {
  console.log('Left game confirmed');
  showScreen('thanks');
  // Reset local state
  myPlayerNumber = null;
  myColor = null;
  myName = '';
  isFirstPlayer = false;
  if (playerInfo) {
    playerInfo.textContent = 'Joining...';
    playerInfo.style.backgroundColor = '#555';
  }
});

// REMOVED: returnToModeSelect handler - rematch feature removed
// REMOVED: opponentLeft handler - rematch feature removed

// Handle game full
socket.on('gameFull', (data) => {
  console.log('Game is full');
  showScreen('full');
});

// Handle lobby state updates
socket.on('lobbyState', (state) => {
  console.log('Lobby state:', state.state, 'Current screen:', currentScreen, 'My player:', myPlayerNumber);
  
  // Update opponent status on ready screen
  if (currentScreen === 'ready' && opponentStatus) {
    if (state.gameMode === 'PVC') {
      opponentStatus.textContent = 'RoboPaddle is ready!';
    } else if (state.player1?.ready && state.player2?.ready) {
      opponentStatus.textContent = 'Both players ready!';
    } else if (myPlayerNumber === 1 && state.player2?.ready) {
      opponentStatus.textContent = `${state.player2.name} is ready!`;
    } else if (myPlayerNumber === 2 && state.player1?.ready) {
      opponentStatus.textContent = `${state.player1.name} is ready!`;
    } else {
      opponentStatus.textContent = 'Waiting for opponent...';
    }
  }
  
  // If waiting for P2 and they joined (state is READY_CHECK or P2_ENTERING_NAME), show ready screen
  if (currentScreen === 'waiting' && myPlayerNumber === 1) {
    if (state.state === 'READY_CHECK' || state.state === 'P2_ENTERING_NAME') {
      console.log('P2 joined! Switching to ready screen');
      showScreen('ready');
    }
  }
  
  // If P1 and state is READY_CHECK but we're still on waiting, force to ready
  if (myPlayerNumber === 1 && state.state === 'READY_CHECK' && currentScreen === 'waiting') {
    console.log('Forcing switch to ready screen');
    showScreen('ready');
  }
  
  // If game is starting/playing, show game controls
  if (state.state === 'GAME_STARTING' || state.state === 'PLAYING') {
    showScreen('game');
  }
});

// Handle game state updates
socket.on('gameState', (state) => {
  // Switch to game controls when game starts
  if (state.phase === 'COUNTDOWN' || state.phase === 'PLAYING') {
    if (currentScreen !== 'game') {
      showScreen('game');
    }
  }
  
  // Show game over screen (simplified - no rematch)
  if (state.phase === 'GAME_OVER') {
    // Determine if we won or lost
    const iWon = state.winner === myPlayerNumber;
    
    if (gameoverResult) {
      gameoverResult.textContent = iWon ? '🎉 You Win!' : 'You Lose';
      gameoverResult.className = iWon ? 'win' : 'lose';
    }
    
    if (gameoverScore) {
      gameoverScore.textContent = `${state.player1Score} - ${state.player2Score}`;
    }
    
    // Vibrate on game end
    if (navigator.vibrate) {
      navigator.vibrate(iWon ? [200, 100, 200] : [100, 50, 100, 50, 100]);
    }
    
    // Show game over screen briefly, then transition to thanks
    showScreen('gameover');
  }
});

// Handle game ended (server will reset lobby)
socket.on('gameEnded', () => {
  console.log('Game ended - showing thanks screen');
  // Show thanks screen after a brief moment showing win/lose
  setTimeout(() => {
    showScreen('thanks');
    
    // Close the browser tab after 3 seconds
    setTimeout(() => {
      console.log('Closing controller window');
      window.close();
      // If window.close() doesn't work (some browsers block it), 
      // show a message that they can close the tab
    }, 3000);
  }, 3000); // Show win/lose for 3 seconds, then thanks
});

// --- Button Event Handlers ---

// Name submission
if (btnNameSubmit) {
  btnNameSubmit.addEventListener('click', () => {
    const name = nameInput?.value.trim() || '';
    socket.emit('setName', { name });
  });
}

if (btnNameSkip) {
  btnNameSkip.addEventListener('click', () => {
    socket.emit('setName', { name: '' });
  });
}

// Handle Enter key on name input
if (nameInput) {
  nameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const name = nameInput.value.trim();
      socket.emit('setName', { name });
    }
  });
}

// Mode selection
if (btnModePvp) {
  btnModePvp.addEventListener('click', () => {
    socket.emit('selectMode', { mode: 'PVP' });
  });
}

if (btnModePvc) {
  btnModePvc.addEventListener('click', () => {
    socket.emit('selectMode', { mode: 'PVC' });
  });
}

// Difficulty selection
if (btnEasy) {
  btnEasy.addEventListener('click', () => {
    socket.emit('selectDifficulty', { difficulty: 'EASY' });
  });
}

if (btnMedium) {
  btnMedium.addEventListener('click', () => {
    socket.emit('selectDifficulty', { difficulty: 'MEDIUM' });
  });
}

if (btnHard) {
  btnHard.addEventListener('click', () => {
    socket.emit('selectDifficulty', { difficulty: 'HARD' });
  });
}

// Ready button
if (btnReady) {
  btnReady.addEventListener('click', () => {
    socket.emit('playerReady');
  });
}

// REMOVED: Rematch button handler - rematch feature removed

// REMOVED: Leave button handler - game ends automatically now

// REMOVED: Rejoin button handler - screen auto-closes now

// --- Game Control Input Handling ---

/**
 * Send input to server
 */
function sendInput(direction) {
  socket.emit('input', { direction });
}

/**
 * Handle button press
 */
function handlePress(button, direction) {
  button.classList.add('pressed');
  sendInput(direction);
}

/**
 * Handle button release
 */
function handleRelease(button) {
  button.classList.remove('pressed');
}

// Continuous movement intervals
let upInterval = null;
let downInterval = null;

// UP Button events
if (btnUp) {
  // Touch events
  btnUp.addEventListener('touchstart', (e) => {
    e.preventDefault();
    handlePress(btnUp, 'UP');
    upInterval = setInterval(() => sendInput('UP'), 50);
  }, { passive: false });
  
  btnUp.addEventListener('touchend', (e) => {
    e.preventDefault();
    handleRelease(btnUp);
    if (upInterval) {
      clearInterval(upInterval);
      upInterval = null;
    }
  }, { passive: false });
  
  // Mouse events (for desktop testing)
  btnUp.addEventListener('mousedown', () => {
    handlePress(btnUp, 'UP');
    upInterval = setInterval(() => sendInput('UP'), 50);
  });
  
  btnUp.addEventListener('mouseup', () => {
    handleRelease(btnUp);
    if (upInterval) {
      clearInterval(upInterval);
      upInterval = null;
    }
  });
  
  btnUp.addEventListener('mouseleave', () => {
    handleRelease(btnUp);
    if (upInterval) {
      clearInterval(upInterval);
      upInterval = null;
    }
  });
}

// DOWN Button events
if (btnDown) {
  // Touch events
  btnDown.addEventListener('touchstart', (e) => {
    e.preventDefault();
    handlePress(btnDown, 'DOWN');
    downInterval = setInterval(() => sendInput('DOWN'), 50);
  }, { passive: false });
  
  btnDown.addEventListener('touchend', (e) => {
    e.preventDefault();
    handleRelease(btnDown);
    if (downInterval) {
      clearInterval(downInterval);
      downInterval = null;
    }
  }, { passive: false });
  
  // Mouse events (for desktop testing)
  btnDown.addEventListener('mousedown', () => {
    handlePress(btnDown, 'DOWN');
    downInterval = setInterval(() => sendInput('DOWN'), 50);
  });
  
  btnDown.addEventListener('mouseup', () => {
    handleRelease(btnDown);
    if (downInterval) {
      clearInterval(downInterval);
      downInterval = null;
    }
  });
  
  btnDown.addEventListener('mouseleave', () => {
    handleRelease(btnDown);
    if (downInterval) {
      clearInterval(downInterval);
      downInterval = null;
    }
  });
}

// Prevent context menu on long press
document.addEventListener('contextmenu', (e) => {
  e.preventDefault();
});

// --- Initial State ---
connectionStatus.textContent = 'Connecting...';
connectionStatus.className = 'connecting';
showScreen('connecting');

console.log('Paddle Panic Controller loaded');
