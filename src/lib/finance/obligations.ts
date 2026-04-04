import { prisma } from "@/db/prisma"
import { computeNextDueDate } from "./utils"

/**
 * Mark an obligation as paid for one billing period.
 *
 * Performs three writes atomically inside a transaction:
 *   1. Creates a Payment record (amount paid, optional proof, timestamp).
 *   2. Reduces `remainingBalance` — floored at 0 so it never goes negative.
 *   3. Advances `nextDueDate` to the next future date in the billing cycle.
 *      If the obligation was multiple periods overdue, the date is fast-
 *      forwarded until it lands after now (see `computeNextDueDate`).
 *
 * The obligation is fetched *outside* the transaction so that errors like
 * "not found" surface immediately without opening a tx unnecessarily.
 *
 * @throws {PrismaClientKnownRequestError} P2025 if the obligation does not exist.
 */
export async function markAsPaid(
  obligationId: string,
  paymentAmount: number,
  proofOfPayment?: string,
) {
  const obligation = await prisma.obligation.findUniqueOrThrow({
    where: { id: obligationId },
  })

  const newBalance = Math.max(0, obligation.remainingBalance - paymentAmount)

  const nextDueDate = computeNextDueDate(
    obligation.nextDueDate,
    obligation.recurrence,
    obligation.dueDay,
  )

  return prisma.$transaction(async (tx) => {
    const payment = await tx.payment.create({
      data: {
        id: crypto.randomUUID(),
        userId: obligation.userId,
        obligationId,
        amount: paymentAmount,
        proofOfPayment,
        paidAt: new Date(),
      },
    })

    await tx.obligation.update({
      where: { id: obligationId },
      data: { remainingBalance: newBalance, nextDueDate },
    })

    return payment
  })
}

/**
 * Advance the nextDueDate without recording a payment.
 *
 * Useful for:
 *   - Correcting stale dates on obligations that were never paid (e.g. on
 *     app startup, a cron job, or an admin action).
 *   - Skipping a period when a payment was made outside the app.
 *
 * Like `markAsPaid`, the new date is always a future date — multiple periods
 * of overdue time are skipped in one call.
 *
 * @throws {PrismaClientKnownRequestError} P2025 if the obligation does not exist.
 */
export async function advanceNextDueDate(obligationId: string) {
  const obligation = await prisma.obligation.findUniqueOrThrow({
    where: { id: obligationId },
  })

  const nextDueDate = computeNextDueDate(
    obligation.nextDueDate,
    obligation.recurrence,
    obligation.dueDay,
  )

  return prisma.obligation.update({
    where: { id: obligationId },
    data: { nextDueDate },
  })
}
