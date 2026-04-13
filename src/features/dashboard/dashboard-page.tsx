import { DebtFreeBanner } from "../obligations/debt-free-banner"
import { ObligationCreateDialog } from "../obligations/obligation-create-dialog"
import { CategoryBreakdown } from "./category-breakdown"
import { DashboardEmpty } from "./dashboard-empty"
import {
  generateInsights,
  getCategoryBreakdown,
  getDashboardSummary,
  getDebtProgress,
  getUpcoming,
} from "./dashboard.utils"
import { DebtProgress } from "./debt-progress"
import { InsightsPanel } from "./insights-panel"
import { RecentPaymentsList } from "./recent-payments"
import { SummaryCards } from "./summary-cards"
import { UpcomingList } from "./upcoming-list"
import type { ObligationType } from "@/generated/prisma/enums"
import type { Obligation } from "@/generated/prisma/client"

type RecentPayment = {
  id: string
  amount: number
  paidAt: Date | string
  obligation: {
    id: string
    name: string
    category: string
    type: ObligationType
  }
}

interface DashboardPageProps {
  obligations: Array<Obligation>
  recentPayments: Array<RecentPayment>
}

export function DashboardPage({ obligations, recentPayments }: DashboardPageProps) {
  const summary = getDashboardSummary(obligations)
  const upcoming = getUpcoming(obligations, 7)
  const debtProgress = getDebtProgress(obligations)
  const insights = generateInsights(obligations)
  const categories = getCategoryBreakdown(obligations)

  return (
    <>
      {/* ── Header ── */}
      <header className="container mx-auto hidden items-center gap-4 border-b p-4 lg:flex">
        <div>
          <h2 className="font-semibold">Dashboard</h2>
          <p className="hidden text-sm text-muted-foreground md:block">
            Your financial snapshot at a glance.
          </p>
        </div>

        <div className="ml-auto">
          <ObligationCreateDialog />
        </div>
      </header>

      {/* ── Main content ── */}
      <main className="container mx-auto space-y-6 p-4">
        {obligations.length === 0 ? (
          <DashboardEmpty />
        ) : (
          <>
            {/* Row 1 — Debt-free banner + Summary cards */}
            <section aria-label="Summary" className="space-y-4">
              <DebtFreeBanner obligations={obligations} />
              <SummaryCards summary={summary} />
            </section>

            {/* Row 2 — Insights (hidden when nothing notable) */}
            {insights.length > 0 && (
              <section aria-label="Insights">
                <InsightsPanel insights={insights} />
              </section>
            )}

            {/* Row 3 — Upcoming timeline + Debt progress */}
            <section
              aria-label="Upcoming and debt"
              className="grid gap-6 lg:grid-cols-5"
            >
              <div className="lg:col-span-3">
                <UpcomingList items={upcoming} />
              </div>
              <div className="lg:col-span-2">
                <DebtProgress data={debtProgress} />
              </div>
            </section>

            {/* Row 4 — Category breakdown */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {categories.length > 0 && (
                <section
                  aria-label="Category breakdown"
                  className="lg:col-span-2"
                >
                  <CategoryBreakdown items={categories} />
                </section>
              )}

              <section aria-label="Recent payments">
                <RecentPaymentsList items={recentPayments} />
              </section>
            </div>
          </>
        )}
      </main>
    </>
  )
}
