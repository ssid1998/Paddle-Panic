/**
 * Paddle Panic - Main Server
 * 
 * This is the central server that:
 * 1. Serves the HTML pages (Express)
 * 2. Handles real-time communication (Socket.io)
 * 3. Manages lobby state and player connections
 * 4. Runs the authoritative game engine
 */

const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const path = require('path');
const os = require('os');
const GameEngine = require('./GameEngine');

// Initialize Express app
const app = express();
const httpServer = createServer(app);

// Initialize Socket.io with the HTTP server
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Allow connections from any origin (needed for phone access)
    methods: ["GET", "POST"]
  }
});

// Initialize the game engine
const gameEngine = new GameEngine(io);

// --- Lobby State ---
const LOBBY_STATE = {
  WAITING_FOR_P1: 'WAITING_FOR_P1',
  P1_ENTERING_NAME: 'P1_ENTERING_NAME',
  P1_SELECTING_MODE: 'P1_SELECTING_MODE',
  P1_SELECTING_DIFFICULTY: 'P1_SELECTING_DIFFICULTY',
  WAITING_FOR_P2: 'WAITING_FOR_P2',
  P2_ENTERING_NAME: 'P2_ENTERING_NAME',
  READY_CHECK: 'READY_CHECK',
  GAME_STARTING: 'GAME_STARTING',
  PLAYING: 'PLAYING'
};

let lobbyState = {
  state: LOBBY_STATE.WAITING_FOR_P1,
  gameMode: null, // 'PVP' or 'PVC'
  aiDifficulty: null, // 'EASY', 'MEDIUM', 'HARD'
  players: {
    1: null, // { socketId, name, ready }
    2: null
  },
  showQR: true
};

// Track connected clients (host screens vs controllers)
const hosts = new Set();
const controllers = new Map(); // socketId -> player data

// --- Express Routes ---

// Main route - Host screen
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/host/index.html'));
});

// Controller route - Mobile controller (must be before static middleware)
app.get('/controller', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/controller/index.html'));
});

// Serve static files from client folders
app.use('/host', express.static(path.join(__dirname, '../client/host')));
app.use('/controller', express.static(path.join(__dirname, '../client/controller')));

// API endpoint to get server IP (for QR code generation)
app.get('/api/server-info', (req, res) => {
  res.json({
    ip: getLocalIP(),
    port: PORT,
    controllerUrl: `http://${getLocalIP()}:${PORT}/controller`
  });
});

// --- Helper Functions ---

/**
 * Get the local IP address of this machine
 */
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Skip internal (loopback) and non-IPv4 addresses
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

/**
 * Broadcast lobby state to all connected clients
 */
function broadcastLobbyState() {
  const lobbyData = {
    state: lobbyState.state,
    gameMode: lobbyState.gameMode,
    aiDifficulty: lobbyState.aiDifficulty,
    showQR: lobbyState.showQR,
    controllerUrl: `http://${getLocalIP()}:${PORT}/controller`,
    player1: lobbyState.players[1] ? {
      name: lobbyState.players[1].name,
      ready: lobbyState.players[1].ready,
      color: lobbyState.players[1].color || '#e74c3c'
    } : null,
    player2: lobbyState.players[2] ? {
      name: lobbyState.players[2].name,
      ready: lobbyState.players[2].ready,
      color: lobbyState.players[2].color || '#3498db'
    } : null
  };
  
  io.emit('lobbyState', lobbyData);
}

/**
 * Reset lobby to initial state
 */
function resetLobby() {
  lobbyState = {
    state: LOBBY_STATE.WAITING_FOR_P1,
    gameMode: null,
    aiDifficulty: null,
    players: { 1: null, 2: null },
    showQR: true
  };
  gameEngine.reset();
  broadcastLobbyState();
}

/**
 * Check if all required players are ready and start game
 */
function checkAndStartGame() {
  const p1Ready = lobbyState.players[1]?.ready;
  const p2Ready = lobbyState.gameMode === 'PVC' || lobbyState.players[2]?.ready;
  
  if (p1Ready && p2Ready) {
    console.log('🎮 All players ready! Starting game...');
    lobbyState.state = LOBBY_STATE.GAME_STARTING;
    lobbyState.showQR = false;
    broadcastLobbyState();
    
    // Configure game engine with mode and difficulty
    gameEngine.setGameMode(lobbyState.gameMode, lobbyState.aiDifficulty);
    
    // Start the game engine
    setTimeout(() => {
      lobbyState.state = LOBBY_STATE.PLAYING;
      gameEngine.start();
      broadcastLobbyState();
    }, 500);
  }
}

