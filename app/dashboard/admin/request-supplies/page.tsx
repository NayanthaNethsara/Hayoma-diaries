"use client"
import { useState } from "react"
import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Calendar, Clock, Package, Plus, Filter, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"

export default function RequestSuppliesPage() {
  // State for the request form
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false)
  const [requestFormData, setRequestFormData] = useState({
    supplier: "",
    product: "",
    quantity: "",
    requiredBy: "",
    notes: "",
    urgent: false,
  })

  // State for search and filter
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Mock data for suppliers
  const suppliers = [
    { id: "sup-001", name: "Organic Farms Co." },
    { id: "sup-002", name: "Natural Ingredients Inc." },
    { id: "sup-003", name: "Packaging Solutions" },
    { id: "sup-004", name: "Dairy Producers Ltd." },
  ]

  // Mock data for recent requests
  const [recentRequests, setRecentRequests] = useState([
    {
      id: "req-001",
      supplier: "Organic Farms Co.",
      product: "Raw Milk",
      quantity: "500 liters",
      requestDate: "2023-05-01",
      requiredBy: "2023-05-15",
      status: "pending",
      notes: "Need for upcoming production batch",
    },
    {
      id: "req-002",
      supplier: "Natural Ingredients Inc.",
      product: "Vanilla Extract",
      quantity: "20 liters",
      requestDate: "2023-04-28",
      requiredBy: "2023-05-10",
      status: "approved",
      notes: "For new vanilla yogurt line",
    },
    {
      id: "req-003",
      supplier: "Packaging Solutions",
      product: "Milk Bottles (1L)",
      quantity: "2000 units",
      requestDate: "2023-04-25",
      requiredBy: "2023-05-05",
      status: "completed",
      notes: "Standard order for monthly packaging",
    },
  ])

  // Mock data for supplier notifications
  const supplierNotifications = [
    {
      id: "notif-001",
      supplier: "Organic Farms Co.",
      message: "Price increase for Raw Milk starting next month",
      date: "2023-05-02",
      read: false,
    },
    {
      id: "notif-002",
      supplier: "Natural Ingredients Inc.",
      message: "New organic flavors available for sampling",
      date: "2023-04-30",
      read: true,
    },
    {
      id: "notif-003",
      supplier: "Packaging Solutions",
      message: "Delivery delay for Milk Bottles due to transportation issues",
      date: "2023-04-27",
      read: true,
    },
  ]

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setRequestFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setRequestFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle switch changes
  const handleSwitchChange = (checked: boolean) => {
    setRequestFormData((prev) => ({
      ...prev,
      urgent: checked,
    }))
  }

  // Handle form submission
  const handleSubmitRequest = () => {
    // Validate form
    if (
      !requestFormData.supplier ||
      !requestFormData.product ||
      !requestFormData.quantity ||
      !requestFormData.requiredBy
    ) {
      toast.error("Please fill in all required fields")
      return
    }

    // Create new request
    const newRequest = {
      id: `req-${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0")}`,
      supplier: requestFormData.supplier,
      product: requestFormData.product,
      quantity: requestFormData.quantity,
      requestDate: new Date().toISOString().split("T")[0],
      requiredBy: requestFormData.requiredBy,
      status: "pending",
      notes: requestFormData.notes,
    }

    // Add to requests
    setRecentRequests((prev) => [newRequest, ...prev])
    toast.success("Supply request sent to supplier")
    setIsRequestDialogOpen(false)

    // Reset form
    setRequestFormData({
      supplier: "",
      product: "",
      quantity: "",
      requiredBy: "",
      notes: "",
      urgent: false,
    })
  }

  // Filter requests based on search query and status filter
  const filteredRequests = recentRequests.filter((request) => {
    const matchesSearch =
      request.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.supplier.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || request.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Count requests by status
  const pendingRequests = recentRequests.filter((r) => r.status === "pending").length
  const approvedRequests = recentRequests.filter((r) => r.status === "approved").length
  const completedRequests = recentRequests.filter((r) => r.status === "completed").length

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Supply Requests</h1>
            <p className="text-muted-foreground">Manage supply requests to suppliers</p>
          </div>
          <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Supply Request
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Request Supplies</DialogTitle>
                <DialogDescription>Send a request to a supplier for materials or products you need.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="supplier">Supplier *</Label>
                  <Select
                    onValueChange={(value) => handleSelectChange("supplier", value)}
                    value={requestFormData.supplier}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a supplier" />
                    </SelectTrigger>
                    <SelectContent>
                      {suppliers.map((supplier) => (
                        <SelectItem key={supplier.id} value={supplier.name}>
                          {supplier.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="product">Product/Material *</Label>
                    <Input
                      id="product"
                      name="product"
                      value={requestFormData.product}
                      onChange={handleInputChange}
                      placeholder="Enter product name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity Needed *</Label>
                    <Input
                      id="quantity"
                      name="quantity"
                      value={requestFormData.quantity}
                      onChange={handleInputChange}
                      placeholder="e.g., 500 liters, 200 kg"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="requiredBy">Required By Date *</Label>
                  <Input
                    id="requiredBy"
                    name="requiredBy"
                    type="date"
                    value={requestFormData.requiredBy}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={requestFormData.notes}
                    onChange={handleInputChange}
                    placeholder="Any special requirements or details..."
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Switch id="urgent" checked={requestFormData.urgent} onCheckedChange={handleSwitchChange} />
                    <Label htmlFor="urgent">Mark as Urgent</Label>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Use this for time-sensitive supplies that need immediate attention.
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsRequestDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmitRequest}>Send Request</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="bg-blue-50 dark:bg-blue-950 border-blue-100 dark:border-blue-900">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-800 dark:text-blue-200">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-800 dark:text-blue-200">{pendingRequests}</div>
              <p className="text-xs text-blue-600 dark:text-blue-300">Awaiting supplier response</p>
            </CardContent>
          </Card>
          <Card className="bg-green-50 dark:bg-green-950 border-green-100 dark:border-green-900">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-800 dark:text-green-200">Approved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-800 dark:text-green-200">{approvedRequests}</div>
              <p className="text-xs text-green-600 dark:text-green-300">Confirmed by suppliers</p>
            </CardContent>
          </Card>
          <Card className="bg-purple-50 dark:bg-purple-950 border-purple-100 dark:border-purple-900">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-purple-800 dark:text-purple-200">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-800 dark:text-purple-200">{completedRequests}</div>
              <p className="text-xs text-purple-600 dark:text-purple-300">Delivered and received</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search requests..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="recent" className="w-full">
          <TabsList>
            <TabsTrigger value="recent">Supply Requests</TabsTrigger>
            <TabsTrigger value="notifications">Supplier Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="recent" className="space-y-4 mt-4">
            {filteredRequests.length > 0 ? (
              <div className="grid gap-4">
                {filteredRequests.map((request) => (
                  <Card key={request.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{request.product}</CardTitle>
                          <CardDescription>{request.supplier}</CardDescription>
                        </div>
                        <div
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            request.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : request.status === "approved"
                                ? "bg-green-100 text-green-800"
                                : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center text-sm text-gray-500">
                          <Package className="mr-2 h-4 w-4" />
                          <span>Quantity: {request.quantity}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="mr-2 h-4 w-4" />
                          <span>Requested on: {request.requestDate}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="mr-2 h-4 w-4" />
                          <span>Required by: {request.requiredBy}</span>
                        </div>
                        {request.notes && (
                          <div className="mt-2 text-sm">
                            <p className="font-medium">Notes:</p>
                            <p className="text-muted-foreground">{request.notes}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2 pt-0">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      {request.status === "pending" && (
                        <Button variant="outline" size="sm" className="text-red-500">
                          Cancel Request
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <Package className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No Requests Found</h3>
                <p className="text-sm text-muted-foreground mt-2 max-w-md">
                  {searchQuery || statusFilter !== "all"
                    ? "No requests match your current filters. Try adjusting your search criteria."
                    : "You haven't made any supply requests yet. Click the 'New Supply Request' button to get started."}
                </p>
                {(searchQuery || statusFilter !== "all") && (
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => {
                      setSearchQuery("")
                      setStatusFilter("all")
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4 mt-4">
            <div className="grid gap-4">
              {supplierNotifications.map((notification) => (
                <Card key={notification.id} className={notification.read ? "" : "border-l-4 border-l-blue-500"}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base">{notification.supplier}</CardTitle>
                      <div className="text-xs text-gray-500 flex items-center">
                        <Clock className="mr-1 h-3 w-3" />
                        {notification.date}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start gap-2">
                      <Bell className="h-4 w-4 mt-0.5 text-gray-500" />
                      <p className="text-sm">{notification.message}</p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2 pt-0">
                    {!notification.read && (
                      <Button variant="outline" size="sm">
                        Mark as Read
                      </Button>
                    )}
                    <Button size="sm">Respond</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
