"use client"

import type { MapLevel } from "@/types/map"

interface LevelSelectorProps {
  levels: MapLevel[]
  activeLevel: number | null
  onSelectLevel: (level: number | null) => void
}

export function LevelSelector({ levels, activeLevel, onSelectLevel }: LevelSelectorProps) {
  if (levels.length <= 1) return null

  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1">
        Floor
      </span>
      <div className="flex flex-col gap-0.5">
        <button
          onClick={() => onSelectLevel(null)}
          className={`
            px-2 py-1.5 rounded text-xs text-left transition-colors
            ${activeLevel === null
              ? "bg-primary text-primary-foreground font-medium"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            }
          `}
        >
          All Floors
        </button>
        {levels.map((lvl) => (
          <button
            key={lvl.value}
            onClick={() => onSelectLevel(lvl.value)}
            className={`
              px-2 py-1.5 rounded text-xs text-left transition-colors
              ${activeLevel === lvl.value
                ? "bg-primary text-primary-foreground font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }
            `}
          >
            {lvl.label}
          </button>
        ))}
      </div>
    </div>
  )
}
