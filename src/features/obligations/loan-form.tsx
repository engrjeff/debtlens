import { useState } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { ObligationTagsInput } from "./obligation-tags-input"
import type { ObligationInput } from "./schema"
import { NumberInput } from "@/components/number-input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { RecurrenceType } from "@/generated/prisma/enums"

export function LoanForm({
  allowPastDueDate = false,
}: {
  allowPastDueDate?: boolean
}) {
  const form = useFormContext<ObligationInput>()
  const [sameAsLoan, setSameAsLoan] = useState(false)

  return (
    <FieldSet>
      <FieldLegend className="sr-only">Loan Details</FieldLegend>
      <Controller
        name="name"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>
              What shall we call this loan?
            </FieldLabel>
            <Input
              {...field}
              id={field.name}
              placeholder="Loan/Debt name"
              aria-invalid={fieldState.invalid}
              autoFocus
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <div className="grid grid-cols-2 gap-4">
        <Controller
          name="recurrence"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Recurrence</FieldLabel>
              <FieldContent>
                <NativeSelect
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  className="w-full"
                  {...field}
                >
                  <NativeSelectOption value={RecurrenceType.DAILY}>
                    Daily
                  </NativeSelectOption>
                  <NativeSelectOption value={RecurrenceType.WEEKLY}>
                    Weekly
                  </NativeSelectOption>
                  <NativeSelectOption value={RecurrenceType.MONTHLY}>
                    Monthly
                  </NativeSelectOption>
                  <NativeSelectOption value={RecurrenceType.QUARTERLY}>
                    Quarterly
                  </NativeSelectOption>
                  <NativeSelectOption value={RecurrenceType.ANNUALLY}>
                    Annually
                  </NativeSelectOption>
                </NativeSelect>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </FieldContent>
            </Field>
          )}
        />
        <Controller
          name="amount"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Payment Amount</FieldLabel>
              <NumberInput
                id={field.name}
                placeholder="0.00"
                usePeso
                aria-invalid={fieldState.invalid}
                {...form.register("amount", { valueAsNumber: true })}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Controller
          name="totalAmount"
          control={form.control}
          render={({ field, fieldState }) => {
            const registered = form.register("totalAmount", {
              valueAsNumber: true,
            })
            return (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Loan Amount</FieldLabel>
                <NumberInput
                  id={field.name}
                  placeholder="0.00"
                  usePeso
                  aria-invalid={fieldState.invalid}
                  {...registered}
                  onChange={(e) => {
                    registered.onChange(e)
                    if (sameAsLoan) {
                      form.setValue(
                        "remainingBalance",
                        parseFloat(e.target.value) || 0,
                        { shouldValidate: true }
                      )
                    }
                  }}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )
          }}
        />
        <Controller
          name="remainingBalance"
          control={form.control}
          render={({ field, fieldState }) => {
            const registered = form.register("remainingBalance", {
              valueAsNumber: true,
            })
            return (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Remaining Balance</FieldLabel>
                <NumberInput
                  id={field.name}
                  placeholder="0.00"
                  usePeso
                  aria-invalid={fieldState.invalid}
                  {...registered}
                  onChange={(e) => {
                    registered.onChange(e)
                    if (sameAsLoan) {
                      const val = parseFloat(e.target.value) || 0
                      if (val !== form.getValues("totalAmount")) {
                        setSameAsLoan(false)
                      }
                    }
                  }}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
                <label className="mt-1 flex cursor-pointer items-center gap-2 text-xs text-muted-foreground">
                  <Checkbox
                    checked={sameAsLoan}
                    onCheckedChange={(checked) => {
                      const next = checked === true
                      setSameAsLoan(next)
                      if (next) {
                        form.setValue(
                          "remainingBalance",
                          form.getValues("totalAmount"),
                          { shouldValidate: true }
                        )
                      }
                    }}
                  />
                  Same as Loan Amount
                </label>
              </Field>
            )
          }}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Controller
          name="nextDueDate"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Next Due Date</FieldLabel>
              <FieldContent>
                <Input
                  type="date"
                  min={
                    allowPastDueDate
                      ? undefined
                      : new Date().toISOString().split("T")[0]
                  }
                  aria-invalid={fieldState.invalid}
                  {...field}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </FieldContent>
            </Field>
          )}
        />
      </div>
      <ObligationTagsInput />
    </FieldSet>
  )
}
