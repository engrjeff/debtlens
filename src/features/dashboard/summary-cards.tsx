import { Link } from "@tanstack/react-router"
import type { DashboardSummary } from "./dashboard.utils"
import { Text } from "@/components/text"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { formatCompactPHP } from "@/features/obligations/helpers"

interface SummaryCardsProps {
  summary: DashboardSummary
}

export function SummaryCards({ summary }: SummaryCardsProps) {
  const {
    totalDueThisMonth,
    dueThisMonthCount,
    dueInNext7DaysAmount,
    dueInNext7DaysCount,
    overdueAmount,
    overdueCount,
    totalRemainingDebt,
  } = summary

  return (
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
      <Link
        to="/obligations"
        search={(c) => ({ ...c, status: "due-this-week" })}
        className="group data-[disabled=true]:opacity-60"
        data-disabled={dueInNext7DaysCount === 0}
      >
        <Card size="sm" className="group-hover:ring-primary data-[size=sm]:gap-2">
          <CardHeader>
            <Text size="xxs" variant="muted" weight="semibold" className="uppercase">
              Due This Week
            </Text>
          </CardHeader>
          <CardContent>
            <Text size="xl" weight="bold" className="font-mono">
              {formatCompactPHP(dueInNext7DaysAmount)}
            </Text>
            <Text size="xs" variant="muted" className="mt-1">
              {dueInNext7DaysCount === 0
                ? "Nothing coming up"
                : `${dueInNext7DaysCount} obligation${dueInNext7DaysCount !== 1 ? "s" : ""} coming up`}
            </Text>
          </CardContent>
        </Card>
      </Link>

      <Link
        to="/obligations"
        search={(c) => ({ ...c, status: "due-this-month" })}
        className="group data-[disabled=true]:opacity-60"
        data-disabled={dueThisMonthCount === 0}
      >
        <Card size="sm" className="group-hover:ring-primary data-[size=sm]:gap-2">
          <CardHeader>
            <Text size="xxs" variant="muted" weight="semibold" className="uppercase">
              Due This Month
            </Text>
          </CardHeader>
          <CardContent>
            <Text size="xl" weight="bold" className="font-mono">
              {formatCompactPHP(totalDueThisMonth)}
            </Text>
            {dueThisMonthCount === 0 ? (
              <Text size="xs" variant="muted" className="mt-1">All caught up</Text>
            ) : (
              <Text size="xs" variant="success" className="mt-1">
                {dueThisMonthCount} obligation{dueThisMonthCount !== 1 ? "s" : ""}
              </Text>
            )}
          </CardContent>
        </Card>
      </Link>

      <Link
        to="/obligations"
        search={(c) => ({ ...c, status: "overdue" })}
        className="group data-[disabled=true]:opacity-60"
        data-disabled={overdueCount === 0}
      >
        <Card size="sm" className="group-hover:ring-primary data-[size=sm]:gap-2">
          <CardHeader>
            <Text size="xxs" variant="muted" weight="semibold" className="uppercase">
              Overdue
            </Text>
          </CardHeader>
          <CardContent>
            <Text
              size="xl"
              weight="bold"
              variant={overdueCount > 0 ? "destructive" : "default"}
              className="font-mono"
            >
              {formatCompactPHP(overdueAmount)}
            </Text>
            <Text size="xs" variant="muted" className="mt-1">
              {overdueCount > 0
                ? `${overdueCount} unpaid obligation${overdueCount !== 1 ? "s" : ""}`
                : "All caught up"}
            </Text>
          </CardContent>
        </Card>
      </Link>

      <Card size="sm" className="data-[size=sm]:gap-2">
        <CardHeader>
          <Text size="xxs" variant="muted" weight="semibold" className="uppercase">
            Remaining Debt
          </Text>
        </CardHeader>
        <CardContent>
          <Text size="xl" weight="bold" className="font-mono">
            {formatCompactPHP(totalRemainingDebt)}
          </Text>
          <Text size="xs" className="mt-1 text-violet-400">
            {totalRemainingDebt === 0 ? "No active loans" : "Across all loans"}
          </Text>
        </CardContent>
      </Card>
    </div>
  )
}

export function SummaryCardsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} size="sm">
          <CardHeader>
            <Skeleton className="h-4 w-28" />
          </CardHeader>
          <CardContent className="space-y-2">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-3 w-24" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
