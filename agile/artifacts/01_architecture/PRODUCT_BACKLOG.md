# Product Backlog: Paddle Panic (Technical Refinement)

**Status:** Phase 1 (Architecture) Complete
**Focus:** Transforming the "Product Vision" into a "Technical Plan".

## 📖 Introduction
This backlog represents the technical evolution of our initial product ideas. While Phase 0 focused on *what* the user experiences, this document adds the *how*—specifically, how we will use **Vanilla JavaScript and HTML5 Canvas** to build a high-performance arcade game.

We have structured the work into a chronological **Execution Plan**. We do not build everything at once; we build in layers of complexity to manage risk.

---

## 🗺️ Execution Plan (Sprints)

### Phase 1: The Engine (Sprint 1.1)
**Goal:** Prove that the "Game Loop" and "Input System" work smoothly. We need to verify 60 FPS movement before we add game rules.

*   `[ARCH]` **Story 0.1: Project Scaffold & Canvas Setup**
    *   **Context:** We need a place to draw.
    *   **Technical Approach:** Create `index.html` with a `<canvas>` element centered on the screen. Create `src/main.js` and set up the `requestAnimationFrame` loop.
*   `[ARCH]` **Story 0.2: The Input State Map**
    *   **Context:** We need smooth movement, not "typewriter" stutter.
    *   **Technical Approach:** Create an `Input` class that listens for `keydown` and `keyup`. It will store the state of keys in an object (e.g., `{ ArrowUp: true }`).
*   `[FEAT]` **Story 1.1: The Bounding Box (Ball Physics)**
    *   **Context:** The ball needs to move and bounce.
    *   **Technical Approach:** Create a `Ball` class with `x, y, dx, dy`. In the update loop, add velocity to position. If `y < 0` or `y > height`, reverse `dy`.
*   `[FEAT]` **Story 2.1 & 2.2: Paddle Movement**
    *   **Context:** Players need to move.
    *   **Technical Approach:** Create a `Paddle` class. In the update loop, check the `Input` object. If 'W' is true, decrease `y`. Constrain `y` so the paddle doesn't leave the screen.

### Phase 2: The Game (Sprint 1.2)
**Goal:** Implement the rules. Scoring, Collision, and Win States.

*   `[FEAT]` **Story 1.5: Collision Precision (AABB)**
    *   **Context:** The ball must bounce off paddles.
    *   **Technical Approach:** Implement Axis-Aligned Bounding Box logic. Check if the Ball's rectangle overlaps with the Paddle's rectangle. If so, reverse `dx` and slightly increase speed.
*   `[FEAT]` **Story 1.2: The "Panic" Acceleration**
    *   **Context:** The game gets faster.
    *   **Technical Approach:** On every paddle collision, multiply velocity by 1.05 (5% increase). Reset speed on score.
*   `[FEAT]` **Story 1.3: Scoring & Reset**
    *   **Context:** Someone needs to win.
    *   **Technical Approach:** If `ball.x < 0` (Player 2 scores) or `ball.x > width` (Player 1 scores), increment score variables, reset ball to center, and reset speed.

### Phase 3: The Polish (Sprint 1.3)
**Goal:** Make it fun. AI, Sound, and Visuals.

*   `[FEAT]` **Story 3.3: AI Behavior (Simple)**
    *   **Context:** Single player mode.
    *   **Technical Approach:** Create a simple AI that looks at `ball.y`. If `ball.y > paddle.y`, move down. If `ball.y < paddle.y`, move up. Add a "max speed" limit so it's beatable.
*   `[FEAT]` **Story 4.2: Audio System**
    *   **Context:** Feedback.
    *   **Technical Approach:** Create an `Audio` helper. Load simple `.wav` files. Play "beep" on collision and "buzz" on score.

---

## 📦 Full Story Repository (Epics)

*This section lists all original User Stories, preserved for reference.*

### Epic 1: The Arena & Physics (Core Engine)
**Goal:** Establish the fundamental rules.

*   **Story 1.1:** As a Player, I want the ball to bounce off walls...
    *   *Tech Note:* Simple Y-velocity inversion.
*   **Story 1.2:** As a Competitive Player, I want the ball to accelerate...
    *   *Tech Note:* Multiply velocity vector by 1.05 on paddle hit.
*   **Story 1.3:** As a Player, I want the ball to reset after scoring...
    *   *Tech Note:* Reset X/Y to center, randomize initial Y direction.
*   **Story 1.4:** As a Player, I want the game to end at 11 points...
    *   *Tech Note:* Check score variables in the update loop.
*   **Story 1.5:** As a Player, I want precise paddle collision...
    *   *Tech Note:* Use AABB (Axis-Aligned Bounding Box) collision.

### Epic 2: Input & Control (The Interface)
**Goal:** Enable two players to play simultaneously.

*   **Story 2.1:** As Player 1, I want to use W/S...
    *   *Tech Note:* Map 'KeyW' and 'KeyS' in Input Manager.
*   **Story 2.2:** As Player 2, I want to use Arrows...
    *   *Tech Note:* Map 'ArrowUp' and 'ArrowDown' in Input Manager.
*   **Story 2.3:** As a Duo, I want simultaneous input...
    *   *Tech Note:* **CRITICAL:** Use state-based input (booleans), not event-based movement.
*   **Story 2.4:** As a Player, I want to pause...
    *   *Tech Note:* Toggle a `isPaused` boolean. If true, skip the `update()` loop but keep `draw()`.
*   **Story 2.5:** As a Developer, I want desktop enforcement...
    *   *Tech Note:* Implicit in design; no touch controls implemented.

### Epic 3: Game Intelligence (AI & Modes)
**Goal:** Expand the audience to solo players.

*   **Story 3.1:** As a User, I want a Main Menu...
    *   *Tech Note:* Simple HTML overlay `div` that is hidden when game starts.
*   **Story 3.2:** As a Solo Player, I want difficulty selection...
    *   *Tech Note:* Adjusts the `maxSpeed` and `reactionDelay` of the AI paddle.
*   **Story 3.3:** As a Beginner, I want Easy AI...
    *   *Tech Note:* AI moves at 50% of ball speed.
*   **Story 3.4:** As a Veteran, I want Hard AI...
    *   *Tech Note:* AI moves at 90% of ball speed.
*   **Story 3.5:** As a Player, I want mode persistence...
    *   *Tech Note:* Store settings in a global `GameConfig` object.

### Epic 4: Retro Experience (Audio/Visual)
**Goal:** Create a cohesive aesthetic.

*   **Story 4.1:** As a Retro Fan, I want high-contrast visuals...
    *   *Tech Note:* Canvas `fillStyle = 'white'` on black background.
*   **Story 4.2:** As a Player, I want a "beep" on hit...
    *   *Tech Note:* HTML5 Audio or Web Audio API oscillator.
*   **Story 4.3:** As a Player, I want a scoring sound...
    *   *Tech Note:* Distinct lower-pitch sound.
*   **Story 4.4:** As a Winner, I want a victory fanfare...
    *   *Tech Note:* Play sound on Game Over state.
*   **Story 4.5:** As a Spectator, I want a Scoreboard...
    *   *Tech Note:* `ctx.fillText()` centered at top of screen.
