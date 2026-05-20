import { authClient } from "@/lib/auth-client"
import type { ReactNode } from "react"

export function SignedOut({ children }: { children: ReactNode }) {
  const session = authClient.useSession()

  if (session.isPending && !session.error) return null

  if (!session.error && session.data?.user) return null

  return <>{children}</>
}
