import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { fetchObligationById } from "@/features/obligations/obligations.functions"
import { createFileRoute, Link } from "@tanstack/react-router"

export const Route = createFileRoute("/_protected/obligations/$id")({
  component: RouteComponent,
  loader: async ({ params }) => {
    return fetchObligationById({ data: { id: params.id } })
  },
  head(ctx) {
    return {
      meta: [
        {
          title: `Obligations > ${ctx.loaderData?.name} | DebtLens`,
        },
      ],
    }
  },
})

function RouteComponent() {
  const obligation = Route.useLoaderData()

  return (
    <>
      <header className="flex items-center gap-4 border-b px-4 py-3">
        <SidebarTrigger />
        <Separator orientation="vertical" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/obligations">Obligations</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{obligation.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <main className="container mx-auto space-y-4 p-4">{/* content */}</main>
    </>
  )
}
