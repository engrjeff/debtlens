import { Link, createFileRoute } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"

export const Route = createFileRoute("/_site/")({ component: App })

function App() {
  return (
    <div className="flex min-h-svh p-6">
      <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
        <div>
          <h1 className="font-medium">Welcome to DebtLens</h1>
          <p>Consolidate, monitor, and track your balances in one place.</p>
          <div className="flex items-center gap-4">
            <Button asChild>
              <Link to="/sign-in">Log In</Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link to="/sign-up">Sign Up</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
