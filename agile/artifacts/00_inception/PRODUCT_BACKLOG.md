# Product Backlog: Paddle Panic

Status: **Inception Complete**
**Focus:** User Needs & Functional Requirements

## Introduction
This backlog defines the features needed to build Paddle Panic, a browser-based paddle game for classroom demonstrations. It focuses on the **User Experience** of Players (controlling paddles via mobile phones) and Spectators (watching on the big screen).

The items are grouped by **Epics** (Thematic Areas) and prioritized by "Business Value".

---

## High Priority (Must Have)

### Epic 1: Host Screen & Attract Mode
**Goal (Business Value):** Draw people in and provide a central display for the game.
**Experience (User Experience):** A big screen showing the game title, a QR code to scan, and an animated demo of paddles and ball moving. When a game is in progress, it shows the live match.

*   `[FEAT]` **Story 1.1: Display QR Code for Entry**
    *   **As a** Spectator walking by,
    *   **I want to** see a large QR code on the screen,
    *   **So that** I can scan it with my phone to join the game.
    *   **Demo:** QR code is prominently displayed on the host screen.
    *   *Acceptance Criteria:*
        *   QR code is visible and scannable from 2 meters away
        *   Game title "Paddle Panic" is displayed above/below the QR code

*   `[FEAT]` **Story 1.2: Attract Mode Animation**
    *   **As a** Spectator,
    *   **I want to** see an animated demo of paddles moving and a ball bouncing,
    *   **So that** I understand this is a game and feel drawn to play.
    *   **Demo:** When idle, the screen shows paddles and ball moving automatically.
    *   *Acceptance Criteria:*
        *   Animation plays continuously when no game is active
        *   Paddles move up and down, ball bounces between them

*   `[FEAT]` **Story 1.3: QR Code Disappears When Scanned**
    *   **As the** System,
    *   **I want to** hide the QR code temporarily after a player scans it,
    *   **So that** no additional players try to scan while mode selection is happening.
    *   **Demo:** QR code disappears after first scan.
    *   *Acceptance Criteria:*
        *   QR code hides within 1 second of being scanned
        *   QR reappears if player disconnects without starting a game

*   `[FEAT]` **Story 1.4: Display Live Game**
    *   **As a** Spectator,
    *   **I want to** see the live game with the table, paddles, ball, score, and player names,
    *   **So that** I can follow the match and enjoy watching.
    *   **Demo:** During gameplay, the screen shows the full game view.
    *   *Acceptance Criteria:*
        *   Top-down view of table (blue or green)
        *   Both paddles visible (red/black for players, green for RoboPaddle)
        *   Ball visible (white or orange)
        *   Current score displayed for both players
        *   Player names displayed

*   `[FEAT]` **Story 1.5: Mute Option**
    *   **As the** Host/Presenter,
    *   **I want to** mute the game audio,
    *   **So that** I can control the sound level during the demonstration.
    *   **Demo:** A mute toggle is accessible on the host screen.
    *   *Acceptance Criteria:*
        *   Mute button/icon visible on host screen
        *   Clicking mute silences all game audio
        *   Visual indicator shows muted state

---

### Epic 2: Lobby & Entry Experience
**Goal (Business Value):** Get players from "walking by" to "playing" as fast as possible.
**Experience (User Experience):** Scan QR, enter name, choose mode, press ready, game starts with a countdown.

*   `[FEAT]` **Story 2.1: Scan QR to Join**
    *   **As a** Player,
    *   **I want to** scan the QR code with my phone camera,
    *   **So that** the game controller opens in my mobile browser instantly.
    *   **Demo:** Scanning QR opens mobile controller page.
    *   *Acceptance Criteria:*
        *   QR code links to mobile controller URL
        *   Page loads in mobile browser (iPhone and Android)
        *   No app installation required

*   `[FEAT]` **Story 2.2: Enter Player Name**
    *   **As a** Player,
    *   **I want to** enter my first name (up to 12 characters),
    *   **So that** my name appears on the big screen and the announcer uses it.
    *   **Demo:** Name input field appears after scanning.
    *   *Acceptance Criteria:*
        *   Text input limited to 12 characters
        *   Default name "Player 1" or "Player 2" if skipped
        *   Name displayed on host screen during game

*   `[FEAT]` **Story 2.3: Choose Game Mode**
    *   **As a** Player (first to scan),
    *   **I want to** choose between "Player vs RoboPaddle" or "Player vs Player",
    *   **So that** I can play alone against AI or wait for a friend.
    *   **Demo:** Two buttons appear on phone: "vs RoboPaddle" and "vs Player".
    *   *Acceptance Criteria:*
        *   Both options clearly labeled
        *   Selecting PvC proceeds to difficulty selection
        *   Selecting PvP shows QR code on host screen for Player 2

