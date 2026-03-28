import { serverEnv } from "@/config/server-env"
import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { tanstackStartCookies } from "better-auth/tanstack-start"
import { prisma } from "../db/prisma"

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  user: {
    additionalFields: {
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
  },
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: [serverEnv.BETTER_AUTH_URL],
  plugins: [tanstackStartCookies()],
})
