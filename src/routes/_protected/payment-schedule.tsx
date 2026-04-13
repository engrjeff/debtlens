import { Link, createFileRoute } from "@tanstack/react-router"
import { format, formatDistanceToNow, isSameDay } from "date-fns"
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ReceiptIcon,
} from "lucide-react"
import { useMemo, useState } from "react"
import type { Obligation } from "@/generated/prisma/browser"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, CalendarDayButton } from "@/components/ui/calendar"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { formatPHP } from "@/features/obligations/helpers"
import { MarkPaidDialog } from "@/features/obligations/mark-paid-dialog"
import { fetchObligationInsights } from "@/features/obligations/obligations.functions"
import { generatePageTitle } from "@/lib/utils"

// ── Route ─────────────────────────────────────────────────────────────────────

export const Route = createFileRoute("/_protected/payment-schedule")({
  loader: () => fetchObligationInsights(),
  head: () => ({
    meta: [{ title: generatePageTitle("Payment Schedule") }],
  }),
  component: RouteComponent,
})

// ── Root component ────────────────────────────────────────────────────────────

function RouteComponent() {
  const obligations = Route.useLoaderData()

  const [viewMonth, setViewMonth] = useState<Date>(
    () => new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  )
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(undefined)

  function handleMonthChange(month: Date) {
    setViewMonth(month)
    setSelectedDay(undefined)
  }

  function handleYearStep(delta: number) {
    const next = new Date(
      viewMonth.getFullYear() + delta,
      viewMonth.getMonth(),
      1
    )
    setViewMonth(next)
    setSelectedDay(undefined)
  }

  const obligationMap = useMemo(
    () =>
      buildObligationMap(
        obligations,
        viewMonth.getFullYear(),
        viewMonth.getMonth()
      ),
    [obligations, viewMonth]
  )

  const selectedDayObligations = useMemo(() => {
    if (!selectedDay) return []
    const key = format(selectedDay, "yyyy-MM-dd")
    return obligationMap[key] ?? []
  }, [selectedDay, obligationMap])

  return (
    <>
      <header className="container mx-auto flex max-w-6xl items-center gap-4 p-4 pb-0">
        <div>
          <h1 className="font-semibold">Payment Schedule</h1>
          <p className="text-xs text-muted-foreground">
            {format(viewMonth, "MMMM yyyy")} · {obligations.length} obligation
            {obligations.length !== 1 ? "s" : ""}
          </p>
        </div>
      </header>

      <main className="container mx-auto max-w-6xl space-y-6 p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
          {/* ── Left: Calendar panel — hidden on mobile when a day is selected ── */}
          <div className={selectedDay ? "hidden lg:block" : undefined}>
            <ScheduleCalendar
              viewMonth={viewMonth}
              selectedDay={selectedDay}
              obligationMap={obligationMap}
              onMonthChange={handleMonthChange}
              onDaySelect={setSelectedDay}
              onYearStep={handleYearStep}
            />
          </div>

          {/* ── Right: Detail panel ── */}
          <div className="flex-1">
            {selectedDay ? (
              <DayDetailPanel
                day={selectedDay}
                obligations={selectedDayObligations}
                onClear={() => setSelectedDay(undefined)}
              />
            ) : (
              <MonthOverviewPanel
                obligationMap={obligationMap}
                viewMonth={viewMonth}
                onDaySelect={setSelectedDay}
              />
            )}
          </div>
        </div>
      </main>
    </>
  )
}

// ── Calendar panel ────────────────────────────────────────────────────────────

interface ScheduleCalendarProps {
  viewMonth: Date
  selectedDay: Date | undefined
  obligationMap: ObligationMap
  onMonthChange: (month: Date) => void
  onDaySelect: (day: Date | undefined) => void
  onYearStep: (delta: number) => void
}

