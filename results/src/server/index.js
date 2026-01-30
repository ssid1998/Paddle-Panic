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

// Set up game over callback
gameEngine.onGameOver = (winner) => {
  console.log(`🎮 Game engine reported winner: Player ${winner}`);
  lobbyState.state = LOBBY_STATE.GAME_OVER;
  broadcastLobbyState();
  
  // Notify all controllers to show "thanks for playing" screen
  io.emit('gameEnded');
  
  // Auto-reset lobby after 5 seconds
  setTimeout(() => {
    console.log('🔄 Auto-resetting lobby after game over');
    // Clear all controllers
    controllers.clear();
    resetLobby();
  }, 5000);
};

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
  PLAYING: 'PLAYING',
  GAME_OVER: 'GAME_OVER',
  PAUSED: 'PAUSED'
};

let lobbyState = {
  state: LOBBY_STATE.WAITING_FOR_P1,
  gameMode: null, // 'PVP' or 'PVC'
  aiDifficulty: null, // 'EASY', 'MEDIUM', 'HARD'
  players: {
    1: null, // { socketId, name, ready }
    2: null
  },
  showQR: true,
  disconnectedPlayer: null, // Track disconnected player for grace period
  disconnectTimer: null     // Timer for grace period
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
  // Clear any disconnect timer
  if (lobbyState.disconnectTimer) {
    clearTimeout(lobbyState.disconnectTimer);
    lobbyState.disconnectTimer = null;
  }
  
  lobbyState = {
    state: LOBBY_STATE.WAITING_FOR_P1,
    gameMode: null,
    aiDifficulty: null,
    players: { 1: null, 2: null },
    showQR: true,
    disconnectedPlayer: null,
    disconnectTimer: null
  };
  gameEngine.reset();
  broadcastLobbyState();
}

// REMOVED: startRematch function - rematch feature removed

// REMOVED: returnPlayer1ToModeSelect function - rematch feature removed

/**
 * Check if all required players are ready and start game
 */
