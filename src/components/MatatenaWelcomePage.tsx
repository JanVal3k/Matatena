import { useState, useEffect } from 'react';
import { HelpCircle, Star, Zap, Crown, X, Check } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

type Difficulty = 'easy' | 'medium' | 'hard';

interface DifficultyOption {
  value: Difficulty;
  label: string;
  icon: typeof Star;
  color: 'emerald' | 'amber' | 'rose';
  description: string;
}

const colorClasses = {
  emerald: {
    50: 'bg-emerald-50',
    100: 'bg-emerald-100',
    500: 'text-emerald-500',
    600: 'text-emerald-600',
  },
  amber: {
    50: 'bg-amber-50',
    100: 'bg-amber-100',
    500: 'text-amber-500',
    600: 'text-amber-600',
  },
  rose: {
    50: 'bg-rose-50',
    100: 'bg-rose-100',
    500: 'text-rose-500',
    600: 'text-rose-600',
  },
};

const DifficultyButton = ({
  difficulty,
  selected,
  onClick,
}: {
  difficulty: DifficultyOption;
  selected: boolean;
  onClick: () => void;
}) => {
  const IconComponent = difficulty.icon;
  const colors = colorClasses[difficulty.color];

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        w-full relative flex items-center justify-between p-4 md:p-6 rounded-xl border-2 transition-all duration-150
        ${selected
          ? 'bg-matatena-600 border-matatena-600 shadow-md'
          : 'bg-white border-matatena-200 hover:bg-matatena-50 hover:border-matatena-300'
        }
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-matatena-400
      `}
      role="radio"
      aria-checked={selected}
      aria-label={`${difficulty.label} difficulty${selected ? ', selected' : ''}`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`
            p-2 rounded-md shadow-sm transition-all duration-150
            ${selected
              ? 'bg-white'
              : `${colors[100]} ${colors[500].replace('text-', 'text-')}`}
          `}
        >
          <IconComponent size={24} className={selected ? 'text-matatena-500' : colors[600]} />
        </div>
        <div className="text-left">
          <p className={`
            font-semibold text-lg
            ${selected ? 'text-white' : 'text-matatena-700'}
          `}>
            {difficulty.label}
          </p>
          <p className={`
            text-sm
            ${selected ? 'text-white/80' : 'text-matatena-500'}
          `}>
            {difficulty.description}
          </p>
        </div>
      </div>
      {selected && (
        <div className="bg-white p-1.5 rounded-full shadow-md">
          <Check size={20} className="text-matatena-500" />
        </div>
      )}
    </button>
  );
};

const HowToPlaySection = ({ title, description, subItems }: { title: string; description: string; subItems?: Array<{ title: string; description: string }> }) => (
  <div className="space-y-3">
    <div className="flex gap-3">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-matatena-500 text-white font-bold flex items-center justify-center shadow-md text-sm">
        {'§'}
      </div>
      <div className="flex-1">
        <p className="font-semibold text-matatena-800 dark:text-matatena-50">{title}</p>
        <p className="text-sm text-matatena-600 dark:text-matatena-300">{description}</p>
      </div>
    </div>
    {subItems && subItems.map((item, idx) => (
      <div key={idx} className="ml-11 space-y-1 border-l-2 border-matatena-200 dark:border-matatena-700 pl-3">
        <p className="font-semibold text-matatena-700 dark:text-matatena-400">{item.title}</p>
        <p className="text-sm text-matatena-600 dark:text-matatena-300">{item.description}</p>
      </div>
    ))}
  </div>
);

interface MatatenaWelcomePageProps {
  onPlay?: (difficulty: Difficulty) => void;
  defaultDifficulty?: Difficulty;
}

export const MatatenaWelcomePage = ({ onPlay, defaultDifficulty = 'medium' }: MatatenaWelcomePageProps) => {
  const { texts } = useLanguage();
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>(defaultDifficulty);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [hasVisited, setHasVisited] = useState(false);

  useEffect(() => {
    const visited = localStorage.getItem(texts.common.visitedKey);
    if (visited) {
      setHasVisited(true);
    } else {
      localStorage.setItem(texts.common.visitedKey, 'true');
    }
  }, [texts.common.visitedKey]);

  const difficultyOptions: DifficultyOption[] = [
    { value: 'easy', label: texts.difficulty.easy, icon: Star, color: 'emerald', description: texts.difficulty.easyDesc },
    { value: 'medium', label: texts.difficulty.medium, icon: Zap, color: 'amber', description: texts.difficulty.mediumDesc },
    { value: 'hard', label: texts.difficulty.hard, icon: Crown, color: 'rose', description: texts.difficulty.hardDesc },
  ];

  const handlePlay = () => {
    onPlay?.(selectedDifficulty);
  };

  const handleHowToPlay = () => {
    setShowHowToPlay(true);
  };

  const handleCloseHowToPlay = () => {
    setShowHowToPlay(false);
  };

  return (
    <div className="min-h-screen bg-matatena-50 dark:bg-matatena-950 flex items-center justify-center px-4 py-10">
      <div
        className={`
          w-full max-w-md md:max-w-lg lg:max-w-xl
          bg-white dark:bg-matatena-900
          rounded-xl border border-matatena-100 dark:border-matatena-800
          shadow-none p-6 md:p-8 lg:p-10
          ${!hasVisited ? 'animate-fade-in-up' : ''}
        `}
        style={{ animationDelay: '100ms' }}
      >
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-xl bg-matatena-100 dark:bg-matatena-800">
              <img src="/Dados6.png" alt={texts.gameTitle} className="w-12 h-12" />
            </div>
            <div className="space-y-1">
              <h1 className="font-bold text-matatena-800 dark:text-matatena-50 text-3xl md:text-4xl lg:text-5xl">
                {texts.gameTitle}
              </h1>
              <p className="text-matatena-600 dark:text-matatena-400 text-lg">
                {texts.tagline}
              </p>
            </div>
          </div>

          {/* Difficulty Selection */}
          <div>
            <p className="text-sm font-semibold text-matatena-500 dark:text-matatena-400 mb-3">
              {texts.welcome.selectDifficulty}
            </p>
            <div className="space-y-3" role="radiogroup" aria-label="Game difficulty">
              {difficultyOptions.map((diff) => (
                <DifficultyButton
                  key={diff.value}
                  difficulty={diff}
                  selected={selectedDifficulty === diff.value}
                  onClick={() => setSelectedDifficulty(diff.value)}
                />
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 md:flex md:gap-3">
            <button
              type="button"
              onClick={handlePlay}
              className={`
                w-full md:w-1/2 flex items-center justify-center gap-2
                h-12 md:h-14 rounded-lg font-semibold transition-all duration-150
                bg-matatena-600 text-white hover:bg-matatena-700 active:bg-matatena-800
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-matatena-400
                text-base md:text-lg
                shadow-sm
              `}
            >
              <span>{texts.welcome.playGame}</span>
            </button>

            <button
              type="button"
              onClick={handleHowToPlay}
              className={`
                w-full md:w-1/2 flex items-center justify-center gap-2
                h-10 md:h-12 rounded-lg font-medium transition-all duration-150
                bg-transparent border-2 border-matatena-300 text-matatena-700
                hover:bg-matatena-50 hover:border-matatena-400 active:bg-matatena-100
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-matatena-400
                text-sm md:text-base
                dark:border-matatena-600 dark:text-matatena-200 dark:hover:bg-matatena-800 dark:hover:border-matatena-500 dark:active:bg-matatena-700
              `}
            >
              <HelpCircle size={20} className="text-matatena-600 dark:text-matatena-400" />
              <span>{texts.welcome.howToPlay}</span>
            </button>
          </div>
        </div>
      </div>

      {/* How to Play Modal */}
      {showHowToPlay && (
        <div
          className="fixed inset-0 bg-matatena-950/60 dark:bg-black/70 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="how-to-play-title"
        >
          <div className="w-full max-w-lg bg-white dark:bg-matatena-900 rounded-xl shadow-xl p-6 md:p-8">
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-matatena-100 dark:border-matatena-800 pb-4">
                <h2 id="how-to-play-title" className="text-xl font-bold text-matatena-800 dark:text-matatena-50">
                  {texts.howToPlay.title}
                </h2>
                <button
                  type="button"
                  onClick={handleCloseHowToPlay}
                  className="p-2 rounded-full text-matatena-500 dark:text-matatena-400 hover:bg-matatena-50 dark:hover:bg-matatena-800 transition-colors"
                  aria-label={texts.howToPlay.close}
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6" role="list">
                {texts.howToPlay.sections.map((section, idx) => (
                  <HowToPlaySection
                    key={idx}
                    title={section.title}
                    description={section.description}
                    subItems={section.subItems}
                  />
                ))}
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <button
                  type="button"
                  onClick={handleCloseHowToPlay}
                  className={`
                    px-4 py-2 rounded-lg font-medium transition-all duration-150
                    border-2 border-matatena-300 text-matatena-700
                    hover:bg-matatena-50 hover:border-matatena-400
                    dark:border-matatena-600 dark:text-matatena-200 dark:hover:bg-matatena-800 dark:hover:border-matatena-500
                  `}
                >
                  {texts.howToPlay.gotIt}
                </button>
                <button
                  type="button"
                  onClick={() => { handleCloseHowToPlay(); handlePlay(); }}
                  className="px-4 py-2 rounded-lg font-semibold bg-matatena-600 text-white hover:bg-matatena-700 transition-colors"
                >
                  {texts.howToPlay.startPlaying}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatatenaWelcomePage;