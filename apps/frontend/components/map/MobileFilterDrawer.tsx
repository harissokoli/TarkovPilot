"use client"

import { X, SlidersHorizontal } from "lucide-react"
import type { CategoryCount, FilterState } from "@/types/marker"
import type { MapLevel } from "@/types/map"
import { CategoryFilter } from "./CategoryFilter"
import { LevelSelector } from "./LevelSelector"
import { SearchBar } from "./SearchBar"

interface MobileFilterDrawerProps {
  open: boolean
  onClose: () => void
  categoryCounts: CategoryCount[]
  filters: FilterState
  onToggleCategory: (cat: string) => void
  onToggleSubCategory: (sub: string) => void
  onClearFilters: () => void
  hasActiveFilters: boolean
  totalVisible: number
  totalAll: number
  levels: MapLevel[]
  onSelectLevel: (level: number | null) => void
  search: string
  onSearchChange: (v: string) => void
}

export function MobileFilterDrawer({
  open,
  onClose,
  categoryCounts,
  filters,
  onToggleCategory,
  onToggleSubCategory,
  onClearFilters,
  hasActiveFilters,
  totalVisible,
  totalAll,
  levels,
  onSelectLevel,
  search,
  onSearchChange,
}: MobileFilterDrawerProps) {
  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/60"
        onClick={onClose}
        aria-hidden
      />

      {/* Drawer */}
      <div
        className="fixed inset-y-0 left-0 z-50 w-72 bg-card border-r border-border flex flex-col"
        role="dialog"
        aria-modal
        aria-label="Filters"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={14} className="text-primary" />
            <span className="text-sm font-semibold">Filters</span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close filters"
            className="w-7 h-7 flex items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
          <SearchBar value={search} onChange={onSearchChange} />

          {levels.length > 1 && (
            <LevelSelector
              levels={levels}
              activeLevel={filters.level}
              onSelectLevel={onSelectLevel}
            />
          )}

          <CategoryFilter
            categoryCounts={categoryCounts}
            filters={filters}
            onToggleCategory={onToggleCategory}
            onToggleSubCategory={onToggleSubCategory}
            onClearFilters={onClearFilters}
            hasActiveFilters={hasActiveFilters}
            totalVisible={totalVisible}
            totalAll={totalAll}
          />
        </div>
      </div>
    </>
  )
}
