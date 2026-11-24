import React from 'react';
import type { Tile } from '../types/game';
import { getTileStyle } from '../utils/tileColors';

interface TileViewProps {
  tile: Tile;
  isDark: boolean;
}

export const TileView: React.FC<TileViewProps> = React.memo(({ tile, isDark }) => {
  const styleInfo = getTileStyle(tile.value, isDark);

  // Exact percentage positions matching 2.5% gap and 23.125% cell size
  const leftPercent = tile.col * 25.625;
  const topPercent = tile.row * 25.625;

  let animationClass = '';
  if (tile.isNew) {
    animationClass = 'animate-tile-spawn';
  } else if (tile.isMerged) {
    animationClass = 'animate-tile-merge';
  }

  const celebrationClass = styleInfo.isGoldenGlow ? 'animate-celebrate' : '';

  return (
    <div
      className={`absolute flex items-center justify-center rounded-xl font-bold select-none transition-all duration-150 ease-out will-change-transform ${animationClass} ${celebrationClass}`}
      style={{
        left: `${leftPercent}%`,
        top: `${topPercent}%`,
        width: '23.125%',
        height: '23.125%',
        background: styleInfo.background,
        color: styleInfo.color,
        boxShadow: styleInfo.boxShadow,
      }}
    >
      <span className={`${styleInfo.fontSize} leading-none drop-shadow-sm`}>
        {tile.value}
      </span>
    </div>
  );
});
