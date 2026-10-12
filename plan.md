# Knucklebones Web (Matatena)

## Development Roadmap

### Goal
Create a web version of Knucklebones playable against an AI opponent, with the possibility of adding multiplayer support later.

### Current Status: **Phases 1-13 Complete (React)** | Phaser experiment reverted

---

## ✅ COMPLETED PHASES (React Implementation)

### PHASE 1 - Display the Board ✅
- **Components created:** `Board.tsx`, `BoardContainer.tsx`, `ImageSlot.tsx`, `DiceRoller.tsx`
- **Visual:** 3x3 grids for Player and Enemy rendered
- **Status:** Done - React components with Tailwind styling

### PHASE 2 - Data Model ✅
- **Types:** `Cell`, `Column`, `Board` in component state
- **State:** `jugadorOccupied`, `iaOccupied` as `Record<number, number>`
- **Status:** Done - Working in `PlayingPage.tsx`

### PHASE 3 - Dice Rolling ✅
- **Implementation:** `DiceRoller.tsx` with animated rolling (fast → settle → hold phases)
- **Features:** Configurable duration, callbacks on complete
- **Status:** Done - Reusable component with physics-like animation

### PHASE 4 - Place Dice ✅
- **Mechanic:** Drag-and-drop from dice slot to board cells
- **Validation:** Prevents dropping on occupied cells, full columns
- **Status:** Done - HTML5 Drag & Drop API in `PlayingPage.tsx` + `Board.tsx`

### PHASE 5 - Turn System ✅
- **Phases:** `player-rolling` → `player-waiting` → `ia-rolling` → `ia-thinking` → `ia-placing`
- **Flow:** Player rolls → places → AI rolls → places → repeat
- **Status:** Done - State machine in `PlayingPage.tsx`

### PHASE 6 - Basic AI ✅
- **Strategy:** Random valid column selection
- **Timing:** Configurable think delay (300-800ms) + placement animation
- **Status:** Done - In `PlayingPage.tsx` `handleDiceCompleteIA`

### PHASE 7 - Dice Destruction ✅
- **Core mechanic:** Placing value X destroys ALL opponent dice with value X in same column
- **Implementation:** `src/utils/destruction.ts` with `getDestroyedIndices`, `applyDestruction`
- **Animation:** Pop effect (scale 1→1.3→0 + fade, 300ms) via CSS keyframes
- **Integration:** Player drops (`handleCellDrop`) + IA drops (`handleDiceCompleteIA`)
- **Components updated:** `Board.tsx`, `BoardContainer.tsx`, `PlayingPage.tsx`, `index.css`
- **Status:** Done - Both sides, immediate, all matching dice destroyed

### PHASE 8 - Score Calculation ✅
- **Scoring:** Simple sum (face values only, no pair/triple bonuses)
- **Components:** `src/utils/scoring.ts` with `calculateColumnValue`, `calculateTotalValue`, `calculateAllColumnValues`
- **Display:** 
  - Column value labels (3 per board, aligned with grid columns)
  - Total value labels (Player above dice, IA below dice)
  - Score HUD at top: "Player: X" / "IA: Y" with themed backgrounds
- **Status:** Done - Implemented in `PlayingPage.tsx`, `BoardContainer.tsx`, `scoring.ts`

### PHASE 9 - End Game ✅
- **Condition:** Board full (9 dice) → compare scores → stop game loop
- **Win/Lose Modal:** `WinLoseModal.tsx` with fade/slide animation, shows winner (Player/IA/Tie), both scores side-by-side, difficulty badge
- **Actions:** "Back to Menu" (calls `onBack`), "Play Again" (resets all state + starts new game immediately in same difficulty)
- **Game Loop Stop:** All mechanics stop (dice rolls, AI turns, drag/drop, timers cleared)
- **Integration:** `PlayingPage.tsx` - gameStatus state, checkEndGame useEffect, handlePlayAgain/handleBackToMenu callbacks
- **IA Text Color Fix:** Improved contrast for IA score displays (dark bg + white text in light mode, light bg + dark text in dark mode)
- **Status:** **Done**

### PHASE 10 - UI Improvements ❌
- Animations, sound, destruction effects, better styling
- **Status:** Partial (dice roll animation exists)

