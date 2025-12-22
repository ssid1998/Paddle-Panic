# 🛠️ Technology Stack & Architecture Strategy

**Date:** Mon Dec 22 2025
**Phase:** 01_architecture

## 1. The Core Philosophy: "Zero Dependencies"
We are building a retro arcade game. To honor the spirit of the era and ensure maximum performance/compatibility, we will use **Vanilla JavaScript** with **no external frameworks** (no React, no Phaser, no jQuery).

*   **Why?**
    *   **Performance:** Direct DOM and Canvas manipulation is faster than going through a Virtual DOM.
    *   **Education:** It forces us to understand the game loop and math, rather than relying on "magic" libraries.
    *   **Portability:** The final game will be a single HTML file (or very few files) that runs anywhere without a build step.

## 2. The Tech Stack

| Component | Technology | Rationale |
| :--- | :--- | :--- |
| **Runtime** | **Browser (Client-Side Only)** | No server required. The game logic runs entirely on the user's machine. |
| **Language** | **ECMAScript 6+ (Modern JS)** | We will use classes (`class Game`), const/let, and arrow functions for clean code. |
| **Rendering** | **HTML5 `<canvas>` API** | The standard for 2D web graphics. It allows us to draw 60 frames per second efficiently. |
| **Input** | **Native DOM Events** | `keydown` and `keyup` listeners attached to the `window` object. |
| **Styling** | **CSS3** | Minimal CSS for centering the canvas and handling the "Retro CRT" effects (optional). |

## 3. Key Architectural Patterns

### A. The Game Loop (`requestAnimationFrame`)
We will **not** use `setInterval`. Instead, we use the browser's native sync method.

```javascript
function gameLoop() {
    update(); // 1. Calculate Physics
    draw();   // 2. Render Graphics
    requestAnimationFrame(gameLoop); // 3. Schedule next frame
}
```

### B. The Input State Map
To solve the "jittery movement" problem caused by operating system key repeat rates, we separate **Input Events** from **Movement Logic**.

1.  **Event Listener:** When a key is pressed, we simply set a boolean flag: `keys['ArrowUp'] = true`.
2.  **Game Loop:** In the `update()` function, we check: `if (keys['ArrowUp']) player.y -= speed`.

This ensures smooth, continuous movement regardless of keyboard settings.

### C. Axis-Aligned Bounding Box (AABB) Collision
We will use the simplest form of collision detection for rectangles.

```javascript
if (rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y) {
    // Collision detected!
}
```

## 4. Directory Structure
We will keep it simple to start.

```text
paddle-panic/
├── index.html       # The entry point
├── style.css        # Visual styling
├── src/
│   ├── main.js      # The Game Loop & Initialization
│   ├── Game.js      # The Game Manager Class
│   ├── Entity.js    # Base class for game objects
│   ├── Paddle.js    # Player logic
│   ├── Ball.js      # Physics logic
│   └── Input.js     # Keyboard handling
└── assets/          # Sounds and images
```
