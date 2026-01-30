# Definition of Done: Paddle Panic

**Date:** Fri Jan 30 2026
**Phase:** 01_architecture

---

## Introduction

The **Definition of Done (DoD)** is a shared agreement on what "finished" means. Before any User Story can be marked as complete, it must pass ALL items on this checklist. This ensures consistent quality across the project.

Think of it like a quality control checklist in a factory. Every product must pass the same tests before shipping.

---

## The Checklist

Every completed User Story must satisfy ALL of the following:

---

### 1. Code Quality

| Criterion | Description | Why It Matters |
|-----------|-------------|----------------|
| **Code runs without errors** | No crashes, no unhandled exceptions, no console errors | Broken code can't be shipped |
| **Code is readable** | Clear variable names, consistent formatting, logical structure | Others (and future you) need to understand it |
| **No dead code** | Remove commented-out code, unused variables, test `console.log` statements | Clutter makes code harder to maintain |
| **DRY principle followed** | No copy-pasted logic; reusable code is in functions | Reduces bugs and makes changes easier |
| **Error handling in place** | Graceful handling of edge cases (disconnection, invalid input) | Prevents crashes from unexpected situations |

---

### 2. Functionality

| Criterion | Description | Why It Matters |
|-----------|-------------|----------------|
| **Acceptance Criteria met** | All criteria listed in the User Story are verified | This is the contract with the user |
| **Feature works end-to-end** | Tested from user action to final result, not just isolated pieces | Integration bugs are common |
| **Edge cases handled** | What if the user double-taps? Disconnects mid-action? Enters weird input? | Real users do unexpected things |
| **No regressions** | New code doesn't break existing features | Every change is a risk to stability |

---

### 3. Real-Time Performance

| Criterion | Description | Why It Matters |
|-----------|-------------|----------------|
| **Latency under 100ms** | Input-to-display delay feels instant | Slow response ruins gameplay |
| **60 FPS rendering** | Host screen animation is smooth, no jank | Choppy graphics look unprofessional |
| **No memory leaks** | Game can run for hours without slowing down | Classroom demos may run all day |
| **Handles disconnection gracefully** | Brief WiFi drops don't crash the game | WiFi is unreliable |

---

### 4. Cross-Device Compatibility

| Criterion | Description | Why It Matters |
|-----------|-------------|----------------|
| **Works on Chrome (desktop)** | Host screen tested on latest Chrome | Primary host browser |
| **Works on Safari (iOS)** | Controller tested on iPhone Safari | Many students have iPhones |
| **Works on Chrome (Android)** | Controller tested on Android Chrome | Many students have Android |
| **Touch controls work correctly** | No accidental zoom, scroll, or double-tap issues | Mobile browsers have quirks |
| **Vibration works (where supported)** | Haptic feedback triggers on compatible devices | Key feature for controller |

---

### 5. User Experience

| Criterion | Description | Why It Matters |
|-----------|-------------|----------------|
| **UI is intuitive** | A new user can figure it out without instructions | Classroom demo has no time for tutorials |
| **Text is readable** | Font size appropriate for big screen and mobile | Accessibility matters |
| **Colors are distinguishable** | Paddle colors clearly different, ball visible on table | Color-blind users exist |
| **Feedback is immediate** | Button press, score, game over—user knows something happened | Silence feels like a bug |
| **Error messages are helpful** | "Connection lost. Reconnecting..." not "Error 502" | Users need to know what's happening |

---

### 6. Audio (When Applicable)

| Criterion | Description | Why It Matters |
|-----------|-------------|----------------|
| **Sounds play at correct moment** | Ball hit sound plays when ball hits paddle, not before/after | Timing is immersion |
| **Volume is balanced** | No sound is painfully loud compared to others | Jarring audio is unprofessional |
| **Mute works completely** | Mute button silences ALL audio including TTS | Users must have control |
| **No audio pop/click** | Sounds don't have artifacts at start/end | Low-quality audio is noticeable |

---

### 7. Security & Robustness

| Criterion | Description | Why It Matters |
|-----------|-------------|----------------|
| **Input is sanitized** | Player names can't inject HTML/JavaScript | Security 101 |
| **Server validates all input** | Clients can't send fake scores or invalid moves | Authoritative server principle |
| **Rate limiting considered** | Spamming buttons doesn't crash the server | Protection against abuse |

---

### 8. Documentation

| Criterion | Description | Why It Matters |
|-----------|-------------|----------------|
| **Code comments for complex logic** | Non-obvious code has explanatory comments | Future maintainers need context |
| **README updated if needed** | New setup steps or dependencies documented | Onboarding new developers |
| **Story marked complete in backlog** | Status updated in project tracking | Team knows what's done |

---

## How to Use This Checklist

### Before Marking a Story as "Done":

1. **Self-Review:** Developer checks all applicable items
2. **Demo:** Show the feature working to another person (if available)
3. **Cross-Device Test:** Test on at least one phone + laptop
4. **Update Backlog:** Move story to "Completed" column

### If a Criterion Doesn't Apply:

Some stories won't need all criteria. For example:
- A backend-only story doesn't need "Touch controls work correctly"
- A visual-only story doesn't need "Audio plays at correct moment"

Mark these as "N/A" (Not Applicable) rather than skipping silently.

---

## Definition of Done for Each Phase

### Phase 1 (Technical Foundation) - Additional Criteria:
- [ ] Server starts successfully with `npm start`
- [ ] Socket.io connection established between all clients
- [ ] Input from phone moves paddle on host screen

### Phase 2 (Core Gameplay) - Additional Criteria:
- [ ] Complete match can be played (first to 11)
- [ ] Ball physics feel fair and responsive
- [ ] Score updates correctly

### Phase 3 (Lobby & Entry) - Additional Criteria:
- [ ] QR code scannable on multiple phone types
- [ ] Full flow works: scan → name → mode → ready → countdown → play

### Phase 4 (AI Opponent) - Additional Criteria:
- [ ] Easy difficulty is beatable by a beginner
- [ ] Hard difficulty is challenging for skilled players
- [ ] AI movement looks natural, not robotic

### Phase 5 (Match Flow) - Additional Criteria:
- [ ] Game can run for 30+ minutes with players coming and going
- [ ] No orphaned connections or memory buildup

### Phase 6 (Polish) - Additional Criteria:
- [ ] All sounds play at appropriate moments
- [ ] Mute persists across page refresh
- [ ] Announcer pronounces names reasonably well

---

## The "Good Enough" Principle

Perfection is the enemy of progress. A story is "Done" when it meets the criteria above—not when it's perfect. Polish can always be added later. Ship working software, then iterate.

**Remember:** A feature that's 90% polished and in users' hands is infinitely more valuable than a feature that's 100% polished and still in development.
