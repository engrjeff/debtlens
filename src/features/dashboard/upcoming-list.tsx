import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { formatPHP, getDueDaysLabel } from "@/features/obligations/helpers"
import { Link } from "@tanstack/react-router"
import { ArrowRight, CalendarClock } from "lucide-react"
import type { UpcomingObligation } from "./dashboard.utils"

interface UpcomingListProps {
  items: Array<UpcomingObligation>
}

export function UpcomingList({ items }: UpcomingListProps) {
  return (
    <Card size="sm" className="flex h-full flex-col">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarClock className="size-4 text-muted-foreground" />
            <CardTitle className="text-sm font-medium">
              Upcoming Obligations
            </CardTitle>
          </div>
          <Link
            to="/obligations"
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
            No upcoming obligations
          </div>
        ) : (
          <ul className="divide-y">
            {items.map((item) => (
              <UpcomingRow key={item.id} item={item} />
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

function UpcomingRow({ item }: { item: UpcomingObligation }) {
  const isOverdue = item.status === "overdue"
  const isDueToday = item.status === "due-today"
  const isUrgent = isOverdue || isDueToday

  return (
    <li>
      <Link
        to="/obligations/$id"
        params={{ id: item.id }}
        className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/40"
      >
        {/* Status stripe */}
        <div
          className={`h-8 w-0.5 shrink-0 rounded-full ${
            isOverdue
              ? "bg-destructive"
              : isDueToday
                ? "bg-amber-500"
                : item.status === "due-this-week"
                  ? "bg-yellow-400"
                  : "bg-border"
          }`}
        />

        {/* Name + meta */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span
              className={`truncate text-sm font-medium ${isOverdue ? "text-destructive" : ""}`}
            >
              {item.name}
            </span>
            <Badge variant={item.type} className="shrink-0">
              {item.type === "BILL" ? "Bill" : "Loan"}
            </Badge>
          </div>
          <p
            className={`mt-0.5 text-xs ${isUrgent ? "font-medium text-destructive" : "text-muted-foreground"}`}
          >
            {getDueDaysLabel(item.nextDueDate)}
          </p>
        </div>

        {/* Amount */}
        <span
          className={`shrink-0 font-mono text-sm font-semibold ${isOverdue ? "text-destructive" : ""}`}
        >
          {formatPHP(item.amount)}
        </span>
      </Link>
    </li>
  )
}

export function UpcomingListSkeleton() {
  return (
    <Card size="sm" className="h-full">
      <CardHeader className="border-b">
        <Skeleton className="h-4 w-40" />
      </CardHeader>
      <CardContent className="p-0">
        <ul className="divide-y">
          {Array.from({ length: 5 }).map((_, i) => (
            <li key={i} className="flex items-center gap-3 px-4 py-3">
              <Skeleton className="h-8 w-0.5" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
              <Skeleton className="h-4 w-16" />
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
