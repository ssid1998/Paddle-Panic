# Project Vision: Paddle Panic

## 1. Vision Statement
**For** instructors and peers in the Advanced Project Management course,
**Who** value clean software architecture and reliable implementation,
**The** Paddle Panic
**Is a** browser-based arcade game
**That** provides a polished, bug-free recreation of classic Pong with a "Table Tennis" aesthetic.
**Unlike** generic, abstract Pong clones or complex physics simulations,
**Our Product** focuses on a professional "Skeuomorphic Retro" look, robust AI difficulty settings, and a stable, documented codebase suitable for a technical portfolio.

## 2. Business Goals & Success Criteria
*   **Primary Goal:** Demonstrate mastery of clean code, project management, and documentation.
*   **User Experience:** Deliver a "pick-up-and-play" experience with zero setup or installation required.
*   **Stability:** Achieve a bug-free "Happy Path" for the core gameplay loop (Start -> Play -> Win -> Reset).
*   **Aesthetic:** Successfully evoke the feeling of a Table Tennis match through visual design while maintaining the simplicity of Pong physics.

## 3. Scope & Constraints
### In Scope (MVP)
*   **Platform:** Web Browser (HTML5 Canvas + JavaScript).
*   **Resolution:** Fixed resolution (e.g., 800x600) centered on the page.
*   **Modes:**
    *   Single Player (Human vs. AI).
    *   Local Multiplayer (Human vs. Human on one keyboard).
*   **AI:** Three difficulty levels (Easy, Medium, Hard).
*   **Controls:** Keyboard input (Arrows for P1, X/S for P2).
*   **Visuals:** Top-down Table Tennis table (Green/Blue), Net, Racket-styled paddles.
*   **Audio:** Simple sound effects (Paddle Hit, Win Fanfare).
*   **UI:** HTML Overlay for Start Menu (Mode & Difficulty selection).

### Out of Scope
*   Online Multiplayer (Networked play).
*   Complex Physics (Spin, gravity, air resistance).
*   Mobile Touch Controls.
*   Persistent High Score Database.

## 4. High-Level Architecture
*   **Frontend:** Vanilla JavaScript (ES6+), HTML5 Canvas for rendering.
*   **State Management:** Simple Game Loop pattern (Update -> Draw).
*   **Deployment:** Static web hosting (e.g., GitHub Pages).
