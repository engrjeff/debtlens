import { TanStackDevtools } from "@tanstack/react-devtools"
import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRoute,
  useRouterState,
} from "@tanstack/react-router"
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools"

import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import appCss from "../styles.css?url"

function RootComponent() {
  const isLoading = useRouterState({ select: (s) => s.isLoading })

  return (
    <>
      <Outlet />
      {isLoading && (
        <div className="fixed inset-0 z-50 animate-pulse bg-background/20 backdrop-blur-[1px]" />
      )}
    </>
  )
}

function NotFoundPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 text-center">
      <p className="text-6xl font-bold tracking-tight text-muted-foreground/30">404</p>
      <div className="space-y-1">
        <h1 className="text-xl font-semibold">Page not found</h1>
        <p className="text-sm text-muted-foreground">
          The page you are looking for does not exist or has been removed.
        </p>
      </div>
      <Link to="/dashboard" className="text-sm underline underline-offset-4">
        Go to dashboard
      </Link>
    </div>
  )
}

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFoundPage,
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Debt Lens",
      },
      {
        property: "og:title",
        content: "DebtLens",
      },
      {
        property: "og:image",
        content:
          "https://res.cloudinary.com/abide-in-the-vine/image/upload/v1776075693/debtlens/debtlens-banner_tjyoeq.png",
      },
      {
        property: "og:image:height",
        content: "630",
      },
      {
        property: "og:image:width",
        content: "1200",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "icon",
        type: "image/png",
        href: "/favicon-96x96.png",
        sizes: "96x96",
      },
      {
        rel: "icon",
        type: "image/svg+xml",
        href: "/logo.svg",
      },
      {
        rel: "shortcut icon",
        href: "/favicon.ico",
      },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png",
      },
      {
        rel: "manifest",
        href: "/site.webmanifest",
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark antialiased">
      <head>
        <HeadContent />
      </head>
      <body>
        <TooltipProvider>{children}</TooltipProvider>
        <Toaster />
        <TanStackDevtools
          config={{
            position: "bottom-left",
          }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
