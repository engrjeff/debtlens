import { UserMenu } from "./user-menu"

export function AppHeader() {
  return (
    <header className="flex items-center border-b p-4">
      <div>
        <h1 className="font-semibold">Welcome to DebtLens!</h1>
      </div>
      <div className="ml-auto flex min-h-8 items-center gap-4">
        <UserMenu />
      </div>
    </header>
  )
}
