import type { AIContext, AIMove, AIConfig } from './types';
import { AIStrategy } from './AIStrategy';
import { 
  generateValidMoves, 
  simulateMove, 
  evaluateBoard,
  getDestroyedIndices, 
  applyDestruction,
  calculateTotalValue,
  COLUMNS,
  calculateThreatBlock
} from './AIEvaluator';

export class HardStrategy implements AIStrategy {
  readonly difficulty = 'hard' as const;
  readonly config: AIConfig;
  private readonly maxDepth = 2; // Depth 2: AI -> Player -> AI

  constructor(config: AIConfig) {
    this.config = config;
    console.log('[HardStrategy] Constructed - active');
  }

  chooseMove(context: AIContext): AIMove {
    const moves = generateValidMoves(context);
    if (moves.length === 0) {
      throw new Error('No valid moves available');
    }

    console.log('[HardStrategy] Minimax depth:', this.maxDepth, '| Moves to evaluate:', moves.length);

    // Add move ordering using quick heuristic evaluation for better alpha-beta efficiency
    // Add small random noise to break ties and shuffle to remove column-order bias
    const movesWithHeuristic = moves.map(move => ({
      move,
      heuristic: this.quickHeuristic(move, context) + Math.random() * 0.01
    }));
    // Fisher-Yates shuffle to remove column-order bias from stable sort
    for (let i = movesWithHeuristic.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [movesWithHeuristic[i], movesWithHeuristic[j]] = [movesWithHeuristic[j], movesWithHeuristic[i]];
    }
    movesWithHeuristic.sort((a, b) => b.heuristic - a.heuristic);

    let bestMove: AIMove = movesWithHeuristic[0].move;
    let bestScore = -Infinity;

    for (const { move } of movesWithHeuristic) {
      // At root level, pass isRoot=true to disable alpha-beta pruning so all moves are fully evaluated
      const score = this.minimax(
        move,
        context,
        this.maxDepth,
        -Infinity,
        Infinity,
        true, // true = AI's turn (maximizing)
        true  // isRoot = true - disable pruning at root level
      );

      console.log('[HardStrategy] Move eval:', { cell: move.cellIndex, col: move.columnIndex, score: score.toFixed(1) });

      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }

    console.log('[HardStrategy] Best move selected:', { cell: bestMove.cellIndex, col: bestMove.columnIndex, score: bestScore.toFixed(1) });
    return bestMove;
  }

  private quickHeuristic(move: AIMove, context: AIContext): number {
    const { aiBoard, playerBoard, diceValue, scoringMode } = context;
    const { weights } = this.config;

    // Quick evaluation for move ordering - no recursion
    const newAIBoard = simulateMove(aiBoard, move.cellIndex, diceValue);
    const scoreGain = calculateTotalValue(newAIBoard, scoringMode) - calculateTotalValue(aiBoard, scoringMode);

    const destroyedIndices = getDestroyedIndices(playerBoard, move.columnIndex, diceValue);
    const destructionValue = destroyedIndices.reduce((sum, idx) => sum + (playerBoard[idx] ?? 0), 0);

    const newAIColValues = COLUMNS[move.columnIndex].map(i => newAIBoard[i]).filter((v): v is number => v !== undefined);
    const counts = new Map<number, number>();
    for (const v of newAIColValues) counts.set(v, (counts.get(v) ?? 0) + 1);
    const thisValueCount = counts.get(diceValue) ?? 0;

    const pairBonus = thisValueCount === 2 ? 1 : 0;
    const tripleBonus = thisValueCount === 3 ? 1 : 0;

    const threatBlock = calculateThreatBlock(move, playerBoard, diceValue);

    return (
      destructionValue * weights.destruction +
      scoreGain * weights.score +
      pairBonus * weights.pairBonus +
      tripleBonus * weights.tripleBonus +
      threatBlock * weights.threatBlock
    );
  }

