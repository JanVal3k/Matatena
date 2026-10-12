export type ScoringMode = 'simple' | 'knucklebones';

export function calculateColumnValue(board: Record<number, number>, columnIndex: number, mode: ScoringMode = 'simple'): number {
  const COLUMNS = [
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
  ] as const;

  const col = COLUMNS[columnIndex];
  const values = col.map(i => board[i]).filter((v): v is number => v !== undefined);

  if (values.length === 0) return 0;

  if (mode === 'simple') {
    let total = 0;
    for (const v of values) total += v;
    return total;
  }

  // Knucklebones scoring: pairs = sum + sum/2, triples = sum + sum*2/3
  const counts = new Map<number, number>();
  for (const v of values) counts.set(v, (counts.get(v) ?? 0) + 1);

  let total = 0;
  for (const [value, count] of counts) {
    const sum = value * count;
    if (count === 3) {
      total += sum + Math.floor(sum * 2 / 3); // Triple: sum + 2/3 sum
    } else if (count === 2) {
      total += sum + Math.floor(sum / 2); // Pair: sum + 1/2 sum
    } else {
      total += sum;
    }
  }
  return total;
}

export function calculateTotalValue(board: Record<number, number>, mode: ScoringMode = 'simple'): number {
  let total = 0;
  for (let col = 0; col < 3; col++) {
    total += calculateColumnValue(board, col, mode);
  }
  return total;
}

export function calculateAllColumnValues(board: Record<number, number>, mode: ScoringMode = 'simple'): number[] {
  return [0, 1, 2].map(col => calculateColumnValue(board, col, mode));
}

export function getScoringModeForDifficulty(difficulty: 'easy' | 'medium' | 'hard'): ScoringMode {
  return difficulty === 'easy' ? 'simple' : 'knucklebones';
}