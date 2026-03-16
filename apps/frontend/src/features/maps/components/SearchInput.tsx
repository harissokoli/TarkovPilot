interface Props {
  value: string;
  onChange: (value: string) => void;
}

export const SearchInput = ({ value, onChange }: Props): JSX.Element => (
  <input
    value={value}
    onChange={(event) => onChange(event.target.value)}
    placeholder="Search markers..."
    className="w-full rounded-md border border-slate-700 bg-slate-900 p-2 text-sm"
  />
);
