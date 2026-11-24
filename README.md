## 🎮 Features

### 1. Game Mechanics
- **4×4 Grid**: Classic 4×4 board with 2 initial randomly spawned tiles (2 or 4).
- **Smooth Controls**:
  - **Keyboard**: Arrow keys (`↑`, `↓`, `←`, `→`) or `WASD` keys.
  - **Mobile**: Touch swipe gestures with scroll-prevention on the board.
  - **Undo Shortcut**: `Ctrl+Z` / `Cmd+Z`.
- **Accurate Merging**:
  - Tiles merge into their sum when colliding with matching values.
  - Strict 2048 rules: a tile can only merge once per turn.
  - Prevents invalid moves from spawning new tiles or incrementing moves.
- **Score & High Score**:
  - Displays current score and best score, persisted to `localStorage`.
  - Floating score indicators (`+4`, `+16`, etc.) on every successful merge.
- **Victory & Game Over Detection**:
  - Reaching **2048** triggers victory celebration with celebratory fanfare and confetti.
  - Players can choose to **"Keep Playing"** for 4096, 8192, and beyond, or start a new game.
  - Detects game-over when the board is full and no adjacent tiles can merge.

### 2. User Interface & Themes
- **Modern Minimalist Aesthetic**:
  - Rounded corners, subtle drop shadows, and soft gradients.
  - Smooth tile translation transitions and merge pop animations.
  - Responsive design adapting from mobile phones to tablets and desktop screens.
- **Themes**:
  - Instant Light & Dark mode toggle with persistent preference in `localStorage`.
- **Exact Color Palette**:
  - `2`: Light cream
  - `4`: Soft beige
  - `8`: Light orange
  - `16`: Orange
  - `32`: Coral
  - `64`: Red-orange
  - `128`: Yellow
  - `256`: Golden yellow
  - `512`: Gold
  - `1024`: Deep orange
  - `2048`: Bright golden gradient with pulsating glow effect
  - `4096+`: Deep violet / amethyst, cyan, and neon hues with dynamic font scaling for large numbers.

### 3. Controls & Modals
- **New Game & Restart**:
  - Confirmation modal before restarting an active game to prevent accidental resets.
- **Undo Last Move**:
  - Reverts the board, score, and moves back to previous turn.
- **How to Play**:
  - Interactive rules and controls modal guide.
- **Move Counter & Game Timer**:
  - Real-time move tracking and game duration counter (`MM:SS`).
- **Sound Effects (Web Audio API)**:
  - Custom synthesized sound effects (no external audio assets required):
    - Soft whoosh/click on tile movement.
    - Marimba/chime tones on merge (pitch dynamically scales with tile value).
    - Triumphant C-major arpeggio fanfare on reaching 2048.
    - Gentle descending minor chime on game over.
  - Quick mute/unmute toggle button with saved preference.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React (`lucide-react`)
- **Celebration Effects**: `canvas-confetti`
- **Audio**: Web Audio API (cross-browser synthesized audio)
- **State & Storage**: React Hooks (`useState`, `useCallback`, `useRef`, `useEffect`) + `localStorage`
- **Testing**: Vitest (`vitest`)

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### 3. Run Test Suite
```bash
npm run test
```
Runs the 16 automated unit tests covering game board matrix operations, line shifts, merge rules, edge cases, tile styling, and sound state.

### 4. Build for Production
```bash
npm run build
```
Generates optimized, minified production assets in the `dist/` directory.

---
### WEBSITE
-open `http://2048-snowy-tau.vercel.app` to play

---
## 📁 Project Structure

```
2048/
├── public/
│   └── favicon.svg           # 2048 golden icon
├── src/
│   ├── components/
│   │   ├── Board.tsx         # 4x4 board with swipe gestures & responsive layout
│   │   ├── Controls.tsx      # Action bar (New Game, Restart, Undo, Sound, Theme, Info)
│   │   ├── Header.tsx        # Title, Score, Best Score, Moves, Timer, floating popups
│   │   ├── Modals.tsx        # Restart confirmation, How to Play, Victory, Game Over
│   │   └── TileView.tsx      # Animated tile component with dynamic styles & colors
│   ├── hooks/
│   │   └── useGame.ts        # Centralized game state, timer, storage, undo history
│   ├── types/
│   │   └── game.ts           # TypeScript interfaces and types
│   ├── utils/
│   │   ├── audio.ts          # Web Audio API sound effect synthesizer
│   │   ├── audio.test.ts     # Sound tests
│   │   ├── gameLogic.ts      # Core 2048 sliding, merging, and move validation
│   │   ├── gameLogic.test.ts # 11 comprehensive game rule unit tests
│   │   ├── tileColors.ts     # Tile color mappings, glows, and responsive typography
│   │   └── tileColors.test.ts# Tile styling tests
│   ├── App.tsx               # Main application layout and keyboard handlers
│   ├── index.css             # Tailwind base styles and keyframe animations
│   └── main.tsx              # React DOM entrypoint
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```