*   `[FEAT]` **Story 2.4: Choose AI Difficulty**
    *   **As a** Player (in PvC mode),
    *   **I want to** choose Easy, Medium, or Hard difficulty,
    *   **So that** I can match the challenge to my skill level.
    *   **Demo:** Three difficulty buttons appear after selecting PvC mode.
    *   *Acceptance Criteria:*
        *   Easy, Medium, Hard options displayed
        *   Selection proceeds to Ready screen
        *   Difficulty affects RoboPaddle's reaction speed/accuracy

*   `[FEAT]` **Story 2.5: Ready Button**
    *   **As a** Player,
    *   **I want to** press a "Ready" button when I'm prepared to play,
    *   **So that** the game knows I'm ready to start.
    *   **Demo:** Ready button appears after mode/difficulty selection.
    *   *Acceptance Criteria:*
        *   Button is large and easy to tap
        *   In PvP, button only activates when both players have joined
        *   Both players must press Ready before countdown starts

*   `[FEAT]` **Story 2.6: Game Start Countdown**
    *   **As a** Player,
    *   **I want to** see a 3-2-1 countdown before the game starts,
    *   **So that** I have time to get ready.
    *   **Demo:** Countdown displays on both host screen and mobile.
    *   *Acceptance Criteria:*
        *   Countdown shows 3, 2, 1
        *   Visible on host screen and player phones
        *   Game begins immediately after countdown

*   `[FEAT]` **Story 2.7: Player 2 Joins via QR (PvP)**
    *   **As a** Second Player,
    *   **I want to** scan the QR code shown after Player 1 selects PvP,
    *   **So that** I can join the match as Player 2.
    *   **Demo:** QR code appears on host screen for Player 2.
    *   *Acceptance Criteria:*
        *   QR code only appears after Player 1 selects PvP
        *   Player 2 is automatically assigned
        *   QR disappears once Player 2 joins

---

### Epic 3: Mobile Controller
**Goal (Business Value):** A controller that works without looking at it.
**Experience (User Experience):** Big UP/DOWN buttons in the player's paddle color. Vibrates on score events.

*   `[FEAT]` **Story 3.1: UP and DOWN Buttons**
    *   **As a** Player,
    *   **I want** two large buttons for UP and DOWN on my phone,
    *   **So that** I can move my paddle without looking at my phone.
    *   **Demo:** Two large buttons fill the screen during gameplay.
    *   *Acceptance Criteria:*
        *   Buttons are large enough to tap without precise aiming
        *   Pressing UP moves paddle up on host screen
        *   Pressing DOWN moves paddle down on host screen
        *   Responsive with minimal latency

*   `[FEAT]` **Story 3.2: Paddle Color Indicator**
    *   **As a** Player,
    *   **I want** my phone screen to show my paddle color (red or black),
    *   **So that** I instantly know which paddle is mine on the big screen.
    *   **Demo:** Phone background or button color matches paddle.
    *   *Acceptance Criteria:*
        *   Color matches the paddle assigned on host screen
        *   Color is clearly visible (not subtle)

*   `[FEAT]` **Story 3.3: Vibration on Score**
    *   **As a** Player,
    *   **I want** my phone to vibrate when I score a point,
    *   **So that** I feel the success physically.
    *   **Demo:** Phone vibrates briefly when player scores.
    *   *Acceptance Criteria:*
        *   Short vibration on scoring
        *   Works on devices that support vibration

*   `[FEAT]` **Story 3.4: Vibration on Losing Point**
    *   **As a** Player,
    *   **I want** my phone to vibrate differently when I lose a point,
    *   **So that** I know something happened even without watching the screen.
    *   **Demo:** Phone vibrates with different pattern when losing point.
    *   *Acceptance Criteria:*
        *   Distinct vibration pattern from scoring
        *   Works on devices that support vibration

*   `[FEAT]` **Story 3.5: Connection Status Indicator**
    *   **As a** Player,
    *   **I want to** see if my phone is connected to the game,
    *   **So that** I know my controls are working.
    *   **Demo:** Visual indicator shows connection status.
    *   *Acceptance Criteria:*
        *   Green indicator when connected
        *   Red indicator or warning when disconnected
        *   Attempts to reconnect automatically

---

