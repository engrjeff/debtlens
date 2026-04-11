import { DashboardPage } from "@/features/dashboard/dashboard-page"
import { DashboardSkeleton } from "@/features/dashboard/dashboard-skeleton"
import { fetchObligationInsights } from "@/features/obligations/obligations.functions"
import { createFileRoute } from "@tanstack/react-router"
import { Suspense } from "react"

export const Route = createFileRoute("/_protected/dashboard")({
  loader: () => fetchObligationInsights(),
  component: RouteComponent,
  head: () => ({
    meta: [{ title: "Dashboard | DebtLens" }],
  }),
})

function RouteComponent() {
  const obligations = Route.useLoaderData()
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardPage obligations={obligations} />
    </Suspense>
  )
}
