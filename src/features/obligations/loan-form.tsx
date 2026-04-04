import { NumberInput } from "@/components/number-input"
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
import { Controller, useFormContext } from "react-hook-form"
import { type ObligationInput } from "./schema"

export function LoanForm() {
  const form = useFormContext<ObligationInput>()

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
              placeholder="Loan name"
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
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Loan Amount</FieldLabel>
              <NumberInput
                id={field.name}
                placeholder="0.00"
                usePeso
                aria-invalid={fieldState.invalid}
                {...form.register("totalAmount", { valueAsNumber: true })}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="remainingBalance"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Remaining Balance</FieldLabel>
              <NumberInput
                id={field.name}
                placeholder="0.00"
                usePeso
                aria-invalid={fieldState.invalid}
                {...form.register("remainingBalance", { valueAsNumber: true })}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
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
                  min={new Date().toISOString().split("T")[0]}
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
    </FieldSet>
  )
}
