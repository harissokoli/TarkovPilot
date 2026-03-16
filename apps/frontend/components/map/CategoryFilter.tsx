"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight } from "lucide-react"
import type { CategoryCount, FilterState } from "@/types/marker"
import { getCategoryInfo } from "@/lib/categories"

interface CategoryFilterProps {
  categoryCounts: CategoryCount[]
  filters: FilterState
  onToggleCategory: (category: string) => void
  onToggleSubCategory: (subCategory: string) => void
  onClearFilters: () => void
  hasActiveFilters: boolean
  totalVisible: number
  totalAll: number
}

export function CategoryFilter({
  categoryCounts,
  filters,
  onToggleCategory,
  onToggleSubCategory,
  onClearFilters,
  hasActiveFilters,
  totalVisible,
  totalAll,
}: CategoryFilterProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())

  const toggleExpand = (cat: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev)
      next.has(cat) ? next.delete(cat) : next.add(cat)
      return next
    })
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Filters
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {totalVisible}/{totalAll}
          </span>
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="text-xs text-primary hover:text-primary/80 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Category list */}
      <div className="flex flex-col gap-0.5">
        {categoryCounts.map(({ category, count, subCategories }) => {
          const info = getCategoryInfo(category)
          const isActive = filters.categories.has(category)
          const isExpanded = expandedCategories.has(category)
          const hasSubCats = subCategories.filter((sc) => sc.subCategory !== "(none)").length > 0

          return (
            <div key={category}>
              {/* Category row */}
              <div className="flex items-center gap-1 group">
                {/* Expand toggle */}
                {hasSubCats ? (
                  <button
                    onClick={() => toggleExpand(category)}
                    className="p-0.5 text-muted-foreground hover:text-foreground transition-colors shrink-0"
                    aria-label={isExpanded ? `Collapse ${category}` : `Expand ${category}`}
                  >
                    {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                  </button>
                ) : (
                  <span className="w-4 shrink-0" />
                )}

                {/* Category toggle button */}
                <button
                  onClick={() => onToggleCategory(category)}
                  className={`
                    flex items-center gap-2 flex-1 px-2 py-1.5 rounded text-left
                    transition-colors text-xs
                    ${isActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    }
                  `}
                  aria-pressed={isActive}
                >
                  {/* Colour swatch */}
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{
                      backgroundColor: isActive ? info.color : "transparent",
                      border: `1.5px solid ${info.color}`,
                    }}
                  />
                  <span className="flex-1 font-medium">{category}</span>
                  <span
                    className="text-[10px] tabular-nums px-1.5 py-0.5 rounded"
                    style={{
                      color: info.color,
                      backgroundColor: info.bgColor,
                    }}
                  >
                    {count}
                  </span>
                </button>
              </div>

              {/* SubCategory rows */}
              {isExpanded && hasSubCats && (
                <div className="ml-7 flex flex-col gap-0.5 mt-0.5 mb-1">
                  {subCategories
                    .filter((sc) => sc.subCategory !== "(none)")
                    .map(({ subCategory, count: subCount }) => {
                      const isSubActive = filters.subCategories.has(subCategory)
                      return (
                        <button
                          key={subCategory}
                          onClick={() => onToggleSubCategory(subCategory)}
                          className={`
                            flex items-center justify-between px-2 py-1 rounded text-left
                            transition-colors text-[11px]
                            ${isSubActive
                              ? "bg-secondary text-foreground"
                              : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                            }
                          `}
                          aria-pressed={isSubActive}
                        >
                          <span>{subCategory}</span>
                          <span className="tabular-nums text-muted-foreground ml-2">
                            {subCount}
                          </span>
                        </button>
                      )
                    })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
