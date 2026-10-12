# Knucklebones Web

## Development Roadmap

### Goal

Create a web version of Knucklebones playable against an AI opponent, with the possibility of adding multiplayer support later.

---

# PHASE 1 - Display the Board

### Objective

Render both game boards on screen.

### Create Components

```text
src/components/

Board.tsx
Column.tsx
Cell.tsx
```

### Visual Layout

Player

```text
[ ] [ ] [ ]
[ ] [ ] [ ]
[ ] [ ] [ ]
```

Enemy

```text
[ ] [ ] [ ]
[ ] [ ] [ ]
[ ] [ ] [ ]
```

No game logic yet.

Focus only on rendering the UI.

---

# PHASE 2 - Data Model

### Objective

Represent the board state in memory.

### Create Types

```typescript
type Cell = number | null;

type Column = Cell[];

type Board = Column[];
```

Example:

```typescript
[
 [6,2,null],
 [3,null,null],
 [1,1,5]
]
```

Create the main state:

```typescript
const [playerBoard, setPlayerBoard] = useState(...)
const [enemyBoard, setEnemyBoard] = useState(...)
```

---

# PHASE 3 - Dice Rolling

### Objective

Generate a random dice value.

Create:

```typescript
rollDice()
```

Return:

```typescript
1-6
```

Store the result in:

```typescript
currentRoll
```

Display:

```text
Current Dice: 5
```

---

# PHASE 4 - Place Dice

### Objective

Allow the player to place the rolled die.

When a column is clicked:

1. Find the first available slot.
2. Insert the die.
3. Prevent interaction with full columns.

Example:

Before:

```text
[6]
[ ]
[ ]
```

After placing a 4:

```text
[6]
[4]
[ ]
```

---

# PHASE 5 - Turn System

### Objective

Alternate turns between Player and AI.

Create:

```typescript
currentPlayer
```

Values:

```typescript
"player"
"enemy"
```

Flow:

```text
Player rolls
↓
Player places
↓
AI plays
↓
Player rolls
```

---

# PHASE 6 - Basic AI

### Objective

Create a functional opponent.

First version:

```text
Choose a random valid column.
```

No strategy.

Just play legal moves.

---

# PHASE 7 - Dice Destruction

### Objective

Implement the core Knucklebones mechanic.

Example:

Player places a:

```text
5
```

In column:

```text
2
```

Remove all:

```text
5
```

From the opponent's column:

```text
2
```

Create:

```typescript
removeMatchingDice()
```

---

# PHASE 8 - Score Calculation

### Objective

Calculate and display scores.

Create:

```typescript
calculateColumnScore()
```

Examples:

Single die:

```text
5
```

Result:

```text
5
```

---

Pair:

```text
5 5
```

Result:

```text
20
```

---

Triple:

```text
5 5 5
```

Result:

```text
45
```

---

Mixed column:

```text
3 3 1
```

Result:

```text
13
```

Formula:

```text
(3 + 3) × 2 + 1
```

Create:

```typescript
calculateBoardScore()
```

Display:

```text
Player: 54
Enemy: 48
```

---

# PHASE 9 - End Game

### Objective

Determine when the match is over.

When a board contains:

```text
9 occupied cells
```

End the game.

Display:

```text
You Win
```

or

```text
You Lose
```

---

# PHASE 10 - UI Improvements

### Objective

Make the game visually appealing.

Add:

* Animations
* Custom dice graphics
* Sound effects
* Dice destruction effects
* Score indicators
* Better styling

---

# PHASE 11 - Intermediate AI

### Objective

Create a smarter opponent.

Priorities:

1. Complete triples
2. Complete pairs
3. Destroy opponent combinations
4. Maximize score

Create:

```typescript
evaluateMove()
```

---

# PHASE 12 - Save System

### Objective

Persist data locally.

Use:

```typescript
localStorage
```

Store:

* Settings
* Statistics
* Wins
* Losses

---

# PHASE 13 - Refactoring

### Objective

Organize the project structure.

```text
src/

components/
hooks/
utils/
types/
game/
```

Separate UI, game logic, and utilities.

---

# PHASE 14 - Online Multiplayer

### Objective

Allow players to compete online.

Backend:

```text
Node.js
Socket.IO
```

Features:

```text
Server
Rooms
Matchmaking
Turn Synchronization
Game State Synchronization
```

---

# PHASE 15 - Desktop Version

### Objective

Package the game as a desktop application.

Install:

```bash
npm install @tauri-apps/cli
```

Build:

```bash
npm run tauri build
```

Result:proje

```text
Knucklebones.exe
```
