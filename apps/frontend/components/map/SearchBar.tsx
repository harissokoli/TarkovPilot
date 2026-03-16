"use client"

import { Search, X } from "lucide-react"

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function SearchBar({ value, onChange, placeholder = "Search markers..." }: SearchBarProps) {
  return (
    <div className="relative flex items-center">
      <Search
        size={14}
        className="absolute left-3 text-muted-foreground pointer-events-none"
        aria-hidden
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search markers"
        className="
          w-full h-8 pl-8 pr-8
          bg-secondary border border-border rounded-md
          text-xs text-foreground placeholder:text-muted-foreground
          focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring
          transition-colors
        "
      />
      {value && (
        <button
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute right-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X size={12} />
        </button>
      )}
    </div>
  )
}
