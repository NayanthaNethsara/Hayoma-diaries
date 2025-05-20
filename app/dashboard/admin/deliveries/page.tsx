"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Truck,
  Calendar,
  Clock,
  Plus,
  User,
  Package,
  CheckCircle,
  AlertTriangle,
  ClipboardList,
  Route,
  FileText,
  X,
  DollarSign,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";

// Mock data for deliveries
const mockDeliveries = [
  {
    id: "del1",
    type: "delivery",
    from: "Central Warehouse",
    to: "Dairy Mart Shop",
    status: "pending",
    items: [
      { id: "item1", name: "Fresh Milk", quantity: "50 liters" },
      { id: "item2", name: "Yogurt", quantity: "30 cups" },
    ],
    scheduledDate: "2023-05-15",
    scheduledTime: "10:00 AM",
    assignedDriver: null,
    priority: "normal",
    isCritical: false,
    notes: "",
    tasks: [],
    paymentStatus: "UNPAID",
    paymentMethod: "",
    paymentAmount: 320.5,
    paymentUpdatedBy: "",
  },
  {
    id: "del2",
    type: "delivery",
    from: "Central Warehouse",
    to: "Fresh Dairy Shop",
    status: "in_progress",
    items: [
      { id: "item3", name: "Cheese", quantity: "20 kg" },
      { id: "item4", name: "Butter", quantity: "15 kg" },
    ],
    scheduledDate: "2023-05-15",
    scheduledTime: "11:30 AM",
    assignedDriver: { id: "driver1", name: "John Driver" },
    priority: "high",
    isCritical: true,
    notes: "Customer is a priority account. Ensure timely delivery.",
    tasks: [
      {
        id: "task1",
        description: "Check temperature of refrigerated items",
        isCompleted: false,
      },
      {
        id: "task2",
        description: "Get signature from store manager",
        isCompleted: false,
      },
    ],
    paymentStatus: "PAID",
    paymentMethod: "CARD",
    paymentAmount: 450.75,
    paymentUpdatedBy: "John Driver",
  },
  {
    id: "pickup1",
    type: "pickup",
    from: "Farm Fresh Supplier",
    to: "Central Warehouse",
    status: "pending",
    items: [{ id: "item5", name: "Raw Milk", quantity: "200 liters" }],
    scheduledDate: "2023-05-16",
    scheduledTime: "08:00 AM",
    assignedDriver: null,
    priority: "normal",
    isCritical: false,
    notes: "",
    tasks: [],
    paymentStatus: "PENDING",
    paymentMethod: "",
    paymentAmount: 0,
    paymentUpdatedBy: "",
  },
  {
    id: "pickup2",
    type: "pickup",
    from: "Organic Dairy Farm",
    to: "Central Warehouse",
    status: "completed",
    items: [
      { id: "item6", name: "Organic Milk", quantity: "100 liters" },
      { id: "item7", name: "Organic Cream", quantity: "50 liters" },
    ],
    scheduledDate: "2023-05-14",
    scheduledTime: "09:00 AM",
    assignedDriver: { id: "driver2", name: "Sarah Driver" },
    priority: "normal",
    isCritical: false,
    notes: "Farm is located in a remote area. GPS might not be accurate.",
    tasks: [
      { id: "task3", description: "Check milk quality", isCompleted: true },
      { id: "task4", description: "Verify quantities", isCompleted: true },
    ],
    paymentStatus: "PAID",
    paymentMethod: "CASH",
    paymentAmount: 120.0,
    paymentUpdatedBy: "Sarah Driver",
  },
];

// Mock data for drivers
const mockDrivers = [
  {
    id: "driver1",
    name: "John Driver",
    status: "active",
    currentDeliveries: 1,
  },
  {
    id: "driver2",
    name: "Sarah Driver",
    status: "active",
    currentDeliveries: 0,
  },
  {
    id: "driver3",
    name: "Mike Driver",
    status: "inactive",
    currentDeliveries: 0,
  },
  {
    id: "driver4",
    name: "Lisa Driver",
    status: "active",
    currentDeliveries: 2,
  },
];

// Mock data for delivery routes
const mockRoutes = [
  {
    id: "route1",
    name: "North City Route",
    stops: 5,
    estimatedTime: "2 hours",
  },
  {
    id: "route2",
    name: "South City Route",
    stops: 4,
    estimatedTime: "1.5 hours",
  },
  {
    id: "route3",
    name: "East County Route",
    stops: 6,
    estimatedTime: "2.5 hours",
  },
  {
    id: "route4",
    name: "West County Route",
    stops: 3,
    estimatedTime: "1 hour",
  },
];

