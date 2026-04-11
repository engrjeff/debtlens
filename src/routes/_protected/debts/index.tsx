import { EmptyObligationsView } from "@/features/obligations/empty-obligations-view"
import {
  InsightCards,
  InsightCardsSkeleton,
} from "@/features/obligations/insight-cards"
import { NoObligationsResultsView } from "@/features/obligations/no-obligations-result-view"
import { ObligationCreateDialog } from "@/features/obligations/obligation-create-dialog"
import { ObligationFilterChips } from "@/features/obligations/obligation-filter-chips"
import { ObligationList } from "@/features/obligations/obligations-list"
import { ObligationsSearch } from "@/features/obligations/obligations-search"
import { ObligationsSort } from "@/features/obligations/obligations-sort"
import { ObligationsTable } from "@/features/obligations/obligations-table"
import { ObligationsViewToggle } from "@/features/obligations/obligations-view-toggle"
import {
  fetchObligationInsights,
  fetchObligations,
} from "@/features/obligations/obligations.functions"
import { obligationsSearchSchema } from "@/features/obligations/search-params"
import { createFileRoute } from "@tanstack/react-router"
import { Suspense } from "react"

export const Route = createFileRoute("/_protected/debts/")({
  validateSearch: obligationsSearchSchema,
  loaderDeps: ({ search }) => search,
  loader: ({ deps }) =>
    Promise.all([fetchObligations({ data: deps }), fetchObligationInsights()]),
  component: RouteComponent,
})

function RouteComponent() {
  const [{ items: obligations, pageInfo }, allObligations] =
    Route.useLoaderData()
  const search = Route.useSearch()

  return (
    <main className="container mx-auto divide-y">
      <div className="flex items-center justify-between gap-4 p-4">
        <div>
          <h2 className="text-lg font-semibold">Obligations</h2>
          <p className="text-sm text-muted-foreground">
            Track your bills and loans in one place.
          </p>
        </div>
        <ObligationCreateDialog />
      </div>

      {allObligations.length === 0 ? (
        <EmptyObligationsView />
      ) : (
        <>
          <div className="p-4">
            <Suspense fallback={<InsightCardsSkeleton />}>
              <InsightCards obligations={allObligations} />
            </Suspense>
          </div>
          <div className="flex items-center justify-between gap-4 p-4">
            <ObligationFilterChips />
            <div className="flex items-center gap-3">
              <ObligationsSearch />
              <ObligationsSort />
              <ObligationsViewToggle />
            </div>
          </div>
          {pageInfo.total === 0 ? (
            <NoObligationsResultsView />
          ) : (
            <div className="p-4">
              {search.view === "list" ? (
                <ObligationsTable obligations={obligations} />
              ) : (
                <ObligationList obligations={obligations} />
              )}
            </div>
          )}
        </>
      )}
    </main>
  )
}
