# Product Backlog: Paddle Panic (Technical Refinement)

**Status:** Architecture Complete
**Phase:** 01_architecture
**Focus:** Transforming the "Product Vision" into a "Technical Plan"

---

## Introduction

This backlog represents the technical evolution of our initial product ideas. While Phase 0 focused on *what* the user experiences, this document adds the *how*—specifically, how we will use **Node.js, Socket.io, and HTML5 Canvas** to build a real-time multiplayer game.

We have structured the work into a chronological **Execution Plan**. We do not build everything at once; we build in layers to manage risk and ensure each piece works before adding the next.

---

## Legend

| Tag | Meaning |
|-----|---------|
| `[FEAT]` | **Feature** - Delivers value to the user |
| `[TECH-ENABLER]` | **Technical Enabler** - Foundation that makes features possible |
| `[ARCH-ADD]` | **Architecture Addition** - Technical task added during architecture phase |

---

## Execution Plan (Phases)

---

### Phase 1: Technical Foundation (The "Walking Skeleton")

**Goal:** Prove that a phone can move a paddle on the big screen with minimal latency. If this doesn't work, nothing else matters.

**Why start here?** This is the **riskiest part** of the project. Real-time communication is the core of everything. We test it first.

---

#### `[TECH-ENABLER]` Story 0.1: Project Initialization & Scaffold

*   **Context:** Before we can write any game code, we need a clean project structure.
*   **Technical Approach:** 
    *   Initialize a new Node.js project using `npm init`
    *   Install dependencies: `express`, `socket.io`, `qrcode`
    *   Create folder structure: `src/server/`, `src/client/host/`, `src/client/controller/`
    *   Configure `package.json` with start script
*   **Rationale:** A well-organized project is easier to maintain and understand.
*   *Acceptance Criteria:*
    *   Running `npm start` launches the server
    *   Server logs "Paddle Panic server running on port 3000"

---

#### `[TECH-ENABLER]` Story 0.2: Express Server Setup

*   **Context:** We need a web server to serve our HTML pages.
*   **Technical Approach:**
    *   Create Express app in `src/server/index.js`
    *   Serve static files from `src/client/`
    *   Route `/` to host screen, `/controller` to mobile controller
*   **Rationale:** Express is the industry-standard way to serve web pages with Node.js.
*   *Acceptance Criteria:*
    *   Navigating to `http://localhost:3000` shows host page
    *   Navigating to `http://localhost:3000/controller` shows controller page

---

#### `[TECH-ENABLER]` Story 0.3: Socket.io Integration

*   **Context:** We need real-time, two-way communication between server and browsers.
*   **Technical Approach:**
    *   Integrate Socket.io with Express server
    *   Add Socket.io client scripts to host and controller pages
    *   Implement basic "ping/pong" test event
    *   Log connections: "New client connected: [socket.id]"
*   **Rationale:** Socket.io provides the instant communication that makes the game playable. Without it, every action would take seconds.
*   *Acceptance Criteria:*
    *   Opening host page shows "Connected to server" in console
    *   Opening controller page shows "Connected to server" in console
    *   Server logs each connection

---

#### `[TECH-ENABLER]` Story 0.4: Basic Canvas Setup

*   **Context:** The host screen needs a drawing surface for the game.
*   **Technical Approach:**
    *   Add `<canvas>` element to host page, sized to fill screen
    *   Create basic render loop using `requestAnimationFrame`
    *   Draw a simple rectangle (representing a paddle) at a fixed position
*   **Rationale:** Canvas is the standard for high-performance 2D graphics in browsers. The render loop is needed for smooth animation.
*   *Acceptance Criteria:*
    *   Host page shows a colored rectangle on a table-colored background
    *   No flickering or performance issues

---

#### `[FEAT]` Story 0.5: Basic Controller Buttons (UP/DOWN)

