import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { Obligation } from "@/generated/prisma/browser"
import { Link, useSearch } from "@tanstack/react-router"
import { useState } from "react"
import {
  formatDueDate,
  formatPHP,
  getObligationStatus,
  getProgressPercentString,
} from "./helpers"
import { MarkPaidDialog } from "./mark-paid-dialog"
import { ObligationItemMenu } from "./obligation-item-menu"

export function ObligationsTable({
  obligations,
}: {
  obligations: Obligation[]
}) {
  const search = useSearch({ from: "/_protected/obligations/" })
  const [pendingObligation, setPendingObligation] = useState<Obligation | null>(
    null
  )

  const isViewingLoan = search.type === "LOAN"

  return (
    <>
      <div className="max-w-full overflow-hidden rounded-lg border pb-4">
        <Table>
          <TableCaption>A list of your obligations.</TableCaption>
          <TableHeader>
            <TableRow className="bg-accent/80 hover:bg-accent/80">
              <TableHead className="w-4">#</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              {isViewingLoan && (
                <TableHead className="text-right">Balance</TableHead>
              )}
              <TableHead className="text-center">Next Due Date</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {obligations.map((obligation, index) => (
              <TableRow key={obligation.id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>
                  <Badge variant={obligation.type}>
                    {obligation.type.toLowerCase()}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Link
                    to="/obligations/$id"
                    params={{ id: obligation.id }}
                    className="hover:underline"
                  >
                    <p className="font-semibold">{obligation.name}</p>
                  </Link>
                  <span className="text-xs text-muted-foreground">
                    {obligation.category}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div>
                    <p className="font-mono">{formatPHP(obligation.amount)}</p>
                  </div>
                  <span className="text-xs text-muted-foreground normal-case">
                    {obligation.recurrence.toLowerCase()}
                  </span>
                </TableCell>
                {isViewingLoan && (
                  <TableCell className="text-right">
                    <p className="font-mono">
                      {formatPHP(obligation.remainingBalance)}
                    </p>
                    <span className="text-xs text-emerald-500">
                      {getProgressPercentString(
                        obligation.remainingBalance,
                        obligation.totalAmount
                      )}
                    </span>
                  </TableCell>
                )}
                <TableCell className="text-center">
                  {formatDueDate(obligation.nextDueDate)}
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant={
                      getObligationStatus(obligation.nextDueDate) === "overdue"
                        ? "destructive"
                        : "secondary"
                    }
                    className="capitalize"
                  >
                    {getObligationStatus(obligation.nextDueDate).replaceAll(
                      "-",
                      " "
                    )}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      type="button"
                      size="xs"
                      variant="link"
                      className="px-0 text-blue-500"
                      onClick={() => setPendingObligation(obligation)}
                    >
                      Mark as Paid
                    </Button>
                    <ObligationItemMenu obligation={obligation} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
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
