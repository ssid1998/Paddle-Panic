# Sprint Backlog: Sprint 1.1

## Sprint Information

| Field | Value |
|-------|-------|
| **Sprint Number** | 1.1 |
| **Sprint Name** | Technical Foundation (Walking Skeleton) |
| **Reference** | Phase 1 Execution Plan → "Technical Foundation" |
| **Status** | ✅ Complete - Verified by User |

---

## Sprint Goal

### What are we building?
We are building the **technical foundation** of Paddle Panic—the "walking skeleton" that proves our architecture works. This sprint focuses on establishing real-time communication between a mobile phone and the host screen. If we can make a phone move a paddle on the screen, we've proven the core technology works.

### Expected Outcome (What you will see)
By the end of this sprint, you will be able to:
1. **Run** `./start.sh` (Mac/Linux) or `start.bat` (Windows) to launch the game server
2. **Open** `http://localhost:3000` in your browser to see the host screen with a paddle
3. **Open** `http://localhost:3000/controller` on your phone (same WiFi) to see UP/DOWN buttons
4. **Press** UP or DOWN on your phone and **watch the paddle move** on the host screen in real-time

### Acceptance Criteria
- [x] Server starts successfully with `npm start`
- [x] Host screen displays at `http://localhost:3000`
- [x] Controller page displays at `http://localhost:3000/controller`
- [x] Socket.io connection established (visible in console)
- [x] Pressing UP on phone moves paddle UP on host screen ✅
- [x] Pressing DOWN on phone moves paddle DOWN on host screen ✅
- [x] Movement feels instant (< 100ms latency) ✅

---

## Tasks

### Task 1: Project Initialization & Scaffold (Story 0.1)
**Description:** Set up the Node.js project with proper folder structure and dependencies.

**Technical Approach:**
- Initialize Node.js project with `npm init`
- Install dependencies: `express`, `socket.io`
- Create folder structure:
  ```
  results/
  ├── package.json
  ├── src/
  │   ├── server/
  │   │   └── index.js
  │   └── client/
  │       ├── host/
  │       │   ├── index.html
  │       │   ├── styles.css
  │       │   └── game.js
  │       └── controller/
  │           ├── index.html
  │           ├── styles.css
  │           └── controls.js
  ```
- Configure `package.json` with start script

**Acceptance Criteria:**
- [x] `npm start` launches the server
- [x] Server logs "Paddle Panic server running on port 3000"

**Status:** [x] Complete

---

### Task 2: Express Server Setup (Story 0.2)
**Description:** Create the Express web server that serves HTML pages.

**Technical Approach:**
- Create Express app in `src/server/index.js`
- Serve static files from `src/client/`
- Route `/` to host screen (`src/client/host/index.html`)
- Route `/controller` to mobile controller (`src/client/controller/index.html`)

**Acceptance Criteria:**
- [x] Navigating to `http://localhost:3000` shows host page
- [x] Navigating to `http://localhost:3000/controller` shows controller page

**Status:** [x] Complete

---

### Task 3: Socket.io Integration (Story 0.3)
**Description:** Add real-time communication between server and browsers.

**Technical Approach:**
- Integrate Socket.io with Express server
- Add Socket.io client scripts to host and controller pages
- Log connections: "New client connected: [socket.id]"
- Implement basic connection test

**Acceptance Criteria:**
- [x] Opening host page shows "Connected to server" in browser console
- [x] Opening controller page shows "Connected to server" in browser console
- [x] Server logs each connection with socket ID

**Status:** [x] Complete

---

### Task 4: Basic Canvas Setup (Story 0.4)
**Description:** Set up the game display surface on the host screen.

**Technical Approach:**
- Add `<canvas>` element to host page, sized to fill screen
- Create basic render loop using `requestAnimationFrame`
- Draw table background (green color)
- Draw a simple rectangle (paddle) at a fixed position

**Acceptance Criteria:**
- [x] Host page shows a green table background
- [x] A colored paddle rectangle is visible on the left side
- [x] No flickering or performance issues

**Status:** [x] Complete

---

### Task 5: Basic Controller Buttons (Story 0.5)
**Description:** Create the UP/DOWN buttons on the mobile controller.

**Technical Approach:**
- Create two large `<button>` elements (UP and DOWN)
- Style to fill half the screen each
- Bind `touchstart` events (faster than `click`)
- Emit Socket.io events: `socket.emit('input', { direction: 'UP' })`
- Prevent default touch behaviors (zooming, scrolling) with CSS

**Acceptance Criteria:**
- [x] Two large buttons visible on controller page
- [x] Pressing UP sends event to server (visible in server logs)
- [x] Pressing DOWN sends event to server
- [x] Page doesn't zoom or scroll when pressing buttons

**Status:** [x] Complete

---

### Task 6: Paddle Responds to Input (Story 0.6)
**Description:** Make the paddle move when buttons are pressed.

**Technical Approach:**
- Server receives `input` events from controller
- Server updates paddle Y position based on direction
- Server broadcasts paddle position to host screen
- Host screen redraws paddle at new position

**Acceptance Criteria:**
- [x] Pressing UP on phone moves paddle up on host screen
- [x] Pressing DOWN on phone moves paddle down on host screen
- [x] Movement is visible within ~50ms (feels instant)
- [x] Paddle stays within screen bounds

**Status:** [x] Complete

---

### Task 7: Helper Scripts (start.sh / start.bat / stop scripts)
**Description:** Create user-friendly scripts to start and stop the game.

**Technical Approach:**
- Create `start.sh` for Mac/Linux
- Create `start.bat` for Windows
- Create `stop.sh` for Mac/Linux (kills process on port 3000)
- Create `stop.bat` for Windows
- Start scripts should call stop scripts first to prevent "port already in use" errors

**Acceptance Criteria:**
- [x] `./start.sh` (Mac) or `start.bat` (Windows) launches the server
- [x] `./stop.sh` (Mac) or `stop.bat` (Windows) kills the server
- [x] Running start twice doesn't cause errors

**Status:** [x] Complete

---

## Notes & Decisions

| Date | Decision |
|------|----------|
| 2026-01-30 | Sprint initialized. OS confirmed as Mac. |
| 2026-01-30 | All 7 tasks implemented. Awaiting user verification. |
| 2026-01-30 | Fixed HTML path issue (relative → absolute paths). |
| 2026-01-30 | Moved title outside canvas (above table). User verified all features working. Sprint complete! |
