"use client"

import { memo } from "react"
import type { Marker } from "@/types/marker"
import { getCategoryInfo } from "@/lib/categories"

interface MarkerPinProps {
  marker: Marker
  isSelected: boolean
  scale: number
  onClick: (marker: Marker) => void
}

export const MarkerPin = memo(function MarkerPin({
  marker,
  isSelected,
  scale,
  onClick,
}: MarkerPinProps) {
  const info = getCategoryInfo(marker.category)

  // Scale marker inversely to zoom so pins stay a consistent visual size
  const pinScale = Math.max(0.4, Math.min(1.2, 1 / scale))

  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        onClick(marker)
      }}
      aria-label={`${marker.name} — ${marker.category}`}
      title={marker.name}
      className="absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none group"
      style={{
        // Position is set by parent via inline style on container
        transformOrigin: "center center",
      }}
    >
      {/* Outer ring for selection */}
      {isSelected && (
        <span
          className="absolute inset-0 rounded-full animate-ping"
          style={{
            backgroundColor: info.color,
            opacity: 0.3,
            transform: `scale(${pinScale * 2.5})`,
          }}
        />
      )}

      {/* Pin body */}
      <span
        className="relative flex items-center justify-center rounded-full font-bold transition-transform duration-100 group-hover:scale-125"
        style={{
          width: isSelected ? 20 : 16,
          height: isSelected ? 20 : 16,
          backgroundColor: isSelected ? info.color : info.bgColor,
          border: `1.5px solid ${info.color}`,
          color: info.color,
          fontSize: isSelected ? 9 : 7,
          transform: `scale(${pinScale})`,
          boxShadow: isSelected
            ? `0 0 0 2px ${info.color}40, 0 2px 8px rgba(0,0,0,0.6)`
            : "0 1px 4px rgba(0,0,0,0.5)",
        }}
      >
        {info.icon}
      </span>
    </button>
  )
})
