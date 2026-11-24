import { describe, it, expect } from 'vitest';
import { getTileStyle } from './tileColors';

describe('Tile Colors & Styling', () => {
  it('returns specific colors for required tiles', () => {
    // Light mode checks
    const tile2 = getTileStyle(2, false);
    expect(tile2.background).toBe('#eee4da');
    expect(tile2.color).toBe('#776e65');

    const tile4 = getTileStyle(4, false);
    expect(tile4.background).toBe('#ede0c8');

    const tile8 = getTileStyle(8, false);
    expect(tile8.background).toBe('#f2b179');
    expect(tile8.color).toBe('#f9f6f2');

    const tile16 = getTileStyle(16, false);
    expect(tile16.background).toBe('#f59563');

    const tile32 = getTileStyle(32, false);
    expect(tile32.background).toBe('#f67c5f');

    const tile64 = getTileStyle(64, false);
    expect(tile64.background).toBe('#f65e3b');

    const tile128 = getTileStyle(128, false);
    expect(tile128.background).toBe('#edcf72');

    const tile256 = getTileStyle(256, false);
    expect(tile256.background).toBe('#edcc61');

    const tile512 = getTileStyle(512, false);
    expect(tile512.background).toBe('#edc850');

    const tile1024 = getTileStyle(1024, false);
    expect(tile1024.background).toBe('#edc53f');

    const tile2048 = getTileStyle(2048, false);
    expect(tile2048.background).toContain('linear-gradient');
    expect(tile2048.isGoldenGlow).toBe(true);
    expect(tile2048.boxShadow).toBeDefined();

    // Higher numbers
    const tile4096 = getTileStyle(4096, false);
    expect(tile4096.background).toContain('#7c3aed');

    const tile8192 = getTileStyle(8192, false);
    expect(tile8192.background).toContain('#0284c7');
  });

  it('adjusts font size for multi-digit tiles so text does not overflow', () => {
    const singleDigit = getTileStyle(2, false);
    expect(singleDigit.fontSize).toContain('text-4xl');

    const threeDigit = getTileStyle(128, false);
    expect(threeDigit.fontSize).toContain('text-3xl');

    const fourDigit = getTileStyle(2048, false);
    expect(fourDigit.fontSize).toContain('text-2xl');

    const fiveDigit = getTileStyle(16384, false);
    expect(fiveDigit.fontSize).toContain('text-xl');
  });

  it('provides dark mode styling with higher contrast and glow', () => {
    const darkTile2 = getTileStyle(2, true);
    expect(darkTile2.color).toBe('#f8fafc');
    expect(darkTile2.background).toBe('#334155');

    const darkTile2048 = getTileStyle(2048, true);
    expect(darkTile2048.isGoldenGlow).toBe(true);
  });
});
