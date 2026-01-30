# 🛠️ Technology Stack & Architecture

**Status:** Technical Standard
**Project:** Pac-Party-Web

This document serves as the "Instruction Manual" for our technology choices. It explains not just *what* we use, but *why* we use it, ensuring that every developer understands the architectural philosophy.

## 1. The Core Stack (Our Toolbox)

### Runtime: **Node.js**
*   **What is it?** A JavaScript runtime built on Chrome's V8 engine. It allows us to run JavaScript on the server (the laptop), not just in the browser.
*   **Why we chose it:**
    *   **Unified Language:** We can write the game logic (movement, collision) once in JavaScript and use it on both the server (to validate) and the client (to predict). This saves time and reduces bugs.
    *   **Event-Driven:** Node.js is designed to handle thousands of small events (like "Player moved left") simultaneously without blocking. This is perfect for a multiplayer game.

### Communication: **Socket.io**
*   **What is it?** A library that enables real-time, bidirectional communication between web clients and servers. It upgrades standard HTTP requests to persistent **WebSockets**.
*   **Why we chose it:**
    *   **The "Phone Line" Analogy:** Traditional websites work like "Mail": You send a letter (Request) and wait for a reply (Response). Socket.io works like a "Phone Call": The line is open, and both sides can talk instantly.
    *   **Resilience:** The critical feature for our fairground use case is **Auto-Reconnection**. If a student's Wi-Fi drops for a second, Socket.io buffers the events and reconnects automatically. Raw WebSockets would require us to write this complex logic ourselves.

### Rendering: **HTML5 Canvas**
*   **What is it?** A native HTML element (`<canvas>`) that provides a drawing area where we can manipulate pixels using JavaScript.
*   **Why we chose it:**
    *   **Performance:** We need to render a maze, 5 players, and particles at 60 frames per second on a large screen. Creating thousands of HTML elements (`<div>`) for every dot would be too slow ("DOM Thrashing"). Canvas allows us to "paint" the frame efficiently.

### Client Framework: **Vanilla JavaScript (No Framework)**
*   **What is it?** Using plain JavaScript without libraries like React, Vue, or Angular.
*   **Why we chose it:**
    *   **Load Time:** At a fair, every millisecond counts. Downloading a 2MB React bundle over 3G takes too long. Our Vanilla JS controller will be <50KB and load instantly.
    *   **Simplicity:** We don't need complex state management for a D-Pad.

## 2. Architectural Patterns

### The "Authoritative Server"
In multiplayer games, you can't trust the players.
*   **How it works:** The players' phones are just "Remote Controls". They send intent (`PRESSED_UP`). They do **not** calculate where Pacman is.
*   **The Truth:** The Node.js server receives the intent, checks if the move is valid (is there a wall?), updates the official position, and broadcasts the new state to everyone.
*   **Benefit:** No cheating. Even if a player hacks their phone to say "I am at position 100,100", the server ignores it because it only accepts input, not coordinates.

### The "In-Memory" State
*   **Decision:** We do not use a database (SQL/NoSQL).
*   **Why:** A game round lasts 3 minutes. After that, the state is irrelevant. Writing to a hard drive is too slow for a 60fps game. We keep everything in the server's RAM (Variables). If the server crashes, the current game is lost, but that is an acceptable risk for a casual fair game.
