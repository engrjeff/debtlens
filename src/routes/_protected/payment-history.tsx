import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/payment-history')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_protected/payment-history"!</div>
}
