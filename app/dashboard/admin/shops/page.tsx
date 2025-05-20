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
import { Search, Plus, Edit, Trash2, MapPin } from "lucide-react"
import { toast } from "sonner"
import { Textarea } from "@/components/ui/textarea"
import { mockShops } from "@/lib/mock-data" // Add this import

// Shop type definition
interface Shop {
  id: string
  name: string
  address: string
  phone: string
  email: string
  contactPerson: string
  notes?: string
}

export default function ShopManagement() {
  const [shops, setShops] = useState<Shop[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddShopOpen, setIsAddShopOpen] = useState(false)
  const [isEditShopOpen, setIsEditShopOpen] = useState(false)
  const [currentShop, setCurrentShop] = useState<Shop | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    contactPerson: "",
    notes: "",
  })

  // Fetch shops data
  useEffect(() => {
    const fetchShops = async () => {
      try {
        setIsLoading(true)
        // In a real app, this would be an API call
        // const response = await fetch("/api/shops")
        // if (!response.ok) {
        //   throw new Error("Failed to fetch shops")
        // }
        // const data = await response.json()

        // Use mock data instead
        setShops(mockShops)
      } catch (error) {
        console.error("Failed to fetch shops:", error)
        toast.error("Failed to load shop data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchShops()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddShop = async () => {
    try {
      // In a real app, this would be an API call
      // const response = await fetch("/api/shops", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(formData),
      // })
      //
      // if (!response.ok) {
      //   throw new Error("Failed to add shop")
      // }
      //
      // const newShop = await response.json()

      // Create a new shop with mock ID
      const newShop = {
        id: `shop${shops.length + 1}`,
        ...formData,
      }

      setShops((prev) => [...prev, newShop])
      toast.success("Shop added successfully")
      setIsAddShopOpen(false)
      resetForm()
    } catch (error) {
      console.error("Failed to add shop:", error)
      toast.error("Failed to add shop")
    }
  }

  const handleEditShop = async () => {
    try {
      if (!currentShop) return

      // In a real app, this would be an API call
      // const response = await fetch(`/api/shops/${currentShop.id}`, {
      //   method: "PUT",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(formData),
      // })
      //
      // if (!response.ok) {
      //   throw new Error("Failed to update shop")
      // }
      //
      // const updatedShop = await response.json()

      // Update shop locally
      const updatedShop = {
        ...currentShop,
        ...formData,
      }

      setShops((prev) => prev.map((shop) => (shop.id === currentShop.id ? updatedShop : shop)))
      toast.success("Shop updated successfully")
      setIsEditShopOpen(false)
      resetForm()
    } catch (error) {
      console.error("Failed to update shop:", error)
      toast.error("Failed to update shop")
    }
  }

  const handleDeleteShop = async (id: string) => {
    try {
      // In a real app, this would be an API call
      // const response = await fetch(`/api/shops/${id}`, {
      //   method: "DELETE",
      // })
      //
      // if (!response.ok) {
      //   throw new Error("Failed to delete shop")
      // }

      // Just filter locally
      setShops((prev) => prev.filter((shop) => shop.id !== id))
      toast.success("Shop deleted successfully")
    } catch (error) {
      console.error("Failed to delete shop:", error)
      toast.error("Failed to delete shop")
    }
  }

  const openEditDialog = (shop: Shop) => {
    setCurrentShop(shop)
    setFormData({
      name: shop.name,
      address: shop.address,
      phone: shop.phone,
      email: shop.email,
      contactPerson: shop.contactPerson,
      notes: shop.notes || "",
    })
    setIsEditShopOpen(true)
  }

  const resetForm = () => {
    setFormData({
      name: "",
      address: "",
      phone: "",
      email: "",
      contactPerson: "",
      notes: "",
    })
    setCurrentShop(null)
  }

  // Filter shops based on search term
  const filteredShops = shops.filter(
    (shop) =>
      shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shop.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shop.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Shop Management</h1>
          <p className="text-muted-foreground">Manage all shops in the system</p>
        </div>
        <Dialog open={isAddShopOpen} onOpenChange={setIsAddShopOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4" />
              Add Shop
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Add New Shop</DialogTitle>
              <DialogDescription>Add a new shop to the system. Fill in all the details below.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Shop Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter shop name"
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
                  placeholder="Enter shop address"
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
              <Button variant="outline" onClick={() => setIsAddShopOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddShop}>Add Shop</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Shops</CardTitle>
          <CardDescription>Manage all shops in the system</CardDescription>
          <div className="flex items-center gap-2 mt-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search shops..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <p>Loading shops...</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Shop Name</TableHead>
                    <TableHead>Contact Person</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredShops.length > 0 ? (
                    filteredShops.map((shop) => (
                      <TableRow key={shop.id}>
                        <TableCell className="font-medium">{shop.name}</TableCell>
                        <TableCell>{shop.contactPerson}</TableCell>
                        <TableCell>{shop.phone}</TableCell>
                        <TableCell>{shop.email}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            <span className="truncate max-w-[200px]">{shop.address}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => openEditDialog(shop)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteShop(shop.id)}
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
                        {searchTerm ? "No shops found matching your search" : "No shops added yet"}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Shop Dialog */}
      <Dialog open={isEditShopOpen} onOpenChange={setIsEditShopOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Edit Shop</DialogTitle>
            <DialogDescription>Update shop information</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Shop Name</Label>
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
            <div className="space-y-2">
              <Label htmlFor="edit-notes">Notes (Optional)</Label>
              <Textarea id="edit-notes" name="notes" value={formData.notes} onChange={handleInputChange} rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditShopOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditShop}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
