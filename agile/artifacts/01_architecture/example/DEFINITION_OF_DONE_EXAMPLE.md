# ✅ Definition of Done (DoD) - Pac-Party-Web

This document serves as our binding **Quality Contract**.
A User Story or Task is only considered "Done" when all relevant criteria in this list are met. This ensures that we don't just "write code", but build a robust, playable product for the fair.

---

## 1. Code Quality & Hygiene
*Motivation: We work in a team. Messy code creates bugs and makes it impossible for others to help you.*

*   [ ] **No Linting Errors:** The project must pass the standard ESLint check without warnings.
    *   *Why?* To catch syntax errors and unused variables before they crash the server.
    *   *How to check:* Run `npm run lint`.
*   [ ] **Clean Formatting:** The code follows a consistent style (Prettier).
    *   *Why?* So we don't waste time arguing about semicolons or indentation during review.
*   [ ] **Descriptive Naming:** Variables are named `isGameActive` instead of `flag`, and `playerSocket` instead of `s`.
    *   *Why?* Because code is read much more often than it is written.
*   [ ] **No "Dead" Code:** No commented-out blocks or forgotten `console.log("here")` statements.
    *   *Why?* It confuses the next developer ("Is this important? Should I uncomment it?").

## 2. Runtime Stability (The "Fair-Proofing")
*Motivation: The trade fair is a chaotic environment. The Wi-Fi will fail. Users will do weird things.*

*   [ ] **Crash Resilient:** The Node.js server must NEVER crash, even if a client sends garbage data or disconnects abruptly.
    *   *Why?* If the server crashes, 5 games (25 people) stop instantly. That is a disaster.
    *   *How to check:* Try disconnecting your phone while playing. Try sending `null` to the socket.
*   [ ] **Reconnection Safe:** If a player refreshes their browser, they must be able to rejoin the game (or at least the lobby) without breaking the state for others.
    *   *Why?* Accidental refreshes happen all the time on mobile.
*   [ ] **Local Network Verified:** The feature must be tested on a *real* network (Laptop + Router + Phone), not just on `localhost`.
    *   *Why?* Latency and firewall issues only show up on a real network.

## 3. Mobile User Experience (UX)
*Motivation: Our players use smartphones, not keyboards. The web on mobile is tricky.*

*   [ ] **Touch Targets:** Buttons must be large enough (>44px) to be hit blindly with a thumb.
    *   *Why?* Players look at the big screen, not their phone. Small buttons lead to frustration.
*   [ ] **Orientation Lock (Soft):** The UI must either adapt to Landscape/Portrait OR clearly tell the user to rotate their phone.
    *   *Why?* A distorted UI makes the game unplayable.
*   [ ] **No Zoom/Scroll:** The viewport must be locked (`user-scalable=no`).
    *   *Why?* Double-tapping shouldn't zoom in the page. It should fire the button twice.

## 4. Documentation & Handover
*Motivation: We might forget how this works by tomorrow.*

*   [ ] **README Updated:** If this feature requires a new installation step (e.g., `npm install socket.io`), it must be added to the README.
*   [ ] **API Comments:** Complex logic (like the Collision Detection algorithm) must be commented with "Why", not just "What".
