# Technology Stack: Paddle Panic

**Date:** Fri Jan 30 2026
**Phase:** 01_architecture

---

## Overview

This document defines the complete technology stack for Paddle Panic. Each technology is explained in beginner-friendly terms, with rationale for why it was chosen.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              LAPTOP                                      │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │                       NODE.js SERVER                                │ │
│  │                                                                     │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                 │ │
│  │  │  Express.js │  │  Socket.io  │  │ Game Engine │                 │ │
│  │  │  (Web Server)│  │  (Real-Time)│  │ (Game Loop) │                 │ │
│  │  └─────────────┘  └─────────────┘  └─────────────┘                 │ │
│  │         │                │                │                         │ │
│  │         └────────────────┴────────────────┘                         │ │
│  │                          │                                          │ │
│  └──────────────────────────┼──────────────────────────────────────────┘ │
│                             │                                            │
│                             ▼                                            │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │                    HOST SCREEN (Browser)                            │ │
│  │                                                                     │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌───────────┐  │ │
│  │  │ HTML5 Canvas│  │  QRCode.js  │  │ Web Audio   │  │ Web Speech│  │ │
│  │  │  (Graphics) │  │ (QR Codes)  │  │  (Sounds)   │  │   (TTS)   │  │ │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └───────────┘  │ │
│  │                                                                     │ │
│  └────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
                                    ▲
                                    │ WiFi (Same Network)
                                    │ WebSocket Connection
                                    ▼
        ┌─────────────────────┐           ┌─────────────────────┐
        │  PHONE 1 (Browser)  │           │  PHONE 2 (Browser)  │
        │                     │           │                     │
        │  ┌───────────────┐  │           │  ┌───────────────┐  │
        │  │ Socket.io     │  │           │  │ Socket.io     │  │
        │  │ (Connection)  │  │           │  │ (Connection)  │  │
        │  └───────────────┘  │           │  └───────────────┘  │
        │  ┌───────────────┐  │           │  ┌───────────────┐  │
        │  │ Touch Events  │  │           │  │ Touch Events  │  │
        │  │ (Controls)    │  │           │  │ (Controls)    │  │
        │  └───────────────┘  │           │  └───────────────┘  │
        │  ┌───────────────┐  │           │  ┌───────────────┐  │
        │  │ Vibration API │  │           │  │ Vibration API │  │
        │  │ (Feedback)    │  │           │  │ (Feedback)    │  │
        │  └───────────────┘  │           │  └───────────────┘  │
        │                     │           │                     │
        └─────────────────────┘           └─────────────────────┘
```

---

## Server-Side Technologies

### 1. Node.js

| Aspect | Details |
|--------|---------|
| **What is it?** | A JavaScript runtime that lets you run JavaScript on a server (outside the browser) |
| **Version** | 18.x or higher (LTS recommended) |
| **Why we chose it** | Fast event-driven architecture, perfect for real-time applications, same language as browser |
| **Alternative considered** | Python (Flask/Django) - rejected because less efficient for WebSocket handling |

**Beginner Explanation:**  
Normally, JavaScript only runs in web browsers. Node.js is like giving JavaScript a passport to run on computers and servers too. It's especially good at handling many connections at once without slowing down—exactly what we need for a real-time game.

---

### 2. Express.js

| Aspect | Details |
|--------|---------|
| **What is it?** | A minimal web framework for Node.js |
| **Version** | 4.x |
| **Why we chose it** | Simple, widely used, handles routing and static file serving |
| **Install** | `npm install express` |

**Beginner Explanation:**  
When you type a URL into your browser, something needs to decide which page to show. Express is that "something." It's like a receptionist who directs visitors to the right room. For Paddle Panic, Express serves our HTML pages and handles the initial connection.

**Code Example:**
```javascript
const express = require('express');
const app = express();

// Serve static files (HTML, CSS, JS)
app.use(express.static('src/client'));

// Start server
app.listen(3000, () => {
  console.log('Paddle Panic running on port 3000');
});
```

---

### 3. Socket.io

| Aspect | Details |
|--------|---------|
| **What is it?** | A library for real-time, bidirectional communication between server and browsers |
| **Version** | 4.x |
| **Why we chose it** | Industry standard for WebSocket communication, handles reconnection automatically |
| **Install** | `npm install socket.io` |

**Beginner Explanation:**  
Normal websites work like sending letters: you send a request, wait for a response, done. But games need instant communication—like a phone call where both sides can talk anytime. Socket.io creates this "always-on" connection. When you press UP on your phone, Socket.io instantly tells the server, and the server instantly tells the host screen.

**Code Example:**
```javascript
// Server-side
const io = require('socket.io')(server);

