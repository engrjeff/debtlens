import { Controller, useFormContext } from "react-hook-form"
import type {ObligationInput} from "./schema";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ObligationType } from "@/generated/prisma/enums"

export function ObligationTypeSelector() {
  const form = useFormContext<ObligationInput>()

  return (
    <Controller
      control={form.control}
      name="type"
      render={({ field, fieldState }) => (
        <FieldSet>
          <FieldLegend>What would you like to track?</FieldLegend>
          <RadioGroup
            name={field.name}
            value={field.value}
            onValueChange={field.onChange}
          >
            <FieldLabel htmlFor="bill">
              <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                <FieldContent>
                  <FieldTitle>Bill</FieldTitle>
                  <FieldDescription>Track repeating payments</FieldDescription>
                </FieldContent>
                <RadioGroupItem
                  value={ObligationType.BILL}
                  id="bill"
                  aria-invalid={fieldState.invalid}
                />
              </Field>
            </FieldLabel>
            <FieldLabel htmlFor="loan">
              <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                <FieldContent>
                  <FieldTitle>Loan / Debt</FieldTitle>
                  <FieldDescription>Track balances & payoff</FieldDescription>
                </FieldContent>
                <RadioGroupItem
                  value={ObligationType.LOAN}
                  id="loan"
                  aria-invalid={fieldState.invalid}
                />
              </Field>
            </FieldLabel>
          </RadioGroup>
        </FieldSet>
      )}
    />
  )
}
