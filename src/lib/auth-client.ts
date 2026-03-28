import { clientEnv } from "@/config/client-env"
import { inferAdditionalFields } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
  baseURL: clientEnv.VITE_APP_URL,
  plugins: [
    inferAdditionalFields({
      user: {
        firstName: {
          type: "string",
        },
        lastName: {
          type: "string",
        },
        role: {
          type: "string",
        },
      },
    }),
  ],
})
