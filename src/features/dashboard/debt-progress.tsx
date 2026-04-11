import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { formatPHP } from "@/features/obligations/helpers"
import { Link } from "@tanstack/react-router"
import { TrendingDown } from "lucide-react"
import type { DebtProgressData } from "./dashboard.utils"

interface DebtProgressProps {
  data: DebtProgressData
}

export function DebtProgress({ data }: DebtProgressProps) {
  const {
    totalRemaining,
    totalOriginal,
    percentPaid,
    estimatedDebtFreeDate,
    topLoans,
  } = data

  const hasLoans = totalOriginal > 0

  return (
    <Card size="sm" className="flex h-full flex-col">
      <CardHeader className="border-b">
        <div className="flex items-center gap-2">
          <TrendingDown className="size-4 text-muted-foreground" />
          <CardTitle className="text-sm font-medium">Debt Progress</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col justify-between gap-5">
        {!hasLoans ? (
          <div className="flex flex-1 items-center justify-center py-8 text-sm text-muted-foreground">
            No active loans
          </div>
        ) : (
          <>
            {/* Overall progress */}
            <div className="space-y-3 rounded-md bg-muted/50 p-4">
              {/* Two prominent stats */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Remaining</p>
                  <p className="font-mono text-2xl leading-tight font-bold">
                    {formatPHP(totalRemaining)}
                  </p>
                  <p className="font-mono text-xs text-muted-foreground">
                    of {formatPHP(totalOriginal)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Paid off</p>
                  <p className="font-mono text-2xl leading-tight font-bold text-emerald-500">
                    {percentPaid.toFixed(1)}%
                  </p>
                  {estimatedDebtFreeDate && (
                    <p className="text-xs text-muted-foreground">
                      Debt-free by{" "}
                      <span className="font-bold text-emerald-500">
                        {estimatedDebtFreeDate}
                      </span>
                    </p>
                  )}
                </div>
              </div>

              <Progress value={percentPaid} className="h-2" />
            </div>

            {/* Top loans */}
            {topLoans.length > 0 && (
              <div className="flex-1 space-y-3 p-4">
                <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  Largest loans
                </p>
                <ul className="space-y-5">
                  {topLoans.map((loan) => (
                    <li key={loan.id}>
                      <Link to="/obligations/$id" params={{ id: loan.id }}>
                        <div className="mb-2 flex items-center justify-between text-xs">
                          <span className="truncate font-medium">
                            {loan.name}
                          </span>
                          <div className="ml-2 flex shrink-0 items-center gap-2">
                            <span className="text-xs font-medium text-emerald-500">
                              {loan.percentPaid.toFixed(0)}%
                            </span>
                            <span className="font-mono text-muted-foreground tabular-nums">
                              {formatPHP(loan.remainingBalance)}
                            </span>
                          </div>
                        </div>
                        <Progress value={loan.percentPaid} className="h-1.5" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}

export function DebtProgressSkeleton() {
  return (
    <Card size="sm" className="h-full">
      <CardHeader className="border-b">
        <Skeleton className="h-4 w-28" />
      </CardHeader>
      <CardContent className="space-y-5 pt-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-36" />
          <Skeleton className="h-2 w-full" />
          <Skeleton className="h-3 w-24" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-3 w-20" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-1.5">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-1.5 w-full" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
