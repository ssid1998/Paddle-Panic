# 🔭 Project Vision: Paddle-Panic (Technical Refinement)

**Date:** Mon Dec 22 2025
**Status:** Architecture Complete (v2)

## 1. Elevator Pitch
*For casual gamers and friends who want a quick, competitive challenge without installation, **Paddle-Panic** is a web-based arcade Table Tennis game that provides instant multiplayer fun directly in the browser. Unlike generic Pong clones or heavy downloadable games, our product offers a polished, responsive "table-top" aesthetic with a robust reconnection system that ensures fair play even on shaky internet connections.*

## 2. Business Goals
*   **Accessibility:** Zero friction entry. No login (unless desired for nicknames), no download, just a URL.
*   **Engagement:** A "just one more game" loop driven by the "Rematch" feature and increasing ball speed.
*   **Reliability:** A multiplayer experience that handles real-world network hiccups gracefully (10s reconnection timer).

## 3. Scope & Constraints
*   **In Scope:**
    *   Desktop Web Browser support.
    *   Keyboard Controls (Arrow Keys & WASD).
    *   Single Player vs AI (Easy/Medium/Hard).
    *   Online Multiplayer via Room Codes.
    *   Responsive 2D Top-Down Visuals.
*   **Out of Scope:**
    *   Mobile/Touch support.
    *   Mouse controls.
    *   Power-ups or obstacles.
    *   User Accounts/Database persistence (beyond session).
*   **Risks:**
    *   **Latency:** Real-time physics over the web can be laggy. We need efficient networking.
    *   **Browser Compatibility:** Ensuring consistent performance across Chrome, Firefox, and Safari.

## 4. Technical Strategy (The "How")
We are building a **Real-Time Multiplayer Game** using a modern web stack.

*   **Backend:** Node.js + Socket.io (Authoritative Server).
    *   *Why:* Node.js is event-driven and perfect for handling many concurrent connections. Socket.io provides the WebSocket "tunnel" needed for real-time communication.
*   **Frontend:** HTML5 Canvas + Vanilla JavaScript.
    *   *Why:* Canvas is performant for 2D rendering. We avoid heavy frameworks (React/Vue) for the game loop to ensure maximum frame rate.
*   **Architecture:** Client-Server with Client-Side Prediction.
    *   *Why:* To prevent cheating and ensure consistency, the server decides the game state. To prevent "mushy" controls, the client predicts movement instantly.

## 5. Roadmap (The Epics)
*   **Epic 1: The Visual Foundation** - Creating the responsive table-tennis board and UI shell.
*   **Epic 2: Core Gameplay Physics** - Implementing the paddle movement, ball acceleration, and scoring logic.
*   **Epic 3: Single Player Intelligence** - Building the AI opponent and difficulty logic.
*   **Epic 4: Multiplayer Connectivity** - Enabling room codes, synchronization, and reconnection handling.

## 6. Glossary
*   **Authoritative Server:** The concept that the server is the "referee" and its version of the game state is the only one that matters.
*   **Client-Side Prediction:** A trick where the browser shows the player moving *before* the server confirms it, making the game feel responsive.
*   **WebSocket:** A communication protocol that keeps a connection open, allowing the server to push data to the client instantly (unlike standard HTTP).
*   **Game Loop:** A function that runs many times a second (e.g., 60 times) to update positions and redraw the screen.
