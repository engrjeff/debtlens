import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { type ComponentProps, type PropsWithChildren } from "react"

export function ObligationEditDialog({
  children,
  ...dialogProps
}: PropsWithChildren<ComponentProps<typeof Dialog>>) {
  return (
    <Dialog {...dialogProps}>
      <DialogContent onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Edit Obligation</DialogTitle>
          <DialogDescription>Make sure to save your changes.</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  )
}
