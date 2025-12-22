# Product Backlog: Paddle-Panic

Status: **Inception Complete**

## 🏷️ Legend
*   `[FEAT]` **Feature:** Value for the user.
*   `[ARCH]` **Architecture:** Technical foundation.
*   `[UX]` **User Experience:** Visuals and Interaction.

---

## 🚀 High Priority (Phase 1: The Foundation)

### Epic 1: The Visual Foundation
**Goal (Business Value):** Establish the visual identity and ensure the game is playable on different screen sizes.
**Experience (User Experience):** A clean, top-down view of a green/blue ping pong table with a net, white lines, and paddles that scale when I resize my browser.

*   `[UX]` **Story 1.1: The Table Tennis Board**
    *   **As a** Player
    *   **I want to** see a realistic-looking 2D top-down table (green/blue surface, white borders, net line),
    *   **So that** it feels like I'm playing Table Tennis, not just abstract Pong.
    *   **Demo:** A static HTML/Canvas render of the board.
    *   *Acceptance Criteria:*
        *   Background color is distinct (Green or Blue).
        *   White boundary lines are visible.
        *   Net is clearly indicated in the center.

*   `[UX]` **Story 1.2: Responsive Scaling**
    *   **As a** Player with a small laptop screen
    *   **I want** the game board to shrink proportionally when I resize my browser window,
    *   **So that** I can always see the full play area without scrolling.
    *   **Demo:** Resizing the browser window keeps the aspect ratio intact.
    *   *Acceptance Criteria:*
        *   Game maintains aspect ratio.
        *   No part of the board is cut off on standard resolutions (1366x768 and up).

*   `[UX]` **Story 1.3: Paddle & Ball Assets**
    *   **As a** Player
    *   **I want to** see distinct rectangular paddles (Red vs Blue) and a round white ball,
    *   **So that** I can clearly distinguish my character from the opponent and the projectile.
    *   **Demo:** Paddles and ball rendered in starting positions.

*   `[UX]` **Story 1.4: Scoreboard UI**
    *   **As a** Player
    *   **I want to** see a clear score display (e.g., "0 - 0") at the top of the screen,
    *   **So that** I always know the state of the match.
    *   **Demo:** Static score numbers rendered on the UI layer.

*   `[UX]` **Story 1.5: Audio Foundation**
    *   **As a** Player
    *   **I want to** hear a sound when the ball hits a paddle or wall,
    *   **So that** the game feels physical and responsive.
    *   **Demo:** "Ping" sound plays on trigger.

### Epic 2: Core Gameplay Physics
**Goal (Business Value):** Create a fun, fair, and skill-based physics engine.
**Experience (User Experience):** Smooth paddle movement using keyboard keys, and a ball that speeds up to create tension.

*   `[FEAT]` **Story 2.1: Keyboard Controls**
    *   **As a** Player
    *   **I want to** move my paddle Up and Down using either Arrow Keys or WASD,
    *   **So that** I can block the ball comfortably with my preferred hand position.
    *   **Demo:** Pressing 'W' moves left paddle up; 'S' moves it down.
    *   *Acceptance Criteria:*
        *   Support Arrow Up/Down.
        *   Support W/S keys.
        *   Movement stops when key is released.

*   `[FEAT]` **Story 2.2: Ball Movement & Collision**
    *   **As a** Player
    *   **I want** the ball to bounce off the top/bottom walls and my paddle,
    *   **So that** the rally continues.
    *   **Demo:** Ball bouncing indefinitely in a closed box.
    *   *Acceptance Criteria:*
        *   Angle of reflection is correct.
        *   Ball does not get stuck in the paddle.

*   `[FEAT]` **Story 2.3: Acceleration Mechanic**
    *   **As a** Competitive Player
    *   **I want** the ball to get slightly faster every time it hits a paddle,
    *   **So that** long rallies become intense and harder to sustain.
    *   **Demo:** Visual speed increase after 5-6 hits.
    *   *Acceptance Criteria:*
        *   Speed increases by X% per hit.
        *   Speed resets to base level after a point is scored.

