"use client";

import { useState, useEffect } from "react";
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
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type OrderItem = {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
};

type Order = {
  id: number;
  orderId: string;
  date: string;
  total: number;
  status: string;
  payment: string;
  shopId: number;
  items?: OrderItem[];
};

type Product = {
  id: string;
  name: string;
  price: number;
  unit: string;
  category: string;
  description: string;
  inStock: boolean;
  supplier: string;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [errorOrders, setErrorOrders] = useState<string | null>(null);
  const [errorProducts, setErrorProducts] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Order;
    direction: "ascending" | "descending";
  } | null>(null);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [isViewOrderOpen, setIsViewOrderOpen] = useState(false);
  const [isCreateOrderOpen, setIsCreateOrderOpen] = useState(false);

  // New order states
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [notes, setNotes] = useState<string>("");

  // Fetch orders
  useEffect(() => {
    setLoadingOrders(true);
    fetch("/api/orders")
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Failed to fetch orders");
        }
        return res.json();
      })
      .then((data: Order[]) => setOrders(data))
      .catch((err) => {
        setErrorOrders(err.message);
        console.error(err);
      })
      .finally(() => setLoadingOrders(false));
  }, []);

  // Fetch products
  useEffect(() => {
    setLoadingProducts(true);
    fetch("/api/products")
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Failed to fetch products");
        }
        return res.json();
      })
      .then((data: Product[]) => setProducts(data))
      .catch((err) => {
        setErrorProducts(err.message);
        console.error(err);
      })
      .finally(() => setLoadingProducts(false));
  }, []);

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

  const viewOrder = (order: Order) => {
    setCurrentOrder(order);
    setIsViewOrderOpen(true);
  };

  const handleAddItem = () => {
    if (!selectedProduct || quantity <= 0) return;

    const product = products.find((p) => p.id === selectedProduct);
    if (!product) return;

    const existingIndex = orderItems.findIndex(
      (item) => item.productId === selectedProduct
    );

    if (existingIndex >= 0) {
      const updated = [...orderItems];
      const newQty = updated[existingIndex].quantity + quantity;
      updated[existingIndex] = {
        ...updated[existingIndex],
        quantity: newQty,
        subtotal: newQty * product.price,
      };
      setOrderItems(updated);
    } else {
      setOrderItems([
        ...orderItems,
        {
          productId: product.id,
          productName: product.name,
          quantity,
          price: product.price,
          subtotal: quantity * product.price,
        },
      ]);
    }
    setSelectedProduct("");
    setQuantity(1);
  };

  const handleRemoveItem = (productId: string) => {
    setOrderItems(orderItems.filter((item) => item.productId !== productId));
  };

  const handleCreateOrder = async () => {
    if (orderItems.length === 0) {
      toast.error("Please add at least one item to the order");
      return;
    }

    const total = orderItems.reduce((sum, i) => sum + i.subtotal, 0);
    const newOrderPayload = {
      shopId: 1, // adjust as per session or context
      items: orderItems,
      notes,
      total,
      status: "PENDING",
      payment: "UNPAID",
      date: new Date().toISOString().split("T")[0],
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOrderPayload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to create order");
      }

      const createdOrder: Order = await res.json();
      setOrders((prev) => [...prev, createdOrder]);
      toast.success("Order created successfully");
      setIsCreateOrderOpen(false);
      setOrderItems([]);
      setNotes("");
    } catch (error) {
      toast.error((error as Error).message || "Error creating order");
    }
  };

  // Filtering and sorting
  let filteredOrders = [...orders];
  if (statusFilter !== "all") {
    filteredOrders = filteredOrders.filter(
      (o) => o.status.toUpperCase() === statusFilter.toUpperCase()
    );
  }
  if (searchTerm) {
    filteredOrders = filteredOrders.filter((o) =>
      o.orderId.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  if (sortConfig) {
    filteredOrders.sort((a, b) => {
      const aKey = a[sortConfig.key];
      const bKey = b[sortConfig.key];
      if (aKey === undefined || bKey === undefined) return 0;
      if (aKey < bKey) return sortConfig.direction === "ascending" ? -1 : 1;
      if (aKey > bKey) return sortConfig.direction === "ascending" ? 1 : -1;
      return 0;
    });
  }

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
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

  const getPaymentBadge = (payment: string) => {
    switch (payment.toUpperCase()) {
      case "PAID":
        return <Badge className="bg-green-500">Paid</Badge>;
      case "UNPAID":
        return <Badge className="bg-red-500">Unpaid</Badge>;
      default:
        return <Badge>{payment}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
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

  if (loadingOrders || loadingProducts)
    return (
      <div className="text-center py-20 text-muted-foreground">Loading...</div>
    );

  if (errorOrders || errorProducts)
    return (
      <div className="text-center py-20 text-red-500">
        {errorOrders && <p>Orders Error: {errorOrders}</p>}
        {errorProducts && <p>Products Error: {errorProducts}</p>}
      </div>
    );

  return (
    <div className="space-y-6 px-4 py-10 max-w-7xl mx-auto">
      {/* Header + Create Order Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-muted-foreground">Manage your orders</p>
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
                Add products to your order and submit.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-[1fr_auto] gap-2">
                <Select
                  value={selectedProduct}
                  onValueChange={setSelectedProduct}
                  disabled={loadingProducts}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name} - ${p.price.toFixed(2)}/{p.unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min={1}
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
                    <TableHeader>
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
                          <TableCell>{item.productName}</TableCell>
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
                            .reduce((sum, i) => sum + i.subtotal, 0)
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
                  placeholder="Add special instructions"
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

      {/* Filters */}
      <div className="flex gap-2">
        <Input
          placeholder="Search orders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
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

      {/* Orders Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer"
                onClick={() => requestSort("orderId")}
              >
                <div className="flex items-center gap-1">
                  Order ID <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => requestSort("date")}
              >
                <div className="flex items-center gap-1">
                  Date <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => requestSort("total")}
              >
                <div className="flex items-center gap-1">
                  Total <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => requestSort("status")}
              >
                <div className="flex items-center gap-1">
                  Status <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead>Payment</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  No orders found
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order.id} className="">
                  <TableCell className="font-medium">{order.orderId}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>${order.total.toFixed(2)}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>{getPaymentBadge(order.payment)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => viewOrder(order)}
                      className="h-8 w-8"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* View Order Dialog */}
      <Dialog open={isViewOrderOpen} onOpenChange={setIsViewOrderOpen}>
        <DialogContent className="sm:max-w-[600px]">
          {currentOrder && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  Order {currentOrder.orderId}
                  {getStatusIcon(currentOrder.status)}
                </DialogTitle>
                <DialogDescription>Order details and info</DialogDescription>
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
                      {getPaymentBadge(currentOrder.payment)}
                    </div>
                  </div>
                </div>

                {currentOrder.items && currentOrder.items.length > 0 && (
                  <>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">
                      Order Items
                    </h3>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead className="text-right">
                              Subtotal
                            </TableHead>
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
                        </TableBody>
                      </Table>
                    </div>
                  </>
                )}
              </div>
              <DialogFooter>
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
