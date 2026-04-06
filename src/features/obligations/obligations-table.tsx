import { Badge } from "@/components/ui/badge"
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
import { useSearch } from "@tanstack/react-router"
import {
  formatDueDate,
  formatPHP,
  getObligationStatus,
  getPerLabel,
} from "./helpers"

export function ObligationsTable({
  obligations,
}: {
  obligations: Obligation[]
}) {
  const search = useSearch({ from: "/_protected/debts/" })

  const isViewingLoan = search.type === "LOAN"

  return (
    <div className="max-w-full overflow-hidden rounded-lg border pb-4">
      <Table>
        <TableCaption>A list of your obligations.</TableCaption>
        <TableHeader>
          <TableRow className="bg-accent/80 hover:bg-accent/80">
            <TableHead className="w-4">#</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            {isViewingLoan && (
              <TableHead className="text-right">Balance</TableHead>
            )}
            <TableHead className="text-center">Next Due Date</TableHead>
            <TableHead className="text-center">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {obligations.map((obligation, index) => (
            <TableRow key={obligation.id}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>
                <Badge variant={obligation.type}>{obligation.type}</Badge>
              </TableCell>
              <TableCell>{obligation.name}</TableCell>
              <TableCell>{obligation.category}</TableCell>
              <TableCell className="text-right">
                <span className="font-mono">
                  {formatPHP(obligation.amount)}
                </span>
                {" / "}
                <span className="text-xs text-muted-foreground">
                  {getPerLabel(obligation.recurrence)}
                </span>
              </TableCell>
              {isViewingLoan && (
                <TableCell className="text-right font-mono">
                  {formatPHP(obligation.remainingBalance)}
                </TableCell>
              )}
              <TableCell className="text-center">
                {formatDueDate(obligation.nextDueDate)}
              </TableCell>
              <TableCell className="text-center">
                <Badge variant="secondary" className="capitalize">
                  {getObligationStatus(obligation.nextDueDate).replaceAll(
                    "-",
                    " "
                  )}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
