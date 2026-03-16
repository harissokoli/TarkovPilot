"use client"

import { useRef, useCallback, useState } from "react"
import { Upload, ImagePlus, Trash2, RotateCw, RefreshCw, AlertCircle, Pencil } from "lucide-react"

interface MapImageUploadProps {
  mapName: string
  hasImage: boolean
  uploadError: string | null
  isOverlay?: boolean
  onUpload: (file: File) => Promise<void>
  onRotate: () => void
  onRemove: () => void
  onEditBounds?: () => void
}

export function MapImageUpload({
  mapName,
  hasImage,
  uploadError,
  isOverlay = false,
  onUpload,
  onRotate,
  onRemove,
  onEditBounds,
}: MapImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) return
      setIsUploading(true)
      try {
        await onUpload(file)
      } finally {
        setIsUploading(false)
      }
    },
    [onUpload]
  )

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) handleFile(file)
      // Reset so the same file can be re-selected
      e.target.value = ""
    },
    [handleFile]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files?.[0]
      if (file) handleFile(file)
    },
    [handleFile]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => setIsDragging(false), [])

  // ── Toolbar variant ──────────────────────────────────────────────────────
  if (!isOverlay) {
    return (
      <div className="flex flex-col gap-1">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={handleInputChange}
          aria-label={`Upload map image for ${mapName}`}
        />
        {/* Upload / Replace */}
        <button
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          title={hasImage ? `Replace ${mapName} image` : `Upload ${mapName} image`}
          aria-label={hasImage ? `Replace ${mapName} image` : `Upload ${mapName} image`}
          className="w-8 h-8 flex items-center justify-center bg-card border border-border rounded text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors disabled:opacity-50"
        >
          {isUploading ? (
            <RefreshCw size={14} className="animate-spin" />
          ) : (
            <ImagePlus size={14} />
          )}
        </button>
        {/* Rotate — only when image exists */}
        {hasImage && (
          <button
            onClick={onRotate}
            title="Rotate image 90°"
            aria-label="Rotate map image 90 degrees clockwise"
            className="w-8 h-8 flex items-center justify-center bg-card border border-border rounded text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <RotateCw size={14} />
          </button>
        )}
        {hasImage && onEditBounds && (
          <button
            onClick={onEditBounds}
            title="Edit marker bounds"
            aria-label="Edit marker coordinate bounds"
            className="w-8 h-8 flex items-center justify-center bg-card border border-border rounded text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <Pencil size={14} />
          </button>
        )}
        {/* Remove — only when image exists */}
        {hasImage && (
          <button
            onClick={onRemove}
            title="Remove custom map image"
            aria-label="Remove custom map image"
            className="w-8 h-8 flex items-center justify-center bg-card border border-border rounded text-muted-foreground hover:text-destructive hover:bg-secondary transition-colors"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
    )
  }

  // ── Overlay variant ──────────────────────────────────────────────────────
  return (
    <div
      className={`absolute inset-0 flex flex-col items-center justify-center z-10 transition-colors ${
        isDragging ? "bg-primary/10" : "bg-background/60"
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={handleInputChange}
        aria-label={`Upload map image for ${mapName}`}
      />

      <div
        className={`flex flex-col items-center gap-4 p-8 rounded-lg border-2 border-dashed max-w-sm w-full text-center transition-colors cursor-pointer ${
          isDragging
            ? "border-primary bg-primary/5 text-primary"
            : "border-border bg-card/90 text-muted-foreground hover:border-primary/50 hover:text-foreground"
        }`}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        aria-label={`Upload map image for ${mapName}`}
      >
        {isUploading ? (
          <RefreshCw size={32} className="animate-spin text-primary" />
        ) : (
          <Upload size={32} className={isDragging ? "text-primary" : ""} />
        )}
        <div>
          <p className="text-sm font-medium text-foreground mb-1">
            {isUploading ? "Loading image…" : `Upload ${mapName} map image`}
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Drag and drop or click to select a PNG, JPG, or WebP file.
            <br />
            Stored locally in your browser. Max ~4 MB recommended.
          </p>
        </div>
      </div>

      {/* Error message */}
      {uploadError && (
        <div className="mt-3 flex items-start gap-2 max-w-sm w-full bg-destructive/10 border border-destructive/30 rounded px-3 py-2">
          <AlertCircle size={14} className="text-destructive mt-0.5 shrink-0" />
          <p className="text-xs text-destructive leading-relaxed">{uploadError}</p>
        </div>
      )}
    </div>
  )
}
