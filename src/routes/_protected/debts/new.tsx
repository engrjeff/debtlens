import { ObligationForm } from "@/components/obligation-form"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_protected/debts/new")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center gap-4">
        <div>
          <h2 className="font-semibold">Create Obligation</h2>
          <p className="text-sm text-muted-foreground">
            Add a new debt or loan to track
          </p>
        </div>
      </div>
      <ObligationForm />
    </div>
  )
}
