# Product Backlog: Pac-Party-Web (Technical Refinement)

**Status:** Phase 1 (Architecture) Complete
**Focus:** Transforming the "Product Vision" into a "Technical Plan".

## 📖 Introduction
This backlog represents the technical evolution of our initial product ideas. While Phase 0 focused on *what* the user experiences, this document adds the *how*—specifically, how we will use **Node.js, Socket.io, and HTML5 Canvas** to build a robust, low-latency multiplayer game.

We have structured the work into a chronological **Execution Plan**. We do not build everything at once; we build in layers of complexity to manage risk.

---

## 🗺️ Execution Plan (Sprints)

### Phase 1: The Connectivity Skeleton (Sprint 1.1)
**Goal:** Prove that the network stack works. We need to verify that a phone can control a pixel on the big screen with minimal latency before we write any game logic.

*   `[ARCH]` **Story 0.1: Project Initialization & Scaffold**
    *   **Context:** Before we can code, we need a clean project structure.
    *   **Technical Approach:** We will initialize a new Node.js project using `npm init`. We will set up `Express` to serve our static files (HTML/CSS) and `Socket.io` for the real-time connection. We will organize the code into `src/server/` (Node logic) and `src/client/` (Browser logic).
*   `[ARCH]` **Story 0.3: Hello World Socket**
    *   **Context:** We need to confirm that the WebSocket handshake works on the local network.
    *   **Technical Approach:** We will implement a simple "Ping/Pong" event. When a client connects to the server IP, the server logs "New Player Connected" and sends a welcome message back. This confirms our router/firewall settings are correct.
*   `[FEAT]` **Story 1.1: QR Code Entry**
    *   **Context:** The user needs an easy way to connect without typing an IP address.
    *   **Technical Approach:** The server knows its own local IP address. We will use a library like `qrcode` to generate a QR code image on the "Spectator Screen" that points to `http://<server-ip>:3000`.
*   `[FEAT]` **Story 3.2: Basic D-Pad Controller**
    *   **Context:** The player needs input controls.
    *   **Technical Approach:** We will create a simple HTML page for the phone with four large `<div>` buttons. We will bind JavaScript `touchstart` events (not `click`, to avoid delay) to emit socket messages: `socket.emit('input', 'UP')`.
*   `[FEAT]` **Story 4.1: Basic Canvas Rendering**
    *   **Context:** The big screen needs to show the result of the input.
    *   **Technical Approach:** We will place an HTML5 `<canvas>` element on the spectator page. In a loop (`requestAnimationFrame`), we will clear the screen and draw a simple rectangle at the current X/Y coordinates received from the server.

### Phase 2: The Core Game (Sprint 1.2)
**Goal:** Implement the authoritative game rules. Now that we can move, we need to enforce *where* we can move.

*   `[ARCH]` **Story 2.1: Authoritative Game Loop**
    *   **Context:** We cannot trust the clients to handle physics because they might lag or cheat.
    *   **Technical Approach:** We will implement a `setInterval` loop on the Node.js server running at 30 ticks per second. In each tick, the server calculates the new positions of all entities and broadcasts a snapshot (`GAME_STATE`) to all connected clients.
*   `[ARCH]` **Story 2.2: Grid & Collision**
    *   **Context:** Pacman must stop at walls.
    *   **Technical Approach:** We will represent the map as a 2D array of integers (e.g., `0` for path, `1` for wall). Before moving a player, the server checks if the target grid cell is a `1`. If so, the movement is blocked.
*   `[FEAT]` **Story 1.2: Dynamic Role Assignment**
    *   **Context:** We need to assign Pacman and Ghosts automatically.
    *   **Technical Approach:** The server will maintain an array of active `socket.id`s. The first socket in the array is tagged as `ROLE: PACMAN`. The next four are `ROLE: GHOST`. When a player connects, they receive their specific role event.
*   `[FEAT]` **Story 2.4: Ghost Capture Logic**
    *   **Context:** The core win/loss condition.
    *   **Technical Approach:** In the server loop, we check if the grid coordinates of a Ghost match the coordinates of Pacman. If `ghost.x === pacman.x && ghost.y === pacman.y`, the server triggers the `GAME_OVER` event.

### Phase 3: The Polish (Sprint 1.3)
**Goal:** Transform the technical prototype into a visually appealing fair exhibit.

*   `[FEAT]` **Story 4.1: Neon Graphics Upgrade**
    *   **Context:** The game needs to look attractive from a distance.
    *   **Technical Approach:** We will replace the simple rectangles with "Neon" style graphics on the Canvas. We will use `ctx.shadowBlur` and `ctx.strokeStyle` to create a glowing effect for the walls and characters.
