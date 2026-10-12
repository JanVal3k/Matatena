import { useState } from 'react';
import MatatenaWelcomePage from './components/MatatenaWelcomePage';
import PlayingPage from './components/PlayingPage';
import './index.css';

type Difficulty = 'easy' | 'medium' | 'hard';
type Page = 'welcome' | 'playing';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('welcome');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('medium');

  const handlePlay = (difficulty: Difficulty) => {
    setSelectedDifficulty(difficulty);
    setCurrentPage('playing');
  };

  const handleBack = () => {
    setCurrentPage('welcome');
  };

  return (
    currentPage === 'welcome' ? (
      <MatatenaWelcomePage onPlay={handlePlay} defaultDifficulty={selectedDifficulty} />
    ) : (
      <PlayingPage difficulty={selectedDifficulty} onBack={handleBack} />
    )
  );
}

export default App;