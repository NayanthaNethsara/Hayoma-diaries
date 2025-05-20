"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Search } from "lucide-react";
import type { InventoryItem } from "@/lib/types";

// Mock data - would be replaced with actual API calls
const mockInventory: InventoryItem[] = [
  {
    id: "1",
    name: "Milk",
    quantity: 50,
    unit: "liters",
    category: "Dairy",
    lastUpdated: new Date().toISOString(),
    threshold: 10,
    supplier: "Supplier A",
  },
  {
    id: "2",
    name: "Cheese",
    quantity: 25,
    unit: "kg",
    category: "Dairy",
    lastUpdated: new Date().toISOString(),
    threshold: 5,
    supplier: "Supplier B",
  },
  {
    id: "3",
    name: "Yogurt",
    quantity: 100,
    unit: "cups",
    category: "Dairy",
    lastUpdated: new Date().toISOString(),
    threshold: 20,
    supplier: "Supplier C",
  },
  {
    id: "4",
    name: "Butter",
    quantity: 30,
    unit: "packs",
    category: "Dairy",
    lastUpdated: new Date().toISOString(),
    threshold: 8,
    supplier: "Supplier D",
  },
  {
    id: "5",
    name: "Cream",
    quantity: 20,
    unit: "liters",
    category: "Dairy",
    lastUpdated: new Date().toISOString(),
    threshold: 6,
    supplier: "Supplier E",
  },
];

export default function ShopInventory() {
  const [inventory, setInventory] = useState<InventoryItem[]>(mockInventory);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    quantity: 0,
    unit: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "quantity" ? Number.parseInt(value) || 0 : value,
    }));
  };

  const handleAddItem = () => {
    // BACKEND INTEGRATION: Add inventory item API call
    const newItem: InventoryItem = {
      id: Math.random().toString(36).substring(7),
      name: formData.name,
      quantity: formData.quantity,
      unit: formData.unit,
      category: "Uncategorized",
      lastUpdated: new Date().toISOString(),
      threshold: 0,
      supplier: "Unknown",
    };

    setInventory((prev) => [...prev, newItem]);
    toast.success("Item added to inventory");
    setIsAddItemOpen(false);
    resetForm();
  };

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    // BACKEND INTEGRATION: Update inventory quantity API call
    const updatedInventory = inventory.map((item) =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );

    setInventory(updatedInventory);
    toast.success("Inventory updated");
  };

  const resetForm = () => {
    setFormData({
      name: "",
      quantity: 0,
      unit: "",
    });
  };

  const filteredInventory = inventory.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Shop Inventory</h1>
        <Dialog open={isAddItemOpen} onOpenChange={setIsAddItemOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Inventory Item</DialogTitle>
              <DialogDescription>
                Add a new item to your shop's inventory.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Item Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter item name"
                />
              </div>
              <div className="grid gap-2">
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
              <div className="grid gap-2">
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
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddItemOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddItem}>Add Item</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inventory Items</CardTitle>
          <CardDescription>
            Manage your shop's inventory items and quantities.
          </CardDescription>
          <div className="flex items-center gap-2 mt-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item Name</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInventory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.unit}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleUpdateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        +
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleUpdateQuantity(
                            item.id,
                            Math.max(0, item.quantity - 1)
                          )
                        }
                        disabled={item.quantity <= 0}
                      >
                        -
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredInventory.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-4 text-muted-foreground"
                  >
                    No items found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
