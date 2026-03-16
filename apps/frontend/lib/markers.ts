import type { Marker, FilterState, CategoryCount } from "@/types/marker"
import type { MapConfig } from "@/types/map"

// ---------------------------------------------------------------------------
// Localization helpers
// ---------------------------------------------------------------------------

export function getLocalizedName(marker: Marker): string {
  return marker.name
}

export function getLocalizedDesc(marker: Marker): string {
  return marker.desc ?? ""
}

// ---------------------------------------------------------------------------
// Coordinate mapping — JSON x/y → canvas pixel position
// ---------------------------------------------------------------------------

export interface Bounds {
  minX: number
  maxX: number
  minY: number
  maxY: number
}

/**
 * Compute tight bounds from actual marker data with a small padding factor.
 * Falls back to config.bounds if there are no markers.
 */
export function computeBounds(markers: Marker[], fallback: Bounds, padding = 0.05): Bounds {
  if (markers.length === 0) return fallback

  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity
  for (const m of markers) {
    const { x, y } = m.geometry
    if (x < minX) minX = x
    if (x > maxX) maxX = x
    if (y < minY) minY = y
    if (y > maxY) maxY = y
  }

  // Add percentage padding so edge markers aren't clipped
  const padX = (maxX - minX) * padding
  const padY = (maxY - minY) * padding

  return {
    minX: minX - padX,
    maxX: maxX + padX,
    minY: minY - padY,
    maxY: maxY + padY,
  }
}

/**
 * Convert a marker's game-world coordinate to a fractional [0,1] position
 * on the map image, so we can position it as a % offset on the <img> element.
 */
export function coordToPercent(
  x: number,
  y: number,
  bounds: Bounds
): { px: number; py: number } {
  const { minX, maxX, minY, maxY } = bounds
  const rangeX = maxX - minX
  const rangeY = maxY - minY

  if (rangeX === 0 || rangeY === 0) return { px: 0.5, py: 0.5 }

  // Clamp to [0,1]
  const px = Math.max(0, Math.min(1, (x - minX) / rangeX))
  // Y axis: high y in dataset = top of map for Tarkov maps
  const py = Math.max(0, Math.min(1, 1 - (y - minY) / rangeY))

  return { px, py }
}

// ---------------------------------------------------------------------------
// Filtering
// ---------------------------------------------------------------------------

// Categories that should never appear on the map canvas
const EXCLUDED_CATEGORIES = new Set(["floor"])

export function applyFilters(
  markers: Marker[],
  filters: FilterState
): Marker[] {
  const { categories, subCategories, search, level } = filters
  const searchLower = search.toLowerCase().trim()

  return markers.filter((m) => {
    // Always exclude floor markers
    if (EXCLUDED_CATEGORIES.has(m.category.toLowerCase())) return false

    // Category filter
    if (categories.size > 0 && !categories.has(m.category)) return false

    // SubCategory filter
    if (subCategories.size > 0) {
      const sub = m.subCategory ?? ""
      if (!subCategories.has(sub)) return false
    }

    // Level filter
    if (level !== null && m.level !== undefined && m.level !== level) return false

    // Text search
    if (searchLower) {
      const name = getLocalizedName(m).toLowerCase()
      const desc = getLocalizedDesc(m).toLowerCase()
      if (!name.includes(searchLower) && !desc.includes(searchLower)) return false
    }

    return true
  })
}

// ---------------------------------------------------------------------------
// Category aggregation
// ---------------------------------------------------------------------------

export function computeCategoryCounts(markers: Marker[]): CategoryCount[] {
  const map = new Map<string, Map<string, number>>()

  for (const m of markers) {
    // Keep consistent with applyFilters — floor markers are excluded everywhere
    if (EXCLUDED_CATEGORIES.has(m.category.toLowerCase())) continue

    const cat = m.category
    const sub = m.subCategory ?? "(none)"

    if (!map.has(cat)) map.set(cat, new Map())
    const subMap = map.get(cat)!
    subMap.set(sub, (subMap.get(sub) ?? 0) + 1)
  }

  const result: CategoryCount[] = []
  for (const [category, subMap] of map) {
    const subCategories = Array.from(subMap.entries()).map(([subCategory, count]) => ({
      subCategory,
      count,
    }))
    const count = subCategories.reduce((s, sc) => s + sc.count, 0)
    result.push({ category, count, subCategories })
  }

  // Sort alphabetically
  return result.sort((a, b) => a.category.localeCompare(b.category))
}

// ---------------------------------------------------------------------------
// Level extraction
// ---------------------------------------------------------------------------

export function getLevelsForMarkers(markers: Marker[]): number[] {
  const set = new Set<number>()
  for (const m of markers) {
    if (m.level !== undefined) set.add(m.level)
  }
  return Array.from(set).sort((a, b) => a - b)
}

// ---------------------------------------------------------------------------
// Format helpers
// ---------------------------------------------------------------------------

export function formatUpdatedDate(updated: string): string {
  try {
    return new Date(updated).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  } catch {
    return updated
  }
}
