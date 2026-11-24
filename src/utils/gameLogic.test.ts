import { describe, it, expect } from 'vitest';
import {
  initializeBoard,
  spawnRandomTile,
  moveBoard,
  canMakeAnyMove,
  hasWinningTile,
  getBoardMatrix,
} from './gameLogic';
import type { Tile } from '../types/game';

describe('2048 Game Logic Engine', () => {
  it('initializeBoard creates 2 tiles with value 2 or 4', () => {
    const tiles = initializeBoard();
    expect(tiles.length).toBe(2);
    for (const tile of tiles) {
      expect([2, 4]).toContain(tile.value);
      expect(tile.row).toBeGreaterThanOrEqual(0);
      expect(tile.row).toBeLessThan(4);
      expect(tile.col).toBeGreaterThanOrEqual(0);
      expect(tile.col).toBeLessThan(4);
    }
    // Tiles must not overlap
    expect(tiles[0].row === tiles[1].row && tiles[0].col === tiles[1].col).toBe(false);
  });

  it('spawns tile in available empty cells only', () => {
    // Fill 15 cells
    const tiles: Tile[] = [];
    let count = 0;
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (r === 3 && c === 3) continue; // leave (3,3) empty
        tiles.push({
          id: `t-${count++}`,
          value: 2,
          row: r,
          col: c,
        });
      }
    }
    const spawned = spawnRandomTile(tiles);
    expect(spawned).not.toBeNull();
    expect(spawned?.row).toBe(3);
    expect(spawned?.col).toBe(3);
  });

  it('correctly shifts tiles LEFT and merges adjacent matching values', () => {
    const tiles: Tile[] = [
      { id: '1', value: 2, row: 0, col: 0 },
      { id: '2', value: 2, row: 0, col: 1 },
      { id: '3', value: 4, row: 0, col: 2 },
      { id: '4', value: 8, row: 0, col: 3 },
    ];

    const result = moveBoard(tiles, 'LEFT');
    expect(result.hasMoved).toBe(true);
    expect(result.scoreGained).toBe(4);
    expect(result.mergedCount).toBe(1);

    const matrix = getBoardMatrix(result.tiles);
    expect(matrix[0][0]?.value).toBe(4);
    expect(matrix[0][1]?.value).toBe(4);
    expect(matrix[0][2]?.value).toBe(8);
    expect(matrix[0][3]).toBeNull();
  });

  it('merges [2, 2, 2, 2] into [4, 4, 0, 0] on LEFT move (single merge per tile rule)', () => {
    const tiles: Tile[] = [
      { id: '1', value: 2, row: 1, col: 0 },
      { id: '2', value: 2, row: 1, col: 1 },
      { id: '3', value: 2, row: 1, col: 2 },
      { id: '4', value: 2, row: 1, col: 3 },
    ];

    const result = moveBoard(tiles, 'LEFT');
    expect(result.hasMoved).toBe(true);
    expect(result.scoreGained).toBe(8); // 4 + 4
    expect(result.mergedCount).toBe(2);

    const matrix = getBoardMatrix(result.tiles);
    expect(matrix[1][0]?.value).toBe(4);
    expect(matrix[1][1]?.value).toBe(4);
    expect(matrix[1][2]).toBeNull();
    expect(matrix[1][3]).toBeNull();
  });

  it('merges [4, 2, 2] into [4, 4, 0] on LEFT move', () => {
    const tiles: Tile[] = [
      { id: '1', value: 4, row: 2, col: 0 },
      { id: '2', value: 2, row: 2, col: 1 },
      { id: '3', value: 2, row: 2, col: 2 },
    ];

    const result = moveBoard(tiles, 'LEFT');
    expect(result.hasMoved).toBe(true);
    expect(result.scoreGained).toBe(4);

    const matrix = getBoardMatrix(result.tiles);
    expect(matrix[2][0]?.value).toBe(4);
    expect(matrix[2][1]?.value).toBe(4);
    expect(matrix[2][2]).toBeNull();
  });

  it('correctly shifts tiles RIGHT across empty spaces', () => {
    const tiles: Tile[] = [
      { id: '1', value: 2, row: 0, col: 0 },
      { id: '2', value: 2, row: 0, col: 2 },
    ];

    const result = moveBoard(tiles, 'RIGHT');
    expect(result.hasMoved).toBe(true);
    expect(result.scoreGained).toBe(4);

    const matrix = getBoardMatrix(result.tiles);
    expect(matrix[0][3]?.value).toBe(4);
    expect(matrix[0][0]).toBeNull();
    expect(matrix[0][1]).toBeNull();
    expect(matrix[0][2]).toBeNull();
  });

  it('correctly shifts UP and DOWN', () => {
    const tiles: Tile[] = [
      { id: '1', value: 2, row: 0, col: 0 },
      { id: '2', value: 2, row: 2, col: 0 },
    ];

    // Move DOWN
    const downResult = moveBoard(tiles, 'DOWN');
    expect(downResult.hasMoved).toBe(true);
    expect(downResult.scoreGained).toBe(4);
    const downMatrix = getBoardMatrix(downResult.tiles);
    expect(downMatrix[3][0]?.value).toBe(4);

    // Move UP
    const upResult = moveBoard(tiles, 'UP');
    expect(upResult.hasMoved).toBe(true);
    expect(upResult.scoreGained).toBe(4);
    const upMatrix = getBoardMatrix(upResult.tiles);
    expect(upMatrix[0][0]?.value).toBe(4);
  });

  it('detects invalid moves (no movement, no merges) and prevents state changes', () => {
    const tiles: Tile[] = [
      { id: '1', value: 2, row: 0, col: 0 },
      { id: '2', value: 4, row: 0, col: 1 },
      { id: '3', value: 8, row: 0, col: 2 },
      { id: '4', value: 16, row: 0, col: 3 },
    ];

    const result = moveBoard(tiles, 'LEFT');
    expect(result.hasMoved).toBe(false);
    expect(result.scoreGained).toBe(0);
    expect(result.mergedCount).toBe(0);
  });

  it('detects 2048 victory condition', () => {
    const tilesBelow: Tile[] = [
      { id: '1', value: 1024, row: 0, col: 0 },
      { id: '2', value: 512, row: 0, col: 1 },
    ];
    expect(hasWinningTile(tilesBelow)).toBe(false);

    const tilesWin: Tile[] = [
      { id: '1', value: 2048, row: 0, col: 0 },
      { id: '2', value: 512, row: 0, col: 1 },
    ];
    expect(hasWinningTile(tilesWin)).toBe(true);
  });

  it('canMakeAnyMove correctly detects game over when full with no merges', () => {
    // Board is checkerboard pattern where no two adjacent tiles have same value
    const fullGrid: Tile[] = [];
    const values = [
      [2, 4, 2, 4],
      [4, 2, 4, 2],
      [2, 4, 2, 4],
      [4, 2, 4, 2],
    ];
    let id = 0;
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        fullGrid.push({ id: `t-${id++}`, value: values[r][c], row: r, col: c });
      }
    }
    expect(canMakeAnyMove(fullGrid)).toBe(false);

    // If one adjacent pair matches, move is possible
    fullGrid[0].value = 4; // now (0,0) is 4 and (0,1) is 4
    expect(canMakeAnyMove(fullGrid)).toBe(true);
  });

  it('canMakeAnyMove returns true if board is not full', () => {
    const tiles: Tile[] = [
      { id: '1', value: 2, row: 0, col: 0 },
      { id: '2', value: 4, row: 1, col: 1 },
    ];
    expect(canMakeAnyMove(tiles)).toBe(true);
  });
});
