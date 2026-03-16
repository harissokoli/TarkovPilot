import { getLocalized } from '../utils/localization';
import type { MarkerEntity } from '../types/models';

interface Props {
  marker: MarkerEntity | null;
  language: string;
}

export const MarkerDetailsPanel = ({ marker, language }: Props): JSX.Element => {
  if (!marker) {
    return <section className="rounded-lg bg-panel p-4 text-sm text-slate-400">Select a marker to view details.</section>;
  }

  const images = marker.imgs ?? [];

  return (
    <section className="space-y-3 rounded-lg bg-panel p-4 text-sm">
      <h2 className="text-base font-semibold">{getLocalized(marker.name, marker.name_l10n, language) || marker.name}</h2>
      <div className="text-slate-300">{getLocalized(marker.desc, marker.desc_l10n, language) || 'No description available.'}</div>
      <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
        <div>Category: {marker.category}</div>
        <div>Subcategory: {marker.subCategory ?? 'Unknown'}</div>
        <div>Level: {marker.level ?? 0}</div>
        <div>Updated: {new Date(marker.updated).toLocaleDateString()}</div>
      </div>
      {marker.itemsUid && marker.itemsUid.length > 0 ? (
        <div className="text-xs text-slate-300">Related: {marker.itemsUid.join(', ')}</div>
      ) : null}
      <div className="grid grid-cols-2 gap-2">
        {images.map((image) => (
          <img
            key={image.img}
            src={image.img}
            alt={marker.name}
            className="h-24 w-full rounded object-cover"
            loading="lazy"
            onError={(event) => {
              event.currentTarget.style.display = 'none';
            }}
          />
        ))}
      </div>
    </section>
  );
};
