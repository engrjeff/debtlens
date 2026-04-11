import * as React from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { siteConfig } from "@/config/site"
import { Link } from "@tanstack/react-router"
import {
  Calendar1Icon,
  HistoryIcon,
  LayoutDashboardIcon,
  PhilippinePesoIcon,
} from "lucide-react"
import { UserMenu } from "./user-menu"

const sidebar = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Obligations",
      url: "/obligations",
      icon: PhilippinePesoIcon,
    },
    {
      title: "Payment Schedule",
      url: "/payment-schedule",
      icon: Calendar1Icon,
    },
    {
      title: "Payment History",
      url: "/payment-history",
      icon: HistoryIcon,
    },
  ],
}

function NavMain() {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarGroupLabel>Menu</SidebarGroupLabel>
        <SidebarMenu className="space-y-1">
          {sidebar.navMain.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                className="data-[status=active]:bg-primary data-[status=active]:text-primary-foreground data-[status=active]:hover:bg-primary/90"
              >
                <Link to={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="p-4">
        <Link to="/dashboard" className="flex items-center gap-4">
          <img
            src="/logo.svg"
            width={36}
            height={36}
            className="object-contain"
          />
          <div className="flex flex-col">
            <span className="text-base font-semibold">{siteConfig.title}</span>
            <span className="text-xs text-muted-foreground">
              Track your obligations
            </span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
      </SidebarContent>
      <SidebarFooter>
        <UserMenu />
      </SidebarFooter>
    </Sidebar>
  )
}