### Epic 4: Core Gameplay
**Goal (Business Value):** A fast-paced, fair, and exciting match.
**Experience (User Experience):** Ball bounces between paddles, speeds up over time. First to 11 wins. 3-second pause between points.

*   `[FEAT]` **Story 4.1: Ball Movement and Bouncing**
    *   **As a** Player,
    *   **I want** the ball to bounce off paddles and walls realistically,
    *   **So that** the game feels responsive and fair.
    *   **Demo:** Ball bounces off paddles and top/bottom walls.
    *   *Acceptance Criteria:*
        *   Ball reflects off paddles at appropriate angles
        *   Ball reflects off top and bottom walls
        *   Ball passes through left/right sides (scoring zones)

*   `[FEAT]` **Story 4.2: Scoring System (First to 11)**
    *   **As a** Player,
    *   **I want** to earn a point when my opponent misses the ball,
    *   **So that** there is a clear win condition.
    *   **Demo:** Score updates when ball passes opponent's paddle.
    *   *Acceptance Criteria:*
        *   Score increments for the correct player
        *   Score displayed on host screen
        *   Game ends when one player reaches 11

*   `[FEAT]` **Story 4.3: Ball Speed Increase**
    *   **As a** Player,
    *   **I want** the ball to get faster over time during a rally,
    *   **So that** the game becomes more exciting and challenging.
    *   **Demo:** Ball noticeably faster after several hits.
    *   *Acceptance Criteria:*
        *   Ball speed increases with each paddle hit
        *   Speed resets after a point is scored
        *   Maximum speed cap to keep it playable

*   `[FEAT]` **Story 4.4: Random First Serve**
    *   **As a** Player,
    *   **I want** the first serve to be randomly assigned,
    *   **So that** neither player has an unfair advantage.
    *   **Demo:** Ball starts moving toward a randomly chosen side.
    *   *Acceptance Criteria:*
        *   50/50 random selection for first serve
        *   Ball launches toward the serving player's opponent

*   `[FEAT]` **Story 4.5: Alternating Serve**
    *   **As a** Player,
    *   **I want** the serve to alternate after each point,
    *   **So that** the game is balanced.
    *   **Demo:** Serve switches sides after each point.
    *   *Acceptance Criteria:*
        *   Serve alternates regardless of who scored
        *   Clear indication of who is serving (ball starts on their side)

*   `[FEAT]` **Story 4.6: 3-Second Countdown Between Points**
    *   **As a** Player,
    *   **I want** a 3-second pause after each point,
    *   **So that** I have time to reset my position and focus.
    *   **Demo:** Countdown displays between points.
    *   *Acceptance Criteria:*
        *   3, 2, 1 countdown visible on host screen
        *   Ball stationary during countdown
        *   Game resumes automatically after countdown

*   `[FEAT]` **Story 4.7: Disconnect Handling (5-Second Grace)**
    *   **As a** Player,
    *   **I want** the game to pause for 5 seconds if my opponent disconnects,
    *   **So that** brief connection issues don't ruin the match.
    *   **Demo:** Game pauses with "Reconnecting..." message.
    *   *Acceptance Criteria:*
        *   5-second countdown displayed
        *   If player reconnects, game resumes
        *   If no reconnection, opponent wins by forfeit

*   `[FEAT]` **Story 4.8: RoboPaddle AI Behavior**
    *   **As a** Player (in PvC mode),
    *   **I want** RoboPaddle to move intelligently based on difficulty,
    *   **So that** Easy feels beatable and Hard feels challenging.
    *   **Demo:** RoboPaddle moves to intercept the ball.
    *   *Acceptance Criteria:*
        *   Easy: Slow reaction, sometimes misses
        *   Medium: Moderate reaction, occasional misses
        *   Hard: Fast reaction, rarely misses
        *   RoboPaddle paddle is green colored

---

### Epic 5: Match End & Rematch Flow
**Goal (Business Value):** Keep players engaged and rotate smoothly.
**Experience (User Experience):** Winner announced, rematch offered. If players leave, screen returns to attract mode.

*   `[FEAT]` **Story 5.1: Winner Announcement**
    *   **As a** Spectator,
    *   **I want to** see and hear who won the match,
    *   **So that** the conclusion feels exciting and clear.
    *   **Demo:** "[Player Name] Wins!" displayed and announced.
    *   *Acceptance Criteria:*
        *   Winner's name displayed prominently on host screen
        *   Announcer voice declares "[Name] wins!"
        *   "RoboPaddle wins!" if AI wins

