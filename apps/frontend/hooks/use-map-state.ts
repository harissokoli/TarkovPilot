"use client"

import { useState, useCallback, useMemo } from "react"
import type { Marker, FilterState } from "@/types/marker"
import { applyFilters, computeCategoryCounts } from "@/lib/markers"

const DEFAULT_FILTERS: FilterState = {
  categories: new Set<string>(),
  subCategories: new Set<string>(),
  search: "",
  level: null,
}

export function useMapState(markers: Marker[]) {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS)
  const [selectedMarker, setSelectedMarker] = useState<Marker | null>(null)

  const filteredMarkers = useMemo(
    () => applyFilters(markers, filters),
    [markers, filters]
  )

  const categoryCounts = useMemo(() => computeCategoryCounts(markers), [markers])

  const toggleCategory = useCallback((category: string) => {
    setFilters((prev) => {
      const next = new Set(prev.categories)
      if (next.has(category)) {
        next.delete(category)
      } else {
        next.add(category)
      }
      return { ...prev, categories: next, subCategories: new Set() }
    })
    setSelectedMarker((prev) => (prev?.category === category ? null : prev))
  }, [])

  const toggleSubCategory = useCallback((subCategory: string) => {
    setFilters((prev) => {
      const next = new Set(prev.subCategories)
      if (next.has(subCategory)) {
        next.delete(subCategory)
      } else {
        next.add(subCategory)
      }
      return { ...prev, subCategories: next }
    })
  }, [])

  const setSearch = useCallback((search: string) => {
    setFilters((prev) => ({ ...prev, search }))
  }, [])

  const setLevel = useCallback((level: number | null) => {
    setFilters((prev) => ({ ...prev, level }))
    setSelectedMarker(null)
  }, [])

  const clearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS)
  }, [])

  const selectMarker = useCallback((marker: Marker | null) => {
    setSelectedMarker(marker)
  }, [])

  const hasActiveFilters =
    filters.categories.size > 0 ||
    filters.subCategories.size > 0 ||
    filters.search.trim() !== "" ||
    filters.level !== null

  return {
    filters,
    filteredMarkers,
    categoryCounts,
    selectedMarker,
    hasActiveFilters,
    toggleCategory,
    toggleSubCategory,
    setSearch,
    setLevel,
    clearFilters,
    selectMarker,
  }
}
