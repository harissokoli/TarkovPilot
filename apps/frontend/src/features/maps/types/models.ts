export interface MarkerGeometry {
  x: number;
  y: number;
}

export interface MarkerImage {
  img: string;
}

export type LocalizationDictionary = Record<string, string>;

export interface MarkerItem {
  uid: string;
}

export interface MarkerEntity {
  uid: string;
  geometry: MarkerGeometry;
  updated: string;
  map: string;
  name: string;
  category: string;
  subCategory?: string;
  imgs?: MarkerImage[];
  level?: number;
  desc?: string;
  name_l10n?: LocalizationDictionary;
  desc_l10n?: LocalizationDictionary;
  itemsUid?: string[];
  [key: string]: unknown;
}

export interface MapLevel {
  id: number;
  name: string;
  imagePath: string;
}

export interface MapMetadata {
  id: string;
  displayName: string;
  width: number;
  height: number;
  levels: MapLevel[];
  defaultZoom: number;
  defaultCenter: MarkerGeometry;
  thumbnail?: string;
  themeColor?: string;
}

export interface CategoryModel {
  id: string;
  label: string;
  color: string;
}

export interface FilterState {
  mapId: string;
  selectedLevel: number;
  selectedCategories: Set<string>;
  selectedSubCategories: Set<string>;
  query: string;
  language: string;
}

export interface SelectedMarkerState {
  markerUid: string | null;
}

export interface AppSettingsState {
  sidebarOpen: boolean;
}
