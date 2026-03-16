// Core marker types from the JSON dataset

export interface MarkerGeometry {
  x: number
  y: number
}

export interface MarkerImage {
  img: string
  name?: string
}

export type LocalizationDict = Partial<Record<string, string>>

export interface Marker {
  uid: string
  geometry: MarkerGeometry
  updated: string
  map: string
  name: string
  category: string
  subCategory?: string
  imgs?: MarkerImage[]
  level?: number
  desc?: string
  name_l10n?: LocalizationDict
  desc_l10n?: LocalizationDict
  itemsUid?: string[]
  questUid?: string
  questObjIx?: number
}

// Derived / UI types

export interface CategoryInfo {
  name: string
  color: string
  bgColor: string
  icon: string
}

export interface SubCategoryCount {
  subCategory: string
  count: number
}

export interface CategoryCount {
  category: string
  count: number
  subCategories: SubCategoryCount[]
}

export interface FilterState {
  categories: Set<string>
  subCategories: Set<string>
  search: string
  level: number | null // null = all levels
}

export interface SelectedMarkerState {
  marker: Marker | null
}

export type SupportedLanguage = "en"
