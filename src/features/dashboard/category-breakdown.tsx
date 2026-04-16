import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { formatPHP, getCategoryMeta } from "@/features/obligations/helpers"
import { Link } from "@tanstack/react-router"
import { LayoutGrid } from "lucide-react"
import type { CategoryBreakdownItem } from "./dashboard.utils"

// Map Tailwind dot class → hex for inline bar styles
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
  const max = Math.max(...items.map((i) => i.totalAmount))

  return (
    <Card size="sm">
      <CardHeader className="border-b">
        <div className="flex items-center gap-2">
          <LayoutGrid className="size-4 text-muted-foreground" />
          <CardTitle className="text-sm font-medium">
            Monthly Spend by Category
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* ── Bar rows ── */}
        <ul className="space-y-2">
          {items.map((item) => {
            const pct = total > 0 ? (item.totalAmount / total) * 100 : 0
            const barWidth = max > 0 ? (item.totalAmount / max) * 100 : 0
            const hex = getCategoryHex(item.category)

            return (
              <li key={item.category}>
                <Link
                  to="/obligations"
                  search={(c) => ({ ...c, categories: [item.category] })}
                  className="relative flex h-9 items-center overflow-hidden rounded transition-opacity hover:opacity-80"
                  style={{ backgroundColor: `${hex}33` }}
                >
                  {/* Bar fill */}
                  <div
                    className="absolute top-0 left-0 h-full transition-all"
                    style={{
                      width: `${barWidth}%`,
                      backgroundColor: hex,
                    }}
                  />

                  {/* Text overlay */}
                  <div className="relative z-10 flex w-full items-center justify-between px-3 text-xs">
                    <span className="font-medium">{item.category}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono">
                        {formatPHP(item.totalAmount)}
                      </span>
                      <span>({pct.toFixed(1)}%)</span>
                    </div>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
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
        <ul className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <li key={i}>
              <Skeleton className="h-9 w-full rounded" />
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
