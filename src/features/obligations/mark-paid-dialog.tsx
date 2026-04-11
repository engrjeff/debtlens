import { NumberInput } from "@/components/number-input"
import { SubmitButton } from "@/components/submit-button"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { Textarea } from "@/components/ui/textarea"
import type { Obligation } from "@/generated/prisma/browser"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "@tanstack/react-router"
import { useServerFn } from "@tanstack/react-start"
import { format } from "date-fns"
import { useState } from "react"
import {
  Controller,
  FormProvider,
  useForm,
  type SubmitHandler,
} from "react-hook-form"
import { toast } from "sonner"
import { markAsPaid } from "./obligations.functions"
import { markAsPaidSchema, PAYMENT_MODES, type MarkAsPaidInput } from "./schema"

interface MarkPaidDialogProps {
  obligation: Obligation
  open: boolean
  onClose: () => void
}

export function MarkPaidDialog({
  obligation,
  open,
  onClose,
}: MarkPaidDialogProps) {
  const router = useRouter()
  const markAsPaidFn = useServerFn(markAsPaid)
  const [isPending, setIsPending] = useState(false)

  const form = useForm<MarkAsPaidInput>({
    resolver: zodResolver(markAsPaidSchema),
    defaultValues: {
      obligationId: obligation.id,
      amount: obligation.amount,
      forDueDate: format(new Date(obligation.nextDueDate), "yyyy-MM-dd"),
      modeOfPayment: undefined,
      notes: "",
    },
  })

  function handleClose() {
    if (isPending) return
    form.reset()
    onClose()
  }

  const onSubmit: SubmitHandler<MarkAsPaidInput> = async (data) => {
    setIsPending(true)
    try {
      await markAsPaidFn({ data })
      toast.success("Payment recorded", { richColors: true })
      router.invalidate()
      handleClose()
    } catch {
      toast.error("Failed to record payment. Please try again.")
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) handleClose()
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Mark as Paid</DialogTitle>
          <DialogDescription>
            Record a payment for <strong>{obligation.name}</strong>.
          </DialogDescription>
        </DialogHeader>

        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FieldSet disabled={isPending}>
              <Controller
                name="amount"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Payment Amount</FieldLabel>
                    <NumberInput
                      id={field.name}
                      usePeso
                      placeholder="0.00"
                      min={0.01}
                      step={0.01}
                      aria-invalid={fieldState.invalid}
                      {...form.register("amount", { valueAsNumber: true })}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="modeOfPayment"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                      Mode of Payment
                    </FieldLabel>
                    <FieldContent>
                      <NativeSelect
                        id={field.name}
                        className="w-full"
                        aria-invalid={fieldState.invalid}
                        {...field}
                      >
                        <NativeSelectOption value="" disabled>
                          Select mode of payment
                        </NativeSelectOption>
                        <NativeSelectOption value={undefined}>
                          Select mode of payment
                        </NativeSelectOption>
                        {PAYMENT_MODES.map((mode) => (
                          <NativeSelectOption key={mode} value={mode}>
                            {mode}
                          </NativeSelectOption>
                        ))}
                      </NativeSelect>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </FieldContent>
                  </Field>
                )}
              />

              <Controller
                name="notes"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                      Notes{" "}
                      <span className="font-normal text-muted-foreground">
                        (optional)
                      </span>
                    </FieldLabel>
                    <Textarea
                      id={field.name}
                      placeholder="Any additional notes…"
                      rows={3}
                      aria-invalid={fieldState.invalid}
                      {...field}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldSet>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isPending}
              >
                Cancel
              </Button>
              <SubmitButton type="submit" loading={isPending}>
                Confirm Payment
              </SubmitButton>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}
