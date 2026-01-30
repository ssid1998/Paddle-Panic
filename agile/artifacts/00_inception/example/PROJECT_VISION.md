# 🔭 Project Vision: Pac-Party-Web

**Date:** Mon Dec 15 2025
**Status:** Inception Phase Complete

## 1. Elevator Pitch
For **students and visitors at the university trade fair** who want a **quick, engaging, and social experience**, **Pac-Party-Web** is a multiplayer browser game played on a large shared screen. Unlike static tech demos or console games that require waiting in line for a controller, our product allows up to 5 visitors to join instantly using their own smartphones as controllers via a simple QR code scan.

## 2. Business Goals & Motivation
We are building this to solve a specific problem at our trade fair booth: **Engagement.**
*   **The Problem:** Most booths have static posters or demos that only one person can use at a time.
*   **The Solution:** A high-energy, chaotic multiplayer game that draws a crowd. The game serves as a "Honey Pot" to attract students to our booth so we can talk to them about our department.
*   **The Message:** By running this in the browser (without app installs), we demonstrate that we understand modern, accessible technology.

## 3. Scope & Constraints
To ensure the project is successful in the chaotic environment of a trade fair, we have defined strict boundaries:

### In Scope
*   **Role-Based Multiplayer:** One player is Pacman, four players are Ghosts.
*   **Bring Your Own Device (BYOD):** Visitors use their own phones.
*   **Zero Friction:** No app installation, no login, no registration. Scan and play.
*   **Short Sessions:** A hard time limit (3 minutes) ensures high throughput, so nobody hogs the booth.

### Out of Scope
*   **Online Play:** We do not support playing over the internet. This is a local event only.
*   **Persistence:** We do not save high scores or user profiles forever. The game resets after every round.
*   **Complex Graphics:** We focus on retro-style clarity, not 3D realism.

### Key Risks
*   **Network Stability:** The Wi-Fi at trade fairs is notoriously unreliable. The game must handle lag or brief disconnects without crashing.
*   **Usability:** Players will be looking at the big screen, not their phones. The phone controller must be usable "blindly" (simple layout).

## 4. The Product Strategy (Epics)
Our roadmap to the fair focuses on four main areas:
1.  **Connectivity:** Making it easy to join.
2.  **Gameplay:** Making it fun (Pacman rules).
3.  **Controller:** Making it playable on any phone.
4.  **Display:** Making it look good on a projector.