  private minimax(
    move: AIMove,
    context: AIContext,
    depth: number,
    alpha: number,
    beta: number,
    isAITurn: boolean,
    isRoot: boolean = false
  ): number {
    const { aiBoard, playerBoard, diceValue, scoringMode } = context;

    // Apply the move
    let newAIBoard = aiBoard;
    let newPlayerBoard = playerBoard;
    let nextDiceValue = isAITurn ? 3.5 : diceValue; // Use expected value for AI's future turns, actual for player

    if (isAITurn) {
      newAIBoard = simulateMove(aiBoard, move.cellIndex, diceValue);
      const destroyedIndices = getDestroyedIndices(playerBoard, move.columnIndex, diceValue);
      if (destroyedIndices.length > 0) {
        newPlayerBoard = applyDestruction(playerBoard, destroyedIndices);
      }
    } else {
      newPlayerBoard = simulateMove(playerBoard, move.cellIndex, diceValue);
      const destroyedIndices = getDestroyedIndices(aiBoard, move.columnIndex, diceValue);
      if (destroyedIndices.length > 0) {
        newAIBoard = applyDestruction(aiBoard, destroyedIndices);
      }
    }

    if (depth === 0) {
      const { aiScore, playerScore } = evaluateBoard(newAIBoard, newPlayerBoard, scoringMode);
      return aiScore - playerScore;
    }

    const nextEmptyCells = [0, 1, 2, 3, 4, 5, 6, 7, 8].filter(i => !newAIBoard[i] && !newPlayerBoard[i]);
    const nextMoves = generateValidMoves({
      ...context,
      aiBoard: newAIBoard,
      playerBoard: newPlayerBoard,
      diceValue: nextDiceValue,
      emptyCells: nextEmptyCells,
    });

    if (nextMoves.length === 0) {
      const { aiScore, playerScore } = evaluateBoard(newAIBoard, newPlayerBoard, scoringMode);
      return aiScore - playerScore;
    }

    // Order moves by quick heuristic for better alpha-beta efficiency
    const nextMovesWithHeuristic = nextMoves.map(m => ({
      move: m,
      heuristic: this.quickHeuristic(m, {
        ...context,
        aiBoard: newAIBoard,
        playerBoard: newPlayerBoard,
        diceValue: nextDiceValue,
        emptyCells: nextEmptyCells,
      })
    }));
    nextMovesWithHeuristic.sort((a, b) => b.heuristic - a.heuristic);

    // At root level (isRoot=true), disable alpha-beta pruning by using infinite bounds
    const effectiveAlpha = isRoot && depth === this.maxDepth ? -Infinity : alpha;
    const effectiveBeta = isRoot && depth === this.maxDepth ? Infinity : beta;

    if (isAITurn) {
      // Maximizing player (AI)
      let maxEval = -Infinity;
      for (const { move: nextMove } of nextMovesWithHeuristic) {
        const evalScore = this.minimax(nextMove, {
          ...context,
          aiBoard: newAIBoard,
          playerBoard: newPlayerBoard,
          diceValue: nextDiceValue,
          emptyCells: nextEmptyCells,
        }, depth - 1, effectiveAlpha, effectiveBeta, false, false);
        maxEval = Math.max(maxEval, evalScore);
        alpha = Math.max(alpha, evalScore);
        if (beta <= alpha) {
          console.log('[HardStrategy] Alpha-beta pruning at depth', depth);
          break;
        }
      }
      return maxEval;
    } else {
      // Minimizing player (Human)
      let minEval = Infinity;
      for (const { move: nextMove } of nextMovesWithHeuristic) {
        const evalScore = this.minimax(nextMove, {
          ...context,
          aiBoard: newAIBoard,
          playerBoard: newPlayerBoard,
          diceValue: nextDiceValue,
          emptyCells: nextEmptyCells,
        }, depth - 1, effectiveAlpha, effectiveBeta, true, false);
        minEval = Math.min(minEval, evalScore);
        beta = Math.min(beta, evalScore);
        if (beta <= alpha) {
          console.log('[HardStrategy] Alpha-beta pruning at depth', depth);
          break;
        }
      }
      return minEval;
    }
  }
}