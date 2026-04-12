import { cva } from "class-variance-authority"
import { Slot } from "radix-ui"
import * as React from "react"
import type { VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const textVariants = cva("", {
  variants: {
    variant: {
      default: "text-foreground",
      muted: "text-muted-foreground",
      destructive: "text-destructive",
      success: "text-emerald-500",
    },
    size: {
      xxs: "text-[10px]",
      xs: "text-xs",
      sm: "text-sm",
      base: "text-base",
      lg: "text-lg",
      xl: "text-xl",
      "2xl": "text-2xl",
      "3xl": "text-3xl",
    },
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
    leading: {
      none: "leading-none",
      tight: "leading-tight",
      snug: "leading-snug",
      normal: "leading-normal",
      relaxed: "leading-relaxed",
    },
    truncate: {
      true: "truncate",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "sm",
    weight: "normal",
  },
})

type TextElement = "p" | "span" | "div" | "label" | "strong" | "em" | "small"

interface TextProps
  extends
    Omit<React.HTMLAttributes<HTMLElement>, "children">,
    VariantProps<typeof textVariants> {
  as?: TextElement
  asChild?: boolean
  children?: React.ReactNode
}

function Text({
  as: Tag = "p",
  asChild = false,
  className,
  variant,
  size,
  weight,
  leading,
  truncate,
  ...props
}: TextProps) {
  const Comp = asChild ? Slot.Root : Tag

  return (
    <Comp
      data-slot="text"
      className={cn(
        textVariants({ variant, size, weight, leading, truncate }),
        className
      )}
      {...props}
    />
  )
}

export { Text, textVariants }
export type { TextProps }
