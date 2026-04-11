import { SignedIn } from "@/components/signed-in"
import { SignedOut } from "@/components/signed-out"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { siteConfig } from "@/config/site"
import { Link, createFileRoute } from "@tanstack/react-router"
import {
  AlertTriangle,
  ArrowRight,
  Bell,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  TrendingDown,
  Wallet,
} from "lucide-react"

export const Route = createFileRoute("/_site/")({ component: LandingPage })

// ─── Mock UI Preview ──────────────────────────────────────────────────────────

function DashboardPreview() {
  return (
    <div className="w-full overflow-hidden rounded-xl border bg-card text-xs shadow-lg select-none">
      {/* Topbar */}
      <div className="flex items-center gap-2 border-b bg-muted/40 px-4 py-3">
        <div className="size-2.5 rounded-full bg-red-400" />
        <div className="size-2.5 rounded-full bg-amber-400" />
        <div className="size-2.5 rounded-full bg-green-400" />
        <span className="ml-2 font-medium text-muted-foreground">DebtLens</span>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3 p-4">
        {[
          {
            label: "Due This Month",
            value: "₱12,400",
            icon: Wallet,
            color: "text-blue-500",
          },
          {
            label: "Due in 7 Days",
            value: "₱3,200",
            icon: CalendarDays,
            color: "text-amber-500",
          },
          {
            label: "Overdue",
            value: "None",
            icon: AlertTriangle,
            color: "text-emerald-500",
          },
          {
            label: "Remaining Debt",
            value: "₱184,000",
            icon: CreditCard,
            color: "text-violet-500",
          },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-lg border bg-card p-3">
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-muted-foreground">{label}</span>
              <Icon className={`size-3.5 ${color}`} />
            </div>
            <p className="font-mono text-sm font-bold">{value}</p>
          </div>
        ))}
      </div>

      {/* Upcoming bills */}
      <div className="border-t px-4 pb-4">
        <p className="py-2 font-medium text-muted-foreground">Upcoming</p>
        <div className="space-y-2">
          {[
            {
              name: "Home Loan",
              due: "Apr 15",
              amount: "₱8,500",
              status: "upcoming",
            },
            {
              name: "Meralco",
              due: "Apr 17",
              amount: "₱1,200",
              status: "upcoming",
            },
            {
              name: "Credit Card",
              due: "Apr 10",
              amount: "₱3,800",
              status: "overdue",
            },
          ].map(({ name, due, amount, status }) => (
            <div
              key={name}
              className="flex items-center justify-between rounded-md border px-3 py-2"
            >
              <div>
                <p className="font-medium">{name}</p>
                <p className="text-muted-foreground">{due}</p>
              </div>
              <div className="text-right">
                <p
                  className={`font-mono font-semibold ${status === "overdue" ? "text-destructive" : ""}`}
                >
                  {amount}
                </p>
                {status === "overdue" && (
                  <span className="text-destructive">Overdue</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Sections ─────────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section className="px-6 pt-20 pb-16 md:pt-28 md:pb-20">
      <div className="mx-auto max-w-5xl">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div className="space-y-6">
            <Badge variant="secondary" className="gap-1.5">
              <CheckCircle2 className="size-3.5 text-primary" />
              Free to use
            </Badge>

            <h1 className="text-4xl leading-tight font-bold tracking-tight md:text-5xl">
              Know exactly what you owe,{" "}
              <span className="text-emerald-500">and when.</span>
            </h1>

            <p className="text-lg leading-relaxed text-muted-foreground">
              DebtLens tracks your bills and loans in one place so nothing slips
              through the cracks. No spreadsheets. No surprises.
            </p>

            <div className="flex flex-wrap gap-3">
              <SignedOut>
                <Button size="lg" asChild>
                  <Link to="/sign-up">
                    Get started free
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="ghost" asChild>
                  <Link to="/sign-in">Log in</Link>
                </Button>
              </SignedOut>
              <SignedIn>
                <Button size="lg" asChild>
                  <Link to="/dashboard">
                    Go to Dashboard
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </SignedIn>
            </div>
          </div>

          <div className="md:block">
            <DashboardPreview />
          </div>
        </div>
      </div>
    </section>
  )
}

function ProblemSolutionSection() {
  return (
    <section className="border-y bg-muted/30 px-6 py-16 md:py-20">
      <div className="mx-auto max-w-3xl space-y-10 text-center">
        <div className="space-y-3">
          <p className="text-sm font-medium tracking-widest text-muted-foreground uppercase">
            The problem
          </p>
          <h2 className="text-2xl font-bold md:text-3xl">
            Financial obligations are scattered everywhere.
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            Loan statements in email. Bills in a drawer. Due dates in your head.
            It&apos;s easy to miss a payment and harder to see the full picture.
          </p>
        </div>

        <div className="flex items-center justify-center gap-4">
          <div className="h-px flex-1 bg-border" />
          <div className="rounded-full border bg-background px-4 py-1.5 text-sm text-muted-foreground">
            DebtLens fixes this
          </div>
          <div className="h-px flex-1 bg-border" />
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium tracking-widest text-muted-foreground uppercase">
            The solution
          </p>
          <h2 className="text-2xl font-bold md:text-3xl">
            One view for all your financial obligations.
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            Add your bills and loans once. DebtLens keeps track of balances, due
            dates, and payment history — so you always know where you stand.
          </p>
        </div>
      </div>
    </section>
  )
}

const FEATURES = [
  {
    icon: CalendarDays,
    color: "text-blue-500",
    bg: "bg-blue-50 dark:bg-blue-950/40",
    title: "Due date tracking",
    description:
      "See everything due this month, this week, or overdue — at a glance. Never miss a payment again.",
  },
  {
    icon: TrendingDown,
    color: "text-primary",
    bg: "bg-primary/10",
    title: "Loan payoff progress",
    description:
      "Watch your loan balances decrease over time. Visualize your path to being debt-free.",
  },
  {
    icon: Bell,
    color: "text-amber-500",
    bg: "bg-amber-50 dark:bg-amber-950/40",
    title: "Payment history",
    description:
      "Log payments as you make them. Keep a clean record of what was paid and when.",
  },
]

function FeaturesSection() {
  return (
    <section className="px-6 py-16 md:py-20">
      <div className="mx-auto max-w-5xl space-y-12">
        <div className="space-y-2 text-center">
          <p className="text-sm font-medium tracking-widest text-muted-foreground uppercase">
            Features
          </p>
          <h2 className="text-2xl font-bold md:text-3xl">
            Everything you need. Nothing you don&apos;t.
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {FEATURES.map(({ icon: Icon, color, bg, title, description }) => (
            <Card key={title} className="border shadow-none">
              <CardHeader className="pb-3">
                <div className={`w-fit rounded-lg p-2.5 ${bg}`}>
                  <Icon className={`size-5 ${color}`} />
                </div>
                <CardTitle className="mt-3 text-base">{title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

const STEPS = [
  {
    step: "1",
    title: "Add your bills and loans",
    description:
      "Enter your obligations once — name, amount, due date, and type.",
  },
  {
    step: "2",
    title: "Track what's due",
    description:
      "Your dashboard shows exactly what's coming up and what's overdue.",
  },
  {
    step: "3",
    title: "Log payments",
    description:
      "Mark payments as done. Your balance and history update automatically.",
  },
]

function HowItWorksSection() {
  return (
    <section className="border-y bg-muted/30 px-6 py-16 md:py-20">
      <div className="mx-auto max-w-3xl space-y-12">
        <div className="space-y-2 text-center">
          <p className="text-sm font-medium tracking-widest text-muted-foreground uppercase">
            How it works
          </p>
          <h2 className="text-2xl font-bold md:text-3xl">
            Up and running in minutes.
          </h2>
        </div>

        <div className="space-y-0">
          {STEPS.map(({ step, title, description }, i) => (
            <div key={step} className="flex gap-5">
              <div className="flex flex-col items-center">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-background text-sm font-bold text-primary">
                  {step}
                </div>
                {i < STEPS.length - 1 && (
                  <div className="mt-1 min-h-8 w-px flex-1 bg-border" />
                )}
              </div>
              <div className="space-y-1 pt-1 pb-8">
                <p className="font-semibold">{title}</p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CtaSection() {
  return (
    <section className="px-6 py-20 md:py-28">
      <div className="mx-auto max-w-xl space-y-6 text-center">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
          Start tracking your obligations today.
        </h2>
        <p className="leading-relaxed text-muted-foreground">
          It takes two minutes to set up. No credit card required.
        </p>
        <Button size="lg" asChild>
          <Link to="/sign-up">
            Create a free account
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </section>
  )
}

// ─── Nav ──────────────────────────────────────────────────────────────────────

function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
        <span className="text-base font-bold tracking-tight">DebtLens</span>
        <div className="flex items-center gap-2">
          <SignedOut>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/sign-in">Log in</Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/sign-up">Sign up</Link>
            </Button>
          </SignedOut>
          <SignedIn>
            <Button size="sm" asChild>
              <Link to="/dashboard">Dashboard</Link>
            </Button>
          </SignedIn>
        </div>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="border-t px-6 py-6 text-center text-sm text-muted-foreground">
      &copy; {new Date().getFullYear()} {siteConfig.title}. Built for clarity.
    </footer>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function LandingPage() {
  return (
    <div className="flex min-h-svh flex-col">
      <Nav />
      <main className="flex-1">
        <HeroSection />
        <ProblemSolutionSection />
        <FeaturesSection />
        <HowItWorksSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  )
}
