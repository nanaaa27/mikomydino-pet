# My Dino Pet 🦕🌿

A beautifully designed, interactive Virtual Pet game inspired by a clean and cozy **Matcha-themed aesthetic**. Built natively using Vanilla JavaScript, HTML5, and CSS3, this application simulates a complete virtual pet lifecycle and game engine directly within a mobile viewport framework.

## 🌟 Live Demo
The project is deployed and accessible via GitHub Pages! You can check out your virtual pet here:
👉 **[nanaaa27.github.io/mikomydino-pet](https://nanaaa27.github.io/mikomydino-pet/)**

---

## 🎨 Core Features

### 1. Dynamic Pet Lifecycle & State Machine
- **Vital Statistics:** Tracks **Energy (🍗)** and **Happiness (🎈)** in real-time. Stats gradually decay every 10 seconds to simulate a live creature.
- **State Feedback:** The pet dynamically changes emojis, facial expressions, and descriptive banners depending on current health boundaries (Happy 🌿, Critical 🚨, or Fainted 😢).

### 2. High-Performance Mini-Game Engine (`RequestAnimationFrame`)
- Features an interactive **Dino Jump** side-scroller action game.
- Uses browser-native bounding-box physics tracking at a smooth **60 FPS** via `requestAnimationFrame` for pixel-precise obstacle collision detection.
- Rewarding game loop system that awards **Coins** and **XP** upon successfully clearing hurdles.

### 3. Real-Time Mechanics & Premium Shop
- **Daily Feeding Limits:** Implements a strict **24-hour cycle restriction** (Max 3 free feedings daily) leveraging structural system clocks synchronized via `localStorage`.
- **Matcha Premium Shop:** Earned coins from the mini-game can be exchanged to buy specialty premium goods like *Matcha Ice Cream* to restore high vital volumes (+40 Energy).

### 4. Interactive Immersive Environmental Cycles
- **Sleep Management:** Toggle day/night cycles seamlessly. Activating Sleep Mode smoothly transforms the entire UI layout into an ultra-dark environment, safely halting vital decay while the pet rests.
- **Persistent State:** Saves the pet's custom name, status variables, coin balances, level values, and timestamp locks across sessions locally.

---

## 🛠️ Technology Stack & Architectures
- **Frontend Architecture:** Structural HTML5 Semantic tags.
- **Styling & Motion:** Advanced CSS3 Keyframe animations (Parallax cloud cycles, active bounce states, scale pop feedback) paired with custom CSS Variables for dynamic system-wide theme mapping.
- **Core Engine:** Pure Native Vanilla JavaScript (ES6+) structured around high-speed render loops, localized event handling, state serialization, and performance memory leak preventions.

---

## 📂 Project Directory Structure
```text
mikomydino-pet/
│
├── index.html   # Main structural app canvas & UI layout
├── style.css    # Aesthetic Matcha layout styling & Dark-Theme engine
└── script.js    # Core game loop logic, system engines, & local storage

