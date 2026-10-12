import React, { useState, useEffect } from 'react';

const DICE_FACES = [
  '/Dados1.png',
  '/Dados2.png',
  '/Dados3.png',
  '/Dados4.png',
  '/Dados5.png',
  '/Dados6.png',
] as const;

const DEFAULT_CELL_COLORS = [
  'bg-matatena-100 dark:bg-matatena-800',
  'bg-matatena-200 dark:bg-matatena-700',
  'bg-matatena-300 dark:bg-matatena-600',
  'bg-matatena-400 dark:bg-matatena-500',
  'bg-matatena-500 dark:bg-matatena-400',
  'bg-matatena-400 dark:bg-matatena-500',
  'bg-matatena-300 dark:bg-matatena-600',
  'bg-matatena-200 dark:bg-matatena-700',
  'bg-matatena-100 dark:bg-matatena-800',
];

interface BoardProps {
  boardId: number;
  onCellClick?: (index: number, boardId: number) => void;
  onCellDrop?: (index: number, boardId: number, e: React.DragEvent) => void;
  isDropTarget?: boolean;
  droppedDiceIndex?: number;
  droppedDiceValue?: number;
  cellColors?: string[];
  borderColor?: string;
  occupiedCells?: Record<number, number>;
  destroyedIndices?: number[];
  onDestructionComplete?: () => void;
}

export const Board = ({
  boardId,
  onCellClick,
  onCellDrop,
  isDropTarget = false,
  droppedDiceIndex,
  droppedDiceValue,
  cellColors = DEFAULT_CELL_COLORS,
  borderColor = 'border-matatena-200 dark:border-matatena-700',
  occupiedCells = {},
  destroyedIndices = [],
  onDestructionComplete,
}: BoardProps) => {
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [animatingIndices, setAnimatingIndices] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (destroyedIndices.length > 0) {
      const newAnimating = new Set(destroyedIndices);
      setAnimatingIndices(newAnimating);

      const timer = setTimeout(() => {
        setAnimatingIndices(new Set());
        onDestructionComplete?.();
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [destroyedIndices, onDestructionComplete]);

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (isDropTarget) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    const target = e.currentTarget as HTMLElement;
    const related = e.relatedTarget as HTMLElement;
    if (!target.contains(related)) {
      setDragOverIndex(null);
    }
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(null);
    if (isDropTarget) {
      onCellDrop?.(index, boardId, e);
    }
  };

  const isAnimating = (index: number) => animatingIndices.has(index);
  const isDestroyed = (index: number) => destroyedIndices.includes(index);

  return (
    <div className={`w-[500px] h-[500px] max-w-full aspect-square mx-auto bg-matatena-100 dark:bg-matatena-800 rounded-xl border-2 ${borderColor}`}>
      <div className="grid grid-cols-3 grid-rows-3 h-full w-full gap-2 p-2">
        {cellColors.map((color, index) => (
          <button
            key={`${boardId}-${index}`}
            type="button"
            onClick={() => onCellClick?.(index, boardId)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, index)}
            disabled={!onCellClick}
            data-cell={index}
            data-board={boardId}
            className={`
              aspect-square rounded border-2 border-matatena-300 dark:border-matatena-600
              ${color}
              transition-colors duration-150
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-matatena-400
              flex items-center justify-center
              disabled:opacity-100 disabled:hover:bg-transparent disabled:hover:border-matatena-300 dark:disabled:hover:border-matatena-600 disabled:cursor-default
              ${isDropTarget && dragOverIndex === index ? 'ring-4 ring-matatena-400 ring-offset-2 ring-offset-matatena-100 dark:ring-offset-matatena-800' : ''}
            `}
          >
            {isAnimating(index) ? (
              <div className="w-full h-full flex items-center justify-center animate-destroy-pop">
                <div className="w-full h-full bg-matatena-400/50 dark:bg-matatena-500/50 rounded" />
              </div>
            ) : isDestroyed(index) ? null : droppedDiceIndex === index && droppedDiceValue !== undefined ? (
              <img
                src={DICE_FACES[droppedDiceValue - 1]}
                alt={`Dice ${droppedDiceValue}`}
                className="w-full h-full object-cover rounded"
              />
            ) : occupiedCells[index] ? (
              <img
                src={DICE_FACES[occupiedCells[index] - 1]}
                alt={`Dice ${occupiedCells[index]}`}
                className="w-full h-full object-cover rounded"
              />
            ) : null}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Board;