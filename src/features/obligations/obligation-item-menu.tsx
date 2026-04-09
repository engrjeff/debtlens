import {
  ListIcon,
  MoreHorizontalIcon,
  PencilIcon,
  TrashIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Obligation } from "@/generated/prisma/browser"
import { useState } from "react"
import { ObligationDeleteDialog } from "./obligation-delete-dialog"
import { ObligationEditDialog } from "./obligation-edit-dialog"
import { ObligationEditForm } from "./obligation-edit-form"

type Action = "edit" | "history" | "delete"

export function ObligationItemMenu({ obligation }: { obligation: Obligation }) {
  const [action, setAction] = useState<Action>()

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm" aria-label="menu">
            <MoreHorizontalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setAction("edit")}>
            <PencilIcon />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setAction("history")}>
            <ListIcon />
            History
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setAction("delete")}
          >
            <TrashIcon />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {/* edit */}
      <ObligationEditDialog
        open={action === "edit"}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setAction(undefined)
          }
        }}
      >
        <ObligationEditForm
          obligation={obligation}
          onAfterSave={() => setAction(undefined)}
        />
      </ObligationEditDialog>
      {/* delete */}
      <ObligationDeleteDialog
        obligation={obligation}
        open={action === "delete"}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setAction(undefined)
          }
        }}
      />
    </>
  )
}
