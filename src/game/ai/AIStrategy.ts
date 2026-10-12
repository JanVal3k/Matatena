import type { AIContext, AIMove, AIConfig } from './types';

export interface AIStrategy {
  readonly difficulty: 'easy' | 'medium' | 'hard';
  readonly config: AIConfig;
  chooseMove(context: AIContext): AIMove;
}