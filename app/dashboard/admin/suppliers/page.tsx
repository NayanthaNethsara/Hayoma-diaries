"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Search, Plus, Edit, Trash2, Package } from "lucide-react"
import { toast } from "sonner"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { mockSuppliers } from "@/lib/mock-data" // Add this import

// Supplier type definition
interface Supplier {
  id: string
  name: string
  address: string
  phone: string
  email: string
  contactPerson: string
  category: string
  isActive: boolean
  notes?: string
}

export default function SupplierManagement() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isAddSupplierOpen, setIsAddSupplierOpen] = useState(false)
  const [isEditSupplierOpen, setIsEditSupplierOpen] = useState(false)
  const [currentSupplier, setCurrentSupplier] = useState<Supplier | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    contactPerson: "",
    category: "dairy",
    isActive: true,
    notes: "",
  })

  // Fetch suppliers data
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        setIsLoading(true)
        // In a real app, this would be an API call
        // const response = await fetch("/api/suppliers")
        // if (!response.ok) {
        //   throw new Error("Failed to fetch suppliers")
        // }
        // const data = await response.json()

        // Use mock data instead
        setSuppliers(mockSuppliers)
      } catch (error) {
        console.error("Failed to fetch suppliers:", error)
        toast.error("Failed to load supplier data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchSuppliers()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isActive: checked }))
  }

  const handleAddSupplier = async () => {
    try {
      // In a real app, this would be an API call
      // const response = await fetch("/api/suppliers", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(formData),
      // })
      //
      // if (!response.ok) {
      //   throw new Error("Failed to add supplier")
      // }
      //
      // const newSupplier = await response.json()

      // Create a new supplier with mock ID
      const newSupplier = {
        id: `sup${suppliers.length + 1}`,
        ...formData,
      }

      setSuppliers((prev) => [...prev, newSupplier])
      toast.success("Supplier added successfully")
      setIsAddSupplierOpen(false)
      resetForm()
    } catch (error) {
      console.error("Failed to add supplier:", error)
      toast.error("Failed to add supplier")
    }
  }

  const handleEditSupplier = async () => {
    try {
      if (!currentSupplier) return

      // In a real app, this would be an API call
      // const response = await fetch(`/api/suppliers/${currentSupplier.id}`, {
      //   method: "PUT",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(formData),
      // })
      //
      // if (!response.ok) {
      //   throw new Error("Failed to update supplier")
      // }
      //
      // const updatedSupplier = await response.json()

      // Update supplier locally
      const updatedSupplier = {
        ...currentSupplier,
        ...formData,
      }

      setSuppliers((prev) => prev.map((supplier) => (supplier.id === currentSupplier.id ? updatedSupplier : supplier)))
      toast.success("Supplier updated successfully")
      setIsEditSupplierOpen(false)
      resetForm()
    } catch (error) {
      console.error("Failed to update supplier:", error)
      toast.error("Failed to update supplier")
    }
  }

  const handleDeleteSupplier = async (id: string) => {
    try {
      // In a real app, this would be an API call
      // const response = await fetch(`/api/suppliers/${id}`, {
      //   method: "DELETE",
      // })
      //
      // if (!response.ok) {
      //   throw new Error("Failed to delete supplier")
      // }

      // Just filter locally
      setSuppliers((prev) => prev.filter((supplier) => supplier.id !== id))
      toast.success("Supplier deleted successfully")
    } catch (error) {
      console.error("Failed to delete supplier:", error)
      toast.error("Failed to delete supplier")
    }
  }

  const openEditDialog = (supplier: Supplier) => {
    setCurrentSupplier(supplier)
    setFormData({
      name: supplier.name,
      address: supplier.address,
      phone: supplier.phone,
      email: supplier.email,
      contactPerson: supplier.contactPerson,
      category: supplier.category,
      isActive: supplier.isActive,
      notes: supplier.notes || "",
    })
    setIsEditSupplierOpen(true)
  }

  const resetForm = () => {
    setFormData({
      name: "",
      address: "",
      phone: "",
      email: "",
      contactPerson: "",
      category: "dairy",
      isActive: true,
      notes: "",
    })
    setCurrentSupplier(null)
  }

  // Get unique categories for filters
  const categories = Array.from(new Set(suppliers.map((supplier) => supplier.category)))

  // Filter suppliers based on search term and filters
  let filteredSuppliers = [...suppliers]

  if (categoryFilter !== "all") {
    filteredSuppliers = filteredSuppliers.filter((supplier) => supplier.category === categoryFilter)
  }

  if (statusFilter !== "all") {
    filteredSuppliers = filteredSuppliers.filter((supplier) =>
      statusFilter === "active" ? supplier.isActive : !supplier.isActive,
    )
  }

  if (searchTerm) {
    filteredSuppliers = filteredSuppliers.filter(
      (supplier) =>
        supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Supplier Management</h1>
          <p className="text-muted-foreground">Manage all suppliers in the system</p>
        </div>
        <Dialog open={isAddSupplierOpen} onOpenChange={setIsAddSupplierOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4" />
              Add Supplier
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Add New Supplier</DialogTitle>
              <DialogDescription>Add a new supplier to the system. Fill in all the details below.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Supplier Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter supplier name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPerson">Contact Person</Label>
                  <Input
                    id="contactPerson"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleInputChange}
                    placeholder="Enter contact person name"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter supplier address"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter phone number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter email address"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dairy">Dairy</SelectItem>
                      <SelectItem value="packaging">Packaging</SelectItem>
                      <SelectItem value="equipment">Equipment</SelectItem>
                      <SelectItem value="ingredients">Ingredients</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="isActive" className="block mb-2">
                    Status
                  </Label>
                  <div className="flex items-center gap-2">
                    <Switch id="isActive" checked={formData.isActive} onCheckedChange={handleSwitchChange} />
                    <Label htmlFor="isActive">{formData.isActive ? "Active" : "Inactive"}</Label>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Enter additional notes"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddSupplierOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddSupplier}>Add Supplier</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Suppliers</CardTitle>
          <CardDescription>Manage all suppliers in the system</CardDescription>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search suppliers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <div className="flex gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[150px]">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    <span>Category</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <div className="flex items-center gap-2">
                    <span>Status</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <p>Loading suppliers...</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Supplier Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Contact Person</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSuppliers.length > 0 ? (
                    filteredSuppliers.map((supplier) => (
                      <TableRow key={supplier.id}>
                        <TableCell className="font-medium">{supplier.name}</TableCell>
                        <TableCell className="capitalize">{supplier.category}</TableCell>
                        <TableCell>{supplier.contactPerson}</TableCell>
                        <TableCell>{supplier.phone}</TableCell>
                        <TableCell>
                          <div
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              supplier.isActive
                                ? "bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400"
                                : "bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-400"
                            }`}
                          >
                            {supplier.isActive ? "Active" : "Inactive"}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => openEditDialog(supplier)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteSupplier(supplier.id)}
                              className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                        {searchTerm || categoryFilter !== "all" || statusFilter !== "all"
                          ? "No suppliers found matching your search"
                          : "No suppliers added yet"}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Supplier Dialog */}
      <Dialog open={isEditSupplierOpen} onOpenChange={setIsEditSupplierOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Edit Supplier</DialogTitle>
            <DialogDescription>Update supplier information</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Supplier Name</Label>
                <Input id="edit-name" name="name" value={formData.name} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-contactPerson">Contact Person</Label>
                <Input
                  id="edit-contactPerson"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-address">Address</Label>
              <Input id="edit-address" name="address" value={formData.address} onChange={handleInputChange} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Phone</Label>
                <Input id="edit-phone" name="phone" value={formData.phone} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input id="edit-email" name="email" type="email" value={formData.email} onChange={handleInputChange} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                  <SelectTrigger id="edit-category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dairy">Dairy</SelectItem>
                    <SelectItem value="packaging">Packaging</SelectItem>
                    <SelectItem value="equipment">Equipment</SelectItem>
                    <SelectItem value="ingredients">Ingredients</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-isActive" className="block mb-2">
                  Status
                </Label>
                <div className="flex items-center gap-2">
                  <Switch id="edit-isActive" checked={formData.isActive} onCheckedChange={handleSwitchChange} />
                  <Label htmlFor="edit-isActive">{formData.isActive ? "Active" : "Inactive"}</Label>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-notes">Notes (Optional)</Label>
              <Textarea id="edit-notes" name="notes" value={formData.notes} onChange={handleInputChange} rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditSupplierOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditSupplier}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
