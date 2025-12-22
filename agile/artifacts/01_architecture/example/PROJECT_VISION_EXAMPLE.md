# 🔭 Project Vision: Pac-Party-Web (Technical v2)

**Date:** Tue Dec 16 2025
**Status:** Architecture Definition Complete
**Tech Stack:** Node.js, Socket.io, HTML5 Canvas

## 1. Elevator Pitch
For **students and visitors at the fair** who want **instant, accessible entertainment**, **Pac-Party-Web** is a browser-based multiplayer arcade game. It provides a chaotic 1-vs-4 experience (Pacman vs. Ghosts) on a big screen, controlled by the visitors' own smartphones.

Unlike traditional console setups that require controllers or app installations, our product allows anyone to jump in immediately by simply scanning a QR code. This demonstrates the power of modern real-time web technologies (Node.js/WebSockets) in a tangible, fun way.

## 2. Business Goals
Why are we building this? This project serves three strategic purposes:

*   **Tech Demo Showcase:** The primary goal is to demonstrate competence in modern web engineering. By building a high-concurrency, low-latency system in Node.js, we show prospective students and industry partners that we can handle complex real-time challenges.
*   **High Throughput & Engagement:** At a fair, attention spans are short. We need a game that enforces short sessions (max 3 minutes) and allows for quick "drop-in/drop-out" mechanics so that hundreds of visitors can play throughout the day.
*   **Crowd Attraction (The Spectacle):** The game isn't just for the players; it's for the crowd. The Big Screen view must be visually engaging (60fps, neon graphics) to draw people to the booth from a distance.

## 3. Scope & Constraints
To ensure we deliver a robust demo on time, we have defined strict boundaries for the project.

### In Scope
*   **Local Infrastructure:** The system will run on a local laptop acting as both the server and the "Big Screen" host, connected to a dedicated Wi-Fi router to minimize latency.
*   **Asymmetric Multiplayer:** We support exactly 5 players: 1 Pacman and 4 Ghosts.
*   **Mobile Controller:** The player interface runs in the mobile browser (Safari/Chrome). It provides a simple D-Pad control scheme.
*   **Visual Feedback Loop:** We prioritize rendering the game state early. Even in the first version, movement must be visible on the screen to verify the network connection.

### Out of Scope
*   **Online/Cloud Hosting:** We assume local LAN only. No internet latency optimization needed.
*   **Persistent Accounts:** No login or database. All state is held in memory (RAM). When the server restarts, the high score is gone.
*   **Native Apps:** We will not build iOS or Android apps. The web is the platform.

### Critical Risks
*   **Wi-Fi Congestion:** Trade fairs are hostile RF environments. Packet loss is guaranteed. Our architecture (Socket.io with auto-reconnect) must handle this gracefully without crashing the game loop.

## 4. Strategic Roadmap (The Epics)
How do we get there? We will build the system in a logical sequence that prioritizes risk reduction and early visual feedback.

### Epic 1: The Connectivity Skeleton (Foundation)
*Goal: Prove that the phone can talk to the screen.*
We start here because connectivity is our biggest risk. We will build the Node.js server and a minimal "Big Screen" client that renders a moving square. This gives us immediate visual feedback: "I press a button, and the square moves."

### Epic 2: The Core Game Engine (Logic)
*Goal: Make it a game.*
Once the connection is stable, we implement the authoritative game rules on the server: The Maze, Collision Detection (Walls), and the 1-vs-4 logic. We continue to visualize this on the Big Screen, moving from a square to actual sprites on a grid.

### Epic 3: The Polish & Experience (Juice)
*Goal: Make it fun.*
Finally, we upgrade the visuals. We replace the debug graphics with Neon-style rendering on the Canvas. We add the 3-minute hard timer, the lobby QR code generation, and particle effects for eating dots. This transforms the prototype into a showpiece.
