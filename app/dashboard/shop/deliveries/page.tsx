"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Filter, Calendar, Clock, CheckCircle, Truck, AlertTriangle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { toast } from "sonner"
import { useAuth } from "@/contexts/auth-context"

// Mock data for deliveries
const mockDeliveries = [
  {
    id: "DEL-001",
    orderId: "ORD-1234",
    products: ["Fresh Milk", "Yogurt", "Cheese"],
    date: "2023-05-15",
    estimatedTime: "08:00 AM - 10:00 AM",
    status: "DELIVERED",
    driver: "John Doe",
    paymentStatus: "PAID",
    notes: "Left at the back door",
    isSignatureRequired: true,
    signedBy: "Mark Johnson",
  },
  {
    id: "DEL-002",
    orderId: "ORD-1235",
    products: ["Butter", "Cream", "Chocolate Milk"],
    date: "2023-05-16",
    estimatedTime: "09:00 AM - 11:00 AM",
    status: "IN_TRANSIT",
    driver: "Jane Smith",
    paymentStatus: "PENDING",
    notes: "",
    isSignatureRequired: true,
    signedBy: "",
  },
  {
    id: "DEL-003",
    orderId: "ORD-1236",
    products: ["Whipped Cream", "Milk", "Yogurt"],
    date: "2023-05-17",
    estimatedTime: "10:00 AM - 12:00 PM",
    status: "SCHEDULED",
    driver: "Mike Brown",
    paymentStatus: "UNPAID",
    notes: "Call before delivery",
    isSignatureRequired: false,
    signedBy: "",
  },
  {
    id: "DEL-004",
    orderId: "ORD-1237",
    products: ["Cheese", "Butter", "Milk"],
    date: "2023-05-14",
    estimatedTime: "02:00 PM - 04:00 PM",
    status: "DELIVERED",
    driver: "John Doe",
    paymentStatus: "PAID",
    notes: "",
    isSignatureRequired: true,
    signedBy: "Sarah Williams",
  },
  {
    id: "DEL-005",
    orderId: "ORD-1238",
    products: ["Yogurt", "Cream", "Chocolate Milk"],
    date: "2023-05-18",
    estimatedTime: "01:00 PM - 03:00 PM",
    status: "SCHEDULED",
    driver: "Jane Smith",
    paymentStatus: "UNPAID",
    notes: "",
    isSignatureRequired: true,
    signedBy: "",
  },
]