### PHASE 11 - AI Difficulty Levels ✅
- **Easy:** Random valid column selection
- **Medium:** 1-move lookahead with weighted evaluation (destruction > pairs > triples > score > threat block)
- **Hard:** Minimax depth 2 with alpha-beta pruning, full root evaluation, expected dice values
- **Implementation:** Strategy pattern in `src/game/ai/` (AIStrategy interface, EasyStrategy, MediumStrategy, HardStrategy, AIFactory, AIService)
- **Config:** Centralized in `src/constants/Constants.ts` (AI_CONFIG)
- **Scoring:** Easy = simple sum; Medium/Hard = Knucklebones (pairs = sum + sum/2, triples = sum + 2/3*sum)
- **Integration:** `PlayingPage.tsx` calls `aiService.setDifficulty(difficulty)` on AI turns
- **Bug Fixed:** Hard AI column-0 bias via move ordering (shuffle + noise) + root-level alpha-beta disable
- **Status:** **Done** - All 3 difficulties working, verified via logs

### PHASE 12 - Text & Localization ✅
- **Game renamed:** "Matatena" → "Parry Dice" (index.html title, welcome header)
- **Tagline updated:** "Classic mexican game reimagined" → "Roll. Parry. Steal the Win."
- **How to Play rewritten:** New 3-section structure (How to Win, Dice Removal, Pairs & Triples)
- **Welcome icon changed:** Play icon → `Dados6.png` (48px, matching original size)
- **Localization system:** Created `src/texts/en.json` with all user-facing strings organized for easy Spanish translation
  - Game title, tagline, welcome screen, difficulty options
  - How to Play sections with sub-items for Pairs/Triples
  - Playing screen headers, turn messages, score labels
  - Modal texts (winner messages, buttons)
  - Common keys (localStorage visited flag)
- **Components updated:** `MatatenaWelcomePage.tsx`, `PlayingPage.tsx`, `WinLoseModal.tsx` to use localization
- **Status:** **Done**

### PHASE 13 - Language Switcher ✅
- **Spanish translations:** Created `src/texts/es.json` with complete Spanish localization
- **Language Context:** `src/contexts/LanguageContext.tsx` with React Context for language state
- **Language Provider:** Wraps app, handles dynamic imports, browser locale detection, localStorage persistence
- **Language Switcher:** `src/components/LanguageSwitcher.tsx` - fixed top-right button (EN/ES toggle)
- **Lazy loading:** Vite code-splitting creates separate chunks for en/es (loaded on demand)
- **Browser locale detection:** Defaults to Spanish for `es-*` locales, English otherwise
- **Persistence:** Language preference saved to `localStorage` (`parry-dice-lang`)
- **Components migrated:** `MatatenaWelcomePage.tsx`, `PlayingPage.tsx`, `WinLoseModal.tsx` now use `useLanguage()` hook
- **Status:** **Done**

### PHASE 14 - Save System ❌

### PHASE 13 - Refactoring ❌
- Separate `src/game/`, `src/hooks/`, `src/utils/`, `src/types/`
- **Status:** Partially done in Phaser experiment, not in React

---

## 🧪 PHASER EXPERIMENT (Reverted)

### What Was Built (Oct 5-6, 2026)
A complete Phaser 4 reimplementation following **game-architecture skill** patterns:

| Architecture Layer | Files Created |
|-------------------|---------------|
| **Core** | `Constants.ts`, `EventBus.ts`, `GameState.ts`, `Game.ts` |
| **Scenes** | `BootScene`, `MenuScene`, `GameScene`, `UIScene` |
| **Systems** | `BoardSystem`, `DiceSystem`, `TurnSystem`, `AISystem`, `InputSystem` |
| **React Integration** | `PhaserGameWrapper`, `GameCanvas`, `GameUI`, `PhaserGameProvider` |
| **Hooks** | `useGameEvents` (useSyncExternalStore) |
| **Build** | Manual chunks (phaser/game/react), dynamic imports |

### Patterns Applied (from game-architecture skill)
- ✅ Event-driven communication (`domain:action` events)
- ✅ Centralized `GameState` singleton
- ✅ Configuration centralization (`Constants.ts`)
- ✅ Orchestrator pattern (`GameScene` initializes systems)
- ✅ Restart-safe (cleanup in `shutdown()`)
- ✅ Separation of concerns (core/systems/scenes/entities)