*   **As a** Developer testing the system,
*   **I want** two large buttons on the controller page,
*   **So that** I can test sending input to the server.
*   **Technical Approach:**
    *   Create two `<button>` elements styled to fill half the screen each
    *   Bind `touchstart` events (not `click` - faster response)
    *   Emit Socket.io events: `socket.emit('input', { direction: 'UP' })`
    *   Prevent default touch behaviors (zooming, scrolling) with CSS
*   **Rationale:** Using `touchstart` instead of `click` removes the 300ms delay on mobile browsers.
*   *Acceptance Criteria:*
    *   Pressing UP button sends event to server (visible in server logs)
    *   Pressing DOWN button sends event to server
    *   Page doesn't zoom or scroll when pressing buttons

---

#### `[FEAT]` Story 0.6: Paddle Responds to Input

*   **As a** Developer testing the system,
*   **I want** the paddle on the host screen to move when I press buttons on my phone,
*   **So that** I can verify real-time communication works.
*   **Technical Approach:**
    *   Server receives `input` events and updates paddle position
    *   Server broadcasts new game state to host screen
    *   Host screen redraws paddle at new position
*   **Rationale:** This is the fundamental proof that our architecture works. If this succeeds, we can build everything else.
*   *Acceptance Criteria:*
    *   Pressing UP on phone moves paddle up on host screen
    *   Pressing DOWN on phone moves paddle down on host screen
    *   Movement is visible within ~50ms (feels instant)

---

### Phase 2: Core Gameplay

**Goal:** A working Player vs Player game with ball physics, scoring, and win condition.

---

#### `[TECH-ENABLER]` Story 1.1: Authoritative Game Loop

*   **Context:** We need a "referee" that calculates game state many times per second.
*   **Technical Approach:**
    *   Create `GameEngine` class on server
    *   Implement `setInterval` loop running at 60 ticks per second (every ~16ms)
    *   Each tick: update ball position, check collisions, update scores
    *   Broadcast `GAME_STATE` event to all clients after each tick
*   **Rationale:** The server must be the single source of truth. If clients calculated positions, they would go out of sync.
*   *Acceptance Criteria:*
    *   Game loop runs consistently at 60 FPS
    *   All connected clients receive state updates

---

#### `[TECH-ENABLER]` Story 1.2: Game State Machine

*   **Context:** The game has different "modes": idle, waiting for players, playing, game over.
*   **Technical Approach:**
    *   Implement state machine with states: `IDLE`, `LOBBY`, `COUNTDOWN`, `PLAYING`, `GAME_OVER`
    *   Define valid transitions (e.g., `LOBBY` → `COUNTDOWN` when all players ready)
    *   Each state has its own update logic
*   **Rationale:** A state machine prevents bugs like "player scores during countdown" or "game starts with no players."
*   *Acceptance Criteria:*
    *   State transitions logged to console
    *   Invalid transitions rejected

---

#### `[FEAT]` Story 1.3: Ball Movement and Bouncing (Story 4.1 from Phase 0)

*   **As a** Player,
*   **I want** the ball to bounce off paddles and walls realistically,
*   **So that** the game feels responsive and fair.
*   **Technical Approach:**
    *   Ball has `x`, `y`, `velocityX`, `velocityY` properties
    *   Each tick: `x += velocityX`, `y += velocityY`
    *   Wall collision: if `y < 0` or `y > tableHeight`, invert `velocityY`
    *   Paddle collision: if ball overlaps paddle, invert `velocityX` and adjust angle based on hit position
*   **Tech Note:** Collision detection uses simple rectangle overlap (AABB). Angle calculation adds variety to gameplay.
*   *Acceptance Criteria:*
    *   Ball reflects off paddles at appropriate angles
    *   Ball reflects off top and bottom walls
    *   Ball passes through left/right sides (scoring zones)

---

#### `[FEAT]` Story 1.4: Two Paddles on Screen