// --- Socket.io Connection Handling ---

io.on('connection', (socket) => {
  console.log(`📱 New client connected: ${socket.id}`);
  
  // Send current states
  socket.emit('lobbyState', {
    state: lobbyState.state,
    gameMode: lobbyState.gameMode,
    aiDifficulty: lobbyState.aiDifficulty,
    showQR: lobbyState.showQR,
    controllerUrl: `http://${getLocalIP()}:${PORT}/controller`,
    player1: lobbyState.players[1] ? {
      name: lobbyState.players[1].name,
      ready: lobbyState.players[1].ready
    } : null,
    player2: lobbyState.players[2] ? {
      name: lobbyState.players[2].name,
      ready: lobbyState.players[2].ready
    } : null
  });
  socket.emit('gameState', gameEngine.getState());
  
  // --- Host Events ---
  
  socket.on('registerHost', () => {
    hosts.add(socket.id);
    console.log(`📺 Host registered: ${socket.id}`);
  });
  
  // --- Controller Events ---
  
  socket.on('registerController', () => {
    console.log(`🎮 Controller registered: ${socket.id}`);
    
    // Determine which player slot to assign
    if (!lobbyState.players[1]) {
      // Assign as Player 1
      lobbyState.players[1] = {
        socketId: socket.id,
        name: 'Player 1',
        ready: false
      };
      lobbyState.state = LOBBY_STATE.P1_ENTERING_NAME;
      lobbyState.showQR = false;
      
      controllers.set(socket.id, { playerNumber: 1 });
      
      socket.emit('playerAssigned', {
        playerNumber: 1,
        color: '#e74c3c',
        isFirstPlayer: true
      });
      
      console.log(`👤 Player 1 assigned: ${socket.id}`);
      
    } else if (!lobbyState.players[2] && lobbyState.gameMode === 'PVP') {
      // Assign as Player 2 (PvP mode only)
      lobbyState.players[2] = {
        socketId: socket.id,
        name: 'Player 2',
        ready: false
      };
      lobbyState.state = LOBBY_STATE.P2_ENTERING_NAME;
      lobbyState.showQR = false;
      
      controllers.set(socket.id, { playerNumber: 2 });
      
      socket.emit('playerAssigned', {
        playerNumber: 2,
        color: '#3498db',
        isFirstPlayer: false
      });
      
      console.log(`👤 Player 2 assigned: ${socket.id}`);
      
    } else {
      // Game is full or not in PvP mode
      socket.emit('gameFull', { message: 'Game is full. Please wait for the current game to end.' });
      return;
    }
    
    broadcastLobbyState();
  });
  
  // Handle name submission
  socket.on('setName', (data) => {
    const controller = controllers.get(socket.id);
    if (!controller) return;
    
    const playerNum = controller.playerNumber;
    const name = (data.name || '').trim().substring(0, 12) || `Player ${playerNum}`;
    
    lobbyState.players[playerNum].name = name;
    console.log(`📝 Player ${playerNum} set name: ${name}`);
    
    // Update game engine with player name
    gameEngine.assignPlayer(socket.id, playerNum);
    
    // Progress to next state
    if (playerNum === 1) {
      lobbyState.state = LOBBY_STATE.P1_SELECTING_MODE;
    } else {
      lobbyState.state = LOBBY_STATE.READY_CHECK;
    }
    
    socket.emit('nameAccepted', { name });
    broadcastLobbyState();
  });
  
  // Handle mode selection (Player 1 only)
  socket.on('selectMode', (data) => {
    const controller = controllers.get(socket.id);
    if (!controller || controller.playerNumber !== 1) return;
    
    const mode = data.mode; // 'PVP' or 'PVC'
    lobbyState.gameMode = mode;
    console.log(`🎯 Game mode selected: ${mode}`);
    
    if (mode === 'PVC') {
      // In PvC mode, randomly assign red or blue to player
      const playerColor = Math.random() > 0.5 ? '#e74c3c' : '#3498db';
      lobbyState.players[1].color = playerColor;
      controllers.get(socket.id).color = playerColor;
      
      // Update the player's controller with their color
      socket.emit('playerColorUpdate', { color: playerColor });
      
      // Update game engine paddle color
      gameEngine.setPaddleColor(1, playerColor);
      
      lobbyState.state = LOBBY_STATE.P1_SELECTING_DIFFICULTY;
    } else {
      // PVP - show QR for Player 2
      lobbyState.state = LOBBY_STATE.WAITING_FOR_P2;
      lobbyState.showQR = true;
    }
    
    socket.emit('modeAccepted', { mode });
    broadcastLobbyState();
  });
  
  // Handle difficulty selection (Player 1, PvC mode only)
  socket.on('selectDifficulty', (data) => {
    const controller = controllers.get(socket.id);
    if (!controller || controller.playerNumber !== 1) return;
    if (lobbyState.gameMode !== 'PVC') return;
    
    const difficulty = data.difficulty; // 'EASY', 'MEDIUM', 'HARD'
    lobbyState.aiDifficulty = difficulty;
    console.log(`🤖 AI difficulty selected: ${difficulty}`);
    
    // Set up RoboPaddle as Player 2 with BLACK color
    lobbyState.players[2] = {
      socketId: 'ROBOPADDLE',
      name: 'RoboPaddle',
      ready: true, // AI is always ready
      color: '#1a1a1a' // Black color for RoboPaddle
    };
    
    // Update game engine with RoboPaddle's black color
    gameEngine.setPaddleColor(2, '#1a1a1a');
    
    lobbyState.state = LOBBY_STATE.READY_CHECK;
    
    socket.emit('difficultyAccepted', { difficulty });
    broadcastLobbyState();
  });
  
  // Handle ready button
  socket.on('playerReady', () => {
    const controller = controllers.get(socket.id);
    if (!controller) return;
    
    const playerNum = controller.playerNumber;
    if (lobbyState.players[playerNum]) {
      lobbyState.players[playerNum].ready = true;
      console.log(`✅ Player ${playerNum} is ready!`);
      
      socket.emit('readyAccepted');
      broadcastLobbyState();
      
      // Check if we can start
      checkAndStartGame();
    }
  });
  
  // Handle input from controller (UP/DOWN buttons)
  socket.on('input', (data) => {
    const controller = controllers.get(socket.id);
    
    if (controller && lobbyState.state === LOBBY_STATE.PLAYING) {
      gameEngine.handleInput(socket.id, data.direction, controller.playerNumber);
    }
  });
  
  // Handle restart request
  socket.on('restartGame', () => {
    console.log('🔄 Game restart requested');
    resetLobby();
  });
  
  // Handle player leaving
  socket.on('leaveGame', () => {
    handleDisconnect(socket);
  });
  
  // Handle disconnection
  socket.on('disconnect', () => {
    handleDisconnect(socket);
  });
  
  function handleDisconnect(socket) {
    console.log(`📴 Client disconnected: ${socket.id}`);
    
    // Remove from hosts
    hosts.delete(socket.id);
    
    // Check if it was a controller
    const controller = controllers.get(socket.id);
    if (controller) {
      const playerNum = controller.playerNumber;
      console.log(`👋 Player ${playerNum} left the game`);
      
      gameEngine.removePlayer(socket.id);
      controllers.delete(socket.id);
      
      // Reset lobby if a player disconnects during game
      if (lobbyState.state === LOBBY_STATE.PLAYING) {
        // Game was in progress - for now, reset everything
        // (Future: could pause and wait for reconnection)
        resetLobby();
      } else {
        // In lobby - remove the player and adjust state
        lobbyState.players[playerNum] = null;
        
        if (playerNum === 1) {
          // If Player 1 left, reset everything
          resetLobby();
        } else {
          // If Player 2 left, go back to waiting for P2
          if (lobbyState.gameMode === 'PVP') {
            lobbyState.state = LOBBY_STATE.WAITING_FOR_P2;
            lobbyState.showQR = true;
            broadcastLobbyState();
          }
        }
      }
    }
  }
});

// --- Start Server ---

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
  const localIP = getLocalIP();
  console.log('');
  console.log('🏓 Paddle Panic server running!');
  console.log('');
  console.log('📺 Host Screen (open on your laptop):');
  console.log(`   http://localhost:${PORT}`);
  console.log('');
  console.log('📱 Controller (scan QR code or open on your phone):');
  console.log(`   http://${localIP}:${PORT}/controller`);
  console.log('');
  console.log('Make sure your phone is on the same WiFi network!');
  console.log('');
});
