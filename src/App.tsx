import { useRef, useCallback } from 'react';
import { useSnakeGame } from './hooks/useSnakeGame';
import type { Direction, Difficulty } from './hooks/useSnakeGame';
import GameBoard from './components/GameBoard';

export default function App() {
  const {
    snake,
    food,
    gameStatus,
    score,
    highScore,
    difficulty,
    eatAnimation,
    gridSize,
    setDifficulty,
    resetGame,
    togglePause,
    changeDirection,
  } = useSnakeGame();

  // Touch/swipe controls
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    const minSwipe = 30;

    if (Math.abs(dx) < minSwipe && Math.abs(dy) < minSwipe) return;

    if (Math.abs(dx) > Math.abs(dy)) {
      changeDirection(dx > 0 ? 'RIGHT' : 'LEFT');
    } else {
      changeDirection(dy > 0 ? 'DOWN' : 'UP');
    }
    touchStartRef.current = null;
  }, [changeDirection]);

  const handleDirectionButton = useCallback((dir: Direction) => {
    if (gameStatus === 'idle' || gameStatus === 'gameover') {
      resetGame();
    }
    changeDirection(dir);
  }, [changeDirection, gameStatus, resetGame]);

  const difficulties: { value: Difficulty; label: string; emoji: string }[] = [
    { value: 'easy', label: 'Легко', emoji: '🟢' },
    { value: 'medium', label: 'Средне', emoji: '🟡' },
    { value: 'hard', label: 'Сложно', emoji: '🔴' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-white flex flex-col items-center justify-center p-4 select-none overflow-hidden">
      {/* Header */}
      <div className="w-full max-w-[500px] mb-3">
        <h1 className="text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
          🐍 Змейка
        </h1>
      </div>

      {/* Score Panel */}
      <div className="w-full max-w-[500px] flex justify-between items-center mb-3 px-1">
        <div className="flex flex-col items-center bg-white/5 backdrop-blur-sm rounded-xl px-5 py-2 border border-white/10">
          <span className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Счёт</span>
          <span className={`text-2xl font-bold text-green-400 transition-transform duration-200 ${eatAnimation ? 'scale-125' : 'scale-100'}`}>
            {score}
          </span>
        </div>
        <div className="flex flex-col items-center bg-white/5 backdrop-blur-sm rounded-xl px-5 py-2 border border-yellow-500/20">
          <span className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">🏆 Рекорд</span>
          <span className="text-2xl font-bold text-yellow-400">
            {highScore}
          </span>
        </div>
      </div>

      {/* Game Board */}
      <div
        className="w-full max-w-[500px] touch-none"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <GameBoard
          snake={snake}
          food={food}
          gridSize={gridSize}
          gameStatus={gameStatus}
          eatAnimation={eatAnimation}
        />
      </div>

      {/* Controls */}
      <div className="w-full max-w-[500px] mt-4 space-y-3">
        {/* Action Buttons */}
        <div className="flex gap-2 justify-center flex-wrap">
          {(gameStatus === 'idle' || gameStatus === 'gameover') && (
            <button
              onClick={resetGame}
              className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 rounded-xl font-semibold text-sm transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-green-500/25"
            >
              {gameStatus === 'gameover' ? '🔄 Заново' : '▶ Старт'}
            </button>
          )}
          {(gameStatus === 'playing' || gameStatus === 'paused') && (
            <>
              <button
                onClick={togglePause}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-400 hover:to-indigo-400 rounded-xl font-semibold text-sm transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/25"
              >
                {gameStatus === 'paused' ? '▶ Играть' : '⏸ Пауза'}
              </button>
              <button
                onClick={resetGame}
                className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 rounded-xl font-semibold text-sm transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-orange-500/25"
              >
                🔄 Заново
              </button>
            </>
          )}
        </div>

        {/* Difficulty Selector */}
        <div className="flex justify-center gap-2">
          {difficulties.map(d => (
            <button
              key={d.value}
              onClick={() => setDifficulty(d.value)}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                difficulty === d.value
                  ? 'bg-white/20 border border-white/30 text-white shadow-md scale-105'
                  : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              {d.emoji} {d.label}
            </button>
          ))}
        </div>

        {/* D-Pad for mobile */}
        <div className="flex justify-center md:hidden mt-2">
          <div className="grid grid-cols-3 gap-1.5 w-40">
            <div></div>
            <button
              onTouchStart={(e) => { e.preventDefault(); handleDirectionButton('UP'); }}
              className="w-12 h-12 bg-white/10 hover:bg-white/20 active:bg-green-500/30 rounded-xl flex items-center justify-center text-xl transition-all border border-white/10 active:border-green-400/50"
            >
              ↑
            </button>
            <div></div>
            <button
              onTouchStart={(e) => { e.preventDefault(); handleDirectionButton('LEFT'); }}
              className="w-12 h-12 bg-white/10 hover:bg-white/20 active:bg-green-500/30 rounded-xl flex items-center justify-center text-xl transition-all border border-white/10 active:border-green-400/50"
            >
              ←
            </button>
            <button
              onTouchStart={(e) => { e.preventDefault(); handleDirectionButton('DOWN'); }}
              className="w-12 h-12 bg-white/10 hover:bg-white/20 active:bg-green-500/30 rounded-xl flex items-center justify-center text-xl transition-all border border-white/10 active:border-green-400/50"
            >
              ↓
            </button>
            <button
              onTouchStart={(e) => { e.preventDefault(); handleDirectionButton('RIGHT'); }}
              className="w-12 h-12 bg-white/10 hover:bg-white/20 active:bg-green-500/30 rounded-xl flex items-center justify-center text-xl transition-all border border-white/10 active:border-green-400/50"
            >
              →
            </button>
          </div>
        </div>
      </div>

      {/* Footer hint */}
      <div className="mt-4 text-center text-xs text-gray-500 hidden md:block">
        <p>Стрелки / WASD — управление • Пробел — старт/пауза • Esc — пауза</p>
      </div>
      <div className="mt-2 text-center text-xs text-gray-500 md:hidden">
        <p>Свайп по полю или кнопки — управление</p>
      </div>
    </div>
  );
}
