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
import type { Obligation } from "@/generated/prisma/browser"
import { ObligationType } from "@/generated/prisma/browser"
import { Link } from "@tanstack/react-router"
import { CalendarIcon } from "lucide-react"
import { useState } from "react"
import {
  formatDueDate,
  formatPHP,
  getPerLabel,
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
  return (
    <Card size="sm" className="relative h-full border-none ring-0">
      <CardHeader>
        <CardDescription>
          <Badge variant={obligation.type}>
            {obligation.type.toLowerCase()}
          </Badge>
        </CardDescription>
        <CardTitle>
          <Link
            to="/obligations/$id"
            params={{ id: obligation.id }}
            className="hover:underline"
          >
            {obligation.name}
          </Link>
        </CardTitle>
        {obligation.type === ObligationType.LOAN && (
          <CardDescription className="text-xs">
            Loan Amount:{" "}
            <span className="font-mono">
              {formatPHP(obligation.totalAmount)}
            </span>
          </CardDescription>
        )}
        <div className="absolute top-1 right-1">
          <ObligationItemMenu obligation={obligation} />
        </div>
      </CardHeader>
      <CardContent className="mt-auto flex items-center justify-between">
        <div>
          <p className="mb-1 text-xs text-muted-foreground">
            {obligation.category}
          </p>
          <p className="text-lg font-semibold">
            <span className="font-mono">{formatPHP(obligation.amount)}</span>{" "}
            <span className="text-[10px] text-muted-foreground">
              / {getPerLabel(obligation.recurrence)}
            </span>
          </p>
        </div>

        <div>
          <p className="mb-1 text-xs text-muted-foreground">Next Due</p>
          <div className="flex items-center gap-2 text-xs font-semibold">
            <CalendarIcon className="size-3" />
            <span>{formatDueDate(obligation.nextDueDate)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-between">
        {obligation.type === ObligationType.LOAN ? (
          <span className="text-xs font-semibold text-emerald-500">
            {getProgressPercentString(
              obligation.remainingBalance,
              obligation.totalAmount
            )}
          </span>
        ) : null}
        <Button
          type="button"
          size="xs"
          variant="link"
          className="ml-auto px-0 text-blue-500"
          onClick={() => onMarkPaid(obligation)}
        >
          Mark as Paid
        </Button>
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
      <ul className="grid grid-cols-1 gap-4 lg:grid-cols-3">
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
