import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { Obligation } from "@/generated/prisma/browser"
import { Link } from "@tanstack/react-router"
import { AlertTriangle, CalendarClock, CreditCard, Wallet } from "lucide-react"
import { computeInsights, formatCompactPHP, formatPayoffDate } from "./helpers"

interface InsightCardsProps {
  obligations: Array<Obligation>
}

export function InsightCards({ obligations }: InsightCardsProps) {
  const {
    totalDueThisMonth,
    dueThisWeekCount,
    dueThisWeekAmount,
    overdueCount,
    overdueAmount,
    totalRemainingDebt,
    debtFreeMonths,
  } = computeInsights(obligations)

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      <Link
        to="/obligations"
        search={(current) => ({ ...current, status: "due-this-week" })}
        className="group"
      >
        <Card size="sm" className="group-hover:ring-primary">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-normal text-muted-foreground">
                Due This Week
              </CardTitle>
              <CalendarClock className="size-4 text-amber-500" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {formatCompactPHP(dueThisWeekAmount)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {dueThisWeekCount} obligation{dueThisWeekCount !== 1 ? "s" : ""}{" "}
              coming up
            </p>
          </CardContent>
        </Card>
      </Link>

      <Link
        to="/obligations"
        search={(current) => ({ ...current, status: "due-this-month" })}
        className="group"
      >
        <Card size="sm" className="group-hover:ring-primary">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-normal text-muted-foreground">
                Due This Month
              </CardTitle>
              <Wallet className="size-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {formatCompactPHP(totalDueThisMonth)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Total obligations this month
            </p>
          </CardContent>
        </Card>
      </Link>

      <Link
        to="/obligations"
        search={(current) => ({ ...current, status: "overdue" })}
        className="group"
      >
        <Card size="sm" className="group-hover:ring-primary">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle
                className={`text-sm font-normal ${overdueCount > 0 ? "text-destructive" : "text-muted-foreground"}`}
              >
                Overdue
              </CardTitle>
              <AlertTriangle
                className={`size-4 ${overdueCount > 0 ? "text-destructive" : "text-emerald-500"}`}
              />
            </div>
          </CardHeader>
          <CardContent>
            <p
              className={`text-2xl font-bold ${overdueCount > 0 ? "text-destructive" : ""}`}
            >
              {overdueCount > 0 ? formatCompactPHP(overdueAmount) : "None"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {overdueCount > 0
                ? `${overdueCount} unpaid obligation${overdueCount !== 1 ? "s" : ""}`
                : "You're all caught up"}
            </p>
          </CardContent>
        </Card>
      </Link>

      <Card size="sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-normal text-muted-foreground">
              Remaining Debt
            </CardTitle>
            <CreditCard className="size-4 text-violet-500" />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            {formatCompactPHP(totalRemainingDebt)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {debtFreeMonths != null ? (
              <>
                Debt-free by{" "}
                <span className="font-semibold text-emerald-500">
                  {formatPayoffDate(debtFreeMonths)}
                </span>
              </>
            ) : (
              "No active loans"
            )}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export function InsightCardsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
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
