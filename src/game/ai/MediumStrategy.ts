import type { AIContext, AIMove, AIConfig, MoveEvaluation } from './types';
import { AIStrategy } from './AIStrategy';
import { generateValidMoves, evaluateMove, simulateMove, simulatePlayerResponse } from './AIEvaluator';

export class MediumStrategy implements AIStrategy {
  readonly difficulty = 'medium' as const;
  readonly config: AIConfig;

  constructor(config: AIConfig) {
    this.config = config;
    console.log('[MediumStrategy] Constructed - active');
  }

  chooseMove(context: AIContext): AIMove {
    const moves = generateValidMoves(context);
    if (moves.length === 0) {
      throw new Error('No valid moves available');
    }

    console.log('[MediumStrategy] Evaluating', moves.length, 'valid moves');

    // Evaluate all moves with 1-move lookahead
    const evaluatedMoves: MoveEvaluation[] = moves.map(move => {
      const evaluation = evaluateMove(move, context, this.config);
      
      // 1-move lookahead: simulate player's best response
      const newAIBoard = simulateMove(context.aiBoard, move.cellIndex, context.diceValue);
      const { worstAIScore } = simulatePlayerResponse(
        newAIBoard,
        context.playerBoard,
        context.diceValue,
        context.scoringMode
      );
      
      // Adjust score: penalize moves that give player good responses
      const lookaheadPenalty = context.aiScore - worstAIScore;
      evaluation.score -= lookaheadPenalty * 0.5;
      evaluation.breakdown.threatBlock += lookaheadPenalty * 0.1;
      
      return evaluation;
    });

    // Sort by score descending
    evaluatedMoves.sort((a, b) => b.score - a.score);

    console.log('[MediumStrategy] Top 3 moves:', evaluatedMoves.slice(0, 3).map(e => ({
      cell: e.move.cellIndex,
      col: e.move.columnIndex,
      score: e.score.toFixed(1),
      breakdown: e.breakdown,
    })));

    // Add small mistake rate
    if (Math.random() < this.config.mistakeRate) {
      const nonBest = evaluatedMoves.slice(1);
      if (nonBest.length > 0) {
        console.log('[MediumStrategy] Mistake triggered - selecting suboptimal move');
        const randomIndex = Math.floor(Math.random() * nonBest.length);
        return nonBest[randomIndex].move;
      }
    }

    const bestMove = evaluatedMoves[0].move;
    console.log('[MediumStrategy] Selected cell:', bestMove.cellIndex, 'col:', bestMove.columnIndex, 'score:', evaluatedMoves[0].score.toFixed(1));
    return bestMove;
  }
}