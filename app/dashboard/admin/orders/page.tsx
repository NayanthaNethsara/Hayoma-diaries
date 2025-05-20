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
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  Filter,
  ArrowUpDown,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  TruckIcon,
} from "lucide-react";
import type { Order } from "@/lib/types";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

// Mock data for orders
const mockOrders: Order[] = [
  {
    id: "ORD-001",
    shopId: "SHOP-001",
    shopName: "Dairy Delights",
    date: "2023-05-15",
    total: 1250.75,
    status: "PENDING",
    paymentStatus: "UNPAID",
    items: [
      {
        productId: "P001",
        productName: "Fresh Milk",
        quantity: 50,
        price: 2.5,
        subtotal: 125.0,
      },
      {
        productId: "P002",
        productName: "Yogurt",
        quantity: 100,
        price: 1.75,
        subtotal: 175.0,
      },
    ],
    deliveryDate: "2023-05-20",
  },
  {
    id: "ORD-002",
    shopId: "SHOP-002",
    shopName: "Cheese Haven",
    date: "2023-05-16",
    total: 875.5,
    status: "APPROVED",
    paymentStatus: "PAID",
    items: [
      {
        productId: "P003",
        productName: "Cheddar Cheese",
        quantity: 30,
        price: 5.5,
        subtotal: 165.0,
      },
      {
        productId: "P004",
        productName: "Mozzarella",
        quantity: 25,
        price: 6.0,
        subtotal: 150.0,
      },
    ],
    deliveryDate: "2023-05-22",
  },
  {
    id: "ORD-003",
    shopId: "SHOP-003",
    shopName: "Milk & More",
    date: "2023-05-14",
    total: 1500.25,
    status: "APPROVED",
    paymentStatus: "PAID",
    items: [
      {
        productId: "P001",
        productName: "Fresh Milk",
        quantity: 100,
        price: 2.5,
        subtotal: 250.0,
      },
      {
        productId: "P005",
        productName: "Butter",
        quantity: 50,
        price: 3.5,
        subtotal: 175.0,
      },
    ],
    deliveryDate: "2023-05-19",
  },
  {
    id: "ORD-004",
    shopId: "SHOP-001",
    shopName: "Dairy Delights",
    date: "2023-05-10",
    total: 950.0,
    status: "DELIVERED",
    paymentStatus: "PAID",
    items: [
      {
        productId: "P002",
        productName: "Yogurt",
        quantity: 200,
        price: 1.75,
        subtotal: 350.0,
      },
      {
        productId: "P006",
        productName: "Cream",
        quantity: 40,
        price: 4.0,
        subtotal: 160.0,
      },
    ],
    deliveryDate: "2023-05-15",
  },
  {
    id: "ORD-005",
    shopId: "SHOP-002",
    shopName: "Cheese Haven",
    date: "2023-05-12",
    total: 1100.5,
    status: "CANCELLED",
    paymentStatus: "UNPAID",
    items: [
      {
        productId: "P003",
        productName: "Cheddar Cheese",
        quantity: 40,
        price: 5.5,
        subtotal: 220.0,
      },
      {
        productId: "P007",
        productName: "Swiss Cheese",
        quantity: 35,
        price: 7.0,
        subtotal: 245.0,
      },
    ],
    deliveryDate: "2023-05-18",
  },
];

