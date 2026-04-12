import { Link } from "@tanstack/react-router"
import {
  Calendar1Icon,
  HistoryIcon,
  LayoutDashboardIcon,
  PhilippinePesoIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboardIcon },
  { title: "Obligations", url: "/obligations", icon: PhilippinePesoIcon },
  { title: "Schedule", url: "/payment-schedule", icon: Calendar1Icon },
  { title: "History", url: "/payment-history", icon: HistoryIcon },
]

export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-10 flex h-16 items-stretch border-t bg-background lg:hidden">
      {navItems.map(({ title, url, icon: Icon }) => (
        <Link
          key={url}
          to={url}
          className="flex flex-1 flex-col items-center justify-center gap-1 text-muted-foreground transition-colors"
          activeProps={{ className: "text-emerald-500" }}
          activeOptions={{ exact: false }}
        >
          {({ isActive }) => (
            <>
              <Icon
                className={cn(
                  "size-5 transition-transform",
                  isActive && "scale-110 text-emerald-500"
                )}
              />
              <span
                className={cn(
                  "text-[10px] font-medium",
                  isActive && "text-emerald-500"
                )}
              >
                {title}
              </span>
            </>
          )}
        </Link>
      ))}
    </nav>
  )
}
