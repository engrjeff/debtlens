import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from "@/components/ui/native-select"
import { ObligationType } from "@/generated/prisma/enums"
import { OBLIGATION_CATEGORIES } from "@/lib/constants/obligation-categories"
import { Controller, useFormContext } from "react-hook-form"
import { type ObligationInput } from "./schema"

export function ObligationCategorySelector({
  label = "Now, select a category",
}: {
  label?: string
}) {
  const form = useFormContext<ObligationInput>()

  const type = form.watch("type")

  const categories =
    type === ObligationType.BILL
      ? OBLIGATION_CATEGORIES.bill
      : OBLIGATION_CATEGORIES.loan

  return (
    <Controller
      control={form.control}
      name="category"
      render={({ field, fieldState }) => (
        <Field>
          <FieldLabel htmlFor="category">{label}</FieldLabel>
          <FieldContent>
            <NativeSelect
              {...field}
              id="category"
              aria-invalid={fieldState.invalid}
              className="w-full"
            >
              <NativeSelectOption value="">
                Select a category
              </NativeSelectOption>
              {categories.map((group) => (
                <NativeSelectOptGroup key={group.group} label={group.group}>
                  {group.options.map((option) => (
                    <NativeSelectOption key={option.value} value={option.value}>
                      {option.label}
                    </NativeSelectOption>
                  ))}
                </NativeSelectOptGroup>
              ))}
            </NativeSelect>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </FieldContent>
        </Field>
      )}
    />
  )
}