io.on('connection', (socket) => {
  console.log('Player connected:', socket.id);
  
  socket.on('input', (data) => {
    // Player pressed a button
    handleInput(socket.id, data.direction);
  });
  
  socket.on('disconnect', () => {
    console.log('Player disconnected:', socket.id);
  });
});

// Client-side (phone)
const socket = io();

document.getElementById('upBtn').addEventListener('touchstart', () => {
  socket.emit('input', { direction: 'UP' });
});
```

---

## Client-Side Technologies (Host Screen)

### 4. HTML5 Canvas

| Aspect | Details |
|--------|---------|
| **What is it?** | A browser element for drawing 2D graphics using JavaScript |
| **Why we chose it** | High performance (60 FPS), full control over rendering, no plugins needed |
| **Browser Support** | All modern browsers |

**Beginner Explanation:**  
Think of Canvas as a digital painting canvas. Every frame (60 times per second), we clear it and redraw everything: the table, paddles, ball, scores. Because it's built into browsers, everyone can see it without installing anything.

**Code Example:**
```javascript
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function draw() {
  // Clear canvas
  ctx.fillStyle = '#1a5f2a'; // Green table
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw paddle
  ctx.fillStyle = '#ff0000'; // Red paddle
  ctx.fillRect(paddleX, paddleY, paddleWidth, paddleHeight);
  
  // Draw ball
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff'; // White ball
  ctx.fill();
  
  // Request next frame
  requestAnimationFrame(draw);
}

draw(); // Start the render loop
```

---

### 5. QRCode.js

| Aspect | Details |
|--------|---------|
| **What is it?** | A JavaScript library that generates QR code images |
| **Why we chose it** | Simple API, works client-side, no server processing needed |
| **Install** | Include via CDN or `npm install qrcode` |

**Beginner Explanation:**  
We need to show a QR code that players can scan to join the game. QRCode.js takes a URL (like `http://192.168.1.50:3000/controller`) and turns it into a scannable image. It runs in the browser, so we don't need to generate images on the server.

**Code Example:**
```javascript
// Generate QR code for the controller URL
const qrContainer = document.getElementById('qrcode');
new QRCode(qrContainer, {
  text: 'http://192.168.1.50:3000/controller',
  width: 256,
  height: 256
});
```

---

### 6. Web Audio API

| Aspect | Details |
|--------|---------|
| **What is it?** | A built-in browser API for playing and manipulating audio |
| **Why we chose it** | No external library needed, low latency, widely supported |
| **Browser Support** | All modern browsers |

**Beginner Explanation:**  
When the ball hits a paddle, we want a satisfying "pop" sound—and it needs to play instantly, not a second later. Web Audio API is built into browsers and designed for exactly this: playing sounds with minimal delay.

**Code Example:**
```javascript
class AudioManager {
  constructor() {
    this.sounds = {};
    this.muted = false;
  }
  
  async load(name, url) {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    const context = new AudioContext();
    this.sounds[name] = await context.decodeAudioData(buffer);
  }
  
  play(name) {
    if (this.muted) return;
    const context = new AudioContext();
    const source = context.createBufferSource();
    source.buffer = this.sounds[name];
    source.connect(context.destination);
    source.start();
  }
}
```

---

### 7. Web Speech API (Text-to-Speech)

| Aspect | Details |
|--------|---------|
| **What is it?** | A built-in browser API for converting text to spoken audio |
| **Why we chose it** | Can say any player name without pre-recording, no external service needed |
| **Browser Support** | All modern browsers (may vary slightly in voice quality) |

**Beginner Explanation:**  
When someone wins, we want an announcer to say their name: "Alice wins!" But we can't pre-record every possible name. Text-to-Speech solves this—the browser can speak any text we give it. It sounds a bit robotic, but it works for any name.

**Code Example:**
```javascript
function announceWinner(playerName) {
  const utterance = new SpeechSynthesisUtterance(`${playerName} wins!`);
  utterance.rate = 0.9; // Slightly slower for clarity
  utterance.pitch = 1.0;
  speechSynthesis.speak(utterance);
}
```

---

## Client-Side Technologies (Mobile Controller)

### 8. Touch Events

| Aspect | Details |
|--------|---------|
| **What is it?** | Browser events triggered by touchscreen interactions |
| **Why we chose it** | Native, fast, no library needed |
| **Key Events** | `touchstart`, `touchend`, `touchmove` |

