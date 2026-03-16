"use client"

import { useState, useCallback, useEffect } from "react"

export interface ImageDimensions {
  width: number
  height: number
}

export interface MapImageState {
  dataUrl: string
  width: number
  height: number
  rotation: 0 | 90 | 180 | 270
}

const urlKey  = (id: string) => `tarkov-map-image:${id}`
const metaKey = (id: string) => `tarkov-map-meta:${id}`

function readFromStorage(mapId: string): MapImageState | null {
  if (typeof window === "undefined") return null
  try {
    const dataUrl = localStorage.getItem(urlKey(mapId))
    if (!dataUrl) return null
    const raw  = localStorage.getItem(metaKey(mapId))
    const meta = raw ? JSON.parse(raw) : { width: 1024, height: 1024, rotation: 0 }
    return {
      dataUrl,
      width:    meta.width    ?? 1024,
      height:   meta.height   ?? 1024,
      rotation: meta.rotation ?? 0,
    }
  } catch {
    return null
  }
}

function writeToStorage(mapId: string, state: MapImageState): boolean {
  try {
    localStorage.setItem(urlKey(mapId), state.dataUrl)
    localStorage.setItem(metaKey(mapId), JSON.stringify({
      width:    state.width,
      height:   state.height,
      rotation: state.rotation,
    }))
    return true
  } catch (e) {
    console.warn("[map-images] localStorage write failed:", e)
    return false
  }
}

function removeFromStorage(mapId: string) {
  try {
    localStorage.removeItem(urlKey(mapId))
    localStorage.removeItem(metaKey(mapId))
  } catch { /* ignore */ }
}

function measureImage(dataUrl: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload  = () => resolve({ width: img.naturalWidth, height: img.naturalHeight })
    img.onerror = () => resolve({ width: 1024, height: 1024 })
    img.src = dataUrl
  })
}

export function useMapImages(mapId: string) {
  const [state, setState] = useState<MapImageState | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)

  // Load from storage when map changes
  useEffect(() => {
    setState(readFromStorage(mapId))
    setUploadError(null)
  }, [mapId])

  const uploadImage = useCallback(
    (file: File): Promise<void> => {
      return new Promise((resolve, reject) => {
        setUploadError(null)

        if (!file.type.startsWith("image/")) {
          const msg = "File must be an image (PNG, JPG, WebP, etc.)"
          setUploadError(msg)
          reject(new Error(msg))
          return
        }

        // Warn if the file is very large — localStorage limit is ~5 MB
        if (file.size > 4 * 1024 * 1024) {
          setUploadError("Image is over 4 MB. It may not save properly. Try a smaller file.")
        }

        const reader = new FileReader()
        reader.onload = async (e) => {
          try {
            const dataUrl = e.target?.result as string
            if (!dataUrl) throw new Error("Failed to read file")

            const { width, height } = await measureImage(dataUrl)
            const newState: MapImageState = { dataUrl, width, height, rotation: 0 }

            const saved = writeToStorage(mapId, newState)
            if (!saved) {
              setUploadError("Image too large to store locally. Try a compressed image under 4 MB.")
            }

            setState(newState)
            resolve()
          } catch (err) {
            const msg = err instanceof Error ? err.message : "Upload failed"
            setUploadError(msg)
            reject(err)
          }
        }
        reader.onerror = () => {
          const msg = "Could not read the file. Please try again."
          setUploadError(msg)
          reject(new Error(msg))
        }
        reader.readAsDataURL(file)
      })
    },
    [mapId]
  )

  const rotateImage = useCallback(() => {
    setState((prev) => {
      if (!prev) return prev
      const next: MapImageState = {
        ...prev,
        rotation: ((prev.rotation + 90) % 360) as 0 | 90 | 180 | 270,
      }
      writeToStorage(mapId, next)
      return next
    })
  }, [mapId])

  const removeImage = useCallback(() => {
    removeFromStorage(mapId)
    setState(null)
    setUploadError(null)
  }, [mapId])

  // Derive the effective aspect ratio accounting for rotation
  // When rotated 90 or 270 degrees, width and height are swapped
  const effectiveDimensions: ImageDimensions | null = state
    ? (state.rotation === 90 || state.rotation === 270)
      ? { width: state.height, height: state.width }
      : { width: state.width,  height: state.height }
    : null

  return {
    customImageUrl:     state?.dataUrl ?? null,
    imageRotation:      state?.rotation ?? 0,
    imageDimensions:    effectiveDimensions,
    uploadError,
    uploadImage,
    rotateImage,
    removeImage,
  }
}
