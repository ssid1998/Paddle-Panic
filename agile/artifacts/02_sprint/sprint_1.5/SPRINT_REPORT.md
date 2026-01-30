# Sprint Report: Sprint 1.5

## Sprint Overview

| Field | Value |
|-------|-------|
| **Sprint Number** | 1.5 |
| **Sprint Name** | Match End & State Management (Simplified) |
| **Date Completed** | 2026-01-30 |
| **Status** | Completed |
| **Git Commit** | `1915db6` - "Sprint 1.5: Match End & State Management (Simplified)" |

---

## Sprint Goal (Recap)

> Add smooth game ending and lobby reset flow. When a game ends, players see the winner, get thanked for playing, and their controller closes automatically. The host screen resets to show the QR code for new players to join.

---

## Results: What Was Achieved

This sprint implemented the complete end-of-game flow. When someone wins (first to 11 points), both the host screen and player controllers show the result, then everything resets automatically so new players can join.

### Features Implemented

| Feature | Description | Status |
|---------|-------------|--------|
| Winner Announcement | Big display on host screen showing winner name with trophy and colored banner | Working |
| Controller Game Over | Phone shows "You Win!" or "You Lose" with final score | Working |
| Thanks Message | Phone shows "Thanks for playing!" then auto-closes | Working |
| Auto-Reset Lobby | After 5 seconds, lobby resets and QR code appears for new players | Working |
| Disconnect Grace Period | In PvP, if someone disconnects, 5-second countdown before forfeit | Working |

### Scope Changes

The following features were originally planned but removed to simplify the flow:
- Rematch button (players scan QR again instead)
- Leave button (not needed - game ends automatically)
- Voice announcement (browser compatibility issues)
- "Join Again" button (auto-close is cleaner)

---

## How to Test

### Prerequisites
- Node.js installed on your computer
- Phone and laptop on same WiFi network

### Step-by-Step Instructions

1. **Open the `results/` folder** in your file explorer.

2. **Start the application:**
   - **Mac:** Double-click `start.sh` (or run `./start.sh` in Terminal)
   - **Windows:** Double-click `start.bat`

3. **On your laptop:** Open http://localhost:3000

4. **On your phone:** Scan the QR code shown on the laptop

5. **Play a game:**
   - Enter your name
   - Choose PvC (vs AI) for solo testing
   - Select difficulty and press Ready
   - Play until someone reaches 11 points

6. **Watch the end-game flow:**
   - Host shows winner with trophy
   - Phone shows win/lose, then "Thanks for playing!"
   - Phone tab should close automatically
   - Host resets to show QR code

7. **Stop the application:** Run `stop.sh` / `stop.bat`

### Expected Behavior

| Action | Expected Result |
|--------|-----------------|
| Game ends (11 points) | Winner displayed prominently on host screen |
| Wait 3 seconds | Controller shows "Thanks for playing!" |
| Wait 3 more seconds | Controller tab closes (or shows message if browser blocks) |
| Wait 5 seconds total | Host shows QR code, ready for new players |

### Troubleshooting

| Problem | Solution |
|---------|----------|
| Tab doesn't close | Some browsers block auto-close for security. Just manually close the tab. |
| Port 3000 in use | Run `stop.sh` first, or restart your computer |

---

## Changed Files

| File | Description |
|------|-------------|
| `results/src/server/index.js` | Added auto-reset after game over, removed rematch handlers |
| `results/src/server/GameEngine.js` | Game over callback, winning score set to 11 |
| `results/src/client/host/game.js` | Updated game over message, removed voice code |
| `results/src/client/controller/index.html` | Simplified thanks screen (no buttons) |
| `results/src/client/controller/controls.js` | Added gameEnded handler with auto-close |

---

## Lessons Learned

1. **Simpler is better:** The original rematch flow had complex state management. Auto-reset is cleaner and less error-prone.

2. **Browser security:** `window.close()` is blocked by some browsers unless the window was opened by JavaScript. The fallback (just showing the message) works fine.

3. **Voice API unreliable:** Web Speech API has inconsistent browser support. Removed rather than maintaining buggy feature.

---

## Outlook: Next Sprint

Sprint 1.5 completes the core gameplay loop. The game is now fully playable from start to finish with proper ending and reset. 

Potential future enhancements:
- Attract mode (demo animation when no players)
- Sound effects for hits and scores
- Score history/leaderboard
- Visual polish and animations

