import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ObligationType, type Obligation } from "@/generated/prisma/browser"

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

// import { Skeleton } from "@/components/ui/skeleton"
// import { AlertTriangle, CalendarClock, CalendarDays, Inbox } from "lucide-react"
// import { BillCard } from "./bill-card"
// import { groupObligations } from "./helpers"
// import type { Obligation } from "./helpers"
// import { LoanCard } from "./loan-card"

// interface ObligationsListProps {
//   obligations: Obligation[]
//   onMarkPaid?: (id: string) => void
//   onEdit?: (id: string) => void
// }

// interface GroupSectionProps {
//   title: string
//   icon: React.ReactNode
//   obligations: Obligation[]
//   onMarkPaid?: (id: string) => void
//   onEdit?: (id: string) => void
//   titleClassName?: string
// }

// function GroupSection({
//   title,
//   icon,
//   obligations,
//   onMarkPaid,
//   onEdit,
//   titleClassName,
// }: GroupSectionProps) {
//   if (obligations.length === 0) return null

//   return (
//     <div className="space-y-2">
//       <div className="flex items-center gap-2">
//         {icon}
//         <h3 className={`text-sm font-semibold ${titleClassName ?? "text-foreground"}`}>{title}</h3>
//         <span className="text-xs text-muted-foreground">({obligations.length})</span>
//       </div>
//       <div className="space-y-2">
//         {obligations.map((o) =>
//           o.type === "BILL" ? (
//             <BillCard key={o.id} obligation={o} onMarkPaid={onMarkPaid} onEdit={onEdit} />
//           ) : (
//             <LoanCard key={o.id} obligation={o} onMarkPaid={onMarkPaid} onEdit={onEdit} />
//           ),
//         )}
//       </div>
//     </div>
//   )
// }

// export function ObligationsList({ obligations, onMarkPaid, onEdit }: ObligationsListProps) {
//   const { overdue, dueThisWeek, upcoming } = groupObligations(obligations)
//   const isEmpty = obligations.length === 0

//   if (isEmpty) {
//     return (
//       <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
//         <Inbox className="size-12 mb-3 opacity-30" />
//         <p className="font-medium">No obligations found</p>
//         <p className="text-sm mt-1">Try adjusting your filters or add a new obligation.</p>
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-6">
//       <GroupSection
//         title="Overdue"
//         icon={<AlertTriangle className="size-4 text-destructive" />}
//         obligations={overdue}
//         onMarkPaid={onMarkPaid}
//         onEdit={onEdit}
//         titleClassName="text-destructive"
//       />
//       <GroupSection
//         title="Due This Week"
//         icon={<CalendarClock className="size-4 text-amber-600 dark:text-amber-400" />}
//         obligations={dueThisWeek}
//         onMarkPaid={onMarkPaid}
//         onEdit={onEdit}
//         titleClassName="text-amber-600 dark:text-amber-400"
//       />
//       <GroupSection
//         title="Upcoming"
//         icon={<CalendarDays className="size-4 text-muted-foreground" />}
//         obligations={upcoming}
//         onMarkPaid={onMarkPaid}
//         onEdit={onEdit}
//       />
//     </div>
//   )
// }

// export function ObligationsListSkeleton() {
//   return (
//     <div className="space-y-6">
//       {["Overdue", "Due This Week", "Upcoming"].map((group) => (
//         <div key={group} className="space-y-2">
//           <Skeleton className="h-4 w-28" />
//           {Array.from({ length: 2 }).map((_, i) => (
//             <div key={i} className="rounded-xl border p-4 space-y-3">
//               <div className="flex items-start justify-between">
//                 <div className="space-y-2">
//                   <Skeleton className="h-4 w-40" />
//                   <Skeleton className="h-3 w-20" />
//                 </div>
//                 <Skeleton className="h-7 w-24" />
//               </div>
//               <Skeleton className="h-3 w-36" />
//             </div>
//           ))}
//         </div>
//       ))}
//     </div>
//   )
// }
