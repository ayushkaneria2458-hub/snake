'use client'

import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from 'lucide-react'
import type { Direction } from '@/lib/snake'

const BUTTONS: { direction: Direction; label: string; Icon: typeof ChevronUp; area: string }[] = [
  { direction: 'up', label: 'Move up', Icon: ChevronUp, area: 'col-start-2 row-start-1' },
  { direction: 'left', label: 'Move left', Icon: ChevronLeft, area: 'col-start-1 row-start-2' },
  { direction: 'right', label: 'Move right', Icon: ChevronRight, area: 'col-start-3 row-start-2' },
  { direction: 'down', label: 'Move down', Icon: ChevronDown, area: 'col-start-2 row-start-3' },
]

export function TouchControls({ onTurn }: { onTurn: (direction: Direction) => void }) {
  return (
    <div className="grid grid-cols-3 grid-rows-3 gap-2 md:hidden" aria-label="Direction controls">
      {BUTTONS.map(({ direction, label, Icon, area }) => (
        <button
          key={direction}
          type="button"
          aria-label={label}
          onPointerDown={(e) => {
            e.preventDefault()
            onTurn(direction)
          }}
          className={`${area} flex size-14 items-center justify-center rounded-md bg-lcd-ink text-lcd active:translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lcd-ink`}
        >
          <Icon className="size-7" aria-hidden="true" />
        </button>
      ))}
    </div>
  )
}
