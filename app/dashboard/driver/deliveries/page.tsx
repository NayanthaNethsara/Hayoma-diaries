"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  Search,
  Filter,
  ArrowUpDown,
  CheckCircle,
  Clock,
  TruckIcon,
  MapPin,
  Calendar,
  DollarSign,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

// Mock data for deliveries
type Stop = {
  id: string;
  name: string;
  address: string;
  time: string;
  status: string;
};

type Delivery = {
  id: string;
  route: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  paymentAmount: number;
  stops: Stop[];
  totalDistance: string;
};

const mockDeliveries: Delivery[] = [
  {
    id: "DEL-001",
    route: "Morning Route",
    date: "2023-05-15",
    startTime: "08:00 AM",
    endTime: "12:00 PM",
    status: "COMPLETED",
    paymentStatus: "PAID",
    paymentMethod: "CARD",
    paymentAmount: 450.75,
    stops: [
      {
        id: "stop1",
        name: "Dairy Mart Shop",
        address: "123 Main St",
        time: "08:30 AM",
        status: "COMPLETED",
      },
      {
        id: "stop2",
        name: "Fresh Dairy Shop",
        address: "456 Oak Ave",
        time: "09:45 AM",
        status: "COMPLETED",
      },
      {
        id: "stop3",
        name: "Milk & More",
        address: "789 Pine Blvd",
        time: "11:00 AM",
        status: "COMPLETED",
      },
    ],
    totalDistance: "28 km",
  },
  {
    id: "DEL-002",
    route: "Afternoon Route",
    date: "2023-05-15",
    startTime: "02:00 PM",
    endTime: "06:00 PM",
    status: "IN_PROGRESS",
    paymentStatus: "PENDING",
    paymentMethod: "",
    paymentAmount: 320.5,
    stops: [
      {
        id: "stop4",
        name: "Farm Fresh Dairy",
        address: "101 Country Rd",
        time: "02:30 PM",
        status: "COMPLETED",
      },
      {
        id: "stop5",
        name: "Cheese Masters",
        address: "202 Dairy Lane",
        time: "04:00 PM",
        status: "IN_PROGRESS",
      },
      {
        id: "stop6",
        name: "Dairy Delights",
        address: "303 Milk Way",
        time: "05:15 PM",
        status: "PENDING",
      },
    ],
    totalDistance: "35 km",
  },
  {
    id: "DEL-003",
    route: "Morning Route",
    date: "2023-05-16",
    startTime: "07:00 AM",
    endTime: "11:00 AM",
    status: "PENDING",
    paymentStatus: "UNPAID",
    paymentMethod: "",
    paymentAmount: 275.25,
    stops: [
      {
        id: "stop7",
        name: "Organic Dairy Shop",
        address: "404 Green St",
        time: "07:30 AM",
        status: "PENDING",
      },
      {
        id: "stop8",
        name: "Premium Dairy",
        address: "505 Quality Ave",
        time: "09:00 AM",
        status: "PENDING",
      },
      {
        id: "stop9",
        name: "Dairy Express",
        address: "606 Fast Blvd",
        time: "10:15 AM",
        status: "PENDING",
      },
    ],
    totalDistance: "32 km",
  },
  {
    id: "DEL-004",
    route: "Afternoon Route",
    date: "2023-05-16",
    startTime: "01:00 PM",
    endTime: "05:00 PM",
    status: "PENDING",
    paymentStatus: "UNPAID",
    paymentMethod: "",
    paymentAmount: 510.0,
    stops: [
      {
        id: "stop10",
        name: "Milk Haven",
        address: "707 Cream St",
        time: "01:30 PM",
        status: "PENDING",
      },
      {
        id: "stop11",
        name: "Dairy Corner",
        address: "808 Butter Ave",
        time: "03:00 PM",
        status: "PENDING",
      },
      {
        id: "stop12",
        name: "Fresh Farms",
        address: "909 Yogurt Blvd",
        time: "04:15 PM",
        status: "PENDING",
      },
    ],
    totalDistance: "30 km",
  },
  {
    id: "DEL-005",
    route: "Evening Route",
    date: "2023-05-16",
    startTime: "06:00 PM",
    endTime: "09:00 PM",
    status: "PENDING",
    paymentStatus: "UNPAID",
    paymentMethod: "",
    paymentAmount: 400.0,
    stops: [
      {
        id: "stop13",
        name: "Milk Stop",
        address: "111 Dairy Rd",
        time: "06:30 PM",
        status: "PENDING",
      },
      {
        id: "stop14",
        name: "Creamery",
        address: "222 Butter St",
        time: "07:45 PM",
        status: "PENDING",
      },
      {
        id: "stop15",
        name: "Yogurt Place",
        address: "333 Yogurt Ave",
        time: "08:30 PM",
        status: "PENDING",
      },
    ],
    totalDistance: "25 km",
  },
];

