"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Edit, Trash2, User, Truck, Phone, Mail } from "lucide-react"
import { toast } from "sonner"

// Mock data for drivers
const initialDrivers = [
  {
    id: "D1",
    name: "John Driver",
    email: "john@hayomadairy.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main St, Anytown, USA",
    licenseNumber: "DL-12345678",
    vehicleType: "Refrigerated Truck",
    vehicleNumber: "TR-789",
    status: "active",
    hireDate: "2022-03-15",
    deliveriesCompleted: 156,
    rating: 4.8,
  },
  {
    id: "D2",
    name: "Sarah Driver",
    email: "sarah@hayomadairy.com",
    phone: "+1 (555) 987-6543",
    address: "456 Oak Ave, Somewhere, USA",
    licenseNumber: "DL-87654321",
    vehicleType: "Van",
    vehicleNumber: "VN-456",
    status: "active",
    hireDate: "2022-05-20",
    deliveriesCompleted: 132,
    rating: 4.9,
  },
  {
    id: "D3",
    name: "Mike Driver",
    email: "mike@hayomadairy.com",
    phone: "+1 (555) 456-7890",
    address: "789 Pine Blvd, Elsewhere, USA",
    licenseNumber: "DL-56781234",
    vehicleType: "Refrigerated Truck",
    vehicleNumber: "TR-123",
    status: "inactive",
    hireDate: "2021-11-10",
    deliveriesCompleted: 203,
    rating: 4.5,
  },
  {
    id: "D4",
    name: "Lisa Driver",
    email: "lisa@hayomadairy.com",
    phone: "+1 (555) 789-0123",
    address: "321 Elm St, Nowhere, USA",
    licenseNumber: "DL-43218765",
    vehicleType: "Van",
    vehicleNumber: "VN-789",
    status: "active",
    hireDate: "2023-01-05",
    deliveriesCompleted: 87,
    rating: 4.7,
  },
]

