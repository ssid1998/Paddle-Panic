# Product Backlog: Paddle Panic

Status: **Inception Complete**

## 🏷️ Legend
*   `[FEAT]` **Feature:** Value for the user.
*   `[ARCH]` **Architecture:** Technical foundation.
*   `[DEBT]` **Technical Debt:** Cleanup work.

---

## 🚀 High Priority (The MVP)

### Epic 1: The Arena & Physics (Core Engine)
**Goal (Business Value):** Establish the fundamental rules of the game so that a match can be played from start to finish.
**Experience (User Experience):** A smooth, bug-free ball movement that accelerates over time, respecting the boundaries of the screen.

*   `[FEAT]` **Story 1.1: The Bounding Box**
    *   **As a** Player
    *   **I want** the ball to bounce perfectly off the top and bottom walls,
    *   **So that** I can use bank shots and the ball stays in play.
    *   **Demo:** Launch ball at an angle; observe it bounce off top/bottom and continue.
    *   *Acceptance Criteria:*
        *   Ball reverses Y-velocity upon hitting top or bottom canvas edge.
        *   Ball does NOT bounce off left/right edges (these are goals).
*   `[FEAT]` **Story 1.2: The "Panic" Acceleration**
    *   **As a** Competitive Player
    *   **I want** the ball to slightly increase in speed every time it hits a paddle,
    *   **So that** the rally becomes more intense the longer it lasts.
    *   **Demo:** Start a rally; observe the ball moving significantly faster after 10 hits.
    *   *Acceptance Criteria:*
        *   Ball speed increases by a small factor (e.g., 5-10%) on every paddle collision.
        *   Speed resets to base level when a point is scored.
*   `[FEAT]` **Story 1.3: Scoring & Reset**
    *   **As a** Player
    *   **I want** the ball to reset to the center after a point is scored,
    *   **So that** we can catch our breath before the next round.
    *   **Demo:** Let ball pass paddle; score updates; ball reappears in center.
    *   *Acceptance Criteria:*
        *   Score increments for the opposite player when ball passes a paddle.
        *   Ball resets to center (X, Y) with zero or low velocity before serving.
*   `[FEAT]` **Story 1.4: The 11-Point Limit**
    *   **As a** Player
    *   **I want** the game to end immediately when someone reaches 11 points,
    *   **So that** matches are short and decisive.
    *   **Demo:** Play until score is 11-10; Game Over screen appears.
    *   *Acceptance Criteria:*
        *   Game loop stops when score reaches 11.
        *   Winner is displayed clearly.
*   `[FEAT]` **Story 1.5: Collision Precision**
    *   **As a** Player
    *   **I want** the ball to bounce off the front of my paddle,
    *   **So that** the game feels fair and responsive.
    *   **Demo:** Move paddle into ball path; ball bounces back.
    *   *Acceptance Criteria:*
        *   Collision detection checks ball coordinates against paddle rectangle.
        *   Ball reverses X-velocity upon hitting paddle.

### Epic 2: Input & Control (The Interface)
**Goal (Business Value):** Enable two players to play simultaneously on one device without hardware conflicts.
**Experience (User Experience):** Responsive keyboard controls where both players can move at the same time.

*   `[FEAT]` **Story 2.1: Player 1 Controls (W/S)**
    *   **As** Player 1 (Left Side)
    *   **I want to** use the 'W' key to move up and 'S' key to move down,
    *   **So that** I can control my paddle comfortably with my left hand.
    *   **Demo:** Press W/S; Left paddle moves up/down.
    *   *Acceptance Criteria:*
        *   'W' decreases paddle Y. 'S' increases paddle Y.
        *   Paddle stops at screen edges.
*   `[FEAT]` **Story 2.2: Player 2 Controls (Arrows)**
    *   **As** Player 2 (Right Side)
    *   **I want to** use the 'Up Arrow' and 'Down Arrow' keys,
    *   **So that** I can play against Player 1 without our hands crossing.
    *   **Demo:** Press Arrows; Right paddle moves up/down.
    *   *Acceptance Criteria:*
        *   Up Arrow decreases paddle Y. Down Arrow increases paddle Y.
*   `[FEAT]` **Story 2.3: Simultaneous Input**
    *   **As a** Duo
    *   **I want** both paddles to move at the same time if we press keys simultaneously,
    *   **So that** neither player is "locked out" during intense moments.
    *   **Demo:** Hold 'W' and 'Up Arrow' together; both paddles move up smoothly.
    *   *Acceptance Criteria:*
        *   Input handling uses a "key state" map (boolean flags) rather than single key events to allow multi-key processing.
*   `[FEAT]` **Story 2.4: The Pause Function**
    *   **As a** Player
    *   **I want to** press 'P' or 'Esc' to freeze the game,
    *   **So that** I can answer the phone without losing a point.
    *   **Demo:** Press 'P'; ball stops moving. Press 'P' again; game resumes.
    *   *Acceptance Criteria:*
        *   Game loop update logic is skipped when paused.
        *   "PAUSED" text appears on screen.
