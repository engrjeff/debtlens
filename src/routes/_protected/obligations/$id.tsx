import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  formatDueDate,
  formatPHP,
  getPerLabel,
  getProgressPercent,
  getRecurrenceLabel,
} from "@/features/obligations/helpers"
import { MarkPaidDialog } from "@/features/obligations/mark-paid-dialog"
import { ObligationDeleteDialog } from "@/features/obligations/obligation-delete-dialog"
import { ObligationEditDialog } from "@/features/obligations/obligation-edit-dialog"
import { ObligationEditForm } from "@/features/obligations/obligation-edit-form"
import { fetchObligationById } from "@/features/obligations/obligations.functions"
import { ObligationType } from "@/generated/prisma/browser"
import { createFileRoute, Link } from "@tanstack/react-router"
import { format } from "date-fns"
import { CalendarIcon, PencilIcon, ReceiptIcon, Trash2Icon } from "lucide-react"
import { useState } from "react"

export const Route = createFileRoute("/_protected/obligations/$id")({
  component: RouteComponent,
  loader: async ({ params }) => {
    return fetchObligationById({ data: { id: params.id } })
  },
  head(ctx) {
    return {
      meta: [
        {
          title: `Obligations > ${ctx.loaderData?.name} | DebtLens`,
        },
      ],
    }
  },
})

function RouteComponent() {
  const obligation = Route.useLoaderData()

  const [showMarkPaid, setShowMarkPaid] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)

  const isLoan = obligation.type === ObligationType.LOAN
  const amountPaid = isLoan
    ? obligation.totalAmount - obligation.remainingBalance
    : null
  const progressPercent = isLoan
    ? getProgressPercent(obligation.remainingBalance, obligation.totalAmount)
    : null

  return (
    <>
      <header className="flex items-center gap-4 border-b px-4 py-3">
        <SidebarTrigger />
        <Separator orientation="vertical" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/obligations">Obligations</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{obligation.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <main className="container mx-auto max-w-2xl space-y-6 p-4">
        {/* Details */}
        <Card>
          <CardHeader>
            <CardDescription className="capitalize">
              {obligation.type.toLowerCase()} · {obligation.category}
            </CardDescription>
            <CardTitle className="text-2xl">{obligation.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Payment Amount</p>
                <p className="font-mono font-semibold">
                  {formatPHP(obligation.amount)}{" "}
                  <span className="text-xs text-muted-foreground">
                    / {getPerLabel(obligation.recurrence)}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Recurrence</p>
                <p className="font-semibold">
                  {getRecurrenceLabel(obligation.recurrence)}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Next Due</p>
                <p className="font-semibold">
                  {formatDueDate(obligation.nextDueDate)}
                </p>
              </div>
              {isLoan && (
                <>
                  <div>
                    <p className="text-muted-foreground">Loan Amount</p>
                    <p className="font-mono font-semibold">
                      {formatPHP(obligation.totalAmount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Remaining Balance</p>
                    <p className="font-mono font-semibold">
                      {formatPHP(obligation.remainingBalance)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Amount Paid</p>
                    <p className="font-mono font-semibold text-emerald-600">
                      {formatPHP(amountPaid!)}
                    </p>
                  </div>
                  {obligation.interestRate != null && (
                    <div>
                      <p className="text-muted-foreground">Interest Rate</p>
                      <p className="font-semibold">
                        {(obligation.interestRate * 100).toFixed(2)}%
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>

            {isLoan && progressPercent != null && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{progressPercent.toFixed(2)}% paid off</span>
                  <span className="font-mono">
                    {formatPHP(obligation.remainingBalance)} left
                  </span>
                </div>
                <Progress value={progressPercent} className="h-2" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button onClick={() => setShowMarkPaid(true)}>
              <ReceiptIcon />
              Mark as Paid
            </Button>
            <Button variant="outline" onClick={() => setShowEdit(true)}>
              <PencilIcon />
              Edit
            </Button>
          </CardContent>
        </Card>

        {/* Payment History */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Payment History</CardTitle>
            <CardDescription>
              {obligation.payments.length === 0
                ? "No payments recorded yet."
                : `${obligation.payments.length} payment${obligation.payments.length > 1 ? "s" : ""} recorded`}
            </CardDescription>
          </CardHeader>
          {obligation.payments.length > 0 && (
            <CardContent>
              <ul className="space-y-3 divide-y">
                {obligation.payments.map((payment) => (
                  <li
                    key={payment.id}
                    className="flex items-start justify-between py-3 text-sm"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="size-3.5 shrink-0 text-muted-foreground" />
                        <span className="font-medium">
                          {format(new Date(payment.paidAt), "MMM d, yyyy")}
                        </span>
                      </div>
                      <p className="pl-5 text-xs text-muted-foreground">
                        For{" "}
                        {format(new Date(payment.forDueDate), "MMM d, yyyy")}{" "}
                        due · {payment.modeOfPayment}
                      </p>
                      {payment.notes && (
                        <p className="pl-5 text-xs text-muted-foreground italic">
                          {payment.notes}
                        </p>
                      )}
                    </div>
                    <span className="font-mono font-semibold text-emerald-500">
                      {formatPHP(payment.amount)}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          )}
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive/40">
          <CardHeader>
            <CardTitle className="text-base text-destructive">
              Danger Zone
            </CardTitle>
            <CardDescription>
              Permanently delete this {obligation.type.toLowerCase()}. This
              action cannot be undone.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" onClick={() => setShowDelete(true)}>
              <Trash2Icon />
              Delete {obligation.type.toLowerCase()}
            </Button>
          </CardContent>
        </Card>
      </main>

      <MarkPaidDialog
        obligation={obligation}
        open={showMarkPaid}
        onClose={() => setShowMarkPaid(false)}
      />

      <ObligationEditDialog
        open={showEdit}
        onOpenChange={(open) => setShowEdit(open)}
      >
        <ObligationEditForm
          obligation={obligation}
          onAfterSave={() => setShowEdit(false)}
        />
      </ObligationEditDialog>

      <ObligationDeleteDialog
        obligation={obligation}
        open={showDelete}
        onOpenChange={(open) => {
          setShowDelete(open)
        }}
      />
    </>
  )
}
