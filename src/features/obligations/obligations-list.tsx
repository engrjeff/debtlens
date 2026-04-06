import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ObligationType, type Obligation } from "@/generated/prisma/browser"

import { Button } from "@/components/ui/button"
import { CalendarIcon } from "lucide-react"
import {
  formatDueDate,
  formatPHP,
  getObligationStatus,
  getPerLabel,
} from "./helpers"

function ObligationItem({ obligation }: { obligation: Obligation }) {
  return (
    <Card size="sm" className="h-full border-none ring-0">
      <CardHeader>
        <CardDescription>
          <Badge variant={obligation.type}>
            {obligation.type.toLowerCase()}
          </Badge>
        </CardDescription>
        <CardTitle>{obligation.name}</CardTitle>
        {obligation.type === ObligationType.LOAN && (
          <CardDescription className="text-xs">
            Loan Amount: {formatPHP(obligation.totalAmount)}
          </CardDescription>
        )}
        <CardAction>
          <Badge variant="outline" className="capitalize">
            {getObligationStatus(obligation.nextDueDate).replaceAll("-", " ")}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="mt-auto">
        <p className="mb-1 text-xs text-muted-foreground">
          {obligation.category}
        </p>
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">
            {formatPHP(obligation.amount)}{" "}
            <span className="text-[10px] text-muted-foreground">
              / {getPerLabel(obligation.recurrence)}
            </span>
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <CalendarIcon className="size-3" />
            <span>{formatDueDate(obligation.nextDueDate)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-end">
        <Button
          type="button"
          size="sm"
          variant="link"
          className="px-0 text-blue-500"
        >
          Mark as Paid
        </Button>
      </CardFooter>
    </Card>
  )
}

export function ObligationList({ obligations }: { obligations: Obligation[] }) {
  return (
    <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {obligations.map((obligation) => (
        <li key={obligation.id}>
          <ObligationItem obligation={obligation} />
        </li>
      ))}
    </ul>
  )
}