function ScheduleCalendar({
  viewMonth,
  selectedDay,
  obligationMap,
  onMonthChange,
  onDaySelect,
  onYearStep,
}: ScheduleCalendarProps) {
  // Days that have at least one obligation
  const markedDays = useMemo(
    () => Object.keys(obligationMap).map((k) => new Date(k)),
    [obligationMap]
  )

  // Build the custom DayButton once per obligationMap change
  const CustomDayButton = useMemo(
    () =>
      function DayButtonWithDots({
        children,
        day,
        modifiers,
        ...rest
      }: Parameters<typeof CalendarDayButton>[0]) {
        const key = format(day.date, "yyyy-MM-dd")
        const dayObs = obligationMap[key] ?? []
        const hasBill = dayObs.some((o) => o.type === "BILL")
        const hasLoan = dayObs.some((o) => o.type === "LOAN")

        return (
          <CalendarDayButton day={day} modifiers={modifiers} {...rest}>
            {children}
            {dayObs.length > 0 ? (
              <span className="flex items-center justify-center gap-0.5">
                {hasBill && (
                  <span className="size-1 rounded-full bg-emerald-500" />
                )}
                {hasLoan && (
                  <span className="size-1 rounded-full bg-cyan-500" />
                )}
              </span>
            ) : (
              // Reserve height so all cells are equal
              <span className="h-1" />
            )}
          </CalendarDayButton>
        )
      },
    [obligationMap]
  )

  return (
    <Card size="sm" className="w-full lg:w-fit lg:shrink-0">
      <CardHeader className="pb-2">
        {/* Year navigation */}
        <div className="flex items-center justify-between gap-4">
          <Button
            size="icon"
            variant="outline"
            className="size-7"
            onClick={() => onYearStep(-1)}
            aria-label="Previous year"
          >
            <ChevronLeftIcon className="size-3.5" />
          </Button>
          <span className="text-sm font-semibold tabular-nums">
            {viewMonth.getFullYear()}
          </span>
          <Button
            size="icon"
            variant="outline"
            className="size-7"
            onClick={() => onYearStep(1)}
            aria-label="Next year"
          >
            <ChevronRightIcon className="size-3.5" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0 pb-2">
        <Calendar
          mode="single"
          month={viewMonth}
          onMonthChange={onMonthChange}
          selected={selectedDay}
          onSelect={onDaySelect}
          showOutsideDays={false}
          classNames={{ root: "w-full lg:w-fit" }}
          modifiers={{ hasDue: markedDays }}
          modifiersClassNames={{
            hasDue:
              "font-semibold ring-1 ring-inset ring-primary/20 rounded-[--cell-radius]",
          }}
          components={{ DayButton: CustomDayButton }}
          className="p-3 pt-0"
        />

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 border-t px-4 py-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-emerald-500" />
            Bill
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-cyan-500" />
            Loan
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

// ── Day detail panel ──────────────────────────────────────────────────────────

function DayDetailPanel({
  day,
  obligations,
  onClear,
}: {
  day: Date
  obligations: Array<Obligation>
  onClear: () => void
}) {
  const today = new Date()
  const isToday = isSameDay(day, today)

  return (
    <Card size="sm">
      <CardHeader className="flex-row items-center gap-3 border-b">
        <Button
          size="xs"
          variant="link"
          onClick={onClear}
          aria-label="Back to month overview"
          className="w-min shrink-0 px-0 text-foreground"
        >
          <ArrowLeftIcon className="size-4" /> Back
        </Button>
        <div className="flex-1">
          <CardTitle className="text-base">
            {format(day, "EEEE, MMMM dd, yyyy")}
          </CardTitle>
          <CardDescription>
            {isToday ? "Today" : formatDistanceToNow(day, { addSuffix: true })}
          </CardDescription>
        </div>
        <CardAction>
          <Button
            size="sm"
            variant="ghost"
            onClick={onClear}
            className="text-xs"
          >
            Clear
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent>
        {obligations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <ReceiptIcon className="mb-2 size-8 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">
              No obligations due on this date.
            </p>
          </div>
        ) : (
          <ul className="divide-y">
            {obligations.map((ob) => (
              <ObligationScheduleItem key={ob.id} obligation={ob} />
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

// ── Month overview panel ──────────────────────────────────────────────────────

function MonthOverviewPanel({
  obligationMap,
  viewMonth,
  onDaySelect,
}: {
  obligationMap: ObligationMap
  viewMonth: Date
  onDaySelect: (day: Date) => void
}) {
  const sortedEntries = useMemo(() => {
    return Object.entries(obligationMap)
      .map(([dateStr, obs]) => ({ date: new Date(dateStr), obligations: obs }))
      .sort((a, b) => a.date.getTime() - b.date.getTime())
  }, [obligationMap])

  const monthTotal = useMemo(() => {
    return sortedEntries.reduce(
      (sum, { obligations }) =>
        sum + obligations.reduce((s, o) => s + o.amount, 0),
      0
    )
  }, [sortedEntries])

  if (sortedEntries.length === 0) {
    return (
      <Card size="sm">
        <CardHeader>
          <CardTitle className="text-base">
            {format(viewMonth, "MMMM yyyy")}
          </CardTitle>
          <CardDescription>
            No obligations scheduled this month.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <ReceiptIcon className="mb-2 size-8 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">
            Nothing due in {format(viewMonth, "MMMM")}.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card size="sm">
      <CardHeader className="border-b">
        <CardTitle className="text-base">
          {format(viewMonth, "MMMM yyyy")}
        </CardTitle>
        <CardDescription>
          {sortedEntries.reduce((n, e) => n + e.obligations.length, 0)} due ·{" "}
          {formatPHP(monthTotal)} total
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0">
        {sortedEntries.map(({ date, obligations }, groupIndex) => {
          const isToday = isSameDay(date, new Date())
          const isPast = date < new Date() && !isToday

          return (
            <div key={format(date, "yyyy-MM-dd")}>
              {groupIndex > 0 && <Separator />}
              <button
                onClick={() => onDaySelect(date)}
                className="w-full px-4 py-3 text-left transition-colors hover:bg-muted/50"
              >
                {/* Date row */}
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm font-semibold ${isToday ? "text-emerald-500" : isPast ? "text-muted-foreground" : ""}`}
                    >
                      {isToday ? "Today" : format(date, "EEE, MMM d")}
                    </span>
                  </div>
                  <ArrowRightIcon className="size-3.5 text-muted-foreground" />
                </div>

                {/* Obligations */}
                <ul>
                  {obligations.map((ob) => (
                    <MonthOverviewItem key={ob.id} obligation={ob} />
                  ))}
                </ul>
              </button>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

// ── Obligation items ──────────────────────────────────────────────────────────

function ObligationScheduleItem({ obligation }: { obligation: Obligation }) {
  const [showMarkPaid, setShowMarkPaid] = useState(false)

  return (
    <li className="py-3">
      <div className="flex items-center justify-between gap-4">
        <Link
          to="/obligations/$id"
          params={{ id: obligation.id }}
          className="group flex-1"
        >
          <div className="min-w-0 space-y-1">
            <Badge variant={obligation.type} className="shrink-0">
              {obligation.category}
            </Badge>
            <p className="truncate font-medium group-hover:underline">
              {obligation.name}
            </p>
            <p className="text-xs text-muted-foreground capitalize">
              {obligation.recurrence.toLowerCase()}
            </p>
          </div>
        </Link>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <span className="font-mono font-semibold">
            {formatPHP(obligation.amount)}
          </span>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              size="xs"
              variant="link"
              className="px-0 text-emerald-500"
              onClick={() => setShowMarkPaid(true)}
            >
              <CheckIcon /> Mark as Paid
            </Button>
          </div>
        </div>
      </div>

      <MarkPaidDialog
        obligation={obligation}
        open={showMarkPaid}
        onClose={() => setShowMarkPaid(false)}
      />
    </li>
  )
}

function MonthOverviewItem({ obligation }: { obligation: Obligation }) {
  return (
    <li className="flex items-center justify-between gap-3 text-sm">
      <div className="flex min-w-0 items-center gap-2">
        <span
          className={`size-1.5 shrink-0 rounded-full ${
            obligation.type === "BILL" ? "bg-emerald-500" : "bg-cyan-500"
          }`}
        />
        <span className="truncate text-foreground/80">{obligation.name}</span>
      </div>
      <span className="shrink-0 font-mono text-xs font-medium">
        {formatPHP(obligation.amount)}
      </span>
    </li>
  )
}

// ── Helpers ───────────────────────────────────────────────────────────────────

type ObligationMap = Record<string, Array<Obligation>>

/**
 * Returns due dates for an obligation within a given month (0-indexed).
 *
 * Dates are projected **forward from nextDueDate only** — months before
 * nextDueDate produce no results. If nextDueDate is itself in the past
 * (overdue) it is still included, as it genuinely exists in the database.
 */
function getObligationDatesInMonth(
  obligation: Obligation,
  year: number,
  month: number
): Array<Date> {
  const monthEnd = new Date(year, month + 1, 0)
  const dates: Array<Date> = []

  // Normalise nextDueDate to midnight so date-only comparisons are reliable
  const raw = new Date(obligation.nextDueDate)
  const anchor = new Date(raw.getFullYear(), raw.getMonth(), raw.getDate())

  const anchorYear = anchor.getFullYear()
  const anchorMonth = anchor.getMonth()
  // Positive = target month is after anchor, negative = before
  const monthsFromAnchor = (year - anchorYear) * 12 + (month - anchorMonth)

  // Any month that comes before the anchor produces no occurrences
  if (monthsFromAnchor < 0) return dates

  switch (obligation.recurrence) {
    case "ONCE": {
      // Appears only on its exact due date
      if (monthsFromAnchor === 0) {
        dates.push(anchor)
      }
      break
    }

    case "DAILY": {
      for (let d = 1; d <= monthEnd.getDate(); d++) {
        const candidate = new Date(year, month, d)
        if (candidate >= anchor) dates.push(candidate)
      }
      break
    }

    case "WEEKLY": {
      const targetDow = anchor.getDay()
      const startDow = new Date(year, month, 1).getDay()
      const firstOffset = (targetDow - startDow + 7) % 7
      let d = 1 + firstOffset
      while (d <= monthEnd.getDate()) {
        const candidate = new Date(year, month, d)
        if (candidate >= anchor) dates.push(candidate)
        d += 7
      }
      break
    }

    case "MONTHLY": {
      // Every month from anchor month onward
      const day = obligation.dueDay ?? anchor.getDate()
      dates.push(new Date(year, month, Math.min(day, monthEnd.getDate())))
      break
    }

    case "QUARTERLY": {
      // Every 3 months from anchor
      if (monthsFromAnchor % 3 === 0) {
        const day = obligation.dueDay ?? anchor.getDate()
        dates.push(new Date(year, month, Math.min(day, monthEnd.getDate())))
      }
      break
    }

    case "ANNUALLY": {
      // Same calendar month, every year from anchor year onward
      if (monthsFromAnchor % 12 === 0) {
        const day = obligation.dueDay ?? anchor.getDate()
        dates.push(new Date(year, month, Math.min(day, monthEnd.getDate())))
      }
      break
    }
  }

  return dates
}

/** Builds a map of { "yyyy-MM-dd" → Obligation[] } for the given month. */
function buildObligationMap(
  obligations: Array<Obligation>,
  year: number,
  month: number
): ObligationMap {
  const map: ObligationMap = {}

  for (const ob of obligations) {
    const dates = getObligationDatesInMonth(ob, year, month)
    for (const date of dates) {
      const key = format(date, "yyyy-MM-dd")
      if (!(key in map)) map[key] = []
      map[key].push(ob)
    }
  }

  // Sort obligations on each day: BILL first, then by amount desc
  for (const key of Object.keys(map)) {
    map[key].sort((a, b) => {
      if (a.type !== b.type) return a.type === "BILL" ? -1 : 1
      return b.amount - a.amount
    })
  }

  return map
}
