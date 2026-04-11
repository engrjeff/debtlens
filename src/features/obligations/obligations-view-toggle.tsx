import { Link, useSearch } from "@tanstack/react-router"
import { Grid2X2Icon, ListIcon } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"

export function ObligationsViewToggle() {
  const search = useSearch({ from: "/_protected/obligations/" })

  return (
    <Link
      className={buttonVariants({ size: "icon", variant: "outline" })}
      to="/obligations"
      search={(current) => ({
        ...current,
        view: current.view === "grid" ? "list" : "grid",
      })}
    >
      {search.view === "grid" ? <ListIcon /> : <Grid2X2Icon />}
    </Link>
  )
}
