import React from 'react';
import { Trophy, Clock, Footprints } from 'lucide-react';
import type { ScorePopup } from '../types/game';

interface HeaderProps {
  score: number;
  bestScore: number;
  moves: number;
  timer: number;
  scorePopups: ScorePopup[];
}

export const Header: React.FC<HeaderProps> = ({
  score,
  bestScore,
  moves,
  timer,
  scorePopups,
}) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <header className="w-full max-w-[480px] mx-auto mb-4">
      <div className="flex items-center justify-between gap-3 mb-3">
        {/* Logo and Tagline */}
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-amber-500 dark:text-amber-400 drop-shadow-sm select-none">
              2048
            </h1>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:bg-amber-400/15 dark:text-amber-300 border border-amber-500/20 uppercase tracking-wider">
              Modern
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
            Join the tiles, get to <span className="font-bold text-amber-500 dark:text-amber-400">2048</span>!
          </p>
        </div>

        {/* Score Boxes */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Current Score */}
          <div className="relative flex flex-col items-center justify-center min-w-[76px] sm:min-w-[88px] px-3 py-1.5 rounded-xl bg-slate-200/90 dark:bg-slate-800/90 border border-slate-300/50 dark:border-slate-700/60 shadow-sm backdrop-blur-sm">
            <span className="text-[10px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
              SCORE
            </span>
            <span className="text-lg sm:text-xl font-extrabold text-slate-800 dark:text-slate-100">
              {score}
            </span>

            {/* Floating Popups */}
            {scorePopups.map((popup) => (
              <span
                key={popup.id}
                className="absolute -top-3 right-2 text-sm sm:text-base font-extrabold text-amber-600 dark:text-amber-400 pointer-events-none animate-score-float"
              >
                +{popup.value}
              </span>
            ))}
          </div>

          {/* Best Score */}
          <div className="flex flex-col items-center justify-center min-w-[76px] sm:min-w-[88px] px-3 py-1.5 rounded-xl bg-slate-200/90 dark:bg-slate-800/90 border border-slate-300/50 dark:border-slate-700/60 shadow-sm backdrop-blur-sm">
            <span className="flex items-center gap-1 text-[10px] font-bold tracking-wider text-amber-600 dark:text-amber-400 uppercase">
              <Trophy size={11} className="inline" /> BEST
            </span>
            <span className="text-lg sm:text-xl font-extrabold text-slate-800 dark:text-slate-100">
              {bestScore}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Bar (Moves & Timer) */}
      <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/50 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300">
        <div className="flex items-center gap-1.5">
          <Footprints size={15} className="text-slate-400 dark:text-slate-500" />
          <span>Moves:</span>
          <span className="font-bold text-slate-800 dark:text-slate-100">{moves}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <Clock size={15} className="text-slate-400 dark:text-slate-500" />
          <span>Time:</span>
          <span className="font-mono font-bold text-slate-800 dark:text-slate-100">
            {formatTime(timer)}
          </span>
        </div>
      </div>
    </header>
  );
};
