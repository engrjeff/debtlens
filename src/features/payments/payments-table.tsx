import { Link } from "@tanstack/react-router"
import { format } from "date-fns"
import type { ObligationType } from "@/generated/prisma/enums"
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
import { formatPHP } from "@/features/obligations/helpers"

type Payment = {
  id: string
  amount: number
  paidAt: Date | string
  forDueDate: Date | string
  modeOfPayment: string
  notes: string | null
  obligation: {
    id: string
    name: string
    category: string
    type: ObligationType
  }
}

export function PaymentsTable({
  payments,
  offset = 0,
}: {
  payments: Array<Payment>
  offset?: number
}) {
  return (
    <div className="max-w-full overflow-hidden rounded-lg border pb-4">
      <Table>
        <TableCaption>A list of all your recorded payments.</TableCaption>
        <TableHeader>
          <TableRow className="bg-accent/80 hover:bg-accent/80">
            <TableHead className="w-4">#</TableHead>
            <TableHead>Obligation</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-center">Paid At</TableHead>
            <TableHead className="text-center">For Due Date</TableHead>
            <TableHead>Mode of Payment</TableHead>
            <TableHead>Notes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment, index) => (
            <TableRow key={payment.id}>
              <TableCell className="font-medium">
                {offset + index + 1}
              </TableCell>
              <TableCell>
                <div>
                  <Link
                    to="/obligations/$id"
                    params={{ id: payment.obligation.id }}
                    className="font-semibold hover:underline"
                  >
                    {payment.obligation.name}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    {payment.obligation.category}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={payment.obligation.type}>
                  {payment.obligation.type.toLowerCase()}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <span className="font-mono font-semibold text-emerald-500">
                  {formatPHP(payment.amount)}
                </span>
              </TableCell>
              <TableCell className="text-center text-sm">
                {format(new Date(payment.paidAt), "MMM d, yyyy")}
              </TableCell>
              <TableCell className="text-center text-sm">
                {format(new Date(payment.forDueDate), "MMM d, yyyy")}
              </TableCell>
              <TableCell className="text-sm">{payment.modeOfPayment}</TableCell>
              <TableCell className="max-w-50 truncate text-sm text-muted-foreground">
                {payment.notes ?? "—"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
