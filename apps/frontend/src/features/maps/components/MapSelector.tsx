import type { MapMetadata } from '../types/models';

interface Props {
  maps: MapMetadata[];
  value: string;
  onChange: (mapId: string) => void;
}

export const MapSelector = ({ maps, value, onChange }: Props): JSX.Element => (
  <select
    value={value}
    onChange={(event) => onChange(event.target.value)}
    className="w-full rounded-md border border-slate-700 bg-slate-900 p-2 text-sm"
  >
    {maps.map((map) => (
      <option key={map.id} value={map.id}>
        {map.displayName}
      </option>
    ))}
  </select>
);
