import { Trash2Icon } from "lucide-react"

import { SubmitButton } from "@/components/submit-button"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { Obligation } from "@/generated/prisma/browser"
import { useRouter } from "@tanstack/react-router"
import { useServerFn } from "@tanstack/react-start"
import { useState, type ComponentProps } from "react"
import { toast } from "sonner"
import { removeObligation } from "./obligations.functions"

interface ObligationDeleteDialogProps extends ComponentProps<
  typeof AlertDialog
> {
  obligation: Obligation
}

export function ObligationDeleteDialog({
  obligation,
  ...dialogProps
}: ObligationDeleteDialogProps) {
  const router = useRouter()
  const removeObligationAction = useServerFn(removeObligation)

  const [pending, setPending] = useState(false)

  const handleDelete = async () => {
    try {
      setPending(true)

      const result = await removeObligationAction({
        data: { obligationId: obligation.id },
      })

      if (result.id) {
        toast.success(`${result.name} is successfully deleted!`, {
          richColors: true,
        })
        router.invalidate()
        dialogProps?.onOpenChange?.(false)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setPending(false)
    }
  }

  return (
    <AlertDialog {...dialogProps}>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>
            Delete {obligation.type.toLowerCase()}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete {obligation.name}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending} variant="outline">
            Cancel
          </AlertDialogCancel>
          <SubmitButton
            variant="destructive"
            loading={pending}
            onClick={handleDelete}
          >
            Delete
          </SubmitButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
