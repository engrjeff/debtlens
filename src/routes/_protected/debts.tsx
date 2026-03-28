import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/debts')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_protected/debts"!</div>
}
