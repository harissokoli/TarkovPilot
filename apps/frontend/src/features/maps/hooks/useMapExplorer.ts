import { useCallback, useMemo, useState } from 'react';
import { mapConfig } from '../data/mapConfig';
import type { FilterState, MarkerEntity } from '../types/models';
import { filterMarkers, getCategoryCounts } from '../utils/filters';

const parseSet = (value: string | null): Set<string> => new Set(value ? value.split(',').filter(Boolean) : []);

export const useMapExplorer = (markers: MarkerEntity[]) => {
  const params = new URLSearchParams(window.location.search);
  const [state, setState] = useState<FilterState>({
    mapId: params.get('map') ?? 'woods',
    selectedLevel: Number(params.get('level') ?? 0),
    selectedCategories: parseSet(params.get('cats')),
    selectedSubCategories: new Set<string>(),
    query: params.get('q') ?? '',
    language: params.get('lang') ?? 'en'
  });
  const [selectedUid, setSelectedUid] = useState<string | null>(params.get('marker'));

  const activeMap = mapConfig[state.mapId] ?? Object.values(mapConfig)[0];

  const mapMarkers = useMemo(() => markers.filter((marker) => marker.map === state.mapId), [markers, state.mapId]);
  const filteredMarkers = useMemo(() => filterMarkers(mapMarkers, state), [mapMarkers, state]);
  const categoryCounts = useMemo(() => getCategoryCounts(mapMarkers), [mapMarkers]);

  const selectedMarker = useMemo(
    () => filteredMarkers.find((marker) => marker.uid === selectedUid) ?? null,
    [filteredMarkers, selectedUid]
  );

  const patchState = useCallback((patch: Partial<FilterState>) => {
    setState((prev) => ({ ...prev, ...patch }));
  }, []);

  const toggleCategory = useCallback((category: string) => {
    setState((prev) => {
      const next = new Set(prev.selectedCategories);
      if (next.has(category)) next.delete(category);
      else next.add(category);
      return { ...prev, selectedCategories: next };
    });
  }, []);

  const clearCategories = useCallback(() => {
    setState((prev) => ({ ...prev, selectedCategories: new Set<string>() }));
  }, []);

  return {
    state,
    patchState,
    toggleCategory,
    clearCategories,
    activeMap,
    filteredMarkers,
    categoryCounts,
    selectedUid,
    setSelectedUid,
    selectedMarker
  };
};
