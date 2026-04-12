import { PlusIcon } from "lucide-react"
import { useState } from "react"
import { ObligationForm } from "./obligation-form"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Fab } from "@/components/ui/fab"

function ObligationCreateDialogContent({
  onAfterSave,
}: {
  onAfterSave: () => void
}) {
  return (
    <DialogContent onInteractOutside={(e) => e.preventDefault()}>
      <DialogHeader>
        <DialogTitle>Add Obligation</DialogTitle>
        <DialogDescription>
          Let us record a bill or loan obligation for you.
        </DialogDescription>
      </DialogHeader>
      <ObligationForm onAfterSave={onAfterSave} />
    </DialogContent>
  )
}

export function ObligationCreateDialog() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon /> Add Obligation
        </Button>
      </DialogTrigger>
      <ObligationCreateDialogContent onAfterSave={() => setOpen(false)} />
    </Dialog>
  )
}

export function ObligationCreateFab() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Fab aria-label="Add Obligation" className="bottom-20">
          <PlusIcon />
        </Fab>
      </DialogTrigger>
      <ObligationCreateDialogContent onAfterSave={() => setOpen(false)} />
    </Dialog>
  )
}
