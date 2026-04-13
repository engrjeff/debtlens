import {
  MoreHorizontalIcon,
  PencilIcon,
  TrashIcon,
  ViewIcon,
} from "lucide-react"

import { useNavigate } from "@tanstack/react-router"
import { useState } from "react"
import { ObligationDeleteDialog } from "./obligation-delete-dialog"
import { ObligationEditDialog } from "./obligation-edit-dialog"
import { ObligationEditForm } from "./obligation-edit-form"
import type { Obligation } from "@/generated/prisma/browser"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

type Action = "edit" | "view" | "delete"

export function ObligationItemMenu({ obligation }: { obligation: Obligation }) {
  const [action, setAction] = useState<Action>()
  const navigate = useNavigate()

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm" aria-label="menu">
            <MoreHorizontalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {obligation.isDone ? null : (
            <DropdownMenuItem onClick={() => setAction("edit")}>
              <PencilIcon />
              Edit
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            onClick={() => {
              setAction("view")
              navigate({
                to: "/obligations/$id",
                params: { id: obligation.id },
              })
            }}
          >
            <ViewIcon />
            View
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
