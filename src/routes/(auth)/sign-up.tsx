import { zodResolver } from "@hookform/resolvers/zod"
import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { PasswordInput } from "@/components/password-input"
import { SubmitButton } from "@/components/submit-button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"
import { getSession } from "@/lib/auth.functions"

const schema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.email("Enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type FormData = z.infer<typeof schema>

export const Route = createFileRoute("/(auth)/sign-up")({
  beforeLoad: async () => {
    const session = await getSession()
    if (session) {
      throw redirect({ to: "/dashboard" })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema as any),
  })

  const onSubmit = async (data: FormData) => {
    setServerError(null)

    const { error } = await authClient.signUp.email({
      email: data.email,
      password: data.password,
      name: `${data.firstName} ${data.lastName}`,
      firstName: data.firstName,
      lastName: data.lastName,
      role: "user",
    })

    if (error) {
      setServerError(error.message ?? "Could not create account. Please try again.")
      return
    }

    await navigate({ to: "/dashboard" })
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create an account</CardTitle>
          <CardDescription>Start tracking your debt with DebtLens</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <FieldGroup>
              {serverError && (
                <Alert variant="destructive">
                  <AlertDescription>{serverError}</AlertDescription>
                </Alert>
              )}

              <div className="flex gap-3">
                <Field data-invalid={!!errors.firstName || undefined} className="flex-1">
                  <FieldLabel htmlFor="firstName">First name</FieldLabel>
                  <Input
                    id="firstName"
                    placeholder="Jane"
                    autoComplete="given-name"
                    aria-invalid={!!errors.firstName || undefined}
                    {...register("firstName")}
                  />
                  {errors.firstName && <FieldError>{errors.firstName.message}</FieldError>}
                </Field>

                <Field data-invalid={!!errors.lastName || undefined} className="flex-1">
                  <FieldLabel htmlFor="lastName">Last name</FieldLabel>
                  <Input
                    id="lastName"
                    placeholder="Doe"
                    autoComplete="family-name"
                    aria-invalid={!!errors.lastName || undefined}
                    {...register("lastName")}
                  />
                  {errors.lastName && <FieldError>{errors.lastName.message}</FieldError>}
                </Field>
              </div>

              <Field data-invalid={!!errors.email || undefined}>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  aria-invalid={!!errors.email || undefined}
                  {...register("email")}
                />
                {errors.email && <FieldError>{errors.email.message}</FieldError>}
              </Field>

              <Field data-invalid={!!errors.password || undefined}>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <PasswordInput
                  id="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  aria-invalid={!!errors.password || undefined}
                  {...register("password")}
                />
                {errors.password && <FieldError>{errors.password.message}</FieldError>}
              </Field>

              <Field data-invalid={!!errors.confirmPassword || undefined}>
                <FieldLabel htmlFor="confirmPassword">Confirm password</FieldLabel>
                <PasswordInput
                  id="confirmPassword"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  aria-invalid={!!errors.confirmPassword || undefined}
                  {...register("confirmPassword")}
                />
                {errors.confirmPassword && <FieldError>{errors.confirmPassword.message}</FieldError>}
              </Field>

              <SubmitButton loading={isSubmitting} className="w-full" size="lg">
                {isSubmitting ? "Creating account…" : "Create account"}
              </SubmitButton>
            </FieldGroup>
          </form>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/sign-in"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
