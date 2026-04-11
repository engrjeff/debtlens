import { ObligationFilterChips } from "./obligation-filter-chips"
import { ObligationsMoreFilters } from "./obligations-more-filters"
import { ObligationsSearch } from "./obligations-search"
import { ObligationsSort } from "./obligations-sort"
import { ObligationsViewToggle } from "./obligations-view-toggle"

export function FiltersBar() {
  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-3">
          <ObligationsSearch />
          <ObligationsMoreFilters />
        </div>
        <div className="flex items-center gap-3">
          <ObligationsSort />
          <ObligationsViewToggle />
        </div>
      </div>
      <div>
        <ObligationFilterChips />
      </div>
    </>
  )
}
