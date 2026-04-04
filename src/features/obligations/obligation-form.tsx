import { SubmitButton } from "@/components/submit-button"
import { Button } from "@/components/ui/button"
import { ObligationType, RecurrenceType } from "@/generated/prisma/enums"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "@tanstack/react-router"
import { useServerFn } from "@tanstack/react-start"
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react"
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
import { ObligationTypeSelector } from "./obligation-type-selector"
import { addObligation } from "./obligations.functions"
import { obligationFormSchema, type ObligationInput } from "./schema"

type FormStep = "select-type" | "select-category" | "enter-details"

interface ObligationFormProps {
  onAfterSave: VoidFunction
}

export function ObligationForm({ onAfterSave }: ObligationFormProps) {
  const router = useRouter()
  const addObligationAction = useServerFn(addObligation)

  const [formStep, setFormStep] = useState<FormStep>("select-type")
  const [pending, setPending] = useState(false)

  const form = useForm<ObligationInput>({
    resolver: zodResolver(obligationFormSchema),
    mode: "onChange",
    defaultValues: {
      type: ObligationType.BILL,
      name: "",
      category: "",
      recurrence: RecurrenceType.MONTHLY,
      totalAmount: 0,
      amount: 0, // amount to pay based on recurrence
      dueDay: 1,
      remainingBalance: 0,
      interestRate: 0,
      nextDueDate: "",
    },
  })

  const type = form.watch("type")

  async function handleNextClick() {
    if (formStep === "select-type") {
      setFormStep("select-category")
    } else if (formStep === "select-category") {
      const isValid = await form.trigger(["type", "category"])
      if (!isValid) return
      setFormStep("enter-details")
    }
  }

  function handleBackClick() {
    if (formStep === "enter-details") {
      setFormStep("select-category")
    } else if (formStep === "select-category") {
      setFormStep("select-type")
    }
  }

  const onFormError: SubmitErrorHandler<ObligationInput> = (errors) => {
    console.log("Obligation Form Errors:", errors)
  }

  const onSubmit: SubmitHandler<ObligationInput> = async (data) => {
    try {
      setPending(true)

      console.log("Obligation Form Data:", data)

      const result = await addObligationAction({ data })

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
      >
        {formStep === "select-type" && <ObligationTypeSelector />}
        {formStep === "select-category" && <ObligationCategorySelector />}
        {formStep === "enter-details" && type === "BILL" && <BillForm />}
        {formStep === "enter-details" && type === "LOAN" && <LoanForm />}

        <div className="mt-6 flex justify-end gap-3">
          {formStep !== "select-type" && (
            <Button type="button" variant="ghost" onClick={handleBackClick}>
              <ArrowLeftIcon /> Back
            </Button>
          )}
          {formStep !== "enter-details" && (
            <Button type="button" onClick={handleNextClick}>
              Next <ArrowRightIcon />
            </Button>
          )}
          {formStep === "enter-details" && (
            <SubmitButton type="submit" loading={pending}>
              Create Obligation
            </SubmitButton>
          )}
        </div>
      </form>
    </FormProvider>
  )
}
