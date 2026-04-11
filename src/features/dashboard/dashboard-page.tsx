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
import { SummaryCards } from "./summary-cards"
import { UpcomingList } from "./upcoming-list"
import type { Obligation } from "@/generated/prisma/client"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

interface DashboardPageProps {
  obligations: Array<Obligation>
}

export function DashboardPage({ obligations }: DashboardPageProps) {
  const summary = getDashboardSummary(obligations)
  const upcoming = getUpcoming(obligations, 7)
  const debtProgress = getDebtProgress(obligations)
  const insights = generateInsights(obligations)
  const categories = getCategoryBreakdown(obligations)

  return (
    <div className="flex animate-in flex-col duration-300 fade-in">
      {/* ── Header ── */}
      <header className="flex items-center gap-4 border-b px-4 py-3">
        <SidebarTrigger />
        <Separator orientation="vertical" />
        <div>
          <h2 className="font-semibold">Dashboard</h2>
          <p className="text-sm text-muted-foreground">
            Your financial snapshot at a glance.
          </p>
        </div>

        <div className="ml-auto">
          <ObligationCreateDialog />
        </div>
      </header>

      {/* ── Main content ── */}
      <main className="container mx-auto space-y-6 p-4 pb-12">
        {obligations.length === 0 ? (
          <DashboardEmpty />
        ) : (
          <>
            {/* Row 1 — Summary cards */}
            <section aria-label="Summary">
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
            <div className="grid grid-cols-2">
              {categories.length > 0 && (
                <section aria-label="Category breakdown">
                  <CategoryBreakdown items={categories} />
                </section>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
