// src/config/env.ts
import { z } from "zod"

const envSchema = z.object({
  DATABASE_URL: z.url(),
  NODE_ENV: z.enum(["development", "production", "test"]),
  BETTER_AUTH_URL: z.url(),
})

// Validate server environment
export const serverEnv = envSchema.parse(process.env)
