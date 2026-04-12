import { createFileRoute, useNavigate } from "@tanstack/react-router"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { PaymentsTable } from "@/features/payments/payments-table"
import { fetchPayments } from "@/features/payments/payments.functions"
import {
  PAGE_SIZE,
  paymentsSearchSchema,
} from "@/features/payments/search-params"
import { generatePageTitle } from "@/lib/utils"

export const Route = createFileRoute("/_protected/payment-history")({
  validateSearch: paymentsSearchSchema,
  loaderDeps: ({ search }) => search,
  loader: ({ deps }) => fetchPayments({ data: deps }),
  head: () => ({
    meta: [{ title: generatePageTitle("Payment History") }],
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const { items: payments, pageInfo } = Route.useLoaderData()
  const navigate = useNavigate({ from: Route.fullPath })

  const offset = (pageInfo.page - 1) * PAGE_SIZE

  function goToPage(page: number) {
    navigate({ search: (prev) => ({ ...prev, page }) })
  }

  return (
    <>
      <header className="container mx-auto flex items-center gap-4 space-y-4 p-4">
        <div>
          <h1 className="font-semibold">Payment History</h1>
          <p className="text-sm text-muted-foreground">
            A record of all payments you've made.
          </p>
        </div>
      </header>

      <main className="container mx-auto space-y-4 px-4">
        {pageInfo.total === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-muted-foreground">No payments recorded yet.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>
                Showing {offset + 1}–
                {Math.min(offset + PAGE_SIZE, pageInfo.total)} of{" "}
                {pageInfo.total} payment{pageInfo.total !== 1 ? "s" : ""}
              </span>
              <span>
                Page {pageInfo.page} of {pageInfo.totalPages}
              </span>
            </div>

            <PaymentsTable payments={payments} offset={offset} />

            {pageInfo.totalPages > 1 && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => goToPage(pageInfo.page - 1)}
                      aria-disabled={!pageInfo.hasPrevPage}
                      className={
                        !pageInfo.hasPrevPage
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => goToPage(pageInfo.page + 1)}
                      aria-disabled={!pageInfo.hasNextPage}
                      className={
                        !pageInfo.hasNextPage
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}
      </main>
    </>
  )
}
