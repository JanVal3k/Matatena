import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { LanguageProvider } from './contexts/LanguageContext';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LanguageProvider>
      <App />
      <LanguageSwitcher />
    </LanguageProvider>
  </React.StrictMode>
);