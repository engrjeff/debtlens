import { LayoutDashboard } from "lucide-react"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { ObligationCreateDialog } from "@/features/obligations/obligation-create-dialog"

export function DashboardEmpty() {
  return (
    <Empty className="border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <LayoutDashboard />
        </EmptyMedia>
        <EmptyTitle>Nothing to show yet</EmptyTitle>
        <EmptyDescription>
          Add your first bill or loan to start seeing insights, due dates, and
          your debt progress here.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <ObligationCreateDialog />
      </EmptyContent>
    </Empty>
  )
}
