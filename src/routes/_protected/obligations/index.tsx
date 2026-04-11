import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
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

export const Route = createFileRoute("/_protected/obligations/")({
  validateSearch: obligationsSearchSchema,
  loaderDeps: ({ search }) => search,
  loader: ({ deps }) =>
    Promise.all([fetchObligations({ data: deps }), fetchObligationInsights()]),
  component: RouteComponent,
  head: () => {
    return {
      meta: [
        {
          title: "Obligations",
        },
      ],
    }
  },
})

function RouteComponent() {
  const [{ items: obligations, pageInfo }, allObligations] =
    Route.useLoaderData()
  const search = Route.useSearch()

  return (
    <div className="flex flex-col">
      <header className="flex items-center gap-4 border-b px-4 py-3">
        <SidebarTrigger />
        <Separator orientation="vertical" />
        <div>
          <h2 className="font-semibold">Obligations</h2>
          <p className="text-sm text-muted-foreground">
            Track your bills and loans in one place.
          </p>
        </div>
        <div className="ml-auto">
          <ObligationCreateDialog />
        </div>
      </header>

      <main className="container mx-auto grid space-y-4 p-4">
        {allObligations.length === 0 ? (
          <EmptyObligationsView />
        ) : (
          <>
            <Suspense fallback={<InsightCardsSkeleton />}>
              <InsightCards obligations={allObligations} />
            </Suspense>
            <div className="flex items-center justify-between gap-4">
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
              <div>
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
    </div>
  )
}
