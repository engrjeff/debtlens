import { ensureSession } from "@/lib/auth.functions"
import { createServerFn } from "@tanstack/react-start"
import { getPayments } from "./payments.server"
import { paymentsSearchSchema } from "./search-params"

export const fetchPayments = createServerFn({ method: "GET" })
  .inputValidator(paymentsSearchSchema)
  .handler(async ({ data }) => {
    const session = await ensureSession()
    return getPayments(session.user.id, data)
  })
