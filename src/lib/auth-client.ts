import { serverEnv } from "@/config/server-env"
import { inferAdditionalFields } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
  baseURL: serverEnv.APP_URL,
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
