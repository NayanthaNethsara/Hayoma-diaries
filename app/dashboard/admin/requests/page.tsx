"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { Search, Filter, CheckCircle, X, Truck, Calendar, MessageSquare } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

// Mock data for supply requests
const mockSupplyRequests = [
  {
    id: "req1",
    supplier: "Farm Fresh Dairy",
    product: "Fresh Milk",
    quantity: "500 liters",
    requestDate: "2023-05-10",
    deliveryDate: "2023-05-15",
    status: "approved",
    notes: "Regular weekly order",
  },
  {
    id: "req2",
    supplier: "Greek Delights",
    product: "Greek Yogurt",
    quantity: "200 kg",
    requestDate: "2023-05-12",
    deliveryDate: "2023-05-18",
    status: "pending",
    notes: "Special order for new product line",
  },
  {
    id: "req3",
    supplier: "Cheese Masters",
    product: "Cheddar Cheese",
    quantity: "100 kg",
    requestDate: "2023-05-14",
    deliveryDate: "2023-05-20",
    status: "pending",
    notes: "Urgent order for restaurant client",
  },
  {
    id: "req4",
    supplier: "Dairy Delights",
    product: "Butter",
    quantity: "150 kg",
    requestDate: "2023-05-08",
    deliveryDate: "2023-05-12",
    status: "completed",
    notes: "Monthly order",
  },
  {
    id: "req5",
    supplier: "Cream Supreme",
    product: "Cream",
    quantity: "300 liters",
    requestDate: "2023-05-09",
    deliveryDate: "2023-05-14",
    status: "rejected",
    notes: "Quality issues with previous batch",
  },
]

// Mock data for supplier notifications
const mockSupplierNotifications = [
  {
    id: "notif1",
    supplier: "Farm Fresh Dairy",
    product: "Fresh Milk",
    quantity: "800 liters",
    availableDate: "2023-05-18",
    notificationDate: "2023-05-15",
    status: "pending",
    urgent: true,
    notes: "Special discount available for bulk orders",
  },
  {
    id: "notif2",
    supplier: "Greek Delights",
    product: "Greek Yogurt",
    quantity: "350 kg",
    availableDate: "2023-05-20",
    notificationDate: "2023-05-16",
    status: "pending",
    urgent: false,
    notes: "New improved recipe",
  },
  {
    id: "notif3",
    supplier: "Cheese Masters",
    product: "Cheddar Cheese",
    quantity: "200 kg",
    availableDate: "2023-05-19",
    notificationDate: "2023-05-14",
    status: "approved",
    urgent: false,
    notes: "Aged 12 months",
  },
  {
    id: "notif4",
    supplier: "Dairy Delights",
    product: "Butter",
    quantity: "100 kg",
    availableDate: "2023-05-17",
    notificationDate: "2023-05-13",
    status: "rejected",
    urgent: false,
    notes: "Limited time offer",
  },
]

// Mock data for product updates
const mockProductUpdates = [
  {
    id: "update1",
    supplier: "Farm Fresh Dairy",
    product: "Organic Whole Milk",
    updateType: "price",
    date: "2023-05-15",
    status: "new",
    details: "Price increase from $3.99 to $4.29 per gallon due to increased feed costs. Effective June 1st, 2023.",
    oldPrice: "$3.99 per gallon",
    newPrice: "$4.29 per gallon",
  },
  {
    id: "update2",
    supplier: "Greek Delights",
    product: "Premium Greek Yogurt",
    updateType: "new",
    date: "2023-05-14",
    status: "new",
    details:
      "Introducing our new Premium Greek Yogurt with honey. Made with authentic Greek culture and locally sourced honey.",
    oldPrice: "N/A",
    newPrice: "$5.99 per 32oz container",
  },
  {
    id: "update3",
    supplier: "Cheese Masters",
    product: "Aged Cheddar",
    updateType: "quality",
    date: "2023-05-13",
    status: "new",
    details:
      "We've improved our aging process for our cheddar cheese, resulting in a richer flavor profile and smoother texture.",
    oldPrice: "$7.99 per pound",
    newPrice: "$7.99 per pound",
  },
  {
    id: "update4",
    supplier: "Dairy Delights",
    product: "Salted Butter",
    updateType: "price",
    date: "2023-05-12",
    status: "reviewed",
    details: "Price adjustment from $4.50 to $4.25 per pound due to improved production efficiency.",
    oldPrice: "$4.50 per pound",
    newPrice: "$4.25 per pound",
  },
  {
    id: "update5",
    supplier: "Cream Supreme",
    product: "Heavy Whipping Cream",
    updateType: "price",
    date: "2023-05-11",
    status: "reviewed",
    details: "Price increase from $3.75 to $3.99 per pint due to increased transportation costs.",
    oldPrice: "$3.75 per pint",
    newPrice: "$3.99 per pint",
  },
]

