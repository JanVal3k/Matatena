import { useEffect, useRef, useState } from 'react';

export const DICE_FACES = [
  '/Dados1.png',
  '/Dados2.png',
  '/Dados3.png',
  '/Dados4.png',
  '/Dados5.png',
  '/Dados6.png',
] as const;

interface DiceRollerProps {
  face: number;
  isRolling: boolean;
  onComplete?: (value: number) => void;
  onAnimationEnd?: () => void;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: () => void;
  settleDuration?: number;
  holdDuration?: number;
}

export const DiceRoller = ({ face, isRolling, onComplete, onAnimationEnd, draggable = false, onDragStart, onDragEnd, settleDuration = 450, holdDuration = 0 }: DiceRollerProps) => {
  const [currentFace, setCurrentFace] = useState(face);
  const intervalRef = useRef<number | null>(null);
  const settleTimeoutRef = useRef<number | null>(null);
  const holdTimeoutRef = useRef<number | null>(null);
  const phaseRef = useRef<'fast' | 'settle' | 'hold'>('fast');
  const elapsedRef = useRef(0);
  const hasCompletedRef = useRef(false);
  const finalValueRef = useRef<number | null>(null);
  const lockedFinalValueRef = useRef<number | null>(null);
  const shouldFireAnimationEndRef = useRef(false);

  useEffect(() => {
    if (!isRolling) {
      setCurrentFace(face);
      hasCompletedRef.current = false;
      finalValueRef.current = null;
      shouldFireAnimationEndRef.current = false;
      lockedFinalValueRef.current = null;
      return;
    }

    // If already in hold phase with locked value, don't restart animation
    if (phaseRef.current === 'hold' && lockedFinalValueRef.current !== null) {
      setCurrentFace(lockedFinalValueRef.current);
      return;
    }

    phaseRef.current = 'fast';
    elapsedRef.current = 0;
    hasCompletedRef.current = false;
    shouldFireAnimationEndRef.current = false;
    lockedFinalValueRef.current = null;
    setCurrentFace(Math.floor(Math.random() * 6) + 1);

    const animate = () => {
      elapsedRef.current += 16;

      if (phaseRef.current === 'fast') {
        setCurrentFace(Math.floor(Math.random() * 6) + 1);
        if (elapsedRef.current >= 1000) {
          if (hasCompletedRef.current) return;
          hasCompletedRef.current = true;
          
          const finalValue = Math.floor(Math.random() * 6) + 1;
          finalValueRef.current = finalValue;
          lockedFinalValueRef.current = finalValue;
          setCurrentFace(finalValue);
          phaseRef.current = 'settle';
          
          settleTimeoutRef.current = window.setTimeout(() => {
            onComplete?.(finalValue);
            
            if (holdDuration > 0) {
              phaseRef.current = 'hold';
              shouldFireAnimationEndRef.current = true;
              holdTimeoutRef.current = window.setTimeout(() => {
                if (shouldFireAnimationEndRef.current) {
                  onAnimationEnd?.();
                }
                if (intervalRef.current) {
                  clearInterval(intervalRef.current);
                  intervalRef.current = null;
                }
              }, holdDuration);
            } else {
              onAnimationEnd?.();
              if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
              }
            }
          }, settleDuration);
          return;
        }
      }
    };

    intervalRef.current = window.setInterval(animate, 16);

    return () => {
      if (phaseRef.current !== 'hold') {
        shouldFireAnimationEndRef.current = false;
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (settleTimeoutRef.current) {
        clearTimeout(settleTimeoutRef.current);
        settleTimeoutRef.current = null;
      }
      if (holdTimeoutRef.current) {
        clearTimeout(holdTimeoutRef.current);
        holdTimeoutRef.current = null;
      }
    };
  }, [isRolling, face, onComplete, onAnimationEnd, settleDuration, holdDuration]);

  return (
    <img
      src={DICE_FACES[currentFace - 1]}
      alt={`Dice ${currentFace}`}
      draggable={draggable && !isRolling}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className="w-[156px] h-[156px] object-contain"
    />
  );
};

export default DiceRoller;