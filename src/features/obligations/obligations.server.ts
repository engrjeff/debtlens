import { prisma } from "@/db/prisma"
import type { ObligationInput } from "./schema"
import { PAGE_SIZE, type ObligationsSearch } from "./search-params"
import { computeNextDueDate } from "./helpers"

export async function getObligations(
  userId: string,
  search: ObligationsSearch
) {
  const now = new Date()
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  )
  const startOfTomorrow = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1
  )
  const endOfWeek = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 8 // inclusive of day 7
  )

  const statusFilter = (() => {
    switch (search.status) {
      case "overdue":
        return { nextDueDate: { lt: startOfToday } }
      case "due-today":
        return { nextDueDate: { gte: startOfToday, lt: startOfTomorrow } }
      case "due-this-week":
        return { nextDueDate: { gte: startOfToday, lt: endOfWeek } }
      case "upcoming":
        return { nextDueDate: { gte: endOfWeek } }
      default:
        return {}
    }
  })()

  const orderBy = (() => {
    switch (search.sort) {
      case "amount":
        return { amount: "desc" as const }
      case "balance":
        return { remainingBalance: "desc" as const }
      default:
        return { nextDueDate: "asc" as const }
    }
  })()

  const where = {
    userId,
    ...(search.type !== "ALL" ? { type: search.type } : {}),
    ...(search.q
      ? {
          OR: [
            { name: { contains: search.q, mode: "insensitive" as const } },
            { category: { contains: search.q, mode: "insensitive" as const } },
          ],
        }
      : {}),
    ...statusFilter,
  }

  const page = search.page ?? 1
  const skip = (page - 1) * PAGE_SIZE

  const [items, total] = await Promise.all([
    prisma.obligation.findMany({ where, orderBy, skip, take: PAGE_SIZE }),
    prisma.obligation.count({ where }),
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

export async function getObligationInsights(userId: string) {
  return prisma.obligation.findMany({ where: { userId } })
}

export async function createObligation(data: ObligationInput, userId: string) {
  const obligation = await prisma.obligation.create({
    data: {
      ...data,
      nextDueDate: new Date(data.nextDueDate),
      userId,
    },
  })

  return obligation
}

export async function markObligationPaid(
  obligationId: string,
  userId: string,
  paymentAmount?: number,
) {
  const obligation = await prisma.obligation.findFirst({
    where: { id: obligationId, userId },
  })

  if (!obligation) {
    throw new Error("Obligation not found")
  }

  const amount = paymentAmount ?? obligation.amount

  return prisma.$transaction(async (tx) => {
    await tx.payment.create({
      data: { obligationId, userId, amount, paidAt: new Date() },
    })

    let nextDueDate: Date
    let remainingBalance = obligation.remainingBalance

    if (obligation.type === "LOAN") {
      remainingBalance = Math.max(0, obligation.remainingBalance - amount)
      // Stop advancing the due date once fully paid
      nextDueDate =
        remainingBalance > 0
          ? computeNextDueDate(obligation.nextDueDate, obligation.recurrence, obligation.dueDay)
          : obligation.nextDueDate
    } else {
      nextDueDate = computeNextDueDate(
        obligation.nextDueDate,
        obligation.recurrence,
        obligation.dueDay,
      )
    }

    return tx.obligation.update({
      where: { id: obligationId },
      data: { nextDueDate, remainingBalance },
    })
  })
}
