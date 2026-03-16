"use client"

import { useRef, useCallback, useState, useMemo } from "react"
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react"
import type { Marker } from "@/types/marker"
import type { MapConfig } from "@/types/map"
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
  onUploadImage: (file: File) => Promise<void>
  onRotateImage: () => void
  onRemoveImage: () => void
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
  onUploadImage,
  onRotateImage,
  onRemoveImage,
}: MapCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [cdnFailed, setCdnFailed] = useState(false)

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
  const bounds = useMemo(
    () => computeBounds(markers, config.bounds, 0.06),
    // recompute only when map changes or marker count changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [config.id, markers.length]
  )

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
          {/*
           * Aspect-ratio box: padding-top % = (imageHeight / imageWidth) * 100
           * This gives the wrapper a real pixel height so the absolute-positioned
           * marker overlay has correct dimensions to anchor left/top % against.
           * When a custom image is uploaded we use its natural dimensions so
           * markers are recalculated against the actual image pixel space.
           */}
          <div
            style={{
              position: "relative",
              width: "100%",
              paddingTop: `${aspectRatio * 100}%`,
            }}
          >
            {/* Map image */}
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
                  // Use contain so the image is never stretched/distorted.
                  // The aspect-ratio wrapper already matches the image's own ratio
                  // so contain effectively fills the box without deformation.
                  objectFit: "contain",
                  // Apply rotation around the image centre
                  transform: imageRotation ? `rotate(${imageRotation}deg)` : undefined,
                  transformOrigin: "center center",
                }}
                draggable={false}
                onError={() => {
                  if (!customImageUrl) setCdnFailed(true)
                }}
              />
            ) : (
              // Dark grid placeholder when no image available
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

            {/* Marker layer — same bounds as the image */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
              }}
            >
              {markers.map((marker) => {
                const { px, py } = coordToPercent(
                  marker.geometry.x,
                  marker.geometry.y,
                  bounds
                )
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

      {/* Upload overlay — shown when there is no map image */}
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

      {/* Zoom controls + image management */}
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
        />
      </div>

      {/* Zoom level indicator */}
      <div className="absolute bottom-4 left-4 z-10 pointer-events-none">
        <span className="text-[10px] text-muted-foreground bg-card/80 border border-border px-2 py-1 rounded tabular-nums">
          {Math.round(transform.scale * 100)}%
        </span>
      </div>

      {/* Marker count */}
      <div className="absolute top-4 right-4 z-10 pointer-events-none">
        <span className="text-[10px] text-muted-foreground bg-card/80 border border-border px-2 py-1 rounded tabular-nums">
          {markers.length} markers
        </span>
      </div>
    </div>
  )
}
