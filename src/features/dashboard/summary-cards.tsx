import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { formatCompactPHP } from "@/features/obligations/helpers"
import { Link } from "@tanstack/react-router"
import { AlertTriangle, CalendarDays, CreditCard, Wallet } from "lucide-react"
import type { DashboardSummary } from "./dashboard.utils"

interface SummaryCardsProps {
  summary: DashboardSummary
}

export function SummaryCards({ summary }: SummaryCardsProps) {
  const {
    totalDueThisMonth,
    dueInNext7DaysAmount,
    dueInNext7DaysCount,
    overdueAmount,
    overdueCount,
    totalRemainingDebt,
  } = summary

  const isOverdue = overdueCount > 0

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {/* Due This Month */}
      <Link
        to="/obligations"
        search={(c) => ({ ...c, status: "due-this-month" })}
        className="group"
      >
        <Card
          size="sm"
          className="h-full transition-shadow group-hover:ring-primary"
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-normal text-muted-foreground">
                Due This Month
              </CardTitle>
              <Wallet className="size-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-2xl font-bold">
              {formatCompactPHP(totalDueThisMonth)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Total obligations this month
            </p>
          </CardContent>
        </Card>
      </Link>

      {/* Due in Next 7 Days */}
      <Link
        to="/obligations"
        search={(c) => ({ ...c, status: "due-this-week" })}
        className="group"
      >
        <Card
          size="sm"
          className="h-full transition-shadow group-hover:ring-primary"
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-normal text-muted-foreground">
                Due in 7 Days
              </CardTitle>
              <CalendarDays className="size-4 text-amber-500" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-2xl font-bold">
              {formatCompactPHP(dueInNext7DaysAmount)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {dueInNext7DaysCount === 0
                ? "Nothing due soon"
                : `${dueInNext7DaysCount} obligation${dueInNext7DaysCount !== 1 ? "s" : ""} coming up`}
            </p>
          </CardContent>
        </Card>
      </Link>

      {/* Overdue */}
      <Link
        to="/obligations"
        search={(c) => ({ ...c, status: "overdue" })}
        className="group"
      >
        <Card
          size="sm"
          className={`h-full transition-shadow group-hover:ring-primary ${isOverdue ? "ring-destructive/40" : ""}`}
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle
                className={`text-sm font-normal ${isOverdue ? "text-destructive" : "text-muted-foreground"}`}
              >
                Overdue
              </CardTitle>
              <AlertTriangle
                className={`size-4 ${isOverdue ? "text-destructive" : "text-emerald-500"}`}
              />
            </div>
          </CardHeader>
          <CardContent>
            <p
              className={`font-mono text-2xl font-bold ${isOverdue ? "text-destructive" : ""}`}
            >
              {isOverdue ? formatCompactPHP(overdueAmount) : "None"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {isOverdue
                ? `${overdueCount} unpaid obligation${overdueCount !== 1 ? "s" : ""}`
                : "You're all caught up"}
            </p>
          </CardContent>
        </Card>
      </Link>

      {/* Total Remaining Debt */}
      <Card size="sm" className="h-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-normal text-muted-foreground">
              Remaining Debt
            </CardTitle>
            <CreditCard className="size-4 text-violet-500" />
          </div>
        </CardHeader>
        <CardContent>
          <p className="font-mono text-2xl font-bold">
            {formatCompactPHP(totalRemainingDebt)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {totalRemainingDebt === 0 ? "No active loans" : "Across all loans"}
          </p>
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
