"use client"

import { useState, useRef, useCallback, useEffect } from "react"

export interface Transform {
  x: number // pan offset X
  y: number // pan offset Y
  scale: number // zoom level
}

const MIN_SCALE = 0.5
const MAX_SCALE = 8
const ZOOM_FACTOR = 0.12

export function usePanZoom(containerRef: React.RefObject<HTMLDivElement | null>) {
  const [transform, setTransform] = useState<Transform>({ x: 0, y: 0, scale: 1 })
  const isPanning = useRef(false)
  const lastPos = useRef({ x: 0, y: 0 })

  const clampScale = (s: number) => Math.max(MIN_SCALE, Math.min(MAX_SCALE, s))

  // ---- Wheel zoom ----
  const onWheel = useCallback((e: WheelEvent) => {
    e.preventDefault()
    const container = containerRef.current
    if (!container) return

    const rect = container.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    setTransform((prev) => {
      const delta = e.deltaY < 0 ? 1 + ZOOM_FACTOR : 1 - ZOOM_FACTOR
      const newScale = clampScale(prev.scale * delta)
      const ratio = newScale / prev.scale

      // Zoom towards mouse pointer
      const newX = mouseX - ratio * (mouseX - prev.x)
      const newY = mouseY - ratio * (mouseY - prev.y)

      return { x: newX, y: newY, scale: newScale }
    })
  }, [containerRef])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    el.addEventListener("wheel", onWheel, { passive: false })
    // Prevent browser scroll while pinch-zooming
    const preventTouchDefault = (e: TouchEvent) => {
      if (e.touches.length > 1) e.preventDefault()
    }
    el.addEventListener("touchmove", preventTouchDefault, { passive: false })
    return () => {
      el.removeEventListener("wheel", onWheel)
      el.removeEventListener("touchmove", preventTouchDefault)
    }
  }, [containerRef, onWheel])

  // ---- Mouse pan ----
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return
    isPanning.current = true
    lastPos.current = { x: e.clientX, y: e.clientY }
  }, [])

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isPanning.current) return
    const dx = e.clientX - lastPos.current.x
    const dy = e.clientY - lastPos.current.y
    lastPos.current = { x: e.clientX, y: e.clientY }
    setTransform((prev) => ({ ...prev, x: prev.x + dx, y: prev.y + dy }))
  }, [])

  const onMouseUp = useCallback(() => {
    isPanning.current = false
  }, [])

  // ---- Touch pan/pinch ----
  const lastTouches = useRef<Touch[]>([])

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    lastTouches.current = Array.from(e.touches)
  }, [])

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault()
    const touches = Array.from(e.touches)

    if (touches.length === 1 && lastTouches.current.length === 1) {
      const dx = touches[0].clientX - lastTouches.current[0].clientX
      const dy = touches[0].clientY - lastTouches.current[0].clientY
      setTransform((prev) => ({ ...prev, x: prev.x + dx, y: prev.y + dy }))
    }

    if (touches.length === 2 && lastTouches.current.length === 2) {
      const prevDist = Math.hypot(
        lastTouches.current[1].clientX - lastTouches.current[0].clientX,
        lastTouches.current[1].clientY - lastTouches.current[0].clientY
      )
      const curDist = Math.hypot(
        touches[1].clientX - touches[0].clientX,
        touches[1].clientY - touches[0].clientY
      )
      if (prevDist > 0) {
        const delta = curDist / prevDist
        setTransform((prev) => ({ ...prev, scale: clampScale(prev.scale * delta) }))
      }
    }

    lastTouches.current = touches
  }, [])

  const onTouchEnd = useCallback(() => {
    lastTouches.current = []
  }, [])

  // ---- Utility actions ----
  const reset = useCallback(() => {
    setTransform({ x: 0, y: 0, scale: 1 })
  }, [])

  const zoomIn = useCallback(() => {
    setTransform((prev) => ({ ...prev, scale: clampScale(prev.scale * (1 + ZOOM_FACTOR * 3)) }))
  }, [])

  const zoomOut = useCallback(() => {
    setTransform((prev) => ({ ...prev, scale: clampScale(prev.scale * (1 - ZOOM_FACTOR * 3)) }))
  }, [])

  /**
   * Pan + zoom so a given [0,1] fractional position is centred in the container.
   */
  /**
   * Pan + zoom so a given fractional position (0–1 in image space) is centred
   * in the viewport. aspectRatio = imageHeight / imageWidth so we can correctly
   * compute the pixel position in the aspect-ratio-padded image box.
   */
  const centerOn = useCallback(
    (fx: number, fy: number, targetScale = 2.5, aspectRatio = 1) => {
      const container = containerRef.current
      if (!container) return

      const { width, height } = container.getBoundingClientRect()
      // Image occupies full container width; height = width * aspectRatio
      const imgW = width
      const imgH = width * aspectRatio
      const newScale = clampScale(targetScale)
      const newX = width / 2 - fx * imgW * newScale
      const newY = height / 2 - fy * imgH * newScale
      setTransform({ x: newX, y: newY, scale: newScale })
    },
    [containerRef]
  )

  return {
    transform,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    reset,
    zoomIn,
    zoomOut,
    centerOn,
  }
}
