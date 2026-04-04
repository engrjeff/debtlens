import type { ObligationModel } from "@/generated/prisma"
import { prisma } from "@/db/prisma"
import { toMonthlyAmount } from "./utils"

// ── Public API ────────────────────────────────────────────────────────────────

export type LoanProjection = {
  obligationId: string
  name: string
  remainingBalance: number
  /** null means the monthly payment does not cover accruing interest */
  projectedMonths: number | null
  /** null when projectedMonths is null */
  payoffDate: Date | null
  /** Surface this to the user when projectedMonths is null */
  warning: string | null
}

export type DebtFreeProjection = {
  projections: LoanProjection[]
  totalRemainingDebt: number
  /**
   * The date when the last loan is paid off.
   * null if any single loan's payment never covers its interest.
   */
  debtFreeDate: Date | null
}

/**
 * Project when the user will be completely debt-free.
 *
 * Only LOAN-type obligations with a positive balance are included.  BILL
 * obligations are recurring expenses, not amortising debts, so they have no
 * payoff date.
 *
 * Two payoff formulas are used depending on whether the loan has interest:
 *
 *  No interest (interestRate = null or 0):
 *    n = ceil(remainingBalance / monthlyPayment)
 *
 *  With interest — standard loan amortisation formula:
 *    n = ceil( -ln(1 - r·P / M) / ln(1 + r) )
 *    where r = annualRate / 12, P = remainingBalance, M = monthlyPayment
 *
 *  Edge case — payment ≤ monthly interest accrual (M ≤ P·r):
 *    The debt grows faster than it is being paid.  projectedMonths and
 *    payoffDate are returned as null with an explanatory warning.  This
 *    surfaces a critical data-entry error to the user rather than
 *    returning a silently wrong number.
 *
 * Non-MONTHLY loans are normalised to their monthly equivalent before the
 * amortisation formula is applied (see `toMonthlyAmount`).  The formula is
 * still an approximation for non-monthly cadences because compounding
 * frequency differs, but it is accurate enough for a personal-finance UI.
 */
export async function getDebtFreeProjection(userId: string): Promise<DebtFreeProjection> {
  const loans = await prisma.obligation.findMany({
    where: { userId, type: "LOAN", remainingBalance: { gt: 0 } },
    orderBy: { remainingBalance: "desc" },
  })

  const projections = loans.map(projectLoan)

  const totalRemainingDebt = loans.reduce((sum, l) => sum + l.remainingBalance, 0)

  // The user is debt-free on the date the *last* loan is paid off.
  // If any loan has an unbounded payoff, debtFreeDate is null.
  const hasUnboundedLoan = projections.some((p) => p.payoffDate === null)

  const debtFreeDate = hasUnboundedLoan
    ? null
    : projections.reduce<Date | null>((latest, p) => {
        if (p.payoffDate === null) return latest
        return latest === null || p.payoffDate > latest ? p.payoffDate : latest
      }, null)

  return { projections, totalRemainingDebt, debtFreeDate }
}

// ── Internal helpers ──────────────────────────────────────────────────────────

function projectLoan(loan: ObligationModel): LoanProjection {
  const monthlyPayment = toMonthlyAmount(loan.amount, loan.recurrence)
  const projectedMonths = calcMonthsToPayoff(
    loan.remainingBalance,
    monthlyPayment,
    loan.interestRate,
  )

  const payoffDate = projectedMonths !== null ? addMonths(new Date(), projectedMonths) : null

  const warning =
    projectedMonths === null
      ? `The scheduled payment of ${monthlyPayment.toFixed(2)}/month does not cover ` +
        `the interest accruing on "${loan.name}". ` +
        `Increase the payment or refinance to make progress on this debt.`
      : null

  return {
    obligationId: loan.id,
    name: loan.name,
    remainingBalance: loan.remainingBalance,
    projectedMonths,
    payoffDate,
    warning,
  }
}

/**
 * Calculate months to pay off a loan balance.
 *
 * Returns null when the payment cannot beat the interest — the caller is
 * responsible for surfacing this as an error rather than showing Infinity.
 */
function calcMonthsToPayoff(
  balance: number,
  monthlyPayment: number,
  annualRate: number | null,
): number | null {
  if (balance <= 0) return 0

  const r = annualRate ? annualRate / 12 : 0

  if (r === 0) {
    // Zero-interest: simple division
    return Math.ceil(balance / monthlyPayment)
  }

  const monthlyInterestAccrual = balance * r

  if (monthlyPayment <= monthlyInterestAccrual) {
    // Payment is too small — debt can never be repaid
    return null
  }

  // Standard amortisation: n = -ln(1 - r·P / M) / ln(1 + r)
  const n =
    -Math.log(1 - (r * balance) / monthlyPayment) / Math.log(1 + r)

  return Math.ceil(n)
}

function addMonths(date: Date, months: number): Date {
  const result = new Date(date)
  result.setMonth(result.getMonth() + months)
  return result
}
