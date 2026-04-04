import { prisma } from "@/db/prisma"

/**
 * Paginated payment history for a user, newest first.
 * Each record includes a minimal obligation snapshot (name + type) so the
 * caller can render payment rows without a second query.
 */
export async function getPaymentHistory(
  userId: string,
  options: { take?: number; skip?: number } = {},
) {
  const { take = 20, skip = 0 } = options

  const [payments, total] = await prisma.$transaction([
    prisma.payment.findMany({
      where: { userId },
      include: { obligation: { select: { name: true, type: true } } },
      orderBy: { paidAt: "desc" },
      take,
      skip,
    }),
    prisma.payment.count({ where: { userId } }),
  ])

  return { payments, total }
}
