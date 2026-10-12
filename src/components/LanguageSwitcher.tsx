import { useLanguage } from '../contexts/LanguageContext';

export const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <button
      type="button"
      onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
      className={`
        fixed top-4 right-4 z-50
        px-3 py-1.5 rounded-lg
        font-mono text-xs font-bold
        bg-matatena-100 dark:bg-matatena-800
        text-matatena-700 dark:text-matatena-300
        border border-matatena-300 dark:border-matatena-600
        hover:bg-matatena-200 dark:hover:bg-matatena-700
        active:bg-matatena-300 dark:active:bg-matatena-600
        transition-colors duration-150
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-matatena-400
      `}
      aria-label={`Current language: ${language.toUpperCase()}. Click to switch.`}
    >
      {language === 'en' ? 'ES' : 'EN'}
    </button>
  );
};