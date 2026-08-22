import { TagIcon } from "lucide-react"
import * as React from "react"
import { Badge } from "@/components/ui/badge"

function Tag({
  className,
  children,
  ...props
}: Omit<React.ComponentProps<typeof Badge>, "variant">) {
  return (
    <Badge variant="TAG" className={className} {...props}>
      <TagIcon />
      {children}
    </Badge>
  )
}

export { Tag }
