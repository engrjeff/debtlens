import type { RecurrenceType } from "@/generated/prisma/enums"

/**
 * Advance a date by exactly one recurrence period.
 *
 * For period types that involve months (MONTHLY, QUARTERLY, ANNUALLY) the
 * result is pinned to `dueDay` when provided, clamped to the last day of the
 * target month.  This keeps billing cycles stable — a loan due on the 31st
 * lands on Feb 28/29 and snaps back to March 31.
 *
 * We never mutate the input date; all paths return a new Date constructed
 * from explicit year/month/day components, which sidesteps JS's infamous
 * month-overflow behaviour (e.g. new Date(2024,0,31) + 1 month → March 2).
 */
export function advanceByOnePeriod(
  date: Date,
  recurrence: RecurrenceType,
  dueDay: number | null
): Date {
  const y = date.getFullYear()
  const m = date.getMonth()
  const d = date.getDate()

  switch (recurrence) {
    case "DAILY":
      return new Date(y, m, d + 1)

    case "WEEKLY":
      return new Date(y, m, d + 7)

    case "MONTHLY":
      return buildMonthDate(y, m + 1, dueDay ?? d)

    case "QUARTERLY":
      return buildMonthDate(y, m + 3, dueDay ?? d)

    case "ANNUALLY":
      return buildMonthDate(y + 1, m, dueDay ?? d)

    default:
      throw new Error(`Unhandled recurrence type: ${recurrence as string}`)
  }
}

/**
 * Build a Date for the given year/month (0-indexed, may overflow past 11)
 * and day, clamping the day to the last day of the resolved month.
 *
 * Using `new Date(year, month + 1, 0)` is the canonical JS idiom for getting
 * the last day of a month: day-0 of the next month wraps back to the last day
 * of the current month without any arithmetic on our part.
 */
function buildMonthDate(year: number, rawMonth: number, day: number): Date {
  const resolvedYear = year + Math.floor(rawMonth / 12)
  const resolvedMonth = ((rawMonth % 12) + 12) % 12 // handles negative wrap

  const lastDayOfMonth = new Date(resolvedYear, resolvedMonth + 1, 0).getDate()
  return new Date(resolvedYear, resolvedMonth, Math.min(day, lastDayOfMonth))
}

/**
 * Compute the next due date that falls *strictly after now*.
 *
 * An obligation may be multiple periods overdue (e.g. a bill not touched for
 * 3 months).  We advance the cycle until the result is in the future rather
 * than jumping to "nextDueDate + 1 period" which would still be in the past.
 *
 * Safety cap of 500 iterations prevents an infinite loop if data is
 * pathologically stale or recurrence is DAILY and the date is years old.
 */
export function computeNextDueDate(
  currentDueDate: Date,
  recurrence: RecurrenceType,
  dueDay: number | null
): Date {
  const now = new Date()
  let next = advanceByOnePeriod(currentDueDate, recurrence, dueDay)

  let iterations = 0
  while (next <= now && iterations < 500) {
    next = advanceByOnePeriod(next, recurrence, dueDay)
    iterations++
  }

  return next
}

/**
 * Normalise any payment amount to its monthly equivalent.
 *
 * This lets us compare obligations with different billing cadences on a
 * common scale (e.g. for budget summaries and cash-flow projections).
 *
 * DAILY     → × 30.44   (365.25 / 12, average days per month)
 * WEEKLY    → × 4.348   (52.18 / 12, average weeks per month)
 * MONTHLY   → × 1
 * QUARTERLY → ÷ 3
 * ANNUALLY  → ÷ 12
 */
export function toMonthlyAmount(
  amount: number,
  recurrence: RecurrenceType
): number {
  switch (recurrence) {
    case "DAILY":
      return amount * (365.25 / 12)
    case "WEEKLY":
      return amount * (52.18 / 12)
    case "MONTHLY":
      return amount
    case "QUARTERLY":
      return amount / 3
    case "ANNUALLY":
      return amount / 12
  }
}
