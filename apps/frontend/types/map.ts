// Map configuration types

export interface MapBounds {
  minX: number
  maxX: number
  minY: number
  maxY: number
}

export interface MapLevel {
  value: number
  label: string
}

export interface MapConfig {
  id: string
  displayName: string
  imageUrl: string
  /** Natural width of the map image in pixels */
  imageWidth: number
  /** Natural height of the map image in pixels */
  imageHeight: number
  /** The coordinate bounds from the marker dataset for this map */
  bounds: MapBounds
  levels: MapLevel[]
  /** Default level to show (-1 = underground, 1 = ground, etc.) */
  defaultLevel: number | null
  /** Accent colour for UI elements for this map */
  accentColor: string
  thumbnail?: string
}
