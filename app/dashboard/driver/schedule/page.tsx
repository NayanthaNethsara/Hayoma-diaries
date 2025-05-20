"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  CheckCircle,
  X,
  Truck,
  Package,
  ClipboardList,
  AlertTriangle,
  FileText,
  MapPin,
  Route,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

// Mock data for weekly schedule
const weeklySchedule = [
  {
    day: "Monday",
    shifts: [
      {
        id: "1",
        startTime: "08:00",
        endTime: "12:00",
        routes: 2,
        status: "completed",
      },
      {
        id: "2",
        startTime: "13:00",
        endTime: "17:00",
        routes: 3,
        status: "completed",
      },
    ],
  },
  {
    day: "Tuesday",
    shifts: [
      {
        id: "3",
        startTime: "08:00",
        endTime: "12:00",
        routes: 2,
        status: "completed",
      },
      {
        id: "4",
        startTime: "13:00",
        endTime: "17:00",
        routes: 2,
        status: "completed",
      },
    ],
  },
  {
    day: "Wednesday",
    shifts: [
      {
        id: "5",
        startTime: "08:00",
        endTime: "12:00",
        routes: 3,
        status: "scheduled",
      },
      {
        id: "6",
        startTime: "13:00",
        endTime: "17:00",
        routes: 2,
        status: "scheduled",
      },
    ],
  },
  {
    day: "Thursday",
    shifts: [
      {
        id: "7",
        startTime: "08:00",
        endTime: "12:00",
        routes: 2,
        status: "scheduled",
      },
      {
        id: "8",
        startTime: "13:00",
        endTime: "17:00",
        routes: 2,
        status: "scheduled",
      },
    ],
  },
  {
    day: "Friday",
    shifts: [
      {
        id: "9",
        startTime: "08:00",
        endTime: "12:00",
        routes: 3,
        status: "scheduled",
      },
      {
        id: "10",
        startTime: "13:00",
        endTime: "17:00",
        routes: 2,
        status: "scheduled",
      },
    ],
  },
  {
    day: "Saturday",
    shifts: [],
  },
  {
    day: "Sunday",
    shifts: [],
  },
];

// Mock data for leave requests
const leaveRequests = [
  {
    id: "1",
    startDate: "2023-06-10",
    endDate: "2023-06-12",
    reason: "Family emergency",
    status: "approved",
    requestedOn: "2023-06-01",
  },
  {
    id: "2",
    startDate: "2023-07-15",
    endDate: "2023-07-20",
    reason: "Vacation",
    status: "pending",
    requestedOn: "2023-06-15",
  },
];

// Mock data for assigned deliveries
const assignedDeliveries = [
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
    route: {
      id: "route1",
      name: "North City Route",
      stops: 5,
      estimatedTime: "2 hours",
    },
  },
  {
    id: "del3",
    type: "delivery",
    from: "Central Warehouse",
    to: "Dairy Delight",
    status: "in_progress",
    items: [
      { id: "item5", name: "Yogurt", quantity: "40 cups" },
      { id: "item6", name: "Milk", quantity: "30 liters" },
    ],
    scheduledDate: "2023-05-16",
    scheduledTime: "09:00 AM",
    priority: "normal",
    isCritical: false,
    notes: "",
    tasks: [
      {
        id: "task3",
        description: "Verify product expiration dates",
        isCompleted: false,
      },
    ],
    route: {
      id: "route1",
      name: "North City Route",
      stops: 5,
      estimatedTime: "2 hours",
    },
  },
  {
    id: "pickup3",
    type: "pickup",
    from: "Mountain Dairy Farm",
    to: "Central Warehouse",
    status: "in_progress",
    items: [{ id: "item7", name: "Raw Milk", quantity: "150 liters" }],
    scheduledDate: "2023-05-16",
    scheduledTime: "14:00 PM",
    priority: "normal",
    isCritical: false,
    notes: "Call ahead 30 minutes before arrival",
    tasks: [
      {
        id: "task4",
        description: "Check milk temperature",
        isCompleted: false,
      },
      {
        id: "task5",
        description: "Collect quality certificate",
        isCompleted: false,
      },
    ],
    route: {
      id: "route3",
      name: "East County Route",
      stops: 6,
      estimatedTime: "2.5 hours",
    },
  },
];

