import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/payment-schedule')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_protected/paymeny-schedule"!</div>
}
