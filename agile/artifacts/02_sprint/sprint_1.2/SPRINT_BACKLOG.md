# Sprint Backlog: Sprint 1.2

## Sprint Information

| Field | Value |
|-------|-------|
| **Sprint Number** | 1.2 |
| **Sprint Name** | Core Gameplay (Ball, Paddles, Scoring) |
| **Reference** | Phase 2 Execution Plan → "Core Gameplay" |
| **Status** | ✅ Complete - Verified by User |

---

## Sprint Goal

### What are we building?
We are building the **core gameplay mechanics** of Paddle Panic. This sprint transforms our "moving paddle demo" into an actual playable Pong game with a ball that bounces, two paddles, collision detection, and a scoring system.

### Expected Outcome (What you will see)
By the end of this sprint, you will be able to:
1. See a **ball** moving and bouncing off walls on the host screen
2. See **two paddles** (left for Player 1, right for Player 2/AI placeholder)
3. Watch the ball **bounce off paddles** realistically
4. See the **score** update when the ball passes a paddle
5. Experience a **3-second countdown** between points
6. Watch the ball **speed up** during rallies
7. See the game **end** when a player reaches 11 points

### Acceptance Criteria
- [x] Ball moves across the screen and bounces off top/bottom walls ✅
- [x] Two paddles visible (left and right sides) ✅
- [x] Ball bounces off paddles with angle variation ✅
- [x] Score displayed on screen (e.g., "0 - 0") ✅
- [x] Score increments when ball passes a paddle ✅
- [x] Ball speeds up after each paddle hit ✅
- [x] 3-2-1 countdown shown between points ✅
- [x] Game ends when either player reaches 11 points ✅
- [x] "Player X Wins!" message displayed at game end ✅

---

## Tasks

### Task 1: Authoritative Game Loop (Story 1.1)
**Description:** Create a server-side game loop that runs at 60 ticks per second to manage all game state.

**Technical Approach:**
- Create `GameEngine` class in `src/server/GameEngine.js`
- Implement `setInterval` loop running every ~16ms (60 FPS)
- Each tick: update positions, check collisions, broadcast state
- Emit `GAME_STATE` event to all connected clients after each tick

**Acceptance Criteria:**
- [x] Game loop runs consistently
- [x] All clients receive synchronized state updates
- [x] Console logs tick rate for debugging

**Status:** [x] Complete

---

### Task 2: Ball State and Movement (Story 1.3)
**Description:** Add a ball to the game that moves across the screen.

**Technical Approach:**
- Add ball object to game state: `{ x, y, velocityX, velocityY, radius }`
- Each tick: `x += velocityX`, `y += velocityY`
- Ball starts at center of table
- Initial velocity: random direction, moderate speed

**Acceptance Criteria:**
- [x] Ball visible on host screen (white circle)
- [x] Ball moves in a straight line
- [x] Ball position synced across all clients

**Status:** [x] Complete

---

### Task 3: Wall Collision (Story 1.3)
**Description:** Make the ball bounce off the top and bottom walls.

**Technical Approach:**
- Each tick: check if `ball.y < 0` or `ball.y > tableHeight`
- If collision, invert `velocityY`: `velocityY = -velocityY`
- Adjust position to prevent ball going through wall

**Acceptance Criteria:**
- [x] Ball bounces off top wall
- [x] Ball bounces off bottom wall
- [x] Bounces look natural (no sticking or passing through)

**Status:** [x] Complete

---

### Task 4: Second Paddle (Story 1.4)
**Description:** Add a second paddle on the right side for Player 2.

**Technical Approach:**
- Update game state to track two paddles: `paddle1` (left), `paddle2` (right)
- Assign different colors (red and blue)
- Player 2 paddle controlled by a second phone connection
- Render both paddles on host screen

**Acceptance Criteria:**
- [x] Two paddles visible on screen (left and right)
- [x] Paddles have different colors (red and blue)
- [x] Player 1 controls left paddle, Player 2 controls right paddle

**Status:** [x] Complete

---

### Task 5: Paddle Collision (Story 1.3)
**Description:** Make the ball bounce off paddles with angle variation.