*   **As a** Spectator,
*   **I want** to see two paddles, one on each side of the table,
*   **So that** I can follow a two-player match.
*   **Technical Approach:**
    *   Server tracks two paddle objects with `playerId`, `y` position, `color`
    *   Host screen renders both paddles at their respective positions
    *   Left paddle for Player 1, right paddle for Player 2 (or RoboPaddle)
*   **Tech Note:** Paddle colors randomly assigned from [red, black] at game start.
*   *Acceptance Criteria:*
    *   Two paddles visible, one on each side
    *   Paddles are different colors

---

#### `[FEAT]` Story 1.5: Scoring System - First to 11 (Story 4.2 from Phase 0)

*   **As a** Player,
*   **I want** to earn a point when my opponent misses the ball,
*   **So that** there is a clear win condition.
*   **Technical Approach:**
    *   If `ball.x < 0`, Player 2 scores (ball passed Player 1)
    *   If `ball.x > tableWidth`, Player 1 scores (ball passed Player 2)
    *   Server tracks `player1Score` and `player2Score`
    *   When either reaches 11, transition to `GAME_OVER` state
*   **Tech Note:** Scoring is server-side only. Clients cannot fake scores.
*   *Acceptance Criteria:*
    *   Score increments for the correct player
    *   Score displayed on host screen
    *   Game ends when one player reaches 11

---

#### `[FEAT]` Story 1.6: Ball Speed Increase (Story 4.3 from Phase 0)

*   **As a** Player,
*   **I want** the ball to get faster over time during a rally,
*   **So that** the game becomes more exciting and challenging.
*   **Technical Approach:**
    *   On each paddle hit, multiply velocity by 1.05 (5% faster)
    *   Cap maximum speed at 2x initial speed
    *   Reset speed after each point scored
*   **Tech Note:** Speed increase is subtle per hit but noticeable over long rallies.
*   *Acceptance Criteria:*
    *   Ball noticeably faster after several hits
    *   Speed resets after a point is scored
    *   Ball never becomes impossibly fast

---

#### `[FEAT]` Story 1.7: Random First Serve (Story 4.4 from Phase 0)

*   **As a** Player,
*   **I want** the first serve to be randomly assigned,
*   **So that** neither player has an unfair advantage.
*   **Technical Approach:**
    *   At game start, `Math.random() > 0.5` determines initial direction
    *   Ball starts in center, moves toward the "receiving" player
*   *Acceptance Criteria:*
    *   50/50 random selection for first serve
    *   Ball launches toward the serving player's opponent

---

#### `[FEAT]` Story 1.8: Alternating Serve (Story 4.5 from Phase 0)

*   **As a** Player,
*   **I want** the serve to alternate after each point,
*   **So that** the game is balanced.
*   **Technical Approach:**
    *   Track `servingPlayer` variable (1 or 2)
    *   After each point, toggle: `servingPlayer = servingPlayer === 1 ? 2 : 1`
    *   Ball direction set based on serving player
*   *Acceptance Criteria:*
    *   Serve alternates regardless of who scored
    *   Clear indication of who is serving (ball starts moving toward opponent)

---

#### `[FEAT]` Story 1.9: 3-Second Countdown Between Points (Story 4.6 from Phase 0)

*   **As a** Player,
*   **I want** a 3-second pause after each point,
*   **So that** I have time to reset my position and focus.
*   **Technical Approach:**
    *   After point scored, enter `POINT_SCORED` sub-state
    *   Display countdown (3, 2, 1) on host screen
    *   Ball stationary during countdown
    *   Resume `PLAYING` state after countdown
*   *Acceptance Criteria:*
    *   3, 2, 1 countdown visible on host screen
    *   Ball stationary during countdown
    *   Game resumes automatically after countdown

---

### Phase 3: Lobby & Entry Experience

**Goal:** Players can scan QR, enter name, choose mode, and start a game.

---

#### `[TECH-ENABLER]` Story 2.1: Dynamic QR Code Generation

*   **Context:** The QR code must contain the server's IP address, which changes per network.
*   **Technical Approach:**
    *   Server detects its local IP using `os.networkInterfaces()`
    *   Generate QR code for `http://<local-ip>:3000/controller`
    *   Use QRCode.js library on host page
    *   Display QR code prominently
