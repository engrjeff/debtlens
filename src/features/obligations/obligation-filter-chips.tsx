import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Link, useSearch } from "@tanstack/react-router"
import { CheckIcon, XIcon } from "lucide-react"
import type { ObligationsSearch } from "./search-params"
const typeFilters: {
  value: ObligationsSearch["type"]
  label: string
}[] = [
  { value: "ALL", label: "All" },
  { value: "BILL", label: "Bills" },
  { value: "LOAN", label: "Loans" },
]

const statusFilters: Array<{
  label: string
  value: ObligationsSearch["status"]
}> = [
  {
    label: "This week",
    value: "due-this-week",
  },
  {
    label: "This Month",
    value: "due-this-month",
  },
  {
    label: "Overdue",
    value: "overdue",
  },
]

export function ObligationFilterChips() {
  const search = useSearch({ from: "/_protected/obligations/" })
  const hasFilters = [search.status].filter(Boolean).length !== 0

  return (
    <div className="flex items-center justify-between gap-4">
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
                search={(current) => ({
                  ...current,
                  type: filter.value,
                })}
              >
                {filter.label}
              </Link>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <div className="flex items-center gap-1">
        {hasFilters && (
          <Button variant="ghost" size="sm" className="rounded-full" asChild>
            <Link
              to="/obligations"
              search={(current) => ({
                ...current,
                status: undefined,
              })}
            >
              <XIcon /> Clear Filters
            </Link>
          </Button>
        )}
        {statusFilters.map((filter) => (
          <Button
            key={`status-filter-${filter.value}`}
            variant={filter.value === search.status ? "default" : "secondary"}
            size="sm"
            className="rounded-full"
            asChild
          >
            <Link
              to="/obligations"
              search={(current) => ({
                ...current,
                status: filter.value,
              })}
            >
              {filter.value === search.status ? <CheckIcon /> : null}{" "}
              {filter.label}
            </Link>
          </Button>
        ))}
      </div>
    </div>
  )
}
