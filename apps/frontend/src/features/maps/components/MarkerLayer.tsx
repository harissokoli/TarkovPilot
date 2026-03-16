import { memo } from 'react';
import { categoryPalette, unknownCategoryColor } from '../data/categories';
import type { MarkerEntity } from '../types/models';

interface MarkerDotProps {
  marker: MarkerEntity;
  selected: boolean;
  onSelect: (uid: string) => void;
}

const MarkerDot = memo(({ marker, selected, onSelect }: MarkerDotProps): JSX.Element => {
  const color = categoryPalette.find((entry) => entry.id === marker.category)?.color ?? unknownCategoryColor;
  return (
    <button
      title={marker.name}
      onClick={() => onSelect(marker.uid)}
      className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 ${selected ? 'z-20 h-5 w-5 border-white' : 'z-10 h-4 w-4 border-slate-900'}`}
      style={{ left: marker.geometry.x, top: marker.geometry.y, backgroundColor: color }}
    />
  );
});

interface Props {
  markers: MarkerEntity[];
  selectedUid: string | null;
  onSelect: (uid: string) => void;
}

export const MarkerLayer = ({ markers, selectedUid, onSelect }: Props): JSX.Element => (
  <div className="absolute inset-0">
    {markers.map((marker) => (
      <MarkerDot key={marker.uid} marker={marker} selected={selectedUid === marker.uid} onSelect={onSelect} />
    ))}
  </div>
);