export default function DriversManagement() {
  const [drivers, setDrivers] = useState(initialDrivers)
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedDriver, setSelectedDriver] = useState<any>(null)
  const [newDriver, setNewDriver] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    licenseNumber: "",
    vehicleType: "Refrigerated Truck",
    vehicleNumber: "",
    status: "active",
  })

  const handleCreateDriver = () => {
    // Validate form
    if (
      !newDriver.name ||
      !newDriver.email ||
      !newDriver.phone ||
      !newDriver.licenseNumber ||
      !newDriver.vehicleNumber
    ) {
      toast.error("Please fill in all required fields")
      return
    }

    // Create new driver
    const driver = {
      id: `D${drivers.length + 1}`,
      ...newDriver,
      hireDate: new Date().toISOString().split("T")[0],
      deliveriesCompleted: 0,
      rating: 0,
    }

    setDrivers([...drivers, driver])
    setIsCreateDialogOpen(false)
    toast.success("Driver created successfully")

    // Reset form
    setNewDriver({
      name: "",
      email: "",
      phone: "",
      address: "",
      licenseNumber: "",
      vehicleType: "Refrigerated Truck",
      vehicleNumber: "",
      status: "active",
    })
  }

  const handleEditDriver = () => {
    if (!selectedDriver) return

    // Validate form
    if (
      !selectedDriver.name ||
      !selectedDriver.email ||
      !selectedDriver.phone ||
      !selectedDriver.licenseNumber ||
      !selectedDriver.vehicleNumber
    ) {
      toast.error("Please fill in all required fields")
      return
    }

    // Update driver
    setDrivers(drivers.map((driver) => (driver.id === selectedDriver.id ? { ...selectedDriver } : driver)))
    setIsEditDialogOpen(false)
    toast.success("Driver updated successfully")
  }

  const handleDeleteDriver = () => {
    if (!selectedDriver) return

    setDrivers(drivers.filter((driver) => driver.id !== selectedDriver.id))
    setIsDeleteDialogOpen(false)
    toast.success("Driver deleted successfully")
  }

  const handleDriverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSelectedDriver((prev: any) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleNewDriverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewDriver((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Filter drivers based on search term
  const filteredDrivers = drivers.filter(
    (driver) =>
      driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.phone.includes(searchTerm) ||
      driver.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Count active and inactive drivers
  const activeDrivers = drivers.filter((driver) => driver.status === "active").length
  const inactiveDrivers = drivers.filter((driver) => driver.status === "inactive").length

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Driver Management</h1>
          <p className="text-muted-foreground">Manage your delivery drivers</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Driver
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Driver</DialogTitle>
              <DialogDescription>Enter the details of the new driver.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={newDriver.name}
                    onChange={handleNewDriverChange}
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={newDriver.email}
                    onChange={handleNewDriverChange}
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={newDriver.phone}
                    onChange={handleNewDriverChange}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="licenseNumber">License Number *</Label>
                  <Input
                    id="licenseNumber"
                    name="licenseNumber"
                    value={newDriver.licenseNumber}
                    onChange={handleNewDriverChange}
                    placeholder="DL-12345678"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={newDriver.address}
                  onChange={handleNewDriverChange}
                  placeholder="123 Main St, Anytown, USA"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vehicleType">Vehicle Type *</Label>
                  <Select
                    value={newDriver.vehicleType}
                    onValueChange={(value) => setNewDriver({ ...newDriver, vehicleType: value })}
                  >
                    <SelectTrigger id="vehicleType">
                      <SelectValue placeholder="Select vehicle type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Refrigerated Truck">Refrigerated Truck</SelectItem>
                      <SelectItem value="Van">Van</SelectItem>
                      <SelectItem value="Pickup Truck">Pickup Truck</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vehicleNumber">Vehicle Number *</Label>
                  <Input
                    id="vehicleNumber"
                    name="vehicleNumber"
                    value={newDriver.vehicleNumber}
                    onChange={handleNewDriverChange}
                    placeholder="TR-123"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={newDriver.status}
                  onValueChange={(value) => setNewDriver({ ...newDriver, status: value })}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateDriver}>Add Driver</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Drivers</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{drivers.length}</div>
            <p className="text-xs text-muted-foreground">Registered drivers</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Drivers</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeDrivers}</div>
            <p className="text-xs text-muted-foreground">Currently available</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Inactive Drivers</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inactiveDrivers}</div>
            <p className="text-xs text-muted-foreground">Not currently available</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Drivers</CardTitle>
          <CardDescription>Manage your delivery drivers and their information.</CardDescription>
          <div className="mt-4 relative">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search drivers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDrivers.length > 0 ? (
                filteredDrivers.map((driver) => (
                  <TableRow key={driver.id}>
                    <TableCell>
                      <div className="font-medium">{driver.name}</div>
                      <div className="text-sm text-muted-foreground">ID: {driver.id}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{driver.email}</span>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{driver.phone}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{driver.vehicleType}</div>
                      <div className="text-sm text-muted-foreground">{driver.vehicleNumber}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={driver.status === "active" ? "default" : "secondary"} className="capitalize">
                        {driver.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{driver.deliveriesCompleted} deliveries</div>
                      <div className="text-sm text-muted-foreground">
                        Rating: {driver.rating > 0 ? driver.rating.toFixed(1) : "N/A"}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedDriver(driver)
                            setIsEditDialogOpen(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => {
                            setSelectedDriver(driver)
                            setIsDeleteDialogOpen(true)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                    No drivers found. Try a different search term or add a new driver.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Driver Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Driver</DialogTitle>
            <DialogDescription>Update the driver's information.</DialogDescription>
          </DialogHeader>
          {selectedDriver && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Full Name *</Label>
                  <Input id="edit-name" name="name" value={selectedDriver.name} onChange={handleDriverChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email *</Label>
                  <Input
                    id="edit-email"
                    name="email"
                    type="email"
                    value={selectedDriver.email}
                    onChange={handleDriverChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-phone">Phone Number *</Label>
                  <Input id="edit-phone" name="phone" value={selectedDriver.phone} onChange={handleDriverChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-licenseNumber">License Number *</Label>
                  <Input
                    id="edit-licenseNumber"
                    name="licenseNumber"
                    value={selectedDriver.licenseNumber}
                    onChange={handleDriverChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-address">Address</Label>
                <Input id="edit-address" name="address" value={selectedDriver.address} onChange={handleDriverChange} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-vehicleType">Vehicle Type *</Label>
                  <Select
                    value={selectedDriver.vehicleType}
                    onValueChange={(value) => setSelectedDriver({ ...selectedDriver, vehicleType: value })}
                  >
                    <SelectTrigger id="edit-vehicleType">
                      <SelectValue placeholder="Select vehicle type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Refrigerated Truck">Refrigerated Truck</SelectItem>
                      <SelectItem value="Van">Van</SelectItem>
                      <SelectItem value="Pickup Truck">Pickup Truck</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-vehicleNumber">Vehicle Number *</Label>
                  <Input
                    id="edit-vehicleNumber"
                    name="vehicleNumber"
                    value={selectedDriver.vehicleNumber}
                    onChange={handleDriverChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={selectedDriver.status}
                  onValueChange={(value) => setSelectedDriver({ ...selectedDriver, status: value })}
                >
                  <SelectTrigger id="edit-status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditDriver}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Driver Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Delete Driver</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this driver? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedDriver && (
            <div className="py-4">
              <div className="rounded-lg border p-4">
                <div className="font-medium">{selectedDriver.name}</div>
                <div className="text-sm text-muted-foreground">ID: {selectedDriver.id}</div>
                <div className="mt-2 flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{selectedDriver.email}</span>
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{selectedDriver.phone}</span>
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <Truck className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {selectedDriver.vehicleType} ({selectedDriver.vehicleNumber})
                  </span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteDriver}>
              Delete Driver
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
