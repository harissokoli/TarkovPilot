"use client"

import { useState, useMemo } from "react"
import { SlidersHorizontal } from "lucide-react"
import { useMarkers } from "@/hooks/use-markers"
import { useMapState } from "@/hooks/use-map-state"
import { useMapImages } from "@/hooks/use-map-images"
import { getMapConfig, getAllMaps } from "@/lib/maps"
import { getLevelsForMarkers } from "@/lib/markers"
import { Header } from "./Header"
import { MapCanvas } from "./MapCanvas"
import { CategoryFilter } from "./CategoryFilter"
import { LevelSelector } from "./LevelSelector"
import { MarkerDetail } from "./MarkerDetail"
import { MobileFilterDrawer } from "./MobileFilterDrawer"
import { LoadingState } from "./LoadingState"
import { ErrorBoundary } from "@/components/ErrorBoundary"

const DEFAULT_MAP = "customs"

export function MapExplorer() {
  const [activeMapId, setActiveMapId] = useState(DEFAULT_MAP)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const config = useMemo(() => getMapConfig(activeMapId), [activeMapId])
  const { markers, isLoading, error } = useMarkers(activeMapId)
  const {
    customImageUrl,
    imageDimensions,
    imageRotation,
    uploadError,
    uploadImage,
    rotateImage,
    removeImage,
    boundsOverride,
    setBoundsOverride,
  } = useMapImages(activeMapId)

  const {
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
  } = useMapState(markers)

  const mapLevels = useMemo(
    () =>
      getLevelsForMarkers(markers).map((v) => ({
        value: v,
        label:
          v === -1 ? "Basement" :
          v === 0  ? "Ground"   :
          v === 1  ? "Ground"   :
          v === 2  ? "Upper"    :
          v === 3  ? "Roof"     :
          `Level ${v}`,
      })),
    [markers]
  )

  const handleMapChange = (mapId: string) => {
    setActiveMapId(mapId)
    clearFilters()
    selectMarker(null)
    setMobileFiltersOpen(false)
  }

  if (!config) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
        Map configuration not found.
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      <Header
        activeMapId={activeMapId}
        onMapChange={handleMapChange}
        search={filters.search}
        onSearchChange={setSearch}
      />

      {/* Mobile filter button row */}
      <div className="md:hidden flex items-center gap-2 px-4 py-2 border-b border-border bg-card shrink-0">
        <button
          onClick={() => setMobileFiltersOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded bg-secondary text-xs font-medium text-foreground hover:bg-accent transition-colors"
        >
          <SlidersHorizontal size={12} />
          Filters
          {hasActiveFilters && (
            <span className="w-4 h-4 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-[9px] font-bold">
              !
            </span>
          )}
        </button>
        <span className="text-xs text-muted-foreground ml-auto">
          {filteredMarkers.length} / {markers.length} markers
        </span>
      </div>

      {/* Main content: sidebar | map | detail */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar — desktop only */}
        <aside className="hidden md:flex flex-col w-56 shrink-0 border-r border-border bg-card overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-5">
            {mapLevels.length > 1 && (
              <>
                <LevelSelector
                  levels={mapLevels}
                  activeLevel={filters.level}
                  onSelectLevel={setLevel}
                />
                <div className="h-px bg-border" />
              </>
            )}
            <CategoryFilter
              categoryCounts={categoryCounts}
              filters={filters}
              onToggleCategory={toggleCategory}
              onToggleSubCategory={toggleSubCategory}
              onClearFilters={clearFilters}
              hasActiveFilters={hasActiveFilters}
              totalVisible={filteredMarkers.length}
              totalAll={markers.length}
            />
          </div>
        </aside>

        {/* Map area */}
        <main className="flex-1 relative overflow-hidden">
          <ErrorBoundary fallbackMessage="Failed to render the map canvas.">
            {isLoading ? (
              <LoadingState />
            ) : error ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-sm text-muted-foreground">
                  Failed to load markers. Please refresh.
                </p>
              </div>
            ) : (
              <MapCanvas
                config={config}
                markers={filteredMarkers}
                selectedMarker={selectedMarker}
                onSelectMarker={selectMarker}
                customImageUrl={customImageUrl}
                imageDimensions={imageDimensions}
                imageRotation={imageRotation}
                uploadError={uploadError}
                onUploadImage={uploadImage}
                onRotateImage={rotateImage}
                onRemoveImage={removeImage}
                boundsOverride={boundsOverride}
                onSetBoundsOverride={setBoundsOverride}
              />
            )}
          </ErrorBoundary>
        </main>

        {/* Right detail panel */}
        {selectedMarker && (
          <aside className="hidden sm:flex w-72 shrink-0 overflow-hidden">
            <MarkerDetail
              marker={selectedMarker}
              onClose={() => selectMarker(null)}
            />
          </aside>
        )}
      </div>

      {/* Mobile marker detail — bottom sheet */}
      {selectedMarker && (
        <div className="sm:hidden fixed inset-x-0 bottom-0 z-40 max-h-[55vh] overflow-y-auto bg-card border-t border-border rounded-t-xl shadow-xl">
          <MarkerDetail
            marker={selectedMarker}
            onClose={() => selectMarker(null)}
          />
        </div>
      )}

      {/* Mobile filter drawer */}
      <MobileFilterDrawer
        open={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        categoryCounts={categoryCounts}
        filters={filters}
        onToggleCategory={toggleCategory}
        onToggleSubCategory={toggleSubCategory}
        onClearFilters={clearFilters}
        hasActiveFilters={hasActiveFilters}
        totalVisible={filteredMarkers.length}
        totalAll={markers.length}
        levels={mapLevels}
        onSelectLevel={setLevel}
        search={filters.search}
        onSearchChange={setSearch}
      />
    </div>
  )
}
