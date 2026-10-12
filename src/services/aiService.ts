import { AIFactory } from '../game/ai/AIFactory';
import type { AIContext, AIMove } from '../game/ai/types';
import { getScoringModeForDifficulty } from '../utils/scoring';
import { calculateTotalValue } from '../utils/scoring';

export class AIService {
  private strategy = AIFactory.create('easy');

  setDifficulty(difficulty: 'easy' | 'medium' | 'hard'): void {
    this.strategy = AIFactory.create(difficulty);
    console.log('[AIService] Difficulty set to:', difficulty, '| Strategy:', this.strategy.difficulty);
  }

  async chooseMove(context: AIContext): Promise<AIMove> {
    console.log('[AIService] chooseMove called', {
      difficulty: context.difficulty,
      scoringMode: context.scoringMode,
      diceValue: context.diceValue,
      emptyCellsCount: context.emptyCells.length,
      aiScore: context.aiScore,
      playerScore: context.playerScore,
    });
    
    console.log('[AIService] Using strategy:', this.strategy.difficulty);

    const delay = this.strategy.config.thinkTime;
    if (delay > 0) {
      await new Promise(r => setTimeout(r, delay));
    }

    const fullContext: AIContext = {
      ...context,
      scoringMode: getScoringModeForDifficulty(context.difficulty),
      aiScore: context.aiScore ?? calculateTotalValue(context.aiBoard, context.scoringMode),
      playerScore: context.playerScore ?? calculateTotalValue(context.playerBoard, context.scoringMode),
    };

    const move = this.strategy.chooseMove(fullContext);

    console.log('[AIService] Move selected', {
      cellIndex: move.cellIndex,
      columnIndex: move.columnIndex,
      diceValue: move.diceValue,
      strategy: this.strategy.difficulty,
    });

    return move;
  }

  static buildContext(
    aiBoard: Readonly<Record<number, number>>,
    playerBoard: Readonly<Record<number, number>>,
    diceValue: number,
    emptyCells: ReadonlyArray<number>,
    difficulty: 'easy' | 'medium' | 'hard'
  ): AIContext {
    const scoringMode = getScoringModeForDifficulty(difficulty);
    return {
      aiBoard,
      playerBoard,
      diceValue,
      emptyCells,
      difficulty,
      scoringMode,
      aiScore: calculateTotalValue(aiBoard, scoringMode),
      playerScore: calculateTotalValue(playerBoard, scoringMode),
    };
  }
}

export const aiService = new AIService();