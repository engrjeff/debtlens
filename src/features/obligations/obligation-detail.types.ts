import type { Obligation, Payment } from "@/generated/prisma/browser"

// ── Core entity types ─────────────────────────────────────────────────────────

export type PaymentRecord = Pick<
  Payment,
  "id" | "amount" | "paidAt" | "forDueDate" | "modeOfPayment" | "notes" | "proofOfPayment"
>

export type ObligationWithPayments = Obligation & {
  payments: PaymentRecord[]
}

// ── Derived / computed types ──────────────────────────────────────────────────

export type DueDateStatus = "overdue" | "due-today" | "due-this-week" | "upcoming"

export type LoanStats = {
  amountPaid: number
  progressPercent: number
  /** Estimated months to full payoff at current monthly payment */
  payoffMonths: number
}

export type ObligationInsight = {
  label: string
  /** Optional icon name for rendering (informational only) */
  tone: "neutral" | "positive" | "warning" | "danger"
}
