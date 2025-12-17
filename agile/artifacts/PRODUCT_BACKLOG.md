# Product Backlog: Paddle Panic

## Epic 1: Core Engine & Infrastructure
*   **Story 1.1:** Set up the project structure (HTML/CSS/JS files) and a fixed-resolution Canvas (800x600) centered on the screen.
*   **Story 1.2:** Implement the main Game Loop (Update/Draw cycle) to handle 60FPS rendering.
*   **Story 1.3:** Implement basic Input Handler to detect key presses (Arrow Keys, X, S) and store their state.

## Epic 2: Visual Assets & Rendering ("The Table")
*   **Story 2.1:** Draw the static background: Green/Blue board color, white border lines, and a center "Net" line.
*   **Story 2.2:** Render the Paddles as "Rackets" (Rectangular/Square shapes with handle details if possible, Red/Black colors).
*   **Story 2.3:** Render the Ball (White square or circle) and Scoreboard (Clean sans-serif font).

## Epic 3: Gameplay Mechanics (Pong Physics)
*   **Story 3.1:** Implement Paddle movement logic (Up/Down) constrained by the top and bottom walls.
*   **Story 3.2:** Implement Ball movement and collision logic:
    *   Bounces off Top/Bottom walls.
    *   Bounces off Paddles (reverses X direction).
    *   Resets to center if it passes a Paddle (Score event).
*   **Story 3.3:** Implement the "Win Condition": First player to 10 points triggers a "Game Over" state.

## Epic 4: Game Modes & AI
*   **Story 4.1:** Implement Local Multiplayer Logic (P1 vs P2) using the Input Handler.
*   **Story 4.2:** Implement Single Player AI (Base Logic): AI Paddle tracks the ball's Y-position.
*   **Story 4.3:** Implement AI Difficulty Tiers:
    *   *Easy:* Low speed, high reaction delay.
    *   *Medium:* Moderate speed.
    *   *Hard:* High speed, near-perfect tracking.

## Epic 5: User Interface (UI)
*   **Story 5.1:** Create a Start Menu Overlay (HTML/CSS) with:
    *   Button: "1 Player"
    *   Button: "2 Player"
    *   Dropdown: "Difficulty" (Visible only when 1 Player is selected).
*   **Story 5.2:** Connect Start Menu to Game State (Clicking "Start" initializes the game with chosen settings).
*   **Story 5.3:** Create a "Game Over" screen overlay displaying the winner and a "Play Again" button.

## Epic 6: Audio Polish (Enhancements)
*   **Story 6.1:** Implement an Audio Manager to load and play sounds.
*   **Story 6.2:** Add sound effects for:
    *   Ball hitting Paddle ("Thock").
    *   Ball hitting Wall (Optional soft click).
    *   Score/Win event (Celebratory sound).
