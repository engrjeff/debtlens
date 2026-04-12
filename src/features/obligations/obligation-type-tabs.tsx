import { Link, useSearch } from "@tanstack/react-router"
import type { ObligationsSearch } from "./search-params"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const typeFilters: Array<{ value: ObligationsSearch["type"]; label: string }> =
  [
    { value: "ALL", label: "All" },
    { value: "BILL", label: "Bills" },
    { value: "LOAN", label: "Loans" },
  ]
export function ObligationTypeTabs() {
  const search = useSearch({ from: "/_protected/obligations/" })

  return (
    <Tabs key={search.type} value={search.type}>
      <TabsList>
        {typeFilters.map((filter) => (
          <TabsTrigger
            key={`type-filter-${filter.value}`}
            value={filter.value}
            asChild
          >
            <Link
              to="/obligations"
              search={(current) => ({ ...current, type: filter.value })}
            >
              {filter.label}
            </Link>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
