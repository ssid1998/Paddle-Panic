# Phase Summary: Architecture & Technical Strategy

**Date:** Fri Jan 30 2026
**Phase:** 01_architecture
**Agent:** @architect

---

## 1. What We Achieved

We started this phase with a clear product vision from Phase 0: **Paddle Panic**, a browser-based Pong-style game where players control paddles using their smartphones, competing on a big screen for classroom demonstrations.

During our analysis, we identified a critical challenge: **real-time responsiveness**. When someone presses a button on their phone, the paddle must move on the big screen within milliseconds. This isn't how normal websites work—we needed specialized technology.

We confirmed this is a **Greenfield project** (starting from scratch), which gave us complete freedom to choose the best tools for the job. We also confirmed the deployment environment: a laptop running the game, with phones connecting over the same WiFi network.

The result? A complete technical blueprint that transforms "what the user wants" into "how we'll build it."

---

## 2. Key Decisions & Rationale

### Decision 1: Node.js + Express + Socket.io (The Server Stack)

**What we chose:** JavaScript running on Node.js, with Express serving web pages and Socket.io handling real-time communication.

**Why:** 
- Node.js is fast and efficient for real-time applications
- Socket.io provides WebSocket connections—think of it as a permanent "phone line" between the server and each browser, allowing instant back-and-forth messaging
- Using JavaScript everywhere (server + browser) means one language to learn

### Decision 2: Authoritative Server Model

**What we chose:** The server is the "referee." It calculates the true position of everything and tells the clients what to display.

**Why:**
- Prevents cheating (phones can't lie about paddle position)
- Ensures everyone sees the same thing
- Brief disconnections don't break the game

### Decision 3: HTML5 Canvas for Graphics

**What we chose:** The built-in browser drawing system for rendering the game.

**Why:**
- High performance (60 frames per second)
- No plugins or downloads needed
- Full control over every pixel

### Decision 4: Web Speech API for Announcer

**What we chose:** Browser's built-in Text-to-Speech instead of pre-recorded audio.

**Why:**
- Can say ANY player name (not limited to pre-recorded options)
- No need to record and store audio files
- Works in all modern browsers

### Decision 5: Phased Execution ("Walking Skeleton" First)

**What we chose:** Build in 6 phases, starting with the riskiest part—proving that a phone can move a paddle on screen.

**Why:**
- If real-time communication fails, we know immediately (before investing in other features)
- Each phase is testable independently
- Progress is visible and measurable

---

## 3. What's Next?

The development team now has everything needed to begin building:

| Artifact | Purpose |
|----------|---------|
| **PROJECT_VISION.md** | The "why" and "what"—now with technical decisions explained |
| **PRODUCT_BACKLOG.md** | The "how"—stories organized into 6 buildable phases with technical notes |
| **DEFINITION_OF_DONE.md** | The quality checklist every story must pass |

### Recommended First Steps:

1. **Set up the project** (Story 0.1): `npm init`, install dependencies, create folder structure
2. **Get Socket.io working** (Stories 0.2-0.3): Prove the connection works
3. **Move a paddle** (Stories 0.4-0.6): The fundamental proof-of-concept

Once Phase 1 is complete (phone can move paddle on screen), we have confidence that the architecture works and can proceed to build the full game.

---

## 4. Summary for Non-Technical Stakeholders

**In plain English:**

We've figured out how to build Paddle Panic. The key insight is that this isn't a normal website—it needs to respond in milliseconds, like a video game. We've chosen proven technologies that are designed for exactly this kind of real-time application.

We'll build in phases:
1. First, prove the phones can control the paddles (the risky part)
2. Then add the ball physics and scoring
3. Then add the QR code and player name entry
4. Then add the AI opponent
5. Then add the rematch and flow between games
6. Finally, add sound effects and polish

Each phase produces something testable. We'll know early if something doesn't work.

**The team is ready to start coding.**
