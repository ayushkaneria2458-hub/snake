import { SnakeGame } from '@/components/snake-game'

export default function Page() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-8 bg-lcd px-4 py-10">
      <header className="text-center">
        <h1 className="font-mono text-4xl font-bold uppercase tracking-[0.3em] text-lcd-ink">Snake</h1>
        <p className="mt-2 text-sm text-lcd-ink/70">Eat the apples. Grow longer. Avoid the walls and yourself.</p>
      </header>
      <SnakeGame />
    </main>
  )
}
