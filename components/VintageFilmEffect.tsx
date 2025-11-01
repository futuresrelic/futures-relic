'use client';

import React from 'react';

export function VintageFilmEffect() {
  return (
    <>
      {/* Film grain overlay */}
      <div className="pointer-events-none fixed inset-0 z-50 opacity-10">
        <div className="h-full w-full bg-repeat" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            animation: 'grain 0.5s steps(10) infinite',
          }}
        />
      </div>

      {/* Vignette effect */}
      <div 
        className="pointer-events-none fixed inset-0 z-40"
        style={{
          background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.8) 100%)',
        }}
      />

      {/* Film border scratches */}
      <div className="pointer-events-none fixed inset-0 z-40">
        <div className="absolute left-0 top-0 h-full w-2 bg-gradient-to-r from-vintage-dark via-transparent to-transparent opacity-30" />
        <div className="absolute right-0 top-0 h-full w-2 bg-gradient-to-l from-vintage-dark via-transparent to-transparent opacity-30" />
        <div className="absolute left-0 top-0 h-2 w-full bg-gradient-to-b from-vintage-dark via-transparent to-transparent opacity-30" />
        <div className="absolute bottom-0 left-0 h-2 w-full bg-gradient-to-t from-vintage-dark via-transparent to-transparent opacity-30" />
      </div>

      {/* Occasional flicker effect */}
      <div 
        className="pointer-events-none fixed inset-0 z-30 animate-flicker bg-black opacity-0"
        style={{
          animation: 'flicker 4s infinite',
          animationDelay: '2s',
        }}
      />
    </>
  );
}
