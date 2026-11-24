import React from 'react';
import {
  Trophy,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  HelpCircle,
  X,
  Play,
} from 'lucide-react';

interface ModalWrapperProps {
  isOpen: boolean;
  onClose?: () => void;
  children: React.ReactNode;
}

const ModalWrapper: React.FC<ModalWrapperProps> = ({ isOpen, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm sm:max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 dark:border-slate-800 transform transition-all scale-100 animate-in zoom-in-95 duration-200">
        {children}
      </div>
    </div>
  );
};

// 1. Confirm Restart Modal
interface ConfirmRestartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ConfirmRestartModal: React.FC<ConfirmRestartModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose}>
      <div className="text-center">
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/20 flex items-center justify-center text-amber-500 dark:text-amber-400">
          <AlertTriangle size={28} />
        </div>
        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
          Restart Game?
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          Are you sure you want to restart? Your current score and tile progress will be reset.
        </p>

        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 py-2.5 px-4 rounded-xl font-bold text-white bg-amber-500 hover:bg-amber-600 shadow-md transition cursor-pointer"
          >
            Restart
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
};

// 2. How to Play Modal
interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose }) => {
  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose}>
      <div>
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-amber-500 dark:text-amber-400">
            <HelpCircle size={22} />
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              How to Play
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
          <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold shrink-0">
              1
            </div>
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-100 mb-0.5">
                Controls & Movement
              </p>
              <p>
                Use your <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 font-mono text-xs">Arrow Keys</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 font-mono text-xs">WASD</kbd> on desktop. On mobile or touch devices, simply <span className="font-semibold text-amber-500">swipe</span> in any direction.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold shrink-0">
              2
            </div>
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-100 mb-0.5">
                Merging Tiles
              </p>
              <p>
                When two tiles with the same number collide, they merge into one with double the value!
                (e.g. <span className="font-bold">2 + 2 = 4</span>, <span className="font-bold">4 + 4 = 8</span>, ..., <span className="font-bold">1024 + 1024 = 2048</span>).
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold shrink-0">
              3
            </div>
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-100 mb-0.5">
                Win & Endless Mode
              </p>
              <p>
                Create the <span className="font-bold text-amber-500">2048 tile</span> to win! You can choose to keep playing to chase 4096, 8192, and beyond. Made a bad move? Use <span className="font-semibold">Undo</span> anytime!
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl font-bold text-white bg-amber-500 hover:bg-amber-600 shadow-md transition cursor-pointer"
        >
          Got It, Let's Play!
        </button>
      </div>
    </ModalWrapper>
  );
};

// 3. Victory Modal
interface VictoryModalProps {
  isOpen: boolean;
  score: number;
  moves: number;
  timer: number;
  onContinue: () => void;
  onNewGame: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  isOpen,
  score,
  moves,
  timer,
  onContinue,
  onNewGame,
}) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <ModalWrapper isOpen={isOpen}>
      <div className="text-center">
        {/* Glow Trophy Icon */}
        <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-white shadow-lg shadow-amber-500/40 animate-bounce">
          <Trophy size={32} />
        </div>

        <h3 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-yellow-400 mb-1">
          You Reached 2048!
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
          Brilliant job! You mastered the board and unlocked the legendary 2048 tile!
        </p>

        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
            <span className="block text-[10px] font-bold text-slate-400 uppercase">Score</span>
            <span className="text-lg font-black text-amber-500">{score}</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
            <span className="block text-[10px] font-bold text-slate-400 uppercase">Moves</span>
            <span className="text-lg font-black text-slate-700 dark:text-slate-200">{moves}</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
            <span className="block text-[10px] font-bold text-slate-400 uppercase">Time</span>
            <span className="text-lg font-black text-slate-700 dark:text-slate-200 font-mono">
              {formatTime(timer)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={onContinue}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 shadow-md active:scale-95 transition cursor-pointer flex items-center justify-center gap-2"
          >
            <Play size={16} />
            <span>Keep Playing</span>
          </button>
          <button
            onClick={onNewGame}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 active:scale-95 transition cursor-pointer flex items-center justify-center gap-2"
          >
            <Sparkles size={16} />
            <span>New Game</span>
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
};

// 4. Game Over Modal
interface GameOverModalProps {
  isOpen: boolean;
  score: number;
  bestScore: number;
  moves: number;
  timer: number;
  canUndo: boolean;
  onUndo: () => void;
  onNewGame: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  score,
  bestScore,
  moves,
  timer,
  canUndo,
  onUndo,
  onNewGame,
}) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <ModalWrapper isOpen={isOpen}>
      <div className="text-center">
        <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-red-500/10 text-red-500 border border-red-500/20 flex items-center justify-center">
          <AlertTriangle size={28} />
        </div>

        <h3 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mb-1">
          Game Over!
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
          No valid moves left on the board.
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2 mb-6">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-left">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Final Score</span>
            <span className="block text-xl font-black text-slate-800 dark:text-slate-100">
              {score}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-left">
            <span className="text-[10px] font-bold text-amber-500 uppercase">Best Score</span>
            <span className="block text-xl font-black text-amber-500">{bestScore}</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-left flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400">Total Moves</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{moves}</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-left flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400">Time Taken</span>
            <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
              {formatTime(timer)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          <button
            onClick={onNewGame}
            className="w-full py-3 px-4 rounded-xl font-bold text-white bg-amber-500 hover:bg-amber-600 shadow-md active:scale-95 transition cursor-pointer flex items-center justify-center gap-2"
          >
            <Sparkles size={16} />
            <span>Try Again</span>
          </button>

          {canUndo && (
            <button
              onClick={onUndo}
              className="w-full py-2.5 px-4 rounded-xl font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 active:scale-95 transition cursor-pointer flex items-center justify-center gap-2"
            >
              <RotateCcw size={15} />
              <span>Undo Last Move & Continue</span>
            </button>
          )}
        </div>
      </div>
    </ModalWrapper>
  );
};