*   **Rationale:** Without dynamic IP detection, users would have to manually type the URL.
*   *Acceptance Criteria:*
    *   QR code displays on host screen
    *   Scanning QR code opens controller page on phone
    *   Works on same WiFi network

---

#### `[FEAT]` Story 2.2: Display QR Code for Entry (Story 1.1 from Phase 0)

*   **As a** Spectator walking by,
*   **I want to** see a large QR code on the screen,
*   **So that** I can scan it with my phone to join the game.
*   **Tech Note:** Uses QRCode.js, URL generated dynamically from server IP.
*   *Acceptance Criteria:*
    *   QR code is visible and scannable from 2 meters away
    *   Game title "Paddle Panic" is displayed above/below the QR code

---

#### `[FEAT]` Story 2.3: Scan QR to Join (Story 2.1 from Phase 0)

*   **As a** Player,
*   **I want to** scan the QR code with my phone camera,
*   **So that** the game controller opens in my mobile browser instantly.
*   **Tech Note:** Standard phone camera apps recognize QR codes and open URLs.
*   *Acceptance Criteria:*
    *   QR code links to mobile controller URL
    *   Page loads in mobile browser (iPhone and Android)
    *   No app installation required

---

#### `[FEAT]` Story 2.4: Enter Player Name (Story 2.2 from Phase 0)

*   **As a** Player,
*   **I want to** enter my first name (up to 12 characters),
*   **So that** my name appears on the big screen and the announcer uses it.
*   **Technical Approach:**
    *   Show text input on controller page after connection
    *   Client sends `socket.emit('setName', { name: 'Alice' })`
    *   Server validates (max 12 chars, sanitize HTML)
    *   Default to "Player 1" or "Player 2" if skipped
*   *Acceptance Criteria:*
    *   Text input limited to 12 characters
    *   Default name "Player 1" or "Player 2" if skipped
    *   Name displayed on host screen during game

---

#### `[FEAT]` Story 2.5: Choose Game Mode (Story 2.3 from Phase 0)

*   **As a** Player (first to scan),
*   **I want to** choose between "Player vs RoboPaddle" or "Player vs Player",
*   **So that** I can play alone against AI or wait for a friend.
*   **Technical Approach:**
    *   After name entry, show two buttons
    *   `socket.emit('selectMode', { mode: 'PVC' })` or `'PVP'`
    *   Server updates game state based on selection
*   *Acceptance Criteria:*
    *   Both options clearly labeled
    *   Selecting PvC proceeds to difficulty selection
    *   Selecting PvP shows QR code on host screen for Player 2

---

#### `[FEAT]` Story 2.6: Choose AI Difficulty (Story 2.4 from Phase 0)

*   **As a** Player (in PvC mode),
*   **I want to** choose Easy, Medium, or Hard difficulty,
*   **So that** I can match the challenge to my skill level.
*   **Technical Approach:**
    *   Show three buttons after PvC selection
    *   `socket.emit('selectDifficulty', { level: 'MEDIUM' })`
    *   Server stores difficulty for AI configuration
*   *Acceptance Criteria:*
    *   Easy, Medium, Hard options displayed
    *   Selection proceeds to Ready screen
    *   Difficulty affects RoboPaddle's reaction speed/accuracy

---

#### `[FEAT]` Story 2.7: QR Code Disappears When Scanned (Story 1.3 from Phase 0)

*   **As the** System,
*   **I want to** hide the QR code temporarily after a player scans it,
*   **So that** no additional players try to scan while mode selection is happening.
*   **Technical Approach:**
    *   Server tracks connected players
    *   Emit `QR_VISIBILITY` event to host screen
    *   Host shows/hides QR based on game state
*   *Acceptance Criteria:*
    *   QR code hides within 1 second of being scanned
    *   QR reappears if player disconnects without starting a game
    *   QR reappears for Player 2 in PvP mode

