import type React from "react"
import { DashboardLayoutClient } from "@/components/dashboard-layout-client"
import { SidebarProvider } from "@/hooks/use-sidebar-state"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <DashboardLayoutClient>{children}</DashboardLayoutClient>
    </SidebarProvider>
  )
}
