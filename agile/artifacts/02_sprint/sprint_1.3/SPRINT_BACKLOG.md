# Sprint Backlog: Sprint 1.3

## Sprint Information

| Field | Value |
|-------|-------|
| **Sprint Number** | 1.3 |
| **Sprint Name** | Lobby & Entry Experience |
| **Reference** | Phase 3 Execution Plan |
| **Status** | Complete |

---

## Sprint Goal

### What are we building?
We are building the **lobby and entry flow** for Paddle Panic. Currently, players must manually type a URL to join. After this sprint, they can simply **scan a QR code**, enter their name, choose a game mode, and start playing!

### Expected Outcome (What you will see)
By the end of this sprint, you will be able to:
1. See a **large QR code** on the host screen (laptop/TV)
2. **Scan the QR code** with your phone camera to instantly open the controller
3. **Enter your name** (up to 12 characters)
4. **Choose game mode**: Player vs Player OR Player vs RoboPaddle
5. **Select AI difficulty** (Easy/Medium/Hard) if playing against AI
6. **Press Ready** and see a 3-2-1 countdown before the game starts

### Acceptance Criteria
- [x] QR code displays on host screen and is scannable
- [x] Scanning QR code opens controller page on phone
- [x] Player can enter name (displayed on host screen)
- [x] Player can choose PvP or PvC mode
- [x] Player can select AI difficulty (Easy/Medium/Hard)
- [x] Ready button starts countdown when all players ready
- [x] QR code hides/shows appropriately based on game state

---

## Tasks

### Task 1: Install QR Code Library
**Description:** Add the QRCode.js library to generate QR codes on the host page.
**Technical Approach:**
- Used QRCode library via CDN (https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js)
- Added script tag to host index.html

**Acceptance Criteria:**
- [x] QRCode library available in host page

**Status:** [x] Done

---

### Task 2: Dynamic IP Detection
**Description:** Server detects its local IP address to build the correct controller URL.
**Technical Approach:**
- Used Node.js `os.networkInterfaces()` to find local IP
- Built URL: `http://<local-ip>:3000/controller`
- Added `/api/server-info` endpoint

**Acceptance Criteria:**
- [x] Server correctly detects local IP (not localhost/127.0.0.1)
- [x] Works on WiFi networks

**Status:** [x] Done

---

### Task 3: Display QR Code on Host Screen
**Description:** Show a large, scannable QR code on the host screen in the lobby.
**Technical Approach:**
- Generated QR code from controller URL using QRCode.toCanvas()
- Displayed in styled container with white background
- Added "Scan to Join" instruction text

**Acceptance Criteria:**
- [x] QR code visible on host screen
- [x] "Paddle Panic" title displayed
- [x] "Scan to Join" instruction visible

**Status:** [x] Done

---

### Task 4: Lobby UI on Host Screen
**Description:** Create a lobby view that shows QR code, connected players, and game status.
**Technical Approach:**
- Added lobby screen with player slots showing names and ready status
- Player 1 slot (red) and Player 2 slot (blue)
- Dynamic status messages based on lobby state

**Acceptance Criteria:**
- [x] Lobby shows connected player names
- [x] Shows waiting status for empty slots

**Status:** [x] Done

---

### Task 5: Controller - Name Entry Screen
**Description:** After connecting, show a text input for the player to enter their name.
**Technical Approach:**
- Created multi-screen controller UI
- Name entry screen with input field (maxlength 12)
- Continue and Skip buttons

**Acceptance Criteria:**
- [x] Name input visible after connection
- [x] Max 12 characters enforced
- [x] Can skip (uses default name)

**Status:** [x] Done

---

### Task 6: Controller - Mode Selection Screen
**Description:** First player chooses between PvP and PvC (vs RoboPaddle) modes.
**Technical Approach:**
- Created mode selection screen with two large buttons
- "vs Player" and "vs RoboPaddle" options with icons
- Only shown to Player 1