---

#### `[FEAT]` Story 2.8: Player 2 Joins via QR - PvP (Story 2.7 from Phase 0)

*   **As a** Second Player,
*   **I want to** scan the QR code shown after Player 1 selects PvP,
*   **So that** I can join the match as Player 2.
*   **Technical Approach:**
    *   Server recognizes second connection during `WAITING_FOR_P2` state
    *   Auto-assign as Player 2
    *   Hide QR code once Player 2 joins
*   *Acceptance Criteria:*
    *   QR code only appears after Player 1 selects PvP
    *   Player 2 is automatically assigned
    *   QR disappears once Player 2 joins

---

#### `[FEAT]` Story 2.9: Ready Button (Story 2.5 from Phase 0)

*   **As a** Player,
*   **I want to** press a "Ready" button when I'm prepared to play,
*   **So that** the game knows I'm ready to start.
*   **Technical Approach:**
    *   Show Ready button on controller after mode/difficulty selection
    *   `socket.emit('ready')`
    *   Server tracks ready state per player
    *   Start countdown when all players ready
*   *Acceptance Criteria:*
    *   Button is large and easy to tap
    *   In PvP, game waits for both players to be ready
    *   Both players must press Ready before countdown starts

---

#### `[FEAT]` Story 2.10: Game Start Countdown (Story 2.6 from Phase 0)

*   **As a** Player,
*   **I want to** see a 3-2-1 countdown before the game starts,
*   **So that** I have time to get ready.
*   **Technical Approach:**
    *   Server enters `COUNTDOWN` state
    *   Broadcast countdown numbers to all clients
    *   Display on both host screen and controllers
    *   Transition to `PLAYING` after "GO!"
*   *Acceptance Criteria:*
    *   Countdown shows 3, 2, 1
    *   Visible on host screen and player phones
    *   Game begins immediately after countdown

---

### Phase 4: AI Opponent (RoboPaddle)

**Goal:** Player can play against RoboPaddle at Easy/Medium/Hard difficulty.

---

#### `[TECH-ENABLER]` Story 3.1: AI Behavior Engine

*   **Context:** RoboPaddle needs to "see" the ball and move toward it.
*   **Technical Approach:**
    *   Create `RoboPaddleAI` class on server
    *   Each tick: predict where ball will be when it reaches RoboPaddle's X position
    *   Move paddle toward that Y position
    *   Add reaction delay and error based on difficulty
*   **Rationale:** Ball prediction is needed because just following the ball's current position looks robotic and is too easy to beat.
*   *Acceptance Criteria:*
    *   RoboPaddle moves to intercept ball
    *   Movement looks natural, not jerky

---

#### `[FEAT]` Story 3.2: RoboPaddle Difficulty Levels (Story 4.8 from Phase 0)

*   **As a** Player (in PvC mode),
*   **I want** RoboPaddle to move intelligently based on difficulty,
*   **So that** Easy feels beatable and Hard feels challenging.
*   **Technical Approach:**
    *   Easy: 300ms reaction delay, 30% chance of intentional miss
    *   Medium: 150ms reaction delay, 10% chance of miss
    *   Hard: 50ms reaction delay, 2% chance of miss
    *   RoboPaddle paddle is green colored
*   *Acceptance Criteria:*
    *   Easy: Slow reaction, sometimes misses
    *   Medium: Moderate reaction, occasional misses
    *   Hard: Fast reaction, rarely misses
    *   RoboPaddle paddle is green colored

---

### Phase 5: Match End & State Management

**Goal:** Smooth transitions between games, rematch flow, attract mode.

---

#### `[FEAT]` Story 4.1: Winner Announcement (Story 5.1 from Phase 0)

*   **As a** Spectator,
*   **I want to** see and hear who won the match,
*   **So that** the conclusion feels exciting and clear.
*   **Technical Approach:**
    *   Server broadcasts `GAME_OVER` event with winner name
    *   Host displays "[Name] Wins!" prominently
    *   Use Web Speech API: `speechSynthesis.speak(new SpeechSynthesisUtterance('Alice wins!'))`
