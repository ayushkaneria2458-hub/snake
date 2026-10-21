export const GRID_SIZE = 20
export const INITIAL_SPEED_MS = 140
export const MIN_SPEED_MS = 60
export const SPEED_STEP_MS = 4

export type Point = { x: number; y: number }
export type Direction = 'up' | 'down' | 'left' | 'right'
export type Status = 'idle' | 'running' | 'paused' | 'over'

export type GameState = {
  snake: Point[]
  food: Point
  direction: Direction
  score: number
  status: Status
}

const VECTORS: Record<Direction, Point> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
}

const OPPOSITES: Record<Direction, Direction> = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left',
}

export function isOpposite(a: Direction, b: Direction) {
  return OPPOSITES[a] === b
}

export function randomFood(snake: Point[]): Point {
  const occupied = new Set(snake.map((p) => `${p.x},${p.y}`))
  const free: Point[] = []
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      if (!occupied.has(`${x},${y}`)) free.push({ x, y })
    }
  }
  return free[Math.floor(Math.random() * free.length)] ?? { x: 0, y: 0 }
}

export function createInitialState(): GameState {
  const mid = Math.floor(GRID_SIZE / 2)
  const snake = [
    { x: mid, y: mid },
    { x: mid - 1, y: mid },
    { x: mid - 2, y: mid },
  ]
  return {
    snake,
    food: randomFood(snake),
    direction: 'right',
    score: 0,
    status: 'idle',
  }
}

export function speedForScore(score: number) {
  return Math.max(MIN_SPEED_MS, INITIAL_SPEED_MS - score * SPEED_STEP_MS)
}

export function step(state: GameState, direction: Direction): GameState {
  const head = state.snake[0]
  const vector = VECTORS[direction]
  const next = { x: head.x + vector.x, y: head.y + vector.y }

  const hitsWall =
    next.x < 0 || next.y < 0 || next.x >= GRID_SIZE || next.y >= GRID_SIZE
  const eats = next.x === state.food.x && next.y === state.food.y
  const body = eats ? state.snake : state.snake.slice(0, -1)
  const hitsSelf = body.some((p) => p.x === next.x && p.y === next.y)

  if (hitsWall || hitsSelf) {
    return { ...state, direction, status: 'over' }
  }

  const snake = [next, ...body]
  return {
    ...state,
    snake,
    direction,
    food: eats ? randomFood(snake) : state.food,
    score: eats ? state.score + 1 : state.score,
  }
}
