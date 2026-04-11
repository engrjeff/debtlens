import { z } from "zod/v3"

export const PAGE_SIZE = 20

export const paymentsSearchSchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
})

export type PaymentsSearch = z.infer<typeof paymentsSearchSchema>
