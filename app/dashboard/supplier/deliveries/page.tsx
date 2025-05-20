"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  Clock,
  MapPin,
  Package,
  Search,
  User,
  Truck,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DeliveryItem {
  name: string;
  quantity: string;
}

interface Delivery {
  id: string;
  type: "pickup" | "delivery";
  status: "scheduled" | "in_transit" | "completed" | string;
  date: string;
  time: string;
  location: string;
  driver: string;
  items: DeliveryItem[];
  notes?: string;
  contactPhone: string;
  vehicleDetails: string;
  estimatedArrival: string;
  loadingDock: string;
  specialInstructions?: string;
  completionNotes?: string;
  signedBy?: string;
}

// Mock data for deliveries
const mockDeliveries: Delivery[] = [
  {
    id: "del1",
    type: "pickup",
    status: "scheduled",
    date: "2023-05-20",
    time: "09:00 - 11:00",
    location: "Main Warehouse",
    driver: "John Smith",
    items: [
      { name: "Fresh Milk", quantity: "500 liters" },
      { name: "Cream", quantity: "100 liters" },
    ],
    notes: "Please have all items ready for pickup by 8:30 AM",
    contactPhone: "555-123-4567",
    vehicleDetails: "White Refrigerated Truck #103",
    estimatedArrival: "09:15 AM",
    loadingDock: "Dock #3",
    specialInstructions: "Temperature must be maintained at 4°C",
  },
  {
    id: "del2",
    type: "pickup",
    status: "in_transit",
    date: "2023-05-18",
    time: "13:00 - 15:00",
    location: "Production Facility",
    driver: "Mike Johnson",
    items: [
      { name: "Greek Yogurt", quantity: "300 kg" },
      { name: "Flavored Yogurt", quantity: "200 kg" },
    ],
    notes: "Driver will call 30 minutes before arrival",
    contactPhone: "555-987-6543",
    vehicleDetails: "Blue Refrigerated Van #85",
    estimatedArrival: "13:45 PM",
    loadingDock: "Dock #1",
    specialInstructions: "Fragile items, handle with care",
  },
  {
    id: "del3",
    type: "delivery",
    status: "scheduled",
    date: "2023-05-22",
    time: "10:00 - 12:00",
    location: "Supplier Warehouse",
    driver: "Sarah Williams",
    items: [
      { name: "Packaging Materials", quantity: "1000 units" },
      { name: "Labels", quantity: "5000 units" },
    ],
    notes: "Delivery of packaging materials for next month's production",
    contactPhone: "555-456-7890",
    vehicleDetails: "Delivery Truck #42",
    estimatedArrival: "10:30 AM",
    loadingDock: "Main Entrance",
    specialInstructions: "Keep packages dry",
  },
  {
    id: "del4",
    type: "pickup",
    status: "completed",
    date: "2023-05-15",
    time: "08:00 - 10:00",
    location: "Main Warehouse",
    driver: "Robert Davis",
    items: [
      { name: "Butter", quantity: "200 kg" },
      { name: "Cheese", quantity: "150 kg" },
    ],
    notes: "All items picked up successfully",
    contactPhone: "555-234-5678",
    vehicleDetails: "Refrigerated Truck #112",
    estimatedArrival: "08:15 AM",
    loadingDock: "Dock #2",
    specialInstructions: "Completed on time",
    completionNotes: "All items verified and loaded properly",
    signedBy: "Mark Wilson",
  },
  {
    id: "del5",
    type: "delivery",
    status: "completed",
    date: "2023-05-14",
    time: "14:00 - 16:00",
    location: "Supplier Warehouse",
    driver: "Lisa Brown",
    items: [
      { name: "Raw Milk", quantity: "1000 liters" },
      { name: "Sugar", quantity: "500 kg" },
    ],
    notes: "Delivery completed ahead of schedule",
    contactPhone: "555-345-6789",
    vehicleDetails: "Tanker Truck #78",
    estimatedArrival: "14:30 PM",
    loadingDock: "Liquid Receiving",
    specialInstructions: "Completed early",
    completionNotes: "All items delivered in excellent condition",
    signedBy: "Jennifer Adams",
  },
  {
    id: "del6",
    type: "pickup",
    status: "in_transit",
    date: "2023-05-19",
    time: "11:00 - 13:00",
    location: "Production Facility",
    driver: "David Wilson",
    items: [
      { name: "Chocolate Milk", quantity: "300 liters" },
      { name: "Flavored Milk", quantity: "200 liters" },
    ],
    notes: "Special handling required for flavored products",
    contactPhone: "555-567-8901",
    vehicleDetails: "Refrigerated Van #92",
    estimatedArrival: "11:45 AM",
    loadingDock: "Dock #4",
    specialInstructions: "Keep products upright during transport",
  },
];

