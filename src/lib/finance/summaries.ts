import { prisma } from "@/db/prisma"
import { toMonthlyAmount } from "./utils"

/**
 * Total normalised monthly cost across all active obligations.
 *
 * "Active" means remainingBalance > 0.  Every recurrence type is converted
 * to its monthly equivalent so the figure is comparable and directly usable
 * in budget cards or cash-flow summaries.
 *
 * Returns both the aggregate total and the per-obligation breakdown with
 * each item's `monthlyEquivalent` pre-computed, so the UI can show a table
 * without re-running the normalisation math.
 */
export async function getMonthlyDue(userId: string) {
  const obligations = await prisma.obligation.findMany({
    where: { userId, remainingBalance: { gt: 0 } },
    orderBy: { nextDueDate: "asc" },
  })

  const breakdown = obligations.map((o) => ({
    ...o,
    monthlyEquivalent: toMonthlyAmount(o.amount, o.recurrence),
  }))

  const total = breakdown.reduce((sum, o) => sum + o.monthlyEquivalent, 0)

  return { total, breakdown }
}

/**
 * Obligations whose nextDueDate falls within the next 7 days.
 *
 * The window is [now, now + 7 days] inclusive.  Both endpoints are
 * constructed from the same `now` snapshot to avoid any drift between
 * the two comparisons in the WHERE clause.
 *
 * Only active obligations (remainingBalance > 0) are returned — a fully
 * paid-off loan will not appear even if its nextDueDate is tomorrow.
 */
export async function getWeeklyDue(userId: string) {
  const now = new Date()
  const in7Days = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7)

  return prisma.obligation.findMany({
    where: {
      userId,
      remainingBalance: { gt: 0 },
      nextDueDate: { gte: now, lte: in7Days },
    },
    orderBy: { nextDueDate: "asc" },
  })
}

/**
 * Obligations that are past due and still carry a balance.
 *
 * "Overdue" means nextDueDate < now — i.e. the scheduled payment date has
 * already passed without the date being advanced (which happens inside
 * `markAsPaid`).  Sorted oldest-first so the most urgent items appear at
 * the top.
 */
export async function getOverdue(userId: string) {
  return prisma.obligation.findMany({
    where: {
      userId,
      remainingBalance: { gt: 0 },
      nextDueDate: { lt: new Date() },
    },
    orderBy: { nextDueDate: "asc" },
  })
}

/**
 * All payments recorded in the current calendar month, with a running total.
 *
 * The month boundary is computed in local server time using explicit
 * year/month construction:
 *   - startOfMonth → midnight on the 1st
 *   - endOfMonth   → 23:59:59.999 on the last day
 *
 * Using `new Date(y, m + 1, 0)` (day-0 of next month) gives the last day of
 * the current month without importing a date library or hard-coding month
 * lengths.
 *
 * Each payment includes an obligation snapshot (name + type) for rendering.
 */
export async function getThisMonthPayments(userId: string) {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)

  const payments = await prisma.payment.findMany({
    where: {
      userId,
      paidAt: { gte: startOfMonth, lte: endOfMonth },
    },
    include: { obligation: { select: { name: true, type: true } } },
    orderBy: { paidAt: "desc" },
  })

  const total = payments.reduce((sum, p) => sum + p.amount, 0)

  return { total, payments }
}