// Mock data for orders
const mockOrders = [
  {
    id: "order1",
    shopName: "Dairy Mart Shop",
    total: 450,
    date: "2023-05-14",
    items: [
      { name: "Fresh Milk", quantity: "50 liters" },
      { name: "Yogurt", quantity: "30 cups" },
    ],
    from: "Central Warehouse",
    to: "Dairy Mart Shop",
  },
  {
    id: "order2",
    shopName: "Fresh Dairy Shop",
    total: 320,
    date: "2023-05-15",
    items: [
      { name: "Cheese", quantity: "20 kg" },
      { name: "Butter", quantity: "15 kg" },
    ],
    from: "Central Warehouse",
    to: "Fresh Dairy Shop",
  },
  {
    id: "order3",
    shopName: "Organic Dairy Store",
    total: 580,
    date: "2023-05-16",
    items: [
      { name: "Organic Milk", quantity: "40 liters" },
      { name: "Organic Yogurt", quantity: "25 cups" },
    ],
    from: "Central Warehouse",
    to: "Organic Dairy Store",
  },
];

// Mock data for supply requests
const mockSupplyRequests = [
  {
    id: "supply1",
    supplier: "Farm Fresh Supplier",
    product: "Raw Milk",
    quantity: "200 liters",
    requestDate: "2023-05-10",
    deliveryDate: "2023-05-16",
    status: "approved",
    notes: "Regular weekly supply of raw milk",
    urgency: "MEDIUM",
    from: "Farm Fresh Supplier",
    to: "Central Warehouse",
    items: [{ name: "Raw Milk", quantity: "200 liters" }],
  },
  {
    id: "supply2",
    supplier: "Organic Dairy Farm",
    product: "Organic Milk and Cream",
    quantity: "150 liters total",
    requestDate: "2023-05-11",
    deliveryDate: "2023-05-17",
    status: "approved",
    notes: "Premium organic products, handle with care",
    urgency: "HIGH",
    from: "Organic Dairy Farm",
    to: "Central Warehouse",
    items: [
      { name: "Organic Milk", quantity: "100 liters" },
      { name: "Organic Cream", quantity: "50 liters" },
    ],
  },
  {
    id: "supply3",
    supplier: "Local Cheese Maker",
    product: "Artisan Cheese",
    quantity: "30 kg",
    requestDate: "2023-05-12",
    deliveryDate: "2023-05-18",
    status: "approved",
    notes: "Refrigerated transport required",
    urgency: "MEDIUM",
    from: "Local Cheese Maker",
    to: "Central Warehouse",
    items: [{ name: "Artisan Cheese", quantity: "30 kg" }],
  },
];

type DeliveryItem = { id?: string; name: string; quantity: string };
type DeliveryTask = { id: string; description: string; isCompleted: boolean };
type AssignedDriver = { id: string; name: string } | null;

type Delivery = {
  id: string;
  type: string;
  sourceType?: string;
  from: string;
  to: string;
  scheduledDate: string;
  scheduledTime: string;
  priority: string;
  isCritical: boolean;
  notes: string;
  items: DeliveryItem[];
  tasks: DeliveryTask[];
  orderId?: string;
  supplyRequestId?: string;
  paymentStatus: string;
  paymentMethod: string;
  paymentAmount: number;
  paymentUpdatedBy: string;
  assignedDriver: AssignedDriver;
  status: string;
  route?: any;
};