export default function SupplierDeliveriesPage() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(
    null
  );
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);

  // Filter deliveries based on active tab, search term, and filters
  const filteredDeliveries = mockDeliveries.filter((delivery) => {
    // Filter by tab
    if (activeTab === "upcoming" && delivery.status !== "scheduled")
      return false;
    if (activeTab === "in-transit" && delivery.status !== "in_transit")
      return false;
    if (activeTab === "completed" && delivery.status !== "completed")
      return false;

    // Filter by search term
    const matchesSearch =
      delivery.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.items.some((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

    // Filter by type and status
    const matchesType = typeFilter === "all" || delivery.type === typeFilter;
    const matchesStatus =
      statusFilter === "all" || delivery.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  // Count deliveries by status
  const scheduledDeliveries = mockDeliveries.filter(
    (del) => del.status === "scheduled"
  ).length;
  const inTransitDeliveries = mockDeliveries.filter(
    (del) => del.status === "in_transit"
  ).length;
  const completedDeliveries = mockDeliveries.filter(
    (del) => del.status === "completed"
  ).length;

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return <Badge className="bg-blue-500">Scheduled</Badge>;
      case "in_transit":
        return <Badge className="bg-amber-500">In Transit</Badge>;
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Get type badge
  const getTypeBadge = (type: string) => {
    switch (type) {
      case "pickup":
        return (
          <Badge
            variant="outline"
            className="border-purple-500 text-purple-500"
          >
            Pickup
          </Badge>
        );
      case "delivery":
        return (
          <Badge variant="outline" className="border-teal-500 text-teal-500">
            Delivery
          </Badge>
        );
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  interface DeliveryItem {
    name: string;
    quantity: string;
  }

  interface Delivery {
    id: string;
    type: "pickup" | "delivery";
    status: "scheduled" | "in_transit" | "completed" | string;
    date: string;
    time: string;
    location: string;
    driver: string;
    items: DeliveryItem[];
    notes?: string;
    contactPhone: string;
    vehicleDetails: string;
    estimatedArrival: string;
    loadingDock: string;
    specialInstructions?: string;
    completionNotes?: string;
    signedBy?: string;
  }

  const viewDeliveryDetails = (delivery: Delivery) => {
    setSelectedDelivery(delivery);
    setIsViewDetailsOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Deliveries & Pickups</h1>
        <p className="text-muted-foreground">
          Manage your scheduled pickups and deliveries
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-blue-50 dark:bg-blue-950 border-blue-100 dark:border-blue-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {scheduledDeliveries}
            </div>
            <p className="text-xs text-muted-foreground">
              Upcoming pickups and deliveries
            </p>
          </CardContent>
        </Card>
        <Card className="bg-amber-50 dark:bg-amber-950 border-amber-100 dark:border-amber-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">In Transit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {inTransitDeliveries}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently in progress
            </p>
          </CardContent>
        </Card>
        <Card className="bg-green-50 dark:bg-green-950 border-green-100 dark:border-green-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {completedDeliveries}
            </div>
            <p className="text-xs text-muted-foreground">
              Successfully completed
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs
        defaultValue="upcoming"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="in-transit">In Transit</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search deliveries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-full sm:w-[200px]"
              />
            </div>
            <div className="flex gap-2">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[130px]">
                  <div className="flex items-center gap-2">
                    <span>Type</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="pickup">Pickups</SelectItem>
                  <SelectItem value="delivery">Deliveries</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px]">
                  <div className="flex items-center gap-2">
                    <span>Status</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="in_transit">In Transit</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <TabsContent value="upcoming" className="mt-0">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredDeliveries.length > 0 ? (
              filteredDeliveries.map((delivery) => (
                <Card key={delivery.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">
                          {delivery.type === "pickup"
                            ? "Pickup #"
                            : "Delivery #"}
                          {delivery.id.substring(3)}
                        </CardTitle>
                        <CardDescription>{delivery.date}</CardDescription>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        {getTypeBadge(delivery.type)}
                        {getStatusBadge(delivery.status)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Time Window</p>
                          <p className="text-sm text-muted-foreground">
                            {delivery.time}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Location</p>
                          <p className="text-sm text-muted-foreground">
                            {delivery.location}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Driver</p>
                          <p className="text-sm text-muted-foreground">
                            {delivery.driver}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Package className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Items</p>
                          <ul className="text-sm text-muted-foreground space-y-1 mt-1">
                            {delivery.items.map((item, index) => (
                              <li key={index}>
                                {item.name} ({item.quantity})
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <div className="px-6 pb-4">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => viewDeliveryDetails(delivery)}
                    >
                      View Details
                    </Button>
                  </div>
                </Card>
              ))
            ) : (
              <div className="col-span-full flex justify-center items-center py-12 text-muted-foreground">
                No deliveries found matching your filters
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="in-transit" className="mt-0">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredDeliveries.length > 0 ? (
              filteredDeliveries.map((delivery) => (
                <Card key={delivery.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">
                          {delivery.type === "pickup"
                            ? "Pickup #"
                            : "Delivery #"}
                          {delivery.id.substring(3)}
                        </CardTitle>
                        <CardDescription>{delivery.date}</CardDescription>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        {getTypeBadge(delivery.type)}
                        {getStatusBadge(delivery.status)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Time Window</p>
                          <p className="text-sm text-muted-foreground">
                            {delivery.time}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Location</p>
                          <p className="text-sm text-muted-foreground">
                            {delivery.location}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Driver</p>
                          <p className="text-sm text-muted-foreground">
                            {delivery.driver}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Package className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Items</p>
                          <ul className="text-sm text-muted-foreground space-y-1 mt-1">
                            {delivery.items.map((item, index) => (
                              <li key={index}>
                                {item.name} ({item.quantity})
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <div className="px-6 pb-4 flex gap-2">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => viewDeliveryDetails(delivery)}
                    >
                      View Details
                    </Button>
                    <Button className="w-full">Track</Button>
                  </div>
                </Card>
              ))
            ) : (
              <div className="col-span-full flex justify-center items-center py-12 text-muted-foreground">
                No deliveries in transit matching your filters
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="mt-0">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredDeliveries.length > 0 ? (
              filteredDeliveries.map((delivery) => (
                <Card key={delivery.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">
                          {delivery.type === "pickup"
                            ? "Pickup #"
                            : "Delivery #"}
                          {delivery.id.substring(3)}
                        </CardTitle>
                        <CardDescription>{delivery.date}</CardDescription>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        {getTypeBadge(delivery.type)}
                        {getStatusBadge(delivery.status)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Time Window</p>
                          <p className="text-sm text-muted-foreground">
                            {delivery.time}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Location</p>
                          <p className="text-sm text-muted-foreground">
                            {delivery.location}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Driver</p>
                          <p className="text-sm text-muted-foreground">
                            {delivery.driver}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Package className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Items</p>
                          <ul className="text-sm text-muted-foreground space-y-1 mt-1">
                            {delivery.items.map((item, index) => (
                              <li key={index}>
                                {item.name} ({item.quantity})
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <div className="px-6 pb-4 flex gap-2">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => viewDeliveryDetails(delivery)}
                    >
                      View Details
                    </Button>
                    <Button variant="outline" className="w-full">
                      Receipt
                    </Button>
                  </div>
                </Card>
              ))
            ) : (
              <div className="col-span-full flex justify-center items-center py-12 text-muted-foreground">
                No completed deliveries matching your filters
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Delivery Details Dialog */}
      <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
          {selectedDelivery && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  {selectedDelivery.type === "pickup"
                    ? "Pickup"
                    : "Delivery"}{" "}
                  Details
                </DialogTitle>
                <DialogDescription>
                  {selectedDelivery.type === "pickup" ? "Pickup" : "Delivery"} #
                  {selectedDelivery.id} information
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Status</h3>
                  {getStatusBadge(selectedDelivery.status)}
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Date
                    </h3>
                    <p>{selectedDelivery.date}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Time Window
                    </h3>
                    <p>{selectedDelivery.time}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Location
                    </h3>
                    <p>{selectedDelivery.location}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Loading Dock
                    </h3>
                    <p>{selectedDelivery.loadingDock}</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-medium mb-2">Transport Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Driver
                      </h3>
                      <p>{selectedDelivery.driver}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Contact
                      </h3>
                      <p>{selectedDelivery.contactPhone}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Vehicle
                      </h3>
                      <p>{selectedDelivery.vehicleDetails}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Estimated Arrival
                      </h3>
                      <p>{selectedDelivery.estimatedArrival}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-medium mb-2">Items</h3>
                  <ul className="space-y-2">
                    {selectedDelivery.items.map((item, index) => (
                      <li key={index} className="flex justify-between">
                        <span>{item.name}</span>
                        <span className="text-muted-foreground">
                          {item.quantity}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {selectedDelivery.notes && (
                  <div className="rounded-md border p-3 bg-amber-50 dark:bg-amber-950 border-amber-100 dark:border-amber-900">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                      <h3 className="font-medium">Notes</h3>
                    </div>
                    <p className="text-sm">{selectedDelivery.notes}</p>
                  </div>
                )}

                {selectedDelivery.specialInstructions && (
                  <div className="rounded-md border p-3 bg-blue-50 dark:bg-blue-950 border-blue-100 dark:border-blue-900">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <h3 className="font-medium">Special Instructions</h3>
                    </div>
                    <p className="text-sm">
                      {selectedDelivery.specialInstructions}
                    </p>
                  </div>
                )}

                {selectedDelivery.status === "completed" &&
                  selectedDelivery.completionNotes && (
                    <div className="rounded-md border p-3 bg-green-50 dark:bg-green-950 border-green-100 dark:border-green-900">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                        <h3 className="font-medium">Completion Notes</h3>
                      </div>
                      <p className="text-sm">
                        {selectedDelivery.completionNotes}
                      </p>
                      {selectedDelivery.signedBy && (
                        <p className="text-sm mt-1">
                          Signed by:{" "}
                          <span className="font-medium">
                            {selectedDelivery.signedBy}
                          </span>
                        </p>
                      )}
                    </div>
                  )}
              </div>
              <DialogFooter className="flex gap-2">
                {selectedDelivery.status === "scheduled" && (
                  <>
                    <Button variant="outline">Reschedule</Button>
                    <Button>Confirm Ready</Button>
                  </>
                )}
                {selectedDelivery.status === "in_transit" && (
                  <Button>Track Location</Button>
                )}
                {selectedDelivery.status === "completed" && (
                  <Button variant="outline">Download Receipt</Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => setIsViewDetailsOpen(false)}
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
