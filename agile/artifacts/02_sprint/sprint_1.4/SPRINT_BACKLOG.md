# Sprint Backlog: Sprint 1.4

## Sprint Information

| Field | Value |
|-------|-------|
| **Sprint Number** | 1.4 |
| **Sprint Name** | AI Opponent (RoboPaddle) |
| **Reference** | Phase 4 Execution Plan |
| **Status** | ✅ Completed |

---

## Sprint Goal

### What are we building?
We are building the **RoboPaddle AI** - an intelligent computer opponent that can play Pong against human players. Currently, when you select "vs RoboPaddle", the AI paddle doesn't move. After this sprint, RoboPaddle will track the ball, predict where it's going, and try to intercept it!

### Expected Outcome (What you will see)
By the end of this sprint, you will be able to:
1. Play a **complete single-player game** against RoboPaddle
2. See RoboPaddle **intelligently tracking** the ball
3. Experience **different difficulty levels**:
   - Easy: Beatable, slow reactions, often misses
   - Medium: Challenging, moderate speed
   - Hard: Very tough, fast reactions, rarely misses

### Acceptance Criteria
- [x] RoboPaddle moves to intercept the ball
- [x] Easy difficulty is beatable by beginners
- [x] Medium difficulty provides a fair challenge
- [x] Hard difficulty is very difficult to beat
- [x] AI movement looks natural, not jerky
- [x] RoboPaddle paddle remains black color (as set in Sprint 1.3)

---

## Tasks

### Task 1: Create RoboPaddleAI Class
**Description:** Create a dedicated AI class that handles all RoboPaddle logic.
**Technical Approach:**
- Create `RoboPaddleAI.js` in `src/server/`
- Constructor takes difficulty level and game state reference
- Implement `update()` method called each game tick

**Acceptance Criteria:**
- [x] RoboPaddleAI class created and exported
- [x] Class can be instantiated with difficulty setting

**Status:** [x] Completed

---

### Task 2: Ball Prediction Algorithm
**Description:** AI predicts where the ball will be when it reaches the paddle's X position.
**Technical Approach:**
- Calculate time for ball to reach RoboPaddle's X position
- Account for wall bounces during prediction
- Return predicted Y position

**Acceptance Criteria:**
- [x] AI predicts ball trajectory accurately
- [x] Wall bounces are accounted for in prediction

**Status:** [x] Completed

---

### Task 3: AI Movement Logic
**Description:** Move the paddle toward the predicted ball position.
**Technical Approach:**
- Calculate target Y position (predicted ball Y)
- Move paddle toward target at controlled speed
- Add smoothing to prevent jerky movement

**Acceptance Criteria:**
- [x] Paddle moves smoothly toward predicted position
- [x] Movement speed is appropriate for each difficulty

**Status:** [x] Completed

---

### Task 4: Reaction Delay System
**Description:** Add configurable delay before AI reacts to ball direction changes.
**Technical Approach:**
- Track when ball direction changed
- Only update prediction after delay passes
- Different delays per difficulty level

**Acceptance Criteria:**
- [x] Easy: 300ms reaction delay
- [x] Medium: 150ms reaction delay
- [x] Hard: 50ms reaction delay

**Status:** [x] Completed

---

### Task 5: Intentional Miss System
**Description:** Add randomized "mistakes" to make AI beatable.
**Technical Approach:**
- Random chance to aim at wrong position
- Different miss percentages per difficulty
- Miss by moving too far or not far enough

**Acceptance Criteria:**
- [x] Easy: ~30% chance of intentional miss
- [x] Medium: ~10% chance of intentional miss
- [x] Hard: ~2% chance of intentional miss

**Status:** [x] Completed

---

### Task 6: Integrate AI with GameEngine
**Description:** Connect RoboPaddleAI to the game loop.
**Technical Approach:**
- Instantiate AI when PvC mode starts
- Call AI update() in game tick
- Pass current game state to AI

**Acceptance Criteria:**
- [x] AI is created when game starts in PvC mode
- [x] AI updates every game tick
- [x] AI controls paddle 2 position

**Status:** [x] Completed

---

### Task 7: Difficulty Configuration
**Description:** Define and apply difficulty presets.
**Technical Approach:**
- Create difficulty config object with all parameters
- Apply config when AI is instantiated
- Ensure difficulty selection from lobby is used

**Acceptance Criteria:**
- [x] Easy/Medium/Hard presets defined
- [x] Selected difficulty is applied to AI
- [x] Parameters can be easily tuned

**Status:** [x] Completed

---

### Task 8: Testing & Balancing
**Description:** Play-test each difficulty level and adjust parameters.
**Technical Approach:**
- Test Easy: Should be winnable by first-time players
- Test Medium: Should provide a fair challenge
- Test Hard: Should be very difficult but not impossible
- Adjust reaction delays and miss rates as needed

**Acceptance Criteria:**
- [x] All difficulty levels feel distinct
- [x] Game is fun and fair at each level

**Status:** [x] Completed

---

## Implementation Summary

### Files Created/Modified:
1. **Created:** `results/src/server/RoboPaddleAI.js` - AI logic with ball prediction, movement, and difficulty settings
2. **Modified:** `results/src/server/GameEngine.js` - Integrated AI into game loop
3. **Modified:** `results/src/server/index.js` - Pass game mode and difficulty to GameEngine

### AI Difficulty Parameters:

| Parameter | Easy | Medium | Hard |
|-----------|------|--------|------|
| Reaction Delay | 300ms | 150ms | 50ms |
| Miss Chance | 30% | 10% | 2% |
| Max Speed | 8 | 12 | 15 |
| Prediction Error | 50px | 25px | 5px |
| Update Interval | 100ms | 50ms | 16ms |

### Key Features:
- **Ball Prediction:** Calculates where ball will arrive, accounting for wall bounces
- **Reaction Delay:** AI waits before responding to direction changes
- **Intentional Misses:** AI occasionally aims at wrong position to be beatable
- **Smooth Movement:** Paddle moves at controlled speed, no teleporting
- **Dead Zone:** Prevents jittery movement when close to target

---

## Notes & Decisions

| Date | Decision |
|------|----------|
| 2026-01-30 | **RoboPaddle Color:** Keeping black (#1a1a1a) as set in Sprint 1.3 (not green as originally planned in Product Backlog). |
| 2026-01-30 | **Ball Prediction:** Using physics-based prediction with wall bounce calculation for more realistic AI behavior. |
| 2026-01-30 | **Miss System:** AI decides at ball direction change whether to miss, then applies offset throughout the rally. |
