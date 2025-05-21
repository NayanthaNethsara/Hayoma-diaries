"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/auth-context";
import { useSidebarState } from "@/hooks/use-sidebar-state";
import { Logo } from "@/components/logo";
import {
  BarChart3,
  Box,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Settings,
  ShoppingCart,
  Truck,
  Users,
  Warehouse,
  CalendarClock,
  Bell,
  FileText,
  History,
} from "lucide-react";

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  role: string[];
}

export function DashboardSidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const sidebarState = useSidebarState();
  const isCollapsed = sidebarState.isCollapsed ?? false;
  // Removed toggle assignment as 'toggle' does not exist on SidebarContextType
  const [isSheetCollapsed, setIsSheetCollapsed] = useState(false);

  // Check if mobile on mount
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const role = user?.role?.toLowerCase() || "";

  const navItems: NavItem[] = [
    {
      title: "Dashboard",
      href: `/dashboard/${role}`,
      icon: <LayoutDashboard className="h-5 w-5" />,
      role: ["admin", "shop", "supplier", "driver"],
    },
    // Admin specific links
    {
      title: "Analytics",
      href: "/dashboard/admin/analytics",
      icon: <BarChart3 className="h-5 w-5" />,
      role: ["admin"],
    },
    {
      title: "Products",
      href: "/dashboard/admin/products",
      icon: <Package className="h-5 w-5" />,
      role: ["admin"],
    },
    {
      title: "Inventory",
      href: "/dashboard/admin/inventory",
      icon: <Box className="h-5 w-5" />,
      role: ["admin"],
    },
    {
      title: "Orders",
      href: "/dashboard/admin/orders",
      icon: <ClipboardList className="h-5 w-5" />,
      role: ["admin"],
    },
    {
      title: "Users",
      href: "/dashboard/admin/users",
      icon: <Users className="h-5 w-5" />,
      role: ["admin"],
    },
    {
      title: "Shops",
      href: "/dashboard/admin/shops",
      icon: <ShoppingCart className="h-5 w-5" />,
      role: ["admin"],
    },
    {
      title: "Suppliers",
      href: "/dashboard/admin/suppliers",
      icon: <Warehouse className="h-5 w-5" />,
      role: ["admin"],
    },
    {
      title: "Drivers",
      href: "/dashboard/admin/drivers",
      icon: <Truck className="h-5 w-5" />,
      role: ["admin"],
    },
    {
      title: "Deliveries",
      href: "/dashboard/admin/deliveries",
      icon: <Truck className="h-5 w-5" />,
      role: ["admin"],
    },
    {
      title: "Requests",
      href: "/dashboard/admin/requests",
      icon: <FileText className="h-5 w-5" />,
      role: ["admin"],
    },
    {
      title: "Request Supplies",
      href: "/dashboard/admin/request-supplies",
      icon: <Bell className="h-5 w-5" />,
      role: ["admin"],
    },

    // Shop specific links
    {
      title: "Inventory",
      href: "/dashboard/shop/inventory",
      icon: <Box className="h-5 w-5" />,
      role: ["shop"],
    },
    {
      title: "Orders",
      href: "/dashboard/shop/orders",
      icon: <ClipboardList className="h-5 w-5" />,
      role: ["shop"],
    },
    {
      title: "Deliveries",
      href: "/dashboard/shop/deliveries",
      icon: <Truck className="h-5 w-5" />,
      role: ["shop"],
    },

    // Supplier specific links
    {
      title: "Material Requests",
      href: "/dashboard/supplier/material-requests",
      icon: <ClipboardList className="h-5 w-5" />,
      role: ["supplier"],
    },
    {
      title: "Deliveries",
      href: "/dashboard/supplier/deliveries",
      icon: <Truck className="h-5 w-5" />,
      role: ["supplier"],
    },
    {
      title: "History",
      href: "/dashboard/supplier/history",
      icon: <History className="h-5 w-5" />,
      role: ["supplier"],
    },

    // Driver specific links
    {
      title: "Deliveries",
      href: "/dashboard/driver/deliveries",
      icon: <Truck className="h-5 w-5" />,
      role: ["driver"],
    },
    {
      title: "Schedule",
      href: "/dashboard/driver/schedule",
      icon: <CalendarClock className="h-5 w-5" />,
      role: ["driver"],
    },

    // Settings for all roles
    {
      title: "Settings",
      href: `/dashboard/${role}/settings`,
      icon: <Settings className="h-5 w-5" />,
      role: ["admin", "shop", "supplier", "driver"],
    },
  ];

  const filteredNavItems = navItems.filter((item) => item.role.includes(role));

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center border-b px-4">
        <Link href={`/dashboard/${role}`} className="flex items-center gap-2">
          <Logo className="h-8 w-8" linkWrapper={false} />
        </Link>
      </div>
      <ScrollArea className="flex-1 px-2 py-4">
        <nav className="flex flex-col gap-1">
          {filteredNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsSheetCollapsed(false)}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                pathname === item.href
                  ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50"
              )}
            >
              {item.icon}
              {item.title}
            </Link>
          ))}
        </nav>
      </ScrollArea>
      <div className="border-t p-4">
        <Button
          variant="outline"
          className="w-full justify-start gap-2"
          onClick={logout}
        >
          <LogOut className="h-4 w-4" />
          Log out
        </Button>
      </div>
    </div>
  );

  // For mobile
  if (isMobile) {
    return (
      <>
        <div className="sticky top-0 z-20 flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px]">
          <Sheet open={isSheetCollapsed} onOpenChange={setIsSheetCollapsed}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0 sm:max-w-xs">
              <SidebarContent />
            </SheetContent>
          </Sheet>
          <div className="flex items-center gap-2">
            <Logo className="h-6 w-6" linkWrapper={false} />
            <span className="text-lg font-semibold">Hayoma Dairy</span>
          </div>
        </div>
      </>
    );
  }

  // For desktop
  return (
    <>
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-20 flex w-64 flex-col border-r bg-background transition-transform",
          isCollapsed ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <SidebarContent />
      </aside>
      {/* Removed toggle button as 'toggle' does not exist on SidebarContextType */}
    </>
  );
}
