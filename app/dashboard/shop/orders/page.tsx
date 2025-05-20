"use client";

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Search,
  Filter,
  ArrowUpDown,
  Eye,
  Plus,
  CheckCircle,
  XCircle,
  Clock,
  TruckIcon,
} from "lucide-react";
import type { Order, OrderItem, Product } from "@/lib/types";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

// Mock data - would be replaced with actual API calls
const mockOrders: Order[] = [
  {
    id: "ORD-001",
    shopId: "SHOP-001",
    shopName: "Dairy Mart",
    date: "2023-04-01",
    status: "DELIVERED",
    items: [
      {
        productId: "1",
        productName: "Whole Milk",
        quantity: 20,
        price: 3.99,
        subtotal: 79.8,
      },
      {
        productId: "3",
        productName: "Cheddar Cheese",
        quantity: 5,
        price: 5.99,
        subtotal: 29.95,
      },
    ],
    total: 109.75,
    paymentStatus: "PAID",
    deliveryDate: "2023-04-03",
  },
  {
    id: "ORD-004",
    shopId: "SHOP-001",
    shopName: "Dairy Mart",
    date: "2023-04-03",
    status: "APPROVED",
    items: [
      {
        productId: "3",
        productName: "Cheddar Cheese",
        quantity: 12,
        price: 5.99,
        subtotal: 71.88,
      },
      {
        productId: "6",
        productName: "Whipped Cream",
        quantity: 5,
        price: 2.99,
        subtotal: 14.95,
      },
    ],
    total: 86.83,
    paymentStatus: "PAID",
    deliveryDate: "2023-04-05",
  },
  {
    id: "ORD-006",
    shopId: "SHOP-001",
    shopName: "Dairy Mart",
    date: "2023-04-05",
    status: "PENDING",
    items: [
      {
        productId: "2",
        productName: "Greek Yogurt",
        quantity: 25,
        price: 4.49,
        subtotal: 112.25,
      },
      {
        productId: "5",
        productName: "Chocolate Milk",
        quantity: 15,
        price: 4.29,
        subtotal: 64.35,
      },
    ],
    total: 176.6,
    paymentStatus: "UNPAID",
  },
];

// Mock products for order creation
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Whole Milk",
    price: 3.99,
    unit: "liter",
    category: "Milk",
    description: "Fresh whole milk",
    inStock: true,
    supplier: "Farm Fresh Dairy",
  },
  {
    id: "2",
    name: "Greek Yogurt",
    price: 4.49,
    unit: "cup",
    category: "Yogurt",
    description: "Creamy Greek yogurt",
    inStock: true,
    supplier: "Farm Fresh Dairy",
  },
  {
    id: "3",
    name: "Cheddar Cheese",
    price: 5.99,
    unit: "kg",
    category: "Cheese",
    description: "Aged cheddar cheese",
    inStock: true,
    supplier: "Cheese Masters",
  },
  {
    id: "4",
    name: "Salted Butter",
    price: 3.49,
    unit: "pack",
    category: "Butter",
    description: "Creamy, salted butter",
    inStock: true,
    supplier: "Dairy Delights",
  },
  {
    id: "5",
    name: "Chocolate Milk",
    price: 4.29,
    unit: "liter",
    category: "Milk",
    description: "Delicious chocolate milk",
    inStock: true,
    supplier: "Farm Fresh Dairy",
  },
  {
    id: "6",
    name: "Whipped Cream",
    price: 2.99,
    unit: "can",
    category: "Cream",
    description: "Light and fluffy whipped cream",
    inStock: true,
    supplier: "Dairy Delights",
  },
];

