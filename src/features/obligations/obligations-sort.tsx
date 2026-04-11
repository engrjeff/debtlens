import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useNavigate, useSearch } from "@tanstack/react-router"
import { ArrowUpDownIcon } from "lucide-react"
import type { ObligationsSearch } from "./search-params"

const SORT_OPTIONS: { value: ObligationsSearch["sort"]; label: string }[] = [
  { value: "due-date", label: "Due Date (Nearest)" },
  { value: "amount", label: "Highest Amount" },
  { value: "balance", label: "Largest Balance" },
  { value: "type", label: "Type" },
]

export function ObligationsSort() {
  const search = useSearch({ from: "/_protected/obligations/" })
  const navigate = useNavigate({ from: "/obligations/" })

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="outline" aria-label="Sort">
          <ArrowUpDownIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-max">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Sort</DropdownMenuLabel>
          {SORT_OPTIONS.map((option) => (
            <DropdownMenuCheckboxItem
              key={`sort-${option.value}`}
              checked={option.value === search.sort}
              onCheckedChange={(checked) => {
                navigate({
                  search: (prev) => ({
                    ...prev,
                    sort: checked === true ? option.value : undefined,
                  }),
                })
              }}
            >
              {option.label}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