function checkAndStartGame() {
  console.log(`🎮 checkAndStartGame called`);
  console.log(`🎮 gameMode: ${lobbyState.gameMode}`);
  console.log(`🎮 P1: ${lobbyState.players[1]?.name || 'none'}, ready: ${lobbyState.players[1]?.ready}`);
  console.log(`🎮 P2: ${lobbyState.players[2]?.name || 'none'}, ready: ${lobbyState.players[2]?.ready}`);
  
  const p1Ready = lobbyState.players[1]?.ready;
  const p2Ready = lobbyState.gameMode === 'PVC' || lobbyState.players[2]?.ready;
  
  console.log(`🎮 p1Ready: ${p1Ready}, p2Ready: ${p2Ready}`);
  
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
  } else {
    console.log('🎮 Not all players ready yet');
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
    console.log(`🎮 Current state: ${lobbyState.state}, gameMode: ${lobbyState.gameMode}`);
    console.log(`🎮 Player 1: ${lobbyState.players[1]?.name || 'none'}, Player 2: ${lobbyState.players[2]?.name || 'none'}`);
    
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
      
    } else if (!lobbyState.players[2] && (lobbyState.gameMode === 'PVP' || lobbyState.state === LOBBY_STATE.WAITING_FOR_P2)) {
      // Assign as Player 2 (PvP mode only)
      // Check both gameMode AND state to be more robust
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
      console.log(`🎮 Cannot assign player - game full or wrong mode`);
      socket.emit('gameFull', { message: 'Game is full. Please wait for the current game to end.' });
      return;
    }
    
    broadcastLobbyState();
  });
  
  // Handle name submission
  socket.on('setName', (data) => {
    const controller = controllers.get(socket.id);
    if (!controller) {
      console.log(`⚠️ setName from unknown controller: ${socket.id}`);
      return;
    }
    
    const playerNum = controller.playerNumber;
    const name = (data.name || '').trim().substring(0, 12) || `Player ${playerNum}`;
    
    if (!lobbyState.players[playerNum]) {
      console.log(`⚠️ Player ${playerNum} not in lobby state when setting name`);
      return;
    }
    
    lobbyState.players[playerNum].name = name;
    console.log(`📝 Player ${playerNum} set name: ${name}`);
    
    // Update game engine with player name
    gameEngine.assignPlayer(socket.id, playerNum);
    
    // Progress to next state
    if (playerNum === 1) {
      lobbyState.state = LOBBY_STATE.P1_SELECTING_MODE;
      console.log(`📝 State -> P1_SELECTING_MODE`);
    } else {
      lobbyState.state = LOBBY_STATE.READY_CHECK;
      console.log(`📝 State -> READY_CHECK (P2 joined)`);
      
      // Notify Player 1 that Player 2 has joined - send direct event
      if (lobbyState.players[1]) {
        console.log(`📝 P1 socket ID in lobby: ${lobbyState.players[1].socketId}`);
        const p1Socket = io.sockets.sockets.get(lobbyState.players[1].socketId);
        if (p1Socket) {
          console.log(`📝 Found P1 socket, sending player2Joined event`);
          p1Socket.emit('player2Joined', { name: name });
        } else {
          console.log(`⚠️ Could not find P1 socket! Socket ID: ${lobbyState.players[1].socketId}`);
          console.log(`⚠️ Available sockets:`, Array.from(io.sockets.sockets.keys()));
          
          // Fallback: try to find P1's socket from controllers map
          for (const [socketId, controller] of controllers.entries()) {
            if (controller.playerNumber === 1) {
              console.log(`📝 Found P1 in controllers map with socket: ${socketId}`);
              const fallbackSocket = io.sockets.sockets.get(socketId);
              if (fallbackSocket) {
                console.log(`📝 Sending player2Joined via fallback`);
                fallbackSocket.emit('player2Joined', { name: name });
                // Update the lobby state with correct socket ID
                lobbyState.players[1].socketId = socketId;
              }
              break;
            }
          }
        }
      } else {
        console.log(`⚠️ No P1 in lobby state!`);
      }
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
    console.log(`🎯 Current controllers:`, Array.from(controllers.entries()));
    
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
      console.log(`🎯 State set to WAITING_FOR_P2, showQR = true`);
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
    if (!controller) {
      console.log(`⚠️ playerReady from unknown controller: ${socket.id}`);
      return;
    }
    
    const playerNum = controller.playerNumber;
    console.log(`✅ Player ${playerNum} pressed ready`);
    console.log(`✅ Lobby state: ${lobbyState.state}, P1 ready: ${lobbyState.players[1]?.ready}, P2 ready: ${lobbyState.players[2]?.ready}`);
    
    if (lobbyState.players[playerNum]) {
      lobbyState.players[playerNum].ready = true;
      console.log(`✅ Player ${playerNum} is now ready!`);
      
      socket.emit('readyAccepted');
      broadcastLobbyState();
      
      // Check if we can start
      checkAndStartGame();
    } else {
      console.log(`⚠️ Player ${playerNum} not in lobby state`);
    }
  });
  
  // Handle input from controller (UP/DOWN buttons)
  socket.on('input', (data) => {
    const controller = controllers.get(socket.id);
    
    if (controller && lobbyState.state === LOBBY_STATE.PLAYING) {
      gameEngine.handleInput(socket.id, data.direction, controller.playerNumber);
    }
  });
  
  // REMOVED: restartGame and requestRematch handlers - rematch feature removed
  
  // Handle player leaving (simplified - just reset lobby)
  socket.on('leaveGame', () => {
    const controller = controllers.get(socket.id);
    if (!controller) return;
    
    const playerNum = controller.playerNumber;
    console.log(`👋 Player ${playerNum} is leaving`);
    
    // Confirm leave to the departing player
    socket.emit('leftGame');
    
    // Remove from tracking
    gameEngine.removePlayer(socket.id);
    controllers.delete(socket.id);
    lobbyState.players[playerNum] = null;
    
    // Reset lobby (game is over, start fresh)
    resetLobby();
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
      console.log(`👋 Player ${playerNum} disconnected`);
      
      // During gameplay, use grace period
      if (lobbyState.state === LOBBY_STATE.PLAYING && lobbyState.gameMode === 'PVP') {
        // Pause the game and wait for reconnection
        console.log(`⏸️ Pausing game - waiting 5 seconds for Player ${playerNum} to reconnect`);
        
        lobbyState.state = LOBBY_STATE.PAUSED;
        lobbyState.disconnectedPlayer = playerNum;
        gameEngine.stop();
        
        // Broadcast pause state
        io.emit('gamePaused', { 
          reason: 'disconnect', 
          playerNum: playerNum,
          playerName: lobbyState.players[playerNum]?.name || `Player ${playerNum}`,
          countdown: 5
        });
        
        // Start countdown
        let countdown = 5;
        const countdownInterval = setInterval(() => {
          countdown--;
          io.emit('pauseCountdown', { countdown });
          
          if (countdown <= 0) {
            clearInterval(countdownInterval);
          }
        }, 1000);
        
        // Set 5-second timer for forfeit
        lobbyState.disconnectTimer = setTimeout(() => {
          clearInterval(countdownInterval);
          
          // Player didn't reconnect - opponent wins by forfeit
          const winnerNum = playerNum === 1 ? 2 : 1;
          console.log(`⏰ Player ${playerNum} didn't reconnect. Player ${winnerNum} wins by forfeit!`);
          
          // Clean up disconnected player
          gameEngine.removePlayer(socket.id);
          controllers.delete(socket.id);
          lobbyState.players[playerNum] = null;
          lobbyState.disconnectedPlayer = null;
          lobbyState.disconnectTimer = null;
          
          // Award win and go to game over
          lobbyState.state = LOBBY_STATE.GAME_OVER;
          io.emit('forfeitWin', { winner: winnerNum });
          
          // Reset to lobby after a delay
          setTimeout(() => {
            // Clear controllers and reset lobby (simplified - no rematch)
            controllers.clear();
            resetLobby();
          }, 5000);
          
        }, 5000);
        
        return; // Don't remove player yet - wait for timeout or reconnection
      }
      
      // Not during gameplay or PvC mode - remove immediately
      gameEngine.removePlayer(socket.id);
      controllers.delete(socket.id);
      
      // Reset lobby if a player disconnects during game (PvC) or lobby
      if (lobbyState.state === LOBBY_STATE.PLAYING) {
        // PvC game - just reset
        resetLobby();
      } else if (lobbyState.state === LOBBY_STATE.GAME_OVER) {
        // At game over screen - just reset lobby
        lobbyState.players[playerNum] = null;
        controllers.clear();
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
  
  // Handle reconnection during grace period
  socket.on('reconnectPlayer', (data) => {
    if (lobbyState.state !== LOBBY_STATE.PAUSED) return;
    if (lobbyState.disconnectedPlayer === null) return;
    
    const playerNum = data.playerNumber;
    if (playerNum !== lobbyState.disconnectedPlayer) return;
    
    console.log(`🔌 Player ${playerNum} reconnected!`);
    
    // Clear the forfeit timer
    if (lobbyState.disconnectTimer) {
      clearTimeout(lobbyState.disconnectTimer);
      lobbyState.disconnectTimer = null;
    }
    
    // Update socket ID for the player
    const oldSocketId = lobbyState.players[playerNum]?.socketId;
    if (oldSocketId) {
      controllers.delete(oldSocketId);
    }
    
    controllers.set(socket.id, { playerNumber: playerNum });
    lobbyState.players[playerNum].socketId = socket.id;
    lobbyState.disconnectedPlayer = null;
    
    // Resume game
    lobbyState.state = LOBBY_STATE.PLAYING;
    io.emit('gameResumed');
    gameEngine.start();
    
    broadcastLobbyState();
  });
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
