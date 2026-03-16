"use client"

import { MapPin, ChevronDown } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { getAllMaps } from "@/lib/maps"

interface MapSelectorProps {
  activeMapId: string
  onChange: (mapId: string) => void
}

export function MapSelector({ activeMapId, onChange }: MapSelectorProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const maps = getAllMaps()
  const activeMap = maps.find((m) => m.id === activeMapId)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="
          flex items-center gap-2 px-3 h-9 rounded border border-border
          bg-secondary text-foreground text-sm font-medium
          hover:bg-accent transition-colors
        "
      >
        <MapPin size={14} className="text-primary shrink-0" />
        <span>{activeMap?.displayName ?? "Select Map"}</span>
        <ChevronDown
          size={12}
          className={`text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Select map"
          className="
            absolute top-full left-0 mt-1 z-30
            bg-card border border-border rounded-lg shadow-xl
            min-w-[180px] py-1 overflow-hidden
          "
        >
          {maps.map((m) => (
            <button
              key={m.id}
              role="option"
              aria-selected={m.id === activeMapId}
              onClick={() => {
                onChange(m.id)
                setOpen(false)
              }}
              className={`
                w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors
                ${m.id === activeMapId
                  ? "bg-primary text-primary-foreground font-medium"
                  : "text-foreground hover:bg-secondary"
                }
              `}
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: m.accentColor }}
              />
              {m.displayName}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
