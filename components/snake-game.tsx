'use client'

import { Pause, Play, RotateCcw } from 'lucide-react'
import { GameBoard } from '@/components/game-board'
import { TouchControls } from '@/components/touch-controls'
import { useSnakeGame } from '@/hooks/use-snake-game'

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col">
      <span className="text-xs uppercase tracking-widest text-lcd-ink/60">{label}</span>
      <span className="font-mono text-3xl font-bold tabular-nums text-lcd-ink">
        {String(value).padStart(3, '0')}
      </span>
    </div>
  )
}

export function SnakeGame() {
  const { state, best, start, togglePause, turn } = useSnakeGame()
  const { status, score, snake } = state

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-6">
      <div className="flex w-full items-end justify-between">
        <Stat label="Score" value={score} />
        <div className="flex flex-col items-center">
          <span className="text-xs uppercase tracking-widest text-lcd-ink/60">Length</span>
          <span className="font-mono text-xl font-bold tabular-nums text-lcd-ink">{snake.length}</span>
        </div>
        <div className="text-right">
          <Stat label="Best" value={best} />
        </div>
      </div>

      <GameBoard state={state} onSwipe={turn}>
        {status !== 'running' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-lcd/80 p-6 text-center backdrop-blur-[2px]">
            <p className="font-mono text-2xl font-bold uppercase tracking-widest text-lcd-ink" aria-live="polite">
              {status === 'idle' && 'Snake'}
              {status === 'paused' && 'Paused'}
              {status === 'over' && 'Game over'}
            </p>
            {status === 'over' && (
              <p className="text-sm text-lcd-ink/80">
                You ate {score} {score === 1 ? 'apple' : 'apples'} and grew to {snake.length} segments.
              </p>
            )}
            <button
              type="button"
              onClick={status === 'paused' ? togglePause : start}
              className="flex items-center gap-2 rounded-md bg-lcd-ink px-5 py-2.5 font-mono text-sm font-bold uppercase tracking-wider text-lcd hover:bg-lcd-ink/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lcd-ink"
            >
              {status === 'paused' ? (
                <Play className="size-4" aria-hidden="true" />
              ) : status === 'over' ? (
                <RotateCcw className="size-4" aria-hidden="true" />
              ) : (
                <Play className="size-4" aria-hidden="true" />
              )}
              {status === 'paused' ? 'Resume' : status === 'over' ? 'Play again' : 'Start'}
            </button>
            <p className="hidden text-xs text-lcd-ink/70 md:block">
              Arrow keys or WASD to steer · Space to pause
            </p>
            <p className="text-xs text-lcd-ink/70 md:hidden">Swipe the board or use the pad to steer</p>
          </div>
        )}
      </GameBoard>

      <div className="flex w-full items-center justify-between gap-4">
        <TouchControls onTurn={turn} />
        <div className="ml-auto flex gap-2">
          <button
            type="button"
            onClick={togglePause}
            disabled={status !== 'running' && status !== 'paused'}
            className="flex items-center gap-2 rounded-md border-2 border-lcd-ink px-3 py-2 font-mono text-xs font-bold uppercase tracking-wider text-lcd-ink hover:bg-lcd-ink/10 disabled:opacity-40"
          >
            {status === 'paused' ? <Play className="size-4" aria-hidden="true" /> : <Pause className="size-4" aria-hidden="true" />}
            {status === 'paused' ? 'Resume' : 'Pause'}
          </button>
          <button
            type="button"
            onClick={start}
            className="flex items-center gap-2 rounded-md border-2 border-lcd-ink px-3 py-2 font-mono text-xs font-bold uppercase tracking-wider text-lcd-ink hover:bg-lcd-ink/10"
          >
            <RotateCcw className="size-4" aria-hidden="true" />
            Restart
          </button>
        </div>
      </div>
    </div>
  )
}
