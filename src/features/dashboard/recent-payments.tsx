import { Link } from "@tanstack/react-router"
import { format } from "date-fns"
import { ArrowRight, CheckCheckIcon } from "lucide-react"
import type { ObligationType } from "@/generated/prisma/enums"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { formatPHP } from "@/features/obligations/helpers"

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

interface RecentPaymentsListProps {
  items: Array<RecentPayment>
}

export function RecentPaymentsList({ items }: RecentPaymentsListProps) {
  return (
    <Card size="sm" className="flex h-full flex-col gap-2">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCheckIcon className="size-4 text-muted-foreground" />
            <CardTitle className="text-sm font-medium">
              Recent Payments
            </CardTitle>
          </div>
          <Link
            to="/payment-schedule"
            className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            View all
            <ArrowRight className="size-3" />
          </Link>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0 group-data-[size=sm]/card:px-0">
        {items.length === 0 ? (
          <div className="flex h-full items-center justify-center py-12 text-sm text-muted-foreground">
            No payments recorded
          </div>
        ) : (
          <ul className="divide-y">
            {items.map((item) => (
              <li key={item.id}>
                <Link
                  to="/obligations/$id"
                  params={{ id: item.obligation.id }}
                  className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/40"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {item.obligation.name}
                    </p>
                    <Badge variant={item.obligation.type}>
                      {item.obligation.category}
                    </Badge>
                  </div>

                  <div className="text-right">
                    <p className="font-mono text-sm font-semibold text-emerald-500">
                      {formatPHP(item.amount)}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {format(new Date(item.paidAt), "MMM d, yyyy")}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

export function RecentPaymentsListSkeleton() {
  return (
    <Card size="sm" className="h-full">
      <CardHeader className="border-b">
        <Skeleton className="h-4 w-36" />
      </CardHeader>
      <CardContent className="p-0">
        <ul className="divide-y">
          {Array.from({ length: 5 }).map((_, i) => (
            <li key={i} className="flex items-center gap-3 px-4 py-3">
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
              <div className="space-y-1 text-right">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-3 w-20" />
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
