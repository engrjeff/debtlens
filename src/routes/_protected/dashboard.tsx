import { createFileRoute } from "@tanstack/react-router"
import { Suspense } from "react"
import { DashboardPage } from "@/features/dashboard/dashboard-page"
import { DashboardSkeleton } from "@/features/dashboard/dashboard-skeleton"
import { fetchObligationInsights } from "@/features/obligations/obligations.functions"
import { generatePageTitle } from "@/lib/utils"

export const Route = createFileRoute("/_protected/dashboard")({
  loader: () => fetchObligationInsights(),
  component: RouteComponent,
  head: () => ({
    meta: [{ title: generatePageTitle("Dashboard") }],
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
