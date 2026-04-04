import { z } from "zod/v3"

export const PAGE_SIZE = 20

export const obligationsSearchSchema = z.object({
  q: z.string().optional(),
  type: z.enum(["ALL", "BILL", "LOAN"]).optional().default("ALL"),
  status: z
    .enum(["ALL", "overdue", "due-today", "due-this-week", "upcoming"])
    .optional()
    .default("ALL"),
  sort: z
    .enum(["due-date", "amount", "balance"])
    .optional()
    .default("due-date"),
  page: z.coerce.number().int().min(1).optional().default(1),
})

export type ObligationsSearch = z.infer<typeof obligationsSearchSchema>
