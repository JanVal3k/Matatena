import type { AIContext, AIMove, MoveEvaluation, AIConfig } from './types';
import { calculateTotalValue, ScoringMode } from '../../utils/scoring';
import { getDestroyedIndices, applyDestruction } from '../../utils/destruction';

export const COLUMNS = [
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
] as const;

export { calculateTotalValue };

export function calculateThreatBlock(move: AIMove, playerBoard: Readonly<Record<number, number>>, diceValue: number): number {
  const playerCounts = new Map<number, number>();
  for (const cell of COLUMNS[move.columnIndex]) {
    const val = playerBoard[cell];
    if (val !== undefined) playerCounts.set(val, (playerCounts.get(val) ?? 0) + 1);
  }
  const playerCount = playerCounts.get(diceValue) ?? 0;
  if (playerCount === 2) return 2; // Blocks player triple
  if (playerCount === 1) return 1; // Blocks player pair
  return 0;
}

export function generateValidMoves(context: AIContext): AIMove[] {
  const moves: AIMove[] = [];

  for (const col of COLUMNS) {
    const emptyInCol = col.filter(i => context.emptyCells.includes(i));
    if (emptyInCol.length === 0) continue;

    const targetCell = emptyInCol[emptyInCol.length - 1];

    moves.push({
      columnIndex: col[0],
      cellIndex: targetCell,
      diceValue: context.diceValue,
    });
  }

  return moves;
}

export function simulateMove(
  board: Readonly<Record<number, number>>,
  cellIndex: number,
  diceValue: number
): Record<number, number> {
  const newBoard = { ...board };
  newBoard[cellIndex] = diceValue;
  return newBoard;
}

export { getDestroyedIndices, applyDestruction };

export function evaluateMove(
  move: AIMove,
  context: AIContext,
  config: AIConfig
): MoveEvaluation {
  const { weights } = config;
  const { aiBoard, playerBoard, diceValue, scoringMode } = context;

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

  const score =
    destructionValue * weights.destruction +
    scoreGain * weights.score +
    pairBonus * weights.pairBonus +
    tripleBonus * weights.tripleBonus +
    threatBlock * weights.threatBlock;

  return {
    move,
    score,
    breakdown: {
      destructionValue,
      scoreGain,
      pairBonus,
      tripleBonus,
      threatBlock,
    },
  };
}

export function evaluateBoard(
  aiBoard: Readonly<Record<number, number>>,
  playerBoard: Readonly<Record<number, number>>,
  scoringMode: ScoringMode
): { aiScore: number; playerScore: number } {
  return {
    aiScore: calculateTotalValue(aiBoard, scoringMode),
    playerScore: calculateTotalValue(playerBoard, scoringMode),
  };
}

export function simulatePlayerResponse(
  aiBoard: Readonly<Record<number, number>>,
  playerBoard: Readonly<Record<number, number>>,
  diceValue: number,
  scoringMode: ScoringMode
): { bestPlayerScore: number; worstAIScore: number } {
  const emptyCells = [0, 1, 2, 3, 4, 5, 6, 7, 8].filter(i => !playerBoard[i]);
  let bestPlayerScore = -Infinity;
  let worstAIScore = Infinity;

  for (const col of COLUMNS) {
    const emptyInCol = col.filter(i => emptyCells.includes(i));
    if (emptyInCol.length === 0) continue;

    const targetCell = emptyInCol[emptyInCol.length - 1];
    const newPlayerBoard = simulateMove(playerBoard, targetCell, diceValue);
    const destroyedIndices = getDestroyedIndices(aiBoard, targetCell % 3, diceValue);
    const newAIBoard = applyDestruction(aiBoard, destroyedIndices);

    const { aiScore, playerScore } = evaluateBoard(newAIBoard, newPlayerBoard, scoringMode);

    if (playerScore > bestPlayerScore) {
      bestPlayerScore = playerScore;
      worstAIScore = aiScore;
    }
  }

  return { bestPlayerScore, worstAIScore };
}