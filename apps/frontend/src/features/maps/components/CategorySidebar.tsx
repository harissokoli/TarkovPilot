import { categoryPalette, unknownCategoryColor } from '../data/categories';

interface Props {
  counts: Record<string, number>;
  selected: Set<string>;
  onToggle: (category: string) => void;
  onClear: () => void;
}

export const CategorySidebar = ({ counts, selected, onToggle, onClear }: Props): JSX.Element => {
  const categories = Object.keys(counts);
  return (
    <aside className="space-y-3 rounded-lg bg-panel p-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Categories</h2>
        <button className="text-xs text-sky-300" onClick={onClear}>Clear</button>
      </div>
      <div className="space-y-2">
        {categories.map((category) => {
          const palette = categoryPalette.find((entry) => entry.id === category);
          const active = selected.size === 0 || selected.has(category);
          return (
            <button
              key={category}
              className={`flex w-full items-center justify-between rounded border px-2 py-1 text-left text-xs ${active ? 'border-slate-600 bg-slate-800' : 'border-transparent bg-slate-900/60 text-slate-500'}`}
              onClick={() => onToggle(category)}
            >
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: palette?.color ?? unknownCategoryColor }} />
                {palette?.label ?? category}
              </span>
              <span>{counts[category]}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
};