export default function AdminOrdersDashboard() {
  // State for orders and UI
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [shopFilter, setShopFilter] = useState<string>("all");
  const [isViewOrderOpen, setIsViewOrderOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [shops, setShops] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Order;
    direction: "ascending" | "descending";
  } | null>(null);

  // Fetch orders data
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        // In a real app, we would fetch from an API
        // const response = await fetch('/api/orders')
        // const data = await response.json()

        // For now, use mock data
        setOrders(mockOrders);

        // Extract unique shops from orders
        const uniqueShops = Array.from(
          new Set(mockOrders.map((order: Order) => order.shopName))
        );
        setShops(uniqueShops);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: Order["status"]) => {
    try {
      // In a real app, we would call an API
      // const response = await fetch(`/api/orders/${id}/status`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ status: newStatus })
      // })

      // For now, update the state directly
      const updatedOrders = orders.map((order) =>
        order.id === id ? { ...order, status: newStatus } : order
      );
      setOrders(updatedOrders);
      toast.success(`Order ${id} status updated to ${newStatus}`);
    } catch (error) {
      console.error("Failed to update order status:", error);
      toast.error("Failed to update order status");
    }
  };

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

  // Apply filters and search
  let filteredOrders = [...orders];

  if (statusFilter !== "all") {
    filteredOrders = filteredOrders.filter(
      (order) => order.status === statusFilter
    );
  }

  if (shopFilter !== "all") {
    filteredOrders = filteredOrders.filter(
      (order) => order.shopName === shopFilter
    );
  }

  if (searchTerm) {
    filteredOrders = filteredOrders.filter(
      (order) =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.shopName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Apply sorting
  if (sortConfig !== null) {
    filteredOrders.sort((a, b) => {
      if (!sortConfig) return 0;
      const key = sortConfig.key;
      const aValue = a[key] ?? "";
      const bValue = b[key] ?? "";
      if (aValue < bValue) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (aValue > bValue) {
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
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

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
      <div>
        <h1 className="text-3xl font-bold">Orders Management</h1>
        <p className="text-muted-foreground">
          Manage and track all customer orders
        </p>
      </div>

      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-4">
          <Card className="bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 border-blue-100 dark:border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">
                Total Orders
              </CardTitle>
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
          <Card className="bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 border-blue-100 dark:border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                ${totalRevenue.toFixed(2)}
              </div>
              <p className="text-sm text-muted-foreground">From all orders</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-blue-100 dark:border-gray-700">
          <CardHeader>
            <CardTitle>Order List</CardTitle>
            <CardDescription>
              View and manage all customer orders
            </CardDescription>
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
                <Select value={shopFilter} onValueChange={setShopFilter}>
                  <SelectTrigger className="w-[150px] bg-white dark:bg-gray-950">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      <span>Shop</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Shops</SelectItem>
                    {shops.map((shop) => (
                      <SelectItem key={shop} value={shop}>
                        {shop}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <p>Loading orders...</p>
              </div>
            ) : (
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
                        onClick={() => requestSort("shopName")}
                      >
                        <div className="flex items-center gap-1">
                          Shop
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
                    {filteredOrders.length > 0 ? (
                      filteredOrders.map((order) => (
                        <TableRow
                          key={order.id}
                          className="bg-white dark:bg-gray-950"
                        >
                          <TableCell className="font-medium">
                            {order.id}
                          </TableCell>
                          <TableCell>{order.shopName}</TableCell>
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
                                order.paymentStatus === "PAID"
                                  ? "default"
                                  : "outline"
                              }
                              className={
                                order.paymentStatus === "PAID"
                                  ? "bg-green-500"
                                  : ""
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
                                  onClick={() =>
                                    handleUpdateStatus(order.id, "APPROVED")
                                  }
                                  className="h-8 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950"
                                >
                                  Approve
                                </Button>
                              )}
                              {order.status === "APPROVED" && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleUpdateStatus(order.id, "DELIVERED")
                                  }
                                  className="h-8 px-2 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950"
                                >
                                  Complete
                                </Button>
                              )}
                              {(order.status === "PENDING" ||
                                order.status === "APPROVED") && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleUpdateStatus(order.id, "CANCELLED")
                                  }
                                  className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                                >
                                  Cancel
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="text-center py-4 text-muted-foreground"
                        >
                          {isLoading ? "Loading orders..." : "No orders found"}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Order View Dialog */}
      <Dialog open={isViewOrderOpen} onOpenChange={setIsViewOrderOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
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
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Shop
                    </h3>
                    <p>{currentOrder.shopName}</p>
                  </div>
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
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Total
                    </h3>
                    <p className="font-medium">
                      ${currentOrder.total.toFixed(2)}
                    </p>
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
              <DialogFooter className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1 flex flex-wrap gap-2">
                  {currentOrder.status === "PENDING" && (
                    <Button
                      onClick={() => {
                        handleUpdateStatus(currentOrder.id, "APPROVED");
                        setIsViewOrderOpen(false);
                      }}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Approve Order
                    </Button>
                  )}
                  {currentOrder.status === "APPROVED" && (
                    <Button
                      onClick={() => {
                        handleUpdateStatus(currentOrder.id, "DELIVERED");
                        setIsViewOrderOpen(false);
                      }}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Complete Order
                    </Button>
                  )}
                  {(currentOrder.status === "PENDING" ||
                    currentOrder.status === "APPROVED") && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        handleUpdateStatus(currentOrder.id, "CANCELLED");
                        setIsViewOrderOpen(false);
                      }}
                      className="text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-950"
                    >
                      Cancel Order
                    </Button>
                  )}
                </div>
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
