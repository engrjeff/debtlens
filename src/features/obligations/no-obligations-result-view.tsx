import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { InboxIcon } from "lucide-react"
import { ObligationCreateDialog } from "./obligation-create-dialog"

export function NoObligationsResultsView() {
  return (
    <div className="p-4">
      <Empty className="border border-dashed">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <InboxIcon />
          </EmptyMedia>
          <EmptyTitle>No obligation found</EmptyTitle>
          <EmptyDescription>
            Try a different filter or search query. You may also create a record
            now.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <ObligationCreateDialog />
        </EmptyContent>
      </Empty>
    </div>
  )
}