### Why Reverted
- User preference: "didn't like" the Phaser version
- React version was already working for Phases 1-6
- Added complexity without immediate benefit for current scope

### Artifacts Removed
- `src/game/` (entire directory)
- `src/hooks/useGameEvents.ts`
- `src/utils/dynamic-imports.ts`
- `src/components/GameCanvas.tsx`, `GameUI.tsx`, `GameLoadingFallback.tsx`, `PhaserGameWrapper.tsx`
- `phaser` dependency from `package.json`
- Manual chunks from `vite.config.ts`

---

## 📍 CURRENT STATE (Post-Revert)

### Working Features
- ✅ Welcome screen with difficulty selection (Easy/Medium/Hard)
- ✅ 3x3 boards for Player and Enemy
- ✅ Animated dice rolling (1-6)
- ✅ Drag-and-drop dice placement
- ✅ Turn-based gameplay (Player ↔ AI)
- ✅ **Three AI difficulty levels** (Easy=Random, Medium=1-move lookahead, Hard=Minimax depth 2)
- ✅ **End game detection** (board full → win/lose modal with fade/slide animation)
- ✅ **Play Again / Back to Menu** actions
- ✅ **Game renamed to "Parry Dice"** with new tagline "Roll. Parry. Steal the Win."
- ✅ **How to Play rewritten** with 3 sections: How to Win, Dice Removal, Pairs & Triples
- ✅ **Welcome icon** using `Dados6.png` (48px)
- ✅ **Language switcher** (EN/ES) in top-right corner with browser locale detection
- ✅ **Full Spanish localization** (`src/texts/es.json`) with lazy-loaded chunks
- ✅ Responsive design (mobile + desktop)
- ✅ Dark mode support
- ✅ How-to-play modal
- ✅ Column value labels (3 per board, aligned with columns)
- ✅ Total value labels (Player above dice, IA below dice)
- ✅ Score HUD at top with Player/IA totals (fixed IA text contrast)
- ✅ Simple sum scoring for Easy; Knucklebones scoring for Medium/Hard (pairs/triples bonuses)
- ✅ Dice destruction (placing X destroys ALL opponent X in same column, pop animation)

### Tech Stack
- React 18 + TypeScript (strict)
- Vite + Tailwind CSS
- Zustand (available, not heavily used)
- lucide-react for icons

### File Structure (Current)
```
src/
├── components/          # Board, BoardContainer, DiceRoller, ImageSlot, MatatenaWelcomePage, PlayingPage, WinLoseModal, LanguageSwitcher
├── contexts/            # LanguageContext.tsx
├── game/
│   └── ai/              # AIStrategy.ts, EasyStrategy.ts, MediumStrategy.ts, HardStrategy.ts, AIFactory.ts, AIService.ts, types.ts, AIEvaluator.ts
├── hooks/               # useLanguage.ts (empty - index.ts only)
├── texts/               # en.json, es.json (localization strings)
├── utils/               # scoring.ts, destruction.ts
├── types/               # (empty - index.ts only)
├── constants/           # Constants.ts (AI_CONFIG)
├── App.tsx              # Page routing (welcome/playing)
└── main.tsx             # Entry point (LanguageProvider wrapper)
```

---

## 🎯 NEXT PRIORITIES

### Immediate (Complete Core Game Loop)
1. **PHASE 10** - Polish (animations, destruction effects, sound)

### Short Term
2. **PHASE 14** - localStorage persistence
3. **PHASE 15** - Refactor to `src/game/`, `src/hooks/`, `src/utils/`, `src/types/`

### Long Term (Unchanged)
8. **PHASE 14** - Online Multiplayer (Node.js + Socket.IO)
9. **PHASE 15** - Desktop (Tauri)

---

## Decision Points for Next Session

1. **Refactor Timing** - Do Phase 13 now or after core loop?
   - Earlier = cleaner implementation of Phases 10
   - Later = less upfront work, but more tech debt

---

## Notes
- Original plan phases 1-15 still valid as roadmap
- Phaser experiment proved architecture patterns work, but React is sufficient for current scope
- All Phaser code patterns preserved in memory - can be reapplied if needed later