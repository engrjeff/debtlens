import { NumberInput } from "@/components/number-input"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import type { Obligation } from "@/generated/prisma/browser"
import { useRouter } from "@tanstack/react-router"
import { useServerFn } from "@tanstack/react-start"
import { useState } from "react"
import { toast } from "sonner"
import { markAsPaid } from "./obligations.functions"

interface MarkPaidDialogProps {
  obligation: Obligation
  open: boolean
  onClose: () => void
}

export function MarkPaidDialog({
  obligation,
  open,
  onClose,
}: MarkPaidDialogProps) {
  const router = useRouter()
  const markAsPaidFn = useServerFn(markAsPaid)
  const [amount, setAmount] = useState(obligation.amount)
  const [isPending, setIsPending] = useState(false)

  async function handleConfirm() {
    if (isPending) return
    setIsPending(true)
    try {
      await markAsPaidFn({
        data: { obligationId: obligation.id, amount },
      })
      toast.success("Payment recorded", { richColors: true })
      router.invalidate()
      onClose()
    } catch {
      toast.error("Failed to record payment. Please try again.")
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen && !isPending) onClose()
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Mark as Paid</DialogTitle>
          <DialogDescription>
            Record a payment for <strong>{obligation.name}</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-2">
          <Label htmlFor="payment-amount">Payment Amount</Label>
          <NumberInput
            id="payment-amount"
            usePeso
            value={amount}
            min={0.01}
            step={0.01}
            onChange={(e) => setAmount(Number(e.target.value))}
            disabled={isPending}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={isPending || amount <= 0}>
            {isPending ? "Saving…" : "Confirm Payment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
