# 🔭 Project Vision: Paddle Panic (Refined v2)

**Date:** Mon Dec 22 2025
**Status:** Architecture Complete
**Phase:** 01_architecture

## 1. Elevator Pitch
*For **casual gamers and friends sharing a computer** who want **a quick, competitive test of skill without downloading software**, **Paddle Panic** is a **browser-based arcade game** that provides **instant, high-intensity gameplay with a unique accelerating ball mechanic**. Unlike **complex modern sports games or ad-heavy free sites**, our product offers a **pure, distraction-free retro experience with robust local multiplayer and challenging AI**.*

## 2. Business Goals
*   **Engagement:** Create a "just one more round" loop via the accelerating speed mechanic.
*   **Accessibility:** Ensure the game is playable instantly via a link on any standard desktop browser.
*   **Performance:** Maintain a steady 60 FPS to ensure fair competitive play.

## 3. Scope & Constraints
*   **In Scope:**
    *   Local Multiplayer (Same Keyboard).
    *   Single Player vs AI (3 Difficulties).
    *   Accelerating Ball Physics ("Panic" Mechanic).
    *   Retro Black & White Aesthetics.
*   **Out of Scope:**
    *   Online Multiplayer (Networked).
    *   Mobile/Touch Support (Strictly Desktop).
    *   User Accounts/Cloud Save.
*   **Risks & Mitigations:**
    *   **Risk:** Keyboard Ghosting (Hardware limitation).
    *   **Mitigation:** We will use a "Input State Map" to handle multiple key presses gracefully, though we cannot fix the physical hardware. We will choose default keys (W/S and Arrows) that are less prone to ghosting on common keyboards.

## 4. Technical Glossary
*   **Canvas API:** The HTML5 technology we use to draw graphics. Think of it as a digital whiteboard we wipe and redraw 60 times a second.
*   **Game Loop:** The heartbeat of the application. A function that runs continuously to Update positions and Draw the screen.
*   **AABB (Axis-Aligned Bounding Box):** A simple math trick to check if two rectangles are touching.
*   **State Map:** A way of tracking keyboard input where we remember "Is this key currently down?" rather than waiting for "Did the user just press this?".

## 5. Roadmap (The Epics)
*   **Epic 1: The Arena & Physics** - Establishing the core game loop, physics, and rules.
*   **Epic 2: Input & Control** - Implementing the dual-control scheme for local play.
*   **Epic 3: Game Intelligence** - Creating the AI opponents and game mode selection.
*   **Epic 4: Retro Experience** - Polishing the visuals and audio to match the 1970s arcade vibe.
