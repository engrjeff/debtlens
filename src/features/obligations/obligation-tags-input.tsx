import { XIcon } from "lucide-react"
import { useState } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { dedupeTagsCaseInsensitive } from "./helpers"
import type { KeyboardEventHandler } from "react"
import type { ObligationInput } from "./schema"
import { Field, FieldContent, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Tag } from "@/components/ui/tag"

const MAX_TAGS = 3

export function ObligationTagsInput() {
  const form = useFormContext<ObligationInput>()
  const [draft, setDraft] = useState("")

  return (
    <Controller
      control={form.control}
      name="tags"
      render={({ field, fieldState }) => {
        const tags = field.value

        function commitDraft() {
          const value = draft.trim()
          setDraft("")
          if (!value || tags.length >= MAX_TAGS) return
          field.onChange(dedupeTagsCaseInsensitive([...tags, value]))
        }

        function removeTag(tag: string) {
          field.onChange(tags.filter((t) => t !== tag))
        }

        const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault()
            commitDraft()
          } else if (e.key === "Backspace" && !draft && tags.length > 0) {
            removeTag(tags[tags.length - 1])
          }
        }

        return (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="tags">Tags (optional)</FieldLabel>
            <FieldContent>
              <Input
                id="tags"
                placeholder={
                  tags.length >= MAX_TAGS
                    ? `Up to ${MAX_TAGS} tags`
                    : "Add a tag and press Enter"
                }
                value={draft}
                disabled={tags.length >= MAX_TAGS}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={commitDraft}
                aria-invalid={fieldState.invalid}
              />
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {tags.map((tag) => (
                    <Tag key={tag}>
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        aria-label={`Remove ${tag}`}
                      >
                        <XIcon className="size-3" />
                      </button>
                    </Tag>
                  ))}
                </div>
              )}
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </FieldContent>
          </Field>
        )
      }}
    />
  )
}
