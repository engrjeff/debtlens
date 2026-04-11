import { z } from "zod/v3"

export const PAGE_SIZE = 20

export const obligationsSearchSchema = z.object({
  q: z.string().optional(),
  type: z.enum(["ALL", "BILL", "LOAN"]).optional().default("ALL"),
  status: z
    .enum(["overdue", "due-today", "due-this-week", "due-this-month"])
    .optional(),
  sort: z
    .enum(["due-date", "amount", "balance", "type"])
    .optional()
    .default("due-date"),
  page: z.coerce.number().int().min(1).optional().default(1),
  view: z.enum(["grid", "list"]).optional().default("grid"),
})

export type ObligationsSearch = z.infer<typeof obligationsSearchSchema>
