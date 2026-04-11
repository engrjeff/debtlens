import { siteConfig } from "@/config/site"
import { Link } from "@tanstack/react-router"
import { SidebarTrigger } from "./ui/sidebar"

export function AppHeader() {
  return (
    <div className="flex h-16 items-center justify-between border-b bg-background p-4 lg:hidden">
      <Link to="/dashboard" className="flex items-center gap-3">
        <img
          src="/logo.svg"
          width={30}
          height={30}
          className="object-contain"
        />
        <span className="text-base font-semibold">{siteConfig.title}</span>
      </Link>
      <SidebarTrigger />
    </div>
  )
}
