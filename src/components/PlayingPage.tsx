import { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import { BoardContainer } from './BoardContainer';
import { ImageSlot } from './ImageSlot';
import { WinLoseModal } from './WinLoseModal';

import { runFSM, AIState } from '../utils/AITurnFSM';
import { eventBus } from '../services/eventBus';
import { aiService } from '../services/aiService';
import { Events, AI } from '../constants/Constants';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { calculateAllColumnValues, calculateTotalValue, getScoringModeForDifficulty } from '../utils/scoring';
import { getDestroyedIndices, applyDestruction } from '../utils/destruction';
import { useLanguage } from '@/contexts/LanguageContext';

type Difficulty = 'easy' | 'medium' | 'hard';

const JUGADOR_CELL_COLORS = [
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

const IA_CELL_COLORS = [
  'bg-matatena-900 dark:bg-matatena-100',
  'bg-matatena-800 dark:bg-matatena-200',
  'bg-matatena-700 dark:bg-matatena-300',
  'bg-matatena-600 dark:bg-matatena-400',
  'bg-matatena-500 dark:bg-matatena-500',
  'bg-matatena-600 dark:bg-matatena-400',
  'bg-matatena-700 dark:bg-matatena-300',
  'bg-matatena-800 dark:bg-matatena-200',
  'bg-matatena-900 dark:bg-matatena-100',
];

type TurnPhase = 'player-rolling' | 'player-waiting' | 'ia-rolling';
type GameStatus = 'playing' | 'ended';
type Winner = 'player' | 'ia' | 'tie';

interface PlayingPageProps {
  difficulty: Difficulty;
  onBack: () => void;
}

export const PlayingPage = ({ difficulty, onBack }: PlayingPageProps) => {
  const { texts } = useLanguage();
  const [jugadorDice, setJugadorDice] = useState<number | null>(null);
  const [isRollingDice, setIsRollingDice] = useState(false);
  const [jugadorOccupied, setJugadorOccupied] = useState<Record<number, number>>({});

  const [iaDice, setIaDice] = useState<number | null>(null);
  const [isRollingIA, setIsRollingIA] = useState(false);
  const [iaOccupied, setIaOccupied] = useState<Record<number, number>>({});

  const [iaState, setIaState] = useState<AIState>('idle');
  const [turnPhase, setTurnPhase] = useState<TurnPhase>('player-rolling');
  const [gameStatus, setGameStatus] = useState<GameStatus>('playing');
  const [winner, setWinner] = useState<Winner | null>(null);

  const isMobile = useMediaQuery('(max-width: 767px)');

  const [iaReadyToDrop, setIaReadyToDrop] = useState<{ value: number; index: number | null } | null>(null);
  const [iaDestroyedIndices, setIaDestroyedIndices] = useState<number[]>([]);
  const [jugadorDestroyedIndices, setJugadorDestroyedIndices] = useState<number[]>([]);

  const readyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scoringMode = getScoringModeForDifficulty(difficulty);
  const playerColumnValues = calculateAllColumnValues(jugadorOccupied, scoringMode);
  const iaColumnValues = calculateAllColumnValues(iaOccupied, scoringMode);
  const playerTotalValue = calculateTotalValue(jugadorOccupied, scoringMode);
  const iaTotalValue = calculateTotalValue(iaOccupied, scoringMode);

  const isPlayerBoardFull = Object.keys(jugadorOccupied).length >= 9;
  const isIABoardFull = Object.keys(iaOccupied).length >= 9;

  const checkEndGame = useCallback(() => {
    if (isPlayerBoardFull || isIABoardFull) {
      setGameStatus('ended');
      if (playerTotalValue > iaTotalValue) {
        setWinner('player');
      } else if (iaTotalValue > playerTotalValue) {
        setWinner('ia');
      } else {
        setWinner('tie');
      }
      if (readyTimeoutRef.current) {
        clearTimeout(readyTimeoutRef.current);
        readyTimeoutRef.current = null;
      }
      return true;
    }
    return false;
  }, [isPlayerBoardFull, isIABoardFull, playerTotalValue, iaTotalValue]);

  useEffect(() => {
    if (gameStatus === 'playing') {
      checkEndGame();
    }
  }, [jugadorOccupied, iaOccupied, gameStatus, checkEndGame]);

  useEffect(() => {
    return () => {
      if (readyTimeoutRef.current) clearTimeout(readyTimeoutRef.current);
    };
  }, []);

  const startDiceRoll = useCallback(() => {
    setIsRollingDice(true);
    setTurnPhase('player-rolling');
  }, []);

  const startDiceRollIA = useCallback(() => {
    console.log('[PlayingPage] startDiceRollIA called with difficulty:', difficulty);
    aiService.setDifficulty(difficulty);
    setIaState(prev => runFSM(prev, 'start'));
    setIsRollingIA(true);
    setTurnPhase('ia-rolling');
  }, [difficulty]);

  const handlePlayAgain = useCallback(() => {
    setJugadorOccupied({});
    setIaOccupied({});
    setJugadorDice(null);
    setIaDice(null);
    setIsRollingDice(false);
    setIsRollingIA(false);
    setIaState('idle');
    setTurnPhase('player-rolling');
    setIaReadyToDrop(null);
    setIaDestroyedIndices([]);
    setJugadorDestroyedIndices([]);
    setGameStatus('playing');
    setWinner(null);
    if (readyTimeoutRef.current) {
      clearTimeout(readyTimeoutRef.current);
      readyTimeoutRef.current = null;
    }
    startDiceRoll();
  }, [startDiceRoll]);

  const handleBackToMenu = useCallback(() => {
    if (readyTimeoutRef.current) {
      clearTimeout(readyTimeoutRef.current);
      readyTimeoutRef.current = null;
    }
    onBack();
  }, [onBack]);

  const handleDiceComplete = useCallback((value: number) => {
    setJugadorDice(value);
    setIsRollingDice(false);
    setTurnPhase('player-waiting');
  }, []);

  const handleDiceCompleteIA = useCallback(async (value: number) => {
    if (!value) return;

    const emptyCells = [0, 1, 2, 3, 4, 5, 6, 7, 8].filter(i => !iaOccupied[i]);

    const nextState = runFSM(iaState, 'diceComplete');
    setIaState(nextState);

    switch (nextState) {
      case 'ready': {
        setIaReadyToDrop({ value, index: emptyCells[0] || null });

        readyTimeoutRef.current = setTimeout(async () => {
          try {
            const move = await aiService.chooseMove({
              aiBoard: iaOccupied,
              playerBoard: jugadorOccupied,
              diceValue: value,
              emptyCells,
              difficulty,
              scoringMode,
              aiScore: iaTotalValue,
              playerScore: playerTotalValue,
            });
            const targetIndex = move.cellIndex;

            setIaState('dropping');

            const columnIndex = targetIndex % 3;
            const destroyedIndices = getDestroyedIndices(jugadorOccupied, columnIndex, value);
            if (destroyedIndices.length > 0) {
              setJugadorOccupied(prev => applyDestruction(prev, destroyedIndices));
              setJugadorDestroyedIndices(destroyedIndices);
            }

            setIaOccupied(prev => ({ ...prev, [targetIndex]: value }));
            setIaDice(null);
            setIsRollingIA(false);
            setIaReadyToDrop(null);

            eventBus.emit(Events.IA_DICE_COMPLETE, { value, index: targetIndex });
            setTurnPhase('player-waiting');

            console.log('[PlayingPage] AI move executed', {
              difficulty,
              targetIndex,
              destroyedCount: destroyedIndices.length,
              scoringMode,
            });
          } catch (error) {
            console.error('AI move failed, falling back to random', error);
            const targetIndex = emptyCells.length > 0 ? emptyCells[Math.floor(Math.random() * emptyCells.length)] : -1;

            setIaState('dropping');
            const columnIndex = targetIndex % 3;
            const destroyedIndices = getDestroyedIndices(jugadorOccupied, columnIndex, value);
            if (destroyedIndices.length > 0) {
              setJugadorOccupied(prev => applyDestruction(prev, destroyedIndices));
              setJugadorDestroyedIndices(destroyedIndices);
            }

            setIaOccupied(prev => ({ ...prev, [targetIndex]: value }));
            setIaDice(null);
            setIsRollingIA(false);
            setIaReadyToDrop(null);

            eventBus.emit(Events.IA_DICE_COMPLETE, { value, index: targetIndex });
            setTurnPhase('player-waiting');
          }
        }, AI.TIME_BEFORE_DROP);
        break;
      }

      case 'dropping': {
        try {
          const move = await aiService.chooseMove({
            aiBoard: iaOccupied,
            playerBoard: jugadorOccupied,
            diceValue: value,
            emptyCells,
            difficulty,
            scoringMode,
            aiScore: iaTotalValue,
            playerScore: playerTotalValue,
          });
          const targetIndex = move.cellIndex;

          const columnIndex = targetIndex % 3;
          const destroyedIndices = getDestroyedIndices(jugadorOccupied, columnIndex, value);
          if (destroyedIndices.length > 0) {
            setJugadorOccupied(prev => applyDestruction(prev, destroyedIndices));
            setJugadorDestroyedIndices(destroyedIndices);
          }

          setIaOccupied(prev => ({ ...prev, [targetIndex]: value }));
          setIaDice(null);
          setIsRollingIA(false);
          setIaReadyToDrop(null);

          eventBus.emit(Events.IA_DICE_COMPLETE, { value, index: targetIndex });
          setTurnPhase('player-waiting');

          console.log('[PlayingPage] AI move executed', {
            difficulty,
            targetIndex,
            destroyedCount: destroyedIndices.length,
            scoringMode,
          });
        } catch (error) {
          console.error('AI move failed, falling back to random', error);
          const targetIndex = emptyCells.length > 0 ? emptyCells[Math.floor(Math.random() * emptyCells.length)] : -1;

          const columnIndex = targetIndex % 3;
          const destroyedIndices = getDestroyedIndices(jugadorOccupied, columnIndex, value);
          if (destroyedIndices.length > 0) {
            setJugadorOccupied(prev => applyDestruction(prev, destroyedIndices));
            setJugadorDestroyedIndices(destroyedIndices);
          }

          setIaOccupied(prev => ({ ...prev, [targetIndex]: value }));
          setIaDice(null);
          setIsRollingIA(false);
          setIaReadyToDrop(null);

          eventBus.emit(Events.IA_DICE_COMPLETE, { value, index: targetIndex });
          setTurnPhase('player-waiting');
        }
        break;
      }

      case 'completed':
        break;

      case 'idle':
        break;
    }
  }, [iaState, iaOccupied, jugadorOccupied, difficulty, scoringMode]);

  const handleDragStart = useCallback((e: React.DragEvent) => {
    if (!jugadorDice || turnPhase !== 'player-waiting') return;
    e.dataTransfer.setData('text/plain', `dice-${jugadorDice}`);
    e.dataTransfer.effectAllowed = 'move';
  }, [jugadorDice, turnPhase]);

  const handleDragEnd = useCallback(() => {
    // No state needed
  }, []);

  const handleCellDrop = useCallback((index: number, boardId: number, e: React.DragEvent) => {
    if (boardId !== 0 || !jugadorDice || turnPhase !== 'player-waiting' || gameStatus !== 'playing') return;
    if (jugadorOccupied[index]) return;

    e.preventDefault();

    const columnIndex = index % 3;
    const placedValue = jugadorDice;

    // Check for destruction on IA board
    const destroyedIndices = getDestroyedIndices(iaOccupied, columnIndex, placedValue);
    if (destroyedIndices.length > 0) {
      setIaOccupied(prev => applyDestruction(prev, destroyedIndices));
      setIaDestroyedIndices(destroyedIndices);
    }

    setJugadorOccupied(prev => ({ ...prev, [index]: placedValue }));
    setJugadorDice(null);
    setTurnPhase('ia-rolling');

    const timer = setTimeout(() => {
      if (gameStatus === 'playing') {
        startDiceRollIA();
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [jugadorDice, jugadorOccupied, iaOccupied, turnPhase, gameStatus, startDiceRollIA]);

  useEffect(() => {
    if (turnPhase === 'player-rolling' && !isRollingDice && !jugadorDice && gameStatus === 'playing') {
      startDiceRoll();
    }
  }, [turnPhase, isRollingDice, jugadorDice, gameStatus, startDiceRoll]);

  // Auto-roll for player when turn returns and player has no dice
  useEffect(() => {
    if (turnPhase === 'player-waiting' && !jugadorDice && !isRollingDice && gameStatus === 'playing') {
      startDiceRoll();
    }
  }, [turnPhase, jugadorDice, isRollingDice, gameStatus, startDiceRoll]);

  const canDragDice = jugadorDice !== null && turnPhase === 'player-waiting' && gameStatus === 'playing';

return (
    <div className="min-h-screen bg-matatena-50 dark:bg-matatena-950 flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-[1400px] mx-auto text-center mb-8">
        <h1 className="font-bold text-matatena-800 dark:text-matatena-50 text-4xl lg:text-5xl mb-2">
          {texts.playing.header}
        </h1>
        <p className="text-matatena-600 dark:text-matatena-400 text-lg capitalize">
          {difficulty}
        </p>
        <p className={`text-sm mt-2 ${turnPhase === 'player-waiting' ? 'text-matatena-500' : turnPhase === 'ia-rolling' ? 'text-matatena-400' : 'text-matatena-700'}`}>
          {turnPhase === 'player-waiting' && texts.playing.playerTurn}
          {turnPhase === 'player-rolling' && texts.playing.rollingDice}
          {turnPhase === 'ia-rolling' && texts.playing.iaRolling}
        </p>
      </div>

      <div className="w-full max-w-[1400px] mx-auto mb-6 flex justify-between items-center px-4">
        <div className="flex items-center gap-2 text-matatena-800 dark:text-matatena-200 font-bold text-lg">
          <span>{texts.score.player}:</span>
          <span className="font-mono bg-matatena-200 dark:bg-matatena-700 px-3 py-1 rounded">{playerTotalValue}</span>
        </div>
        <div className="flex items-center gap-2 text-matatena-900 dark:text-matatena-100 font-bold text-lg">
          <span>{texts.score.ia}:</span>
          <span className="font-mono bg-matatena-900 dark:bg-matatena-100 text-white dark:text-matatena-900 px-3 py-1 rounded">{iaTotalValue}</span>
        </div>
      </div>

      {isMobile ? (
        <div className="w-full max-w-[1400px] mx-auto flex flex-col items-center gap-8 mb-8">
          <div className="w-full flex flex-col items-center gap-4">
            <div className="flex flex-col items-center gap-2">
              <div className="text-matatena-800 dark:text-matatena-200 font-bold text-lg font-mono bg-matatena-200 dark:bg-matatena-700 px-3 py-1 rounded">
                {playerTotalValue}
              </div>
              {jugadorDice !== null && (
                <p className="text-matatena-800 dark:text-matatena-200 font-bold text-lg">
                  {jugadorDice}
                </p>
              )}
              <ImageSlot
                boardId={0}
                diceValue={jugadorDice ?? undefined}
                isRolling={isRollingDice}
                onComplete={handleDiceComplete}
                draggable={canDragDice}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              />
            </div>
            <BoardContainer
              label="Jugador"
              boardId={0}
              onCellDrop={handleCellDrop}
              isDropTarget={turnPhase === 'player-waiting' && !isPlayerBoardFull}
              droppedDiceIndex={undefined}
              droppedDiceValue={undefined}
              cellColors={JUGADOR_CELL_COLORS}
              borderColor="border-matatena-200 dark:border-matatena-700"
              occupiedCells={jugadorOccupied}
              columnValues={playerColumnValues}
              destroyedIndices={jugadorDestroyedIndices}
              onDestructionComplete={() => setJugadorDestroyedIndices([])}
            />
          </div>

          <div className="w-full flex flex-col items-center gap-4">
            <BoardContainer
              label="IA"
              boardId={1}
              onCellDrop={undefined}
              isDropTarget={false}
              droppedDiceIndex={undefined}
              droppedDiceValue={undefined}
              cellColors={IA_CELL_COLORS}
              borderColor="border-matatena-700 dark:border-matatena-200"
              labelColor="text-matatena-400 dark:text-matatena-600"
              occupiedCells={iaOccupied}
              columnValues={iaColumnValues}
              destroyedIndices={iaDestroyedIndices}
              onDestructionComplete={() => setIaDestroyedIndices([])}
            />
            <ImageSlot
              boardId={1}
              diceValue={iaDice ?? undefined}
              isRolling={isRollingIA}
              onComplete={handleDiceCompleteIA}
              draggable={false}
              holdDuration={1000}
            />
            <div className="font-bold text-lg font-mono bg-matatena-900 dark:bg-matatena-100 text-white dark:text-matatena-900 px-3 py-1 rounded mt-2">
              {iaTotalValue}
            </div>
            {iaReadyToDrop ? (
              <p className="mt-2 text-matatena-500 dark:text-matatena-400 font-bold text-lg">
                {texts.playing.readyToDrop}{iaReadyToDrop.value}
              </p>
            ) : iaDice !== null && !isRollingIA ? (
              <p className="mt-2 text-matatena-400 dark:text-matatena-600 font-bold text-lg">
                {texts.playing.iaValue}{iaDice}
              </p>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="w-full max-w-[1400px] mx-auto grid grid-cols-[156px_1fr_1fr_156px] gap-4 items-start mb-8">
          <div className="relative self-end">
            {jugadorDice !== null && (
              <p className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 text-matatena-800 dark:text-matatena-200 font-bold text-lg">
                Value: {jugadorDice}
              </p>
            )}
            <div className="mb-2 text-matatena-800 dark:text-matatena-200 font-bold text-lg font-mono bg-matatena-200 dark:bg-matatena-700 px-3 py-1 rounded self-end">
              {playerTotalValue}
            </div>
            <ImageSlot
              boardId={0}
              className="self-end"
              diceValue={jugadorDice ?? undefined}
              isRolling={isRollingDice}
              onComplete={handleDiceComplete}
              draggable={canDragDice}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            />
          </div>

          <BoardContainer
            label="Jugador"
            boardId={0}
            onCellDrop={handleCellDrop}
            isDropTarget={turnPhase === 'player-waiting' && !isPlayerBoardFull}
            droppedDiceIndex={undefined}
            droppedDiceValue={undefined}
            cellColors={JUGADOR_CELL_COLORS}
            borderColor="border-matatena-200 dark:border-matatena-700"
            occupiedCells={jugadorOccupied}
            columnValues={playerColumnValues}
            destroyedIndices={jugadorDestroyedIndices}
            onDestructionComplete={() => setJugadorDestroyedIndices([])}
          />

          <BoardContainer
            label="IA"
            boardId={1}
            onCellDrop={undefined}
            isDropTarget={false}
            droppedDiceIndex={undefined}
            droppedDiceValue={undefined}
            cellColors={IA_CELL_COLORS}
            borderColor="border-matatena-700 dark:border-matatena-200"
            labelColor="text-matatena-400 dark:text-matatena-600"
            occupiedCells={iaOccupied}
            columnValues={iaColumnValues}
            destroyedIndices={iaDestroyedIndices}
            onDestructionComplete={() => setIaDestroyedIndices([])}
          />

          <div className="flex flex-col items-center">
            <ImageSlot
              boardId={1}
              className="self-start mt-12"
              diceValue={iaDice ?? undefined}
              isRolling={isRollingIA}
              onComplete={handleDiceCompleteIA}
              draggable={false}
              holdDuration={1000}
            />
            <div className="font-bold text-lg font-mono bg-matatena-900 dark:bg-matatena-100 text-white dark:text-matatena-900 px-3 py-1 rounded mt-2">
              {iaTotalValue}
            </div>
            {iaReadyToDrop ? (
              <p className="mt-2 text-matatena-500 dark:text-matatena-400 font-bold text-lg">
                {texts.playing.readyToDrop}{iaReadyToDrop.value}
              </p>
            ) : iaDice !== null && !isRollingIA ? (
              <p className="mt-2 text-matatena-400 dark:text-matatena-600 font-bold text-lg">
                {texts.playing.iaValue}{iaDice}
              </p>
            ) : null}
          </div>
        </div>
      )}

      <WinLoseModal
        winner={winner}
        playerScore={playerTotalValue}
        iaScore={iaTotalValue}
        difficulty={difficulty}
        onBackToMenu={handleBackToMenu}
        onPlayAgain={handlePlayAgain}
        isOpen={gameStatus === 'ended'}
      />

      <button
        type="button"
        onClick={handleBackToMenu}
        className={`
          inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-150
          bg-transparent border-2 border-matatena-300 text-matatena-700
          hover:bg-matatena-50 hover:border-matatena-400 active:bg-matatena-100
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-matatena-400
          dark:border-matatena-600 dark:text-matatena-200 dark:hover:bg-matatena-800 dark:hover:border-matatena-500 dark:active:bg-matatena-700
        `}
      >
        <ArrowLeft size={20} />
        <span>{texts.modal.backToMenu}</span>
      </button>
    </div>
  );
};

export default PlayingPage;