export default function DeliveriesPage() {
  const [deliveries, setDeliveries] = useState<Delivery[]>(mockDeliveries);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [isRouteDialogOpen, setIsRouteDialogOpen] = useState(false);
  const [isNotesDialogOpen, setIsNotesDialogOpen] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(
    null
  );
  const [selectedDriver, setSelectedDriver] = useState<string>("");
  const [selectedRoute, setSelectedRoute] = useState<string>("");
  const [newTask, setNewTask] = useState("");
  const [deliveryNotes, setDeliveryNotes] = useState("");

  const [newDelivery, setNewDelivery] = useState<{
    type: string;
    sourceType: string;
    from: string;
    to: string;
    scheduledDate: string;
    scheduledTime: string;
    priority: string;
    isCritical: boolean;
    notes: string;
    items: DeliveryItem[];
    tasks: DeliveryTask[];
    orderId: string;
    supplyRequestId: string;
    paymentStatus: string;
    paymentMethod: string;
    paymentAmount: number;
    paymentUpdatedBy: string;
  }>({
    type: "delivery",
    sourceType: "order", // can be "order" or "supply"
    from: "",
    to: "",
    scheduledDate: "",
    scheduledTime: "",
    priority: "normal",
    isCritical: false,
    notes: "",
    items: [],
    tasks: [],
    orderId: "",
    supplyRequestId: "", // Add this line for supply request ID
    paymentStatus: "UNPAID",
    paymentMethod: "",
    paymentAmount: 0,
    paymentUpdatedBy: "",
  });

  useEffect(() => {
    if (selectedDelivery) {
      setDeliveryNotes(selectedDelivery.notes || "");
    }
  }, [selectedDelivery]);

  const handleOrderSelect = (orderId: string) => {
    if (orderId === "none") {
      // Reset form if "none" is selected
      setNewDelivery({
        ...newDelivery,
        orderId: "",
        from: "",
        to: "",
        items: [],
      });
      return;
    }

    // Find the selected order
    const selectedOrder = mockOrders.find((order) => order.id === orderId);
    if (selectedOrder) {
      // Populate the form with order data
      setNewDelivery({
        ...newDelivery,
        orderId,
        from: selectedOrder.from,
        to: selectedOrder.to,
        items: selectedOrder.items.map((item) => ({
          name: item.name,
          quantity: item.quantity,
        })),
        paymentAmount: selectedOrder.total,
      });
    }
  };

  const handleSupplyRequestSelect = (requestId: string) => {
    if (requestId === "none") {
      // Reset form if "none" is selected
      setNewDelivery({
        ...newDelivery,
        supplyRequestId: "",
        from: "",
        to: "",
        items: [],
        notes: "",
      });
      return;
    }

    // Find the selected supply request
    const selectedRequest = mockSupplyRequests.find(
      (request) => request.id === requestId
    );
    if (selectedRequest) {
      // Populate the form with supply request data
      setNewDelivery({
        ...newDelivery,
        supplyRequestId: requestId,
        from: selectedRequest.from,
        to: selectedRequest.to,
        items: selectedRequest.items.map((item) => ({
          name: item.name,
          quantity: item.quantity,
        })),
        notes: selectedRequest.notes,
        priority:
          selectedRequest.urgency === "HIGH"
            ? "high"
            : selectedRequest.urgency === "MEDIUM"
            ? "normal"
            : "low",
      });
    }
  };

  const handleCreateDelivery = () => {
    // Validate form based on source type
    if (newDelivery.sourceType === "order") {
      if (
        !newDelivery.orderId ||
        !newDelivery.scheduledDate ||
        !newDelivery.scheduledTime
      ) {
        toast.error("Please select an order and fill in all required fields");
        return;
      }
    } else {
      // supply pickup
      if (
        !newDelivery.supplyRequestId ||
        !newDelivery.scheduledDate ||
        !newDelivery.scheduledTime
      ) {
        toast.error(
          "Please select a supply request and fill in all required fields"
        );
        return;
      }
    }

    // Create new delivery
    const delivery = {
      id: `del${Math.floor(Math.random() * 1000)}`,
      ...newDelivery,
      status: "pending",
      assignedDriver: null,
      items: newDelivery.items.map((item, index) => ({
        id: `item${Math.floor(Math.random() * 1000)}`,
        name: item.name,
        quantity: item.quantity,
      })),
    };

    setDeliveries([delivery, ...deliveries]);
    setIsCreateDialogOpen(false);
    toast.success(
      `${
        newDelivery.type === "delivery" ? "Delivery" : "Pickup"
      } created successfully`
    );

    // Reset form
    setNewDelivery({
      type: "delivery",
      sourceType: "order",
      from: "",
      to: "",
      scheduledDate: "",
      scheduledTime: "",
      priority: "normal",
      isCritical: false,
      notes: "",
      items: [],
      tasks: [],
      orderId: "",
      supplyRequestId: "",
      paymentStatus: "UNPAID",
      paymentMethod: "",
      paymentAmount: 0,
      paymentUpdatedBy: "",
    });
  };

  const handleAssignDriver = () => {
    if (!selectedDriver || !selectedDelivery) {
      toast.error("Please select a driver");
      return;
    }

    const driver = mockDrivers.find((d) => d.id === selectedDriver);
    if (!driver) {
      toast.error("Selected driver not found");
      return;
    }

    setDeliveries(
      deliveries.map((delivery) =>
        delivery.id === selectedDelivery.id
          ? {
              ...delivery,
              assignedDriver: { id: selectedDriver, name: driver.name },
              status: "in_progress",
            }
          : delivery
      )
    );

    setIsAssignDialogOpen(false);
    toast.success(`Driver assigned to ${selectedDelivery.type} successfully`);

    // Simulate notification to driver
    toast.info(`Notification sent to ${driver.name} about new assignment`);

    setSelectedDriver("");
    setSelectedRoute("");
  };

  const handleItemChange = (index: number, field: string, value: string) => {
    setNewDelivery({
      ...newDelivery,
      items: newDelivery.items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    });
  };

  const handleMarkAsCompleted = (id: string) => {
    setDeliveries(
      deliveries.map((delivery) =>
        delivery.id === id ? { ...delivery, status: "completed" } : delivery
      )
    );
    toast.success("Marked as completed");
  };

  const handleAddTask = () => {
    if (!newTask.trim() || !selectedDelivery) {
      toast.error("Task description cannot be empty");
      return;
    }

    const updatedDelivery = {
      ...selectedDelivery,
      tasks: [
        ...selectedDelivery.tasks,
        {
          id: `task${Math.floor(Math.random() * 1000)}`,
          description: newTask,
          isCompleted: false,
        },
      ],
    };

    setDeliveries(
      deliveries.map((delivery) =>
        delivery.id === selectedDelivery.id ? updatedDelivery : delivery
      )
    );

    setNewTask("");
    toast.success("Task added successfully");
  };

  const handleRemoveTask = (taskId: string) => {
    if (!selectedDelivery) return;

    const updatedDelivery = {
      ...selectedDelivery,
      tasks: selectedDelivery.tasks.filter((task: any) => task.id !== taskId),
    };

    setDeliveries(
      deliveries.map((delivery) =>
        delivery.id === selectedDelivery.id ? updatedDelivery : delivery
      )
    );

    toast.success("Task removed");
  };

  const handleSaveNotes = () => {
    if (!selectedDelivery) return;

    setDeliveries(
      deliveries.map((delivery) =>
        delivery.id === selectedDelivery.id
          ? {
              ...delivery,
              notes: deliveryNotes,
            }
          : delivery
      )
    );

    setIsNotesDialogOpen(false);
    toast.success("Notes updated successfully");
  };

  const handleToggleCritical = (id: string, isCritical: boolean) => {
    setDeliveries(
      deliveries.map((delivery) =>
        delivery.id === id
          ? {
              ...delivery,
              isCritical,
              priority: isCritical ? "high" : delivery.priority,
            }
          : delivery
      )
    );

    toast.success(
      `Delivery marked as ${isCritical ? "critical" : "non-critical"}`
    );
  };

  const pendingDeliveries = deliveries.filter((d) => d.status === "pending");
  const inProgressDeliveries = deliveries.filter(
    (d) => d.status === "in_progress"
  );
  const completedDeliveries = deliveries.filter(
    (d) => d.status === "completed"
  );
  const criticalDeliveries = deliveries.filter((d) => d.isCritical);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Deliveries Management</h1>
          <p className="text-muted-foreground">
            Manage pickups and deliveries across the supply chain
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create New
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Create New Delivery or Pickup</DialogTitle>
              <DialogDescription>
                Fill in the details to create a new delivery or pickup request.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="sourceType">Source Type</Label>
                <Select
                  value={newDelivery.sourceType}
                  onValueChange={(value) => {
                    setNewDelivery({
                      ...newDelivery,
                      sourceType: value,
                      // Reset related fields when changing source type
                      orderId: "",
                      supplyRequestId: "",
                      from: "",
                      to: "",
                      items: [],
                      notes: "",
                    });
                  }}
                >
                  <SelectTrigger id="sourceType">
                    <SelectValue placeholder="Select source type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="order">Order Delivery</SelectItem>
                    <SelectItem value="supply">Supply Pickup</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Conditionally show either order selection or supply request selection */}
              {newDelivery.sourceType === "order" ? (
                <div className="space-y-2">
                  <Label htmlFor="order">Select Order *</Label>
                  <Select
                    value={newDelivery.orderId || "none"}
                    onValueChange={handleOrderSelect}
                  >
                    <SelectTrigger id="order">
                      <SelectValue placeholder="Select an order" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Select an order</SelectItem>
                      {mockOrders.map((order) => (
                        <SelectItem key={order.id} value={order.id}>
                          {order.shopName} - ${order.total} ({order.date})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="supplyRequest">Select Supply Request *</Label>
                  <Select
                    value={newDelivery.supplyRequestId || "none"}
                    onValueChange={handleSupplyRequestSelect}
                  >
                    <SelectTrigger id="supplyRequest">
                      <SelectValue placeholder="Select a supply request" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">
                        Select a supply request
                      </SelectItem>
                      {mockSupplyRequests
                        .filter((request) => request.status === "approved")
                        .map((request) => (
                          <SelectItem key={request.id} value={request.id}>
                            {request.supplier} - {request.product} (
                            {request.deliveryDate})
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Show details of selected order or supply request */}
              {newDelivery.sourceType === "order" && newDelivery.orderId && (
                <div className="rounded-md border p-3 bg-muted/50">
                  <div className="text-sm mb-2">
                    <span className="font-medium">Order Details:</span> From{" "}
                    {newDelivery.from} to {newDelivery.to}
                  </div>
                  <div className="text-sm mb-2">
                    <span className="font-medium">Items:</span>
                    <div className="mt-1 pl-2 border-l-2 border-muted-foreground/20">
                      {newDelivery.items.map((item, index) => (
                        <div key={index}>
                          • {item.name} - {item.quantity}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {newDelivery.sourceType === "supply" &&
                newDelivery.supplyRequestId && (
                  <div className="rounded-md border p-3 bg-muted/50">
                    <div className="text-sm mb-2">
                      <span className="font-medium">
                        Supply Request Details:
                      </span>{" "}
                      From {newDelivery.from} to {newDelivery.to}
                    </div>
                    <div className="text-sm mb-2">
                      <span className="font-medium">Items:</span>
                      <div className="mt-1 pl-2 border-l-2 border-muted-foreground/20">
                        {newDelivery.items.map((item, index) => (
                          <div key={index}>
                            • {item.name} - {item.quantity}
                          </div>
                        ))}
                      </div>
                    </div>
                    {newDelivery.notes && (
                      <div className="text-sm">
                        <span className="font-medium">Notes:</span>{" "}
                        {newDelivery.notes}
                      </div>
                    )}
                  </div>
                )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={newDelivery.type}
                    onValueChange={(value) =>
                      setNewDelivery({ ...newDelivery, type: value })
                    }
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="delivery">Delivery</SelectItem>
                      <SelectItem value="pickup">Pickup</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={newDelivery.priority}
                    onValueChange={(value) =>
                      setNewDelivery({ ...newDelivery, priority: value })
                    }
                  >
                    <SelectTrigger id="priority">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="critical"
                  checked={newDelivery.isCritical}
                  onCheckedChange={(checked) =>
                    setNewDelivery({
                      ...newDelivery,
                      isCritical: checked as boolean,
                      priority: checked ? "high" : newDelivery.priority,
                    })
                  }
                />
                <label
                  htmlFor="critical"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Mark as critical delivery
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newDelivery.scheduledDate}
                    onChange={(e) =>
                      setNewDelivery({
                        ...newDelivery,
                        scheduledDate: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time *</Label>
                  <Input
                    id="time"
                    type="time"
                    value={newDelivery.scheduledTime}
                    onChange={(e) =>
                      setNewDelivery({
                        ...newDelivery,
                        scheduledTime: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  value={newDelivery.notes}
                  onChange={(e) =>
                    setNewDelivery({ ...newDelivery, notes: e.target.value })
                  }
                  placeholder="Add any special instructions or notes for this delivery"
                  rows={2}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateDelivery}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingDeliveries.length}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting driver assignment
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {inProgressDeliveries.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently being handled
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {completedDeliveries.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Successfully delivered
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Critical</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {criticalDeliveries.length}
            </div>
            <p className="text-xs text-muted-foreground">
              High priority deliveries
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="in_progress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="critical" className="text-red-500">
            Critical
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 mt-4">
          {deliveries.map((delivery) => (
            <DeliveryCard
              key={delivery.id}
              delivery={delivery}
              onAssign={() => {
                setSelectedDelivery(delivery);
                setIsAssignDialogOpen(true);
              }}
              onComplete={() => handleMarkAsCompleted(delivery.id)}
              onAddTasks={() => {
                setSelectedDelivery(delivery);
                setIsTaskDialogOpen(true);
              }}
              onEditNotes={() => {
                setSelectedDelivery(delivery);
                setDeliveryNotes(delivery.notes || "");
                setIsNotesDialogOpen(true);
              }}
              onToggleCritical={(isCritical) =>
                handleToggleCritical(delivery.id, isCritical)
              }
            />
          ))}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4 mt-4">
          {pendingDeliveries.length > 0 ? (
            pendingDeliveries.map((delivery) => (
              <DeliveryCard
                key={delivery.id}
                delivery={delivery}
                onAssign={() => {
                  setSelectedDelivery(delivery);
                  setIsAssignDialogOpen(true);
                }}
                onComplete={() => handleMarkAsCompleted(delivery.id)}
                onAddTasks={() => {
                  setSelectedDelivery(delivery);
                  setIsTaskDialogOpen(true);
                }}
                onEditNotes={() => {
                  setSelectedDelivery(delivery);
                  setDeliveryNotes(delivery.notes || "");
                  setIsNotesDialogOpen(true);
                }}
                onToggleCritical={(isCritical) =>
                  handleToggleCritical(delivery.id, isCritical)
                }
              />
            ))
          ) : (
            <EmptyState message="No pending deliveries" />
          )}
        </TabsContent>

        <TabsContent value="in_progress" className="space-y-4 mt-4">
          {inProgressDeliveries.length > 0 ? (
            inProgressDeliveries.map((delivery) => (
              <DeliveryCard
                key={delivery.id}
                delivery={delivery}
                onAssign={() => {
                  setSelectedDelivery(delivery);
                  setIsAssignDialogOpen(true);
                }}
                onComplete={() => handleMarkAsCompleted(delivery.id)}
                onAddTasks={() => {
                  setSelectedDelivery(delivery);
                  setIsTaskDialogOpen(true);
                }}
                onEditNotes={() => {
                  setSelectedDelivery(delivery);
                  setDeliveryNotes(delivery.notes || "");
                  setIsNotesDialogOpen(true);
                }}
                onToggleCritical={(isCritical) =>
                  handleToggleCritical(delivery.id, isCritical)
                }
              />
            ))
          ) : (
            <EmptyState message="No deliveries in progress" />
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4 mt-4">
          {completedDeliveries.length > 0 ? (
            completedDeliveries.map((delivery) => (
              <DeliveryCard
                key={delivery.id}
                delivery={delivery}
                onAssign={() => {
                  setSelectedDelivery(delivery);
                  setIsAssignDialogOpen(true);
                }}
                onComplete={() => handleMarkAsCompleted(delivery.id)}
                onAddTasks={() => {
                  setSelectedDelivery(delivery);
                  setIsTaskDialogOpen(true);
                }}
                onEditNotes={() => {
                  setSelectedDelivery(delivery);
                  setDeliveryNotes(delivery.notes || "");
                  setIsNotesDialogOpen(true);
                }}
                onToggleCritical={(isCritical) =>
                  handleToggleCritical(delivery.id, isCritical)
                }
              />
            ))
          ) : (
            <EmptyState message="No completed deliveries" />
          )}
        </TabsContent>

        <TabsContent value="critical" className="space-y-4 mt-4">
          {criticalDeliveries.length > 0 ? (
            criticalDeliveries.map((delivery) => (
              <DeliveryCard
                key={delivery.id}
                delivery={delivery}
                onAssign={() => {
                  setSelectedDelivery(delivery);
                  setIsAssignDialogOpen(true);
                }}
                onComplete={() => handleMarkAsCompleted(delivery.id)}
                onAddTasks={() => {
                  setSelectedDelivery(delivery);
                  setIsTaskDialogOpen(true);
                }}
                onEditNotes={() => {
                  setSelectedDelivery(delivery);
                  setDeliveryNotes(delivery.notes || "");
                  setIsNotesDialogOpen(true);
                }}
                onToggleCritical={(isCritical) =>
                  handleToggleCritical(delivery.id, isCritical)
                }
              />
            ))
          ) : (
            <EmptyState message="No critical deliveries" />
          )}
        </TabsContent>
      </Tabs>

      {/* Assign Driver Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Assign Driver</DialogTitle>
            <DialogDescription>
              Select a driver for this {selectedDelivery?.type}.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="mb-4 rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium capitalize">
                    {selectedDelivery?.type}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    From: {selectedDelivery?.from} • To: {selectedDelivery?.to}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Badge
                    variant={
                      selectedDelivery?.priority === "high"
                        ? "destructive"
                        : "outline"
                    }
                    className="capitalize"
                  >
                    {selectedDelivery?.priority} priority
                  </Badge>
                  {selectedDelivery?.isCritical && (
                    <Badge
                      variant="destructive"
                      className="flex items-center gap-1"
                    >
                      <AlertTriangle className="h-3 w-3" /> Critical
                    </Badge>
                  )}
                </div>
              </div>
              <div className="mt-2 flex items-center gap-4">
                <div className="flex items-center gap-1 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedDelivery?.scheduledDate}</span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedDelivery?.scheduledTime}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="driver">Select Driver</Label>
                <Select
                  value={selectedDriver}
                  onValueChange={setSelectedDriver}
                >
                  <SelectTrigger id="driver">
                    <SelectValue placeholder="Choose a driver" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockDrivers
                      .filter((driver) => driver.status === "active")
                      .map((driver) => (
                        <SelectItem key={driver.id} value={driver.id}>
                          {driver.name} ({driver.currentDeliveries} active
                          deliveries)
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAssignDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleAssignDriver}>Assign Driver</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Tasks Dialog */}
      <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Manage Tasks</DialogTitle>
            <DialogDescription>
              Add or remove tasks for this {selectedDelivery?.type}.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="mb-4 rounded-lg border p-4">
              <p className="font-medium capitalize">
                {selectedDelivery?.type} to {selectedDelivery?.to}
              </p>
              {selectedDelivery?.assignedDriver && (
                <p className="text-sm text-muted-foreground">
                  Assigned to: {selectedDelivery.assignedDriver.name}
                </p>
              )}
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-task">Add New Task</Label>
                <div className="flex gap-2">
                  <Input
                    id="new-task"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="Enter task description"
                    className="flex-1"
                  />
                  <Button onClick={handleAddTask}>Add</Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Current Tasks</Label>
                {(selectedDelivery?.tasks ?? []).length > 0 ? (
                  <div className="space-y-2 max-h-[200px] overflow-y-auto">
                    {(selectedDelivery?.tasks ?? []).map((task: any) => (
                      <div
                        key={task.id}
                        className="flex items-center justify-between rounded-md border p-3"
                      >
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id={`task-${task.id}`}
                            checked={task.isCompleted}
                            disabled
                          />
                          <label
                            htmlFor={`task-${task.id}`}
                            className={`text-sm ${
                              task.isCompleted
                                ? "line-through text-muted-foreground"
                                : ""
                            }`}
                          >
                            {task.description}
                          </label>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveTask(task.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    No tasks added yet
                  </div>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsTaskDialogOpen(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Notes Dialog */}
      <Dialog open={isNotesDialogOpen} onOpenChange={setIsNotesDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Delivery Notes</DialogTitle>
            <DialogDescription>
              Add special instructions or notes for this{" "}
              {selectedDelivery?.type}.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-2">
              <Label htmlFor="delivery-notes">Notes</Label>
              <Textarea
                id="delivery-notes"
                value={deliveryNotes}
                onChange={(e) => setDeliveryNotes(e.target.value)}
                placeholder="Add any special instructions or notes for this delivery"
                rows={6}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsNotesDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveNotes}>Save Notes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Helper component for delivery cards
function DeliveryCard({
  delivery,
  onAssign,
  onComplete,
  onAddTasks,
  onEditNotes,
  onToggleCritical,
}: {
  delivery: any;
  onAssign: () => void;
  onComplete: () => void;
  onAddTasks: () => void;
  onEditNotes: () => void;
  onToggleCritical: (isCritical: boolean) => void;
}) {
  return (
    <Card
      className={
        delivery.isCritical ? "border-red-300 dark:border-red-700" : ""
      }
    >
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge
                variant={delivery.type === "delivery" ? "default" : "secondary"}
                className="capitalize"
              >
                {delivery.type}
              </Badge>
              <Badge
                variant={
                  delivery.status === "pending"
                    ? "outline"
                    : delivery.status === "in_progress"
                    ? "secondary"
                    : "default"
                }
                className="capitalize"
              >
                {delivery.status.replace("_", " ")}
              </Badge>
              <Badge
                variant={
                  delivery.priority === "high" ? "destructive" : "outline"
                }
                className="capitalize"
              >
                {delivery.priority} priority
              </Badge>
              {delivery.isCritical && (
                <Badge
                  variant="destructive"
                  className="flex items-center gap-1"
                >
                  <AlertTriangle className="h-3 w-3" /> Critical
                </Badge>
              )}
              {delivery.route && (
                <Badge
                  variant="outline"
                  className="flex items-center gap-1 bg-blue-50 text-blue-700 border-blue-200"
                >
                  <Route className="h-3 w-3" /> {delivery.route.name}
                </Badge>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">From</p>
                <p className="text-sm text-muted-foreground">{delivery.from}</p>
              </div>
              <div>
                <p className="text-sm font-medium">To</p>
                <p className="text-sm text-muted-foreground">{delivery.to}</p>
              </div>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{delivery.scheduledDate}</span>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{delivery.scheduledTime}</span>
              </div>
              {delivery.assignedDriver && (
                <div className="flex items-center gap-1 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{delivery.assignedDriver.name}</span>
                </div>
              )}
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium mb-1">Items</p>
              <div className="space-y-1">
                {delivery.items.map((item: any) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-2 text-sm"
                  >
                    <Package className="h-3 w-3 text-muted-foreground" />
                    <span>
                      {item.name} - {item.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            {/* Add payment status information */}
            {delivery.paymentStatus && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-1 flex items-center gap-1">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />{" "}
                  Payment
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm">
                    Status:{" "}
                    <Badge
                      variant={
                        delivery.paymentStatus === "PAID"
                          ? "default"
                          : delivery.paymentStatus === "PENDING"
                          ? "outline"
                          : "destructive"
                      }
                    >
                      {delivery.paymentStatus}
                    </Badge>
                  </span>
                  {delivery.paymentMethod && (
                    <span className="text-sm text-muted-foreground">
                      Method: {delivery.paymentMethod}
                    </span>
                  )}
                  {delivery.paymentAmount > 0 && (
                    <span className="text-sm text-muted-foreground">
                      Amount: ${delivery.paymentAmount?.toFixed(2) || "0.00"}
                    </span>
                  )}
                  {delivery.paymentUpdatedBy && (
                    <span className="text-sm text-muted-foreground">
                      Updated by: {delivery.paymentUpdatedBy}
                    </span>
                  )}
                </div>
              </div>
            )}
            {delivery.tasks && delivery.tasks.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-1">Tasks</p>
                <div className="space-y-1">
                  {delivery.tasks.map((task: any) => (
                    <div
                      key={task.id}
                      className="flex items-center gap-2 text-sm"
                    >
                      <div
                        className={`h-3 w-3 rounded-full ${
                          task.isCompleted ? "bg-green-500" : "bg-gray-300"
                        }`}
                      ></div>
                      <span
                        className={
                          task.isCompleted
                            ? "line-through text-muted-foreground"
                            : ""
                        }
                      >
                        {task.description}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {delivery.notes && (
              <div className="mt-4 p-2 bg-muted rounded-md">
                <p className="text-sm font-medium mb-1 flex items-center gap-1">
                  <FileText className="h-3 w-3" /> Notes
                </p>
                <p className="text-sm text-muted-foreground">
                  {delivery.notes}
                </p>
              </div>
            )}
            {delivery.sourceType === "supply" && delivery.supplyRequestId && (
              <div className="mt-4 p-2 bg-muted rounded-md">
                <p className="text-sm font-medium mb-1 flex items-center gap-1">
                  <Package className="h-3 w-3" /> Supply Request
                </p>
                <p className="text-sm text-muted-foreground">
                  Based on approved supply request #{delivery.supplyRequestId}
                </p>
              </div>
            )}
          </div>
          <div className="flex flex-row md:flex-col gap-2 md:self-end">
            {delivery.status === "pending" && (
              <Button onClick={onAssign} size="sm" className="gap-1">
                <User className="h-4 w-4" />
                Assign Driver
              </Button>
            )}
            {delivery.status === "in_progress" && (
              <Button
                onClick={onComplete}
                size="sm"
                variant="outline"
                className="gap-1"
              >
                <CheckCircle className="h-4 w-4" />
                Mark Completed
              </Button>
            )}
            <Button
              onClick={onAddTasks}
              size="sm"
              variant="outline"
              className="gap-1"
            >
              <ClipboardList className="h-4 w-4" />
              Tasks
            </Button>
            <Button
              onClick={onEditNotes}
              size="sm"
              variant="outline"
              className="gap-1"
            >
              <FileText className="h-4 w-4" />
              Notes
            </Button>
            <div className="flex items-center space-x-2 mt-1">
              <Switch
                id={`critical-${delivery.id}`}
                checked={delivery.isCritical}
                onCheckedChange={onToggleCritical}
              />
              <Label htmlFor={`critical-${delivery.id}`} className="text-xs">
                Critical
              </Label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Empty state component
function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center border rounded-lg">
      <Truck className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium">{message}</h3>
      <p className="text-sm text-muted-foreground mt-2">
        Create new deliveries or check back later.
      </p>
    </div>
  );
}
