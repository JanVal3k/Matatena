export const AI = {
  TIME_BEFORE_DROP: 800,
  TIME_FOR_DROP: 800,
  DIFFICULTY_EASY: 'easy' as const,
  DIFFICULTY_MEDIUM: 'medium' as const,
  DIFFICULTY_HARD: 'hard' as const,
};

export const AI_CONFIG = {
  easy: {
    scoring: 'simple' as const,
    thinkTime: 300,
    mistakeRate: 0.2,
    lookaheadDepth: 0,
    weights: {
      destruction: 0,
      score: 1,
      pairBonus: 0,
      tripleBonus: 0,
      threatBlock: 0,
    },
  },
  medium: {
    scoring: 'knucklebones' as const,
    thinkTime: 500,
    mistakeRate: 0.05,
    lookaheadDepth: 1,
    weights: {
      destruction: 10,
      score: 5,
      pairBonus: 3,
      tripleBonus: 5,
      threatBlock: 3,
    },
  },
  hard: {
    scoring: 'knucklebones' as const,
    thinkTime: 800,
    mistakeRate: 0,
    lookaheadDepth: 2,
    weights: {
      destruction: 15,
      score: 8,
      pairBonus: 5,
      tripleBonus: 8,
      threatBlock: 5,
    },
  },
} as const;

export type AIConfig = typeof AI_CONFIG.easy;
export type Difficulty = keyof typeof AI_CONFIG;

export const GAME = {
  CELL_COUNT: 9,
};

export const Events = {
  IA_DICE_COMPLETE: 'ia:dice:complete',
  IA_TURN_STARTED: 'ia:turn:started',
  IA_TURN_ENDED: 'ia:turn:ended',
  PLAYER_DAMAGED: 'player:damaged',
  PLAYER_HEALED: 'player:healed',
  PLAYER_DIED: 'player:died',
  ENEMY_SPAWNED: 'enemy:spawned',
  ENEMY_KILLED: 'enemy:killed',
  GAME_STARTED: 'game:started',
  GAME_PAUSED: 'game:paused',
  GAME_OVER: 'game:over',
  ASSETS_LOADED: 'assets:loaded',
  LOADING_PROGRESS: 'loading:progress',
};