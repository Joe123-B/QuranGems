import React from 'react';
import type { Theme } from '../types';
import { ThemeSwitcher } from './ThemeSwitcher';

interface HeaderProps {
  currentTheme: Theme;
  setTheme: (theme: Theme) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTheme, setTheme }) => {
  return (
    <header className="bg-[var(--color-card-bg)]" style={{ boxShadow: 'var(--shadow)' }}>
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-primary-text)]">
          Quranic<span className="text-[var(--color-accent)]">Gems</span>
        </h1>
        <div className="flex items-center gap-4">
          <p className="text-sm text-[var(--color-text-subtle)] hidden md:block">Your guide to impactful verses</p>
          <ThemeSwitcher currentTheme={currentTheme} setTheme={setTheme} />
        </div>
      </div>
    </header>
  );
};
