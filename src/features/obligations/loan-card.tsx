import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, Clock, MoreHorizontal, Pencil, Receipt } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  formatDueDate,
  formatPayoffDate,
  formatPHP,
  getCategoryMeta,
  getDueDaysLabel,
  getObligationStatus,
  getPayoffMonths,
  getProgressPercent,
  getRecurrenceLabel,
} from "./helpers"
import type { Obligation } from "./helpers"

interface LoanCardProps {
  obligation: Obligation
  onMarkPaid?: (id: string) => void
  onEdit?: (id: string) => void
}

function getProgressIndicatorColor(progress: number): string {
  if (progress >= 67) return "bg-emerald-500"
  if (progress >= 34) return "bg-amber-500"
  return "bg-rose-500"
}

export function LoanCard({ obligation, onMarkPaid, onEdit }: LoanCardProps) {
  const status = getObligationStatus(obligation.nextDueDate)
  const isOverdue = status === "overdue"
  const isDueToday = status === "due-today"
  const categoryMeta = getCategoryMeta(obligation.category)

  const progress = getProgressPercent(obligation.remainingBalance, obligation.totalAmount)
  const payoffMonths = getPayoffMonths(
    obligation.remainingBalance,
    obligation.recurrence === "MONTHLY" ? obligation.amount : 0,
  )

  return (
    <Card
      size="sm"
      className={cn(
        "transition-shadow hover:shadow-sm",
        isOverdue && "ring-destructive/40 bg-destructive/5",
        isDueToday && "ring-amber-500/40 bg-amber-50/50 dark:bg-amber-950/20",
      )}
    >
      <CardContent className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="font-medium truncate">{obligation.name}</p>
              <span className="shrink-0 rounded-full border px-2 py-0.5 text-xs font-medium bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/40 dark:text-violet-300 dark:border-violet-800">
                Loan
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1.5">
              <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium", categoryMeta.badge)}>
                <span className={cn("size-1.5 rounded-full shrink-0", categoryMeta.dot)} />
                {obligation.category}
              </span>
              {obligation.interestRate != null && (
                <span className="text-xs text-muted-foreground">
                  {obligation.interestRate}% p.a.
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="text-right">
              <p className="text-xl font-bold tabular-nums">
                {formatPHP(obligation.remainingBalance)}
              </p>
              <p className="text-xs text-muted-foreground">remaining</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="size-8 shrink-0">
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onMarkPaid?.(obligation.id)}>
                  <CheckCircle2 className="size-4" />
                  Mark as Paid
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit?.(obligation.id)}>
                  <Pencil className="size-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Receipt className="size-4" />
                  View History
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{progress.toFixed(0)}% paid off</span>
            <span>
              {formatPHP(obligation.totalAmount - obligation.remainingBalance)} /{" "}
              {formatPHP(obligation.totalAmount)}
            </span>
          </div>
          <Progress
            value={progress}
            className="h-2"
            indicatorClassName={getProgressIndicatorColor(progress)}
          />
        </div>

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <Clock
              className={cn(
                "size-3.5 shrink-0",
                isOverdue && "text-destructive",
                isDueToday && "text-amber-600 dark:text-amber-400",
                !isOverdue && !isDueToday && "text-muted-foreground",
              )}
            />
            <span
              className={cn(
                "font-medium",
                isOverdue && "text-destructive",
                isDueToday && "text-amber-600 dark:text-amber-400",
                !isOverdue && !isDueToday && "text-muted-foreground",
              )}
            >
              {getDueDaysLabel(obligation.nextDueDate)}
            </span>
            <span className="text-muted-foreground">· {formatDueDate(obligation.nextDueDate)}</span>
          </div>

          <div className="text-right text-muted-foreground">
            <span>{formatPHP(obligation.amount)}</span>
            <span> / {getRecurrenceLabel(obligation.recurrence).toLowerCase()}</span>
            {payoffMonths > 0 && (
              <span className="ml-1 text-foreground font-medium">
                · Done {formatPayoffDate(payoffMonths)}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
