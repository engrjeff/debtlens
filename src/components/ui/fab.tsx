import type { VariantProps } from "class-variance-authority"
import { cva } from "class-variance-authority"
import { Slot } from "radix-ui"
import * as React from "react"

import { cn } from "@/lib/utils"

const fabVariants = cva(
  "fixed z-50 inline-flex shrink-0 items-center justify-center rounded-full font-medium shadow-lg transition-all outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/50 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90",
        destructive: "bg-destructive text-white hover:bg-destructive/90",
      },
      size: {
        default: "size-14 [&_svg:not([class*='size-'])]:size-6",
        sm: "size-10 [&_svg:not([class*='size-'])]:size-4",
        lg: "size-16 [&_svg:not([class*='size-'])]:size-7",
        extended: "h-14 gap-2 px-5 [&_svg:not([class*='size-'])]:size-5",
      },
      position: {
        "bottom-right": "bottom-6 right-6",
        "bottom-left": "bottom-6 left-6",
        "bottom-center": "bottom-6 left-1/2 -translate-x-1/2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      position: "bottom-right",
    },
  }
)

interface FabProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof fabVariants> {
  asChild?: boolean
}

function Fab({
  className,
  variant,
  size,
  position,
  asChild = false,
  ...props
}: FabProps) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="fab"
      className={cn(fabVariants({ variant, size, position }), className)}
      {...props}
    />
  )
}

export { Fab, fabVariants }
export type { FabProps }
