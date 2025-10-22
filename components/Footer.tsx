
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[var(--color-card-bg)] mt-16 border-t border-[var(--color-border)]">
      <div className="container mx-auto px-4 py-6 text-center text-[var(--color-text-subtle)]">
        <p>&copy; {new Date().getFullYear()} QuranicGems. All rights reserved.</p>
        <p className="text-sm mt-1">Generated with the help of AI for educational purposes.</p>
      </div>
    </footer>
  );
};