*   `[FEAT]` **Story 2.4: Scoring Logic**
    *   **As a** Player
    *   **I want** to earn a point when the ball passes the opponent's paddle,
    *   **So that** I can win the game.
    *   **Demo:** Ball passing paddle updates score to "1-0" and resets ball.
    *   *Acceptance Criteria:*
        *   Ball resets to center.
        *   Serve direction randomizes or alternates.

*   `[FEAT]` **Story 2.5: Win Condition**
    *   **As a** Player
    *   **I want** the game to end when someone reaches 11 points,
    *   **So that** we have a clear winner.
    *   **Demo:** "Player 1 Wins" message appears at score 11.

---

## 📅 Medium Priority (Phase 2: The Logic)

### Epic 3: Single Player Intelligence
**Goal (Business Value):** Allow users to practice or play offline.
**Experience (User Experience):** Selecting a difficulty and playing against a CPU that doesn't just cheat but plays fairly.

*   `[FEAT]` **Story 3.1: Difficulty Selector**
    *   **As a** Solo Player
    *   **I want to** choose between Easy, Medium, and Hard before the game starts,
    *   **So that** I can match the challenge to my skill level.
    *   **Demo:** Menu screen with 3 buttons.

*   `[FEAT]` **Story 3.2: Basic AI (Easy)**
    *   **As a** Beginner
    *   **I want** the CPU to move slowly and sometimes miss the ball,
    *   **So that** I can win and feel good.
    *   **Demo:** CPU paddle tracking ball with a delay/low speed cap.

*   `[FEAT]` **Story 3.3: Advanced AI (Hard)**
    *   **As a** Pro
    *   **I want** the CPU to track the ball perfectly and react fast,
    *   **So that** I am genuinely challenged.
    *   **Demo:** CPU paddle tracking ball with high speed/prediction.

*   `[FEAT]` **Story 3.4: Pause Functionality**
    *   **As a** Solo Player
    *   **I want to** press ESC to pause the game,
    *   **So that** I can take a break without losing.
    *   **Demo:** Game freezes, "Paused" overlay appears.
    *   *Acceptance Criteria:*
        *   Only works in Single Player.
        *   Pressing ESC again resumes.

*   `[FEAT]` **Story 3.5: Single Player "Rematch"**
    *   **As a** Solo Player
    *   **I want to** instantly restart the match against the AI after winning/losing,
    *   **So that** I can keep practicing.

---

## 🔧 Complex Priority (Phase 3: Connectivity)

### Epic 4: Multiplayer Connectivity
**Goal (Business Value):** The core selling point - playing with friends remotely.
**Experience (User Experience):** Creating a room, sharing a code, and playing a lag-free match.

*   `[FEAT]` **Story 4.1: Room Creation & Codes**
    *   **As a** Host
    *   **I want to** generate a unique Room Code (e.g., "PADDLE-88"),
    *   **So that** I can invite a friend.
    *   **Demo:** "Create Room" button displays a code.

*   `[FEAT]` **Story 4.2: Joining a Room**
    *   **As a** Guest
    *   **I want to** enter a Room Code and a Nickname,
    *   **So that** I can connect to the Host's game.
    *   **Demo:** Two browsers connected, status changes to "Connected".

*   `[FEAT]` **Story 4.3: Game State Synchronization**
    *   **As a** Player
    *   **I want** to see the ball and paddles in the same position as my opponent,
    *   **So that** the game is fair.
    *   **Demo:** Moving paddle on Screen A moves it on Screen B instantly.

*   `[FEAT]` **Story 4.4: Reconnection Timer**
    *   **As a** Player whose internet flickered
    *   **I want** the game to pause for 10 seconds and let me rejoin,
    *   **So that** I don't lose instantly due to a glitch.
    *   **Demo:** Simulating network disconnect triggers countdown UI.

*   `[FEAT]` **Story 4.5: Multiplayer Rematch**
    *   **As a** Winner
    *   **I want to** click "Rematch" and wait for my opponent to agree,
    *   **So that** we can play again without creating a new room.
    *   **Demo:** Both players click "Rematch" -> Score resets to 0-0.

---

## 🧊 Icebox (Nice to Have)
*   **Spectator Mode:** Watching a game via room code without playing.
*   **Chat:** Simple text chat in the lobby.
*   **Custom Colors:** Choosing paddle colors.
