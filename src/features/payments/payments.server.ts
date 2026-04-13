import { PAGE_SIZE } from "./search-params"
import type { PaymentsSearch } from "./search-params"
import { prisma } from "@/db/prisma"

export async function getRecentPayments(userId: string, limit = 5) {
  return prisma.payment.findMany({
    where: { userId, obligation: { isDeleted: false } },
    orderBy: { paidAt: "desc" },
    take: limit,
    include: {
      obligation: {
        select: { id: true, name: true, category: true, type: true },
      },
    },
  })
}

export async function getPayments(userId: string, search: PaymentsSearch) {
  const page = search.page
  const skip = (page - 1) * PAGE_SIZE

  const [items, total] = await Promise.all([
    prisma.payment.findMany({
      where: { userId, obligation: { isDeleted: false } },
      orderBy: { paidAt: "desc" },
      skip,
      take: PAGE_SIZE,
      include: {
        obligation: {
          select: { id: true, name: true, category: true, type: true },
        },
      },
    }),
    prisma.payment.count({
      where: { userId, obligation: { isDeleted: false } },
    }),
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
