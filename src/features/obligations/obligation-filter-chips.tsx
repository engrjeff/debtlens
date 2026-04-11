import { Button, buttonVariants } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { Link, useSearch } from "@tanstack/react-router"
import { CheckIcon, XIcon } from "lucide-react"
import type { ObligationsSearch } from "./search-params"

// ── Types ─────────────────────────────────────────────────────────────────────

type ActiveChip = {
  id: string
  label: string
  remove: (current: ObligationsSearch) => Partial<ObligationsSearch>
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const DUE_RANGE_LABELS: Record<
  NonNullable<ObligationsSearch["dueRange"]>,
  string
> = {
  any: "Any time",
  today: "Today",
  next7days: "Next 7 days",
  thisMonth: "This month",
  custom: "Custom",
}

const PROGRESS_LABELS: Record<
  NonNullable<ObligationsSearch["progress"]>,
  string
> = {
  high: "Almost paid",
  mid: "Midway",
  low: "Just started",
}

function fmt(n: number) {
  return `₱${n.toLocaleString("en-PH", { maximumFractionDigits: 0 })}`
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
  })
}

// Status is shown via the quick-filter buttons below, not as active chips.
// buildActiveChips only covers the advanced filter params.
function buildActiveChips(search: ObligationsSearch): Array<ActiveChip> {
  const chips: Array<ActiveChip> = []

  for (const cat of search.categories ?? []) {
    chips.push({
      id: `cat-${cat}`,
      label: cat,
      remove: (c) => ({
        ...c,
        categories: c.categories?.filter((x) => x !== cat),
      }),
    })
  }

  if (search.dueRange && search.dueRange !== "any") {
    const label =
      search.dueRange === "custom" && (search.dueStart || search.dueEnd)
        ? [
            search.dueStart && fmtDate(search.dueStart),
            search.dueEnd && fmtDate(search.dueEnd),
          ]
            .filter(Boolean)
            .join(" – ")
        : DUE_RANGE_LABELS[search.dueRange]

    chips.push({
      id: "dueRange",
      label: `Due: ${label}`,
      remove: (c) => ({
        ...c,
        dueRange: undefined,
        dueStart: undefined,
        dueEnd: undefined,
      }),
    })
  }

  if (search.minAmount != null || search.maxAmount != null) {
    const parts = [
      search.minAmount != null && fmt(search.minAmount),
      search.maxAmount != null && fmt(search.maxAmount),
    ].filter(Boolean)
    chips.push({
      id: "amount",
      label: `Amount: ${parts.join(" – ")}`,
      remove: (c) => ({ ...c, minAmount: undefined, maxAmount: undefined }),
    })
  }

  if (search.minBalance != null || search.maxBalance != null) {
    const parts = [
      search.minBalance != null && fmt(search.minBalance),
      search.maxBalance != null && fmt(search.maxBalance),
    ].filter(Boolean)
    chips.push({
      id: "balance",
      label: `Balance: ${parts.join(" – ")}`,
      remove: (c) => ({ ...c, minBalance: undefined, maxBalance: undefined }),
    })
  }

  if (search.progress) {
    chips.push({
      id: "progress",
      label: PROGRESS_LABELS[search.progress],
      remove: (c) => ({ ...c, progress: undefined }),
    })
  }

  return chips
}

function hasActiveFilters(search: ObligationsSearch): boolean {
  return Boolean(
    search.type !== "ALL" ||
    search.status ||
    search.categories?.length ||
    search.dueRange ||
    search.dueStart ||
    search.dueEnd ||
    search.minAmount != null ||
    search.maxAmount != null ||
    search.minBalance != null ||
    search.maxBalance != null ||
    search.progress
  )
}

// ── Constants ─────────────────────────────────────────────────────────────────

const typeFilters: Array<{ value: ObligationsSearch["type"]; label: string }> =
  [
    { value: "ALL", label: "All" },
    { value: "BILL", label: "Bills" },
    { value: "LOAN", label: "Loans" },
  ]

const statusFilters: Array<{
  label: string
  value: ObligationsSearch["status"]
}> = [
  { label: "This week", value: "due-this-week" },
  { label: "This Month", value: "due-this-month" },
  { label: "Overdue", value: "overdue" },
]

// ── Components ────────────────────────────────────────────────────────────────

export function ClearFiltersButton() {
  const search = useSearch({ from: "/_protected/obligations/" })

  if (!hasActiveFilters(search)) return null

  return (
    <Link
      to="/obligations"
      search={(current) => ({
        q: current.q,
        view: current.view,
        sort: current.sort,
        page: 1,
      })}
      className={cn(
        buttonVariants({ variant: "ghost", size: "sm" }),
        "rounded-full"
      )}
    >
      <XIcon />
      Clear
    </Link>
  )
}

export function ObligationFilterChips() {
  const search = useSearch({ from: "/_protected/obligations/" })
  const chips = buildActiveChips(search)

  return (
    <div className="flex flex-wrap items-center gap-4 md:justify-between">
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

      <div className="max-w-[90vw] overflow-x-auto">
        <div className="flex items-center gap-1.5 lg:ml-auto">
          {chips.length > 0 && <ClearFiltersButton />}

          {/* Advanced filter chips */}
          {chips.map((chip) => (
            <Link
              key={chip.id}
              to="/obligations"
              search={(current) => chip.remove(current as ObligationsSearch)}
              className={cn(
                buttonVariants({ size: "sm", variant: "secondary" }),
                "rounded-full"
              )}
            >
              {chip.label}
              <XIcon className="size-3 shrink-0" />
            </Link>
          ))}

          {/* Default status quick-filter buttons */}
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
                  status:
                    filter.value === search.status ? undefined : filter.value,
                })}
              >
                {filter.value === search.status && <CheckIcon />}
                {filter.label}
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
