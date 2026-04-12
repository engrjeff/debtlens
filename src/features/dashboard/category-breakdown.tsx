import { Link } from "@tanstack/react-router"
import { LayoutGrid } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"
import type { ChartConfig } from "@/components/ui/chart"
import type { CategoryBreakdownItem } from "./dashboard.utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"
import {
  formatCompactPHP,
  formatPHP,
  getCategoryMeta,
} from "@/features/obligations/helpers"

// Map Tailwind dot class → hex so Recharts can use it as fill
const DOT_TO_HEX: Record<string, string> = {
  "bg-sky-500": "#0ea5e9",
  "bg-amber-500": "#f59e0b",
  "bg-pink-500": "#ec4899",
  "bg-orange-500": "#f97316",
  "bg-indigo-500": "#6366f1",
  "bg-teal-500": "#14b8a6",
  "bg-violet-500": "#8b5cf6",
  "bg-blue-500": "#3b82f6",
  "bg-rose-500": "#f43f5e",
  "bg-emerald-500": "#10b981",
  "bg-slate-400": "#94a3b8",
}

function getCategoryHex(category: string): string {
  const dot = getCategoryMeta(category).dot
  return DOT_TO_HEX[dot] ?? "#94a3b8"
}

interface CategoryBreakdownProps {
  items: Array<CategoryBreakdownItem>
}

export function CategoryBreakdown({ items }: CategoryBreakdownProps) {
  if (items.length === 0) return null

  const total = items.reduce((sum, i) => sum + i.totalAmount, 0)

  const chartConfig = items.reduce<ChartConfig>(
    (acc, item) => {
      const key = item.category.replace(/[^a-zA-Z0-9]/g, "_")
      acc[key] = { label: item.category, color: getCategoryHex(item.category) }
      return acc
    },
    {
      label: { color: "var(--background)" },
    }
  )

  const chartData = items.map((item) => ({
    category: item.category,
    value: item.totalAmount,
    fill: getCategoryHex(item.category),
  }))

  return (
    <Card size="sm">
      <CardHeader className="border-b">
        <div className="flex items-center gap-2">
          <LayoutGrid className="size-4 text-muted-foreground" />
          <CardTitle className="text-sm font-medium">
            Monthly Spend by Category
          </CardTitle>
          <span className="ml-1 text-xs text-muted-foreground">
            (monthly-equivalent)
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* ── Bar chart ── */}
        <ChartContainer
          config={chartConfig}
          className="w-full"
          // initialDimension={{
          //   width: 600,
          //   height: Math.max(180, items.length * 40),
          // }}
          // style={{ height: Math.max(180, items.length * 40) }}
        >
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ right: 110, left: 120 }}
            accessibilityLayer
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="category"
              type="category"
              tickLine={false}
              axisLine={false}
              hide
            />
            <XAxis dataKey="value" type="number" domain={[0, "dataMax"]} hide />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value, _name, props) => (
                    <span className="font-mono">
                      {props.payload.category}: {formatPHP(value as number)}
                    </span>
                  )}
                />
              }
            />
            <Bar dataKey="value" radius={4}>
              <LabelList
                dataKey="category"
                position="left"
                offset={10}
                className="fill-foreground"
                fontSize={12}
              />
              <LabelList
                dataKey="value"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
                formatter={(value: unknown) =>
                  typeof value === "number" ? formatCompactPHP(value) : ""
                }
              />
            </Bar>
          </BarChart>
        </ChartContainer>

        {/* ── Clickable breakdown list (filter links) ── */}
        <div className="border-t pt-3">
          <p className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Filter by category
          </p>
          <ul className="flex flex-wrap gap-2">
            {items.map((item) => {
              const pct = total > 0 ? (item.totalAmount / total) * 100 : 0
              const meta = getCategoryMeta(item.category)

              return (
                <li key={item.category}>
                  <Link
                    to="/obligations"
                    search={(c) => ({ ...c, q: item.category })}
                    className="group flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs transition-colors hover:bg-muted/60 hover:ring-1 hover:ring-border"
                  >
                    <span
                      className={`size-2 shrink-0 rounded-full ${meta.dot}`}
                    />
                    <span className="font-medium">{item.category}</span>
                    <span className="font-mono text-muted-foreground">
                      {formatPHP(item.totalAmount)}
                    </span>
                    <span className="text-muted-foreground">
                      · {pct.toFixed(0)}%
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

export function CategoryBreakdownSkeleton() {
  return (
    <Card size="sm">
      <CardHeader className="border-b">
        <Skeleton className="h-4 w-48" />
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="h-8 flex-1 rounded" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 border-t pt-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-7 w-28 rounded-md" />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
