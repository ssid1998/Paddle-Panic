# Paddle Panic

A browser-based multiplayer Pong game where players control paddles using their smartphones!

## How It Works

1. **Host Screen** (Laptop/TV): Displays the game table, paddles, ball, and scores
2. **Controller** (Phone): Players use their phones as game controllers with UP/DOWN buttons

## Quick Start

### Prerequisites
- **Node.js** (version 14 or higher)
- Phone and computer on the **same WiFi network**

### Start the Game

**Mac/Linux:**
```bash
./start.sh
```

**Windows:**
```
start.bat
```

### Stop the Game

**Mac/Linux:**
```bash
./stop.sh
```

**Windows:**
```
stop.bat
```

## How to Play

1. **Start the server** using the commands above
2. **Open the Host Screen** on your laptop: http://localhost:3000
3. **Scan the QR code** with your phone (or open the controller URL shown in terminal)
4. **Enter your name** (up to 12 characters)
5. **Choose game mode:**
   - **vs Player** - Play against a friend (they scan the QR code too)
   - **vs RoboPaddle** - Play against AI (select Easy/Medium/Hard)
6. **Press READY** when you're prepared
7. **Play!** Use the UP/DOWN buttons on your phone to move your paddle

## Game Rules

- First player to **11 points** wins
- Ball speeds up during rallies (5% faster per hit, max 2x speed)
- Serve alternates after each point
- 3-2-1 countdown between points

## Player Colors

| Mode | Player 1 | Player 2 |
|------|----------|----------|
| **PvP** | Red | Blue |
| **vs RoboPaddle** | Random (Red or Blue) | Black |

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Port 3000 already in use" | Run `./stop.sh` first, then `./start.sh` again |
| Phone can't connect | Make sure phone and laptop are on the same WiFi network |
| QR code won't scan | Try typing the URL manually (shown in terminal) |

## Technical Details

- **Server:** Node.js + Express + Socket.io
- **Frontend:** HTML5 Canvas + Vanilla JavaScript
- **Architecture:** Authoritative server model (60 FPS game loop)

---

Built with Paddle Panic Agile Framework
