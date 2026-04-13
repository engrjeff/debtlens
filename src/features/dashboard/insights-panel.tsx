import { AlertTriangle, Info, LightbulbIcon, Zap } from "lucide-react"
import type { DashboardInsight } from "./dashboard.utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface InsightsPanelProps {
  insights: Array<DashboardInsight>
}

const SEVERITY_STYLES = {
  danger: {
    row: "border-destructive/20 bg-destructive/5",
    icon: "text-destructive",
    text: "text-destructive",
    Icon: AlertTriangle,
  },
  warning: {
    row: "border-amber-200 bg-amber-50 dark:border-amber-800/40 dark:bg-amber-950/20",
    icon: "text-amber-500",
    text: "text-amber-700 dark:text-amber-400",
    Icon: Zap,
  },
  info: {
    row: "border-border bg-muted/30",
    icon: "text-muted-foreground",
    text: "text-foreground",
    Icon: Info,
  },
} as const

export function InsightsPanel({ insights }: InsightsPanelProps) {
  if (insights.length === 0) return null

  return (
    <Card size="sm" className="flex h-full flex-col">
      <CardHeader className="border-b">
        <div className="flex items-center gap-2">
          <LightbulbIcon className="size-4 text-muted-foreground" />
          <CardTitle className="text-sm font-medium">Insights</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          {insights.map((insight) => {
            const { row, icon, text, Icon } = SEVERITY_STYLES[insight.severity]
            return (
              <li
                key={insight.key}
                className={`flex items-start gap-2.5 rounded-lg px-3 py-2.5 text-sm sm:flex-1 sm:basis-64 ${row}`}
              >
                <Icon className={`mt-0.5 size-4 shrink-0 ${icon}`} />
                <span className={text}>{insight.message}</span>
              </li>
            )
          })}
        </ul>
      </CardContent>
    </Card>
  )
}

export function InsightsPanelSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-3.5 w-16" />
      <div className="flex gap-2">
        <Skeleton className="h-10 flex-1 rounded-lg" />
        <Skeleton className="h-10 flex-1 rounded-lg" />
        <Skeleton className="h-10 basis-64 rounded-lg" />
      </div>
    </div>
  )
}
