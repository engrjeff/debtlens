import { createFileRoute } from "@tanstack/react-router"
import { Suspense } from "react"
import { DashboardPage } from "@/features/dashboard/dashboard-page"
import { DashboardSkeleton } from "@/features/dashboard/dashboard-skeleton"
import { fetchObligationInsights } from "@/features/obligations/obligations.functions"
import { fetchRecentPayments } from "@/features/payments/payments.functions"
import { generatePageTitle } from "@/lib/utils"

export const Route = createFileRoute("/_protected/dashboard")({
  loader: () =>
    Promise.all([fetchObligationInsights(), fetchRecentPayments()]),
  component: RouteComponent,
  head: () => ({
    meta: [{ title: generatePageTitle("Dashboard") }],
  }),
})

function RouteComponent() {
  const [obligations, recentPayments] = Route.useLoaderData()
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardPage obligations={obligations} recentPayments={recentPayments} />
    </Suspense>
  )
}
