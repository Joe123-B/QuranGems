import React from 'react';
import type { Theme } from '../types';

interface ThemeSwitcherProps {
  currentTheme: Theme;
  setTheme: (theme: Theme) => void;
}

const SunIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);

const MoonIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
);

const BookIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
);


export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ currentTheme, setTheme }) => {
  const themes: Theme[] = ['light', 'dark', 'sepia'];

  const getIcon = (theme: Theme) => {
    switch (theme) {
      case 'light': return <SunIcon />;
      case 'dark': return <MoonIcon />;
      case 'sepia': return <BookIcon />;
    }
  };
  
  const getLabel = (theme: Theme) => {
    return theme.charAt(0).toUpperCase() + theme.slice(1);
  }

  return (
    <div className="flex items-center p-1 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)]">
      {themes.map((theme) => (
        <button
          key={theme}
          onClick={() => setTheme(theme)}
          className={`p-1.5 rounded-full transition-colors duration-200 ${
            currentTheme === theme
              ? 'bg-[var(--color-primary)] text-white'
              : 'text-[var(--color-text-muted)] hover:bg-[var(--color-border)]'
          }`}
          aria-label={`Switch to ${theme} mode`}
          title={`Switch to ${getLabel(theme)} mode`}
        >
          {getIcon(theme)}
        </button>
      ))}
    </div>
  );
};
