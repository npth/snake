import { useState, useEffect, useCallback, useRef } from 'react';

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
export type Position = { x: number; y: number };
export type Difficulty = 'easy' | 'medium' | 'hard';
export type GameStatus = 'idle' | 'playing' | 'paused' | 'gameover';

const GRID_SIZE = 20;
const SPEED_MAP: Record<Difficulty, number> = {
  easy: 150,
  medium: 100,
  hard: 60,
};

function getRandomPosition(snake: Position[]): Position {
  let pos: Position;
  do {
    pos = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  } while (snake.some(seg => seg.x === pos.x && seg.y === pos.y));
  return pos;
}

function getInitialSnake(): Position[] {
  const mid = Math.floor(GRID_SIZE / 2);
  return [
    { x: mid, y: mid },
    { x: mid - 1, y: mid },
    { x: mid - 2, y: mid },
  ];
}

export function useSnakeGame() {
  const [snake, setSnake] = useState<Position[]>(getInitialSnake());
  const [food, setFood] = useState<Position>(() => getRandomPosition(getInitialSnake()));
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [gameStatus, setGameStatus] = useState<GameStatus>('idle');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('snake-high-score');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [eatAnimation, setEatAnimation] = useState(false);

  const directionRef = useRef<Direction>(direction);
  const snakeRef = useRef<Position[]>(snake);
  const foodRef = useRef<Position>(food);
  const gameLoopRef = useRef<number | null>(null);

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  useEffect(() => {
    snakeRef.current = snake;
  }, [snake]);

  useEffect(() => {
    foodRef.current = food;
  }, [food]);

  const resetGame = useCallback(() => {
    const initialSnake = getInitialSnake();
    setSnake(initialSnake);
    snakeRef.current = initialSnake;
    const newFood = getRandomPosition(initialSnake);
    setFood(newFood);
    foodRef.current = newFood;
    setDirection('RIGHT');
    directionRef.current = 'RIGHT';
    setScore(0);
    setGameStatus('playing');
  }, []);

  const togglePause = useCallback(() => {
    setGameStatus(prev => {
      if (prev === 'playing') return 'paused';
      if (prev === 'paused') return 'playing';
      return prev;
    });
  }, []);

  const changeDirection = useCallback((newDir: Direction) => {
    const opposites: Record<Direction, Direction> = {
      UP: 'DOWN',
      DOWN: 'UP',
      LEFT: 'RIGHT',
      RIGHT: 'LEFT',
    };
    if (opposites[newDir] !== directionRef.current) {
      setDirection(newDir);
      directionRef.current = newDir;
    }
  }, []);

  const moveSnake = useCallback(() => {
    const currentSnake = snakeRef.current;
    const currentFood = foodRef.current;
    const dir = directionRef.current;

    const head = { ...currentSnake[0] };

    switch (dir) {
      case 'UP': head.y -= 1; break;
      case 'DOWN': head.y += 1; break;
      case 'LEFT': head.x -= 1; break;
      case 'RIGHT': head.x += 1; break;
    }

    // Check wall collision
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      setGameStatus('gameover');
      return;
    }

    // Check self collision (exclude tail since it will move)
    const bodyToCheck = currentSnake.slice(0, -1);
    if (bodyToCheck.some(seg => seg.x === head.x && seg.y === head.y)) {
      setGameStatus('gameover');
      return;
    }

    const newSnake = [head, ...currentSnake];

    // Check food collision
    if (head.x === currentFood.x && head.y === currentFood.y) {
      // Snake grows - don't remove tail
      setSnake(newSnake);
      snakeRef.current = newSnake;
      
      const newFood = getRandomPosition(newSnake);
      setFood(newFood);
      foodRef.current = newFood;

      setScore(prev => {
        const newScore = prev + 10;
        setHighScore(hs => {
          const newHigh = Math.max(hs, newScore);
          localStorage.setItem('snake-high-score', String(newHigh));
          return newHigh;
        });
        return newScore;
      });

      setEatAnimation(true);
      setTimeout(() => setEatAnimation(false), 300);
    } else {
      // Remove tail
      const movedSnake = newSnake.slice(0, -1);
      setSnake(movedSnake);
      snakeRef.current = movedSnake;
    }
  }, []);

  // Game loop
  useEffect(() => {
    if (gameStatus === 'playing') {
      const speed = SPEED_MAP[difficulty];
      gameLoopRef.current = window.setInterval(moveSnake, speed);
    } else if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
      gameLoopRef.current = null;
    }
    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameStatus, difficulty, moveSnake]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          if (gameStatus === 'playing') changeDirection('UP');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          if (gameStatus === 'playing') changeDirection('DOWN');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          if (gameStatus === 'playing') changeDirection('LEFT');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          if (gameStatus === 'playing') changeDirection('RIGHT');
          break;
        case ' ':
          e.preventDefault();
          if (gameStatus === 'idle' || gameStatus === 'gameover') {
            resetGame();
          } else {
            togglePause();
          }
          break;
        case 'Escape':
          e.preventDefault();
          if (gameStatus === 'playing' || gameStatus === 'paused') {
            togglePause();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [changeDirection, gameStatus, resetGame, togglePause]);

  return {
    snake,
    food,
    direction,
    gameStatus,
    score,
    highScore,
    difficulty,
    eatAnimation,
    gridSize: GRID_SIZE,
    setDifficulty,
    resetGame,
    togglePause,
    changeDirection,
  };
}
