import type { Obligation } from "@/generated/prisma/client"
import { OBLIGATION_CATEGORIES } from "@/lib/constants/obligation-categories"
import { endOfMonth, startOfMonth } from "date-fns"

// ── Category colors ───────────────────────────────────────────────────────────

type CategoryMeta = {
  dot: string // solid color class for the dot
  badge: string // full badge classes (bg + text + border)
}

const GROUP_COLORS: Record<string, CategoryMeta> = {
  Housing: {
    dot: "bg-sky-500",
    badge:
      "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-800 dark:bg-sky-950/40 dark:text-sky-300",
  },
  Utilities: {
    dot: "bg-amber-500",
    badge:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300",
  },
  Lifestyle: {
    dot: "bg-pink-500",
    badge:
      "border-pink-200 bg-pink-50 text-pink-700 dark:border-pink-800 dark:bg-pink-950/40 dark:text-pink-300",
  },
  Transport: {
    dot: "bg-orange-500",
    badge:
      "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-800 dark:bg-orange-950/40 dark:text-orange-300",
  },
  "Work / Business": {
    dot: "bg-indigo-500",
    badge:
      "border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-300",
  },
  Property: {
    dot: "bg-teal-500",
    badge:
      "border-teal-200 bg-teal-50 text-teal-700 dark:border-teal-800 dark:bg-teal-950/40 dark:text-teal-300",
  },
  Vehicle: {
    dot: "bg-orange-500",
    badge:
      "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-800 dark:bg-orange-950/40 dark:text-orange-300",
  },
  Personal: {
    dot: "bg-violet-500",
    badge:
      "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-800 dark:bg-violet-950/40 dark:text-violet-300",
  },
  Education: {
    dot: "bg-blue-500",
    badge:
      "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300",
  },
  Medical: {
    dot: "bg-rose-500",
    badge:
      "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-300",
  },
  Informal: {
    dot: "bg-emerald-500",
    badge:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300",
  },
  Other: {
    dot: "bg-slate-400",
    badge:
      "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800/40 dark:text-slate-300",
  },
}

const FALLBACK_META: CategoryMeta = GROUP_COLORS.Other

// Build category value → group map once at module load
const CATEGORY_GROUP: Record<string, string> = {}
for (const groups of [OBLIGATION_CATEGORIES.bill, OBLIGATION_CATEGORIES.loan]) {
  for (const group of groups) {
    for (const opt of group.options) {
      CATEGORY_GROUP[opt.value] = group.group
    }
  }
}

export function getCategoryMeta(category: string): CategoryMeta {
  const group = CATEGORY_GROUP[category]
  return GROUP_COLORS[group] ?? FALLBACK_META
}

export type ObligationStatus =
  | "overdue"
  | "due-today"
  | "due-this-week"
  | "upcoming"
export type TypeFilter = "ALL" | "BILL" | "LOAN"
export type StatusFilter = "ALL" | ObligationStatus
export type SortOption = "due-date" | "amount" | "balance"

export function getObligationStatus(
  nextDueDate: Date | string
): ObligationStatus {
  const due = new Date(nextDueDate)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const dueDay = new Date(due.getFullYear(), due.getMonth(), due.getDate())
  const diffDays = Math.floor(
    (dueDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  )

  if (diffDays < 0) return "overdue"
  if (diffDays === 0) return "due-today"
  if (diffDays <= 7) return "due-this-week"
  return "upcoming"
}

export function formatPHP(amount: number): string {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
  }).format(amount)
}

export function formatDueDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date))
}

