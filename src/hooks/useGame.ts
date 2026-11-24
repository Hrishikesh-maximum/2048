import { useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import type { Direction, GameState, SavedGameState, ScorePopup } from '../types/game';
import {
  initializeBoard,
  moveBoard,
  spawnRandomTile,
  canMakeAnyMove,
  hasWinningTile,
} from '../utils/gameLogic';
import { soundManager } from '../utils/audio';

const STORAGE_KEY_BEST = '2048_best_score';
const STORAGE_KEY_STATE = '2048_game_state';

export function useGame(soundEnabled: boolean) {
  // Sound manager sync
  useEffect(() => {
    soundManager.setMuted(!soundEnabled);
  }, [soundEnabled]);

  // Load best score from localStorage
  const [bestScore, setBestScore] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BEST);
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  // Load saved game or initialize fresh game
  const [gameState, setGameState] = useState<GameState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STATE);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.tiles) && parsed.tiles.length > 0) {
          return {
            tiles: parsed.tiles,
            score: parsed.score || 0,
            bestScore: parsed.bestScore || 0,
            moves: parsed.moves || 0,
            timer: parsed.timer || 0,
            isGameOver: parsed.isGameOver || false,
            hasWon: parsed.hasWon || false,
            hasContinued: parsed.hasContinued || false,
            history: parsed.history || [],
          };
        }
      }
    } catch (e) {
      console.error('Failed to load saved game state', e);
    }

    const initialTiles = initializeBoard();
    return {
      tiles: initialTiles,
      score: 0,
      bestScore: 0,
      moves: 0,
      timer: 0,
      isGameOver: false,
      hasWon: false,
      hasContinued: false,
      history: [],
    };
  });

  const [scorePopups, setScorePopups] = useState<ScorePopup[]>([]);
  const isMovingRef = useRef(false);

  // Timer interval: increments every second if game is active and not over
  useEffect(() => {
    if (gameState.isGameOver || (gameState.hasWon && !gameState.hasContinued)) {
      return;
    }

    const interval = setInterval(() => {
      setGameState((prev) => {
        // Only run timer if player has made at least one move or game is started
        if (prev.moves === 0 && prev.timer === 0) return prev;
        return {
          ...prev,
          timer: prev.timer + 1,
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState.isGameOver, gameState.hasWon, gameState.hasContinued]);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY_STATE,
        JSON.stringify({
          tiles: gameState.tiles,
          score: gameState.score,
          moves: gameState.moves,
          timer: gameState.timer,
          isGameOver: gameState.isGameOver,
          hasWon: gameState.hasWon,
          hasContinued: gameState.hasContinued,
          history: gameState.history.slice(-5), // keep last 5 moves
        })
      );
    } catch (e) {
      console.error('Failed to save game state', e);
    }
  }, [gameState]);

  // Update best score
  useEffect(() => {
    if (gameState.score > bestScore) {
      setBestScore(gameState.score);
      try {
        localStorage.setItem(STORAGE_KEY_BEST, gameState.score.toString());
      } catch (e) {
        console.error('Failed to save best score', e);
      }
    }
  }, [gameState.score, bestScore]);

  // Handle a move in a given direction
  const handleMove = useCallback(
    (direction: Direction) => {
      if (isMovingRef.current) return;
      if (gameState.isGameOver) return;
      // If won and hasn't chosen to continue, block moves until decision
      if (gameState.hasWon && !gameState.hasContinued) return;

      const result = moveBoard(gameState.tiles, direction);

      if (!result.hasMoved) {
        // Invalid move: do not generate tile, do not increase moves
        return;
      }

      isMovingRef.current = true;

      // Play move or merge sound
      if (result.mergedCount > 0) {
        // Find highest merged tile
        const highestVal = result.tiles.reduce((max, t) => (t.isMerged && t.value > max ? t.value : max), 0);
        soundManager.playMerge(highestVal || 4);
      } else {
        soundManager.playMove();
      }

      // Add score popup if score gained
      if (result.scoreGained > 0) {
        const popupId = `score-${Date.now()}-${Math.random()}`;
        setScorePopups((prev) => [...prev, { id: popupId, value: result.scoreGained }]);
        setTimeout(() => {
          setScorePopups((prev) => prev.filter((p) => p.id !== popupId));
        }, 800);
      }

      // Save previous state for undo (up to 5 steps back)
      const previousStateSnapshot: SavedGameState = {
        tiles: gameState.tiles,
        score: gameState.score,
        moves: gameState.moves,
      };

      const newScore = gameState.score + result.scoreGained;
      const newMoves = gameState.moves + 1;

      // Spawn new tile after a tiny delay for visual flow
      setTimeout(() => {
        const spawnedTile = spawnRandomTile(result.tiles);
        const updatedTiles = spawnedTile ? [...result.tiles, spawnedTile] : result.tiles;

        const won = !gameState.hasWon && !gameState.hasContinued && hasWinningTile(updatedTiles);
        const gameOver = !canMakeAnyMove(updatedTiles);

        if (won) {
          soundManager.playWin();
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.5 },
            colors: ['#f59e0b', '#fbbf24', '#fcd34d', '#ea580c', '#38bdf8'],
          });
        } else if (gameOver) {
          soundManager.playGameOver();
        }

        setGameState((prev) => ({
          ...prev,
          tiles: updatedTiles,
          score: newScore,
          moves: newMoves,
          isGameOver: gameOver,
          hasWon: won ? true : prev.hasWon,
          history: [...prev.history.slice(-4), previousStateSnapshot],
        }));

        isMovingRef.current = false;
      }, 110);
    },
    [gameState]
  );

  // Undo Last Move
  const undoLastMove = useCallback(() => {
    if (gameState.history.length === 0) return;

    soundManager.playClick();
    const lastHistory = gameState.history[gameState.history.length - 1];
    const newHistory = gameState.history.slice(0, -1);

    setGameState((prev) => ({
      ...prev,
      tiles: lastHistory.tiles,
      score: lastHistory.score,
      moves: lastHistory.moves,
      isGameOver: false,
      history: newHistory,
    }));
  }, [gameState.history]);

  // Restart / New Game
  const resetGame = useCallback(() => {
    soundManager.playClick();
    const freshTiles = initializeBoard();
    setGameState({
      tiles: freshTiles,
      score: 0,
      bestScore,
      moves: 0,
      timer: 0,
      isGameOver: false,
      hasWon: false,
      hasContinued: false,
      history: [],
    });
    setScorePopups([]);
  }, [bestScore]);

  // Continue playing after reaching 2048
  const continuePlaying = useCallback(() => {
    soundManager.playClick();
    setGameState((prev) => ({
      ...prev,
      hasContinued: true,
    }));
  }, []);

  return {
    gameState,
    bestScore,
    scorePopups,
    handleMove,
    undoLastMove,
    resetGame,
    continuePlaying,
    canUndo: gameState.history.length > 0,
  };
}
