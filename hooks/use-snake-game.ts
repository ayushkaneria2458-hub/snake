'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  createInitialState,
  isOpposite,
  speedForScore,
  step,
  type Direction,
  type GameState,
} from '@/lib/snake'

export function useSnakeGame() {
  const [state, setState] = useState<GameState>(createInitialState)
  const [best, setBest] = useState(0)
  const queueRef = useRef<Direction[]>([])
  const stateRef = useRef(state)
  stateRef.current = state

  const start = useCallback(() => {
    queueRef.current = []
    setState({ ...createInitialState(), status: 'running' })
  }, [])

  const togglePause = useCallback(() => {
    setState((s) => {
      if (s.status === 'running') return { ...s, status: 'paused' }
      if (s.status === 'paused') return { ...s, status: 'running' }
      return s
    })
  }, [])

  const turn = useCallback(
    (direction: Direction) => {
      const current = stateRef.current
      if (current.status === 'idle' || current.status === 'over') {
        start()
        if (direction !== 'left') queueRef.current.push(direction)
        return
      }
      if (current.status !== 'running') return
      const queue = queueRef.current
      const last = queue[queue.length - 1] ?? current.direction
      if (direction === last || isOpposite(direction, last)) return
      if (queue.length < 3) queue.push(direction)
    },
    [start],
  )

  useEffect(() => {
    if (state.status !== 'running') return
    const id = window.setInterval(() => {
      const queued = queueRef.current.shift()
      setState((s) => {
        if (s.status !== 'running') return s
        return step(s, queued ?? s.direction)
      })
    }, speedForScore(state.score))
    return () => window.clearInterval(id)
  }, [state.status, state.score])

  useEffect(() => {
    if (state.score > best) setBest(state.score)
  }, [state.score, best])

  useEffect(() => {
    const keyMap: Record<string, Direction> = {
      ArrowUp: 'up',
      ArrowDown: 'down',
      ArrowLeft: 'left',
      ArrowRight: 'right',
      w: 'up',
      s: 'down',
      a: 'left',
      d: 'right',
    }
    function onKeyDown(event: KeyboardEvent) {
      const direction = keyMap[event.key] ?? keyMap[event.key.toLowerCase()]
      if (direction) {
        event.preventDefault()
        turn(direction)
        return
      }
      if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault()
        const status = stateRef.current.status
        if (status === 'idle' || status === 'over') start()
        else togglePause()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [turn, start, togglePause])

  return { state, best, start, togglePause, turn }
}