*   **Tech Note:** Text-to-Speech allows any player name to be announced without pre-recording.
*   *Acceptance Criteria:*
    *   Winner's name displayed prominently on host screen
    *   Announcer voice declares "[Name] wins!"
    *   "RoboPaddle wins!" if AI wins

---

#### `[FEAT]` Story 4.2: Rematch Option (Story 5.2 from Phase 0)

*   **As a** Player,
*   **I want to** see a "Rematch" button on my phone after a match,
*   **So that** I can quickly play again with the same opponent.
*   **Technical Approach:**
    *   Show Rematch and Leave buttons on controller after game over
    *   `socket.emit('rematch')`
    *   Server waits for all players to rematch
    *   Reset scores, restart countdown
*   *Acceptance Criteria:*
    *   Button clearly visible after match ends
    *   Both players must press Rematch to start new game
    *   New game starts with 3-2-1 countdown

---

#### `[FEAT]` Story 4.3: Leave Match Option (Story 5.3 from Phase 0)

*   **As a** Player,
*   **I want to** leave the match after it ends,
*   **So that** I can give someone else a turn.
*   **Technical Approach:**
    *   `socket.emit('leave')` or disconnect socket
    *   Server removes player from game
    *   Show "Thanks for playing!" on controller
*   *Acceptance Criteria:*
    *   Leave button available after match
    *   Leaving redirects player to a "Thanks for playing" screen

---

#### `[FEAT]` Story 4.4: Single Player Stays After Opponent Leaves (Story 5.4 from Phase 0)

*   **As a** Remaining Player (after opponent leaves),
*   **I want to** be redirected to the mode selection screen,
*   **So that** I can choose to play again (PvC or wait for new PvP opponent).
*   **Technical Approach:**
    *   Server detects one player remaining
    *   Send that player back to mode selection screen
    *   Player's socket connection stays active
*   *Acceptance Criteria:*
    *   Player doesn't need to re-scan QR
    *   Can choose PvC or PvP
    *   If PvP, QR appears on host for new Player 2

---

#### `[FEAT]` Story 4.5: Disconnect Handling - 5-Second Grace (Story 4.7 from Phase 0)

*   **As a** Player,
*   **I want** the game to pause for 5 seconds if my opponent disconnects,
*   **So that** brief connection issues don't ruin the match.
*   **Technical Approach:**
    *   On disconnect, enter `PAUSED` state
    *   Display "Reconnecting..." with 5-second countdown on host
    *   Socket.io attempts automatic reconnection
    *   If reconnected, resume game
    *   If timeout, opponent wins by forfeit
*   **Tech Note:** Socket.io handles reconnection automatically. We just need to give it time.
*   *Acceptance Criteria:*
    *   5-second countdown displayed
    *   If player reconnects, game resumes
    *   If no reconnection, opponent wins by forfeit

---

#### `[FEAT]` Story 4.6: Return to Attract Mode (Story 5.5 from Phase 0)

*   **As the** System,
*   **I want to** return to the attract mode when all players leave,
*   **So that** new players can see the QR code and join.
*   **Technical Approach:**
    *   Server tracks connected players
    *   When count reaches 0, transition to `IDLE` state
    *   Host shows attract mode (QR code + animation)
*   *Acceptance Criteria:*
    *   Attract mode activates within 5 seconds of last player leaving
    *   QR code and animation displayed
    *   Ready for new players to scan

---

#### `[FEAT]` Story 4.7: Attract Mode Animation (Story 1.2 from Phase 0)

*   **As a** Spectator,
*   **I want to** see an animated demo of paddles moving and a ball bouncing,
*   **So that** I understand this is a game and feel drawn to play.
*   **Technical Approach:**
    *   When in `IDLE` state, run demo animation
    *   AI controls both paddles
    *   Ball bounces automatically
    *   QR code overlaid on animation
