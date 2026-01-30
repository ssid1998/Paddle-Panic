# Sprint Report: Sprint 1.1

## Sprint Overview

| Field | Value |
|-------|-------|
| **Sprint Number** | 1.1 |
| **Sprint Name** | Technical Foundation (Walking Skeleton) |
| **Date Completed** | 2026-01-30 |
| **Status** | Completed |

---

## Sprint Goal (Recap)

> Build the **technical foundation** of Paddle Panic—the "walking skeleton" that proves our architecture works. Establish real-time communication between a mobile phone and the host screen. If we can make a phone move a paddle on the screen, we've proven the core technology works.

---

## Results: What Was Achieved

We successfully built the foundation of Paddle Panic! The game server is running, the host screen displays a game table with a paddle, and you can control the paddle from your phone in real-time.

### Features Implemented

| Feature | Description | Status |
|---------|-------------|--------|
| Game Server | Node.js server that powers the game | Working |
| Host Screen | Browser page showing the green table and red paddle | Working |
| Mobile Controller | Phone page with UP and DOWN buttons | Working |
| Real-Time Control | Pressing buttons on phone moves paddle instantly | Working |
| Helper Scripts | Easy start/stop scripts for running the game | Working |

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
   - You should see the game title, instructions, and a green table with a red paddle

4. **Open the Controller on Your Phone:**
   - On your phone, open a browser
   - Go to the IP address shown in the terminal (e.g., `http://192.168.x.x:3000/controller`)
   - You should see two big buttons: UP and DOWN

5. **Test the Controls:**
   - Press UP on your phone → Watch the paddle move up on the laptop
   - Press DOWN on your phone → Watch the paddle move down on the laptop

6. **Stop the application:**
   - Run `./stop.sh` (Mac) or `stop.bat` (Windows)

### Expected Behavior

| Action | Expected Result |
|--------|-----------------|
| Run start.sh | Server starts, shows URL for host and controller |
| Open localhost:3000 | See "PADDLE PANIC" title, green table, red paddle |
| Open /controller on phone | See two large UP/DOWN buttons |
| Press UP button | Paddle moves up on host screen instantly |
| Press DOWN button | Paddle moves down on host screen instantly |
| Run stop.sh | Server stops |

### Troubleshooting

| Problem | Solution |
|---------|----------|
| "Port 3000 already in use" | Run `./stop.sh` first, then `./start.sh` again |
| Phone can't connect | Make sure phone and laptop are on the same WiFi network |
| Paddle doesn't move | Check that both pages show "Connected" in browser console (F12) |
| Blank white screen | Refresh the page; if still blank, restart the server |

---

## Changed Files

| File | Description |
|------|-------------|
| `results/package.json` | Node.js project configuration with dependencies |
| `results/src/server/index.js` | Express + Socket.io server handling connections and input |
| `results/src/client/host/index.html` | Host screen HTML structure |
| `results/src/client/host/styles.css` | Host screen styling (dark background, canvas) |
| `results/src/client/host/game.js` | Canvas rendering and Socket.io client for host |
| `results/src/client/controller/index.html` | Mobile controller HTML structure |
| `results/src/client/controller/styles.css` | Mobile controller styling (big buttons) |
| `results/src/client/controller/controls.js` | Touch input handling and Socket.io events |
| `results/start.sh` | Mac/Linux start script |
| `results/start.bat` | Windows start script |
| `results/stop.sh` | Mac/Linux stop script |
| `results/stop.bat` | Windows stop script |

---

## Lessons Learned

1. **Path Resolution:** HTML files served from routes like `/` need absolute paths for CSS/JS (e.g., `/host/styles.css` not `styles.css`).

2. **UI Placement:** Game titles and UI elements should be in HTML above the canvas, not drawn on the canvas itself, for cleaner separation.

3. **Touch Events:** Using `touchstart` instead of `click` provides faster response on mobile devices.

4. **Port Management:** The start script should always call the stop script first to prevent "port already in use" errors.

---

## Outlook: Next Sprint

**Sprint 1.2: Core Gameplay** will add:
- Ball that bounces around the table
- Second paddle (right side) for Player 2
- Collision detection (ball bounces off paddles and walls)
- Basic scoring system

This will transform our "moving paddle demo" into an actual playable game!