export default function DriverDeliveriesDashboard() {
  const { user } = useAuth();
  const [deliveries, setDeliveries] = useState<Delivery[]>(mockDeliveries);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  type SortableDeliveryKey =
    | "id"
    | "route"
    | "date"
    | "startTime"
    | "endTime"
    | "status"
    | "paymentStatus"
    | "paymentMethod"
    | "paymentAmount"
    | "totalDistance";
  const [sortConfig, setSortConfig] = useState<{
    key: SortableDeliveryKey;
    direction: "ascending" | "descending";
  } | null>(null);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [currentDelivery, setCurrentDelivery] = useState<Delivery | null>(null);
  const [paymentDetails, setPaymentDetails] = useState({
    method: "",
    amount: "",
    notes: "",
  });

  const handleCompleteStop = (deliveryId: string, stopId: string) => {
    const updatedDeliveries = deliveries.map((delivery) => {
      if (delivery.id === deliveryId) {
        const updatedStops = delivery.stops.map((stop) => {
          if (stop.id === stopId) {
            return { ...stop, status: "COMPLETED" };
          }
          return stop;
        });

        // Check if all stops are completed
        const allCompleted = updatedStops.every(
          (stop) => stop.status === "COMPLETED"
        );

        return {
          ...delivery,
          stops: updatedStops,
          status: allCompleted ? "COMPLETED" : "IN_PROGRESS",
        };
      }
      return delivery;
    });

    setDeliveries(updatedDeliveries);
    toast.success("Stop marked as completed");
  };

  const handleStartDelivery = (deliveryId: string) => {
    const updatedDeliveries = deliveries.map((delivery) => {
      if (delivery.id === deliveryId) {
        return {
          ...delivery,
          status: "IN_PROGRESS",
        };
      }
      return delivery;
    });

    setDeliveries(updatedDeliveries);
    toast.success("Delivery started");
  };

  const handleOpenPaymentDialog = (delivery: any) => {
    setCurrentDelivery(delivery);
    setPaymentDetails({
      method: delivery.paymentMethod || "",
      amount: delivery.paymentAmount.toString() || "",
      notes: "",
    });
    setIsPaymentDialogOpen(true);
  };

  const handlePaymentSubmit = () => {
    if (!paymentDetails.method) {
      toast.error("Please select a payment method");
      return;
    }
    if (!paymentDetails.amount || isNaN(Number(paymentDetails.amount))) {
      toast.error("Please enter a valid payment amount");
      return;
    }

    if (!currentDelivery) {
      toast.error("No delivery selected");
      return;
    }

    const updatedDeliveries = deliveries.map((delivery) => {
      if (delivery.id === currentDelivery.id) {
        return {
          ...delivery,
          paymentStatus: "PAID",
          paymentMethod: paymentDetails.method,
          paymentAmount: Number(paymentDetails.amount),
        };
      }
      return delivery;
    });

    setDeliveries(updatedDeliveries);
    setIsPaymentDialogOpen(false);
    toast.success("Payment updated and admin notified");
  };

  const requestSort = (key: SortableDeliveryKey) => {
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
  let filteredDeliveries = [...deliveries];

  if (statusFilter !== "all") {
    filteredDeliveries = filteredDeliveries.filter(
      (delivery) => delivery.status === statusFilter
    );
  }

  if (dateFilter !== "all") {
    const today = new Date().toISOString().split("T")[0];
    const tomorrow = new Date(Date.now() + 86400000)
      .toISOString()
      .split("T")[0];

    if (dateFilter === "today") {
      filteredDeliveries = filteredDeliveries.filter(
        (delivery) => delivery.date === today
      );
    } else if (dateFilter === "tomorrow") {
      filteredDeliveries = filteredDeliveries.filter(
        (delivery) => delivery.date === tomorrow
      );
    } else if (dateFilter === "past") {
      filteredDeliveries = filteredDeliveries.filter(
        (delivery) => delivery.date < today
      );
    } else if (dateFilter === "future") {
      filteredDeliveries = filteredDeliveries.filter(
        (delivery) => delivery.date > tomorrow
      );
    }
  }

  if (searchTerm) {
    filteredDeliveries = filteredDeliveries.filter(
      (delivery) =>
        delivery.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        delivery.route.toLowerCase().includes(searchTerm.toLowerCase()) ||
        delivery.stops.some(
          (stop) =>
            stop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            stop.address.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
  }

  // Apply sorting
  if (sortConfig !== null) {
    filteredDeliveries.sort((a, b) => {
      const key = sortConfig.key;
      const aValue = a[key];
      const bValue = b[key];
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
  const totalDeliveries = deliveries.length;
  const completedDeliveries = deliveries.filter(
    (delivery) => delivery.status === "COMPLETED"
  ).length;
  const pendingDeliveries = deliveries.filter(
    (delivery) => delivery.status === "PENDING"
  ).length;
  const inProgressDeliveries = deliveries.filter(
    (delivery) => delivery.status === "IN_PROGRESS"
  ).length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <Badge className="bg-green-500">Completed</Badge>;
      case "IN_PROGRESS":
        return <Badge className="bg-blue-500">In Progress</Badge>;
      case "PENDING":
        return <Badge className="bg-amber-500">Pending</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "PAID":
        return <Badge className="bg-green-500">Paid</Badge>;
      case "PENDING":
        return <Badge className="bg-amber-500">Pending</Badge>;
      case "UNPAID":
        return <Badge className="bg-red-500">Unpaid</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "IN_PROGRESS":
        return <TruckIcon className="h-5 w-5 text-blue-500" />;
      case "PENDING":
        return <Clock className="h-5 w-5 text-amber-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">My Deliveries</h1>
        <p className="text-muted-foreground">
          Manage and track your assigned deliveries
        </p>
      </div>

      <Tabs defaultValue="all" onValueChange={setDateFilter}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Deliveries</TabsTrigger>
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="tomorrow">Tomorrow</TabsTrigger>
          <TabsTrigger value="past">Past Deliveries</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 border-blue-100 dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">
              Total Deliveries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {totalDeliveries}
            </div>
            <p className="text-sm text-muted-foreground">
              All assigned deliveries
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-white dark:from-gray-900 dark:to-gray-800 border-green-100 dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              {completedDeliveries}
            </div>
            <p className="text-sm text-muted-foreground">
              Successfully delivered
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 border-blue-100 dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {inProgressDeliveries}
            </div>
            <p className="text-sm text-muted-foreground">
              Currently delivering
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-50 to-white dark:from-gray-900 dark:to-gray-800 border-amber-100 dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">
              {pendingDeliveries}
            </div>
            <p className="text-sm text-muted-foreground">Awaiting start</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-blue-100 dark:border-gray-700">
        <CardHeader>
          <CardTitle>Delivery Routes</CardTitle>
          <CardDescription>
            View and manage your assigned delivery routes
          </CardDescription>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search deliveries..."
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
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
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
                      ID
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => requestSort("route")}
                  >
                    <div className="flex items-center gap-1">
                      Route
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
                  <TableHead>Time</TableHead>
                  <TableHead>Stops</TableHead>
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
                {filteredDeliveries.map((delivery) => (
                  <TableRow
                    key={delivery.id}
                    className="bg-white dark:bg-gray-950"
                  >
                    <TableCell className="font-medium">{delivery.id}</TableCell>
                    <TableCell>{delivery.route}</TableCell>
                    <TableCell>
                      {new Date(delivery.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {delivery.startTime} - {delivery.endTime}
                    </TableCell>
                    <TableCell>{delivery.stops.length} stops</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(delivery.status)}
                        {getStatusBadge(delivery.status)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getPaymentStatusBadge(delivery.paymentStatus)}
                    </TableCell>
                    <TableCell className="text-right">
                      {delivery.status === "PENDING" && (
                        <Button
                          size="sm"
                          onClick={() => handleStartDelivery(delivery.id)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Start Delivery
                        </Button>
                      )}
                      {delivery.status === "IN_PROGRESS" && (
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              // Find the first non-completed stop
                              const nextStop = delivery.stops.find(
                                (stop) => stop.status !== "COMPLETED"
                              );
                              if (nextStop) {
                                handleCompleteStop(delivery.id, nextStop.id);
                              }
                            }}
                            className="border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-950"
                          >
                            Complete Next Stop
                          </Button>
                        </div>
                      )}
                      {(delivery.status === "IN_PROGRESS" ||
                        delivery.status === "COMPLETED") &&
                        delivery.paymentStatus !== "PAID" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenPaymentDialog(delivery)}
                            className="ml-2 border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-950"
                          >
                            <DollarSign className="h-4 w-4 mr-1" />
                            Update Payment
                          </Button>
                        )}
                    </TableCell>
                  </TableRow>
                ))}
                {filteredDeliveries.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-4 text-muted-foreground"
                    >
                      No deliveries found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {filteredDeliveries
          .filter((delivery) => delivery.status === "IN_PROGRESS")
          .map((delivery) => (
            <Card
              key={delivery.id}
              className="border-blue-100 dark:border-gray-700"
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {delivery.route}{" "}
                      <Badge className="bg-blue-500">In Progress</Badge>
                    </CardTitle>
                    <CardDescription>
                      {new Date(delivery.date).toLocaleDateString()} •{" "}
                      {delivery.startTime} - {delivery.endTime} •{" "}
                      {delivery.totalDistance} total
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {
                        delivery.stops.filter(
                          (stop) => stop.status === "COMPLETED"
                        ).length
                      }{" "}
                      of {delivery.stops.length} stops completed
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                    <div className="flex items-center gap-3">
                      <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      <div>
                        <p className="font-medium">Payment Status</p>
                        <p className="text-sm text-muted-foreground">
                          Amount: ${delivery.paymentAmount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getPaymentStatusBadge(delivery.paymentStatus)}
                      {delivery.paymentStatus !== "PAID" && (
                        <Button
                          size="sm"
                          onClick={() => handleOpenPaymentDialog(delivery)}
                          className="ml-2"
                        >
                          Update Payment
                        </Button>
                      )}
                    </div>
                  </div>

                  {delivery.stops.map((stop, index) => (
                    <div
                      key={stop.id}
                      className={`rounded-lg border p-4 ${
                        stop.status === "COMPLETED"
                          ? "border-green-100 dark:border-green-800"
                          : stop.status === "IN_PROGRESS"
                          ? "border-blue-100 dark:border-blue-800"
                          : "border-gray-200 dark:border-gray-700"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div
                            className={`rounded-full p-2 ${
                              stop.status === "COMPLETED"
                                ? "bg-green-100 dark:bg-green-900"
                                : stop.status === "IN_PROGRESS"
                                ? "bg-blue-100 dark:bg-blue-900"
                                : "bg-gray-100 dark:bg-gray-900"
                            }`}
                          >
                            <MapPin
                              className={`h-4 w-4 ${
                                stop.status === "COMPLETED"
                                  ? "text-green-600 dark:text-green-400"
                                  : stop.status === "IN_PROGRESS"
                                  ? "text-blue-600 dark:text-blue-400"
                                  : "text-gray-600 dark:text-gray-400"
                              }`}
                            />
                          </div>
                          <div>
                            <p className="font-medium">{stop.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {stop.address}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`rounded-full px-2 py-1 text-xs ${
                              stop.status === "COMPLETED"
                                ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                                : stop.status === "IN_PROGRESS"
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100"
                                : "bg-amber-100 text-amber-800 dark:bg-amber-800 dark:text-amber-100"
                            }`}
                          >
                            {stop.status === "COMPLETED"
                              ? "Completed"
                              : stop.status === "IN_PROGRESS"
                              ? "In Progress"
                              : "Pending"}
                          </span>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Scheduled time
                          </p>
                          <p className="text-sm font-medium">{stop.time}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Stop</p>
                          <p className="text-sm font-medium">
                            {index + 1} of {delivery.stops.length}
                          </p>
                        </div>
                        {stop.status !== "COMPLETED" && (
                          <Button
                            size="sm"
                            onClick={() =>
                              handleCompleteStop(delivery.id, stop.id)
                            }
                            className="gap-1 bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4" />
                            Complete
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
      </div>

      {/* Payment Update Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Update Payment Status</DialogTitle>
            <DialogDescription>
              Update the payment status for this delivery and notify the admin.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Delivery ID</label>
                <p>{currentDelivery?.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Amount</label>
                <Input
                  type="number"
                  step="0.01"
                  value={paymentDetails.amount}
                  onChange={(e) =>
                    setPaymentDetails({
                      ...paymentDetails,
                      amount: e.target.value,
                    })
                  }
                  placeholder="Enter amount"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Payment Method</label>
              <Select
                value={paymentDetails.method}
                onValueChange={(value) =>
                  setPaymentDetails({ ...paymentDetails, method: value })
                }
              >
                <SelectTrigger>
                  <span>
                    {paymentDetails.method || "Select payment method"}
                  </span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CASH">Cash</SelectItem>
                  <SelectItem value="CARD">Card</SelectItem>
                  <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                  <SelectItem value="CREDIT">Store Credit</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Notes</label>
              <Textarea
                value={paymentDetails.notes}
                onChange={(e) =>
                  setPaymentDetails({
                    ...paymentDetails,
                    notes: e.target.value,
                  })
                }
                placeholder="Add any notes about the payment"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsPaymentDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handlePaymentSubmit}
              className="bg-green-600 hover:bg-green-700"
            >
              <DollarSign className="h-4 w-4 mr-1" />
              Update & Notify Admin
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