*   `[FEAT]` **Story 5.2: Rematch Option**
    *   **As a** Player,
    *   **I want to** see a "Rematch" button on my phone after a match,
    *   **So that** I can quickly play again with the same opponent.
    *   **Demo:** Rematch button appears on mobile after game ends.
    *   *Acceptance Criteria:*
        *   Button clearly visible after match ends
        *   Both players must press Rematch to start new game
        *   New game starts with 3-2-1 countdown

*   `[FEAT]` **Story 5.3: Leave Match Option**
    *   **As a** Player,
    *   **I want to** leave the match after it ends,
    *   **So that** I can give someone else a turn.
    *   **Demo:** "Leave" or "Exit" button on mobile.
    *   *Acceptance Criteria:*
        *   Leave button available after match
        *   Leaving redirects player to a "Thanks for playing" screen

*   `[FEAT]` **Story 5.4: Single Player Stays After Opponent Leaves**
    *   **As a** Remaining Player (after opponent leaves),
    *   **I want to** be redirected to the mode selection screen,
    *   **So that** I can choose to play again (PvC or wait for new PvP opponent).
    *   **Demo:** Remaining player sees mode selection on phone.
    *   *Acceptance Criteria:*
        *   Player doesn't need to re-scan QR
        *   Can choose PvC or PvP
        *   If PvP, QR appears on host for new Player 2

*   `[FEAT]` **Story 5.5: Return to Attract Mode**
    *   **As the** System,
    *   **I want to** return to the attract mode when all players leave,
    *   **So that** new players can see the QR code and join.
    *   **Demo:** Host screen shows QR and demo animation after all players leave.
    *   *Acceptance Criteria:*
        *   Attract mode activates within 5 seconds of last player leaving
        *   QR code and animation displayed
        *   Ready for new players to scan

---

## Medium Priority (Usability & Polish)

### Epic 6: Audio & Polish
**Goal (Business Value):** Enhance the experience with satisfying audio feedback.
**Experience (User Experience):** Hear the ball hit, hear the winner announced.

*   `[FEAT]` **Story 6.1: Ball Hit Sound Effect**
    *   **As a** Spectator/Player,
    *   **I want to** hear a sound when the ball hits a paddle,
    *   **So that** the game feels more immersive and arcade-like.
    *   **Demo:** "Pop" or "ping" sound on paddle contact.
    *   *Acceptance Criteria:*
        *   Sound plays on every paddle hit
        *   Sound is distinct and satisfying
        *   Respects mute setting

*   `[FEAT]` **Story 6.2: Wall Bounce Sound Effect**
    *   **As a** Spectator/Player,
    *   **I want to** hear a sound when the ball hits the top or bottom wall,
    *   **So that** I can follow the action by sound.
    *   **Demo:** Different sound on wall bounce.
    *   *Acceptance Criteria:*
        *   Sound plays on wall contact
        *   Distinct from paddle hit sound
        *   Respects mute setting

*   `[FEAT]` **Story 6.3: Score Sound Effect**
    *   **As a** Spectator/Player,
    *   **I want to** hear a sound when a point is scored,
    *   **So that** the moment feels significant.
    *   **Demo:** Celebratory or distinct sound on scoring.
    *   *Acceptance Criteria:*
        *   Sound plays when point is scored
        *   Distinct from gameplay sounds
        *   Respects mute setting

*   `[FEAT]` **Story 6.4: Announcer Voice for Winner**
    *   **As a** Spectator,
    *   **I want to** hear an announcer say "[Player Name] wins!",
    *   **So that** the victory feels dramatic and exciting.
    *   **Demo:** Voice announcement at end of match.
    *   *Acceptance Criteria:*
        *   Announcer says winner's name (or "RoboPaddle")
        *   Clear and audible
        *   Respects mute setting

*   `[FEAT]` **Story 6.5: Countdown Audio**
    *   **As a** Player,
    *   **I want to** hear audio cues during the 3-2-1 countdown,
    *   **So that** I know exactly when the game will start.
    *   **Demo:** Beeps or voice countdown before game starts.
    *   *Acceptance Criteria:*
        *   Audio plays for each countdown number
        *   Final "Go!" or distinct sound when game starts
        *   Respects mute setting

---

## Icebox (Nice to Have)
*   **Leaderboard:** Track high scores or win streaks for the session
*   **Custom Table Colors:** Let players choose table color before match
*   **Spectator Mode on Phone:** Watch the game on phone if lobby is full
*   **Tournament Mode:** Bracket-style competition for multiple players
*   **Power-ups:** Special items that appear on the table (speed boost, larger paddle, etc.)
