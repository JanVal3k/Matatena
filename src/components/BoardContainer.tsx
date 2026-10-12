import { Board } from './Board';

interface BoardContainerProps {
  label: 'Jugador' | 'IA';
  boardId: number;
  onCellClick?: (index: number, boardId: number) => void;
  onCellDrop?: (index: number, boardId: number, e: React.DragEvent) => void;
  isDropTarget?: boolean;
  droppedDiceIndex?: number;
  droppedDiceValue?: number;
  cellColors?: string[];
  borderColor?: string;
  labelColor?: string;
  occupiedCells?: Record<number, number>;
  columnValues?: number[];
  destroyedIndices?: number[];
  onDestructionComplete?: () => void;
}

export const BoardContainer = ({
  label,
  boardId,
  onCellClick,
  onCellDrop,
  isDropTarget = false,
  droppedDiceIndex,
  droppedDiceValue,
  cellColors,
  borderColor,
  labelColor = 'text-matatena-800 dark:text-matatena-50',
  occupiedCells,
  columnValues = [0, 0, 0],
  destroyedIndices = [],
  onDestructionComplete,
}: BoardContainerProps) => {
  return (
    <div className="flex flex-col items-center">
      <h2 className={`text-2xl font-semibold text-center mb-4 ${labelColor}`}>
        {label}
      </h2>
      <div className="grid grid-cols-3 gap-2 px-2 w-full max-w-[500px] mb-2">
        {columnValues.map((val, i) => (
          <span
            key={i}
            className="text-center font-mono text-matatena-700 dark:text-matatena-300 text-sm"
          >
            {val}
          </span>
        ))}
      </div>
      <Board
        boardId={boardId}
        onCellClick={onCellClick}
        onCellDrop={onCellDrop}
        isDropTarget={isDropTarget}
        droppedDiceIndex={droppedDiceIndex}
        droppedDiceValue={droppedDiceValue}
        cellColors={cellColors}
        borderColor={borderColor}
        occupiedCells={occupiedCells}
        destroyedIndices={destroyedIndices}
        onDestructionComplete={onDestructionComplete}
      />
    </div>
  );
};

export default BoardContainer;