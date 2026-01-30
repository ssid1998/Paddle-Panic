# Sprint Report: Sprint 1.2

## Sprint Overview

| Field | Value |
|-------|-------|
| **Sprint Number** | 1.2 |
| **Sprint Name** | Core Gameplay (Ball, Paddles, Scoring) |
| **Date Completed** | 2026-01-30 |
| **Status** | ✅ Completed |

---

## Sprint Goal (Recap)

> Build the **core gameplay mechanics** of Paddle Panic. Transform the "moving paddle demo" into an actual playable Pong game with a ball that bounces, two paddles, collision detection, and a scoring system.

---

## Results: What Was Achieved

We successfully transformed Paddle Panic from a simple paddle demo into a **fully playable Pong game**! Two players can now compete against each other, with all the essential gameplay mechanics working.

### Features Implemented

| Feature | Description | Status |
|---------|-------------|--------|
| Authoritative Game Loop | Server runs at 60 FPS, controls all game logic | ✅ Working |
| Ball Movement | Ball moves across the table smoothly | ✅ Working |
| Wall Bouncing | Ball bounces off top and bottom walls | ✅ Working |
| Two Paddles | Red paddle (left) and Blue paddle (right) | ✅ Working |
| Paddle Collision | Ball bounces off paddles with angle variation | ✅ Working |
| Scoring System | Points tracked and displayed (first to 11) | ✅ Working |
| Ball Speed Increase | Ball gets 5% faster with each paddle hit | ✅ Working |
| Random First Serve | Ball direction randomized at game start | ✅ Working |
| Alternating Serve | Serve alternates after each point | ✅ Working |
| Countdown | 3-2-1 countdown between points | ✅ Working |
| Win Condition | "Player X Wins!" displayed at 11 points | ✅ Working |

---

## How to Test

### Prerequisites
- **Node.js** (version 14 or higher) must be installed
- Your phone and computer must be on the **same WiFi network**

### Step-by-Step Instructions

1. **Open Terminal** and navigate to the `results/` folder.

2. **Start the application:**
   - **Mac/Linux:** Run `./start.sh`
   - **Windows:** Double-click `start.bat`

3. **Open the Host Screen:**
   - On your laptop/computer, open a browser
   - Go to: `http://localhost:3000`
   - You should see "Waiting for players..." with the game table

4. **Connect Player 1:**
   - On your phone (or another browser tab), go to the controller URL shown in Terminal
   - Example: `http://192.168.x.x:3000/controller`
   - The game will start with a 3-2-1 countdown!

5. **Connect Player 2 (optional):**
   - On a second phone, open the same controller URL
   - Player 2 will control the blue paddle on the right

6. **Play the Game:**
   - Use UP/DOWN buttons to move your paddle
   - Try to hit the ball and make your opponent miss
   - First to 11 points wins!

7. **Stop the application:**
   - Run `./stop.sh` (Mac) or `stop.bat` (Windows)

### Expected Behavior

| Action | Expected Result |
|--------|-----------------|
| Connect controller | 3-2-1 countdown starts, ball launches |
| Hit ball with paddle | Ball bounces at angle, speeds up slightly |
| Ball passes left paddle | Player 2 scores, countdown restarts |
| Ball passes right paddle | Player 1 scores, countdown restarts |
| Score reaches 11 | "Player X Wins!" displayed |

### Troubleshooting

| Problem | Solution |
|---------|----------|
| "Port 3000 already in use" | Run `./stop.sh` first, then `./start.sh` again |
| Phone can't connect | Make sure phone and laptop are on the same WiFi network |
| Ball moves but no paddle control | Make sure you joined as a player (check controller shows "Player 1" or "Player 2") |
| Only one paddle moves | Need a second phone/tab for Player 2, or play against yourself! |

---

## Changed Files

| File | Description |
|------|-------------|
| `results/src/server/GameEngine.js` | **NEW** - Authoritative game engine with 60 FPS loop |
| `results/src/server/index.js` | Updated to use GameEngine, handle player assignment |
| `results/src/client/host/game.js` | Updated to render ball, two paddles, scores, countdown, game over |
| `results/src/client/controller/index.html` | Added player info display |
| `results/src/client/controller/styles.css` | Updated status bar styling |
| `results/src/client/controller/controls.js` | Added player assignment, dynamic button colors |

---

## Lessons Learned

1. **Authoritative Server:** Having the server control all game logic prevents cheating and keeps clients synchronized. Clients only send input; server calculates everything.

2. **Angle Variation:** Making the ball bounce at different angles based on where it hits the paddle makes the game much more interesting and skill-based.

3. **Speed Increase:** The gradual speed increase (5% per hit, max 2x) creates tension during long rallies without making the game unfair.

4. **State Machine:** Using game phases (IDLE, COUNTDOWN, PLAYING, GAME_OVER) keeps the code organized and prevents bugs like scoring during countdown.

---

## Outlook: Next Sprint

**Sprint 1.3 (Phase 3): Lobby & Entry Experience** will add:
- QR code generation for easy phone joining
- Player name entry
- Mode selection (Player vs Player or Player vs RoboPaddle)
- AI difficulty selection (Easy/Medium/Hard)
- Ready button and game start flow

This will make it easy for anyone to join and play without typing URLs!