export default function ShopDeliveriesDashboard() {
  const { user } = useAuth()
  const [deliveries, setDeliveries] = useState(mockDeliveries)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")

  // Filter deliveries based on search term, status filter, and date filter
  const filteredDeliveries = deliveries.filter((delivery) => {
    const matchesSearch =
      delivery.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.products.some((product) => product.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === "all" || delivery.status === statusFilter

    const today = new Date().toISOString().split("T")[0]
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0]

    let matchesDate = true
    if (dateFilter === "today") {
      matchesDate = delivery.date === today
    } else if (dateFilter === "tomorrow") {
      matchesDate = delivery.date === tomorrow
    } else if (dateFilter === "upcoming") {
      matchesDate = delivery.date > today
    } else if (dateFilter === "past") {
      matchesDate = delivery.date < today
    }

    return matchesSearch && matchesStatus && matchesDate
  })

  // Count deliveries by status
  const scheduledDeliveries = deliveries.filter((delivery) => delivery.status === "SCHEDULED").length
  const inTransitDeliveries = deliveries.filter((delivery) => delivery.status === "IN_TRANSIT").length
  const deliveredDeliveries = deliveries.filter((delivery) => delivery.status === "DELIVERED").length

  const handleConfirmDelivery = (id: string) => {
    setDeliveries((prev) =>
      prev.map((delivery) => {
        if (delivery.id === id) {
          return {
            ...delivery,
            status: "DELIVERED",
            signedBy: user?.name || "Shop Manager",
          }
        }
        return delivery
      }),
    )
    toast.success("Delivery confirmed successfully")
  }

  const handleReportIssue = (id: string) => {
    // In a real app, this would open a form to report an issue
    toast.success("Issue reported. Our team will contact you shortly.")
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return <Badge className="bg-green-500">Delivered</Badge>
      case "IN_TRANSIT":
        return <Badge className="bg-blue-500">In Transit</Badge>
      case "SCHEDULED":
        return <Badge className="bg-amber-500">Scheduled</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "PAID":
        return <Badge className="bg-green-500">Paid</Badge>
      case "PENDING":
        return <Badge className="bg-amber-500">Pending</Badge>
      case "UNPAID":
        return <Badge className="bg-red-500">Unpaid</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Delivery Tracking</h1>
        <p className="text-muted-foreground">Track and manage your incoming deliveries</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-amber-50 to-white dark:from-gray-900 dark:to-gray-800 border-amber-100 dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Scheduled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">{scheduledDeliveries}</div>
            <p className="text-sm text-muted-foreground">Upcoming deliveries</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 border-blue-100 dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">In Transit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{inTransitDeliveries}</div>
            <p className="text-sm text-muted-foreground">Currently on the way</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-white dark:from-gray-900 dark:to-gray-800 border-green-100 dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Delivered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">{deliveredDeliveries}</div>
            <p className="text-sm text-muted-foreground">Successfully received</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-blue-100 dark:border-gray-700">
        <CardHeader>
          <CardTitle>All Deliveries</CardTitle>
          <CardDescription>View and manage all your incoming deliveries</CardDescription>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search deliveries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 bg-white dark:bg-gray-950"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px] bg-white dark:bg-gray-950">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <span>Status</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                  <SelectItem value="IN_TRANSIT">In Transit</SelectItem>
                  <SelectItem value="DELIVERED">Delivered</SelectItem>
                </SelectContent>
              </Select>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-[150px] bg-white dark:bg-gray-950">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Date</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Dates</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="tomorrow">Tomorrow</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="past">Past</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-blue-100 dark:border-gray-800">
            <Table>
              <TableHeader className="bg-blue-50 dark:bg-gray-900">
                <TableRow>
                  <TableHead>Delivery ID</TableHead>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDeliveries.map((delivery) => (
                  <TableRow key={delivery.id} className="bg-white dark:bg-gray-950">
                    <TableCell className="font-medium">{delivery.id}</TableCell>
                    <TableCell>{delivery.orderId}</TableCell>
                    <TableCell>
                      <div className="max-w-[150px] truncate" title={delivery.products.join(", ")}>
                        {delivery.products.join(", ")}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{new Date(delivery.date).toLocaleDateString()}</span>
                        <span className="text-xs text-muted-foreground">{delivery.estimatedTime}</span>
                      </div>
                    </TableCell>
                    <TableCell>{delivery.driver}</TableCell>
                    <TableCell>{getStatusBadge(delivery.status)}</TableCell>
                    <TableCell>{getPaymentStatusBadge(delivery.paymentStatus)}</TableCell>
                    <TableCell className="text-right">
                      {delivery.status === "IN_TRANSIT" && (
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleConfirmDelivery(delivery.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Confirm
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReportIssue(delivery.id)}
                            className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950"
                          >
                            <AlertTriangle className="h-4 w-4 mr-1" />
                            Issue
                          </Button>
                        </div>
                      )}
                      {delivery.status === "DELIVERED" && (
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-xs text-muted-foreground">Signed: {delivery.signedBy || "N/A"}</span>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {filteredDeliveries.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-4 text-muted-foreground">
                      No deliveries found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {filteredDeliveries
          .filter((delivery) => delivery.status === "IN_TRANSIT")
          .map((delivery) => (
            <Card key={delivery.id} className="border-blue-100 dark:border-gray-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      Delivery {delivery.id} <Badge className="bg-blue-500">In Transit</Badge>
                    </CardTitle>
                    <CardDescription>
                      Order {delivery.orderId} • {new Date(delivery.date).toLocaleDateString()} •{" "}
                      {delivery.estimatedTime}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Arriving soon</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-lg border border-blue-100 p-4 dark:border-blue-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900">
                          <Truck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="font-medium">Driver: {delivery.driver}</p>
                          <p className="text-sm text-muted-foreground">
                            {delivery.paymentStatus === "UNPAID" ? "Payment required on delivery" : ""}
                          </p>
                        </div>
                      </div>
                      <div>{getPaymentStatusBadge(delivery.paymentStatus)}</div>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm font-medium">Products:</p>
                      <ul className="mt-1 list-disc pl-5 text-sm">
                        {delivery.products.map((product, index) => (
                          <li key={index}>{product}</li>
                        ))}
                      </ul>
                    </div>
                    {delivery.notes && (
                      <div className="mt-4 rounded-md bg-amber-50 p-3 dark:bg-amber-950">
                        <p className="text-sm font-medium">Notes:</p>
                        <p className="text-sm">{delivery.notes}</p>
                      </div>
                    )}
                    <div className="mt-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {delivery.isSignatureRequired ? "Signature required on delivery" : "No signature required"}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleConfirmDelivery(delivery.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Confirm Receipt
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReportIssue(delivery.id)}
                          className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950"
                        >
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          Report Issue
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  )
}
