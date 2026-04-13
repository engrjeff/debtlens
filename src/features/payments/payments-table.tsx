import { Link } from "@tanstack/react-router"
import { format } from "date-fns"
import type { ObligationType } from "@/generated/prisma/enums"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
    <>
      {/* Mobile card list */}
      <div className="flex flex-col gap-4 md:hidden">
        {payments.map((payment) => (
          <Card key={payment.id} size="sm">
            <CardHeader>
              <CardTitle>
                <Link
                  to="/obligations/$id"
                  params={{ id: payment.obligation.id }}
                  className="truncate hover:underline"
                >
                  {payment.obligation.name}
                </Link>
              </CardTitle>

              <CardDescription>
                <Badge variant={payment.obligation.type}>
                  {payment.obligation.type.toLowerCase()}
                </Badge>
              </CardDescription>
              <CardAction>
                <Badge variant="secondary">{payment.modeOfPayment}</Badge>
              </CardAction>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="font-mono font-semibold text-emerald-500">
                  {formatPHP(payment.amount)}
                </span>
              </div>
              <div className="mt-1 flex gap-4 text-xs text-muted-foreground">
                <span>
                  Paid {format(new Date(payment.paidAt), "MMM d, yyyy")}
                </span>
                <span>·</span>
                <span>
                  Due {format(new Date(payment.forDueDate), "MMM d, yyyy")}
                </span>
              </div>
              {payment.notes && (
                <p className="mt-1 truncate text-xs text-muted-foreground">
                  {payment.notes}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden max-w-full overflow-hidden rounded-lg border pb-4 md:block">
        <Table>
          <TableCaption>A list of all your recorded payments.</TableCaption>
          <TableHeader>
            <TableRow className="bg-accent/80 hover:bg-accent/80">
              <TableHead className="w-4">#</TableHead>
              <TableHead>Obligation</TableHead>
              <TableHead>Category</TableHead>
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
                  <Link
                    to="/obligations/$id"
                    params={{ id: payment.obligation.id }}
                    className="font-semibold hover:underline"
                  >
                    {payment.obligation.name}
                  </Link>
                </TableCell>
                <TableCell>
                  <Badge variant={payment.obligation.type}>
                    {payment.obligation.category}
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
                <TableCell className="text-sm">
                  {payment.modeOfPayment}
                </TableCell>
                <TableCell className="max-w-50 truncate text-sm text-muted-foreground">
                  {payment.notes ?? "—"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