*   `[FEAT]` **Story 1.4: Disconnect Handling & Reconnection**
    *   **Context:** Wi-Fi is unreliable. We don't want the game to crash if a phone disconnects for 2 seconds.
    *   **Technical Approach:** Socket.io has built-in reconnection. On the server, we will not remove a player immediately upon `disconnect`. We will wait for a short "grace period" (e.g., 5 seconds) to allow the socket to reconnect and reclaim its session ID.

---

## 📦 Full Story Repository (Epics)

*This section lists all original User Stories, preserved for reference.*

### Epic 1: The Lobby & Connection System
**Goal:** Manage 5 concurrent connections, handle drop-outs gracefully, and ensure fair access.

*   **Story 1.1:** As a Visitor, I want to scan a QR code...
    *   *Tech Note:* Must work on local LAN without internet.
*   **Story 1.2:** As the System, I want to assign the first player as "Pacman"...
    *   *Tech Note:* Handled via server-side array `players[]`.
*   **Story 1.3:** As a 6th Visitor, I want to see a "Game Full" message...
    *   *Tech Note:* Server checks `players.length >= 5` on connection attempt.
*   **Story 1.4:** As the Remaining Players, I want a disconnected player's slot to free up...
    *   *Tech Note:* Critical for high throughput. Use `socket.on('disconnect')`.
*   **Story 1.5:** As the System, I want to start the game automatically once 2 players are present...
    *   *Tech Note:* Simple state check: `if (players.length >= 2) startGame()`.

### Epic 2: The Core Game Engine (Server-Side)
**Goal:** Authoritative Node.js server handling movement and rules.

*   **Story 2.1:** As the System, I want to calculate game state 30 times a second...
    *   *Tech Note:* Use Node.js event loop.
*   **Story 2.2:** As the System, I want to validate moves against the wall map...
    *   *Tech Note:* 2D Array collision detection.
*   **Story 2.3:** As Pacman, I want to consume dots to increase my score...
    *   *Tech Note:* Server removes dot from map array and increments score variable.
*   **Story 2.4:** As a Ghost, I want to trigger an immediate "Game Over"...
    *   *Tech Note:* Simple coordinate comparison.
*   **Story 2.5:** As the Organizer, I want the game to end forcibly at 3:00...
    *   *Tech Note:* `setTimeout` on the server start.
*   **Story 2.6:** As the System, I want to wipe the state immediately after Game Over...
    *   *Tech Note:* Reset all variables to initial state.
*   **Story 2.7:** As Pacman, I want to eat a Power Pellet...
    *   *Tech Note:* Add `isVulnerable` state to Ghosts for 10 seconds.

### Epic 3: Mobile Controller (Client A)
**Goal:** The specific interface for the 5 players.

*   **Story 3.1:** As a Player, I want to clearly see my Role (Pacman vs Ghost) and Color...
    *   *Tech Note:* DOM manipulation based on socket event `YOUR_ROLE`.
*   **Story 3.2:** As a Player, I want to use large D-Pad buttons...
    *   *Tech Note:* Prevent default browser behaviors (zooming, scrolling) via CSS `touch-action: none`.
*   **Story 3.3:** As a Player, I want vibration feedback...
    *   *Tech Note:* Use `navigator.vibrate(200)` API.
*   **Story 3.4:** As a Player, I want to rejoin my session if my screen sleeps...
    *   *Tech Note:* Use `localStorage` to save Session ID.
*   **Story 3.5:** As a Player, I want to see "You Win/Lose" on my phone...
    *   *Tech Note:* Simple overlay div toggled via CSS class.

### Epic 4: Big Screen Display (Client B)
**Goal:** The "Spectator" view on the projector.

*   **Story 4.1:** As a Spectator, I want to see a bright, Neon-style maze...
    *   *Tech Note:* Canvas paths with `shadowBlur`.
*   **Story 4.2:** As a Spectator, I want character movement to look smooth...
    *   *Tech Note:* Client-side linear interpolation (LERP) between server ticks.
*   **Story 4.3:** As a Passerby, I want to see the "Join" QR code on screen...
    *   *Tech Note:* Overlay div with z-index.
*   **Story 4.4:** As a Player, I want to see the 3:00 timer and Score clearly...
    *   *Tech Note:* Draw text on Canvas.
*   **Story 4.5:** As a Spectator, I want to see particle effects on events...
    *   *Tech Note:* Simple particle system array in render loop.