**Technical Approach:**
- Each tick: check if ball overlaps with either paddle (AABB collision)
- On collision: invert `velocityX`
- Adjust `velocityY` based on where ball hits paddle:
  - Hit top of paddle → ball goes up
  - Hit center → ball goes straight
  - Hit bottom → ball goes down
- This creates varied, interesting gameplay

**Acceptance Criteria:**
- [x] Ball bounces off left paddle
- [x] Ball bounces off right paddle
- [x] Bounce angle varies based on hit position
- [x] Ball cannot pass through paddles

**Status:** [x] Complete

---

### Task 6: Scoring System (Story 1.5)
**Description:** Track and display scores. Award points when ball passes a paddle.

**Technical Approach:**
- Add scores to game state: `player1Score`, `player2Score`
- If `ball.x < 0` → Player 2 scores (ball passed Player 1)
- If `ball.x > tableWidth` → Player 1 scores (ball passed Player 2)
- Display scores on host screen (large, centered text)
- Broadcast score updates to all clients

**Acceptance Criteria:**
- [x] Score displayed on host screen (e.g., "3 - 5")
- [x] Player 2 scores when ball exits left side
- [x] Player 1 scores when ball exits right side
- [x] Scores update immediately

**Status:** [x] Complete

---

### Task 7: Ball Speed Increase (Story 1.6)
**Description:** Make the ball faster after each paddle hit to increase excitement.

**Technical Approach:**
- On each paddle hit: multiply velocity by 1.05 (5% faster)
- Cap maximum speed at 2x initial speed
- Reset to initial speed after each point scored

**Acceptance Criteria:**
- [x] Ball noticeably faster after several hits
- [x] Speed resets after a point is scored
- [x] Ball never becomes impossibly fast (capped at 2x)

**Status:** [x] Complete

---

### Task 8: Random First Serve (Story 1.7)
**Description:** Randomly decide which direction the ball goes at game start.

**Technical Approach:**
- At game start: `Math.random() > 0.5` determines initial direction
- Ball starts at center, moves toward one player

**Acceptance Criteria:**
- [x] Ball direction is random at game start
- [x] Approximately 50/50 split over multiple games

**Status:** [x] Complete

---

### Task 9: Alternating Serve (Story 1.8)
**Description:** Alternate serve direction after each point.

**Technical Approach:**
- Track `servingPlayer` variable (1 or 2)
- After each point: toggle serving player
- Ball direction based on who is serving (toward opponent)

**Acceptance Criteria:**
- [x] Serve alternates after each point
- [x] Ball launches toward the receiver

**Status:** [x] Complete

---

### Task 10: Countdown Between Points (Story 1.9)
**Description:** Show 3-2-1 countdown after each point before resuming play.

**Technical Approach:**
- After point scored, enter `COUNTDOWN` state
- Display countdown numbers (3, 2, 1) on host screen
- Ball stationary at center during countdown
- Resume `PLAYING` state after countdown

**Acceptance Criteria:**
- [x] 3, 2, 1 countdown visible on host screen
- [x] Ball stationary during countdown
- [x] Game resumes automatically after countdown

**Status:** [x] Complete

---

### Task 11: Win Condition (Story 1.5)
**Description:** End the game when a player reaches 11 points.

**Technical Approach:**
- After each score, check if either player has 11 points
- If yes, transition to `GAME_OVER` state
- Display winner message: "[Player] Wins!"
- Stop game loop (or enter idle state)

**Acceptance Criteria:**
- [x] Game ends when player reaches 11 points
- [x] Winner announced on host screen
- [x] Ball and paddles stop moving

**Status:** [x] Complete

---

## Notes & Decisions

| Date | Decision |
|------|----------|
| 2026-01-30 | Sprint 1.2 initialized. Building on Sprint 1.1's foundation (server, canvas, basic paddle control). |
| 2026-01-30 | Player 2 paddle will initially be controlled by a second phone connection. AI (RoboPaddle) comes in Phase 4. |
| 2026-01-30 | Game State Machine (Story 1.2) implemented implicitly through the countdown/playing/game-over logic. |
| 2026-01-30 | All 11 tasks implemented and verified by user. Sprint complete! |
