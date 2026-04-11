/**
 * Dashboard data-aggregation utilities.
 *
 * Each function is pure, side-effect-free, and accepts the full Obligation
 * array so callers can compose them freely.  They intentionally reuse the
 * shared helpers (getObligationStatus, getProgressPercent, …) rather than
 * duplicating date logic.
 */

import {
  formatPayoffDate,
  getObligationStatus,
  getProgressPercent,
} from "@/features/obligations/helpers"
import type { Obligation } from "@/generated/prisma/client"
import { endOfMonth, startOfMonth } from "date-fns"

// ── Shared types ──────────────────────────────────────────────────────────────

export type ObligationStatus =
  | "overdue"
  | "due-today"
  | "due-this-week"
  | "upcoming"

export interface DashboardSummary {
  /** Sum of all obligation amounts whose nextDueDate falls in the current calendar month */
  totalDueThisMonth: number
  /** Sum of amounts due within the next 7 days (includes today) */
  dueInNext7DaysAmount: number
  /** Number of obligations due within the next 7 days */
  dueInNext7DaysCount: number
  /** Sum of amounts that are already past due */
  overdueAmount: number
  /** Number of overdue obligations */
  overdueCount: number
  /** Sum of remainingBalance across all active LOAN obligations */
  totalRemainingDebt: number
}

export interface UpcomingObligation {
  id: string
  name: string
  category: string
  type: "BILL" | "LOAN"
  amount: number
  nextDueDate: Date
  status: ObligationStatus
}

export interface DebtProgressData {
  /** Combined remaining balance across all loans */
  totalRemaining: number
  /** Combined original loan amount (totalAmount) across all loans */
  totalOriginal: number
  /** 0–100 percent paid off */
  percentPaid: number
  /** Month/year when the last loan will be paid off, or null if no active loans */
  estimatedDebtFreeDate: string | null
  /** Up to 3 largest loans by remaining balance */
  topLoans: Array<{
    id: string
    name: string
    remainingBalance: number
    totalAmount: number
    percentPaid: number
    monthlyPayment: number
  }>
}

export interface CategoryBreakdownItem {
  category: string
  /** Sum of monthly-equivalent amounts for this category */
  totalAmount: number
  count: number
}

export interface DashboardInsight {
  /** Machine-readable key used for deduplication / ordering */
  key: string
  message: string
  /** Drives icon and colour in the UI */
  severity: "info" | "warning" | "danger"
}

// ── 1. Summary stats ──────────────────────────────────────────────────────────

/**
 * Returns aggregate financial stats for the dashboard summary cards.
 */
export function getDashboardSummary(
  obligations: Obligation[]
): DashboardSummary {
  const now = new Date()
  const monthStart = startOfMonth(now)
  const monthEnd = endOfMonth(now)
  const next7 = new Date(now)
  next7.setDate(now.getDate() + 7)

  let totalDueThisMonth = 0
  let dueInNext7DaysAmount = 0
  let dueInNext7DaysCount = 0
  let overdueAmount = 0
  let overdueCount = 0
  let totalRemainingDebt = 0

  for (const o of obligations) {
    const due = new Date(o.nextDueDate)
    const status = getObligationStatus(o.nextDueDate)

    // This month
    if (due >= monthStart && due <= monthEnd) {
      totalDueThisMonth += o.amount
    }

    // Next 7 days (includes today through day 7)
    if (status === "due-today" || status === "due-this-week") {
      dueInNext7DaysAmount += o.amount
      dueInNext7DaysCount++
    }

    // Overdue
    if (status === "overdue") {
      overdueAmount += o.amount
      overdueCount++
    }

    // Remaining debt (loans only)
    if (o.type === "LOAN") {
      totalRemainingDebt += o.remainingBalance
    }
  }

  return {
    totalDueThisMonth,
    dueInNext7DaysAmount,
    dueInNext7DaysCount,
    overdueAmount,
    overdueCount,
    totalRemainingDebt,
  }
}

// ── 2. Overdue obligations ────────────────────────────────────────────────────

/**
 * Returns all obligations that are currently past due, sorted oldest-first.
 */
export function getOverdue(obligations: Obligation[]): Obligation[] {
  return obligations
    .filter((o) => getObligationStatus(o.nextDueDate) === "overdue")
    .sort(
      (a, b) =>
        new Date(a.nextDueDate).getTime() - new Date(b.nextDueDate).getTime()
    )
}

// ── 3. Due in next 7 days ─────────────────────────────────────────────────────

/**
 * Returns obligations due today or within the next 7 days, sorted by due date.
 */
export function getDueInNext7Days(obligations: Obligation[]): Obligation[] {
  return obligations
    .filter((o) => {
      const status = getObligationStatus(o.nextDueDate)
      return status === "due-today" || status === "due-this-week"
    })
    .sort(
      (a, b) =>
        new Date(a.nextDueDate).getTime() - new Date(b.nextDueDate).getTime()
    )
}

// ── 4. Upcoming list ──────────────────────────────────────────────────────────

/**
 * Returns the next `limit` obligations sorted by nextDueDate (overdue first,
 * then soonest upcoming), shaped for the UpcomingList UI component.
 */
export function getUpcoming(
  obligations: Obligation[],
  limit = 5
): UpcomingObligation[] {
  return obligations
    .slice()
    .sort(
      (a, b) =>
        new Date(a.nextDueDate).getTime() - new Date(b.nextDueDate).getTime()
    )
    .slice(0, limit)
    .map((o) => ({
      id: o.id,
      name: o.name,
      category: o.category,
      type: o.type as "BILL" | "LOAN",
      amount: o.amount,
      nextDueDate: new Date(o.nextDueDate),
      status: getObligationStatus(o.nextDueDate),
    }))
}