*   *Acceptance Criteria:*
    *   Animation plays continuously when no game is active
    *   Paddles move up and down, ball bounces between them

---

### Phase 6: Audio & Polish

**Goal:** Add sound effects, announcer, vibration, visual polish.

---

#### `[TECH-ENABLER]` Story 5.1: Audio System Setup

*   **Context:** We need to preload sounds and manage a global mute state.
*   **Technical Approach:**
    *   Create `AudioManager` class on host page
    *   Preload all sound files on page load
    *   Implement `playSound(name)` method
    *   Implement `toggleMute()` method
    *   Store mute state in localStorage
*   **Rationale:** Preloading prevents delay when sounds need to play.
*   *Acceptance Criteria:*
    *   Sounds play instantly when triggered
    *   Mute state persists across page refreshes

---

#### `[FEAT]` Story 5.2: Ball Hit Sound Effect (Story 6.1 from Phase 0)

*   **As a** Spectator/Player,
*   **I want to** hear a sound when the ball hits a paddle,
*   **So that** the game feels more immersive and arcade-like.
*   **Tech Note:** Use Web Audio API. Short "pop" or "ping" sound file.
*   *Acceptance Criteria:*
    *   Sound plays on every paddle hit
    *   Sound is distinct and satisfying
    *   Respects mute setting

---

#### `[FEAT]` Story 5.3: Wall Bounce Sound Effect (Story 6.2 from Phase 0)

*   **As a** Spectator/Player,
*   **I want to** hear a sound when the ball hits the top or bottom wall,
*   **So that** I can follow the action by sound.
*   **Tech Note:** Different sound from paddle hit.
*   *Acceptance Criteria:*
    *   Sound plays on wall contact
    *   Distinct from paddle hit sound
    *   Respects mute setting

---

#### `[FEAT]` Story 5.4: Score Sound Effect (Story 6.3 from Phase 0)

*   **As a** Spectator/Player,
*   **I want to** hear a sound when a point is scored,
*   **So that** the moment feels significant.
*   *Acceptance Criteria:*
    *   Sound plays when point is scored
    *   Distinct from gameplay sounds
    *   Respects mute setting

---

#### `[FEAT]` Story 5.5: Announcer Voice for Winner (Story 6.4 from Phase 0)

*   **As a** Spectator,
*   **I want to** hear an announcer say "[Player Name] wins!",
*   **So that** the victory feels dramatic and exciting.
*   **Technical Approach:**
    *   Use Web Speech API (Text-to-Speech)
    *   `const utterance = new SpeechSynthesisUtterance('${winnerName} wins!')`
    *   `speechSynthesis.speak(utterance)`
*   **Tech Note:** TTS allows any name to be spoken without pre-recording.
*   *Acceptance Criteria:*
    *   Announcer says winner's name (or "RoboPaddle")
    *   Clear and audible
    *   Respects mute setting

---

#### `[FEAT]` Story 5.6: Countdown Audio (Story 6.5 from Phase 0)

*   **As a** Player,
*   **I want to** hear audio cues during the 3-2-1 countdown,
*   **So that** I know exactly when the game will start.
*   *Acceptance Criteria:*
    *   Audio plays for each countdown number
    *   Final "Go!" or distinct sound when game starts
    *   Respects mute setting

---

#### `[FEAT]` Story 5.7: Mute Option (Story 1.5 from Phase 0)

*   **As the** Host/Presenter,
*   **I want to** mute the game audio,
*   **So that** I can control the sound level during the demonstration.
*   **Technical Approach:**
    *   Mute icon/button in corner of host screen
    *   Click toggles `AudioManager.muted` state
    *   Visual indicator (icon change or color)
*   *Acceptance Criteria:*
    *   Mute button/icon visible on host screen
    *   Clicking mute silences all game audio
    *   Visual indicator shows muted state

---

#### `[FEAT]` Story 5.8: UP and DOWN Buttons (Story 3.1 from Phase 0)

