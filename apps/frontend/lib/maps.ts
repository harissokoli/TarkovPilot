import type { MapConfig } from "@/types/map"

/**
 * Static map configuration.
 * Map images are served from the Tarkov Market CDN.
 * Bounds are derived from the marker coordinate ranges observed in the dataset.
 */
export const MAP_CONFIGS: Record<string, MapConfig> = {
  customs: {
    id: "customs",
    displayName: "Customs",
    imageUrl: "https://cdn.tarkov-market.app/maps/images/customs/v2.webp",
    imageWidth: 2000,
    imageHeight: 2000,
    bounds: { minX: -400, maxX: 400, minY: -400, maxY: 800 },
    levels: [
      { value: -1, label: "Basement" },
      { value: 1, label: "Ground" },
      { value: 2, label: "Upper" },
      { value: 3, label: "Roof" },
    ],
    defaultLevel: null,
    accentColor: "#f59e0b",
  },
  woods: {
    id: "woods",
    displayName: "Woods",
    imageUrl: "https://cdn.tarkov-market.app/maps/images/woods/v2.webp",
    imageWidth: 2000,
    imageHeight: 2000,
    bounds: { minX: -500, maxX: 500, minY: -500, maxY: 500 },
    levels: [{ value: 1, label: "Ground" }],
    defaultLevel: null,
    accentColor: "#84cc16",
  },
  shoreline: {
    id: "shoreline",
    displayName: "Shoreline",
    imageUrl: "https://cdn.tarkov-market.app/maps/images/shoreline/v2.webp",
    imageWidth: 2000,
    imageHeight: 2000,
    bounds: { minX: -600, maxX: 600, minY: -600, maxY: 600 },
    levels: [
      { value: -1, label: "Basement" },
      { value: 1, label: "Ground" },
      { value: 2, label: "Upper" },
      { value: 3, label: "Roof" },
    ],
    defaultLevel: null,
    accentColor: "#38bdf8",
  },
  lighthouse: {
    id: "lighthouse",
    displayName: "Lighthouse",
    imageUrl: "https://cdn.tarkov-market.app/maps/images/lighthouse/v2.webp",
    imageWidth: 2000,
    imageHeight: 2000,
    bounds: { minX: -600, maxX: 600, minY: -600, maxY: 600 },
    levels: [
      { value: 1, label: "Ground" },
      { value: 2, label: "Upper" },
    ],
    defaultLevel: null,
    accentColor: "#a78bfa",
  },
  reserve: {
    id: "reserve",
    displayName: "Reserve",
    imageUrl: "https://cdn.tarkov-market.app/maps/images/reserve/v2.webp",
    imageWidth: 2000,
    imageHeight: 2000,
    bounds: { minX: -400, maxX: 400, minY: -400, maxY: 400 },
    levels: [
      { value: -1, label: "Basement" },
      { value: 1, label: "Ground" },
      { value: 2, label: "Upper" },
    ],
    defaultLevel: null,
    accentColor: "#f97316",
  },
  factory: {
    id: "factory",
    displayName: "Factory",
    imageUrl: "https://cdn.tarkov-market.app/maps/images/factory/v2.webp",
    imageWidth: 2000,
    imageHeight: 2000,
    bounds: { minX: -200, maxX: 200, minY: -200, maxY: 200 },
    levels: [
      { value: -1, label: "Basement" },
      { value: 1, label: "Ground" },
      { value: 2, label: "Upper" },
    ],
    defaultLevel: null,
    accentColor: "#ef4444",
  },
  streets: {
    id: "streets",
    displayName: "Streets of Tarkov",
    imageUrl: "https://cdn.tarkov-market.app/maps/images/streets/v2.webp",
    imageWidth: 2000,
    imageHeight: 2000,
    bounds: { minX: -600, maxX: 600, minY: -600, maxY: 600 },
    levels: [
      { value: -1, label: "Basement" },
      { value: 1, label: "Ground" },
      { value: 2, label: "Upper" },
      { value: 3, label: "Roof" },
    ],
    defaultLevel: null,
    accentColor: "#94a3b8",
  },
  interchange: {
    id: "interchange",
    displayName: "Interchange",
    imageUrl: "https://cdn.tarkov-market.app/maps/images/interchange/v2.webp",
    imageWidth: 2000,
    imageHeight: 2000,
    bounds: { minX: -500, maxX: 500, minY: -500, maxY: 500 },
    levels: [
      { value: -1, label: "Basement" },
      { value: 1, label: "Ground" },
      { value: 2, label: "Upper" },
    ],
    defaultLevel: null,
    accentColor: "#22d3ee",
  },
}

export const MAP_ORDER = [
  "customs",
  "woods",
  "shoreline",
  "lighthouse",
  "reserve",
  "factory",
  "streets",
  "interchange",
]

export function getMapConfig(mapId: string): MapConfig | undefined {
  return MAP_CONFIGS[mapId]
}

export function getAllMaps(): MapConfig[] {
  return MAP_ORDER.map((id) => MAP_CONFIGS[id]).filter(Boolean)
}
