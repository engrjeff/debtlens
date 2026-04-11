import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { FilterIcon } from "lucide-react"

export function ObligationsMoreFilters() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline">
          <FilterIcon /> <span className="sr-only">More Filters</span>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>Refine your obligations listing.</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
}
