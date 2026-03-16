"use client"

import { useRef, useCallback, useState, useMemo, useEffect } from "react"
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react"
import type { Marker } from "@/types/marker"
import type { MapBounds, MapConfig } from "@/types/map"
import type { ImageDimensions } from "@/hooks/use-map-images"
import { usePanZoom } from "@/hooks/use-pan-zoom"
import { coordToPercent, computeBounds } from "@/lib/markers"
import { MarkerPin } from "./MarkerPin"
import { MapImageUpload } from "./MapImageUpload"

interface MapCanvasProps {
  config: MapConfig
  markers: Marker[]
  selectedMarker: Marker | null
  onSelectMarker: (marker: Marker | null) => void
  customImageUrl: string | null
  /** Natural pixel dimensions of the uploaded image (already swapped when rotated 90/270) */
  imageDimensions: ImageDimensions | null
  /** Current rotation applied to the uploaded image in degrees (0 | 90 | 180 | 270) */
  imageRotation: 0 | 90 | 180 | 270
  uploadError: string | null
  boundsOverride: MapBounds | null
  onUploadImage: (file: File) => Promise<void>
  onRotateImage: () => void
  onRemoveImage: () => void
  onSetBoundsOverride: (bounds: MapBounds | null) => void
}

export function MapCanvas({
  config,
  markers,
  selectedMarker,
  onSelectMarker,
  customImageUrl,
  imageDimensions,
  imageRotation,
  uploadError,
  boundsOverride,
  onUploadImage,
  onRotateImage,
  onRemoveImage,
  onSetBoundsOverride,
}: MapCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [cdnFailed, setCdnFailed] = useState(false)
  const [isEditingBounds, setIsEditingBounds] = useState(false)

  // Resolve image source: custom upload > CDN fallback
  const activeImageUrl = customImageUrl ?? (cdnFailed ? null : config.imageUrl)
  const hasImage = activeImageUrl !== null

  // Aspect ratio for the padding-top trick:
  // If user uploaded an image, use its real pixel dimensions so markers
  // map perfectly onto it. Otherwise fall back to the config dimensions.
  const aspectRatio = useMemo(() => {
    if (imageDimensions && imageDimensions.width > 0) {
      return imageDimensions.height / imageDimensions.width
    }
    return config.imageHeight / config.imageWidth
  }, [imageDimensions, config.imageHeight, config.imageWidth])

  // Compute bounds from real marker coordinates (all markers, not just filtered)
  const computedBounds = useMemo(
    () => computeBounds(markers, config.bounds, 0.06),
    // recompute only when map changes or marker count changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [config.id, markers.length]
  )

  const bounds = boundsOverride ?? computedBounds

  const [draftBounds, setDraftBounds] = useState<MapBounds>(bounds)

  useEffect(() => {
    if (!isEditingBounds) {
      setDraftBounds(bounds)
    }
  }, [bounds, isEditingBounds])

  const { transform, onMouseDown, onMouseMove, onMouseUp, onTouchStart, onTouchMove, onTouchEnd, reset, zoomIn, zoomOut } =
    usePanZoom(containerRef)

  // Selecting a marker does NOT pan/zoom — user controls the viewport manually
  const handleMarkerClick = useCallback(
    (marker: Marker) => {
      onSelectMarker(selectedMarker?.uid === marker.uid ? null : marker)
    },
    [selectedMarker, onSelectMarker]
  )

  const handleCanvasClick = useCallback(() => {
    onSelectMarker(null)
  }, [onSelectMarker])

  const applyBounds = useCallback(() => {
    const next: MapBounds = {
      minX: Number(draftBounds.minX),
      maxX: Number(draftBounds.maxX),
      minY: Number(draftBounds.minY),
      maxY: Number(draftBounds.maxY),
    }
    if (next.minX >= next.maxX || next.minY >= next.maxY) return
    onSetBoundsOverride(next)
    setIsEditingBounds(false)
  }, [draftBounds, onSetBoundsOverride])

  const resetBounds = useCallback(() => {
    setDraftBounds(computedBounds)
    onSetBoundsOverride(null)
    setIsEditingBounds(false)
  }, [computedBounds, onSetBoundsOverride])

  return (
    <div className="relative w-full h-full overflow-hidden bg-[oklch(0.11_0.005_240)]">
      {/* Pan / zoom container */}
      <div
        ref={containerRef}
        className="map-canvas w-full h-full"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onClick={handleCanvasClick}
        aria-label={`${config.displayName} map`}
      >
        {/* Transformed layer */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
            transformOrigin: "0 0",
            willChange: "transform",
          }}
        >
          <div
            style={{
              position: "relative",
              width: "100%",
              paddingTop: `${aspectRatio * 100}%`,
            }}
          >
            {activeImageUrl ? (
              <img
                key={`${activeImageUrl}-${imageRotation}`}
                src={activeImageUrl}
                alt={`${config.displayName} map`}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  transform: imageRotation ? `rotate(${imageRotation}deg)` : undefined,
                  transformOrigin: "center center",
                }}
                draggable={false}
                onError={() => {
                  if (!customImageUrl) setCdnFailed(true)
                }}
              />
            ) : (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage:
                    "linear-gradient(oklch(0.22 0.005 240) 1px, transparent 1px), linear-gradient(90deg, oklch(0.22 0.005 240) 1px, transparent 1px)",
                  backgroundSize: "48px 48px",
                  backgroundColor: "oklch(0.14 0.005 240)",
                }}
              />
            )}

            <div
              style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
              }}
            >
              {markers.map((marker) => {
                const { px, py } = coordToPercent(marker.geometry.x, marker.geometry.y, bounds)
                return (
                  <div
                    key={marker.uid}
                    style={{
                      position: "absolute",
                      left: `${px * 100}%`,
                      top: `${py * 100}%`,
                      pointerEvents: "auto",
                    }}
                  >
                    <MarkerPin
                      marker={marker}
                      isSelected={selectedMarker?.uid === marker.uid}
                      scale={transform.scale}
                      onClick={handleMarkerClick}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {!hasImage && (
        <MapImageUpload
          mapName={config.displayName}
          hasImage={false}
          uploadError={uploadError}
          isOverlay
          onUpload={onUploadImage}
          onRotate={onRotateImage}
          onRemove={onRemoveImage}
        />
      )}

      <div className="absolute bottom-4 right-4 flex flex-col gap-1 z-10">
        <button
          onClick={zoomIn}
          aria-label="Zoom in"
          className="w-8 h-8 flex items-center justify-center bg-card border border-border rounded text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        >
          <ZoomIn size={14} />
        </button>
        <button
          onClick={zoomOut}
          aria-label="Zoom out"
          className="w-8 h-8 flex items-center justify-center bg-card border border-border rounded text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        >
          <ZoomOut size={14} />
        </button>
        <button
          onClick={reset}
          aria-label="Reset view"
          className="w-8 h-8 flex items-center justify-center bg-card border border-border rounded text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        >
          <RotateCcw size={14} />
        </button>
        <div className="h-px bg-border mx-1 my-0.5" />
        <MapImageUpload
          mapName={config.displayName}
          hasImage={hasImage}
          uploadError={uploadError}
          isOverlay={false}
          onUpload={onUploadImage}
          onRotate={onRotateImage}
          onRemove={onRemoveImage}
          onEditBounds={() => setIsEditingBounds((v) => !v)}
        />
      </div>

      {isEditingBounds && (
        <div className="absolute top-4 left-4 z-20 w-72 rounded border border-border bg-card/95 p-3 shadow-lg backdrop-blur">
          <p className="text-xs font-semibold mb-2">Edit marker bounds</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {([
              ["minX", draftBounds.minX],
              ["maxX", draftBounds.maxX],
              ["minY", draftBounds.minY],
              ["maxY", draftBounds.maxY],
            ] as const).map(([key, value]) => (
              <label key={key} className="flex flex-col gap-1">
                <span className="text-muted-foreground">{key}</span>
                <input
                  type="number"
                  value={value}
                  onChange={(e) => {
                    const next = Number(e.target.value)
                    setDraftBounds((prev) => ({ ...prev, [key]: Number.isNaN(next) ? 0 : next }))
                  }}
                  className="h-8 rounded border border-border bg-background px-2 text-xs"
                />
              </label>
            ))}
          </div>
          {(draftBounds.minX >= draftBounds.maxX || draftBounds.minY >= draftBounds.maxY) && (
            <p className="text-[11px] text-destructive mt-2">min values must be lower than max values.</p>
          )}
          <div className="mt-3 flex justify-end gap-2">
            <button
              onClick={() => setIsEditingBounds(false)}
              className="h-8 px-2 text-xs rounded border border-border hover:bg-secondary"
            >
              Cancel
            </button>
            <button onClick={resetBounds} className="h-8 px-2 text-xs rounded border border-border hover:bg-secondary">
              Reset auto
            </button>
            <button
              onClick={applyBounds}
              disabled={draftBounds.minX >= draftBounds.maxX || draftBounds.minY >= draftBounds.maxY}
              className="h-8 px-2 text-xs rounded bg-primary text-primary-foreground disabled:opacity-50"
            >
              Apply
            </button>
          </div>
        </div>
      )}

      <div className="absolute bottom-4 left-4 z-10 pointer-events-none">
        <span className="text-[10px] text-muted-foreground bg-card/80 border border-border px-2 py-1 rounded tabular-nums">
          {Math.round(transform.scale * 100)}%
        </span>
      </div>

      <div className="absolute top-4 right-4 z-10 pointer-events-none flex flex-col items-end gap-1">
        <span className="text-[10px] text-muted-foreground bg-card/80 border border-border px-2 py-1 rounded tabular-nums">
          {markers.length} markers
        </span>
        {boundsOverride && (
          <span className="text-[10px] text-primary bg-card/80 border border-border px-2 py-1 rounded">Using custom bounds</span>
        )}
      </div>
    </div>
  )
}
