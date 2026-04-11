import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { EmptyObligationsView } from "@/features/obligations/empty-obligations-view"
import { FiltersBar } from "@/features/obligations/filters-bar"
import {
  InsightCards,
  InsightCardsSkeleton,
} from "@/features/obligations/insight-cards"
import { NoObligationsResultsView } from "@/features/obligations/no-obligations-result-view"
import { ObligationCreateDialog } from "@/features/obligations/obligation-create-dialog"
import { ObligationList } from "@/features/obligations/obligations-list"
import { ObligationsTable } from "@/features/obligations/obligations-table"
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
            <FiltersBar />
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