**Beginner Explanation:**  
On phones, we don't have a mouse—we have fingers. Touch Events tell us when a finger touches the screen (`touchstart`) and when it lifts off (`touchend`). We use `touchstart` instead of `click` because it responds ~300ms faster.

**Code Example:**
```javascript
const upBtn = document.getElementById('upBtn');

upBtn.addEventListener('touchstart', (e) => {
  e.preventDefault(); // Prevent zooming
  socket.emit('input', { direction: 'UP' });
});

upBtn.addEventListener('touchend', (e) => {
  e.preventDefault();
  socket.emit('input', { direction: 'STOP' });
});
```

---

### 9. Vibration API

| Aspect | Details |
|--------|---------|
| **What is it?** | A browser API that makes the phone vibrate |
| **Why we chose it** | Native, simple, provides tactile feedback |
| **Browser Support** | Most Android browsers, limited iOS support |

**Beginner Explanation:**  
When you score a point, your phone buzzes briefly. When you lose a point, it buzzes differently. This "haptic feedback" lets you feel what's happening without looking at your phone.

**Code Example:**
```javascript
function vibrateOnScore() {
  if ('vibrate' in navigator) {
    navigator.vibrate(200); // Single 200ms buzz
  }
}

function vibrateOnLose() {
  if ('vibrate' in navigator) {
    navigator.vibrate([100, 50, 100]); // Two short pulses
  }
}
```

---

## Development Tools

### 10. npm (Node Package Manager)

| Aspect | Details |
|--------|---------|
| **What is it?** | The package manager for Node.js |
| **Why we use it** | Install dependencies, run scripts, manage project |

**Key Commands:**
```bash
npm init              # Create new project
npm install express   # Install a package
npm start            # Run the start script
```

---

## Project Structure

```
paddle-panic/
├── package.json           # Project config and dependencies
├── src/
│   ├── server/
│   │   ├── index.js       # Main server entry point
│   │   ├── GameEngine.js  # Game loop and physics
│   │   ├── RoboPaddleAI.js # AI opponent logic
│   │   └── StateMachine.js # Game state management
│   └── client/
│       ├── host/
│       │   ├── index.html # Host screen page
│       │   ├── styles.css # Host screen styling
│       │   ├── game.js    # Canvas rendering
│       │   └── audio.js   # Sound management
│       └── controller/
│           ├── index.html # Mobile controller page
│           ├── styles.css # Controller styling
│           └── controls.js # Touch input handling
└── assets/
    └── sounds/
        ├── hit.mp3        # Paddle hit sound
        ├── wall.mp3       # Wall bounce sound
        ├── score.mp3      # Point scored sound
        └── countdown.mp3  # Countdown beeps
```

---

## Dependencies Summary

### Production Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `express` | ^4.18.x | Web server framework |
| `socket.io` | ^4.6.x | Real-time communication |
| `qrcode` | ^1.5.x | QR code generation (optional server-side) |

### package.json Example

```json
{
  "name": "paddle-panic",
  "version": "1.0.0",
  "description": "Browser-based multiplayer paddle game",
  "main": "src/server/index.js",
  "scripts": {
    "start": "node src/server/index.js",
    "dev": "node --watch src/server/index.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "socket.io": "^4.6.1"
  }
}
```

---

## Browser Compatibility

| Browser | Role | Supported | Notes |
|---------|------|-----------|-------|
| Chrome (Desktop) | Host Screen | ✅ Full | Primary development target |
| Firefox (Desktop) | Host Screen | ✅ Full | |
| Safari (Desktop) | Host Screen | ✅ Full | |
| Edge (Desktop) | Host Screen | ✅ Full | |
| Chrome (Android) | Controller | ✅ Full | Primary mobile target |
| Safari (iOS) | Controller | ✅ Mostly | Vibration API not supported |
| Firefox (Android) | Controller | ✅ Full | |
| Samsung Internet | Controller | ✅ Full | |

---

## Network Requirements

| Requirement | Details |
|-------------|---------|
| **Connection Type** | Local WiFi network (same network for laptop and phones) |
| **Internet Required?** | No (after initial setup) |
| **Port** | 3000 (default, configurable) |
| **Protocol** | HTTP + WebSocket |

**Note:** Players must be on the same WiFi network as the laptop running the server. The game does not require internet access once running.

---

## Performance Targets

| Metric | Target | Why It Matters |
|--------|--------|----------------|
| Input Latency | < 50ms | Controls must feel instant |
| Frame Rate | 60 FPS | Smooth animation |
| Game Loop | 60 ticks/sec | Consistent physics |
| Memory | < 100MB | Run all day without slowdown |
| Startup Time | < 3 seconds | Quick to launch |
