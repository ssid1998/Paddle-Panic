# Sprint Report: Sprint 1.3

## Sprint Overview

| Field | Value |
|-------|-------|
| **Sprint Number** | 1.3 |
| **Sprint Name** | Lobby & Entry Experience |
| **Date Completed** | 2026-01-30 |
| **Status** | Completed |

---

## Sprint Goal (Recap)

> **Goal:** Make joining the game effortless! Players scan a QR code, enter their name, choose a game mode, and start playing - no URL typing required.

---

## Results: What Was Achieved

We have successfully built a complete **lobby and entry system** for Paddle Panic. Players can now join the game simply by scanning a QR code with their phone camera!

### Features Implemented

| Feature | Description | Status |
|---------|-------------|--------|
| **QR Code Display** | Large, scannable QR code on host screen | Working |
| **Dynamic IP Detection** | Server auto-detects local IP for QR code URL | Working |
| **Name Entry** | Players enter their name (max 12 characters) | Working |
| **Mode Selection** | Choose between PvP or vs RoboPaddle | Working |
| **Difficulty Selection** | Easy/Medium/Hard for AI mode | Working |
| **Ready Button** | Players confirm they're ready to play | Working |
| **Player Colors** | PvP: Red vs Blue. PvC: Random color vs Black | Working |
| **Lobby UI** | Shows player names, colors, and ready status | Working |
| **QR Visibility Management** | QR hides/shows based on game state | Working |
| **Multi-Screen Controller** | 9 different screens for complete flow | Working |

### Color System

| Mode | Player 1 | Player 2 |
|------|----------|----------|
| **Player vs Player** | Red | Blue |
| **Player vs RoboPaddle** | Random (Red or Blue) | Black |

---

## How to Test

### Prerequisites
- **Node.js** (version 14 or higher)
- Phone and computer on the **same WiFi network**

### Step-by-Step Instructions

1. **Open Terminal** and navigate to the `results/` folder.

2. **Start the application:**
   - **Mac/Linux:** Run `./start.sh`
   - **Windows:** Double-click `start.bat`

3. **Open the Host Screen:**
   - On your laptop/computer, open a browser
   - Go to: `http://localhost:3000`
   - You should see the "PADDLE PANIC" title with a QR code

4. **Join as Player 1:**
   - Scan the QR code with your phone camera
   - OR open the controller URL shown in the terminal
   - Enter your name and press "Continue"
   - Choose game mode (vs Player or vs RoboPaddle)
   - If vs RoboPaddle: Select difficulty (Easy/Medium/Hard)
   - Press the big "READY!" button

5. **Join as Player 2 (PvP mode only):**
   - Have a friend scan the QR code that reappears
   - They enter their name and press "READY!"

6. **Play the Game:**
   - Game starts with 3-2-1 countdown
   - Use UP/DOWN buttons to move your paddle
   - First to 11 points wins!

7. **Stop the application:**
   - Run `./stop.sh` (Mac) or `stop.bat` (Windows)

### Expected Behavior

| Action | Expected Result |
|--------|-----------------|
| Open host screen | QR code and "PADDLE PANIC" title displayed |
| Scan QR code | Controller opens, shows "Enter Your Name" |
| Enter name + Continue | Mode selection screen appears |
| Select "vs Player" | QR code reappears on host for Player 2 |
| Select "vs RoboPaddle" | Difficulty selection (Easy/Medium/Hard) |
| Select difficulty | Ready button screen appears |
| Press READY | Button changes to "WAITING...", host shows "READY!" |
| All players ready | 3-2-1 countdown, game starts |

### Troubleshooting

| Problem | Solution |
|---------|----------|
| QR code not showing | Check browser console for errors. Refresh the page. |
| Phone can't connect | Make sure phone and laptop are on the same WiFi network |
| "Port 3000 already in use" | Run `./stop.sh` first, then `./start.sh` again |
| QR code won't scan | Try typing the URL manually (shown in terminal) |

---

## Changed Files

| File | Description |
|------|-------------|
| `results/src/server/index.js` | Added lobby state management, player tracking, mode/difficulty handling |
| `results/src/server/GameEngine.js` | Added `setPaddleColor()` method for dynamic colors |
| `results/src/client/host/index.html` | Added lobby screen with QR code section and player slots |
| `results/src/client/host/game.js` | Added QR generation, lobby UI updates, view switching |
| `results/src/client/host/styles.css` | Added lobby screen styling, player indicators |
| `results/src/client/controller/index.html` | Complete rewrite with 9 different screens |
| `results/src/client/controller/controls.js` | Added multi-screen flow, name/mode/difficulty handlers |
| `results/src/client/controller/styles.css` | Added styles for all new screens and buttons |
| `results/README.md` | **NEW** - User documentation for the game |
| `agile/artifacts/02_sprint/sprint_1.3/SPRINT_BACKLOG.md` | Sprint planning and task tracking |

---

## Lessons Learned

1. **QR Code Libraries:** The QRCode.js library works well via CDN. Using the callback-based API (`QRCode.toCanvas(canvas, url, options, callback)`) is more reliable than the promise-based version.

2. **Multi-Screen Controller:** Managing 9 different screens in a single-page app requires careful state management. Using a simple `showScreen()` function with CSS classes keeps it clean.

3. **Lobby State Machine:** A proper state machine (WAITING_FOR_P1 → P1_ENTERING_NAME → P1_SELECTING_MODE → etc.) prevents bugs and makes the flow predictable.

4. **Dynamic Colors:** Allowing random color assignment in PvC mode while keeping RoboPaddle black required passing colors through both the lobby state and game engine.

---

## Outlook: Next Sprint

**Sprint 1.4 (Phase 4): AI Opponent (RoboPaddle)**

Now that the lobby is complete, we need to make RoboPaddle actually play! Next sprint will add:

- **AI Behavior Engine**: RoboPaddle tracks and intercepts the ball
- **Difficulty Levels**: 
  - Easy: Slow reaction, often misses
  - Medium: Moderate speed, occasional misses
  - Hard: Fast reaction, rarely misses
- **Ball Prediction**: AI predicts where the ball will be, not just follows it

This will make the single-player mode fully playable!
