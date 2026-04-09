import { SubmitButton } from "@/components/submit-button"
import { Button } from "@/components/ui/button"
import type { Obligation } from "@/generated/prisma/browser"
import { ObligationType, RecurrenceType } from "@/generated/prisma/enums"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "@tanstack/react-router"
import { useServerFn } from "@tanstack/react-start"
import { format } from "date-fns"
import { useState, type ChangeEventHandler } from "react"
import {
  FormProvider,
  useForm,
  type SubmitErrorHandler,
  type SubmitHandler,
} from "react-hook-form"
import { toast } from "sonner"
import { BillForm } from "./bill-form"
import { LoanForm } from "./loan-form"
import { ObligationCategorySelector } from "./obligation-category-selector"
import { editObligation } from "./obligations.functions"
import { obligationFormSchema, type ObligationInput } from "./schema"

interface ObligationEditFormProps {
  onAfterSave: VoidFunction
  obligation: Obligation
}

export function ObligationEditForm({
  obligation,
  onAfterSave,
}: ObligationEditFormProps) {
  const router = useRouter()
  const editObligationAction = useServerFn(editObligation)

  const [pending, setPending] = useState(false)

  const form = useForm<ObligationInput>({
    resolver: zodResolver(obligationFormSchema),
    mode: "onChange",
    defaultValues: {
      type: obligation.type,
      name: obligation.name,
      category: obligation.category,
      recurrence: obligation.recurrence,
      totalAmount: obligation.totalAmount,
      amount: obligation.amount, // amount to pay based on recurrence
      dueDay: obligation.dueDay ?? 1,
      remainingBalance: obligation.remainingBalance,
      interestRate: obligation.interestRate ?? undefined,
      nextDueDate: format(new Date(obligation.nextDueDate), "yyyy-MM-dd"),
    },
  })

  const type = form.watch("type")

  const onFormError: SubmitErrorHandler<ObligationInput> = (errors) => {
    console.log("Obligation Edit Form Errors:", errors)
  }

  const onSubmit: SubmitHandler<ObligationInput> = async (data) => {
    try {
      setPending(true)

      console.log("Obligation Edit Form Data:", data)

      const result = await editObligationAction({
        data: { data, type: obligation.type, obligationId: obligation.id },
      })

      console.log(result)

      if (result.id) {
        toast.success(`${result.name} is saved!`, { richColors: true })
        router.invalidate()
        onAfterSave()
      }
    } catch (error) {
      console.log(error)
    } finally {
      setPending(false)
    }
  }

  const handleValuesSync: ChangeEventHandler<HTMLFormElement> = (event) => {
    const formData = new FormData(event.currentTarget)

    const amount = formData.get("amount") as string
    const recurrence = formData.get("recurrence") as string
    const nextDueDate = formData.get("nextDueDate") as string

    if (recurrence === RecurrenceType.MONTHLY) {
      if (amount && type === ObligationType.BILL) {
        form.setValue("totalAmount", Number(amount))
      }

      if (nextDueDate) {
        const dueDay = new Date(nextDueDate).getDate() // 1-31

        form.setValue("dueDay", dueDay)
      }

      if (!nextDueDate) {
        form.setValue("dueDay", 1)
      }
    } else {
      form.setValue("dueDay", 1)
    }
  }

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onFormError)}
        onChange={handleValuesSync}
        className="space-y-4"
      >
        <ObligationCategorySelector label="Category" />
        {type === "BILL" && <BillForm />}
        {type === "LOAN" && <LoanForm />}

        <div className="mt-6 flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onAfterSave}>
            Cancel
          </Button>
          <SubmitButton type="submit" loading={pending}>
            Save Changes
          </SubmitButton>
        </div>
      </form>
    </FormProvider>
  )
}