export function getDueDaysLabel(nextDueDate: Date | string): string {
  const due = new Date(nextDueDate)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const dueDay = new Date(due.getFullYear(), due.getMonth(), due.getDate())
  const diffDays = Math.floor(
    (dueDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  )

  if (diffDays < -1) return `${Math.abs(diffDays)} days overdue`
  if (diffDays === -1) return "1 day overdue"
  if (diffDays === 0) return "Due today"
  if (diffDays === 1) return "Due tomorrow"
  if (diffDays <= 7) return `Due in ${diffDays} days`
  return `Due ${formatDueDate(nextDueDate)}`
}

export function getPerLabel(recurrence: string): string {
  const map: Record<string, string> = {
    DAILY: "day",
    WEEKLY: "week",
    MONTHLY: "month",
    QUARTERLY: "quarter",
    ANNUALLY: "year",
  }
  return map[recurrence] ?? recurrence
}

export function getRecurrenceLabel(recurrence: string): string {
  const map: Record<string, string> = {
    DAILY: "Daily",
    WEEKLY: "Weekly",
    MONTHLY: "Monthly",
    QUARTERLY: "Quarterly",
    ANNUALLY: "Annually",
  }
  return map[recurrence] ?? recurrence
}
export function getProgressPercent(
  remainingBalance: number,
  totalAmount: number
): number {
  if (totalAmount <= 0) return 0
  const paid = totalAmount - remainingBalance
  return Math.min(100, Math.max(0, (paid / totalAmount) * 100))
}

export function getPayoffMonths(
  remainingBalance: number,
  monthlyPayment: number
): number {
  if (monthlyPayment <= 0 || remainingBalance <= 0) return 0
  return Math.ceil(remainingBalance / monthlyPayment)
}

export function formatPayoffDate(months: number): string {
  if (!isFinite(months) || months <= 0) return "N/A"
  const date = new Date()
  date.setMonth(date.getMonth() + months)
  return new Intl.DateTimeFormat("en-PH", {
    month: "short",
    year: "numeric",
  }).format(date)
}

// ── Insights ─────────────────────────────────────────────────────────────────

export function computeInsights(obligations: Obligation[]) {
  const now = new Date()
  const monthStart = startOfMonth(now)
  const monthEnd = endOfMonth(now)

  let totalDueThisMonth = 0
  let dueThisWeekCount = 0
  let dueThisWeekAmount = 0
  let overdueCount = 0
  let overdueAmount = 0
  let totalRemainingDebt = 0
  let totalMonthlyLoanPayment = 0

  for (const o of obligations) {
    const due = new Date(o.nextDueDate)
    const status = getObligationStatus(o.nextDueDate)

    if (due >= monthStart && due <= monthEnd) {
      totalDueThisMonth += o.amount
    }

    if (status === "due-today" || status === "due-this-week") {
      dueThisWeekCount++
      dueThisWeekAmount += o.amount
    }

    if (status === "overdue") {
      overdueCount++
      overdueAmount += o.amount
    }

    if (o.type === "LOAN") {
      totalRemainingDebt += o.remainingBalance
      if (o.recurrence === "MONTHLY") {
        totalMonthlyLoanPayment += o.amount
      }
    }
  }

  const debtFreeMonths =
    totalMonthlyLoanPayment > 0
      ? Math.ceil(totalRemainingDebt / totalMonthlyLoanPayment)
      : null

  return {
    totalDueThisMonth,
    dueThisWeekCount,
    dueThisWeekAmount,
    overdueCount,
    overdueAmount,
    totalRemainingDebt,
    debtFreeMonths,
  }
}

// ── Payment / Due-date helpers ────────────────────────────────────────────────

/**
 * Advance a due date by one recurrence period.
 * For MONTHLY / QUARTERLY / ANNUALLY the `dueDay` field (1-31) is used as the
 * canonical day-of-month so that, e.g., a bill always falls on the 31st
 * (clamped to the last valid day of each month).
 */
export function computeNextDueDate(
  currentDueDate: Date,
  recurrence: string,
  dueDay?: number | null
): Date {
  const base = new Date(currentDueDate)
  const y = base.getFullYear()
  const m = base.getMonth()
  const d = base.getDate()

  switch (recurrence) {
    case "DAILY":
      return new Date(y, m, d + 1)

    case "WEEKLY":
      return new Date(y, m, d + 7)

    case "MONTHLY": {
      const targetDay = dueDay ?? d
      const rawMonth = m + 1
      const targetY = rawMonth > 11 ? y + 1 : y
      const targetM = rawMonth % 12
      const maxDay = new Date(targetY, targetM + 1, 0).getDate()
      return new Date(targetY, targetM, Math.min(targetDay, maxDay))
    }

    case "QUARTERLY": {
      const targetDay = dueDay ?? d
      const rawMonth = m + 3
      const targetY = y + Math.floor(rawMonth / 12)
      const targetM = rawMonth % 12
      const maxDay = new Date(targetY, targetM + 1, 0).getDate()
      return new Date(targetY, targetM, Math.min(targetDay, maxDay))
    }

    case "ANNUALLY": {
      const targetDay = dueDay ?? d
      const maxDay = new Date(y + 1, m + 1, 0).getDate()
      return new Date(y + 1, m, Math.min(targetDay, maxDay))
    }

    default:
      return base
  }
}

// ── Filter + Sort ─────────────────────────────────────────────────────────────

export function filterObligations(
  obligations: Obligation[],
  opts: {
    search: string
    typeFilter: TypeFilter
    statusFilter: StatusFilter
    sort: SortOption
  }
): Obligation[] {
  const q = opts.search.toLowerCase()

  return obligations
    .filter((o) => {
      if (
        q &&
        !o.name.toLowerCase().includes(q) &&
        !o.category.toLowerCase().includes(q)
      ) {
        return false
      }
      if (opts.typeFilter !== "ALL" && o.type !== opts.typeFilter) return false
      if (
        opts.statusFilter !== "ALL" &&
        getObligationStatus(o.nextDueDate) !== opts.statusFilter
      ) {
        return false
      }
      return true
    })
    .sort((a, b) => {
      if (opts.sort === "due-date") {
        return (
          new Date(a.nextDueDate).getTime() - new Date(b.nextDueDate).getTime()
        )
      }
      if (opts.sort === "amount") return b.amount - a.amount
      if (opts.sort === "balance")
        return b.remainingBalance - a.remainingBalance
      return 0
    })
}

export function groupObligations(obligations: Obligation[]) {
  const overdue: Obligation[] = []
  const dueThisWeek: Obligation[] = []
  const upcoming: Obligation[] = []

  for (const o of obligations) {
    const status = getObligationStatus(o.nextDueDate)
    if (status === "overdue") overdue.push(o)
    else if (status === "due-today" || status === "due-this-week")
      dueThisWeek.push(o)
    else upcoming.push(o)
  }

  return { overdue, dueThisWeek, upcoming }
}
