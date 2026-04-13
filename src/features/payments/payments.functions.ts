import { createServerFn } from "@tanstack/react-start"
import { getPayments, getRecentPayments } from "./payments.server"
import { paymentsSearchSchema } from "./search-params"
import { ensureSession } from "@/lib/auth.functions"

export const fetchRecentPayments = createServerFn({ method: "GET" }).handler(
  async () => {
    const session = await ensureSession()
    return getRecentPayments(session.user.id, 5)
  }
)

export const fetchPayments = createServerFn({ method: "GET" })
  .inputValidator(paymentsSearchSchema)
  .handler(async ({ data }) => {
    const session = await ensureSession()
    return getPayments(session.user.id, data)
  })
