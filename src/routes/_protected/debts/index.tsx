import { EmptyObligationsView } from "@/features/obligations/empty-obligations-view"
import { FiltersBar } from "@/features/obligations/filters-bar"
import {
  InsightCards,
  InsightCardsSkeleton,
} from "@/features/obligations/insight-cards"
import { ObligationCreateDialog } from "@/features/obligations/obligation-create-dialog"
import { ObligationList } from "@/features/obligations/obligations-list"
import { ObligationsTable } from "@/features/obligations/obligations-table"
import {
  fetchObligationInsights,
  fetchObligations,
} from "@/features/obligations/obligations.functions"
import {
  obligationsSearchSchema,
  type ObligationsSearch,
} from "@/features/obligations/search-params"
import { createFileRoute } from "@tanstack/react-router"
import { Suspense, useCallback } from "react"

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
  const navigate = Route.useNavigate()

  const handleUpdate = useCallback(
    (patch: Partial<ObligationsSearch>) =>
      navigate({ search: (prev) => ({ ...prev, ...patch }) }),
    [navigate]
  )

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

      {pageInfo.total === 0 ? (
        <EmptyObligationsView />
      ) : (
        <>
          <div className="p-4">
            <Suspense fallback={<InsightCardsSkeleton />}>
              <InsightCards obligations={allObligations} />
            </Suspense>
          </div>
          <div className="p-4">
            <FiltersBar search={search} onUpdate={handleUpdate} />
          </div>
          <div className="p-4">
            {search.view === "list" ? (
              <ObligationsTable obligations={obligations} />
            ) : (
              <ObligationList obligations={obligations} />
            )}
          </div>
        </>
      )}
    </main>
  )
}
