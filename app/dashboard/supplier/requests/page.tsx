"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { Search, Plus, Filter } from "lucide-react"

// Mock data for supply requests
const mockSupplyRequests = [
  {
    id: "req1",
    product: "Fresh Milk",
    quantity: "500 liters",
    requestDate: "2023-05-10",
    deliveryDate: "2023-05-15",
    status: "approved",
    notes: "Regular weekly order",
  },
  {
    id: "req2",
    product: "Greek Yogurt",
    quantity: "200 kg",
    requestDate: "2023-05-12",
    deliveryDate: "2023-05-18",
    status: "pending",
    notes: "Special order for new product line",
  },
  {
    id: "req3",
    product: "Cheddar Cheese",
    quantity: "100 kg",
    requestDate: "2023-05-14",
    deliveryDate: "2023-05-20",
    status: "pending",
    notes: "Urgent order for restaurant client",
  },
  {
    id: "req4",
    product: "Butter",
    quantity: "150 kg",
    requestDate: "2023-05-08",
    deliveryDate: "2023-05-12",
    status: "completed",
    notes: "Monthly order",
  },
  {
    id: "req5",
    product: "Cream",
    quantity: "300 liters",
    requestDate: "2023-05-09",
    deliveryDate: "2023-05-14",
    status: "rejected",
    notes: "Quality issues with previous batch",
  },
]

// Mock data for products
const mockProducts = [
  { id: "p1", name: "Fresh Milk", unit: "liters" },
  { id: "p2", name: "Greek Yogurt", unit: "kg" },
  { id: "p3", name: "Cheddar Cheese", unit: "kg" },
  { id: "p4", name: "Butter", unit: "kg" },
  { id: "p5", name: "Cream", unit: "liters" },
  { id: "p6", name: "Mozzarella", unit: "kg" },
  { id: "p7", name: "Cottage Cheese", unit: "kg" },
]

export default function SupplyRequestsPage() {
  const { user } = useAuth()
  const [supplyRequests, setSupplyRequests] = useState(mockSupplyRequests)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [formData, setFormData] = useState({
    product: "",
    quantity: "",
    unit: "",
    deliveryDate: "",
    notes: "",
    isUrgent: false,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // If product is selected, set the unit automatically
    if (name === "product") {
      const selectedProduct = mockProducts.find((p) => p.name === value)
      if (selectedProduct) {
        setFormData((prev) => ({
          ...prev,
          unit: selectedProduct.unit,
        }))
      }
    }
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      isUrgent: checked,
    }))
  }

  const handleSubmit = () => {
    // Validate form
    if (!formData.product || !formData.quantity || !formData.deliveryDate) {
      toast.error("Please fill in all required fields")
      return
    }

    // Create new request
    const newRequest = {
      id: `req${Math.floor(Math.random() * 1000)}`,
      product: formData.product,
      quantity: `${formData.quantity} ${formData.unit}`,
      requestDate: new Date().toISOString().split("T")[0],
      deliveryDate: formData.deliveryDate,
      status: "pending",
      notes: formData.notes,
    }

    setSupplyRequests((prev) => [newRequest, ...prev])
    toast.success("Supply request submitted successfully")
    setIsDialogOpen(false)

    // Reset form
    setFormData({
      product: "",
      quantity: "",
      unit: "",
      deliveryDate: "",
      notes: "",
      isUrgent: false,
    })
  }

  // Filter requests based on search term and status filter
  const filteredRequests = supplyRequests.filter((request) => {
    const matchesSearch =
      request.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.notes.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || request.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Count requests by status
  const pendingCount = supplyRequests.filter((req) => req.status === "pending").length
  const approvedCount = supplyRequests.filter((req) => req.status === "approved").length
  const completedCount = supplyRequests.filter((req) => req.status === "completed").length
  const rejectedCount = supplyRequests.filter((req) => req.status === "rejected").length

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Supply Requests</h1>
          <p className="text-muted-foreground">Manage your supply requests</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4" />
              New Supply Request
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>New Supply Request</DialogTitle>
              <DialogDescription>Create a new supply request for your products.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="product">Product *</Label>
                  <Select value={formData.product} onValueChange={(value) => handleSelectChange("product", value)}>
                    <SelectTrigger id="product">
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockProducts.map((product) => (
                        <SelectItem key={product.id} value={product.name}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity *</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="quantity"
                      name="quantity"
                      type="number"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      placeholder="Enter quantity"
                      className="flex-1"
                    />
                    <span className="text-sm text-muted-foreground w-16">{formData.unit}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="deliveryDate">Delivery Date *</Label>
                <Input
                  id="deliveryDate"
                  name="deliveryDate"
                  type="date"
                  value={formData.deliveryDate}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Any special instructions or details..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Switch id="isUrgent" checked={formData.isUrgent} onCheckedChange={handleSwitchChange} />
                  <Label htmlFor="isUrgent">Mark as Urgent</Label>
                </div>
                <p className="text-xs text-muted-foreground">
                  Urgent requests will be prioritized but may incur additional fees.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>Submit Request</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="bg-blue-50 dark:bg-blue-950 border-blue-100 dark:border-blue-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>
        <Card className="bg-green-50 dark:bg-green-950 border-green-100 dark:border-green-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{approvedCount}</div>
            <p className="text-xs text-muted-foreground">Ready for delivery</p>
          </CardContent>
        </Card>
        <Card className="bg-purple-50 dark:bg-purple-950 border-purple-100 dark:border-purple-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{completedCount}</div>
            <p className="text-xs text-muted-foreground">Successfully delivered</p>
          </CardContent>
        </Card>
        <Card className="bg-red-50 dark:bg-red-950 border-red-100 dark:border-red-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">{rejectedCount}</div>
            <p className="text-xs text-muted-foreground">Not approved</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Supply Requests</CardTitle>
          <CardDescription>View and manage all your supply requests</CardDescription>
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
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span>Filter by Status</span>
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
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Request Date</TableHead>
                <TableHead>Delivery Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.length > 0 ? (
                filteredRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.product}</TableCell>
                    <TableCell>{request.quantity}</TableCell>
                    <TableCell>{request.requestDate}</TableCell>
                    <TableCell>{request.deliveryDate}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          request.status === "pending"
                            ? "bg-blue-500"
                            : request.status === "approved"
                              ? "bg-green-500"
                              : request.status === "completed"
                                ? "bg-purple-500"
                                : "bg-red-500"
                        }
                      >
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">{request.notes}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                    No supply requests found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-center border-t pt-4">
          <Button variant="outline" className="gap-2" onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            New Supply Request
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
