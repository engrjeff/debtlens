import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import { useNavigate, useSearch } from "@tanstack/react-router"
import { SearchIcon, XIcon } from "lucide-react"
import { useState } from "react"

export function ObligationsSearch() {
  const search = useSearch({ from: "/_protected/debts/" })
  const navigate = useNavigate({ from: "/debts/" })

  const [query, setQuery] = useState(() => search.q ?? "")

  return (
    <InputGroup className="min-w-xs">
      <InputGroupInput
        placeholder="Search by name or category…"
        value={query}
        onChange={(e) => {
          const value = e.currentTarget.value
          setQuery(value)

          if (value && value?.length !== 3) return

          navigate({
            search: (prev) => ({ ...prev, q: value }),
          })
        }}
        className="pl-9"
      />
      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>
      {search ? (
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            aria-label="Clear"
            title="Clear"
            size="icon-xs"
            onClick={() => {
              navigate({
                search: (prev) => ({ ...prev, q: undefined }),
              })
              setQuery("")
            }}
          >
            <XIcon />
          </InputGroupButton>
        </InputGroupAddon>
      ) : null}
    </InputGroup>
  )
}
