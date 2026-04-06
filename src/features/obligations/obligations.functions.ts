import { ensureSession } from "@/lib/auth.functions"
import { createServerFn } from "@tanstack/react-start"
import { z } from "zod"
import {
  createObligation,
  getObligationInsights,
  getObligations,
  markObligationPaid,
} from "./obligations.server"
import { obligationFormSchema } from "./schema"
import { obligationsSearchSchema } from "./search-params"

export const fetchObligations = createServerFn({ method: "GET" })
  .inputValidator(obligationsSearchSchema)
  .handler(async ({ data }) => {
    const session = await ensureSession()
    return getObligations(session.user.id, data)
  })

export const fetchObligationInsights = createServerFn({ method: "GET" }).handler(
  async () => {
    const session = await ensureSession()
    return getObligationInsights(session.user.id)
  }
)

export const addObligation = createServerFn({ method: "POST" })
  .inputValidator(obligationFormSchema)
  .handler(async ({ data }) => {
    const session = await ensureSession()
    return createObligation(data, session.user.id)
  })

export const markAsPaid = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      obligationId: z.string(),
      amount: z.number().positive().optional(),
    }),
  )
  .handler(async ({ data }) => {
    const session = await ensureSession()
    return markObligationPaid(data.obligationId, session.user.id, data.amount)
  })
