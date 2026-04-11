import { InboxIcon } from "lucide-react"
import { ObligationCreateDialog } from "./obligation-create-dialog"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export function EmptyObligationsView() {
  return (
    <div className="h-full">
      <Empty className="border border-dashed">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <InboxIcon />
          </EmptyMedia>
          <EmptyTitle>No obligation records yet</EmptyTitle>
          <EmptyDescription>
            Start tracking by adding a bill or a loan now.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <ObligationCreateDialog />
        </EmptyContent>
      </Empty>
    </div>
  )
}
