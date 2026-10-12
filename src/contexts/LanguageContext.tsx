import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import fallbackTexts from '../texts/en.json';

type Language = 'en' | 'es';

interface Texts {
  gameTitle: string;
  tagline: string;
  welcome: {
    playGame: string;
    howToPlay: string;
    selectDifficulty: string;
  };
  difficulty: {
    easy: string;
    medium: string;
    hard: string;
    easyDesc: string;
    mediumDesc: string;
    hardDesc: string;
  };
  howToPlay: {
    title: string;
    close: string;
    gotIt: string;
    startPlaying: string;
    sections: Array<{
      title: string;
      description: string;
      subItems?: Array<{ title: string; description: string }>;
    }>;
  };
  playing: {
    header: string;
    playerTurn: string;
    rollingDice: string;
    iaRolling: string;
    readyToDrop: string;
    iaValue: string;
  };
  score: {
    player: string;
    ia: string;
  };
  modal: {
    backToMenu: string;
    playAgain: string;
    youWin: string;
    iaWins: string;
    tie: string;
  };
  common: {
    visitedKey: string;
  };
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  texts: Texts;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'parry-dice-lang';

const getBrowserLanguage = (): Language => {
  if (typeof window === 'undefined') return 'en';
  const browserLang = navigator.language.toLowerCase();
  if (browserLang.startsWith('es')) return 'es';
  return 'en';
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window === 'undefined') return 'en';
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language | null;
    if (stored === 'en' || stored === 'es') return stored;
    return getBrowserLanguage();
  });

  const [texts, setTexts] = useState<Texts>(fallbackTexts);

  const loadTexts = async (lang: Language) => {
    try {
      const module = await import(`../texts/${lang}.json`);
      setTexts(module.default);
    } catch (error) {
      console.error(`Failed to load language ${lang}:`, error);
      setTexts(fallbackTexts);
    }
  };

  useEffect(() => {
    loadTexts(language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    setLanguageState(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, texts }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};