export default function AdminSupplyRequestsPage() {
  const [supplyRequests, setSupplyRequests] = useState(mockSupplyRequests)
  const [supplierNotifications, setSupplierNotifications] = useState(mockSupplierNotifications)
  const [productUpdates, setProductUpdates] = useState(mockProductUpdates)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [supplierFilter, setSupplierFilter] = useState("all")
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isNotificationDialogOpen, setIsNotificationDialogOpen] = useState(false)
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
  const [currentRequest, setCurrentRequest] = useState<any>(null)
  const [currentNotification, setCurrentNotification] = useState<any>(null)
  const [currentUpdate, setCurrentUpdate] = useState<any>(null)
  const [responseNote, setResponseNote] = useState("")
  const [activeTab, setActiveTab] = useState("requests")

  // Get unique suppliers for filter
  const suppliers = Array.from(
    new Set([
      ...supplyRequests.map((req) => req.supplier),
      ...supplierNotifications.map((notif) => notif.supplier),
      ...productUpdates.map((update) => update.supplier),
    ]),
  )

  // Filter requests based on search term, status filter, and supplier filter
  const filteredRequests = supplyRequests.filter((request) => {
    const matchesSearch =
      request.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.notes.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || request.status === statusFilter
    const matchesSupplier = supplierFilter === "all" || request.supplier === supplierFilter

    return matchesSearch && matchesStatus && matchesSupplier
  })

  // Filter notifications based on search term, status filter, and supplier filter
  const filteredNotifications = supplierNotifications.filter((notification) => {
    const matchesSearch =
      notification.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.notes.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || notification.status === statusFilter
    const matchesSupplier = supplierFilter === "all" || notification.supplier === supplierFilter

    return matchesSearch && matchesStatus && matchesSupplier
  })

  // Filter product updates based on search term, type filter, and supplier filter
  const filteredUpdates = productUpdates.filter((update) => {
    const matchesSearch =
      update.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      update.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      update.details.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = statusFilter === "all" || update.updateType === statusFilter
    const matchesSupplier = supplierFilter === "all" || update.supplier === supplierFilter

    return matchesSearch && matchesType && matchesSupplier
  })

  // Count requests by status
  const pendingRequests = supplyRequests.filter((req) => req.status === "pending").length
  const approvedRequests = supplyRequests.filter((req) => req.status === "approved").length
  const completedRequests = supplyRequests.filter((req) => req.status === "completed").length
  const rejectedRequests = supplyRequests.filter((req) => req.status === "rejected").length

  // Count notifications by status
  const pendingNotifications = supplierNotifications.filter((notif) => notif.status === "pending").length
  const approvedNotifications = supplierNotifications.filter((notif) => notif.status === "approved").length
  const rejectedNotifications = supplierNotifications.filter((notif) => notif.status === "rejected").length

  // Count updates by status and type
  const newUpdates = productUpdates.filter((update) => update.status === "new").length
  const priceUpdates = productUpdates.filter((update) => update.updateType === "price").length
  const newProductUpdates = productUpdates.filter((update) => update.updateType === "new").length
  const qualityUpdates = productUpdates.filter((update) => update.updateType === "quality").length

  const handleViewRequest = (request: any) => {
    setCurrentRequest(request)
    setResponseNote("")
    setIsViewDialogOpen(true)
  }

  const handleViewNotification = (notification: any) => {
    setCurrentNotification(notification)
    setResponseNote("")
    setIsNotificationDialogOpen(true)
  }

  const handleViewUpdate = (update: any) => {
    setCurrentUpdate(update)
    setResponseNote("")
    setIsUpdateDialogOpen(true)
  }

  const handleUpdateRequestStatus = (id: string, newStatus: string) => {
    setSupplyRequests((prev) => prev.map((req) => (req.id === id ? { ...req, status: newStatus } : req)))
    toast.success(`Request ${id} status updated to ${newStatus}`)
    setIsViewDialogOpen(false)
  }

  const handleUpdateNotificationStatus = (id: string, newStatus: string) => {
    setSupplierNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, status: newStatus } : notif)))
    toast.success(`Notification ${id} status updated to ${newStatus}`)
    setIsNotificationDialogOpen(false)
  }

  const handleUpdateProductUpdateStatus = (id: string, newStatus: string) => {
    setProductUpdates((prev) => prev.map((update) => (update.id === id ? { ...update, status: newStatus } : update)))
    toast.success(`Product update ${id} status updated to ${newStatus}`)
    setIsUpdateDialogOpen(false)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-blue-500">Pending</Badge>
      case "approved":
        return <Badge className="bg-green-500">Approved</Badge>
      case "completed":
        return <Badge className="bg-purple-500">Completed</Badge>
      case "rejected":
        return <Badge className="bg-red-500">Rejected</Badge>
      case "new":
        return <Badge className="bg-blue-500">New</Badge>
      case "reviewed":
        return <Badge className="bg-green-500">Reviewed</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getUpdateTypeBadge = (type: string) => {
    switch (type) {
      case "price":
        return <Badge className="bg-amber-500">Price Change</Badge>
      case "new":
        return <Badge className="bg-green-500">New Product</Badge>
      case "quality":
        return <Badge className="bg-purple-500">Quality Update</Badge>
      case "discontinue":
        return <Badge className="bg-red-500">Discontinued</Badge>
      default:
        return <Badge>{type}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Supply Management</h1>
        <p className="text-muted-foreground">Manage supplier requests and notifications</p>
      </div>

      <Tabs defaultValue="requests" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="requests">Supply Requests</TabsTrigger>
          <TabsTrigger value="notifications">Supplier Notifications</TabsTrigger>
          <TabsTrigger value="updates">Product Updates</TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-6 mt-6">
          <div className="grid gap-6 md:grid-cols-4">
            <Card className="bg-blue-50 dark:bg-blue-950 border-blue-100 dark:border-blue-900">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{pendingRequests}</div>
                <p className="text-xs text-muted-foreground">Awaiting approval</p>
              </CardContent>
            </Card>
            <Card className="bg-green-50 dark:bg-green-950 border-green-100 dark:border-green-900">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Approved</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{approvedRequests}</div>
                <p className="text-xs text-muted-foreground">Ready for delivery</p>
              </CardContent>
            </Card>
            <Card className="bg-purple-50 dark:bg-purple-950 border-purple-100 dark:border-purple-900">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{completedRequests}</div>
                <p className="text-xs text-muted-foreground">Successfully delivered</p>
              </CardContent>
            </Card>
            <Card className="bg-red-50 dark:bg-red-950 border-red-100 dark:border-red-900">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">{rejectedRequests}</div>
                <p className="text-xs text-muted-foreground">Not approved</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Supply Requests</CardTitle>
              <CardDescription>View and manage all supplier supply requests</CardDescription>
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search requests..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[150px]">
                      <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        <span>Status</span>
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={supplierFilter} onValueChange={setSupplierFilter}>
                    <SelectTrigger className="w-[180px]">
                      <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        <span>Supplier</span>
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Suppliers</SelectItem>
                      {suppliers.map((supplier) => (
                        <SelectItem key={supplier} value={supplier}>
                          {supplier}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Request Date</TableHead>
                    <TableHead>Delivery Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.length > 0 ? (
                    filteredRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">{request.supplier}</TableCell>
                        <TableCell>{request.product}</TableCell>
                        <TableCell>{request.quantity}</TableCell>
                        <TableCell>{request.requestDate}</TableCell>
                        <TableCell>{request.deliveryDate}</TableCell>
                        <TableCell>{getStatusBadge(request.status)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => handleViewRequest(request)}>
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                        No supply requests found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6 mt-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="bg-blue-50 dark:bg-blue-950 border-blue-100 dark:border-blue-900">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{pendingNotifications}</div>
                <p className="text-xs text-muted-foreground">New notifications</p>
              </CardContent>
            </Card>
            <Card className="bg-green-50 dark:bg-green-950 border-green-100 dark:border-green-900">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Approved</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{approvedNotifications}</div>
                <p className="text-xs text-muted-foreground">Accepted notifications</p>
              </CardContent>
            </Card>
            <Card className="bg-red-50 dark:bg-red-950 border-red-100 dark:border-red-900">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">{rejectedNotifications}</div>
                <p className="text-xs text-muted-foreground">Declined notifications</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Supplier Availability Notifications</CardTitle>
              <CardDescription>View and respond to supplier availability notifications</CardDescription>
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search notifications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[150px]">
                      <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        <span>Status</span>
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={supplierFilter} onValueChange={setSupplierFilter}>
                    <SelectTrigger className="w-[180px]">
                      <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        <span>Supplier</span>
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Suppliers</SelectItem>
                      {suppliers.map((supplier) => (
                        <SelectItem key={supplier} value={supplier}>
                          {supplier}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Available Date</TableHead>
                    <TableHead>Notification Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredNotifications.length > 0 ? (
                    filteredNotifications.map((notification) => (
                      <TableRow key={notification.id}>
                        <TableCell className="font-medium">{notification.supplier}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {notification.product}
                            {notification.urgent && <Badge className="bg-red-500">Urgent</Badge>}
                          </div>
                        </TableCell>
                        <TableCell>{notification.quantity}</TableCell>
                        <TableCell>{notification.availableDate}</TableCell>
                        <TableCell>{notification.notificationDate}</TableCell>
                        <TableCell>{getStatusBadge(notification.status)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => handleViewNotification(notification)}>
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                        No supplier notifications found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="updates" className="space-y-6 mt-6">
          <div className="grid gap-6 md:grid-cols-4">
            <Card className="bg-blue-50 dark:bg-blue-950 border-blue-100 dark:border-blue-900">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">New</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{newUpdates}</div>
                <p className="text-xs text-muted-foreground">Unread updates</p>
              </CardContent>
            </Card>
            <Card className="bg-amber-50 dark:bg-amber-950 border-amber-100 dark:border-amber-900">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Price Changes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{priceUpdates}</div>
                <p className="text-xs text-muted-foreground">Price update notifications</p>
              </CardContent>
            </Card>
            <Card className="bg-green-50 dark:bg-green-950 border-green-100 dark:border-green-900">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">New Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{newProductUpdates}</div>
                <p className="text-xs text-muted-foreground">Product introductions</p>
              </CardContent>
            </Card>
            <Card className="bg-purple-50 dark:bg-purple-950 border-purple-100 dark:border-purple-900">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Quality Updates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{qualityUpdates}</div>
                <p className="text-xs text-muted-foreground">Quality improvement notices</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Product Updates from Suppliers</CardTitle>
              <CardDescription>View and respond to product updates from suppliers</CardDescription>
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search updates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[150px]">
                      <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        <span>Type</span>
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="price">Price Changes</SelectItem>
                      <SelectItem value="new">New Products</SelectItem>
                      <SelectItem value="quality">Quality Updates</SelectItem>
                      <SelectItem value="discontinue">Discontinued</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={supplierFilter} onValueChange={setSupplierFilter}>
                    <SelectTrigger className="w-[180px]">
                      <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        <span>Supplier</span>
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Suppliers</SelectItem>
                      {suppliers.map((supplier) => (
                        <SelectItem key={supplier} value={supplier}>
                          {supplier}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Update Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUpdates.length > 0 ? (
                    filteredUpdates.map((update) => (
                      <TableRow key={update.id}>
                        <TableCell className="font-medium">{update.supplier}</TableCell>
                        <TableCell>{update.product}</TableCell>
                        <TableCell>{getUpdateTypeBadge(update.updateType)}</TableCell>
                        <TableCell>{update.date}</TableCell>
                        <TableCell>{getStatusBadge(update.status)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => handleViewUpdate(update)}>
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                        No product updates found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* View Request Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          {currentRequest && (
            <>
              <DialogHeader>
                <DialogTitle>Supply Request Details</DialogTitle>
                <DialogDescription>Review and respond to this supply request</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Supplier</h3>
                    <p className="font-medium">{currentRequest.supplier}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Product</h3>
                    <p className="font-medium">{currentRequest.product}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Quantity</h3>
                    <p className="font-medium">{currentRequest.quantity}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                    {getStatusBadge(currentRequest.status)}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Request Date</h3>
                    <p className="font-medium">{currentRequest.requestDate}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Delivery Date</h3>
                    <p className="font-medium">{currentRequest.deliveryDate}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Notes</h3>
                  <p className="text-sm">{currentRequest.notes}</p>
                </div>
                {currentRequest.status === "pending" && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Response Note</h3>
                    <Textarea
                      value={responseNote}
                      onChange={(e) => setResponseNote(e.target.value)}
                      placeholder="Add a note to your response..."
                      rows={3}
                    />
                  </div>
                )}
              </div>
              <DialogFooter className="flex flex-col sm:flex-row gap-2">
                {currentRequest.status === "pending" && (
                  <>
                    <Button
                      onClick={() => handleUpdateRequestStatus(currentRequest.id, "approved")}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleUpdateRequestStatus(currentRequest.id, "rejected")}
                      className="text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-950"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </>
                )}
                {currentRequest.status === "approved" && (
                  <Button
                    onClick={() => handleUpdateRequestStatus(currentRequest.id, "completed")}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Truck className="h-4 w-4 mr-2" />
                    Mark as Delivered
                  </Button>
                )}
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* View Notification Dialog */}
      <Dialog open={isNotificationDialogOpen} onOpenChange={setIsNotificationDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          {currentNotification && (
            <>
              <DialogHeader>
                <DialogTitle>Supplier Notification Details</DialogTitle>
                <DialogDescription>Review and respond to this supplier availability notification</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Supplier</h3>
                    <p className="font-medium">{currentNotification.supplier}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Product</h3>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{currentNotification.product}</p>
                      {currentNotification.urgent && <Badge className="bg-red-500">Urgent</Badge>}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Quantity</h3>
                    <p className="font-medium">{currentNotification.quantity}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                    {getStatusBadge(currentNotification.status)}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Available Date</h3>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <p className="font-medium">{currentNotification.availableDate}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Notification Date</h3>
                    <p className="font-medium">{currentNotification.notificationDate}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Notes</h3>
                  <p className="text-sm">{currentNotification.notes}</p>
                </div>
                {currentNotification.status === "pending" && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Response Note</h3>
                    <Textarea
                      value={responseNote}
                      onChange={(e) => setResponseNote(e.target.value)}
                      placeholder="Add a note to your response..."
                      rows={3}
                    />
                  </div>
                )}
              </div>
              <DialogFooter className="flex flex-col sm:flex-row gap-2">
                {currentNotification.status === "pending" && (
                  <>
                    <Button
                      onClick={() => handleUpdateNotificationStatus(currentNotification.id, "approved")}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleUpdateNotificationStatus(currentNotification.id, "rejected")}
                      className="text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-950"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </>
                )}
                <Button variant="outline" onClick={() => setIsNotificationDialogOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* View Product Update Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          {currentUpdate && (
            <>
              <DialogHeader>
                <DialogTitle>Product Update Details</DialogTitle>
                <DialogDescription>Review this product update from the supplier</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Supplier</h3>
                    <p className="font-medium">{currentUpdate.supplier}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Product</h3>
                    <p className="font-medium">{currentUpdate.product}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Update Type</h3>
                    {getUpdateTypeBadge(currentUpdate.updateType)}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Date</h3>
                    <p className="font-medium">{currentUpdate.date}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Details</h3>
                  <p className="text-sm">{currentUpdate.details}</p>
                </div>
                {currentUpdate.updateType === "price" && (
                  <>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Previous Price</h3>
                      <p className="font-medium">{currentUpdate.oldPrice}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">New Price</h3>
                      <p className="font-medium">{currentUpdate.newPrice}</p>
                    </div>
                  </>
                )}
                {currentUpdate.status === "new" && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Your Response</h3>
                    <Textarea
                      value={responseNote}
                      onChange={(e) => setResponseNote(e.target.value)}
                      placeholder="Add a note to your response..."
                      rows={3}
                    />
                  </div>
                )}
              </div>
              <DialogFooter className="flex flex-col sm:flex-row gap-2">
                {currentUpdate.status === "new" && (
                  <>
                    <Button
                      onClick={() => handleUpdateProductUpdateStatus(currentUpdate.id, "reviewed")}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Acknowledge
                    </Button>
                    <Button
                      variant="outline"
                      className="text-amber-600 border-amber-200 hover:bg-amber-50 dark:hover:bg-amber-950"
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Request More Info
                    </Button>
                  </>
                )}
                <Button variant="outline" onClick={() => setIsUpdateDialogOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
