import { DiceRoller } from './DiceRoller';

interface ImageSlotProps {
  boardId: number;
  className?: string;
  diceValue?: number;
  isRolling?: boolean;
  onComplete?: (value: number) => void;
  onAnimationEnd?: () => void;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: () => void;
  holdDuration?: number;
}

export const ImageSlot = ({
  boardId,
  className = '',
  diceValue,
  isRolling = false,
  onComplete,
  onAnimationEnd,
  draggable = false,
  onDragStart,
  onDragEnd,
  holdDuration = 0,
}: ImageSlotProps) => {
  const showDice = diceValue !== undefined || isRolling;
  const face = diceValue ?? 1;

  if (showDice) {
    return (
      <div
        className={`
          w-[156px] h-[156px] flex-shrink-0
          bg-matatena-300 dark:bg-matatena-600
          rounded-xl border-2 border-matatena-400 dark:border-matatena-500
          flex items-center justify-center
          text-matatena-800 dark:text-matatena-200
          font-medium text-sm
          transition-colors duration-150
          ${isRolling ? 'opacity-75' : ''}
          ${className}
        `}
        data-board={boardId}
        data-testid={`image-slot-${boardId}`}
      >
        <DiceRoller
          face={face}
          isRolling={isRolling}
          onComplete={onComplete}
          onAnimationEnd={onAnimationEnd}
          draggable={draggable}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          holdDuration={holdDuration}
        />
      </div>
    );
  }

  return (
    <div
      className={`
        w-[156px] h-[156px] flex-shrink-0
        bg-matatena-300 dark:bg-matatena-600
        rounded-xl border-2 border-matatena-400 dark:border-matatena-500
        flex items-center justify-center
        text-matatena-800 dark:text-matatena-200
        font-medium text-sm
        transition-colors duration-150
        ${className}
      `}
      data-board={boardId}
      data-testid={`image-slot-${boardId}`}
    >
      <span className="opacity-0">Empty</span>
    </div>
  );
};

export default ImageSlot;