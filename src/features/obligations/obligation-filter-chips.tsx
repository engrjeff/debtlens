import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Link, useSearch } from "@tanstack/react-router"
import { CheckIcon } from "lucide-react"
import type { ObligationsSearch } from "./search-params"

const typeFilters: { value: ObligationsSearch["type"]; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "BILL", label: "Bills" },
  { value: "LOAN", label: "Loans" },
]

const statusFilters: Array<{
  label: string
  value: ObligationsSearch["status"]
}> = [
  {
    label: "Due today",
    value: "due-today",
  },
  {
    label: "Due this week",
    value: "due-this-week",
  },
  {
    label: "Due this Month",
    value: "due-this-month",
  },
  {
    label: "Overdue",
    value: "overdue",
  },
]

export function ObligationFilterChips() {
  const search = useSearch({ from: "/_protected/debts/" })

  return (
    <div className="flex items-center gap-1">
      {typeFilters.map((filter) => (
        <Button
          key={`type-filter-${filter.value}`}
          variant="secondary"
          size="sm"
          className="rounded-full"
          asChild
        >
          <Link
            to="/debts"
            search={(current) => ({ ...current, type: filter.value })}
          >
            {filter.value === search.type ? (
              <CheckIcon className="text-primary" />
            ) : null}{" "}
            {filter.label}
          </Link>
        </Button>
      ))}

      <Separator orientation="vertical" />
      {statusFilters.map((filter) => (
        <Button
          key={`status-filter-${filter.value}`}
          variant="secondary"
          size="sm"
          className="rounded-full"
          asChild
        >
          <Link
            to="/debts"
            search={(current) => ({ ...current, status: filter.value })}
          >
            {filter.value === search.status ? (
              <CheckIcon className="text-primary" />
            ) : null}{" "}
            {filter.label}
          </Link>
        </Button>
      ))}
    </div>
  )
}