*   **As a** Player,
*   **I want** two large buttons for UP and DOWN on my phone,
*   **So that** I can move my paddle without looking at my phone.
*   **Technical Approach:**
    *   Full-width buttons, each 50% of screen height
    *   High-contrast colors
    *   CSS `touch-action: manipulation` to disable zoom
*   *Acceptance Criteria:*
    *   Buttons are large enough to tap without precise aiming
    *   Pressing UP moves paddle up on host screen
    *   Pressing DOWN moves paddle down on host screen
    *   Responsive with minimal latency

---

#### `[FEAT]` Story 5.9: Paddle Color Indicator (Story 3.2 from Phase 0)

*   **As a** Player,
*   **I want** my phone screen to show my paddle color (red or black),
*   **So that** I instantly know which paddle is mine on the big screen.
*   **Technical Approach:**
    *   Server sends paddle color in `PLAYER_ASSIGNED` event
    *   Controller page updates button colors or background
*   *Acceptance Criteria:*
    *   Color matches the paddle assigned on host screen
    *   Color is clearly visible (not subtle)

---

#### `[FEAT]` Story 5.10: Vibration on Score (Story 3.3 from Phase 0)

*   **As a** Player,
*   **I want** my phone to vibrate when I score a point,
*   **So that** I feel the success physically.
*   **Technical Approach:**
    *   Server sends `POINT_SCORED` event to scorer
    *   Controller calls `navigator.vibrate(200)` (short buzz)
*   **Tech Note:** Check if vibration is supported before calling.
*   *Acceptance Criteria:*
    *   Short vibration on scoring
    *   Works on devices that support vibration

---

#### `[FEAT]` Story 5.11: Vibration on Losing Point (Story 3.4 from Phase 0)

*   **As a** Player,
*   **I want** my phone to vibrate differently when I lose a point,
*   **So that** I know something happened even without watching the screen.
*   **Technical Approach:**
    *   Server sends `POINT_LOST` event to loser
    *   Controller calls `navigator.vibrate([100, 50, 100])` (two short pulses)
*   *Acceptance Criteria:*
    *   Distinct vibration pattern from scoring
    *   Works on devices that support vibration

---

#### `[FEAT]` Story 5.12: Connection Status Indicator (Story 3.5 from Phase 0)

*   **As a** Player,
*   **I want to** see if my phone is connected to the game,
*   **So that** I know my controls are working.
*   **Technical Approach:**
    *   Listen for Socket.io `connect` and `disconnect` events
    *   Show green dot when connected, red when disconnected
    *   Socket.io auto-reconnects
*   *Acceptance Criteria:*
    *   Green indicator when connected
    *   Red indicator or warning when disconnected
    *   Attempts to reconnect automatically

---

#### `[FEAT]` Story 5.13: Display Live Game (Story 1.4 from Phase 0)

*   **As a** Spectator,
*   **I want to** see the live game with the table, paddles, ball, score, and player names,
*   **So that** I can follow the match and enjoy watching.
*   **Technical Approach:**
    *   Canvas renders table (blue/green background)
    *   Paddles rendered as rectangles (red/black/green)
    *   Ball rendered as circle (white or orange, random)
    *   Score and names rendered as text overlays
*   *Acceptance Criteria:*
    *   Top-down view of table (blue or green)
    *   Both paddles visible (red/black for players, green for RoboPaddle)
    *   Ball visible (white or orange)
    *   Current score displayed for both players
    *   Player names displayed

---

## Icebox (Nice to Have - Future Phases)

These items are preserved from Phase 0 for future consideration:

*   **Leaderboard:** Track high scores or win streaks for the session
*   **Custom Table Colors:** Let players choose table color before match
*   **Spectator Mode on Phone:** Watch the game on phone if lobby is full
*   **Tournament Mode:** Bracket-style competition for multiple players
*   **Power-ups:** Special items that appear on the table (speed boost, larger paddle, etc.)
