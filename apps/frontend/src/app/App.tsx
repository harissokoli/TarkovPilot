import { useEffect, useMemo, useState } from 'react';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { useLocalStorageState } from '../hooks/useLocalStorageState';
import { CategorySidebar } from '../features/maps/components/CategorySidebar';
import { LevelSelector } from '../features/maps/components/LevelSelector';
import { MapCanvas } from '../features/maps/components/MapCanvas';
import { MapSelector } from '../features/maps/components/MapSelector';
import { MarkerDetailsPanel } from '../features/maps/components/MarkerDetailsPanel';
import { SearchInput } from '../features/maps/components/SearchInput';
import { loadBundledMarkers, loadMarkersFromFile } from '../features/maps/lib/markerLoader';
import { useMapExplorer } from '../features/maps/hooks/useMapExplorer';
import { supportedMaps } from '../features/maps/data/mapConfig';
import type { MarkerEntity } from '../features/maps/types/models';

export const App = (): JSX.Element => {
  const [markers, setMarkers] = useState<MarkerEntity[]>(() => loadBundledMarkers());
  const [language, setLanguage] = useLocalStorageState<string>('tp-language', 'en');
  const explorer = useMapExplorer(markers);

  useEffect(() => {
    if (explorer.state.language !== language) {
      explorer.patchState({ language });
    }
  }, [explorer.patchState, explorer.state.language, language]);

  const availableLanguages = useMemo(() => {
    const values = new Set<string>(['en']);
    markers.forEach((marker) => {
      Object.keys(marker.name_l10n ?? {}).forEach((lang) => values.add(lang));
      Object.keys(marker.desc_l10n ?? {}).forEach((lang) => values.add(lang));
    });
    return Array.from(values);
  }, [markers]);

  const onFileChange = async (file: File | null): Promise<void> => {
    if (!file) return;
    const loaded = await loadMarkersFromFile(file);
    setMarkers(loaded);
  };

  return (
    <ErrorBoundary>
      <div className="grid min-h-screen grid-cols-1 gap-4 p-4 lg:grid-cols-[280px_1fr_340px]">
        <div className="space-y-3">
          <h1 className="text-xl font-bold">TarkovPilot Maps</h1>
          <MapSelector maps={supportedMaps} value={explorer.state.mapId} onChange={(mapId) => explorer.patchState({ mapId })} />
          <SearchInput value={explorer.state.query} onChange={(query) => explorer.patchState({ query })} />
          <select
            value={language}
            onChange={(event) => {
              setLanguage(event.target.value);
              explorer.patchState({ language: event.target.value });
            }}
            className="w-full rounded-md border border-slate-700 bg-slate-900 p-2 text-sm"
          >
            {availableLanguages.map((lang) => (
              <option key={lang} value={lang}>{lang.toUpperCase()}</option>
            ))}
          </select>
          <input
            type="file"
            accept="application/json"
            onChange={(event) => onFileChange(event.target.files?.[0] ?? null)}
            className="w-full text-xs"
          />
          <CategorySidebar
            counts={explorer.categoryCounts}
            selected={explorer.state.selectedCategories}
            onToggle={explorer.toggleCategory}
            onClear={explorer.clearCategories}
          />
        </div>

        <div className="space-y-3">
          <LevelSelector
            levels={explorer.activeMap.levels}
            value={explorer.state.selectedLevel}
            onChange={(selectedLevel) => explorer.patchState({ selectedLevel })}
          />
          <MapCanvas
            metadata={explorer.activeMap}
            level={explorer.state.selectedLevel}
            markers={explorer.filteredMarkers}
            selectedUid={explorer.selectedUid}
            onSelectMarker={explorer.setSelectedUid}
          />
          <div className="text-xs text-slate-400">Showing {explorer.filteredMarkers.length} markers</div>
        </div>

        <MarkerDetailsPanel marker={explorer.selectedMarker} language={language} />
      </div>
    </ErrorBoundary>
  );
};
