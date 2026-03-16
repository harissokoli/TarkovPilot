import type { FilterState, MarkerEntity } from '../types/models';
import { getLocalized } from './localization';

const norm = (value: string): string => value.toLocaleLowerCase();

export const matchesQuery = (marker: MarkerEntity, query: string, language: string): boolean => {
  if (!query.trim()) return true;
  const target = norm(query);
  const name = norm(getLocalized(marker.name, marker.name_l10n, language));
  const desc = norm(getLocalized(marker.desc, marker.desc_l10n, language));
  return name.includes(target) || desc.includes(target);
};

export const filterMarkers = (markers: MarkerEntity[], state: FilterState): MarkerEntity[] =>
  markers.filter((marker) => {
    if (marker.map !== state.mapId) return false;
    if ((marker.level ?? 0) !== state.selectedLevel) return false;
    if (state.selectedCategories.size > 0 && !state.selectedCategories.has(marker.category)) return false;
    if (state.selectedSubCategories.size > 0) {
      const sub = marker.subCategory ?? 'Unknown';
      if (!state.selectedSubCategories.has(sub)) return false;
    }
    return matchesQuery(marker, state.query, state.language);
  });

export const getCategoryCounts = (markers: MarkerEntity[]): Record<string, number> =>
  markers.reduce<Record<string, number>>((acc, marker) => {
    acc[marker.category] = (acc[marker.category] ?? 0) + 1;
    return acc;
  }, {});
