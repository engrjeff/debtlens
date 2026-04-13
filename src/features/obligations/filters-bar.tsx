import { ObligationActiveFilters } from "./obligation-active-filters"
import { ObligationFilterChips } from "./obligation-filter-chips"
import { ObligationTypeTabs } from "./obligation-type-tabs"
import { ObligationsMoreFilters } from "./obligations-more-filters"
import { ObligationsSearch } from "./obligations-search"
import { ObligationsSort } from "./obligations-sort"
import { ObligationsViewToggle } from "./obligations-view-toggle"

export function FiltersBar() {
  return (
    <>
      <div className="block space-y-4 lg:hidden">
        <div className="flex items-center gap-3">
          <ObligationsSearch />
          <ObligationsMoreFilters />
        </div>
        <ObligationTypeTabs />
        <ObligationFilterChips />
        <ObligationActiveFilters />
      </div>

      <div className="hidden space-y-4 lg:block">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-1 items-center gap-3">
            <ObligationsSearch />
            <ObligationsMoreFilters />
          </div>
          <div className="ml-auto flex items-center gap-1">
            <ObligationsSort />
            <ObligationsViewToggle />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <ObligationTypeTabs />
          <ObligationFilterChips />
        </div>
        <ObligationActiveFilters />
      </div>
    </>
  )
}
