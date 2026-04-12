import { Link, useSearch } from "@tanstack/react-router"
import { CheckIcon } from "lucide-react"
import type { ObligationsSearch } from "./search-params"
import { Button } from "@/components/ui/button"

const statusFilters: Array<{
  label: string
  value: ObligationsSearch["status"]
}> = [
  { label: "This week", value: "due-this-week" },
  { label: "This Month", value: "due-this-month" },
  { label: "Overdue", value: "overdue" },
]

export function ObligationFilterChips() {
  const search = useSearch({ from: "/_protected/obligations/" })

  return (
    <div className="flex items-center gap-1.5">
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
              status: filter.value === search.status ? undefined : filter.value,
            })}
          >
            {filter.value === search.status && <CheckIcon />}
            {filter.label}
          </Link>
        </Button>
      ))}
    </div>
  )
}
