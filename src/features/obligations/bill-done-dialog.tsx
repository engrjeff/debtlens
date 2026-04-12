import { CheckCheckIcon } from "lucide-react"
import { useRouter } from "@tanstack/react-router"
import { useServerFn } from "@tanstack/react-start"
import { useState } from "react"
import { toast } from "sonner"
import { markBillAsDone } from "./obligations.functions"
import type { ComponentProps } from "react"
import type { Obligation } from "@/generated/prisma/browser"
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
import { SubmitButton } from "@/components/submit-button"

interface BillDoneDialogProps extends ComponentProps<typeof AlertDialog> {
  obligation: Obligation
}

export function BillDoneDialog({
  obligation,
  ...dialogProps
}: BillDoneDialogProps) {
  const router = useRouter()
  const markDoneAction = useServerFn(markBillAsDone)

  const [pending, setPending] = useState(false)

  const handleDone = async () => {
    try {
      setPending(true)

      const result = await markDoneAction({
        data: { obligationId: obligation.id },
      })

      if (result.id) {
        toast.success(`${result.name} marked as done!`, { richColors: true })
        router.invalidate()
        dialogProps.onOpenChange?.(false)
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
          <AlertDialogMedia className="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400">
            <CheckCheckIcon />
          </AlertDialogMedia>
          <AlertDialogTitle>Mark bill as done?</AlertDialogTitle>
          <AlertDialogDescription>
            <strong>{obligation.name}</strong> will be marked as done and
            removed from your active obligations. This cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending} variant="outline">
            Cancel
          </AlertDialogCancel>
          <SubmitButton loading={pending} onClick={handleDone}>
            Mark as Done
          </SubmitButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
