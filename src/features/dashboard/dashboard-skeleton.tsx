import { CategoryBreakdownSkeleton } from "./category-breakdown"
import { DebtProgressSkeleton } from "./debt-progress"
import { InsightsPanelSkeleton } from "./insights-panel"
import { SummaryCardsSkeleton } from "./summary-cards"
import { UpcomingListSkeleton } from "./upcoming-list"
import { Skeleton } from "@/components/ui/skeleton"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

export function DashboardSkeleton() {
  return (
    <div className="flex flex-col">
      <header className="flex items-center gap-4 border-b px-4 py-3">
        <SidebarTrigger />
        <Separator orientation="vertical" />
        <div className="space-y-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-48" />
        </div>
      </header>

      <main className="container mx-auto space-y-6 p-4 pb-12">
        <section>
          <SummaryCardsSkeleton />
        </section>

        <section>
          <InsightsPanelSkeleton />
        </section>

        <section className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <UpcomingListSkeleton />
          </div>
          <div className="lg:col-span-2">
            <DebtProgressSkeleton />
          </div>
        </section>

        <section>
          <CategoryBreakdownSkeleton />
        </section>
      </main>
    </div>
  )
}