*   `[ARCH]` **Story 2.5: Desktop Enforcement**
    *   **As a** Developer
    *   **I want** the game to listen for keyboard events specifically,
    *   **So that** the core mechanics work reliably on the intended hardware.
    *   **Demo:** Open on desktop; controls work.
    *   *Acceptance Criteria:*
        *   Event listeners attached to `window` for `keydown` and `keyup`.

---

## 📅 Medium Priority (Features & Polish)

### Epic 3: Game Intelligence (AI & Modes)
**Goal (Business Value):** Expand the audience to solo players.
**Experience (User Experience):** A main menu allowing selection of opponent type and difficulty.

*   `[FEAT]` **Story 3.1: Main Menu Navigation**
    *   **As a** User
    *   **I want to** see a start screen where I can choose "1 Player" or "2 Player",
    *   **So that** I don't accidentally start a match I can't play.
    *   **Demo:** Load page; see buttons. Click "1 Player"; game starts with AI.
    *   *Acceptance Criteria:*
        *   Start screen overlay before game loop begins.
        *   Clicking options sets the game mode state.
*   `[FEAT]` **Story 3.2: AI Difficulty Selector**
    *   **As a** Solo Player
    *   **I want to** choose between Easy, Medium, and Hard,
    *   **So that** I can find a challenge that matches my skill level.
    *   **Demo:** Select "Hard"; AI is very fast. Select "Easy"; AI is slow.
    *   *Acceptance Criteria:*
        *   Difficulty selection available when "1 Player" is chosen.
        *   Sets a variable (e.g., `aiSpeed` or `aiReactionTime`).
*   `[FEAT]` **Story 3.3: AI Behavior (Easy)**
    *   **As a** Beginner
    *   **I want** the Easy AI to move slowly and occasionally miss the ball,
    *   **So that** I can win and feel good while learning.
    *   **Demo:** Play Easy mode; observe AI lagging behind fast balls.
    *   *Acceptance Criteria:*
        *   AI paddle moves slower than the ball's max speed.
*   `[FEAT]` **Story 3.4: AI Behavior (Hard)**
    *   **As a** Veteran
    *   **I want** the Hard AI to track the ball perfectly and react quickly,
    *   **So that** I am forced to play my absolute best.
    *   **Demo:** Play Hard mode; AI rarely misses.
    *   *Acceptance Criteria:*
        *   AI paddle tracks ball Y position with high speed/precision.
*   `[FEAT]` **Story 3.5: Mode Persistence**
    *   **As a** Player
    *   **I want** the game to remember my mode choice if I hit "Rematch",
    *   **So that** I don't have to go back to the menu every time.
    *   **Demo:** Finish game; click Rematch; restarts with same settings.
    *   *Acceptance Criteria:*
        *   Game Over screen offers "Rematch" button.
        *   Resets score but keeps Mode/Difficulty settings.

### Epic 4: Retro Experience (Audio/Visual)
**Goal (Business Value):** Create a cohesive aesthetic that appeals to retro fans.
**Experience (User Experience):** Minimalist black and white visuals with crunchy 8-bit sounds.

*   `[FEAT]` **Story 4.1: High-Contrast Visuals**
    *   **As a** Retro Fan
    *   **I want** a stark black background and bright white square assets,
    *   **So that** the game looks like a classic 1970s arcade cabinet.
    *   **Demo:** Observe game; no colors other than B&W.
    *   *Acceptance Criteria:*
        *   Canvas background is #000000.
        *   Paddles and Ball are #FFFFFF.
        *   No round shapes (rectangles only).
*   `[FEAT]` **Story 4.2: The "Beep" (Paddle Hit)**
    *   **As a** Player
    *   **I want to** hear a short, sharp "beep" sound when the ball hits a paddle,
    *   **So that** I have audio confirmation of the impact.
    *   **Demo:** Ball hits paddle; sound plays.
    *   *Acceptance Criteria:*
        *   Audio triggers on collision event.
        *   Short duration (<0.1s) square wave or similar.
*   `[FEAT]` **Story 4.3: Scoring Sound**
    *   **As a** Player
    *   **I want to** hear a distinct sound when a point is scored,
    *   **So that** I know the round is over without looking at the score.
    *   **Demo:** Ball hits wall; "Buzzer" sound plays.
    *   *Acceptance Criteria:*
        *   Distinct sound from the paddle hit.
*   `[FEAT]` **Story 4.4: Victory Fanfare**
    *   **As a** Winner
    *   **I want to** hear a short musical jingle when I reach 11 points,
    *   **So that** the victory feels rewarding.
    *   **Demo:** Win game; Jingle plays.
    *   *Acceptance Criteria:*
        *   Plays only on Game Over state.
*   `[FEAT]` **Story 4.5: Scoreboard UI**
    *   **As a** Spectator
    *   **I want** the score to be displayed in a large, blocky font at the top,
    *   **So that** the game state is always clear.
    *   **Demo:** Look at top center; see "0 - 0".
    *   *Acceptance Criteria:*
        *   Text centered at top of canvas.
        *   Updates immediately on score change.
