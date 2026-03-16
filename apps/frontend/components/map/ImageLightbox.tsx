"use client"

import { useState, useEffect, useCallback } from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import type { MarkerImage } from "@/types/marker"

interface ImageLightboxProps {
  images: MarkerImage[]
  initialIndex?: number
  onClose: () => void
}

export function ImageLightbox({ images, initialIndex = 0, onClose }: ImageLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)

  const prev = useCallback(() => {
    setCurrentIndex((i) => (i > 0 ? i - 1 : images.length - 1))
  }, [images.length])

  const next = useCallback(() => {
    setCurrentIndex((i) => (i < images.length - 1 ? i + 1 : 0))
  }, [images.length])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowLeft") prev()
      if (e.key === "ArrowRight") next()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [onClose, prev, next])

  const current = images[currentIndex]
  if (!current) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
      onClick={onClose}
      role="dialog"
      aria-modal
      aria-label="Image viewer"
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-card border border-border text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Close"
      >
        <X size={16} />
      </button>

      {images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); prev() }}
            className="absolute left-4 w-9 h-9 flex items-center justify-center rounded-full bg-card border border-border text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Previous image"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); next() }}
            className="absolute right-16 w-9 h-9 flex items-center justify-center rounded-full bg-card border border-border text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Next image"
          >
            <ChevronRight size={16} />
          </button>
        </>
      )}

      <div className="max-w-3xl max-h-[80vh] px-16" onClick={(e) => e.stopPropagation()}>
        <img
          src={current.img}
          alt={current.name ?? "Marker image"}
          className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
        />
        {(current.name || images.length > 1) && (
          <div className="mt-3 flex items-center justify-between px-1">
            {current.name && (
              <p className="text-sm text-muted-foreground">{current.name}</p>
            )}
            {images.length > 1 && (
              <p className="text-xs text-muted-foreground ml-auto tabular-nums">
                {currentIndex + 1} / {images.length}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
