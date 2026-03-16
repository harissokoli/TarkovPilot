import type { MapLevel } from '../types/models';

interface Props {
  levels: MapLevel[];
  value: number;
  onChange: (level: number) => void;
}

export const LevelSelector = ({ levels, value, onChange }: Props): JSX.Element | null => {
  if (levels.length <= 1) return null;
  return (
    <div className="flex gap-2">
      {levels.map((level) => (
        <button
          key={level.id}
          onClick={() => onChange(level.id)}
          className={`rounded px-3 py-1 text-xs ${value === level.id ? 'bg-sky-500 text-white' : 'bg-slate-800 text-slate-300'}`}
        >
          {level.name}
        </button>
      ))}
    </div>
  );
};
