import React from 'react';
import type { Verse } from '../types';

interface VerseCardProps {
  verse: Verse;
  isPlaying: boolean;
  onPlayPause: (verse: Verse) => void;
}

const PlayIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const PauseIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const VerseCard: React.FC<VerseCardProps> = ({ verse, isPlaying, onPlayPause }) => {
  return (
    <div 
      className="bg-[var(--color-card-bg)] rounded-xl overflow-hidden transition-shadow border border-[var(--color-border)]"
      style={{ boxShadow: 'var(--shadow)' }}
    >
      <div className="p-6 md:p-8">
        <div className="mb-6 text-right">
          <p className="font-arabic text-3xl md:text-4xl text-[var(--color-text-main)] leading-relaxed" dir="rtl">
            {verse.arabic}
          </p>
        </div>
        <div className="mb-4">
          <h4 className="font-semibold text-[var(--color-primary-text)] mb-2">Translation</h4>
          <p className="text-[var(--color-text-main)] leading-relaxed">{verse.translation}</p>
        </div>
      </div>
      <div className="bg-[var(--color-card-footer-bg)] px-6 py-3 flex justify-between items-center">
        <p className="text-sm font-semibold text-[var(--color-primary-text)]">{verse.reference}</p>
        <button
          onClick={() => onPlayPause(verse)}
          className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors duration-200 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-card-footer-bg)] focus:ring-[var(--color-ring)]"
          aria-label={isPlaying ? `Pause recitation of ${verse.reference}` : `Play recitation of ${verse.reference}`}
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>
      </div>
    </div>
  );
};