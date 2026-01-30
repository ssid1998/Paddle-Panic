# Sprint Backlog: Sprint 1.1

## 📋 Sprint Information

| Field | Value |
|-------|-------|
| **Sprint Number** | 1.1 |
| **Sprint Name** | The Connectivity Skeleton |
| **Reference** | Phase 1 Execution Plan → "Phase 1: The Connectivity Skeleton" |
| **Status** | Completed |

---

## 🎯 Sprint Goal

### What are we building?
We are proving that the **network stack works**. Before writing any game logic, we need to verify that a smartphone can send commands to a server, and that server can update a shared display in real-time.

### Expected Outcome (What you will see)
By the end of this sprint, you will be able to:
1. Start a local Node.js server.
2. Open a "Spectator" page in your browser showing a black canvas.
3. Open a "Controller" page on your phone (or another browser tab).
4. Press buttons on the controller and see a yellow square move on the Spectator screen.

### Acceptance Criteria
- [ ] The server starts without errors using `start.sh` or `start.bat`.
- [ ] The Spectator page (`http://localhost:3000`) displays a black canvas.
- [ ] The Controller page (`http://localhost:3000/controller.html`) shows 4 directional buttons.
- [ ] Pressing a button on the Controller moves a yellow square on the Spectator screen.
- [ ] Latency is low enough that the movement feels "instant" (< 100ms).

---

## 📝 Tasks

### Task 1: Project Initialization & Scaffold
**Description:** Set up the Node.js project structure with Express and Socket.io.
**Technical Approach:**
- Run `npm init` to create `package.json`.
- Install dependencies: `express`, `socket.io`, `qrcode`.
- Create folder structure: `src/server/`, `src/client/public/`.

**Acceptance Criteria:**
- [ ] `package.json` exists with correct dependencies.
- [ ] `npm install` runs without errors.

**Status:** [x] Done

---

### Task 2: Hello World Socket Connection
**Description:** Verify that a client can connect to the server via WebSocket.
**Technical Approach:**
- Implement `io.on('connection')` on the server.
- Log "User connected" when a client joins.
- Send a welcome message back to the client.

**Acceptance Criteria:**
- [ ] Opening `http://localhost:3000` logs a message in the server console.
- [ ] The browser console shows the welcome message.

**Status:** [x] Done

---

### Task 3: Basic D-Pad Controller
**Description:** Create a mobile-friendly HTML page with 4 directional buttons.
**Technical Approach:**
- Create `controller.html` with large touch-friendly buttons.
- Use `touchstart` events (not `click`) to avoid mobile delay.
- Emit socket events: `socket.emit('input', 'UP')`.

**Acceptance Criteria:**
- [ ] The controller page renders correctly on a smartphone.
- [ ] Touching a button emits the correct direction to the server.

**Status:** [x] Done

---

### Task 4: Basic Canvas Rendering (Spectator)
**Description:** Display connected players as colored squares on an HTML5 Canvas.
**Technical Approach:**
- Create `index.html` with a `<canvas>` element (800x600).
- Use `requestAnimationFrame` for smooth rendering.
- Listen for `stateUpdate` events and draw player positions.

**Acceptance Criteria:**
- [ ] The canvas displays a black background.
- [ ] Each connected player appears as a yellow square.
- [ ] Movement is smooth and responsive.

**Status:** [x] Done

---

### Task 5: Helper Scripts (start.sh / stop.sh)
**Description:** Create user-friendly scripts to start and stop the server.
**Technical Approach:**
- `start.sh`: Runs `npm install` and `npm start`. Calls `stop.sh` first to prevent port conflicts.
- `stop.sh`: Kills any process on port 3000.
- Create equivalent `.bat` files for Windows.

**Acceptance Criteria:**
- [ ] Double-clicking `start.sh` (Mac) or `start.bat` (Windows) launches the server.
- [ ] Running `stop.sh` / `stop.bat` cleanly terminates the server.

**Status:** [x] Done

---

## 📓 Notes & Decisions

| Date | Decision |
|------|----------|
| 2025-12-20 | **Vanilla JS:** We decided to use plain JavaScript without frameworks (React, Vue) to avoid dependency complexity for students. |
| 2025-12-20 | **Fixed Canvas Size:** The canvas is hardcoded to 800x600 pixels. Responsive design is out of scope for this sprint. |
| 2025-12-20 | **Port 3000:** We use the default port 3000. If students have conflicts, they can change it in `index.js`. |
| 2025-12-20 | **No QR Code Yet:** The QR code feature (Story 1.1) is included in the Execution Plan but will be fully implemented when we have a stable IP detection mechanism. For now, users manually type the URL. |
