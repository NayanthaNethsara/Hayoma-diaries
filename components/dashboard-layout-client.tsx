"use client"

import type React from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { useSidebarState } from "@/hooks/use-sidebar-state"

export function DashboardLayoutClient({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebarState()

  return (
    <div className="flex min-h-screen dashboard-layout">
      <DashboardSidebar />
      <div
        className={`flex-1 p-8 pt-6 overflow-auto transition-all duration-300 ${
          isCollapsed ? "ml-[80px]" : "ml-[280px]"
        }`}
      >
        {children}
      </div>
    </div>
  )
}
