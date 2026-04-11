import { PAGE_SIZE } from "./search-params"
import type { PaymentsSearch } from "./search-params"
import { prisma } from "@/db/prisma"

export async function getPayments(userId: string, search: PaymentsSearch) {
  const page = search.page
  const skip = (page - 1) * PAGE_SIZE

  const where = { userId }

  const [items, total] = await Promise.all([
    prisma.payment.findMany({
      where,
      orderBy: { paidAt: "desc" },
      skip,
      take: PAGE_SIZE,
      include: {
        obligation: {
          select: { id: true, name: true, category: true, type: true },
        },
      },
    }),
    prisma.payment.count({ where }),
  ])

  return {
    items,
    pageInfo: {
      total,
      page,
      pageSize: PAGE_SIZE,
      totalPages: Math.ceil(total / PAGE_SIZE),
      hasNextPage: page * PAGE_SIZE < total,
      hasPrevPage: page > 1,
    },
  }
}
