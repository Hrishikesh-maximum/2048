import React from 'react';
import {
  RotateCcw,
  Sparkles,
  HelpCircle,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  RefreshCw,
} from 'lucide-react';

interface ControlsProps {
  onNewGame: () => void;
  onRestartClick: () => void;
  onUndo: () => void;
  canUndo: boolean;
  onOpenHowToPlay: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const Controls: React.FC<ControlsProps> = ({
  onNewGame,
  onRestartClick,
  onUndo,
  canUndo,
  onOpenHowToPlay,
  soundEnabled,
  onToggleSound,
  theme,
  onToggleTheme,
}) => {
  return (
    <div className="w-full max-w-[480px] mx-auto mb-4 flex flex-wrap items-center justify-between gap-2">
      {/* Primary Action Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={onNewGame}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all duration-150 cursor-pointer"
          title="Start a new game"
        >
          <Sparkles size={15} />
          <span>New Game</span>
        </button>

        <button
          onClick={onRestartClick}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 active:scale-95 text-slate-700 dark:text-slate-200 font-semibold text-xs sm:text-sm border border-slate-300/60 dark:border-slate-700/60 transition-all duration-150 cursor-pointer"
          title="Restart with confirmation"
        >
          <RefreshCw size={14} />
          <span className="hidden sm:inline">Restart</span>
        </button>

        <button
          onClick={onUndo}
          disabled={!canUndo}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-semibold text-xs sm:text-sm border transition-all duration-150 ${
            canUndo
              ? 'bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 active:scale-95 text-slate-700 dark:text-slate-200 border-slate-300/60 dark:border-slate-700/60 cursor-pointer'
              : 'bg-slate-100 dark:bg-slate-800/40 text-slate-400 dark:text-slate-600 border-transparent cursor-not-allowed opacity-60'
          }`}
          title={canUndo ? 'Undo last move' : 'No moves to undo'}
        >
          <RotateCcw size={14} />
          <span>Undo</span>
        </button>
      </div>

      {/* Auxiliary Icon Buttons */}
      <div className="flex items-center gap-1.5">
        {/* Sound toggle */}
        <button
          onClick={onToggleSound}
          className="p-2 rounded-xl bg-slate-200/80 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300/50 dark:border-slate-700/50 active:scale-95 transition-all cursor-pointer"
          title={soundEnabled ? 'Mute sound' : 'Enable sound'}
          aria-label={soundEnabled ? 'Mute sound' : 'Enable sound'}
        >
          {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} className="text-red-500" />}
        </button>

        {/* Theme toggle */}
        <button
          onClick={onToggleTheme}
          className="p-2 rounded-xl bg-slate-200/80 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300/50 dark:border-slate-700/50 active:scale-95 transition-all cursor-pointer"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun size={16} className="text-amber-400" />
          ) : (
            <Moon size={16} className="text-slate-600" />
          )}
        </button>

        {/* How to Play */}
        <button
          onClick={onOpenHowToPlay}
          className="p-2 rounded-xl bg-slate-200/80 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300/50 dark:border-slate-700/50 active:scale-95 transition-all cursor-pointer"
          title="How to play"
          aria-label="How to play"
        >
          <HelpCircle size={16} />
        </button>
      </div>
    </div>
  );
};
