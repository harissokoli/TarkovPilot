"use client"

import { useState } from "react"
import { X, Calendar, Layers, Tag, Copy, Check, ExternalLink } from "lucide-react"
import type { Marker } from "@/types/marker"
import { getCategoryInfo } from "@/lib/categories"
import { getLocalizedName, getLocalizedDesc, formatUpdatedDate } from "@/lib/markers"
import { ImageLightbox } from "./ImageLightbox"

interface MarkerDetailProps {
  marker: Marker
  onClose: () => void
}

export function MarkerDetail({ marker, onClose }: MarkerDetailProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [copied, setCopied] = useState(false)

  const info = getCategoryInfo(marker.category)
  const displayName = getLocalizedName(marker)
  const displayDesc = getLocalizedDesc(marker)
  const images = marker.imgs ?? []

  const copyCoords = async () => {
    const text = `${marker.geometry.x.toFixed(2)}, ${marker.geometry.y.toFixed(2)}`
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard not available
    }
  }

  return (
    <aside
      className="flex flex-col h-full bg-card border-l border-border overflow-hidden"
      aria-label="Marker details"
    >
      {/* Header */}
      <div
        className="flex items-start gap-3 p-4 border-b border-border shrink-0"
        style={{ borderLeftColor: info.color, borderLeftWidth: 3 }}
      >
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-semibold leading-snug text-foreground text-pretty">
            {displayName}
          </h2>
          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium"
              style={{ color: info.color, backgroundColor: info.bgColor }}
            >
              {marker.category}
            </span>
            {marker.subCategory && (
              <span className="text-[10px] text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                {marker.subCategory}
              </span>
            )}
          </div>
        </div>
        <button
          onClick={onClose}
          aria-label="Close details"
          className="shrink-0 w-7 h-7 flex items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        >
          <X size={14} />
        </button>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {/* Description */}
        {displayDesc && (
          <p className="text-xs text-muted-foreground leading-relaxed">{displayDesc}</p>
        )}

        {/* Images */}
        {images.length > 0 && (
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Images
            </span>
            <div className="grid grid-cols-2 gap-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setLightboxIndex(i)}
                  className="relative aspect-video overflow-hidden rounded border border-border hover:border-primary/60 transition-colors group"
                  aria-label={img.name ? `View image: ${img.name}` : `View image ${i + 1}`}
                >
                  <img
                    src={img.img}
                    alt={img.name ?? `Marker image ${i + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    onError={(e) => {
                      e.currentTarget.style.display = "none"
                    }}
                  />
                  {img.name && (
                    <span className="absolute bottom-0 inset-x-0 bg-black/60 text-[9px] text-white px-1.5 py-0.5 truncate">
                      {img.name}
                    </span>
                  )}
                  <ExternalLink
                    size={10}
                    className="absolute top-1.5 right-1.5 text-white opacity-0 group-hover:opacity-80 transition-opacity"
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Metadata */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Details
          </span>

          <div className="flex flex-col gap-1">
            {/* Level */}
            {marker.level !== undefined && (
              <MetaRow
                icon={<Layers size={11} />}
                label="Floor"
                value={
                  marker.level === -1
                    ? "Basement"
                    : marker.level === 1
                    ? "Ground"
                    : marker.level === 2
                    ? "Upper"
                    : marker.level === 3
                    ? "Roof"
                    : String(marker.level)
                }
              />
            )}

            {/* Updated */}
            <MetaRow
              icon={<Calendar size={11} />}
              label="Updated"
              value={formatUpdatedDate(marker.updated)}
            />

            {/* Coordinates */}
            <div className="flex items-center gap-2 py-1">
              <span className="text-muted-foreground shrink-0">
                <Tag size={11} />
              </span>
              <span className="text-[11px] text-muted-foreground w-14 shrink-0">Coords</span>
              <button
                onClick={copyCoords}
                className="flex items-center gap-1 text-[11px] text-foreground font-mono hover:text-primary transition-colors"
                title="Copy to clipboard"
              >
                {marker.geometry.x.toFixed(2)}, {marker.geometry.y.toFixed(2)}
                <span className="ml-1 text-muted-foreground">
                  {copied ? <Check size={10} /> : <Copy size={10} />}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Item UIDs */}
        {marker.itemsUid && marker.itemsUid.length > 0 && (
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Related Items
            </span>
            <div className="flex flex-wrap gap-1">
              {marker.itemsUid.map((uid) => (
                <span
                  key={uid}
                  className="text-[9px] font-mono bg-secondary text-muted-foreground px-1.5 py-0.5 rounded border border-border"
                >
                  {uid}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <ImageLightbox
          images={images}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </aside>
  )
}

function MetaRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-2 py-1">
      <span className="text-muted-foreground shrink-0">{icon}</span>
      <span className="text-[11px] text-muted-foreground w-14 shrink-0">{label}</span>
      <span className="text-[11px] text-foreground">{value}</span>
    </div>
  )
}
