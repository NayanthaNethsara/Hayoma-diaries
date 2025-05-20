"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
import { Plus, Search, Filter, ArrowUpDown, AlertTriangle, CheckCircle2, ClipboardList } from "lucide-react"
import type { InventoryItem } from "@/lib/types"
import { toast } from "sonner"
import { Textarea } from "@/components/ui/textarea"

// Mock inventory data
const mockInventory: InventoryItem[] = [
  {
    id: "1",
    name: "Raw Milk",
    quantity: 500,
    unit: "liters",
    category: "Dairy Base",
    threshold: 100,
    supplier: "Farm Fresh Dairy",
    lastUpdated: "2023-05-15",
  },
  {
    id: "2",
    name: "Sugar",
    quantity: 200,
    unit: "kg",
    category: "Sweeteners",
    threshold: 50,
    supplier: "Sweet Supplies Inc.",
    lastUpdated: "2023-05-14",
  },
  {
    id: "3",
    name: "Vanilla Extract",
    quantity: 25,
    unit: "liters",
    category: "Flavoring",
    threshold: 10,
    supplier: "Flavor Masters",
    lastUpdated: "2023-05-10",
  },
  {
    id: "4",
    name: "Cocoa Powder",
    quantity: 75,
    unit: "kg",
    category: "Flavoring",
    threshold: 20,
    supplier: "Flavor Masters",
    lastUpdated: "2023-05-12",
  },
  {
    id: "5",
    name: "Yogurt Cultures",
    quantity: 15,
    unit: "packs",
    category: "Cultures",
    threshold: 5,
    supplier: "Bio Cultures Co.",
    lastUpdated: "2023-05-08",
  },
  {
    id: "6",
    name: "Cream",
    quantity: 150,
    unit: "liters",
    category: "Dairy Base",
    threshold: 30,
    supplier: "Farm Fresh Dairy",
    lastUpdated: "2023-05-13",
  },
  {
    id: "7",
    name: "Stabilizers",
    quantity: 8,
    unit: "kg",
    category: "Additives",
    threshold: 10,
    supplier: "Food Additives Inc.",
    lastUpdated: "2023-05-11",
  },
  {
    id: "8",
    name: "Fruit Puree",
    quantity: 100,
    unit: "kg",
    category: "Flavoring",
    threshold: 25,
    supplier: "Fruit Farms",
    lastUpdated: "2023-05-09",
  },
]

// Mock requests data
const mockRequests = [
  {
    id: "req1",
    materialName: "Yogurt Cultures",
    quantity: 20,
    unit: "packs",
    supplier: "Bio Cultures Co.",
    requestDate: "2023-05-16",
    status: "PENDING",
    urgency: "HIGH",
    notes: "Running low on cultures for yogurt production",
  },
  {
    id: "req2",
    materialName: "Stabilizers",
    quantity: 15,
    unit: "kg",
    supplier: "Food Additives Inc.",
    requestDate: "2023-05-15",
    status: "APPROVED",
    urgency: "MEDIUM",
    notes: "Need for next week's ice cream production",
  },
]

