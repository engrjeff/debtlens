import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
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
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"
import {
  formatDueDate,
  formatPayoffDate,
  formatPHP,
  getDueDaysLabel,
  getObligationStatus,
  getPayoffMonths,
  getPerLabel,
  getProgressPercent,
  getRecurrenceLabel,
} from "@/features/obligations/helpers"
import { MarkPaidDialog } from "@/features/obligations/mark-paid-dialog"
import { ObligationDeleteDialog } from "@/features/obligations/obligation-delete-dialog"
import type {
  ObligationInsight,
  ObligationWithPayments,
  PaymentRecord,
} from "@/features/obligations/obligation-detail.types"
import { ObligationEditDialog } from "@/features/obligations/obligation-edit-dialog"
import { ObligationEditForm } from "@/features/obligations/obligation-edit-form"
import { fetchObligationById } from "@/features/obligations/obligations.functions"
import { ObligationType } from "@/generated/prisma/browser"
import { createFileRoute, Link } from "@tanstack/react-router"
import { format } from "date-fns"
import {
  AlertCircleIcon,
  CalendarDaysIcon,
  CalendarIcon,
  ClockIcon,
  PencilIcon,
  Trash2Icon,
  TrendingUpIcon,
} from "lucide-react"
import { useState } from "react"

// ── Route ─────────────────────────────────────────────────────────────────────

export const Route = createFileRoute("/_protected/obligations/$id")({
  component: RouteComponent,
  pendingComponent: ObligationDetailSkeleton,
  loader: async ({ params }) => {
    return fetchObligationById({ data: { id: params.id } })
  },
  head(ctx) {
    return {
      meta: [{ title: `Obligations > ${ctx.loaderData?.name} | DebtLens` }],
    }
  },
})

// ── Root component ────────────────────────────────────────────────────────────

function RouteComponent() {
  const obligation = Route.useLoaderData()

  const [showMarkPaid, setShowMarkPaid] = useState(false)

  const [showDelete, setShowDelete] = useState(false)

  const isLoan = obligation.type === ObligationType.LOAN
  const status = getObligationStatus(obligation.nextDueDate)

  return (
    <>
      {/* ── Page header ── */}
      <header className="flex items-center gap-4 border-b px-4 py-3">
        <SidebarTrigger />
        <Separator orientation="vertical" />
        <Breadcrumb className="flex-1">
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

      {/* ── Main content ── */}
      <main className="container mx-auto max-w-2xl space-y-5 p-4 pb-12">
        {/* Step 3 — Obligation identity */}
        <ObligationHeader obligation={obligation} />

        {/* Step 11 — Status & alerts */}
        {(status === "overdue" ||
          status === "due-today" ||
          status === "due-this-week") && (
          <StatusAlert nextDueDate={obligation.nextDueDate} />
        )}

        {/* Step 4 — Summary card */}
        <SummaryCard obligation={obligation} />

        {/* Step 10 — Smart insights */}
        <SmartInsights obligation={obligation} />

        {/* Step 6 — Loan progress (conditional) */}
        {isLoan && <LoanProgressSection obligation={obligation} />}

        {/* Step 9 — Recurrence details */}
        <RecurrenceDetails obligation={obligation} />

        {/* Steps 7 & 8 — Payment history */}
        <PaymentHistory payments={obligation.payments} />

        {/* Danger zone */}
        <DangerZone
          obligationType={obligation.type}
          onDelete={() => setShowDelete(true)}
        />
      </main>

      {/* ── Dialogs ── */}
      <MarkPaidDialog
        obligation={obligation}
        open={showMarkPaid}
        onClose={() => setShowMarkPaid(false)}
      />

      <ObligationDeleteDialog
        obligation={obligation}
        open={showDelete}
        onOpenChange={(open) => setShowDelete(open)}
      />
    </>
  )
}

// ── Step 3: Obligation header (name + badges) ─────────────────────────────────

