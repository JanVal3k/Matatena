import type { AIConfig as ConstantsAIConfig } from '../../constants/Constants';

export type AIConfig = ConstantsAIConfig;

export interface AIContext {
  aiBoard: Readonly<Record<number, number>>;
  playerBoard: Readonly<Record<number, number>>;
  diceValue: number;
  emptyCells: ReadonlyArray<number>;
  difficulty: 'easy' | 'medium' | 'hard';
  scoringMode: 'simple' | 'knucklebones';
  aiScore: number;
  playerScore: number;
}

export interface AIMove {
  columnIndex: number;
  cellIndex: number;
  diceValue: number;
}

export interface MoveEvaluation {
  move: AIMove;
  score: number;
  breakdown: {
    destructionValue: number;
    scoreGain: number;
    pairBonus: number;
    tripleBonus: number;
    threatBlock: number;
  };
}

export interface AIStrategy {
  readonly difficulty: 'easy' | 'medium' | 'hard';
  readonly config: AIConfig;
  chooseMove(context: AIContext): AIMove;
}

export interface AIService {
  setDifficulty(difficulty: 'easy' | 'medium' | 'hard'): void;
  chooseMove(context: AIContext): Promise<AIMove>;
}