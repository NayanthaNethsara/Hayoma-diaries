"use client"

import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ShoppingCart, Truck, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ShopDashboard() {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-4">Shop Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user?.name || "Shop User"}</p>
        <p>Your role is: {user?.role || "shop"}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Inventory Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground">+5 from last week</p>
            <Button variant="link" className="mt-2 h-auto p-0 text-xs" asChild>
              <Link href="/dashboard/shop/inventory" className="flex items-center gap-1">
                View inventory <ArrowUpRight className="h-3 w-3" />
              </Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">-2 from yesterday</p>
            <Button variant="link" className="mt-2 h-auto p-0 text-xs">
              <Link href="/dashboard/shop/orders" className="flex items-center gap-1">
                View orders <ArrowUpRight className="h-3 w-3" />
              </Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Incoming Deliveries</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Expected today</p>
            <Button variant="link" className="mt-2 h-auto p-0 text-xs">
              <Link href="/dashboard/shop/deliveries" className="flex items-center gap-1">
                View deliveries <ArrowUpRight className="h-3 w-3" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Inventory Status</CardTitle>
            <CardDescription>Current inventory levels</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* BACKEND INTEGRATION: Fetch and display inventory status */}
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-medium">Milk</span>
                  <span className="text-sm text-muted-foreground">85%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted">
                  <div className="h-full w-[85%] rounded-full bg-primary"></div>
                </div>
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-medium">Cheese</span>
                  <span className="text-sm text-muted-foreground">42%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted">
                  <div className="h-full w-[42%] rounded-full bg-primary"></div>
                </div>
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-medium">Yogurt</span>
                  <span className="text-sm text-muted-foreground">28%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted">
                  <div className="h-full w-[28%] rounded-full bg-yellow-500"></div>
                </div>
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-medium">Butter</span>
                  <span className="text-sm text-muted-foreground">12%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted">
                  <div className="h-full w-[12%] rounded-full bg-red-500"></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest activities for your shop</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* BACKEND INTEGRATION: Fetch and display recent activities */}
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-primary/10 p-2">
                  <Truck className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Delivery received</p>
                  <p className="text-xs text-muted-foreground">Today, 10:30 AM</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-primary/10 p-2">
                  <Package className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Inventory updated</p>
                  <p className="text-xs text-muted-foreground">Today, 9:15 AM</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-primary/10 p-2">
                  <ShoppingCart className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Order placed</p>
                  <p className="text-xs text-muted-foreground">Yesterday, 4:45 PM</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
