import { z } from "zod/v3"

export const obligationFormSchema = z
  .object({
    name: z
      .string()
      .min(1, "Name is required")
      .max(100, "Name must be 100 characters or fewer"),
    type: z.enum(["BILL", "LOAN"], {
      message: "Please select a type",
    }),
    category: z.string().min(1, "Category is required"),
    amount: z
      .number({ message: "Enter a valid amount" })
      .positive("Must be greater than 0"),
    recurrence: z.enum(["DAILY", "WEEKLY", "MONTHLY", "QUARTERLY", "ANNUALLY"]),
    nextDueDate: z.string().min(1, "Next Due date is required"),
    // BILL-specific
    dueDay: z.number().int().min(1, "Minimum 1").max(31, "Maximum 31"),
    // LOAN-specific
    totalAmount: z
      .number({ message: "Enter a valid amount" })
      .positive("Must be greater than 0"),
    remainingBalance: z
      .number({ message: "Enter a valid amount" })
      .nonnegative("Cannot be negative"),
    interestRate: z
      .number({ message: "Enter a valid rate" })
      .min(0, "Cannot be negative")
      .max(100, "Enter the rate as a percentage, e.g. 5.25")
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type === "LOAN") {
      if (!data.totalAmount) {
        ctx.addIssue({
          code: "custom",
          message: "Total loan amount is required",
          path: ["totalAmount"],
        })
      }
      if (data.remainingBalance == null) {
        ctx.addIssue({
          code: "custom",
          message: "Remaining balance is required",
          path: ["remainingBalance"],
        })
      }
      if (
        data.totalAmount != null &&
        data.remainingBalance != null &&
        data.remainingBalance > data.totalAmount
      ) {
        ctx.addIssue({
          code: "custom",
          message: "Cannot exceed total loan amount",
          path: ["remainingBalance"],
        })
      }
    }
  })

export type ObligationInput = z.infer<typeof obligationFormSchema>

// ── Edit schemas (no type change, no dueDay – recomputed server-side) ─────────

const recurrenceEnum = z.enum(["DAILY", "WEEKLY", "MONTHLY", "QUARTERLY", "ANNUALLY"])

export const editBillSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be 100 characters or fewer"),
  category: z.string().min(1, "Category is required"),
  amount: z.number({ message: "Enter a valid amount" }).positive("Must be greater than 0"),
  recurrence: recurrenceEnum,
  nextDueDate: z.string().min(1, "Next due date is required"),
})

export const editLoanSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be 100 characters or fewer"),
  category: z.string().min(1, "Category is required"),
  amount: z.number({ message: "Enter a valid amount" }).positive("Must be greater than 0"),
  recurrence: recurrenceEnum,
  nextDueDate: z.string().min(1, "Next due date is required"),
  remainingBalance: z
    .number({ message: "Enter a valid amount" })
    .nonnegative("Cannot be negative"),
  interestRate: z
    .number({ message: "Enter a valid rate" })
    .min(0, "Cannot be negative")
    .max(100, "Enter the rate as a percentage, e.g. 5.25")
    .optional(),
})

export type EditBillInput = z.infer<typeof editBillSchema>
export type EditLoanInput = z.infer<typeof editLoanSchema>

// ── Payment ───────────────────────────────────────────────────────────────────

export const PAYMENT_MODES = ["Cash", "Bank Transfer", "GCash", "Maya"] as const
export type PaymentMode = (typeof PAYMENT_MODES)[number]

export const markAsPaidSchema = z.object({
  obligationId: z.string(),
  amount: z.number().positive().optional(),
  forDueDate: z.string().optional(),
  modeOfPayment: z.enum(PAYMENT_MODES, { message: "Select a mode of payment" }),
  notes: z.string().optional(),
})

export type MarkAsPaidInput = z.infer<typeof markAsPaidSchema>
