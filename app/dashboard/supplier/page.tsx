"use client"
import { useState } from "react"
import type React from "react"

import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingCart, Truck, DollarSign, ArrowUpRight, Package, BarChart3, Bell, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"

export default function SupplierDashboard() {
  const { user } = useAuth()
  const [isNotificationDialogOpen, setIsNotificationDialogOpen] = useState(false)
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    product: "",
    quantity: "",
    availableDate: "",
    notes: "",
    urgent: false,
  })
  const [updateData, setUpdateData] = useState({
    title: "",
    message: "",
    urgent: false,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleUpdateInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setUpdateData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      urgent: checked,
    }))
  }

  const handleUpdateSwitchChange = (checked: boolean) => {
    setUpdateData((prev) => ({
      ...prev,
      urgent: checked,
    }))
  }

  const handleSubmitNotification = () => {
    // Validate form
    if (!formData.product || !formData.quantity || !formData.availableDate) {
      toast.error("Please fill in all required fields")
      return
    }

    // Add new notification (in a real app, this would send to an API)
    toast.success("Supply availability notification sent to admin")
    setIsNotificationDialogOpen(false)

    // Reset form
    setFormData({
      product: "",
      quantity: "",
      availableDate: "",
      notes: "",
      urgent: false,
    })
  }

  const handleSubmitUpdate = () => {
    // Validate form
    if (!updateData.title || !updateData.message) {
      toast.error("Please fill in all required fields")
      return
    }

    // Add new update (in a real app, this would send to an API)
    toast.success("Update note sent to admin")
    setIsUpdateDialogOpen(false)

    // Reset form
    setUpdateData({
      title: "",
      message: "",
      urgent: false,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Supplier Dashboard</h1>
          <p className="text-muted-foreground">Welcome, {user?.name || "Supplier User"}!</p>
          <p className="text-muted-foreground">Your role is: {user?.role || "SUPPLIER"}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Dialog open={isNotificationDialogOpen} onOpenChange={setIsNotificationDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
                <Bell className="h-4 w-4" />
                Notify Supply Availability
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Notify Supply Availability</DialogTitle>
                <DialogDescription>
                  Let the admin know about your available supplies for pickup or delivery.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="product">Product Name *</Label>
                    <Input
                      id="product"
                      name="product"
                      value={formData.product}
                      onChange={handleInputChange}
                      placeholder="Enter product name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity Available *</Label>
                    <Input
                      id="quantity"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      placeholder="e.g., 500 liters, 200 kg"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="availableDate">Available Date *</Label>
                  <Input
                    id="availableDate"
                    name="availableDate"
                    type="date"
                    value={formData.availableDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Any special handling instructions or details..."
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Switch id="urgent" checked={formData.urgent} onCheckedChange={handleSwitchChange} />
                    <Label htmlFor="urgent">Mark as Urgent</Label>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Use this for time-sensitive supplies that need immediate attention.
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsNotificationDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmitNotification}>Send Notification</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2 bg-green-600 hover:bg-green-700">
                <MessageSquare className="h-4 w-4" />
                Send Update to Admin
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Send Update to Admin</DialogTitle>
                <DialogDescription>
                  Notify the admin about important updates, price changes, or other information.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Update Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={updateData.title}
                    onChange={handleUpdateInputChange}
                    placeholder="Enter a title for your update"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={updateData.message}
                    onChange={handleUpdateInputChange}
                    placeholder="Provide details about your update..."
                    rows={5}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Switch id="updateUrgent" checked={updateData.urgent} onCheckedChange={handleUpdateSwitchChange} />
                    <Label htmlFor="updateUrgent">Mark as Urgent</Label>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Use this for time-sensitive information that requires immediate attention.
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsUpdateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmitUpdate}>Send Update</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
            <Button variant="link" className="mt-2 h-auto p-0 text-xs" asChild>
              <Link href="/dashboard/supplier/products" className="flex items-center gap-1">
                View products <ArrowUpRight className="h-3 w-3" />
              </Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">+1 from yesterday</p>
            <Button variant="link" className="mt-2 h-auto p-0 text-xs">
              <Link href="/dashboard/supplier/orders" className="flex items-center gap-1">
                View orders <ArrowUpRight className="h-3 w-3" />
              </Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Revenue (Monthly)</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,450</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
            <Button variant="link" className="mt-2 h-auto p-0 text-xs">
              <Link href="/dashboard/supplier/revenue" className="flex items-center gap-1">
                View details <ArrowUpRight className="h-3 w-3" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest orders from shops</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Order #1234</p>
                  <p className="text-xs text-muted-foreground">Dairy Mart Shop</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">$450</p>
                  <p className="text-xs text-muted-foreground">Today</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Order #1233</p>
                  <p className="text-xs text-muted-foreground">Fresh Dairy Shop</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">$320</p>
                  <p className="text-xs text-muted-foreground">Yesterday</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Order #1232</p>
                  <p className="text-xs text-muted-foreground">Milk & More</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">$580</p>
                  <p className="text-xs text-muted-foreground">2 days ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
            <CardDescription>Your best-selling products this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-medium">Fresh Milk</span>
                  <span className="text-sm text-muted-foreground">42%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted">
                  <div className="h-full w-[42%] rounded-full bg-primary"></div>
                </div>
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-medium">Cheddar Cheese</span>
                  <span className="text-sm text-muted-foreground">28%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted">
                  <div className="h-full w-[28%] rounded-full bg-primary"></div>
                </div>
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-medium">Greek Yogurt</span>
                  <span className="text-sm text-muted-foreground">18%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted">
                  <div className="h-full w-[18%] rounded-full bg-primary"></div>
                </div>
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-medium">Butter</span>
                  <span className="text-sm text-muted-foreground">12%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted">
                  <div className="h-full w-[12%] rounded-full bg-primary"></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Deliveries</CardTitle>
            <CardDescription>Scheduled pickups and deliveries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Fresh Milk Pickup</p>
                  <p className="text-xs text-muted-foreground">500 liters</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-amber-600">Tomorrow</p>
                  <p className="text-xs text-muted-foreground">9:00 AM</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Yogurt Delivery</p>
                  <p className="text-xs text-muted-foreground">200 cups</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-600">May 18</p>
                  <p className="text-xs text-muted-foreground">2:00 PM</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Cheese Pickup</p>
                  <p className="text-xs text-muted-foreground">100 kg</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-600">May 20</p>
                  <p className="text-xs text-muted-foreground">11:30 AM</p>
                </div>
              </div>
            </div>
            <Button variant="outline" className="mt-4 w-full" asChild>
              <Link href="/dashboard/supplier/deliveries">View all deliveries</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common supplier tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-24 flex flex-col items-center justify-center gap-2">
                <Package className="h-6 w-6" />
                <span>Update Inventory</span>
              </Button>
              <Button variant="outline" className="h-24 flex flex-col items-center justify-center gap-2">
                <Truck className="h-6 w-6" />
                <span>Schedule Delivery</span>
              </Button>
              <Button variant="outline" className="h-24 flex flex-col items-center justify-center gap-2">
                <BarChart3 className="h-6 w-6" />
                <span>View Reports</span>
              </Button>
              <Button variant="outline" className="h-24 flex flex-col items-center justify-center gap-2">
                <ShoppingCart className="h-6 w-6" />
                <span>Manage Products</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
