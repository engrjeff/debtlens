import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { OBLIGATION_CATEGORIES } from "@/lib/constants/obligation-categories"
import { useNavigate, useSearch } from "@tanstack/react-router"
import { FilterIcon, XIcon } from "lucide-react"
import type { ReactNode } from "react"
import { createContext, useCallback, useContext, useState } from "react"
import { getCategoryMeta } from "./helpers"
import type { ObligationsSearch } from "./search-params"

// ── Types ─────────────────────────────────────────────────────────────────────

type FilterDraft = {
  type: "ALL" | "BILL" | "LOAN"
  status: ObligationsSearch["status"] | undefined
  categories: Array<string>
  dueRange: "any" | "today" | "next7days" | "thisMonth" | "custom"
  dueStart: string
  dueEnd: string
  minAmount: string
  maxAmount: string
  minBalance: string
  maxBalance: string
  progress: "" | "low" | "mid" | "high"
  sort: "due-date" | "amount" | "balance" | "type"
}

const DEFAULT_DRAFT: FilterDraft = {
  type: "ALL",
  status: undefined,
  categories: [],
  dueRange: "any",
  dueStart: "",
  dueEnd: "",
  minAmount: "",
  maxAmount: "",
  minBalance: "",
  maxBalance: "",
  progress: "",
  sort: "due-date",
}

// ── Context & hook ─────────────────────────────────────────────────────────────

type FilterDraftContextValue = {
  draft: FilterDraft
  set: <TKey extends keyof FilterDraft>(
    key: TKey,
    value: FilterDraft[TKey]
  ) => void
  toggleCategory: (value: string) => void
}

const FilterDraftContext = createContext<FilterDraftContextValue | null>(null)

function useFilterDraft() {
  const ctx = useContext(FilterDraftContext)
  if (!ctx)
    throw new Error("useFilterDraft must be inside ObligationsMoreFilters")
  return ctx
}

// ── Utilities ─────────────────────────────────────────────────────────────────

function validCategoriesForType(
  categories: Array<string>,
  type: FilterDraft["type"]
): Array<string> {
  if (type === "ALL") return categories
  const groups =
    type === "BILL" ? OBLIGATION_CATEGORIES.bill : OBLIGATION_CATEGORIES.loan
  const valid = new Set(groups.flatMap((g) => g.options.map((o) => o.value)))
  return categories.filter((c) => valid.has(c))
}

function searchToDraft(search: ObligationsSearch): FilterDraft {
  const type = search.type
  return {
    type,
    status: search.status,
    categories: validCategoriesForType(search.categories ?? [], type),
    dueRange: search.dueRange ?? "any",
    dueStart: search.dueStart ?? "",
    dueEnd: search.dueEnd ?? "",
    minAmount: search.minAmount?.toString() ?? "",
    maxAmount: search.maxAmount?.toString() ?? "",
    minBalance: search.minBalance?.toString() ?? "",
    maxBalance: search.maxBalance?.toString() ?? "",
    progress: search.progress ?? "",
    sort: search.sort,
  }
}

function countActiveFilters(search: ObligationsSearch): number {
  let n = 0
  if (search.type !== "ALL") n++
  if (search.status) n++
  if (search.categories?.length) n++
  if (search.dueRange && search.dueRange !== "any") n++
  if (search.minAmount != null || search.maxAmount != null) n++
  if (search.minBalance != null || search.maxBalance != null) n++
  if (search.progress) n++
  return n
}

// ── Shared layout wrapper ─────────────────────────────────────────────────────

function FilterSection({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium">{title}</p>
      {children}
    </div>
  )
}

// ── Filter components ─────────────────────────────────────────────────────────

