# Technology Stack: Paddle-Panic

**Status:** Approved
**Date:** Mon Dec 22 2025

## 1. Core Stack
*   **Runtime:** Node.js (v14+)
    *   *Role:* Runs the game server and serves the web files.
    *   *Reason:* Fast I/O, JavaScript on both ends (Client/Server), huge ecosystem.
*   **Language:** JavaScript (ES6+)
    *   *Role:* The logic language.
    *   *Reason:* Native to the web. No compilation step needed for this scale.

## 2. Libraries & Frameworks
*   **Express.js:**
    *   *Role:* Web Server Framework.
    *   *Reason:* Simplifies serving static HTML/CSS/JS files. Standard for Node.js.
*   **Socket.io:**
    *   *Role:* Real-time Communication Engine.
    *   *Reason:* Handles WebSockets with fallback to polling. Manages "Rooms" automatically. Easy event-based API (`emit`, `on`).

## 3. Frontend Technology
*   **HTML5 Canvas:**
    *   *Role:* Rendering Engine.
    *   *Reason:* High performance for 2D graphics. Much faster than manipulating DOM elements for a game running at 60fps.
*   **CSS3:**
    *   *Role:* UI Styling (Menus, Buttons).
    *   *Reason:* Standard web styling.

## 4. Architecture Patterns
*   **Authoritative Server:**
    *   The server holds the "Master State" (Ball position, Score).
    *   Clients send *Inputs* (Keys), not *Positions*.
    *   Prevents cheating.
*   **Client-Side Prediction:**
    *   Client moves paddle immediately on key press.
    *   Server sends correction if needed.
    *   Hides network latency.
*   **Game Loop:**
    *   **Server:** `setInterval` at 30 ticks/second (Physics & Logic).
    *   **Client:** `requestAnimationFrame` at 60 frames/second (Rendering & Interpolation).
