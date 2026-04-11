import { PlusIcon } from "lucide-react"
import { useState } from "react"
import { ObligationForm } from "./obligation-form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export function ObligationCreateDialog() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon /> Add Obligation
        </Button>
      </DialogTrigger>
      <DialogContent onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Add Obligation</DialogTitle>
          <DialogDescription>
            Let us record a bill or loan obligation for you.
          </DialogDescription>
        </DialogHeader>
        <ObligationForm onAfterSave={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