function TypeFilter() {
  const { draft, set } = useFilterDraft()

  function handleChange(value: string) {
    set("type", value as FilterDraft["type"])
    set("categories", [])
    if (value === "BILL") {
      set("progress", "")
      set("minBalance", "")
      set("maxBalance", "")
    }
  }

  return (
    <FilterSection title="Type">
      <RadioGroup
        value={draft.type}
        onValueChange={handleChange}
        className="gap-2"
      >
        {(["ALL", "BILL", "LOAN"] as const).map((t) => (
          <div key={t} className="flex items-center gap-2.5">
            <RadioGroupItem value={t} id={`type-${t}`} />
            <Label htmlFor={`type-${t}`} className="cursor-pointer font-normal">
              {t === "ALL" ? "All" : t === "BILL" ? "Bills" : "Loans"}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </FilterSection>
  )
}

function StatusFilter() {
  const { draft, set } = useFilterDraft()

  const options = [
    { value: "overdue", label: "Overdue" },
    { value: "due-today", label: "Due Today" },
    { value: "due-this-week", label: "Due This Week" },
    { value: "due-this-month", label: "Due This Month" },
  ] as const

  return (
    <FilterSection title="Status">
      <RadioGroup
        value={draft.status ?? ""}
        onValueChange={(v) =>
          set("status", v === "" ? undefined : (v as FilterDraft["status"]))
        }
        className="gap-2"
      >
        <div className="flex items-center gap-2.5">
          <RadioGroupItem value="" id="status-any" />
          <Label htmlFor="status-any" className="cursor-pointer font-normal">
            Any
          </Label>
        </div>
        {options.map((s) => (
          <div key={s.value} className="flex items-center gap-2.5">
            <RadioGroupItem value={s.value} id={`status-${s.value}`} />
            <Label
              htmlFor={`status-${s.value}`}
              className="cursor-pointer font-normal"
            >
              {s.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </FilterSection>
  )
}

function CategoryFilter() {
  const { draft, toggleCategory } = useFilterDraft()

  // When type is ALL, show all categories. Otherwise show only relevant ones.
  const groups =
    draft.type === "BILL"
      ? OBLIGATION_CATEGORIES.bill
      : draft.type === "LOAN"
        ? OBLIGATION_CATEGORIES.loan
        : [...OBLIGATION_CATEGORIES.bill, ...OBLIGATION_CATEGORIES.loan]

  return (
    <FilterSection title="Category">
      {draft.categories.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {draft.categories.map((cat) => {
            const meta = getCategoryMeta(cat)
            return (
              <button
                key={cat}
                type="button"
                onClick={() => toggleCategory(cat)}
                className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors ${meta.badge}`}
              >
                {cat}
                <XIcon className="size-3" />
              </button>
            )
          })}
        </div>
      )}
      <div className="max-h-44 space-y-3 overflow-y-auto pr-1">
        {groups.map((group) => (
          <div key={group.group} className="space-y-1.5">
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              {group.group}
            </p>
            {group.options.map((opt) => (
              <div key={opt.value} className="flex items-center gap-2.5">
                <Checkbox
                  id={`cat-${opt.value}`}
                  checked={draft.categories.includes(opt.value)}
                  onCheckedChange={() => toggleCategory(opt.value)}
                />
                <Label
                  htmlFor={`cat-${opt.value}`}
                  className="cursor-pointer font-normal"
                >
                  {opt.label}
                </Label>
              </div>
            ))}
          </div>
        ))}
      </div>
    </FilterSection>
  )
}

function DueDateFilter() {
  const { draft, set } = useFilterDraft()

  const options = [
    { value: "any", label: "Any time" },
    { value: "today", label: "Today" },
    { value: "next7days", label: "Next 7 days" },
    { value: "thisMonth", label: "This month" },
    { value: "custom", label: "Custom range" },
  ] as const

  return (
    <FilterSection title="Due Date">
      <RadioGroup
        value={draft.dueRange}
        onValueChange={(v) => set("dueRange", v as FilterDraft["dueRange"])}
        className="gap-2"
      >
        {options.map((r) => (
          <div key={r.value} className="flex items-center gap-2.5">
            <RadioGroupItem value={r.value} id={`due-${r.value}`} />
            <Label
              htmlFor={`due-${r.value}`}
              className="cursor-pointer font-normal"
            >
              {r.label}
            </Label>
          </div>
        ))}
      </RadioGroup>

      {draft.dueRange === "custom" && (
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">From</Label>
            <Input
              type="date"
              value={draft.dueStart}
              onChange={(e) => set("dueStart", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">To</Label>
            <Input
              type="date"
              value={draft.dueEnd}
              onChange={(e) => set("dueEnd", e.target.value)}
            />
          </div>
        </div>
      )}
    </FilterSection>
  )
}

function AmountFilter() {
  const { draft, set } = useFilterDraft()

  return (
    <FilterSection title="Amount">
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Min</Label>
          <Input
            type="number"
            placeholder="0"
            min={0}
            value={draft.minAmount}
            onChange={(e) => set("minAmount", e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Max</Label>
          <Input
            type="number"
            placeholder="Any"
            min={0}
            value={draft.maxAmount}
            onChange={(e) => set("maxAmount", e.target.value)}
          />
        </div>
      </div>
    </FilterSection>
  )
}

function RemainingBalanceFilter() {
  const { draft, set } = useFilterDraft()
  if (draft.type === "BILL") return null

  return (
    <FilterSection title="Remaining Balance">
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Min</Label>
          <Input
            type="number"
            placeholder="0"
            min={0}
            value={draft.minBalance}
            onChange={(e) => set("minBalance", e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Max</Label>
          <Input
            type="number"
            placeholder="Any"
            min={0}
            value={draft.maxBalance}
            onChange={(e) => set("maxBalance", e.target.value)}
          />
        </div>
      </div>
    </FilterSection>
  )
}

function ProgressFilter() {
  const { draft, set } = useFilterDraft()
  if (draft.type === "BILL") return null

  const options = [
    { value: "high", label: "Almost paid (>80%)" },
    { value: "mid", label: "Midway (40–80%)" },
    { value: "low", label: "Just started (<40%)" },
  ] as const

  return (
    <FilterSection title="Progress">
      <RadioGroup
        value={draft.progress}
        onValueChange={(v) => set("progress", v as FilterDraft["progress"])}
        className="gap-2"
      >
        <div className="flex items-center gap-2.5">
          <RadioGroupItem value="" id="progress-any" />
          <Label htmlFor="progress-any" className="cursor-pointer font-normal">
            Any
          </Label>
        </div>
        {options.map((p) => (
          <div key={p.value} className="flex items-center gap-2.5">
            <RadioGroupItem value={p.value} id={`progress-${p.value}`} />
            <Label
              htmlFor={`progress-${p.value}`}
              className="cursor-pointer font-normal"
            >
              {p.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </FilterSection>
  )
}

function SortFilter() {
  const { draft, set } = useFilterDraft()

  const options = [
    { value: "due-date", label: "Due Date (Nearest)" },
    { value: "amount", label: "Highest Amount" },
    { value: "balance", label: "Largest Balance" },
    { value: "type", label: "Type" },
  ] as const

  return (
    <FilterSection title="Sort by">
      <RadioGroup
        value={draft.sort}
        onValueChange={(v) => set("sort", v as FilterDraft["sort"])}
        className="gap-2"
      >
        {options.map((s) => (
          <div key={s.value} className="flex items-center gap-2.5">
            <RadioGroupItem value={s.value} id={`sort-${s.value}`} />
            <Label
              htmlFor={`sort-${s.value}`}
              className="cursor-pointer font-normal"
            >
              {s.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </FilterSection>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export function ObligationsMoreFilters() {
  const search = useSearch({ from: "/_protected/obligations/" })
  const navigate = useNavigate({ from: "/obligations/" })
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<FilterDraft>(DEFAULT_DRAFT)

  const activeCount = countActiveFilters(search)

  const set = useCallback(
    <TKey extends keyof FilterDraft>(key: TKey, value: FilterDraft[TKey]) => {
      setDraft((prev) => ({ ...prev, [key]: value }))
    },
    []
  )

  const toggleCategory = useCallback((value: string) => {
    setDraft((prev) => ({
      ...prev,
      categories: prev.categories.includes(value)
        ? prev.categories.filter((c) => c !== value)
        : [...prev.categories, value],
    }))
  }, [])

  function handleOpenChange(isOpen: boolean) {
    if (isOpen) setDraft(searchToDraft(search))
    setOpen(isOpen)
  }

  function handleApply() {
    navigate({
      search: (prev) => ({
        ...prev,
        type: draft.type,
        status: draft.status,
        categories: draft.categories.length ? draft.categories : undefined,
        dueRange: draft.dueRange !== "any" ? draft.dueRange : undefined,
        dueStart:
          draft.dueRange === "custom" && draft.dueStart
            ? draft.dueStart
            : undefined,
        dueEnd:
          draft.dueRange === "custom" && draft.dueEnd
            ? draft.dueEnd
            : undefined,
        minAmount: draft.minAmount ? Number(draft.minAmount) : undefined,
        maxAmount: draft.maxAmount ? Number(draft.maxAmount) : undefined,
        minBalance: draft.minBalance ? Number(draft.minBalance) : undefined,
        maxBalance: draft.maxBalance ? Number(draft.maxBalance) : undefined,
        progress: draft.progress || undefined,
        sort: draft.sort,
        page: 1,
      }),
    })
    setOpen(false)
  }

  function handleReset() {
    navigate({
      search: (prev) => ({
        q: prev.q,
        view: prev.view,
        sort: "due-date",
        page: 1,
      }),
    })
    setOpen(false)
  }

  return (
    <FilterDraftContext.Provider value={{ draft, set, toggleCategory }}>
      <Sheet open={open} onOpenChange={handleOpenChange}>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="relative">
            <FilterIcon />
            <span className="sr-only">More Filters</span>
            {activeCount > 0 && (
              <Badge className="absolute -top-1.5 -right-1.5 flex size-4 items-center justify-center p-0 text-[10px]">
                {activeCount}
              </Badge>
            )}
          </Button>
        </SheetTrigger>

        <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-100">
          {/* Header */}
          <SheetHeader className="border-b">
            <SheetTitle>Filters</SheetTitle>
            <SheetDescription>Refine your obligations</SheetDescription>
          </SheetHeader>

          {/* Scrollable content */}
          <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
            <TypeFilter />
            <Separator />
            <StatusFilter />
            <Separator />
            <CategoryFilter />
            <Separator />
            <DueDateFilter />
            <Separator />
            <AmountFilter />
            {draft.type !== "BILL" && (
              <>
                <Separator />
                <RemainingBalanceFilter />
                <ProgressFilter />
              </>
            )}
            <Separator />
            <SortFilter />
          </div>

          {/* Sticky footer */}
          <div className="flex items-center gap-3 border-t px-5 py-4">
            <Button variant="outline" className="flex-1" onClick={handleReset}>
              Reset
            </Button>
            <Button className="flex-1" onClick={handleApply}>
              Apply Filters
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </FilterDraftContext.Provider>
  )
}
