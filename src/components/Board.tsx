import React, { useRef, useEffect } from 'react';
import type { Tile, Direction } from '../types/game';
import { TileView } from './TileView';

interface BoardProps {
  tiles: Tile[];
  isDark: boolean;
  onMove: (direction: Direction) => void;
}

export const Board: React.FC<BoardProps> = ({ tiles, isDark, onMove }) => {
  const boardRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  // Handle touch gestures for mobile swipe
  useEffect(() => {
    const boardEl = boardRef.current;
    if (!boardEl) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    };

    const handleTouchMove = (e: TouchEvent) => {
      // Prevent scrolling when swiping on the board
      if (touchStartRef.current) {
        e.preventDefault();
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartRef.current) return;
      const touchEnd = e.changedTouches[0];
      const deltaX = touchEnd.clientX - touchStartRef.current.x;
      const deltaY = touchEnd.clientY - touchStartRef.current.y;
      touchStartRef.current = null;

      const minSwipeDistance = 35; // px

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (Math.abs(deltaX) > minSwipeDistance) {
          onMove(deltaX > 0 ? 'RIGHT' : 'LEFT');
        }
      } else {
        if (Math.abs(deltaY) > minSwipeDistance) {
          onMove(deltaY > 0 ? 'DOWN' : 'UP');
        }
      }
    };

    // Attach with passive: false so we can preventDefault touch movements
    boardEl.addEventListener('touchstart', handleTouchStart, { passive: true });
    boardEl.addEventListener('touchmove', handleTouchMove, { passive: false });
    boardEl.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      boardEl.removeEventListener('touchstart', handleTouchStart);
      boardEl.removeEventListener('touchmove', handleTouchMove);
      boardEl.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onMove]);

  return (
    <div className="w-full max-w-[480px] mx-auto select-none touch-none">
      <div
        ref={boardRef}
        className="w-full aspect-square relative rounded-2xl p-[3%] bg-[#bbada0] dark:bg-[#1e293b] shadow-2xl border border-black/10 dark:border-slate-700/60 transition-colors duration-300"
      >
        {/* Background Grid Cells (4x4 = 16 cells) */}
        <div className="w-full h-full grid grid-cols-4 grid-rows-4 gap-[2.5%]">
          {Array.from({ length: 16 }).map((_, index) => (
            <div
              key={`bg-cell-${index}`}
              className="w-full h-full rounded-xl bg-[#cdc1b4]/60 dark:bg-slate-800/80 shadow-inner transition-colors duration-300"
            />
          ))}
        </div>

        {/* Dynamic Interactive Tiles Layer */}
        <div className="absolute inset-[3%] pointer-events-none">
          {tiles.map((tile) => (
            <TileView key={tile.id} tile={tile} isDark={isDark} />
          ))}
        </div>
      </div>
    </div>
  );
};
