import { ensureSession } from "@/lib/auth.functions"
import { createServerFn } from "@tanstack/react-start"
import {
  createObligation,
  getObligationInsights,
  getObligations,
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