export default function DriverSchedulePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("weekly");
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);
  const [isDeliveryDetailsOpen, setIsDeliveryDetailsOpen] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<any>(null);
  const [leaveForm, setLeaveForm] = useState({
    startDate: "",
    endDate: "",
    reason: "",
    leaveType: "vacation",
  });
  const [deliveries, setDeliveries] = useState(assignedDeliveries);

  const handleLeaveFormChange = (field: string, value: string) => {
    setLeaveForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLeaveSubmit = () => {
    // Validate form
    if (!leaveForm.startDate || !leaveForm.endDate || !leaveForm.reason) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Add new leave request
    const newLeaveRequest = {
      id: Math.random().toString(36).substring(7),
      startDate: leaveForm.startDate,
      endDate: leaveForm.endDate,
      reason: leaveForm.reason,
      status: "pending",
      requestedOn: new Date().toISOString().split("T")[0],
    };

    // In a real app, you would send this to the server
    toast.success("Leave request submitted successfully");
    setIsLeaveDialogOpen(false);

    // Reset form
    setLeaveForm({
      startDate: "",
      endDate: "",
      reason: "",
      leaveType: "vacation",
    });
  };

  const handleTaskToggle = (
    deliveryId: string,
    taskId: string,
    isCompleted: boolean
  ) => {
    setDeliveries(
      deliveries.map((delivery) =>
        delivery.id === deliveryId
          ? {
              ...delivery,
              tasks: delivery.tasks.map((task: any) =>
                task.id === taskId ? { ...task, isCompleted } : task
              ),
            }
          : delivery
      )
    );

    toast.success(`Task ${isCompleted ? "completed" : "reopened"}`);
  };

  const handleMarkDeliveryComplete = (deliveryId: string) => {
    // Check if all tasks are completed
    const delivery = deliveries.find((d) => d.id === deliveryId);
    const allTasksCompleted = delivery?.tasks.every(
      (task: any) => task.isCompleted
    );

    if (!allTasksCompleted) {
      toast.warning(
        "Please complete all tasks before marking the delivery as complete"
      );
      return;
    }

    setDeliveries(
      deliveries.map((delivery) =>
        delivery.id === deliveryId
          ? { ...delivery, status: "completed" }
          : delivery
      )
    );

    toast.success("Delivery marked as completed");
    setIsDeliveryDetailsOpen(false);
  };

  // Count active deliveries
  const activeDeliveries = deliveries.filter(
    (d) => d.status === "in_progress"
  ).length;
  const criticalDeliveries = deliveries.filter((d) => d.isCritical).length;
  const pendingTasks = deliveries.reduce((count, delivery) => {
    return (
      count + delivery.tasks.filter((task: any) => !task.isCompleted).length
    );
  }, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Schedule</h1>
          <p className="text-muted-foreground">
            View and manage your work schedule
          </p>
        </div>
        <Dialog open={isLeaveDialogOpen} onOpenChange={setIsLeaveDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
              <Calendar className="h-4 w-4" />
              Request Leave
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Request Leave</DialogTitle>
              <DialogDescription>
                Submit a request for time off from your schedule.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={leaveForm.startDate}
                    onChange={(e) =>
                      handleLeaveFormChange("startDate", e.target.value)
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date *</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={leaveForm.endDate}
                    onChange={(e) =>
                      handleLeaveFormChange("endDate", e.target.value)
                    }
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="leaveType">Leave Type</Label>
                <Select
                  value={leaveForm.leaveType}
                  onValueChange={(value) =>
                    handleLeaveFormChange("leaveType", value)
                  }
                >
                  <SelectTrigger id="leaveType">
                    <SelectValue placeholder="Select leave type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vacation">Vacation</SelectItem>
                    <SelectItem value="sick">Sick Leave</SelectItem>
                    <SelectItem value="personal">Personal Leave</SelectItem>
                    <SelectItem value="emergency">Family Emergency</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reason">Reason *</Label>
                <Textarea
                  id="reason"
                  value={leaveForm.reason}
                  onChange={(e) =>
                    handleLeaveFormChange("reason", e.target.value)
                  }
                  placeholder="Please provide a reason for your leave request"
                  rows={3}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsLeaveDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleLeaveSubmit}>Submit Request</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="weekly" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="weekly">Weekly Schedule</TabsTrigger>
          <TabsTrigger value="deliveries">My Deliveries</TabsTrigger>
          <TabsTrigger value="leave">Leave Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="weekly" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">This Week</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5 Working Days</div>
                <p className="text-xs text-muted-foreground">
                  10 shifts scheduled
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Hours
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">40 Hours</div>
                <p className="text-xs text-muted-foreground">8 hours per day</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Routes
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">21 Routes</div>
                <p className="text-xs text-muted-foreground">
                  4 completed, 17 scheduled
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            {weeklySchedule.map((day) => (
              <Card
                key={day.day}
                className={day.shifts.length === 0 ? "opacity-60" : ""}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{day.day}</CardTitle>
                  {day.shifts.length === 0 && (
                    <CardDescription>Day Off</CardDescription>
                  )}
                </CardHeader>
                {day.shifts.length > 0 && (
                  <CardContent>
                    <div className="space-y-4">
                      {day.shifts.map((shift) => (
                        <div key={shift.id} className="rounded-lg border p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="rounded-full bg-primary/10 p-2">
                                <Clock className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium">
                                  {shift.startTime} - {shift.endTime}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {shift.routes} routes scheduled
                                </p>
                              </div>
                            </div>
                            <Badge
                              className={
                                shift.status === "completed"
                                  ? "bg-green-500"
                                  : shift.status === "scheduled"
                                  ? "bg-blue-500"
                                  : "bg-yellow-500"
                              }
                            >
                              {shift.status.charAt(0).toUpperCase() +
                                shift.status.slice(1)}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="deliveries" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Deliveries
                </CardTitle>
                <Truck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeDeliveries}</div>
                <p className="text-xs text-muted-foreground">Assigned to you</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Critical Deliveries
                </CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-500">
                  {criticalDeliveries}
                </div>
                <p className="text-xs text-muted-foreground">High priority</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Tasks
                </CardTitle>
                <ClipboardList className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingTasks}</div>
                <p className="text-xs text-muted-foreground">
                  Tasks to complete
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            {deliveries.map((delivery) => (
              <Card
                key={delivery.id}
                className={`cursor-pointer hover:border-primary transition-colors ${
                  delivery.isCritical
                    ? "border-red-300 dark:border-red-700"
                    : ""
                }`}
                onClick={() => {
                  setSelectedDelivery(delivery);
                  setIsDeliveryDetailsOpen(true);
                }}
              >
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <Badge
                          variant={
                            delivery.type === "delivery"
                              ? "default"
                              : "secondary"
                          }
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
                          <p className="text-sm text-muted-foreground">
                            {delivery.from}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">To</p>
                          <p className="text-sm text-muted-foreground">
                            {delivery.to}
                          </p>
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
                      </div>
                      <div className="mt-4">
                        <p className="text-sm font-medium mb-1">
                          Items ({delivery.items.length})
                        </p>
                        <div className="space-y-1">
                          {delivery.items.slice(0, 2).map((item: any) => (
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
                          {delivery.items.length > 2 && (
                            <div className="text-sm text-muted-foreground">
                              + {delivery.items.length - 2} more items
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="mt-4">
                        <p className="text-sm font-medium mb-1">
                          Tasks ({delivery.tasks.length})
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="h-2 bg-gray-200 rounded-full flex-1">
                            <div
                              className="h-2 bg-green-500 rounded-full"
                              style={{
                                width: `${
                                  (delivery.tasks.filter(
                                    (t: any) => t.isCompleted
                                  ).length /
                                    delivery.tasks.length) *
                                  100
                                }%`,
                              }}
                            ></div>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {
                              delivery.tasks.filter((t: any) => t.isCompleted)
                                .length
                            }
                            /{delivery.tasks.length}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Delivery Details Dialog */}
          <Dialog
            open={isDeliveryDetailsOpen}
            onOpenChange={setIsDeliveryDetailsOpen}
          >
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <span className="capitalize">
                    {selectedDelivery?.type} Details
                  </span>
                  {selectedDelivery?.isCritical && (
                    <Badge
                      variant="destructive"
                      className="flex items-center gap-1"
                    >
                      <AlertTriangle className="h-3 w-3" /> Critical
                    </Badge>
                  )}
                </DialogTitle>
                <DialogDescription>
                  View details and manage tasks for this{" "}
                  {selectedDelivery?.type}.
                </DialogDescription>
              </DialogHeader>
              {selectedDelivery && (
                <div className="py-4">
                  <div className="rounded-lg border p-4 mb-4">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium">From</p>
                        <p className="text-sm">{selectedDelivery.from}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">To</p>
                        <p className="text-sm">{selectedDelivery.to}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Date</p>
                        <p className="text-sm">
                          {selectedDelivery.scheduledDate}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Time</p>
                        <p className="text-sm">
                          {selectedDelivery.scheduledTime}
                        </p>
                      </div>
                    </div>

                    {selectedDelivery.route && (
                      <div className="mb-4">
                        <p className="text-sm font-medium">Route</p>
                        <div className="flex items-center gap-2 mt-1">
                          <MapPin className="h-4 w-4 text-blue-500" />
                          <p className="text-sm">
                            {selectedDelivery.route.name} (
                            {selectedDelivery.route.stops} stops,{" "}
                            {selectedDelivery.route.estimatedTime})
                          </p>
                        </div>
                      </div>
                    )}

                    {selectedDelivery.notes && (
                      <div className="mb-4 p-2 bg-muted rounded-md">
                        <p className="text-sm font-medium mb-1 flex items-center gap-1">
                          <FileText className="h-3 w-3" /> Notes
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {selectedDelivery.notes}
                        </p>
                      </div>
                    )}

                    <div className="mb-4">
                      <p className="text-sm font-medium mb-2">Items</p>
                      <div className="space-y-2">
                        {selectedDelivery.items.map((item: any) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-2 text-sm border-b pb-2"
                          >
                            <Package className="h-4 w-4 text-muted-foreground" />
                            <div className="flex-1">
                              <p>{item.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {item.quantity}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-2">Tasks</p>
                      <div className="space-y-2">
                        {selectedDelivery.tasks.map((task: any) => (
                          <div
                            key={task.id}
                            className="flex items-center gap-2 text-sm"
                          >
                            <Checkbox
                              id={`task-${task.id}`}
                              checked={task.isCompleted}
                              onCheckedChange={(checked) =>
                                handleTaskToggle(
                                  selectedDelivery.id,
                                  task.id,
                                  checked as boolean
                                )
                              }
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
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      onClick={() =>
                        handleMarkDeliveryComplete(selectedDelivery.id)
                      }
                      disabled={selectedDelivery.status === "completed"}
                      className="gap-2"
                    >
                      <CheckCircle className="h-4 w-4" />
                      {selectedDelivery.status === "completed"
                        ? "Completed"
                        : "Mark as Completed"}
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="leave" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Leave Requests</CardTitle>
              <CardDescription>
                View and manage your leave requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              {leaveRequests.length > 0 ? (
                <div className="space-y-4">
                  {leaveRequests.map((request) => (
                    <div
                      key={request.id}
                      className={`rounded-lg border p-4 ${
                        request.status === "approved"
                          ? "border-green-100 dark:border-green-800"
                          : request.status === "pending"
                          ? "border-yellow-100 dark:border-yellow-800"
                          : "border-red-100 dark:border-red-800"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div
                            className={`rounded-full p-2 ${
                              request.status === "approved"
                                ? "bg-green-100 dark:bg-green-900"
                                : request.status === "pending"
                                ? "bg-yellow-100 dark:bg-yellow-900"
                                : "bg-red-100 dark:bg-red-900"
                            }`}
                          >
                            {request.status === "approved" ? (
                              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                            ) : request.status === "pending" ? (
                              <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                            ) : (
                              <X className="h-4 w-4 text-red-600 dark:text-red-400" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">
                              {request.startDate} to {request.endDate}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {request.reason}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge
                            className={
                              request.status === "approved"
                                ? "bg-green-500"
                                : request.status === "pending"
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }
                          >
                            {request.status.charAt(0).toUpperCase() +
                              request.status.slice(1)}
                          </Badge>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Requested on {request.requestedOn}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No Leave Requests</h3>
                  <p className="text-sm text-muted-foreground mt-2 max-w-md">
                    You haven't submitted any leave requests yet. Click the
                    "Request Leave" button to submit a new request.
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-center border-t pt-4">
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => setIsLeaveDialogOpen(true)}
              >
                <Calendar className="h-4 w-4" />
                New Leave Request
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
