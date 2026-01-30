# Sprint Report: Sprint 1.4

## 📋 Sprint Overview

| Field | Value |
|-------|-------|
| **Sprint Number** | 1.4 |
| **Sprint Name** | AI Opponent (RoboPaddle) |
| **Date Completed** | 2026-01-30 |
| **Status** | ✅ Completed |
| **Git Commit** | `25bf66e` - "Sprint 1.4: RoboPaddle AI Opponent" |

---

## 🎯 Sprint Goal (Recap)

> **Goal:** Make RoboPaddle actually play! Currently, when you select "vs RoboPaddle", the AI paddle doesn't move. After this sprint, RoboPaddle will track the ball, predict where it's going, and try to intercept it.

---

## ✅ Results: What Was Achieved

We have successfully built an **intelligent AI opponent** that can play Pong against human players. RoboPaddle now actively tracks the ball, predicts where it will arrive, and moves to intercept it.

### Features Implemented

| Feature | Description | Status |
|---------|-------------|--------|
| **Ball Prediction** | AI calculates where ball will arrive, accounting for wall bounces | ✅ Working |
| **Smooth Movement** | Paddle moves at controlled speed, no teleporting or jitter | ✅ Working |
| **Reaction Delay** | AI waits before reacting (Easy: 300ms, Medium: 150ms, Hard: 50ms) | ✅ Working |
| **Intentional Misses** | AI sometimes aims wrong to be beatable (Easy: 30%, Medium: 10%, Hard: 2%) | ✅ Working |
| **Difficulty Levels** | Three distinct difficulty settings that feel different | ✅ Working |
| **Black Paddle Color** | RoboPaddle remains black (#1a1a1a) as designed | ✅ Working |

### Difficulty Configuration

| Parameter | Easy | Medium | Hard |
|-----------|------|--------|------|
| Reaction Delay | 300ms | 150ms | 50ms |
| Miss Chance | 30% | 10% | 2% |
| Max Speed | 8 | 12 | 15 |
| Prediction Error | 50px | 25px | 5px |

### How It Works (Technical Summary)

1. **RoboPaddleAI (`src/server/RoboPaddleAI.js`):**
   - Created when player selects "vs RoboPaddle" mode
   - Receives difficulty setting from lobby selection
   - `update()` method called 60 times per second
   - Predicts ball trajectory with wall bounce calculations
   - Moves paddle smoothly toward predicted position

2. **GameEngine Integration (`src/server/GameEngine.js`):**
   - New `setGameMode()` method configures AI
   - Game tick calls AI update when in PvC mode
   - AI directly controls paddle 2 position

3. **Server Integration (`src/server/index.js`):**
   - Passes game mode and difficulty to GameEngine
   - AI created automatically when game starts

---

## 🧪 How to Test

### Prerequisites
- **Node.js** (v14+) must be installed. Verify with: `node -v`

### Step-by-Step Instructions

1. **Navigate to the results folder:**
   ```bash
   cd /Users/sid/Documents/GitHub/Paddle-Panic/results
   ```

2. **Start the server:**
   - **Mac/Linux:** Run `./start.sh` in Terminal
   - **Windows:** Double-click `start.bat`

3. **Open the Host Screen:**
   - Open browser: `http://localhost:3000`
   - You'll see the Paddle Panic lobby with a QR code

4. **Join with Phone:**
   - Scan the QR code with your phone
   - Or open the controller URL on your phone

5. **Set Up Game:**
   - Enter your name (max 12 characters)
   - Select **"vs RoboPaddle"**
   - Choose difficulty: **Easy** (recommended first), Medium, or Hard
   - Press **READY**

6. **Play!**
   - Use UP/DOWN buttons on your phone
   - Watch RoboPaddle (black paddle on right) move to intercept the ball
   - First to 11 points wins

7. **Stop the server:**
   - Run `./stop.sh` or `stop.bat`

### Expected Behavior

| Action | Expected Result |
|--------|-----------------|
| Select "vs RoboPaddle" | AI mode enabled, can choose difficulty |
| Choose Easy difficulty | RoboPaddle reacts slowly, misses often |
| Choose Medium difficulty | RoboPaddle provides fair challenge |
| Choose Hard difficulty | RoboPaddle is very difficult to beat |
| Ball approaches RoboPaddle | Black paddle moves to intercept |
| Ball bounces off walls | AI predicts trajectory correctly |

### Troubleshooting

| Problem | Solution |
|---------|----------|
| RoboPaddle doesn't move | Make sure you selected "vs RoboPaddle", not PvP mode |
| Server won't start | Run `./stop.sh` first to kill any existing process |
| Phone can't connect | Ensure phone and laptop are on same WiFi network |

---

## 📁 Changed Files

| File | Description |
|------|-------------|
| `results/src/server/RoboPaddleAI.js` | **NEW** - AI logic with prediction, movement, difficulty settings |
| `results/src/server/GameEngine.js` | Added AI integration, `setGameMode()` method |
| `results/src/server/index.js` | Pass game mode and difficulty to GameEngine |
| `agile/artifacts/02_sprint/sprint_1.4/SPRINT_BACKLOG.md` | Updated with completion status |

---

## 💡 Lessons Learned

1. **Ball Prediction with Bounces:** Calculating where a bouncing ball will arrive requires careful handling of wall reflections. We use a segment-based approach to track which direction the ball is traveling after each bounce.

2. **Reaction Delay Creates Challenge:** Simply making the AI slower wasn't enough - adding a delay before the AI starts tracking a new ball direction creates a more human-like opponent.

3. **Intentional Mistakes Matter:** Even a slow AI that always aims correctly feels unfair. Adding random miss chances (aim at wrong position) makes the game feel beatable and fun.

4. **Dead Zone Prevents Jitter:** Without a minimum distance threshold, the paddle oscillates rapidly around the target. A 5-pixel dead zone makes movement look smooth.

---

## 🔮 Outlook: Next Sprint (Sprint 1.5)

**Sprint 1.5: Match End & State Management**

Now that both PvP and PvC modes are fully playable, we will add:

- **Winner Announcement:** Display winner name prominently, potentially with voice announcement
- **Rematch Option:** "Rematch" button on phone after game ends
- **Leave Match:** "Leave" button to exit and let someone else play
- **Player Stays Flow:** If opponent leaves, remaining player can choose new mode
- **Disconnect Handling:** 5-second grace period for brief connection issues

The game is now fully playable - Sprint 1.5 focuses on **polish and flow** between matches.