function ObligationHeader({
  obligation,
}: {
  obligation: ObligationWithPayments
}) {
  return (
    <div className="space-y-1.5 pt-1">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={obligation.type as "BILL" | "LOAN"}>
          {obligation.type.charAt(0) + obligation.type.slice(1).toLowerCase()}
        </Badge>
      </div>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {obligation.name}
        </h1>
        <p className="text-sm">{obligation.category}</p>
      </div>
    </div>
  )
}

// ── Step 11: Status alert ─────────────────────────────────────────────────────

function StatusAlert({ nextDueDate }: { nextDueDate: Date | string }) {
  const status = getObligationStatus(nextDueDate)
  const due = new Date(nextDueDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const dueNormalized = new Date(
    due.getFullYear(),
    due.getMonth(),
    due.getDate()
  )
  const diffDays = Math.abs(
    Math.floor(
      (dueNormalized.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    )
  )

  if (status === "overdue") {
    return (
      <Alert
        variant="destructive"
        className="border-destructive/50 bg-destructive/5"
      >
        <AlertCircleIcon />
        <AlertTitle>Overdue</AlertTitle>
        <AlertDescription>
          This obligation was due{" "}
          {diffDays === 1 ? "yesterday" : `${diffDays} days ago`} on{" "}
          {formatDueDate(nextDueDate)}. Record a payment to bring it up to date.
        </AlertDescription>
      </Alert>
    )
  }

  if (status === "due-today") {
    return (
      <Alert className="border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
        <ClockIcon className="text-amber-600 dark:text-amber-400" />
        <AlertTitle>Due Today</AlertTitle>
        <AlertDescription className="text-amber-800 dark:text-amber-300">
          Payment of {formatPHP(0 as unknown as number)} is due today.
        </AlertDescription>
      </Alert>
    )
  }

  // due-this-week
  return (
    <Alert className="border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-800 dark:bg-blue-950/30 dark:text-blue-200">
      <CalendarIcon className="text-blue-600 dark:text-blue-400" />
      <AlertTitle>Due Soon</AlertTitle>
      <AlertDescription className="text-blue-800 dark:text-blue-300">
        Payment is due in {diffDays} {diffDays === 1 ? "day" : "days"} on{" "}
        {formatDueDate(nextDueDate)}.
      </AlertDescription>
    </Alert>
  )
}

// ── Step 4: Summary card ──────────────────────────────────────────────────────

function SummaryCard({ obligation }: { obligation: ObligationWithPayments }) {
  const isLoan = obligation.type === ObligationType.LOAN
  const dueDaysLabel = getDueDaysLabel(obligation.nextDueDate)
  const status = getObligationStatus(obligation.nextDueDate)

  const [editing, setEditing] = useState(false)

  const dueLabelColor =
    status === "overdue"
      ? "text-destructive font-semibold"
      : status === "due-today"
        ? "text-amber-600 font-semibold dark:text-amber-400"
        : status === "due-this-week"
          ? "text-blue-600 dark:text-blue-400"
          : "text-foreground"

  return (
    <>
      <Card size="sm">
        <CardHeader className="pb-3">
          <CardTitle>{isLoan ? "Loan Summary" : "Bill Summary"}</CardTitle>
          <CardAction>
            <Button
              size="icon-sm"
              variant="ghost"
              onClick={() => setEditing(true)}
            >
              <PencilIcon /> <span className="sr-only">Edit details</span>
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          {isLoan ? (
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
              <SummaryField label="Monthly Payment">
                <span className="font-mono font-semibold">
                  {formatPHP(obligation.amount)}
                  <span className="text-xs font-normal text-muted-foreground">
                    {" "}
                    / {getPerLabel(obligation.recurrence)}
                  </span>
                </span>
              </SummaryField>

              <SummaryField label="Remaining Balance">
                <span className="font-mono text-lg font-bold">
                  {formatPHP(obligation.remainingBalance)}
                </span>
              </SummaryField>

              <SummaryField label="Total Loan Amount">
                <span className="font-mono font-semibold">
                  {formatPHP(obligation.totalAmount)}
                </span>
              </SummaryField>

              <SummaryField label="Amount Paid">
                <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                  {formatPHP(
                    obligation.totalAmount - obligation.remainingBalance
                  )}
                </span>
              </SummaryField>

              {obligation.interestRate != null && (
                <SummaryField label="Interest Rate">
                  <span className="font-semibold">
                    {(obligation.interestRate * 100).toFixed(2)}%
                  </span>
                </SummaryField>
              )}

              <SummaryField label="Next Due">
                <span className={dueLabelColor}>{dueDaysLabel}</span>
                <span className="text-xs text-muted-foreground">
                  {formatDueDate(obligation.nextDueDate)}
                </span>
              </SummaryField>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
              <SummaryField label="Amount">
                <span className="font-mono text-lg font-bold">
                  {formatPHP(obligation.amount)}
                </span>
                <span className="text-xs text-muted-foreground">
                  per {getPerLabel(obligation.recurrence)}
                </span>
              </SummaryField>

              <SummaryField label="Next Due">
                <span className={dueLabelColor}>{dueDaysLabel}</span>
                <span className="text-xs text-muted-foreground">
                  {formatDueDate(obligation.nextDueDate)}
                </span>
              </SummaryField>

              <SummaryField label="Recurrence">
                <span className="font-semibold">
                  {getRecurrenceLabel(obligation.recurrence)}
                </span>
              </SummaryField>
            </div>
          )}
        </CardContent>
      </Card>
      <ObligationEditDialog
        open={editing}
        onOpenChange={(open) => setEditing(open)}
      >
        <ObligationEditForm
          obligation={obligation}
          onAfterSave={() => setEditing(false)}
        />
      </ObligationEditDialog>
    </>
  )
}

function SummaryField({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-0.5">
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="flex flex-col">{children}</div>
    </div>
  )
}

// ── Step 10: Smart insights ───────────────────────────────────────────────────

function SmartInsights({ obligation }: { obligation: ObligationWithPayments }) {
  const insights = buildInsights(obligation)

  return (
    <div className="flex flex-wrap gap-2">
      {insights.map((insight, i) => (
        <InsightPill key={i} insight={insight} />
      ))}
    </div>
  )
}

function InsightPill({ insight }: { insight: ObligationInsight }) {
  const colorMap: Record<ObligationInsight["tone"], string> = {
    neutral: "border-border bg-muted/50 text-muted-foreground",
    positive:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300",
    warning:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-300",
    danger: "border-destructive/30 bg-destructive/5 text-destructive",
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${colorMap[insight.tone]}`}
    >
      {insight.label}
    </span>
  )
}

function buildInsights(
  obligation: ObligationWithPayments
): ObligationInsight[] {
  const insights: ObligationInsight[] = []
  const isLoan = obligation.type === ObligationType.LOAN
  const status = getObligationStatus(obligation.nextDueDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const dueNormalized = new Date(
    new Date(obligation.nextDueDate).getFullYear(),
    new Date(obligation.nextDueDate).getMonth(),
    new Date(obligation.nextDueDate).getDate()
  )
  const diffDays = Math.floor(
    (dueNormalized.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  )

  // Due-date insight
  if (status === "overdue") {
    insights.push({
      label: `Overdue by ${Math.abs(diffDays)} ${Math.abs(diffDays) === 1 ? "day" : "days"}`,
      tone: "danger",
    })
  } else if (status === "due-today") {
    insights.push({ label: "Due today", tone: "warning" })
  } else if (status === "due-this-week") {
    insights.push({
      label: `Due in ${diffDays} ${diffDays === 1 ? "day" : "days"}`,
      tone: "warning",
    })
  } else {
    insights.push({
      label: `Next payment in ${diffDays} days`,
      tone: "neutral",
    })
  }

  // Loan-specific insights
  if (isLoan) {
    const pct = getProgressPercent(
      obligation.remainingBalance,
      obligation.totalAmount
    )
    insights.push({
      label: `${pct.toFixed(0)}% of loan paid off`,
      tone: pct >= 75 ? "positive" : pct >= 40 ? "neutral" : "neutral",
    })

    const payoffMonths = getPayoffMonths(
      obligation.remainingBalance,
      obligation.amount
    )
    if (payoffMonths > 0) {
      insights.push({
        label: `Est. debt-free ${formatPayoffDate(payoffMonths)}`,
        tone: "positive",
      })
    }
  }

  // Recurrence insight
  insights.push({
    label: `Recurs ${getRecurrenceLabel(obligation.recurrence).toLowerCase()}`,
    tone: "neutral",
  })

  // Payment count
  if (obligation.payments.length > 0) {
    insights.push({
      label: `${obligation.payments.length} payment${obligation.payments.length !== 1 ? "s" : ""} recorded`,
      tone: "positive",
    })
  }

  return insights
}

// ── Step 6: Loan progress ─────────────────────────────────────────────────────

function LoanProgressSection({
  obligation,
}: {
  obligation: ObligationWithPayments
}) {
  const amountPaid = obligation.totalAmount - obligation.remainingBalance
  const progressPercent = getProgressPercent(
    obligation.remainingBalance,
    obligation.totalAmount
  )
  const payoffMonths = getPayoffMonths(
    obligation.remainingBalance,
    obligation.amount
  )
  const payoffDate = formatPayoffDate(payoffMonths)

  return (
    <Card size="sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <TrendingUpIcon className="size-4 text-muted-foreground" />
          Loan Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex items-baseline justify-between text-sm">
            <span className="font-semibold">
              {progressPercent.toFixed(1)}% paid off
            </span>
            <span className="font-mono text-muted-foreground">
              {formatPHP(obligation.remainingBalance)} remaining
            </span>
          </div>
          <Progress value={progressPercent} className="h-3" />
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 rounded-lg border bg-muted/30 p-3 text-sm">
          <div className="space-y-0.5 text-center">
            <p className="text-xs text-muted-foreground">Paid</p>
            <p className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
              {formatPHP(amountPaid)}
            </p>
          </div>
          <div className="space-y-0.5 text-center">
            <p className="text-xs text-muted-foreground">Remaining</p>
            <p className="font-mono font-semibold">
              {formatPHP(obligation.remainingBalance)}
            </p>
          </div>
          <div className="space-y-0.5 text-center">
            <p className="text-xs text-muted-foreground">Est. Payoff</p>
            <p className="font-semibold">{payoffDate}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ── Step 9: Recurrence details ────────────────────────────────────────────────

function RecurrenceDetails({
  obligation,
}: {
  obligation: ObligationWithPayments
}) {
  const description = buildRecurrenceDescription(
    obligation.recurrence,
    obligation.dueDay
  )

  return (
    <Card size="sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <CalendarDaysIcon className="size-4 text-muted-foreground" />
          Schedule
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
          <div className="space-y-0.5">
            <p className="text-xs text-muted-foreground">Frequency</p>
            <p className="font-semibold">{description}</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-xs text-muted-foreground">Next Payment</p>
            <p className="font-semibold">
              {formatDueDate(obligation.nextDueDate)}
            </p>
          </div>
          {obligation.dueDay && obligation.recurrence === "MONTHLY" && (
            <div className="space-y-0.5">
              <p className="text-xs text-muted-foreground">Due Day</p>
              <p className="font-semibold">
                {ordinal(obligation.dueDay)} of each month
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function buildRecurrenceDescription(
  recurrence: string,
  dueDay: number | null
): string {
  switch (recurrence) {
    case "DAILY":
      return "Every day"
    case "WEEKLY":
      return "Every week"
    case "MONTHLY":
      return dueDay ? `Every ${ordinal(dueDay)} of the month` : "Every month"
    case "QUARTERLY":
      return "Every 3 months"
    case "ANNUALLY":
      return "Every year"
    default:
      return getRecurrenceLabel(recurrence)
  }
}

function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"]
  const v = n % 100
  return `${n}${s[(v - 20) % 10] ?? s[v] ?? s[0]}`
}

// ── Steps 7 & 8: Payment history ──────────────────────────────────────────────

function PaymentHistory({ payments }: { payments: PaymentRecord[] }) {
  return (
    <Card size="sm">
      <CardHeader className="pb-3">
        <CardTitle> Payment History</CardTitle>
        <CardDescription>
          {payments.length === 0
            ? "No payments recorded yet."
            : `${payments.length} payment${payments.length !== 1 ? "s" : ""} recorded`}
        </CardDescription>
      </CardHeader>

      {payments.length > 0 && (
        <CardContent>
          <ul className="divide-y">
            {payments.map((payment, index) => (
              <PaymentRow
                key={payment.id}
                payment={payment}
                isLatest={index === 0}
              />
            ))}
          </ul>
        </CardContent>
      )}
    </Card>
  )
}

function PaymentRow({
  payment,
  isLatest,
}: {
  payment: PaymentRecord
  isLatest: boolean
}) {
  return (
    <li className="flex items-start justify-between gap-4 py-3 text-sm">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <CalendarIcon className="size-3.5 shrink-0 text-muted-foreground" />
          <span className="font-medium">
            {format(new Date(payment.paidAt), "MMM d, yyyy")}
          </span>
          {isLatest && (
            <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
              Latest
            </span>
          )}
        </div>
        <p className="pl-5 text-xs text-muted-foreground">
          For {format(new Date(payment.forDueDate), "MMM d, yyyy")} due ·{" "}
          {payment.modeOfPayment}
        </p>
        {payment.notes && (
          <p className="pl-5 text-xs text-muted-foreground italic">
            {payment.notes}
          </p>
        )}
      </div>
      <span className="shrink-0 font-mono font-semibold text-emerald-600 dark:text-emerald-400">
        {formatPHP(payment.amount)}
      </span>
    </li>
  )
}

// ── Danger zone ───────────────────────────────────────────────────────────────

function DangerZone({
  obligationType,
  onDelete,
}: {
  obligationType: string
  onDelete: () => void
}) {
  const label = obligationType.charAt(0) + obligationType.slice(1).toLowerCase()

  return (
    <Card size="sm" className="border-destructive/40">
      <CardHeader className="pb-3">
        <CardTitle className="text-destructive">Danger Zone</CardTitle>
        <CardDescription>
          Permanently delete this {label.toLowerCase()}. This action cannot be
          undone.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="destructive" onClick={onDelete}>
          <Trash2Icon className="size-4" />
          Delete {label}
        </Button>
      </CardContent>
    </Card>
  )
}

// ── Step 12: Loading skeleton ─────────────────────────────────────────────────

function ObligationDetailSkeleton() {
  return (
    <>
      <header className="flex items-center gap-4 border-b px-4 py-3">
        <Skeleton className="size-7 rounded-md" />
        <Separator orientation="vertical" />
        <Skeleton className="h-4 w-48 rounded" />
        <div className="ml-auto flex gap-2">
          <Skeleton className="h-8 w-16 rounded-md" />
          <Skeleton className="h-8 w-16 rounded-md" />
        </div>
      </header>

      <main className="container mx-auto max-w-2xl space-y-5 p-4">
        {/* Header */}
        <div className="space-y-2 pt-1">
          <div className="flex gap-2">
            <Skeleton className="h-5 w-12 rounded-full" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
          <Skeleton className="h-8 w-56 rounded" />
        </div>

        {/* Summary card */}
        <Card>
          <CardHeader className="pb-3">
            <Skeleton className="h-4 w-28 rounded" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-1.5">
                  <Skeleton className="h-3 w-20 rounded" />
                  <Skeleton className="h-5 w-28 rounded" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Insights */}
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-6 w-24 rounded-full" />
          ))}
        </div>

        {/* Actions card */}
        <Card>
          <CardHeader className="pb-3">
            <Skeleton className="h-4 w-16 rounded" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-9 w-32 rounded-md" />
          </CardContent>
        </Card>

        {/* Payment history */}
        <Card>
          <CardHeader className="pb-3">
            <Skeleton className="h-4 w-32 rounded" />
            <Skeleton className="h-3 w-24 rounded" />
          </CardHeader>
          <CardContent>
            <div className="divide-y">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex justify-between py-3">
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-28 rounded" />
                    <Skeleton className="h-3 w-40 rounded" />
                  </div>
                  <Skeleton className="h-4 w-20 rounded" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  )
}
