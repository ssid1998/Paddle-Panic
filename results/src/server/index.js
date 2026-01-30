/**
 * Paddle Panic - Main Server
 * 
 * This is the central server that:
 * 1. Serves the HTML pages (Express)
 * 2. Handles real-time communication (Socket.io)
 * 3. Manages game state (paddle positions)
 */

const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const path = require('path');
const os = require('os');

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

// --- Game State ---
// This is the "single source of truth" - the server knows where everything is
const gameState = {
  paddle: {
    x: 50,           // Fixed X position (left side of screen)
    y: 300,          // Y position (will be updated by controller)
    width: 20,
    height: 100,
    speed: 15,       // How many pixels to move per input
    color: '#e74c3c' // Red color
  },
  table: {
    width: 1200,
    height: 700,
    color: '#1a5f2a' // Green table tennis color
  }
};

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
  console.log(`New client connected: ${socket.id}`);
  
  // Send current game state to newly connected client
  socket.emit('gameState', gameState);
  
  // Handle input from controller (UP/DOWN buttons)
  socket.on('input', (data) => {
    console.log(`Input received from ${socket.id}: ${data.direction}`);
    
    // Update paddle position based on direction
    if (data.direction === 'UP') {
      gameState.paddle.y -= gameState.paddle.speed;
    } else if (data.direction === 'DOWN') {
      gameState.paddle.y += gameState.paddle.speed;
    }
    
    // Keep paddle within table bounds
    const minY = 0;
    const maxY = gameState.table.height - gameState.paddle.height;
    gameState.paddle.y = Math.max(minY, Math.min(maxY, gameState.paddle.y));
    
    // Broadcast updated state to all connected clients (especially host screen)
    io.emit('gameState', gameState);
  });
  
  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
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
