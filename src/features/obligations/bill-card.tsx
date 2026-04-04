import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CheckCircle2, Clock, MoreHorizontal, Pencil, Receipt } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  formatDueDate,
  formatPHP,
  getCategoryMeta,
  getDueDaysLabel,
  getObligationStatus,
  getRecurrenceLabel,
} from "./helpers"
import type { Obligation } from "./helpers"

interface BillCardProps {
  obligation: Obligation
  onMarkPaid?: (id: string) => void
  onEdit?: (id: string) => void
}

export function BillCard({ obligation, onMarkPaid, onEdit }: BillCardProps) {
  const status = getObligationStatus(obligation.nextDueDate)
  const isOverdue = status === "overdue"
  const isDueToday = status === "due-today"
  const isDueSoon = status === "due-this-week"
  const categoryMeta = getCategoryMeta(obligation.category)

  return (
    <Card
      size="sm"
      className={cn(
        "transition-shadow hover:shadow-sm",
        isOverdue && "ring-destructive/40 bg-destructive/5",
        isDueToday && "ring-amber-500/40 bg-amber-50/50 dark:bg-amber-950/20",
      )}
    >
      <CardContent className="flex items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium truncate">{obligation.name}</p>
                <span className="shrink-0 rounded-full border px-2 py-0.5 text-xs font-medium bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800">
                  Bill
                </span>
              </div>
              <span className={cn("mt-1.5 inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium", categoryMeta.badge)}>
                <span className={cn("size-1.5 rounded-full shrink-0", categoryMeta.dot)} />
                {obligation.category}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div className="text-right">
                <p className="text-xl font-bold tabular-nums">{formatPHP(obligation.amount)}</p>
                <p className="text-xs text-muted-foreground">
                  {getRecurrenceLabel(obligation.recurrence)}
                </p>
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

          <div className="flex items-center gap-1.5 mt-3">
            <Clock
              className={cn(
                "size-3.5 shrink-0",
                isOverdue && "text-destructive",
                isDueToday && "text-amber-600 dark:text-amber-400",
                isDueSoon && "text-blue-600 dark:text-blue-400",
                !isOverdue && !isDueToday && !isDueSoon && "text-muted-foreground",
              )}
            />
            <span
              className={cn(
                "text-xs font-medium",
                isOverdue && "text-destructive",
                isDueToday && "text-amber-600 dark:text-amber-400",
                isDueSoon && "text-blue-600 dark:text-blue-400",
                !isOverdue && !isDueToday && !isDueSoon && "text-muted-foreground",
              )}
            >
              {getDueDaysLabel(obligation.nextDueDate)}
            </span>
            <span className="text-xs text-muted-foreground">
              · {formatDueDate(obligation.nextDueDate)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
