import { buttonVariants } from "@/components/ui/button"
import { Link, useSearch } from "@tanstack/react-router"
import { Grid2X2Icon, ListIcon } from "lucide-react"

export function ObligationsViewToggle() {
  const search = useSearch({ from: "/_protected/debts/" })

  return (
    <Link
      className={buttonVariants({ size: "icon", variant: "outline" })}
      to="/debts"
      search={(current) => ({
        ...current,
        view: current.view === "grid" ? "list" : "grid",
      })}
    >
      {search.view === "grid" ? <ListIcon /> : <Grid2X2Icon />}
    </Link>
  )
}
