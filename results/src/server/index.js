/**
 * Paddle Panic - Main Server
 * 
 * This is the central server that:
 * 1. Serves the HTML pages (Express)
 * 2. Handles real-time communication (Socket.io)
 * 3. Runs the authoritative game engine
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

// Track connected players
const players = new Map(); // socketId -> { paddleNumber, name }

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

// API endpoint to get server IP (for QR code generation later)
app.get('/api/server-info', (req, res) => {
  res.json({
    ip: getLocalIP(),
    port: PORT
  });
});

// --- Socket.io Connection Handling ---

io.on('connection', (socket) => {
  console.log(`📱 New client connected: ${socket.id}`);
  
  // Send current game state to newly connected client
  socket.emit('gameState', gameEngine.getState());
  
  // Handle player joining
  socket.on('joinGame', (data) => {
    const paddleNumber = gameEngine.assignToNextAvailablePaddle(socket.id);
    
    if (paddleNumber) {
      players.set(socket.id, { 
        paddleNumber, 
        name: data?.name || `Player ${paddleNumber}` 
      });
      
      console.log(`🎮 Player joined as Player ${paddleNumber}: ${socket.id}`);
      
      // Tell the player which paddle they control
      socket.emit('playerAssigned', { 
        paddleNumber,
        color: paddleNumber === 1 ? '#e74c3c' : '#3498db'
      });
      
      // If we have two players and game is idle, start the game
      if (players.size >= 1 && gameEngine.getState().phase === 'IDLE') {
        console.log('🎮 Starting game...');
        gameEngine.start();
      }
      
      // Broadcast updated state
      gameEngine.broadcastState();
    } else {
      socket.emit('gameFull', { message: 'Game is full. Please wait.' });
    }
  });
  
  // Handle input from controller (UP/DOWN buttons)
  socket.on('input', (data) => {
    const player = players.get(socket.id);
    
    if (player) {
      gameEngine.handleInput(socket.id, data.direction, player.paddleNumber);
    } else {
      // Legacy support: if player hasn't formally joined, auto-join them
      const paddleNumber = gameEngine.assignToNextAvailablePaddle(socket.id);
      if (paddleNumber) {
        players.set(socket.id, { paddleNumber, name: `Player ${paddleNumber}` });
        socket.emit('playerAssigned', { 
          paddleNumber,
          color: paddleNumber === 1 ? '#e74c3c' : '#3498db'
        });
        gameEngine.handleInput(socket.id, data.direction, paddleNumber);
        
        // Start game if idle
        if (gameEngine.getState().phase === 'IDLE') {
          gameEngine.start();
        }
      }
    }
  });
  
  // Handle restart request
  socket.on('restartGame', () => {
    console.log('🔄 Game restart requested');
    gameEngine.reset();
    gameEngine.start();
  });
  
  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`📴 Client disconnected: ${socket.id}`);
    
    const player = players.get(socket.id);
    if (player) {
      console.log(`👋 Player ${player.paddleNumber} left the game`);
      gameEngine.removePlayer(socket.id);
      players.delete(socket.id);
    }
  });
});

// --- Helper Functions ---

/**
 * Get the local IP address of this machine
 * This is needed so phones on the same network can connect
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
  console.log('📱 Controller (open on your phone):');
  console.log(`   http://${localIP}:${PORT}/controller`);
  console.log('');
  console.log('Make sure your phone is on the same WiFi network!');
  console.log('');
});
