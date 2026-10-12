export function getDestroyedIndices(
  opponentBoard: Record<number, number>,
  columnIndex: number,
  placedValue: number
): number[] {
  const COLUMNS = [
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
  ] as const;

  const col = COLUMNS[columnIndex];
  return col.filter(i => opponentBoard[i] === placedValue);
}

export function applyDestruction(
  opponentBoard: Record<number, number>,
  destroyedIndices: number[]
): Record<number, number> {
  if (destroyedIndices.length === 0) return opponentBoard;

  const newBoard = { ...opponentBoard };
  for (const idx of destroyedIndices) {
    delete newBoard[idx];
  }
  return newBoard;
}