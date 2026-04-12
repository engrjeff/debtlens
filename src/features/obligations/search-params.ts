import { z } from "zod/v3"

export const PAGE_SIZE = 20

export const obligationsSearchSchema = z.object({
  q: z.string().optional(),
  type: z.enum(["ALL", "BILL", "LOAN"]).optional().default("ALL"),
  status: z
    .enum(["overdue", "due-today", "due-this-week", "due-this-month", "done"])
    .optional(),
  categories: z.array(z.string()).optional(),
  dueRange: z
    .enum(["any", "today", "next7days", "thisMonth", "custom"])
    .optional(),
  dueStart: z.string().optional(),
  dueEnd: z.string().optional(),
  minAmount: z.coerce.number().optional(),
  maxAmount: z.coerce.number().optional(),
  minBalance: z.coerce.number().optional(),
  maxBalance: z.coerce.number().optional(),
  progress: z.enum(["low", "mid", "high"]).optional(),
  sort: z
    .enum(["due-date", "amount", "balance", "type"])
    .optional()
    .default("due-date"),
  page: z.coerce.number().int().min(1).optional().default(1),
  view: z.enum(["grid", "list"]).optional().default("grid"),
})

export type ObligationsSearch = z.infer<typeof obligationsSearchSchema>
