import { useMemo } from 'react';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import type { MapMetadata, MarkerEntity } from '../types/models';
import { MarkerLayer } from './MarkerLayer';

interface Props {
  metadata: MapMetadata;
  level: number;
  markers: MarkerEntity[];
  selectedUid: string | null;
  onSelectMarker: (uid: string) => void;
}

export const MapCanvas = ({ metadata, level, markers, selectedUid, onSelectMarker }: Props): JSX.Element => {
  const levelData = useMemo(
    () => metadata.levels.find((entry) => entry.id === level) ?? metadata.levels[0],
    [level, metadata.levels]
  );

  return (
    <div className="relative h-[65vh] min-h-[420px] overflow-hidden rounded-lg border border-slate-700 bg-slate-900">
      <TransformWrapper initialScale={metadata.defaultZoom} minScale={0.5} maxScale={4} centerOnInit>
        {({ resetTransform, zoomIn, zoomOut }) => (
          <>
            <div className="absolute right-3 top-3 z-30 flex gap-2">
              <button onClick={() => zoomIn()} className="rounded bg-slate-800 px-2 py-1 text-xs">+</button>
              <button onClick={() => zoomOut()} className="rounded bg-slate-800 px-2 py-1 text-xs">-</button>
              <button onClick={() => resetTransform()} className="rounded bg-slate-800 px-2 py-1 text-xs">Reset</button>
            </div>
            <TransformComponent wrapperClass="!w-full !h-full" contentClass="!w-fit !h-fit">
              <div className="relative" style={{ width: metadata.width, height: metadata.height }}>
                <img
                  src={levelData?.imagePath}
                  alt={metadata.displayName}
                  className="h-full w-full object-contain"
                  draggable={false}
                />
                <MarkerLayer markers={markers} selectedUid={selectedUid} onSelect={onSelectMarker} />
              </div>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </div>
  );
};
