import { authClient } from "@/lib/auth-client"
import type { ReactNode } from "react"

export function SignedIn({ children }: { children: ReactNode }) {
  const session = authClient.useSession()

  if (session.isPending) return null

  if (!session.data?.user) return null

  return <>{children}</>
}
