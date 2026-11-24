import type { Direction, Tile } from '../types/game';

let tileCounter = 0;

export function generateTileId(): string {
  tileCounter += 1;
  return `tile-${tileCounter}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

/**
 * Returns a 4x4 matrix representation of tile values for easy inspection.
 */
export function getBoardMatrix(tiles: Tile[]): (Tile | null)[][] {
  const matrix: (Tile | null)[][] = Array(4)
    .fill(null)
    .map(() => Array(4).fill(null));

  for (const tile of tiles) {
    if (tile.row >= 0 && tile.row < 4 && tile.col >= 0 && tile.col < 4) {
      matrix[tile.row][tile.col] = tile;
    }
  }

  return matrix;
}

/**
 * Finds all empty (row, col) coordinates.
 */
export function getEmptyPositions(tiles: Tile[]): { row: number; col: number }[] {
  const occupied = new Set<string>();
  for (const tile of tiles) {
    occupied.add(`${tile.row},${tile.col}`);
  }

  const empty: { row: number; col: number }[] = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (!occupied.has(`${r},${c}`)) {
        empty.push({ row: r, col: c });
      }
    }
  }

  return empty;
}

/**
 * Spawns a new tile (90% chance of 2, 10% chance of 4) in a random empty position.
 */
export function spawnRandomTile(tiles: Tile[]): Tile | null {
  const empty = getEmptyPositions(tiles);
  if (empty.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * empty.length);
  const position = empty[randomIndex];
  const value = Math.random() < 0.9 ? 2 : 4;

  return {
    id: generateTileId(),
    value,
    row: position.row,
    col: position.col,
    isNew: true,
    isMerged: false,
  };
}

/**
 * Initializes a new board with 2 random tiles.
 */
export function initializeBoard(): Tile[] {
  const tile1 = spawnRandomTile([]);
  const initialTiles: Tile[] = tile1 ? [tile1] : [];
  const tile2 = spawnRandomTile(initialTiles);
  if (tile2) {
    initialTiles.push(tile2);
  }
  return initialTiles;
}

export interface MoveResult {
  tiles: Tile[];
  scoreGained: number;
  hasMoved: boolean;
  mergedCount: number;
}

/**
 * Executes a move in the given direction.
 * Returns the new tiles, score gained, whether anything moved, and merge count.
 */
export function moveBoard(currentTiles: Tile[], direction: Direction): MoveResult {
  // Clear transient animation flags before computing move
  const tiles: Tile[] = currentTiles.map((t) => ({
    ...t,
    isNew: false,
    isMerged: false,
    prevRow: t.row,
    prevCol: t.col,
  }));

  let hasMoved = false;
  let scoreGained = 0;
  let mergedCount = 0;

  // Process 4 lines (either 4 rows or 4 columns)
  const isHorizontal = direction === 'LEFT' || direction === 'RIGHT';
  const isForward = direction === 'RIGHT' || direction === 'DOWN';

  const newTiles: Tile[] = [];

  for (let lineIdx = 0; lineIdx < 4; lineIdx++) {
    // Collect all tiles on this line
    const lineTiles = tiles.filter((t) =>
      isHorizontal ? t.row === lineIdx : t.col === lineIdx
    );

    // Sort tiles along the line
    lineTiles.sort((a, b) => {
      const posA = isHorizontal ? a.col : a.row;
      const posB = isHorizontal ? b.col : b.row;
      return isForward ? posB - posA : posA - posB;
    });

    let targetIdx = isForward ? 3 : 0;
    const step = isForward ? -1 : 1;

    let i = 0;
    while (i < lineTiles.length) {
      const current = lineTiles[i];
      const next = i + 1 < lineTiles.length ? lineTiles[i + 1] : null;

      // Check if current tile can merge with next tile
      if (next && current.value === next.value) {
        const mergedValue = current.value * 2;
        scoreGained += mergedValue;
        mergedCount += 1;

        const destRow = isHorizontal ? lineIdx : targetIdx;
        const destCol = isHorizontal ? targetIdx : lineIdx;

        // Check if either tile moved
        if (
          current.row !== destRow ||
          current.col !== destCol ||
          next.row !== destRow ||
          next.col !== destCol
        ) {
          hasMoved = true;
        }

        // The merged tile inherits the ID of the leading tile or generates a new ID
        newTiles.push({
          id: generateTileId(),
          value: mergedValue,
          row: destRow,
          col: destCol,
          prevRow: current.row,
          prevCol: current.col,
          isMerged: true,
          isNew: false,
        });

        // Both original tiles are consumed
        targetIdx += step;
        i += 2;
      } else {
        const destRow = isHorizontal ? lineIdx : targetIdx;
        const destCol = isHorizontal ? targetIdx : lineIdx;

        if (current.row !== destRow || current.col !== destCol) {
          hasMoved = true;
        }

        newTiles.push({
          ...current,
          row: destRow,
          col: destCol,
          prevRow: current.row,
          prevCol: current.col,
          isMerged: false,
          isNew: false,
        });

        targetIdx += step;
        i += 1;
      }
    }
  }

  return {
    tiles: newTiles,
    scoreGained,
    hasMoved,
    mergedCount,
  };
}

/**
 * Checks if any valid move is possible on the current board.
 */
export function canMakeAnyMove(tiles: Tile[]): boolean {
  // If there are empty cells, moves are always possible
  if (tiles.length < 16) {
    return true;
  }

  const matrix: number[][] = Array(4)
    .fill(0)
    .map(() => Array(4).fill(0));

  for (const t of tiles) {
    if (t.row >= 0 && t.row < 4 && t.col >= 0 && t.col < 4) {
      matrix[t.row][t.col] = t.value;
    }
  }

  // Check adjacent cells horizontally and vertically
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const val = matrix[r][c];
      if (val === 0) return true;

      // Check right neighbor
      if (c < 3 && matrix[r][c + 1] === val) return true;
      // Check bottom neighbor
      if (r < 3 && matrix[r + 1][c] === val) return true;
    }
  }

  return false;
}

/**
 * Checks if any tile reached 2048 or higher.
 */
export function hasWinningTile(tiles: Tile[]): boolean {
  return tiles.some((t) => t.value >= 2048);
}
