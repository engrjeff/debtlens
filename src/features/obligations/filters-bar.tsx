import { Button } from "@/components/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { Search, XIcon } from "lucide-react"
import { useState } from "react"
import type { ObligationsSearch } from "./search-params"

interface FiltersBarProps {
  search: ObligationsSearch
  onUpdate: (patch: Partial<ObligationsSearch>) => void
}

const TYPE_OPTIONS: { value: ObligationsSearch["type"]; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "BILL", label: "Bills" },
  { value: "LOAN", label: "Loans" },
]

const STATUS_OPTIONS: { value: ObligationsSearch["status"]; label: string }[] =
  [
    { value: "ALL", label: "All Statuses" },
    { value: "overdue", label: "Overdue" },
    { value: "due-today", label: "Due Today" },
    { value: "due-this-week", label: "Due This Week" },
    { value: "upcoming", label: "Upcoming" },
  ]

const SORT_OPTIONS: { value: ObligationsSearch["sort"]; label: string }[] = [
  { value: "due-date", label: "Nearest Due Date" },
  { value: "amount", label: "Highest Amount" },
  { value: "balance", label: "Largest Balance" },
]

function SearchField({
  search,
  onSearch,
  onClear,
}: {
  search?: string
  onSearch: (val?: string) => void
  onClear: () => void
}) {
  const [value, setValue] = useState(() => search ?? "")

  return (
    <InputGroup className="max-w-xs">
      <InputGroupInput
        placeholder="Search by name or category…"
        value={value}
        onChange={(e) => {
          onSearch(e.currentTarget.value)
          setValue(e.currentTarget.value)
        }}
        className="pl-9"
      />
      <InputGroupAddon>
        <Search />
      </InputGroupAddon>
      {search ? (
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            aria-label="Clear"
            title="Clear"
            size="icon-xs"
            onClick={() => {
              onClear()
              setValue("")
            }}
          >
            <XIcon />
          </InputGroupButton>
        </InputGroupAddon>
      ) : null}
    </InputGroup>
  )
}

export function FiltersBar({ search, onUpdate }: FiltersBarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <SearchField
        search={search.q}
        onSearch={(q) => onUpdate({ q })}
        onClear={() => onUpdate({ q: undefined })}
      />

      <div className="ml-auto flex items-center gap-1 rounded-lg border p-1">
        {TYPE_OPTIONS.map((opt) => (
          <Button
            key={opt.value}
            variant={search.type === opt.value ? "secondary" : "ghost"}
            size="sm"
            className="h-7 px-3 text-xs"
            onClick={() => onUpdate({ type: opt.value })}
          >
            {opt.label}
          </Button>
        ))}
      </div>

      <NativeSelect
        value={search.status}
        onChange={(e) =>
          onUpdate({ status: e.target.value as ObligationsSearch["status"] })
        }
      >
        {STATUS_OPTIONS.map((opt) => (
          <NativeSelectOption key={opt.value} value={opt.value}>
            {opt.label}
          </NativeSelectOption>
        ))}
      </NativeSelect>

      <NativeSelect
        value={search.sort}
        onChange={(e) =>
          onUpdate({ sort: e.target.value as ObligationsSearch["sort"] })
        }
      >
        {SORT_OPTIONS.map((opt) => (
          <NativeSelectOption key={opt.value} value={opt.value}>
            {opt.label}
          </NativeSelectOption>
        ))}
      </NativeSelect>
    </div>
  )
}
