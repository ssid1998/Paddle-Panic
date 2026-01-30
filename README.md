# 🏓 Paddle Panic

A browser-based Pong-style multiplayer game where players control paddles using their smartphones, while the game displays on a laptop or big screen.

![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![Socket.io](https://img.shields.io/badge/Socket.io-4.x-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 🎮 Features

- **Phone Controllers** - Players use their smartphones as game controllers
- **QR Code Join** - Scan to instantly connect (no app download needed)
- **Two Game Modes**
  - **PvP** (Player vs Player) - Challenge a friend
  - **PvC** (Player vs Computer) - Play against RoboPaddle AI
- **AI Difficulty Levels** - Easy, Medium, and Hard
- **Real-time Gameplay** - Powered by WebSockets (Socket.io)
- **Sound Effects** - Synthesized audio using Web Audio API
- **Auto-Reset** - Game automatically returns to lobby after each match

---

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** installed ([Download](https://nodejs.org/))
- A laptop/computer for the game display
- One or two smartphones on the same WiFi network

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/Paddle-Panic.git
cd Paddle-Panic

# Install dependencies
cd results
npm install
```

### Running the Game

**Mac/Linux:**
```bash
cd results
./start.sh
```

**Windows:**
```cmd
cd results
start.bat
```

The game will start at **http://localhost:3000**

### Stopping the Game

**Mac/Linux:**
```bash
./stop.sh
```

**Windows:**
```cmd
stop.bat
```

---

## 🎯 How to Play

1. **Open the Host Screen** - Navigate to `http://localhost:3000` on your laptop/TV
2. **Scan the QR Code** - Use your phone's camera to scan and connect
3. **Enter Your Name** - Type your player name (max 12 characters)
4. **Choose Game Mode**
   - **PvP**: Wait for a second player to join
   - **PvC**: Select AI difficulty (Easy/Medium/Hard)
5. **Press Ready** - Both players must be ready to start
6. **Play!** - Slide your finger up/down on your phone to move the paddle
7. **First to 11 wins!**

---

## 🏗️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Node.js** | Server runtime |
| **Express** | HTTP server & static files |
| **Socket.io** | Real-time WebSocket communication |
| **HTML5 Canvas** | Game rendering |
| **Web Audio API** | Sound effects (no audio files needed) |
| **QRCode.js** | QR code generation for easy joining |

---

## 📁 Project Structure

```
Paddle-Panic/
├── results/                    # Game application
│   ├── src/
│   │   ├── server/
│   │   │   ├── index.js        # Express + Socket.io server
│   │   │   ├── GameEngine.js   # Game loop, physics, scoring
│   │   │   └── RoboPaddleAI.js # AI opponent logic
│   │   └── client/
│   │       ├── host/           # Laptop/TV display
│   │       │   ├── index.html
│   │       │   ├── game.js
│   │       │   └── styles.css
│   │       └── controller/     # Phone controller
│   │           ├── index.html
│   │           ├── controls.js
│   │           └── styles.css
│   ├── package.json
│   ├── start.sh / start.bat    # Start scripts
│   └── stop.sh / stop.bat      # Stop scripts
└── agile/                      # Development artifacts
    └── artifacts/              # Sprint documentation
```

---

## 🎵 Sound Effects

All sounds are synthesized in real-time using the Web Audio API:

| Sound | Trigger |
|-------|---------|
| **Paddle Hit** | Ball hits a paddle |
| **Wall Bounce** | Ball hits top/bottom wall |
| **Score** | Point scored (C-E-G arpeggio) |
| **Countdown** | 3, 2, 1 before game starts |
| **GO!** | Game begins |

Use the 🔊 button in the top-right corner to mute/unmute.

---

## 🤖 RoboPaddle AI

The AI opponent uses predictive ball tracking:

| Difficulty | Reaction Speed | Prediction Accuracy | Error Range |
|------------|----------------|---------------------|-------------|
| **Easy** | Slow | Basic | ±60px |
| **Medium** | Medium | Good | ±30px |
| **Hard** | Fast | Excellent | ±10px |

---

## 🛠️ Development

### Running in Development Mode

```bash
cd results
node src/server/index.js
```

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 3000 | Server port |

---

## 📋 Game Rules

- **Winning Score**: First player to **11 points** wins
- **Ball Speed**: Increases slightly with each paddle hit (max 20% boost)
- **Serve**: Ball launches toward the last player who scored (or random at start)
- **Countdown**: 3-second countdown before each serve
- **Disconnect**: In PvP mode, disconnected players have 5 seconds to reconnect

---

## 🔮 Future Enhancements (Ideas)

- [ ] Attract mode (demo game when idle)
- [ ] Session leaderboard
- [ ] Tournament bracket mode
- [ ] Power-ups
- [ ] Particle effects and animations
- [ ] Multiple game tables (lobbies)

---

## 📄 License

MIT License - feel free to use, modify, and distribute.

---

## 🙏 Acknowledgments

Built with the Agile AI Agent Framework for rapid game development.

---

**Have fun playing Paddle Panic! 🏓**
