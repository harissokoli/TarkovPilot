"use client"

import { MapSelector } from "./MapSelector"
import { SearchBar } from "./SearchBar"

interface HeaderProps {
  activeMapId: string
  onMapChange: (mapId: string) => void
  search: string
  onSearchChange: (v: string) => void
}

export function Header({ activeMapId, onMapChange, search, onSearchChange }: HeaderProps) {
  return (
    <header className="flex items-center gap-3 px-4 h-12 border-b border-border bg-card shrink-0 z-20">
      {/* Brand */}
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-primary font-bold text-sm tracking-tight uppercase select-none">
          Tarkov
        </span>
        <span className="text-muted-foreground text-xs hidden sm:block">Maps</span>
      </div>

      <div className="h-4 w-px bg-border shrink-0 hidden sm:block" />

      {/* Map selector */}
      <MapSelector activeMapId={activeMapId} onChange={onMapChange} />

      {/* Search — grows to fill available space */}
      <div className="flex-1 max-w-sm">
        <SearchBar value={search} onChange={onSearchChange} />
      </div>
    </header>
  )
}
