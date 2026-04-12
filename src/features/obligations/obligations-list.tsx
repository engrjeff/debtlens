import { Text } from "@/components/text"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { Obligation } from "@/generated/prisma/browser"
import { ObligationType, RecurrenceType } from "@/generated/prisma/browser"
import { cn } from "@/lib/utils"
import { Link } from "@tanstack/react-router"
import { CheckCheckIcon, CheckIcon } from "lucide-react"
import { useState } from "react"
import {
  formatPHP,
  getProgressPercent,
  getProgressPercentString,
} from "./helpers"
import { MarkPaidDialog } from "./mark-paid-dialog"
import { ObligationItemMenu } from "./obligation-item-menu"

function ObligationItem({
  obligation,
  onMarkPaid,
}: {
  obligation: Obligation
  onMarkPaid: (obligation: Obligation) => void
}) {
  const isDone = obligation.isDone === true

  return (
    <Card
      size="sm"
      className={cn(
        "relative border-none ring-0 lg:h-full",
        isDone ? "opacity-60" : ""
      )}
    >
      <CardHeader>
        <CardDescription>
          <div className="flex items-center gap-1.5">
            <Badge variant={obligation.type}>{obligation.category}</Badge>
            {isDone && (
              <Badge
                variant="outline"
                className="gap-1 border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
              >
                <CheckCheckIcon className="size-3" /> Done
              </Badge>
            )}
          </div>
        </CardDescription>
        <CardTitle>
          <Link
            to="/obligations/$id"
            params={{ id: obligation.id }}
            className="font-bold hover:underline"
          >
            {obligation.name}
          </Link>
        </CardTitle>
        <div className="absolute top-1 right-1">
          <ObligationItemMenu obligation={obligation} />
        </div>
      </CardHeader>
      <CardContent className="mt-auto flex items-center justify-between">
        <div className="space-y-0.5">
          <Text size="xxs" variant="muted" className="capitalize">
            {obligation.recurrence === RecurrenceType.ONCE
              ? "One-time payment"
              : `${obligation.recurrence.toLowerCase()} payment`}
          </Text>
          <Text size="lg" weight="bold" className="font-mono">
            {formatPHP(obligation.amount)}
          </Text>
        </div>

        <Badge variant="outline" className="gap-1.5">
          <span className="size-1.5 rounded-full bg-emerald-400" />
          {new Intl.DateTimeFormat("en-PH", {
            month: "short",
            day: "2-digit",
          }).format(new Date(obligation.nextDueDate))}
        </Badge>
      </CardContent>
      <CardFooter className="flex-col gap-4">
        {obligation.type === ObligationType.LOAN && !isDone && (
          <div className="w-full space-y-1">
            <div className="flex justify-between">
              <Text size="xxs" variant="muted">
                {getProgressPercentString(
                  obligation.remainingBalance,
                  obligation.totalAmount
                )}
              </Text>
              <Text size="xxs" variant="muted" weight="medium">
                {formatPHP(obligation.remainingBalance)} remaining
              </Text>
            </div>
            <Progress
              value={getProgressPercent(
                obligation.remainingBalance,
                obligation.totalAmount
              )}
            />
          </div>
        )}
        {isDone ? null : (
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => onMarkPaid(obligation)}
          >
            <CheckIcon /> Mark as Paid
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

export function ObligationList({
  obligations,
}: {
  obligations: Array<Obligation>
}) {
  const [pendingObligation, setPendingObligation] = useState<Obligation | null>(
    null
  )

  return (
    <>
      <ul className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {obligations.map((obligation) => (
          <li key={obligation.id}>
            <ObligationItem
              obligation={obligation}
              onMarkPaid={setPendingObligation}
            />
          </li>
        ))}
      </ul>

      {pendingObligation && (
        <MarkPaidDialog
          obligation={pendingObligation}
          open={true}
          onClose={() => setPendingObligation(null)}
        />
      )}
    </>
  )
}
