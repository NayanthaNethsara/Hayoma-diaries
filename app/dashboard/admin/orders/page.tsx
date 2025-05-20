"use client";

import { useState, useEffect } from "react";
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
import { Search, Filter, ArrowUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Order = {
  id: number;
  orderId: string;
  date: string;
  total: number;
  status: string;
  payment: string;
  shopId: number;
};

export default function AdminOrdersDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Order;
    direction: "ascending" | "descending";
  } | null>(null);

  useEffect(() => {
    async function fetchOrders() {
      setIsLoading(true);
      try {
        const res = await fetch("/api/orders");
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data: Order[] = await res.json();
        setOrders(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchOrders();
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

  // Filter and search
  let filteredOrders = [...orders];

  if (statusFilter !== "all") {
    filteredOrders = filteredOrders.filter(
      (order) => order.status.toLowerCase() === statusFilter.toLowerCase()
    );
  }

  if (searchTerm) {
    filteredOrders = filteredOrders.filter(
      (order) =>
        order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.payment.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Sort
  if (sortConfig !== null) {
    filteredOrders.sort((a, b) => {
      const aValue = a[sortConfig.key] ?? "";
      const bValue = b[sortConfig.key] ?? "";
      if (aValue < bValue) return sortConfig.direction === "ascending" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "ascending" ? 1 : -1;
      return 0;
    });
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return <Badge className="bg-amber-500 capitalize">{status}</Badge>;
      case "approved":
        return <Badge className="bg-blue-500 capitalize">{status}</Badge>;
      case "shipped":
        return <Badge className="bg-indigo-500 capitalize">{status}</Badge>;
      case "delivered":
        return <Badge className="bg-green-500 capitalize">{status}</Badge>;
      case "cancelled":
        return <Badge className="bg-red-500 capitalize">{status}</Badge>;
      default:
        return <Badge className="capitalize">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Orders Management</h1>
        <p className="text-muted-foreground">View all orders</p>
      </div>

      <Card className="border-blue-100 dark:border-gray-700">
        <CardHeader>
          <CardTitle>Order List</CardTitle>
          <CardDescription>View all orders below</CardDescription>

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
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
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
                      onClick={() => requestSort("orderId")}
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
                      onClick={() => requestSort("payment")}
                    >
                      <div className="flex items-center gap-1">
                        Payment
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </TableHead>
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
                          {order.orderId}
                        </TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell>${order.total.toFixed(2)}</TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              order.payment.toLowerCase() === "paid"
                                ? "default"
                                : "outline"
                            }
                            className={
                              order.payment.toLowerCase() === "paid"
                                ? "bg-green-500"
                                : ""
                            }
                          >
                            {order.payment}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={5}
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
  );
}
