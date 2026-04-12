import type {ReactNode} from "react";
import { authClient } from "@/lib/auth-client"

export function SignedIn({ children }: { children: ReactNode }) {
  const session = authClient.useSession()

  if (!session.data?.user) return null

  return <>{children}</>
}
