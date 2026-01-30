# Project Vision: Paddle Panic (Technical Refinement)

**Date:** Fri Jan 30 2026
**Status:** Architecture Complete
**Phase:** 01_architecture

---

## 1. Elevator Pitch

*For classroom demonstrators and event organizers who want an engaging interactive exhibit, **Paddle Panic** is a browser-based multiplayer paddle game that transforms any screen into a competitive arena with smartphone controllers. Unlike traditional arcade setups requiring physical controllers, our product uses QR code scanning to turn any mobile phone into a game controller instantly—with near-zero latency thanks to WebSocket technology.*

---

## 2. Business Goals

1. **Demonstrate an engaging, interactive game experience** for classroom presentations
2. **Enable spectators to watch exciting matches** on the big screen
3. **Provide seamless entry via QR codes** with zero app installation
4. **Support both single-player (vs AI) and two-player competitive modes**

---

## 3. Technical Vision

### The Core Challenge

Paddle Panic is not a typical website. It's a **real-time game** where pressing a button on your phone must move a paddle on the big screen within milliseconds. This requires specialized technology designed for instant, two-way communication.

### The Solution: Authoritative Server Model

We will build Paddle Panic using an **Authoritative Server Model**. Here's what that means:

| Concept | Explanation |
|---------|-------------|
| **Authoritative Server** | The server (running on the laptop) is the "referee." It's the only one who knows the true position of the ball, paddles, and scores. |
| **Dumb Clients** | The phones and host screen are just displays. They show what the server tells them and send user input to the server. |
| **Game Loop** | A piece of code running 60 times per second on the server, calculating ball position, collisions, and scores. |

**Why this approach?**
- **Fairness:** No one can cheat by hacking their phone.
- **Consistency:** Everyone sees the same thing at the same time.
- **Reliability:** Brief disconnections don't cause the game to break.

---

## 4. Technology Stack

### Overview Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         LAPTOP                                   │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                    NODE.js SERVER                            ││
│  │  • Express.js serves web pages                               ││
│  │  • Socket.io handles real-time communication                 ││
│  │  • Game loop runs 60 times/second                            ││
│  │  • Manages game state (ball, paddles, scores)                ││
│  └─────────────────────────────────────────────────────────────┘│
│                              ▲                                   │
│                              │ WebSocket Connection              │
│                              ▼                                   │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                 HOST SCREEN (Browser)                        ││
│  │  • HTML5 Canvas renders the game                             ││
│  │  • QRCode.js generates join QR code                          ││
│  │  • Web Audio API plays sounds                                ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
                               ▲
                               │ WiFi (Same Network)
                               ▼
┌─────────────────────┐   ┌─────────────────────┐
│   PHONE 1 (Browser) │   │   PHONE 2 (Browser) │
│  • Socket.io client │   │  • Socket.io client │
│  • Touch buttons    │   │  • Touch buttons    │
│  • Vibration API    │   │  • Vibration API    │
└─────────────────────┘   └─────────────────────┘
```

### Technology Choices Explained

| Technology | What It Is | Why We Chose It |
|------------|------------|-----------------|
| **Node.js** | JavaScript runtime for servers | Fast, efficient, uses the same language as the browser |
| **Express.js** | Web server framework | Simple, industry-standard, serves our HTML/CSS/JS files |
| **Socket.io** | Real-time communication library | Creates persistent connections for instant message passing |
| **HTML5 Canvas** | Browser drawing API | High-performance graphics rendering at 60 FPS |
| **QRCode.js** | QR code generator | Creates scannable codes from URLs |
| **Web Audio API** | Browser sound API | Low-latency sound effects, built into browsers |
| **Vibration API** | Phone vibration | Tactile feedback, built into mobile browsers |
| **Web Speech API** | Text-to-Speech | Announcer voice that can say any player name |

---

## 5. Scope & Constraints

### In Scope

| Feature | Technical Notes |
|---------|-----------------|
| Browser-based game on host screen | HTML5 Canvas + Socket.io client |
| Mobile browser controller via QR | Dynamic URL with server IP |
| Player vs RoboPaddle (AI) mode | Server-side AI with 3 difficulty levels |
| Player vs Player mode | Two Socket.io connections to same game |
| Real-time paddle control | Socket.io events, ~16ms response time |
| Score tracking (first to 11) | Server-side state management |
| Sound effects + announcer | Web Audio API + Web Speech API |
| Attract mode animation | Canvas animation loop when idle |

### Out of Scope

| Feature | Reason |
|---------|--------|
| Native mobile app | Browser-based is simpler, no installation needed |
| Online multiplayer (internet) | Local network only, reduces latency and complexity |
| Tournament brackets/leaderboards | Not needed for classroom demo |
| More than 2 players per match | Classic Pong is 1v1 |
| Persistent user accounts | Session-based only |

### Technical Risks

| Risk | Mitigation |
|------|------------|
| Network latency on WiFi | Use local network only, Socket.io optimized for low latency |
| Mobile browser compatibility | Test on iOS Safari + Android Chrome, use standard APIs |
| QR code scanning in poor lighting | Generate high-contrast QR codes, test in demo environment |
| Phone screen sleeps during game | Use Wake Lock API if available, or instruct users |

---

## 6. Glossary (For Beginners)

| Term | Definition |
|------|------------|
| **WebSocket** | A technology that keeps a connection open between browser and server, allowing instant two-way communication. Unlike normal web requests (which are like sending letters), WebSockets are like a phone call—always connected. |
| **Socket.io** | A popular library that makes WebSockets easy to use. It handles reconnection, fallbacks, and provides a simple event-based API. |
| **Game Loop** | A piece of code that runs many times per second (typically 30-60), updating game state each time. Each run is called a "tick." |
| **Authoritative Server** | A design pattern where the server is the "single source of truth." Clients send input, but only the server decides what really happens. |
| **Canvas** | An HTML element that lets you draw graphics using JavaScript. Think of it as a digital painting canvas. |
| **Express.js** | A minimal web framework for Node.js. It handles routing (which URL shows which page) and serving files. |
| **API** | Application Programming Interface. A set of functions/features provided by a browser or library that you can use in your code. |
| **State Machine** | A programming pattern for managing different "states" (like IDLE, PLAYING, GAME_OVER) and the transitions between them. |
| **Collision Detection** | Code that checks if two objects are touching (like ball hitting paddle). |
| **Text-to-Speech (TTS)** | A browser feature that converts text into spoken audio. |

---

## 7. Roadmap (The Epics)

The work is organized into 6 Epics, built in a specific order to manage risk:

| Phase | Epic | Goal |
|-------|------|------|
| **1** | Technical Foundation | Prove real-time communication works |
| **2** | Core Gameplay | Ball physics, scoring, playable PvP match |
| **3** | Lobby & Entry | QR scanning, name entry, mode selection |
| **4** | AI Opponent | RoboPaddle with Easy/Medium/Hard |
| **5** | Match Flow | Rematch, disconnect handling, attract mode |
| **6** | Audio & Polish | Sound effects, announcer, vibration |

**Why this order?**
- **Phase 1 first:** If real-time communication fails, nothing else matters. Test the riskiest part first.
- **Phase 2 before Phase 3:** Better to have a working game with ugly entry flow than a beautiful lobby with no game.
- **Phase 6 last:** Polish is important but not critical. We add it after core functionality works.