export default function ShopOrdersDashboard() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isViewOrderOpen, setIsViewOrderOpen] = useState(false);
  const [isCreateOrderOpen, setIsCreateOrderOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Order;
    direction: "ascending" | "descending";
  } | null>(null);

  // State for new order creation
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [notes, setNotes] = useState<string>("");

  const viewOrder = (order: Order) => {
    setCurrentOrder(order);
    setIsViewOrderOpen(true);
  };

  const requestSort = (key: keyof Order) => {
    let direction: "ascending" | "descending" = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handleAddItem = () => {
    if (!selectedProduct || quantity <= 0) return;

    const product = mockProducts.find((p) => p.id === selectedProduct);
    if (!product) return;

    const existingItemIndex = orderItems.findIndex(
      (item) => item.productId === selectedProduct
    );

    if (existingItemIndex >= 0) {
      // Update existing item
      const updatedItems = [...orderItems];
      const newQuantity = updatedItems[existingItemIndex].quantity + quantity;
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: newQuantity,
        subtotal: newQuantity * product.price,
      };
      setOrderItems(updatedItems);
    } else {
      // Add new item
      const newItem: OrderItem = {
        productId: product.id,
        productName: product.name,
        quantity: quantity,
        price: product.price,
        subtotal: quantity * product.price,
      };
      setOrderItems([...orderItems, newItem]);
    }

    setSelectedProduct("");
    setQuantity(1);
  };

  const handleRemoveItem = (productId: string) => {
    setOrderItems(orderItems.filter((item) => item.productId !== productId));
  };

  const handleCreateOrder = () => {
    if (orderItems.length === 0) {
      toast.error("Please add at least one item to the order");
      return;
    }

    // BACKEND INTEGRATION: Create order API call
    const total = orderItems.reduce((sum, item) => sum + item.subtotal, 0);
    const newOrder: Order = {
      id: `ORD-${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0")}`,
      shopId: "SHOP-001", // This would come from the logged-in user's shop
      shopName: "Dairy Mart", // This would come from the logged-in user's shop
      date: new Date().toISOString().split("T")[0],
      status: "PENDING",
      items: orderItems,
      total: total,
      paymentStatus: "UNPAID",
    };

    setOrders([...orders, newOrder]);
    toast.success("Order created successfully");
    setIsCreateOrderOpen(false);
    setOrderItems([]);
    setNotes("");
  };

  const handleCancelOrder = (id: string) => {
    // BACKEND INTEGRATION: Cancel order API call
    const updatedOrders = orders.map((order) =>
      order.id === id
        ? { ...order, status: "CANCELLED" as Order["status"] }
        : order
    );

    setOrders(updatedOrders);
    toast.success(`Order ${id} cancelled`);
  };

  // Apply filters and search
  let filteredOrders = [...orders];

  if (statusFilter !== "all") {
    filteredOrders = filteredOrders.filter(
      (order) => order.status === statusFilter
    );
  }

  if (searchTerm) {
    filteredOrders = filteredOrders.filter((order) =>
      order.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Apply sorting
  if (sortConfig !== null) {
    filteredOrders.sort((a, b) => {
      if ((a[sortConfig.key] ?? "") < (b[sortConfig.key] ?? "")) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if ((a[sortConfig.key] ?? "") > (b[sortConfig.key] ?? "")) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
  }

  // Calculate statistics
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(
    (order) => order.status === "PENDING"
  ).length;
  const completedOrders = orders.filter(
    (order) => order.status === "DELIVERED"
  ).length;

  const getStatusBadge = (status: Order["status"]) => {
    switch (status) {
      case "PENDING":
        return <Badge className="bg-amber-500">Pending</Badge>;
      case "APPROVED":
        return <Badge className="bg-blue-500">Approved</Badge>;
      case "SHIPPED":
        return <Badge className="bg-indigo-500">Shipped</Badge>;
      case "DELIVERED":
        return <Badge className="bg-green-500">Delivered</Badge>;
      case "CANCELLED":
        return <Badge className="bg-red-500">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "PENDING":
        return <Clock className="h-5 w-5 text-amber-500" />;
      case "APPROVED":
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
      case "SHIPPED":
        return <TruckIcon className="h-5 w-5 text-indigo-500" />;
      case "DELIVERED":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "CANCELLED":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-muted-foreground">Manage your shop orders</p>
        </div>
        <Dialog open={isCreateOrderOpen} onOpenChange={setIsCreateOrderOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4" />
              New Order
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Order</DialogTitle>
              <DialogDescription>
                Add products to your order and submit for processing.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-[1fr_auto] gap-2">
                <Select
                  value={selectedProduct}
                  onValueChange={setSelectedProduct}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockProducts.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name} - ${product.price.toFixed(2)}/
                        {product.unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Number.parseInt(e.target.value) || 1)
                    }
                    className="w-20"
                  />
                  <Button
                    type="button"
                    onClick={handleAddItem}
                    disabled={!selectedProduct}
                  >
                    Add
                  </Button>
                </div>
              </div>

              {orderItems.length > 0 && (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader className="bg-blue-50 dark:bg-gray-900">
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Subtotal</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orderItems.map((item) => (
                        <TableRow key={item.productId}>
                          <TableCell className="font-medium">
                            {item.productName}
                          </TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>${item.price.toFixed(2)}</TableCell>
                          <TableCell>${item.subtotal.toFixed(2)}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveItem(item.productId)}
                              className="h-8 w-8 p-0 text-red-500"
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={3} className="text-right font-bold">
                          Total
                        </TableCell>
                        <TableCell className="font-bold">
                          $
                          {orderItems
                            .reduce((sum, item) => sum + item.subtotal, 0)
                            .toFixed(2)}
                        </TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="notes">Order Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any special instructions or notes for this order"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCreateOrderOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateOrder}
                disabled={orderItems.length === 0}
              >
                Create Order
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 border-blue-100 dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {totalOrders}
            </div>
            <p className="text-sm text-muted-foreground">All time orders</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 border-blue-100 dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">
              Pending Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-500">
              {pendingOrders}
            </div>
            <p className="text-sm text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 border-blue-100 dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">
              Completed Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              {completedOrders}
            </div>
            <p className="text-sm text-muted-foreground">
              Successfully delivered
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-blue-100 dark:border-gray-700">
        <CardHeader>
          <CardTitle>Your Orders</CardTitle>
          <CardDescription>View and manage your orders</CardDescription>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
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
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="SHIPPED">Shipped</SelectItem>
                  <SelectItem value="DELIVERED">Delivered</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
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
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => requestSort("id")}
                  >
                    <div className="flex items-center gap-1">
                      Order ID
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => requestSort("date")}
                  >
                    <div className="flex items-center gap-1">
                      Date
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => requestSort("total")}
                  >
                    <div className="flex items-center gap-1">
                      Total
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => requestSort("status")}
                  >
                    <div className="flex items-center gap-1">
                      Status
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => requestSort("paymentStatus")}
                  >
                    <div className="flex items-center gap-1">
                      Payment
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow
                    key={order.id}
                    className="bg-white dark:bg-gray-950"
                  >
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>${order.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(order.status)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          order.paymentStatus === "PAID" ? "default" : "outline"
                        }
                        className={
                          order.paymentStatus === "PAID" ? "bg-green-500" : ""
                        }
                      >
                        {order.paymentStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => viewOrder(order)}
                          className="h-8 w-8"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {order.status === "PENDING" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCancelOrder(order.id)}
                            className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredOrders.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-4 text-muted-foreground"
                    >
                      No orders found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Order View Dialog */}
      <Dialog open={isViewOrderOpen} onOpenChange={setIsViewOrderOpen}>
        <DialogContent className="sm:max-w-[600px]">
          {currentOrder && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  Order {currentOrder.id}
                  {getStatusIcon(currentOrder.status)}
                </DialogTitle>
                <DialogDescription>
                  Order details and information
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Date
                    </h3>
                    <p>{currentOrder.date}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Status
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      {getStatusBadge(currentOrder.status)}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Payment
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant={
                          currentOrder.paymentStatus === "PAID"
                            ? "default"
                            : "outline"
                        }
                        className={
                          currentOrder.paymentStatus === "PAID"
                            ? "bg-green-500"
                            : ""
                        }
                      >
                        {currentOrder.paymentStatus}
                      </Badge>
                    </div>
                  </div>
                  {currentOrder.deliveryDate && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Delivery Date
                      </h3>
                      <p>{currentOrder.deliveryDate}</p>
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    Order Items
                  </h3>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader className="bg-blue-50 dark:bg-gray-900">
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead className="text-right">Subtotal</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentOrder.items.map((item) => (
                          <TableRow key={item.productId}>
                            <TableCell className="font-medium">
                              {item.productName}
                            </TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>${item.price.toFixed(2)}</TableCell>
                            <TableCell className="text-right">
                              ${item.subtotal.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell
                            colSpan={3}
                            className="text-right font-bold"
                          >
                            Total
                          </TableCell>
                          <TableCell className="text-right font-bold">
                            ${currentOrder.total.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
              <DialogFooter>
                {currentOrder.status === "PENDING" && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleCancelOrder(currentOrder.id);
                      setIsViewOrderOpen(false);
                    }}
                    className="text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-950"
                  >
                    Cancel Order
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => setIsViewOrderOpen(false)}
                >
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
