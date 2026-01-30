# Sprint Backlog: Sprint 1.6

## Sprint Information

| Field | Value |
|-------|-------|
| **Sprint Number** | 1.6 |
| **Sprint Name** | Audio & Polish |
| **Reference** | Phase 6 Execution Plan → "Audio & Polish" |
| **Status** | ✅ Completed |

---

## Sprint Goal

### What are we building?
We are adding **sound effects and audio feedback** to make the game feel more immersive and arcade-like. Currently the game is silent - after this sprint, you'll hear satisfying sounds for paddle hits, wall bounces, scoring, and countdown.

### Expected Outcome (What you will see)
By the end of this sprint, you will be able to:
1. Hear a **"pop" sound** when the ball hits a paddle
2. Hear a **different sound** when the ball hits the top/bottom wall
3. Hear a **score sound** when a point is scored
4. Hear **countdown audio** (3, 2, 1, GO!)
5. **Mute/unmute** the game audio with a button on the host screen

### Acceptance Criteria
- [x] Ball hitting paddle plays a sound
- [x] Ball hitting wall plays a different sound
- [x] Scoring plays a celebratory sound
- [x] Countdown plays audio cues (3, 2, 1, GO)
- [x] Mute button visible on host screen
- [x] Mute state persists (remembered across page refresh)
- [x] All sounds respect mute setting

---

## Tasks

### Task 1: Audio System Setup
**Description:** Create an audio manager that preloads sounds and handles muting.
**Technical Approach:**
- Create `AudioManager` class in host game.js
- Preload all sound files on page load
- Implement `playSound(name)` method
- Implement `toggleMute()` method
- Store mute state in localStorage

**Acceptance Criteria:**
- [x] AudioManager class created
- [x] Sounds preloaded without delay
- [x] Mute state persists in localStorage

**Status:** [x] Completed

---

### Task 2: Paddle Hit Sound Effect
**Description:** Play a sound when the ball hits a paddle.
**Technical Approach:**
- Create or source a short "pop" or "ping" sound (MP3/WAV)
- Trigger sound in game engine when paddle collision detected
- Emit event from server, play on host client

**Acceptance Criteria:**
- [x] Sound plays on every paddle hit
- [x] Sound is satisfying and distinct
- [x] Respects mute setting

**Status:** [x] Completed

---

### Task 3: Wall Bounce Sound Effect
**Description:** Play a sound when the ball hits the top or bottom wall.
**Technical Approach:**
- Create or source a "thud" or softer bounce sound
- Different from paddle hit sound
- Trigger on wall collision

**Acceptance Criteria:**
- [x] Sound plays on wall contact
- [x] Distinct from paddle hit sound
- [x] Respects mute setting

**Status:** [x] Completed

---

### Task 4: Score Sound Effect
**Description:** Play a celebratory sound when a point is scored.
**Technical Approach:**
- Create or source a "goal" or "chime" sound
- Trigger when point is awarded
- More dramatic than gameplay sounds

**Acceptance Criteria:**
- [x] Sound plays when point is scored
- [x] Distinct from gameplay sounds
- [x] Respects mute setting

**Status:** [x] Completed

---

### Task 5: Countdown Audio
**Description:** Play audio cues during the 3-2-1 countdown.
**Technical Approach:**
- Create beep sounds for 3, 2, 1
- Create distinct "GO!" sound
- Sync with visual countdown

**Acceptance Criteria:**
- [x] Audio plays for each countdown number
- [x] Final "Go!" sound is distinct
- [x] Respects mute setting

**Status:** [x] Completed

---

### Task 6: Mute Button UI
**Description:** Add a mute/unmute button to the host screen.
**Technical Approach:**
- Add speaker icon in corner of host screen
- Click toggles AudioManager.muted state
- Visual indicator (icon change) shows muted state
- State saved to localStorage

**Acceptance Criteria:**
- [x] Mute button/icon visible on host screen
- [x] Clicking toggles mute on/off
- [x] Visual feedback shows current state
- [x] State persists across page refresh

**Status:** [x] Completed

---

## Notes & Decisions

| Date | Decision |
|------|----------|
| 2026-01-30 | **Sound Sources:** Will use royalty-free sounds or generate simple tones programmatically using Web Audio API if needed. |
| 2026-01-30 | **No Voice Announcement:** Voice was removed in Sprint 1.5 due to browser compatibility. Focus on sound effects only. |

