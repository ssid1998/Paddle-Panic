# Sprint Report: Sprint 1.1

## 📋 Sprint Overview

| Field | Value |
|-------|-------|
| **Sprint Number** | 1.1 |
| **Sprint Name** | The Connectivity Skeleton |
| **Date Completed** | 2025-12-20 |
| **Status** | ✅ Completed |
| **Git Commit** | `a1b2c3d` - "Sprint 1.1: Basic Connectivity & Game Loop" |

---

## 🎯 Sprint Goal (Recap)

> **Goal:** Prove that the network stack works. Verify that a smartphone can control a pixel on the big screen with minimal latency before we write any game logic.

---

## ✅ Results: What Was Achieved

We have successfully built the **foundation** for the multiplayer game. All core connectivity features are working.

### Features Implemented

| Feature | Description | Status |
|---------|-------------|--------|
| **Node.js Server** | Express + Socket.io server running on port 3000 | ✅ Working |
| **Spectator View** | HTML5 Canvas (800x600) displaying connected players | ✅ Working |
| **Mobile Controller** | Touch-friendly D-Pad with 4 directional buttons | ✅ Working |
| **Real-Time Sync** | Player movements are broadcast at 30 FPS | ✅ Working |
| **Helper Scripts** | `start.sh`, `stop.sh`, `start.bat`, `stop.bat` | ✅ Working |

### How It Works (Technical Summary)

1. **Server (`src/server/index.js`):**
   - Listens on port 3000.
   - Maintains a `players` object with each connected socket's position.
   - Broadcasts `stateUpdate` events 30 times per second.

2. **Spectator (`src/client/public/index.html`):**
   - Connects to the server via Socket.io.
   - Renders all players as yellow squares on a black canvas.

3. **Controller (`src/client/public/controller.html`):**
   - Sends `input` events (UP, DOWN, LEFT, RIGHT) on button touch.
   - Uses `touchstart` to avoid the 300ms click delay on mobile.

---

## 🧪 How to Test

### Prerequisites
- **Node.js** must be installed. Verify with: `node -v`
- **Git** must be installed. Verify with: `git --version`

### Step-by-Step Instructions

1. **Open the `results/` folder** in your file explorer.

2. **Start the server:**
   - **Mac/Linux:** Double-click `start.sh` (or run `./start.sh` in Terminal).
   - **Windows:** Double-click `start.bat`.
   - Wait until you see: `Server running at http://localhost:3000`

3. **Open the Spectator View:**
   - Open your browser and go to: `http://localhost:3000`
   - You should see a black screen (the game canvas).

4. **Open the Controller:**
   - On your phone (same Wi-Fi network) or another browser tab, go to: `http://localhost:3000/controller.html`
   - You should see 4 large directional buttons.

5. **Test the Connection:**
   - Press the arrow buttons on the Controller.
   - Watch the yellow square move on the Spectator screen.

6. **Stop the server:**
   - Close the terminal, OR
   - Run `stop.sh` / `stop.bat`.

### Expected Behavior

| Action | Expected Result |
|--------|-----------------|
| Open `localhost:3000` | Black canvas appears |
| Open `localhost:3000/controller.html` | D-Pad buttons appear |
| Press UP button | Yellow square moves up |
| Press DOWN button | Yellow square moves down |
| Open second controller tab | Second yellow square appears |

### Troubleshooting

| Problem | Solution |
|---------|----------|
| "EADDRINUSE: address already in use" | Run `stop.sh` / `stop.bat` first, then try again. |
| "Cannot find module 'express'" | Run `npm install` in the `results/` folder. |
| Controller buttons don't respond | Make sure you're using `http://`, not `https://`. |
| Phone can't connect | Ensure phone and computer are on the same Wi-Fi network. Use your computer's local IP (e.g., `192.168.1.x`) instead of `localhost`. |

---

## 📁 Changed Files

| File | Description |
|------|-------------|
| `results/package.json` | Project configuration with dependencies |
| `results/src/server/index.js` | Main server logic (Express, Socket.io, Game Loop) |
| `results/src/client/public/index.html` | Spectator page (Canvas) |
| `results/src/client/public/controller.html` | Mobile controller (D-Pad) |
| `results/src/client/public/js/spectator.js` | Client-side rendering logic |
| `results/start.sh` | Mac/Linux launcher script |
| `results/start.bat` | Windows launcher script |
| `results/stop.sh` | Mac/Linux stop script |
| `results/stop.bat` | Windows stop script |

---

## 💡 Lessons Learned

1. **Mobile Touch Events:** Using `touchstart` instead of `click` eliminates the 300ms delay on mobile browsers. This is critical for a responsive game.

2. **Port Conflicts:** Students often forget to stop the server before restarting. The auto-cleanup in `start.sh` (calling `stop.sh` first) prevents frustrating "port in use" errors.

3. **Same Network Requirement:** For phone-to-laptop communication, both devices must be on the same Wi-Fi network. This is a common source of confusion.

---

## 🔮 Outlook: Next Sprint (Sprint 1.2)

**Sprint 1.2: The Core Game**

Now that connectivity is proven, we will implement the actual game mechanics:

- **Grid & Collision:** A 2D map with walls that block movement.
- **Role Assignment:** First player becomes Pacman, others become Ghosts.
- **Game Over Logic:** Trigger "Game Over" when a Ghost catches Pacman.

The foundation we built in Sprint 1.1 will be extended, not replaced. The server structure and client setup remain the same.
