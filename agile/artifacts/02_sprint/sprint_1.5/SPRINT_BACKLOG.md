# Sprint Backlog: Sprint 1.5

## Sprint Information

| Field | Value |
|-------|-------|
| **Sprint Number** | 1.5 |
| **Sprint Name** | Match End & State Management (Simplified) |
| **Reference** | Phase 5 Execution Plan |
| **Status** | Completed |

---

## Sprint Goal

### What are we building?
We are adding **smooth game ending and lobby reset flow**. When a game ends, players see the winner, get thanked for playing, and their controller closes. The host screen resets to show the QR code for new players.

### Expected Outcome (What you will see)
By the end of this sprint, you will be able to:
1. See a **prominent winner announcement** on the host screen
2. See **"You Win!" or "You Lose"** on your phone controller
3. See **"Thanks for playing!"** message before the controller closes
4. Experience **automatic lobby reset** - QR code appears for new players
5. Experience **graceful disconnect handling** (5-second reconnection window in PvP)

### Acceptance Criteria
- [x] Winner name displayed prominently on host screen after match
- [x] Controller shows win/lose result for 3 seconds
- [x] Controller shows "Thanks for playing!" for 3 seconds
- [x] Controller auto-closes after showing thanks message
- [x] Lobby auto-resets after 5 seconds, QR code appears
- [x] 5-second grace period for disconnections during PvP gameplay
- [x] New players can scan QR to start fresh game

---

## Tasks

### Task 1: Enhanced Winner Announcement
**Description:** Display winner name prominently on host screen.
**Technical Approach:**
- Update host game.js to show large winner overlay with player color
- Trophy emoji and colored banner
- "Thanks for playing! New game starting soon..." message

**Status:** [x] Completed

---

### Task 2: Game Over Controller Screen
**Description:** Show win/lose result on controller, then thanks message, then close.
**Technical Approach:**
- Game over screen shows "You Win!" or "You Lose" with score
- After 3 seconds, transition to thanks screen
- After 3 more seconds, auto-close the browser tab
- No buttons - completely automatic flow

**Status:** [x] Completed

---

### Task 3: Auto-Reset Lobby Flow
**Description:** Server automatically resets lobby after game ends.
**Technical Approach:**
- `gameEngine.onGameOver` callback triggers reset
- Emit `gameEnded` to all controllers
- Wait 5 seconds, then clear all controllers and reset lobby
- QR code appears for new players

**Status:** [x] Completed

---

### Task 4: Disconnect Handling with Grace Period
**Description:** Pause game for 5 seconds if a player disconnects during PvP play.
**Technical Approach:**
- On disconnect during `PLAYING` state (PvP), enter `PAUSED` state
- Display "Reconnecting... X" countdown on host
- 5-second timer for forfeit
- If timeout, opponent wins by forfeit, lobby resets
- Support reconnection via `reconnectPlayer` event

**Status:** [x] Completed

---

## Removed Features (Scope Simplification)

The following features were originally planned but removed to simplify the user flow:

| Feature | Reason for Removal |
|---------|-------------------|
| Rematch button | Adds complexity; players can just scan QR again |
| Leave button | Not needed; game ends automatically |
| Voice announcement | Browser compatibility issues |
| "Join Again" button | Players should scan QR for fresh start |
| Return to mode select | Not needed with auto-reset flow |

---

## Notes & Decisions

| Date | Decision |
|------|----------|
| 2026-01-30 | **Simplified Flow:** Removed rematch/leave buttons. Game ends -> Thanks -> Close -> Reset. Clean and simple. |
| 2026-01-30 | **Voice Removed:** Web Speech API had browser compatibility issues. Removed entirely. |
| 2026-01-30 | **Auto-Close:** Controller tab attempts to close after "Thanks for playing!" - some browsers may block this but the message is still shown. |
| 2026-01-30 | **Grace Period:** 5-second reconnection window only applies to PvP mode during active gameplay. |

