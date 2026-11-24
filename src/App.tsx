import React, { useState, useEffect, useCallback } from 'react';
import { useGame } from './hooks/useGame';
import type { Direction } from './types/game';
import { Header } from './components/Header';
import { Controls } from './components/Controls';
import { Board } from './components/Board';
import {
  ConfirmRestartModal,
  HowToPlayModal,
  VictoryModal,
  GameOverModal,
} from './components/Modals';

const STORAGE_KEY_THEME = '2048_theme';
const STORAGE_KEY_SOUND = '2048_sound_enabled';

export const App: React.FC = () => {
  // Theme state (light / dark)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_THEME);
      if (saved === 'light' || saved === 'dark') return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch {
      return 'dark';
    }
  });

  // Sound toggle state
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SOUND);
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });

  // Modals state
  const [isConfirmRestartOpen, setIsConfirmRestartOpen] = useState(false);
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);

  // Sync theme class to document element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem(STORAGE_KEY_THEME, theme);
    } catch (e) {
      console.error('Failed to save theme', e);
    }
  }, [theme]);

  // Sync sound toggle to storage
  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY_SOUND, next.toString());
      } catch (e) {
        console.error('Failed to save sound preference', e);
      }
      return next;
    });
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  // Main game hook
  const {
    gameState,
    bestScore,
    scorePopups,
    handleMove,
    undoLastMove,
    resetGame,
    continuePlaying,
    canUndo,
  } = useGame(soundEnabled);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept keys if user is typing or if modals are open
      if (isConfirmRestartOpen || isHowToPlayOpen) {
        if (e.key === 'Escape') {
          setIsConfirmRestartOpen(false);
          setIsHowToPlayOpen(false);
        }
        return;
      }

      let direction: Direction | null = null;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          direction = 'UP';
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          direction = 'DOWN';
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          direction = 'LEFT';
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          direction = 'RIGHT';
          break;
        case 'z':
        case 'Z':
          if ((e.ctrlKey || e.metaKey) && canUndo) {
            e.preventDefault();
            undoLastMove();
            return;
          }
          break;
        default:
          return;
      }

      if (direction) {
        e.preventDefault(); // Prevent page scrolling with arrow keys
        handleMove(direction);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleMove, undoLastMove, canUndo, isConfirmRestartOpen, isHowToPlayOpen]);

  // Handle restart button click
  const handleRestartClick = useCallback(() => {
    if (gameState.score > 0 || gameState.moves > 0) {
      setIsConfirmRestartOpen(true);
    } else {
      resetGame();
    }
  }, [gameState.score, gameState.moves, resetGame]);

  // Handle New Game button click
  const handleNewGameClick = useCallback(() => {
    if (gameState.score > 0 || gameState.moves > 0) {
      setIsConfirmRestartOpen(true);
    } else {
      resetGame();
    }
  }, [gameState.score, gameState.moves, resetGame]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-3 sm:p-6 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <div className="w-full max-w-[480px] flex flex-col items-center">
        {/* Game Header */}
        <Header
          score={gameState.score}
          bestScore={bestScore}
          moves={gameState.moves}
          timer={gameState.timer}
          scorePopups={scorePopups}
        />

        {/* Controls Bar */}
        <Controls
          onNewGame={handleNewGameClick}
          onRestartClick={handleRestartClick}
          onUndo={undoLastMove}
          canUndo={canUndo}
          onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
          soundEnabled={soundEnabled}
          onToggleSound={toggleSound}
          theme={theme}
          onToggleTheme={toggleTheme}
        />

        {/* 2048 Game Board */}
        <Board
          tiles={gameState.tiles}
          isDark={theme === 'dark'}
          onMove={handleMove}
        />

        {/* Helper instructions */}
        <div className="w-full max-w-[480px] mt-4 text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Swipe on screen or use <span className="font-semibold text-slate-700 dark:text-slate-300">Arrow Keys / WASD</span> to slide and merge tiles.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-8 mb-2 text-center text-xs text-slate-400 dark:text-slate-600">
        <p>Classic 2048 Number Puzzle • Built with React, TypeScript & Tailwind CSS</p>
      </footer>

      {/* Modals */}
      <ConfirmRestartModal
        isOpen={isConfirmRestartOpen}
        onClose={() => setIsConfirmRestartOpen(false)}
        onConfirm={resetGame}
      />

      <HowToPlayModal
        isOpen={isHowToPlayOpen}
        onClose={() => setIsHowToPlayOpen(false)}
      />

      <VictoryModal
        isOpen={gameState.hasWon && !gameState.hasContinued}
        score={gameState.score}
        moves={gameState.moves}
        timer={gameState.timer}
        onContinue={continuePlaying}
        onNewGame={resetGame}
      />

      <GameOverModal
        isOpen={gameState.isGameOver}
        score={gameState.score}
        bestScore={bestScore}
        moves={gameState.moves}
        timer={gameState.timer}
        canUndo={canUndo}
        onUndo={undoLastMove}
        onNewGame={resetGame}
      />
    </div>
  );
};

export default App;