**Acceptance Criteria:**
- [x] Mode selection shown to Player 1
- [x] Both options clearly labeled
- [x] Selection sent to server

**Status:** [x] Done

---

### Task 7: Controller - Difficulty Selection Screen
**Description:** If PvC mode selected, show Easy/Medium/Hard difficulty options.
**Technical Approach:**
- Created difficulty screen with three colored buttons
- Easy (green), Medium (orange), Hard (red)
- Only shown after PvC mode selection

**Acceptance Criteria:**
- [x] Three difficulty options displayed
- [x] Only shown in PvC mode
- [x] Selection sent to server

**Status:** [x] Done

---

### Task 8: Controller - Ready Button Screen
**Description:** Show a Ready button for players to indicate they're prepared to play.
**Technical Approach:**
- Large circular READY button
- Shows opponent ready status
- Button changes to "WAITING..." after pressed

**Acceptance Criteria:**
- [x] Ready button visible and tappable
- [x] In PvP, both players must be ready
- [x] In PvC, only human player needs to be ready

**Status:** [x] Done

---

### Task 9: Server - Lobby State Management
**Description:** Track lobby state, player connections, mode selection, and ready status.
**Technical Approach:**
- Created comprehensive lobby state machine with states:
  - WAITING_FOR_P1, P1_ENTERING_NAME, P1_SELECTING_MODE
  - P1_SELECTING_DIFFICULTY, WAITING_FOR_P2, P2_ENTERING_NAME
  - READY_CHECK, GAME_STARTING, PLAYING
- Broadcasts lobbyState to all clients

**Acceptance Criteria:**
- [x] Server tracks all player data
- [x] State transitions work correctly
- [x] Events emitted to update clients

**Status:** [x] Done

---

### Task 10: QR Code Visibility Management
**Description:** Hide QR when appropriate, show for Player 2 in PvP.
**Technical Approach:**
- QR hidden after Player 1 connects
- QR reappears in PvP mode for Player 2
- QR hidden once game starts

**Acceptance Criteria:**
- [x] QR hides after Player 1 scans
- [x] QR reappears for Player 2 in PvP
- [x] QR hidden during gameplay

**Status:** [x] Done

---

### Task 11: Player 2 Join Flow (PvP)
**Description:** Handle second player joining in PvP mode.
**Technical Approach:**
- Server recognizes second controller during WAITING_FOR_P2 state
- Auto-assigns as Player 2 with blue color
- Player 2 sees name entry, then Ready screen (no mode selection)

**Acceptance Criteria:**
- [x] Player 2 auto-assigned
- [x] Player 2 enters name
- [x] Player 2 sees Ready button (no mode selection)

**Status:** [x] Done

---

### Task 12: Game Start Flow
**Description:** When all players ready, start the game with countdown.
**Technical Approach:**
- Server detects all required players ready
- Transitions to GAME_STARTING state
- Starts GameEngine countdown

**Acceptance Criteria:**
- [x] Game starts when all ready
- [x] 3-2-1 countdown displays
- [x] Controllers switch to game controls

**Status:** [x] Done

---

## Notes & Decisions

| Date | Decision |
|------|----------|
| 2026-01-30 | **OS:** Mac (darwin) confirmed. |
| 2026-01-30 | **QR Library:** Using CDN-based QRCode.js for simplicity (no npm install needed). |
| 2026-01-30 | **AI Implementation Deferred:** RoboPaddle AI logic will be implemented in Sprint 1.4. This sprint only adds the selection UI and stores the difficulty setting. |
| 2026-01-30 | **Multi-Screen Controller:** Implemented 9 different screens in controller for complete flow management. |
| 2026-01-30 | **RoboPaddle Color:** RoboPaddle paddle is black (#1a1a1a). In PvC mode, human player gets randomly assigned red or blue. In PvP mode, Player 1 is red, Player 2 is blue. |