export default function AdminInventoryDashboard() {
  const [inventory, setInventory] = useState<InventoryItem[]>(mockInventory)
  const [requests, setRequests] = useState(mockRequests)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [supplierFilter, setSupplierFilter] = useState<string>("all")
  const [isAddItemOpen, setIsAddItemOpen] = useState(false)
  const [isRequestOpen, setIsRequestOpen] = useState(false)
  const [isViewRequestsOpen, setIsViewRequestsOpen] = useState(false)
  const [sortConfig, setSortConfig] = useState<{
    key: keyof InventoryItem
    direction: "ascending" | "descending"
  } | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    quantity: 0,
    unit: "",
    category: "",
    threshold: 0,
    supplier: "",
  })

  const [requestData, setRequestData] = useState({
    materialName: "",
    quantity: 0,
    unit: "",
    supplier: "",
    urgency: "MEDIUM",
    notes: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "quantity" || name === "threshold" ? Number.parseInt(value) || 0 : value,
    }))
  }

  const handleRequestInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setRequestData((prev) => ({
      ...prev,
      [name]: name === "quantity" ? Number.parseInt(value) || 0 : value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRequestSelectChange = (name: string, value: string) => {
    setRequestData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddItem = () => {
    // Validate form
    if (!formData.name || !formData.unit || !formData.category || !formData.supplier) {
      toast.error("Please fill in all required fields")
      return
    }

    // Create new item
    const newItem: InventoryItem = {
      id: Math.random().toString(36).substring(7),
      name: formData.name,
      quantity: formData.quantity,
      unit: formData.unit,
      category: formData.category,
      threshold: formData.threshold,
      supplier: formData.supplier,
      lastUpdated: new Date().toISOString().split("T")[0],
    }

    setInventory((prev) => [...prev, newItem])
    toast.success("Raw material added to inventory")
    setIsAddItemOpen(false)
    resetForm()
  }

  const handleRequestMaterial = () => {
    // Validate form
    if (!requestData.materialName || !requestData.quantity || !requestData.unit || !requestData.supplier) {
      toast.error("Please fill in all required fields")
      return
    }

    // Create new request
    const newRequest = {
      id: Math.random().toString(36).substring(7),
      materialName: requestData.materialName,
      quantity: requestData.quantity,
      unit: requestData.unit,
      supplier: requestData.supplier,
      requestDate: new Date().toISOString().split("T")[0],
      status: "PENDING",
      urgency: requestData.urgency,
      notes: requestData.notes,
    }

    setRequests((prev) => [...prev, newRequest])
    toast.success("Material request submitted successfully")
    setIsRequestOpen(false)
    resetRequestForm()
  }

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: newQuantity,
              lastUpdated: new Date().toISOString().split("T")[0],
            }
          : item,
      ),
    )
    toast.success("Inventory updated")
  }

  const resetForm = () => {
    setFormData({
      name: "",
      quantity: 0,
      unit: "",
      category: "",
      threshold: 0,
      supplier: "",
    })
  }

  const resetRequestForm = () => {
    setRequestData({
      materialName: "",
      quantity: 0,
      unit: "",
      supplier: "",
      urgency: "MEDIUM",
      notes: "",
    })
  }

  const requestSort = (key: keyof InventoryItem) => {
    let direction: "ascending" | "descending" = "ascending"
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  const initializeRequestForm = (item: InventoryItem) => {
    setRequestData({
      materialName: item.name,
      quantity: Math.max(item.threshold - item.quantity, 10),
      unit: item.unit,
      supplier: item.supplier,
      urgency: item.quantity <= item.threshold ? "HIGH" : "MEDIUM",
      notes: `Requesting additional ${item.name} for inventory replenishment.`,
    })
    setIsRequestOpen(true)
  }

  // Get unique categories and suppliers for filters
  const categories = Array.from(new Set(inventory.map((item) => item.category)))
  const suppliers = Array.from(new Set(inventory.map((item) => item.supplier)))

  // Apply filters and search
  let filteredInventory = [...inventory]

  if (categoryFilter !== "all") {
    filteredInventory = filteredInventory.filter((item) => item.category === categoryFilter)
  }

  if (supplierFilter !== "all") {
    filteredInventory = filteredInventory.filter((item) => item.supplier === supplierFilter)
  }

  if (searchTerm) {
    filteredInventory = filteredInventory.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.supplier.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }

  // Apply sorting
  if (sortConfig !== null) {
    filteredInventory.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? -1 : 1
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? 1 : -1
      }
      return 0
    })
  }

  return (
    <div className="space-y-6 bg-blue-50/30 dark:bg-gray-900/20 min-h-screen p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Raw Materials Inventory</h1>
          <p className="text-muted-foreground">Manage and track all raw materials for production</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAddItemOpen} onOpenChange={setIsAddItemOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4" />
                Add Material
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Add Raw Material</DialogTitle>
                <DialogDescription>
                  Add a new raw material to your inventory. Fill in all the details below.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Material Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter material name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                        <SelectItem value="Dairy Base">Dairy Base</SelectItem>
                        <SelectItem value="Flavoring">Flavoring</SelectItem>
                        <SelectItem value="Sweeteners">Sweeteners</SelectItem>
                        <SelectItem value="Additives">Additives</SelectItem>
                        <SelectItem value="Cultures">Cultures</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      name="quantity"
                      type="number"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      placeholder="Enter quantity"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unit">Unit</Label>
                    <Input
                      id="unit"
                      name="unit"
                      value={formData.unit}
                      onChange={handleInputChange}
                      placeholder="e.g., liters, kg, packs"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="threshold">Low Stock Threshold</Label>
                    <Input
                      id="threshold"
                      name="threshold"
                      type="number"
                      value={formData.threshold}
                      onChange={handleInputChange}
                      placeholder="Enter threshold"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="supplier">Supplier</Label>
                    <Select value={formData.supplier} onValueChange={(value) => handleSelectChange("supplier", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select supplier" />
                      </SelectTrigger>
                      <SelectContent>
                        {suppliers.map((supplier) => (
                          <SelectItem key={supplier} value={supplier}>
                            {supplier}
                          </SelectItem>
                        ))}
                        <SelectItem value="Farm Fresh Dairy">Farm Fresh Dairy</SelectItem>
                        <SelectItem value="Sweet Supplies Inc.">Sweet Supplies Inc.</SelectItem>
                        <SelectItem value="Flavor Masters">Flavor Masters</SelectItem>
                        <SelectItem value="Bio Cultures Co.">Bio Cultures Co.</SelectItem>
                        <SelectItem value="Food Additives Inc.">Food Additives Inc.</SelectItem>
                        <SelectItem value="Fruit Farms">Fruit Farms</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddItemOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddItem}>Add Material</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isViewRequestsOpen} onOpenChange={setIsViewRequestsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <ClipboardList className="h-4 w-4" />
                View Requests
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px]">
              <DialogHeader>
                <DialogTitle>Material Requests</DialogTitle>
                <DialogDescription>View all pending and approved material requests</DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Table>
                  <TableHeader className="bg-blue-50 dark:bg-gray-900">
                    <TableRow>
                      <TableHead>Material</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Urgency</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requests.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                          No material requests found
                        </TableCell>
                      </TableRow>
                    ) : (
                      requests.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell className="font-medium">{request.materialName}</TableCell>
                          <TableCell>
                            {request.quantity} {request.unit}
                          </TableCell>
                          <TableCell>{request.supplier}</TableCell>
                          <TableCell>{request.requestDate}</TableCell>
                          <TableCell>
                            <span
                              className={
                                request.status === "PENDING"
                                  ? "text-amber-500 font-medium"
                                  : request.status === "APPROVED"
                                    ? "text-green-500 font-medium"
                                    : "text-red-500 font-medium"
                              }
                            >
                              {request.status}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span
                              className={
                                request.urgency === "HIGH"
                                  ? "text-red-500 font-medium"
                                  : request.urgency === "MEDIUM"
                                    ? "text-amber-500 font-medium"
                                    : "text-blue-500 font-medium"
                              }
                            >
                              {request.urgency}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 border-blue-100 dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Total Materials</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{inventory.length}</div>
            <p className="text-sm text-muted-foreground">Across {categories.length} categories</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 border-blue-100 dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Low Stock Materials</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-500">
              {inventory.filter((item) => item.quantity <= item.threshold).length}
            </div>
            <p className="text-sm text-muted-foreground">Materials below threshold</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 border-blue-100 dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Pending Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {requests.filter((req) => req.status === "PENDING").length}
            </div>
            <p className="text-sm text-muted-foreground">Material requests awaiting approval</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-blue-100 dark:border-gray-700">
        <CardHeader>
          <CardTitle>Raw Materials</CardTitle>
          <CardDescription>Manage your raw materials inventory for production</CardDescription>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search materials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 bg-white dark:bg-gray-950"
              />
            </div>
            <div className="flex gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[150px] bg-white dark:bg-gray-950">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <span>Category</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={supplierFilter} onValueChange={setSupplierFilter}>
                <SelectTrigger className="w-[150px] bg-white dark:bg-gray-950">
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
          <div className="rounded-md border border-blue-100 dark:border-gray-800">
            <Table>
              <TableHeader className="bg-blue-50 dark:bg-gray-900">
                <TableRow>
                  <TableHead className="cursor-pointer" onClick={() => requestSort("name")}>
                    <div className="flex items-center gap-1">
                      Material Name
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => requestSort("category")}>
                    <div className="flex items-center gap-1">
                      Category
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => requestSort("quantity")}>
                    <div className="flex items-center gap-1">
                      Quantity
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => requestSort("supplier")}>
                    <div className="flex items-center gap-1">
                      Supplier
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => requestSort("lastUpdated")}>
                    <div className="flex items-center gap-1">
                      Last Updated
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                      Loading materials...
                    </TableCell>
                  </TableRow>
                ) : (
                  <>
                    {filteredInventory.map((item) => (
                      <TableRow key={item.id} className="bg-white dark:bg-gray-950">
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className={item.quantity <= item.threshold ? "text-red-500 font-medium" : ""}>
                              {item.quantity}
                            </span>
                            {item.quantity <= item.threshold && <AlertTriangle className="h-4 w-4 text-amber-500" />}
                          </div>
                        </TableCell>
                        <TableCell>{item.unit}</TableCell>
                        <TableCell>{item.supplier}</TableCell>
                        <TableCell>{item.lastUpdated}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                              className="h-8 w-8 p-0 border-blue-200 dark:border-gray-700"
                            >
                              +
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                              disabled={item.quantity <= 0}
                              className="h-8 w-8 p-0 border-blue-200 dark:border-gray-700"
                            >
                              -
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => initializeRequestForm(item)}
                              className="border-blue-200 dark:border-gray-700"
                            >
                              Request
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredInventory.length === 0 && !isLoading && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                          No materials found
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card className="border-blue-100 dark:border-gray-700 bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
        <CardHeader>
          <CardTitle>Stock Status</CardTitle>
          <CardDescription>Overview of current raw materials levels</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categories.map((category) => {
              const categoryItems = inventory.filter((item) => item.category === category)
              const totalItems = categoryItems.length
              const lowStockItems = categoryItems.filter((item) => item.quantity <= item.threshold).length
              const healthyStockItems = totalItems - lowStockItems
              const healthyPercentage = totalItems > 0 ? (healthyStockItems / totalItems) * 100 : 0

              return (
                <div key={category}>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm font-medium">{category}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {healthyStockItems}/{totalItems} items healthy
                      </span>
                      {lowStockItems > 0 ? (
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                    <div className="h-full rounded-full bg-blue-500" style={{ width: `${healthyPercentage}%` }}></div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isRequestOpen} onOpenChange={setIsRequestOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Request Raw Material</DialogTitle>
            <DialogDescription>Submit a request for additional raw materials from suppliers</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="materialName">Material Name</Label>
                <Input
                  id="materialName"
                  name="materialName"
                  value={requestData.materialName}
                  onChange={handleRequestInputChange}
                  placeholder="Enter material name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supplier">Supplier</Label>
                <Select
                  value={requestData.supplier}
                  onValueChange={(value) => handleRequestSelectChange("supplier", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map((supplier) => (
                      <SelectItem key={supplier} value={supplier}>
                        {supplier}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  value={requestData.quantity}
                  onChange={handleRequestInputChange}
                  placeholder="Enter quantity"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit">Unit</Label>
                <Input
                  id="unit"
                  name="unit"
                  value={requestData.unit}
                  onChange={handleRequestInputChange}
                  placeholder="e.g., liters, kg, packs"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="urgency">Urgency</Label>
              <Select
                value={requestData.urgency}
                onValueChange={(value) => handleRequestSelectChange("urgency", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select urgency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                value={requestData.notes}
                onChange={handleRequestInputChange}
                placeholder="Add any additional notes or requirements"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRequestOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRequestMaterial}>Submit Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
