import { ensureSession } from "@/lib/auth.functions"
import { createServerFn } from "@tanstack/react-start"
import { z } from "zod/v3"
import {
  createObligation,
  deleteObligation,
  getObligation,
  getObligationInsights,
  getObligations,
  markObligationPaid,
  updateObligation,
} from "./obligations.server"
import { editBillSchema, editLoanSchema, markAsPaidSchema, obligationFormSchema } from "./schema"
import { obligationsSearchSchema } from "./search-params"

export const fetchObligations = createServerFn({ method: "GET" })
  .inputValidator(obligationsSearchSchema)
  .handler(async ({ data }) => {
    const session = await ensureSession()
    return getObligations(session.user.id, data)
  })

export const fetchObligationInsights = createServerFn({
  method: "GET",
}).handler(async () => {
  const session = await ensureSession()
  return getObligationInsights(session.user.id)
})

export const fetchObligationById = createServerFn({ method: "GET" })
  .inputValidator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    const session = await ensureSession()
    return getObligation(data.id, session.user.id)
  })

export const addObligation = createServerFn({ method: "POST" })
  .inputValidator(obligationFormSchema)
  .handler(async ({ data }) => {
    const session = await ensureSession()
    return createObligation(data, session.user.id)
  })

export const editObligation = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      obligationId: z.string(),
      type: z.enum(["BILL", "LOAN"]),
      // Validated precisely in the handler after type is known
      data: z.record(z.unknown()),
    })
  )
  .handler(async ({ data: input }) => {
    const session = await ensureSession()
    const parsed =
      input.type === "BILL"
        ? editBillSchema.parse(input.data)
        : editLoanSchema.parse(input.data)
    return updateObligation(input.obligationId, session.user.id, parsed)
  })

export const removeObligation = createServerFn({ method: "POST" })
  .inputValidator(z.object({ obligationId: z.string() }))
  .handler(async ({ data }) => {
    const session = await ensureSession()
    return deleteObligation(data.obligationId, session.user.id)
  })

export const markAsPaid = createServerFn({ method: "POST" })
  .inputValidator(markAsPaidSchema)
  .handler(async ({ data }) => {
    const session = await ensureSession()
    return markObligationPaid(data.obligationId, session.user.id, {
      amount: data.amount,
      forDueDate: data.forDueDate ? new Date(data.forDueDate) : undefined,
      modeOfPayment: data.modeOfPayment,
      notes: data.notes,
    })
  })
