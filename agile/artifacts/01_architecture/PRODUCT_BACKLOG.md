# Product Backlog: Paddle-Panic (Technical Refinement)

**Status:** Phase 1 (Architecture) Complete
**Focus:** Transforming the "Product Vision" into a "Technical Plan".

## 📖 Introduction
This backlog represents the technical evolution of our initial product ideas. While Phase 0 focused on *what* the user experiences, this document adds the *how*—specifically, how we will use **Node.js, Socket.io, and HTML5 Canvas** to build a robust, low-latency multiplayer game.

We have structured the work into a chronological **Execution Plan**. We do not build everything at once; we build in layers of complexity to manage risk.

---

## 🗺️ Execution Plan (Sprints)

### Phase 1: The Skeleton (Sprint 1.1)
**Goal:** Prove that the network stack works. We need to verify that we can serve the game and establish a real-time connection.

*   `[ARCH]` **Story 0.1: Project Initialization & Scaffold**
    *   **Context:** Before we can code, we need a clean project structure.
    *   **Technical Approach:** Initialize Node.js project (`npm init`). Set up Express to serve static files (`public/`) and Socket.io for the server. Create folder structure: `src/server/` and `src/client/`.
*   `[ARCH]` **Story 0.2: Hello World Socket**
    *   **Context:** Confirm WebSocket handshake works.
    *   **Technical Approach:** Implement a simple "Ping/Pong" event. Client connects -> Server logs "New Player" -> Server sends "Welcome".
*   `[UX]` **Story 1.1: The Table Tennis Board (Canvas)**
    *   **Context:** We need the visual base.
    *   **Technical Approach:** Create an HTML5 `<canvas>` element. Use `requestAnimationFrame` loop to draw the green board, white lines, and net.
*   `[UX]` **Story 1.2: Responsive Scaling**
    *   **Context:** Must work on different screens.
    *   **Technical Approach:** Listen to `window.resize` event. Adjust canvas `width` and `height` dynamically and redraw.

### Phase 2: The Physics (Sprint 1.2)
**Goal:** Implement the authoritative game rules locally first (Single Player foundation).

*   `[ARCH]` **Story 2.1: The Game Loop**
    *   **Context:** The heart of the game.
    *   **Technical Approach:** Implement a loop running at 60 FPS (Client) and 30 TPS (Server).
*   `[FEAT]` **Story 2.1: Keyboard Controls**
    *   **Context:** Player input.
    *   **Technical Approach:** Bind `keydown` and `keyup` listeners for Arrow Keys/WASD. Update a local `paddle.y` variable.
*   `[FEAT]` **Story 2.2: Ball Movement & Collision**
    *   **Context:** The ball physics.
    *   **Technical Approach:** Simple AABB (Axis-Aligned Bounding Box) collision detection. `if (ball.x < paddle.x + width && ...)` reverse `ball.velocityX`.
*   `[FEAT]` **Story 3.2: Basic AI (Easy)**
    *   **Context:** A simple opponent to test against.
    *   **Technical Approach:** Simple tracking: `if (ball.y > paddle.y) paddle.y += speed`.

### Phase 3: The Network (Sprint 1.3)
**Goal:** Connect two players and sync the state.

*   `[ARCH]` **Story 4.0: Room Manager**
    *   **Context:** Managing multiple games.
    *   **Technical Approach:** Server class `RoomManager`. Maps `roomCode` to `GameState` object. Handles `join` and `leave` events.
*   `[FEAT]` **Story 4.3: Game State Synchronization**
    *   **Context:** Both players see the same thing.
    *   **Technical Approach:** Server sends `GAME_UPDATE` (ball pos, paddle pos) 30 times/sec. Client interpolates between updates for smoothness.
*   `[ARCH]` **Story 4.X: Client-Side Prediction (Enabler)**
    *   **Context:** Prevent "mushy" feel.
    *   **Technical Approach:** Move local paddle immediately on keypress. Reconcile if server sends different position (correction).

---

## 📦 Full Story Repository (Epics)

*This section lists all original User Stories, preserved for reference.*

### Epic 1: The Visual Foundation
**Goal:** Establish the visual identity and ensure the game is playable on different screen sizes.

*   **Story 1.1:** As a Player, I want to see a realistic-looking 2D top-down table...
    *   *Tech Note:* Use HTML5 Canvas `ctx.fillRect` and `ctx.strokeRect`.
*   **Story 1.2:** As a Player, I want the game board to shrink proportionally...
    *   *Tech Note:* Maintain aspect ratio variable.
*   **Story 1.3:** As a Player, I want to see distinct rectangular paddles...
*   **Story 1.4:** As a Player, I want to see a clear score display...
*   **Story 1.5:** As a Player, I want to hear a sound...
    *   *Tech Note:* Use `Audio()` API. Preload sounds.

### Epic 2: Core Gameplay Physics
**Goal:** Create a fun, fair, and skill-based physics engine.

*   **Story 2.1:** As a Player, I want to move my paddle Up and Down...
    *   *Tech Note:* `requestAnimationFrame` for smooth movement.
*   **Story 2.2:** As a Player, I want the ball to bounce off walls/paddles...
    *   *Tech Note:* Server-side physics for multiplayer authority.
*   **Story 2.3:** As a Competitive Player, I want the ball to accelerate...
    *   *Tech Note:* `ball.speed *= 1.05` on collision.
*   **Story 2.4:** As a Player, I want to earn a point...
*   **Story 2.5:** As a Player, I want the game to end at 11 points...

### Epic 3: Single Player Intelligence
**Goal:** Allow users to practice or play offline.

*   **Story 3.1:** As a Solo Player, I want to choose difficulty...
*   **Story 3.2:** As a Beginner, I want the CPU to move slowly...
    *   *Tech Note:* Cap AI paddle speed.
*   **Story 3.3:** As a Pro, I want the CPU to track perfectly...
*   **Story 3.4:** As a Solo Player, I want to pause...
    *   *Tech Note:* `cancelAnimationFrame` (Client) or `clearInterval` (Server).

### Epic 4: Multiplayer Connectivity
**Goal:** The core selling point - playing with friends remotely.

*   **Story 4.1:** As a Host, I want to generate a Room Code...
    *   *Tech Note:* `Math.random().toString(36).substring(7)`.
*   **Story 4.2:** As a Guest, I want to enter a Room Code...
*   **Story 4.3:** As a Player, I want to see the ball/paddles synced...
    *   *Tech Note:* Socket.io `io.to(roomID).emit('update', state)`.
*   **Story 4.4:** As a Player, I want a reconnection timer...
    *   *Tech Note:* Don't delete player object on `disconnect` immediately.
*   **Story 4.5:** As a Winner, I want to click "Rematch"...
