import { ArrowLeft, RefreshCw, Trophy, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

type Winner = 'player' | 'ia' | 'tie';
type Difficulty = 'easy' | 'medium' | 'hard';

interface WinLoseModalProps {
  winner: Winner | null;
  playerScore: number;
  iaScore: number;
  difficulty: Difficulty;
  onBackToMenu: () => void;
  onPlayAgain: () => void;
  isOpen: boolean;
}

const difficultyColors: Record<Difficulty, string> = {
  easy: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  hard: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
};

export const WinLoseModal = ({
  winner,
  playerScore,
  iaScore,
  difficulty,
  onBackToMenu,
  onPlayAgain,
  isOpen,
}: WinLoseModalProps) => {
  const { texts } = useLanguage();

  const difficultyLabels: Record<Difficulty, string> = {
    easy: texts.difficulty.easy,
    medium: texts.difficulty.medium,
    hard: texts.difficulty.hard,
  };

  if (!isOpen) return null;

  const getWinnerText = () => {
    switch (winner) {
      case 'player':
        return { text: texts.modal.youWin, icon: Trophy, color: 'text-emerald-500 dark:text-emerald-400' };
      case 'ia':
        return { text: texts.modal.iaWins, icon: X, color: 'text-rose-500 dark:text-rose-400' };
      default:
        return { text: texts.modal.tie, icon: X, color: 'text-amber-500 dark:text-amber-400' };
    }
  };

  const winnerInfo = getWinnerText();
  const WinnerIcon = winnerInfo.icon;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-matatena-950/60 dark:bg-black/70 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="game-result-title"
    >
      <div
        className="w-full max-w-md bg-white dark:bg-matatena-900 rounded-2xl shadow-xl p-6 md:p-8 animate-slide-up"
        style={{ animationDelay: '50ms' }}
      >
        <div className="space-y-6 text-center">
          <div className="space-y-3">
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mx-auto ${winner === 'player' ? 'bg-emerald-100 dark:bg-emerald-900/30' : winner === 'ia' ? 'bg-rose-100 dark:bg-rose-900/30' : 'bg-amber-100 dark:bg-amber-900/30'}`}>
              <WinnerIcon size={40} className={winnerInfo.color} />
            </div>
            <h2 id="game-result-title" className={`font-bold text-3xl md:text-4xl ${winnerInfo.color}`}>
              {winnerInfo.text}
            </h2>
          </div>

          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${difficultyColors[difficulty]}`}>
            {difficultyLabels[difficulty]}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-matatena-50 dark:bg-matatena-800 border border-matatena-200 dark:border-matatena-700">
              <p className="text-sm font-medium text-matatena-600 dark:text-matatena-400 mb-1">{texts.score.player}</p>
              <p className={`font-mono text-3xl font-bold ${winner === 'player' ? 'text-emerald-500' : 'text-matatena-800 dark:text-matatena-50'}`}>
                {playerScore}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-matatena-50 dark:bg-matatena-800 border border-matatena-200 dark:border-matatena-700">
              <p className="text-sm font-medium text-matatena-600 dark:text-matatena-400 mb-1">{texts.score.ia}</p>
              <p className={`font-mono text-3xl font-bold ${winner === 'ia' ? 'text-rose-500' : 'text-matatena-800 dark:text-matatena-50'}`}>
                {iaScore}
              </p>
            </div>
          </div>

          <div className="flex gap-3 justify-center pt-2">
            <button
              type="button"
              onClick={onBackToMenu}
              className={`
                flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-150
                border-2 border-matatena-300 text-matatena-700
                hover:bg-matatena-50 hover:border-matatena-400 active:bg-matatena-100
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-matatena-400
                dark:border-matatena-600 dark:text-matatena-200 dark:hover:bg-matatena-800 dark:hover:border-matatena-500 dark:active:bg-matatena-700
              `}
            >
              <ArrowLeft size={20} />
              <span>{texts.modal.backToMenu}</span>
            </button>
            <button
              type="button"
              onClick={onPlayAgain}
              className={`
                flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all duration-150
                bg-matatena-600 text-white hover:bg-matatena-700 active:bg-matatena-800
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-matatena-400
                shadow-sm
              `}
            >
              <RefreshCw size={20} />
              <span>{texts.modal.playAgain}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WinLoseModal;