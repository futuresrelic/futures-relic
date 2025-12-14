import React from 'react';

export const VintageFilmOverlay: React.FC = () => {
  return null;
};

export const FilmFrame: React.FC<{ children: React.ReactNode; className?: string; style?: React.CSSProperties }> = ({
  children,
  className = '',
  style,
}) => {
  return (
    <div className={`relative border-4 border-vintage-sepia bg-vintage-darkBrown shadow-2xl ${className}`} style={style}>
      {children}
    </div>
  );
};

export const OldPaperCard: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`bg-vintage-oldPaper text-vintage-darkBrown border-2 border-vintage-sepia shadow-lg ${className}`}>
      {children}
    </div>
  );
};
