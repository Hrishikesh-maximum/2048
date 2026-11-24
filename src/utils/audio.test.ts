import { describe, it, expect } from 'vitest';
import { soundManager } from './audio';

describe('SoundManager', () => {
  it('toggles muted state properly', () => {
    soundManager.setMuted(true);
    expect(soundManager.getMuted()).toBe(true);

    soundManager.setMuted(false);
    expect(soundManager.getMuted()).toBe(false);
  });

  it('safely handles play methods in test/headless environments without errors', () => {
    expect(() => soundManager.playMove()).not.toThrow();
    expect(() => soundManager.playMerge(8)).not.toThrow();
    expect(() => soundManager.playWin()).not.toThrow();
    expect(() => soundManager.playGameOver()).not.toThrow();
    expect(() => soundManager.playClick()).not.toThrow();
  });
});
