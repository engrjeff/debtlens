import { prisma } from "@/db/prisma"
import {
  addDays,
  startOfTomorrow as dateFnsStartOfTomorrow,
  endOfMonth,
  startOfDay,
  startOfMonth,
} from "date-fns"
import { computeNextDueDate } from "./helpers"
import type { EditBillInput, EditLoanInput, ObligationInput } from "./schema"
import { PAGE_SIZE, type ObligationsSearch } from "./search-params"

export async function getObligations(
  userId: string,
  search: ObligationsSearch
) {
  const now = new Date()
  const startOfToday = startOfDay(now)
  const startOfTomorrow = dateFnsStartOfTomorrow()
  const endOfWeek = addDays(startOfToday, 8) // inclusive of day 7
  const monthStart = startOfMonth(now)
  const monthEnd = endOfMonth(now)

  const statusFilter = (() => {
    switch (search.status) {
      case "overdue":
        return { nextDueDate: { lt: startOfToday } }
      case "due-today":
        return { nextDueDate: { gte: startOfToday, lt: startOfTomorrow } }
      case "due-this-week":
        return { nextDueDate: { gte: startOfToday, lt: endOfWeek } }
      case "due-this-month":
        return { nextDueDate: { gte: monthStart, lte: monthEnd } }
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
      case "type":
        return { type: "desc" as const }
      default:
        return { nextDueDate: "asc" as const }
    }
  })()

  const where = {
    userId,
    isDeleted: false,
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
  return prisma.obligation.findMany({ where: { userId, isDeleted: false } })
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

export async function updateObligation(
  obligationId: string,
  userId: string,
  data: EditBillInput | EditLoanInput
) {
  const obligation = await prisma.obligation.findFirst({
    where: { id: obligationId, userId, isDeleted: false },
  })

  if (!obligation) {
    throw new Error("Obligation not found")
  }

  // Recompute dueDay from nextDueDate when recurrence is monthly-based
  let dueDay: number
  if (data.recurrence === "MONTHLY") {
    dueDay = new Date(data.nextDueDate).getDate()
  } else {
    dueDay = 1
  }

  return prisma.obligation.update({
    where: { id: obligationId },
    data: {
      ...data,
      nextDueDate: new Date(data.nextDueDate),
      dueDay,
    },
  })
}

export async function deleteObligation(obligationId: string, userId: string) {
  const obligation = await prisma.obligation.findFirst({
    where: { id: obligationId, userId, isDeleted: false },
  })

  if (!obligation) {
    throw new Error("Obligation not found")
  }

  return prisma.obligation.update({
    where: { id: obligationId },
    data: { isDeleted: true },
  })
}

export async function markObligationPaid(
  obligationId: string,
  userId: string,
  payload: {
    amount?: number
    forDueDate?: Date
    modeOfPayment: string
    notes?: string
  }
) {
  const obligation = await prisma.obligation.findFirst({
    where: { id: obligationId, userId },
  })

  if (!obligation) {
    throw new Error("Obligation not found")
  }

  const amount = payload.amount ?? obligation.amount
  const forDueDate = payload.forDueDate ?? obligation.nextDueDate

  return prisma.$transaction(async (tx) => {
    await tx.payment.create({
      data: {
        obligationId,
        userId,
        amount,
        forDueDate,
        modeOfPayment: payload.modeOfPayment,
        notes: payload.notes,
        paidAt: new Date(),
      },
    })

    let nextDueDate: Date
    let remainingBalance = obligation.remainingBalance

    if (obligation.type === "LOAN") {
      remainingBalance = Math.max(0, obligation.remainingBalance - amount)
      // Stop advancing the due date once fully paid
      nextDueDate =
        remainingBalance > 0
          ? computeNextDueDate(
              obligation.nextDueDate,
              obligation.recurrence,
              obligation.dueDay
            )
          : obligation.nextDueDate
    } else {
      nextDueDate = computeNextDueDate(
        obligation.nextDueDate,
        obligation.recurrence,
        obligation.dueDay
      )
    }

    return tx.obligation.update({
      where: { id: obligationId },
      data: { nextDueDate, remainingBalance },
    })
  })
}

export async function getObligation(id: string, userId: string) {
  const obligation = await prisma.obligation.findUnique({
    where: { id, userId, isDeleted: false },
    include: {
      payments: {
        orderBy: { paidAt: "desc" },
      },
    },
  })

  if (!obligation) {
    throw new Error("Obligation not found")
  }

  return obligation
}
