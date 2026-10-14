import { useRef, useEffect, useCallback } from 'react';
import type { Position, GameStatus } from '../hooks/useSnakeGame';

interface GameBoardProps {
  snake: Position[];
  food: Position;
  gridSize: number;
  gameStatus: GameStatus;
  eatAnimation: boolean;
}

export default function GameBoard({ snake, food, gridSize, gameStatus, eatAnimation }: GameBoardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const sizeRef = useRef<number>(400);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = sizeRef.current;
    canvas.width = size;
    canvas.height = size;
    const cellSize = size / gridSize;

    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    // Draw grid background
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, size, size);

    // Draw grid lines (subtle)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= gridSize; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, size);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(size, i * cellSize);
      ctx.stroke();
    }

    // Draw food with glow effect
    const foodX = food.x * cellSize + cellSize / 2;
    const foodY = food.y * cellSize + cellSize / 2;
    const foodRadius = cellSize * 0.4;

    // Food glow
    const glowSize = eatAnimation ? foodRadius * 2.5 : foodRadius * 1.8;
    const gradient = ctx.createRadialGradient(foodX, foodY, 0, foodX, foodY, glowSize);
    gradient.addColorStop(0, 'rgba(255, 82, 82, 0.4)');
    gradient.addColorStop(1, 'rgba(255, 82, 82, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(foodX, foodY, glowSize, 0, Math.PI * 2);
    ctx.fill();

    // Food body
    const foodGradient = ctx.createRadialGradient(
      foodX - foodRadius * 0.3, foodY - foodRadius * 0.3, 0,
      foodX, foodY, foodRadius
    );
    foodGradient.addColorStop(0, '#ff6b6b');
    foodGradient.addColorStop(1, '#ee5a24');
    ctx.fillStyle = foodGradient;
    ctx.beginPath();
    ctx.arc(foodX, foodY, foodRadius * (eatAnimation ? 1.2 : 1), 0, Math.PI * 2);
    ctx.fill();

    // Draw snake
    snake.forEach((segment, index) => {
      const x = segment.x * cellSize;
      const y = segment.y * cellSize;
      const padding = cellSize * 0.05;
      const radius = cellSize * 0.15;

      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;

      if (index === 0) {
        // Head - brighter with gradient
        const headGradient = ctx.createLinearGradient(x, y, x + cellSize, y + cellSize);
        headGradient.addColorStop(0, '#4ade80');
        headGradient.addColorStop(1, '#22c55e');
        ctx.fillStyle = headGradient;
        ctx.shadowColor = '#4ade80';
        ctx.shadowBlur = 10;
      } else {
        // Body - gradient from bright to darker
        const alpha = 1 - (index / snake.length) * 0.4;
        ctx.fillStyle = `rgba(74, 222, 128, ${alpha})`;
      }

      // Rounded rectangle for each segment
      const rx = x + padding;
      const ry = y + padding;
      const rw = cellSize - padding * 2;
      const rh = cellSize - padding * 2;

      ctx.beginPath();
      ctx.moveTo(rx + radius, ry);
      ctx.lineTo(rx + rw - radius, ry);
      ctx.quadraticCurveTo(rx + rw, ry, rx + rw, ry + radius);
      ctx.lineTo(rx + rw, ry + rh - radius);
      ctx.quadraticCurveTo(rx + rw, ry + rh, rx + rw - radius, ry + rh);
      ctx.lineTo(rx + radius, ry + rh);
      ctx.quadraticCurveTo(rx, ry + rh, rx, ry + rh - radius);
      ctx.lineTo(rx, ry + radius);
      ctx.quadraticCurveTo(rx, ry, rx + radius, ry);
      ctx.closePath();
      ctx.fill();

      // Draw eyes on head
      if (index === 0) {
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        const eyeSize = cellSize * 0.12;
        const eyeOffset = cellSize * 0.22;

        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(x + cellSize / 2 - eyeOffset / 2, y + cellSize / 2 - eyeOffset * 0.3, eyeSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x + cellSize / 2 + eyeOffset / 2, y + cellSize / 2 - eyeOffset * 0.3, eyeSize, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#1a1a2e';
        ctx.beginPath();
        ctx.arc(x + cellSize / 2 - eyeOffset / 2, y + cellSize / 2 - eyeOffset * 0.3, eyeSize * 0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x + cellSize / 2 + eyeOffset / 2, y + cellSize / 2 - eyeOffset * 0.3, eyeSize * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;

    // Draw overlays
    if (gameStatus === 'paused') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fillRect(0, 0, size, size);
      ctx.fillStyle = '#fff';
      ctx.font = `bold ${cellSize * 1.5}px system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('⏸ ПАУЗА', size / 2, size / 2);
      ctx.font = `${cellSize * 0.6}px system-ui, sans-serif`;
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.fillText('Пробел — продолжить', size / 2, size / 2 + cellSize * 2.5);
    }

    if (gameStatus === 'gameover') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
      ctx.fillRect(0, 0, size, size);
      ctx.fillStyle = '#ff6b6b';
      ctx.font = `bold ${cellSize * 1.4}px system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('💀 ИГРА ОКОНЧЕНА', size / 2, size / 2 - cellSize);
      ctx.fillStyle = '#fff';
      ctx.font = `${cellSize * 0.7}px system-ui, sans-serif`;
      ctx.fillText('Пробел — начать заново', size / 2, size / 2 + cellSize * 1.5);
    }

    if (gameStatus === 'idle') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, 0, size, size);
      ctx.font = `${cellSize * 2.5}px system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🐍', size / 2, size / 2 - cellSize * 2.5);
      ctx.fillStyle = '#fff';
      ctx.font = `bold ${cellSize * 1.3}px system-ui, sans-serif`;
      ctx.fillText('ЗМЕЙКА', size / 2, size / 2);
      ctx.font = `${cellSize * 0.55}px system-ui, sans-serif`;
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.fillText('Нажмите Пробел или кнопку Старт', size / 2, size / 2 + cellSize * 2);
    }
  }, [snake, food, gridSize, gameStatus, eatAnimation]);

  // Resize handling
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resize = () => {
      const size = Math.min(container.clientWidth, container.clientHeight, 500);
      sizeRef.current = size;
      draw();
    };

    const observer = new ResizeObserver(resize);
    observer.observe(container);
    resize();

    return () => observer.disconnect();
  }, [draw]);

  // Redraw on state change
  useEffect(() => {
    draw();
  }, [draw]);

  return (
    <div ref={containerRef} className="w-full aspect-square max-w-[500px] mx-auto">
      <canvas
        ref={canvasRef}
        className="w-full h-full rounded-xl shadow-2xl shadow-green-500/10 border border-white/10"
      />
    </div>
  );
}
