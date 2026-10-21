'use client'

import { useEffect, useRef } from 'react'
import { GRID_SIZE, type Direction, type GameState } from '@/lib/snake'

const COLORS = {
  board: '#c7d59f',
  grid: 'rgba(43, 51, 24, 0.07)',
  snake: '#2b3318',
  head: '#1a1f0e',
  food: '#a4442f',
}

type GameBoardProps = {
  state: GameState
  onSwipe: (direction: Direction) => void
  children?: React.ReactNode
}

export function GameBoard({ state, onSwipe, children }: GameBoardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const touchStart = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const size = canvas.clientWidth
    const dpr = window.devicePixelRatio || 1
    if (canvas.width !== size * dpr) {
      canvas.width = size * dpr
      canvas.height = size * dpr
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const cell = size / GRID_SIZE
    ctx.fillStyle = COLORS.board
    ctx.fillRect(0, 0, size, size)

    ctx.fillStyle = COLORS.grid
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        if ((x + y) % 2 === 0) ctx.fillRect(x * cell, y * cell, cell, cell)
      }
    }

    const pad = cell * 0.08
    ctx.fillStyle = COLORS.food
    ctx.beginPath()
    ctx.arc(
      state.food.x * cell + cell / 2,
      state.food.y * cell + cell / 2,
      cell / 2 - pad * 2,
      0,
      Math.PI * 2,
    )
    ctx.fill()

    state.snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? COLORS.head : COLORS.snake
      ctx.beginPath()
      ctx.roundRect(
        segment.x * cell + pad,
        segment.y * cell + pad,
        cell - pad * 2,
        cell - pad * 2,
        cell * 0.2,
      )
      ctx.fill()
    })

    const head = state.snake[0]
    const eye = cell * 0.1
    const offsets: Record<Direction, [number, number][]> = {
      right: [[0.68, 0.3], [0.68, 0.7]],
      left: [[0.32, 0.3], [0.32, 0.7]],
      up: [[0.3, 0.32], [0.7, 0.32]],
      down: [[0.3, 0.68], [0.7, 0.68]],
    }
    ctx.fillStyle = COLORS.board
    for (const [ox, oy] of offsets[state.direction]) {
      ctx.beginPath()
      ctx.arc(head.x * cell + ox * cell, head.y * cell + oy * cell, eye, 0, Math.PI * 2)
      ctx.fill()
    }
  }, [state])

  function handleTouchStart(event: React.TouchEvent) {
    const t = event.touches[0]
    touchStart.current = { x: t.clientX, y: t.clientY }
  }

  function handleTouchEnd(event: React.TouchEvent) {
    const startPoint = touchStart.current
    touchStart.current = null
    if (!startPoint) return
    const t = event.changedTouches[0]
    const dx = t.clientX - startPoint.x
    const dy = t.clientY - startPoint.y
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return
    if (Math.abs(dx) > Math.abs(dy)) onSwipe(dx > 0 ? 'right' : 'left')
    else onSwipe(dy > 0 ? 'down' : 'up')
  }

  return (
    <div
      className="relative aspect-square w-full touch-none overflow-hidden rounded-md border-4 border-lcd-ink"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <canvas
        ref={canvasRef}
        className="block size-full"
        role="img"
        aria-label={`Snake board. Snake length ${state.snake.length}, score ${state.score}.`}
      />
      {children}
    </div>
  )
}
