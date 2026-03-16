import type { CategoryInfo } from "@/types/marker"

export const CATEGORY_CONFIG: Record<string, CategoryInfo> = {
  Extractions: {
    name: "Extractions",
    color: "#22c55e",
    bgColor: "rgba(34,197,94,0.15)",
    icon: "→",
  },
  Keys: {
    name: "Keys",
    color: "#f59e0b",
    bgColor: "rgba(245,158,11,0.15)",
    icon: "K",
  },
  Loot: {
    name: "Loot",
    color: "#a78bfa",
    bgColor: "rgba(167,139,250,0.15)",
    icon: "L",
  },
  Quests: {
    name: "Quests",
    color: "#38bdf8",
    bgColor: "rgba(56,189,248,0.15)",
    icon: "Q",
  },
  Spawns: {
    name: "Spawns",
    color: "#fb923c",
    bgColor: "rgba(251,146,60,0.15)",
    icon: "S",
  },
  Miscellaneous: {
    name: "Miscellaneous",
    color: "#94a3b8",
    bgColor: "rgba(148,163,184,0.15)",
    icon: "M",
  },
}

export const FALLBACK_CATEGORY: CategoryInfo = {
  name: "Unknown",
  color: "#64748b",
  bgColor: "rgba(100,116,139,0.15)",
  icon: "?",
}

export function getCategoryInfo(category: string): CategoryInfo {
  return CATEGORY_CONFIG[category] ?? FALLBACK_CATEGORY
}

export function getCategoryColor(category: string): string {
  return getCategoryInfo(category).color
}
