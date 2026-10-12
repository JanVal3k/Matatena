import type { AIContext, AIMove, AIConfig } from './types';
import { AIStrategy } from './AIStrategy';
import { generateValidMoves } from './AIEvaluator';

export class EasyStrategy implements AIStrategy {
  readonly difficulty = 'easy' as const;
  readonly config: AIConfig;

  constructor(config: AIConfig) {
    this.config = config;
    console.log('[EasyStrategy] Constructed - active');
  }

  chooseMove(context: AIContext): AIMove {
    const moves = generateValidMoves(context);
    if (moves.length === 0) {
      throw new Error('No valid moves available');
    }

    console.log('[EasyStrategy] Random selection from', moves.length, 'valid moves');

    // Pure random selection
    const randomIndex = Math.floor(Math.random() * moves.length);
    const selected = moves[randomIndex];
    console.log('[EasyStrategy] Selected cell:', selected.cellIndex, 'col:', selected.columnIndex, 'dice:', selected.diceValue);
    return selected;
  }
}