// ── 5. Debt progress ──────────────────────────────────────────────────────────

/**
 * Computes overall loan payoff progress and an estimated debt-free date.
 * Debt-free date is derived from the loan that takes the longest to pay off.
 */
export function getDebtProgress(obligations: Obligation[]): DebtProgressData {
  const loans = obligations.filter((o) => o.type === "LOAN")

  const totalRemaining = loans.reduce((sum, l) => sum + l.remainingBalance, 0)
  const totalOriginal = loans.reduce((sum, l) => sum + l.totalAmount, 0)
  const percentPaid = getProgressPercent(totalRemaining, totalOriginal)

  // Estimate debt-free date: find the loan that takes the most months to clear
  let maxMonths = 0
  for (const loan of loans) {
    if (loan.remainingBalance > 0 && loan.amount > 0) {
      const months = Math.ceil(loan.remainingBalance / loan.amount)
      if (months > maxMonths) maxMonths = months
    }
  }
  const estimatedDebtFreeDate =
    maxMonths > 0 ? formatPayoffDate(maxMonths) : null

  // Top 5 loans by remaining balance
  const topLoans = loans
    .filter((l) => l.remainingBalance > 0)
    .sort((a, b) => b.remainingBalance - a.remainingBalance)
    .slice(0, 5)
    .map((l) => ({
      id: l.id,
      name: l.name,
      remainingBalance: l.remainingBalance,
      totalAmount: l.totalAmount,
      percentPaid: getProgressPercent(l.remainingBalance, l.totalAmount),
      monthlyPayment: l.amount,
    }))

  return {
    totalRemaining,
    totalOriginal,
    percentPaid,
    estimatedDebtFreeDate,
    topLoans,
  }
}

// ── 6. Category breakdown ─────────────────────────────────────────────────────

/**
 * Groups obligations by category and sums their monthly-equivalent amounts.
 * Non-monthly recurrences are normalised to a monthly figure.
 */
export function getCategoryBreakdown(
  obligations: Obligation[]
): CategoryBreakdownItem[] {
  const map = new Map<string, CategoryBreakdownItem>()

  for (const o of obligations) {
    const monthly = toMonthlyAmount(o.amount, o.recurrence)
    const existing = map.get(o.category)
    if (existing) {
      existing.totalAmount += monthly
      existing.count++
    } else {
      map.set(o.category, {
        category: o.category,
        totalAmount: monthly,
        count: 1,
      })
    }
  }

  return Array.from(map.values()).sort((a, b) => b.totalAmount - a.totalAmount)
}

/** Normalises an obligation payment to its monthly-equivalent amount. */
function toMonthlyAmount(amount: number, recurrence: string): number {
  switch (recurrence) {
    case "DAILY":
      return amount * 30
    case "WEEKLY":
      return amount * 4.33
    case "MONTHLY":
      return amount
    case "QUARTERLY":
      return amount / 3
    case "ANNUALLY":
      return amount / 12
    default:
      return amount
  }
}

// ── 7. Insights engine ────────────────────────────────────────────────────────

/**
 * Generates a list of human-readable insight strings based on the current
 * state of obligations.  Returns an empty array when there is nothing notable.
 */
export function generateInsights(
  obligations: Obligation[]
): DashboardInsight[] {
  const insights: DashboardInsight[] = []

  const summary = getDashboardSummary(obligations)
  const {
    overdueCount,
    overdueAmount,
    dueInNext7DaysAmount,
    dueInNext7DaysCount,
  } = summary

  // Overdue obligations
  if (overdueCount > 0) {
    insights.push({
      key: "overdue",
      message:
        overdueCount === 1
          ? `You have 1 overdue obligation totalling ₱${overdueAmount.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`
          : `You have ${overdueCount} overdue obligations totalling ₱${overdueAmount.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`,
      severity: "danger",
    })
  }

  // Large amount due in next 7 days
  if (dueInNext7DaysCount > 0) {
    insights.push({
      key: "due-soon",
      message: `₱${dueInNext7DaysAmount.toLocaleString("en-PH", { minimumFractionDigits: 2 })} is due in the next 7 days across ${dueInNext7DaysCount} obligation${dueInNext7DaysCount !== 1 ? "s" : ""}`,
      severity: dueInNext7DaysAmount > 5000 ? "warning" : "info",
    })
  }

  // Obligations clustered within the same week
  const next7 = getDueInNext7Days(obligations)
  if (next7.length >= 3) {
    insights.push({
      key: "clustered",
      message: `${next7.length} obligations fall within the same 7-day window — plan your cash flow`,
      severity: "warning",
    })
  }

  // Largest single payment coming up
  const upcoming = getUpcoming(obligations, 10)
  if (upcoming.length > 0) {
    const largest = upcoming.reduce((max, o) =>
      o.amount > max.amount ? o : max
    )
    if (largest.status === "due-today" || largest.status === "due-this-week") {
      insights.push({
        key: "largest-upcoming",
        message: `Your largest upcoming payment is ${largest.name} — ₱${largest.amount.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`,
        severity: "info",
      })
    }
  }

  // Debt progress milestone
  const debtProgress = getDebtProgress(obligations)
  if (debtProgress.percentPaid >= 75 && debtProgress.totalRemaining > 0) {
    insights.push({
      key: "debt-milestone",
      message: `You're ${debtProgress.percentPaid.toFixed(0)}% of the way to being debt-free — keep going!`,
      severity: "info",
    })
  }

  // No obligations at all
  if (obligations.length === 0) {
    insights.push({
      key: "empty",
      message:
        "No obligations tracked yet. Add your bills and loans to get started.",
      severity: "info",
    })
  }

  return insights
}
