"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// Type definition for material requests
interface MaterialRequest {
  id: string;
  title: string;
  description: string;
  requestedBy: string;
  requestDate: string;
  status: "pending" | "accepted" | "rejected";
  urgency: "high" | "medium" | "low";
  quantity: number;
  unit: string;
  materialType: string;
  notes: string;
  estimatedDelivery?: string;
  responseNotes?: string;
}

// Mock data for material requests
const mockMaterialRequests: MaterialRequest[] = [
  {
    id: "MR-001",
    title: "Raw Milk Supply",
    description: "Need 500 liters of raw milk for production",
    requestedBy: "Admin",
    requestDate: "2023-05-15",
    status: "pending",
    urgency: "high",
    quantity: 500,
    unit: "liters",
    materialType: "Raw Milk",
    notes: "Please ensure the milk is fresh and meets our quality standards",
  },
  {
    id: "MR-002",
    title: "Packaging Materials",
    description: "Need milk cartons for packaging",
    requestedBy: "Admin",
    requestDate: "2023-05-16",
    status: "pending",
    urgency: "medium",
    quantity: 1000,
    unit: "pieces",
    materialType: "Milk Cartons",
    notes: "Standard size cartons with our logo printed",
  },
  {
    id: "MR-003",
    title: "Flavoring Agents",
    description: "Vanilla and chocolate flavoring for milk products",
    requestedBy: "Admin",
    requestDate: "2023-05-14",
    status: "accepted",
    urgency: "low",
    quantity: 50,
    unit: "kg",
    materialType: "Flavoring",
    notes: "Food-grade flavoring agents only",
    estimatedDelivery: "2023-05-20",
    responseNotes: "Will deliver as requested",
  },
  {
    id: "MR-004",
    title: "Cleaning Supplies",
    description: "Industrial cleaning agents for equipment",
    requestedBy: "Admin",
    requestDate: "2023-05-10",
    status: "rejected",
    urgency: "medium",
    quantity: 100,
    unit: "liters",
    materialType: "Cleaning Agents",
    notes: "Must be suitable for food processing equipment",
    responseNotes: "Currently out of stock, can supply alternative brand",
  },
];

export default function MaterialRequestsPage() {
  const [materialRequests, setMaterialRequests] =
    useState(mockMaterialRequests);
  const [selectedRequest, setSelectedRequest] =
    useState<MaterialRequest | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [responseType, setResponseType] = useState("");
  const [estimatedDelivery, setEstimatedDelivery] = useState<Date | undefined>(
    undefined
  );
  const [responseNotes, setResponseNotes] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [urgencyFilter, setUrgencyFilter] = useState("all");

  interface MaterialRequest {
    id: string;
    title: string;
    description: string;
    requestedBy: string;
    requestDate: string;
    status: "pending" | "accepted" | "rejected";
    urgency: "high" | "medium" | "low";
    quantity: number;
    unit: string;
    materialType: string;
    notes: string;
    estimatedDelivery?: string;
    responseNotes?: string;
  }

  type ResponseType = "" | "accept" | "reject";

  const handleViewRequest = (request: MaterialRequest) => {
    setSelectedRequest(request);
    setIsDialogOpen(true);
    setResponseType("");
    setEstimatedDelivery(undefined);
    setResponseNotes("");
  };

  const handleResponse = () => {
    if (responseType === "accept" && !estimatedDelivery) {
      return;
    }

    if (!selectedRequest) {
      return;
    }

    const updatedRequests = materialRequests.map((req) => {
      if (req.id === selectedRequest.id) {
        return {
          ...req,
          status: responseType === "accept" ? "accepted" : "rejected",
          estimatedDelivery: estimatedDelivery
            ? format(estimatedDelivery, "yyyy-MM-dd")
            : undefined,
          responseNotes,
        } as MaterialRequest;
      }
      return req;
    });

    setMaterialRequests(updatedRequests);
    setIsDialogOpen(false);
  };

  const filteredRequests = materialRequests.filter((req) => {
    const matchesStatus = statusFilter === "all" || req.status === statusFilter;
    const matchesUrgency =
      urgencyFilter === "all" || req.urgency === urgencyFilter;
    return matchesStatus && matchesUrgency;
  });

  interface StatusBadgeProps {
    status: "pending" | "accepted" | "rejected" | string;
  }

  const getStatusBadge = (status: StatusBadgeProps["status"]): JSX.Element => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-100 text-yellow-800 border-yellow-300"
          >
            Pending
          </Badge>
        );
      case "accepted":
        return (
          <Badge
            variant="outline"
            className="bg-green-100 text-green-800 border-green-300"
          >
            Accepted
          </Badge>
        );
      case "rejected":
        return (
          <Badge
            variant="outline"
            className="bg-red-100 text-red-800 border-red-300"
          >
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  interface UrgencyBadgeProps {
    urgency: "high" | "medium" | "low" | string;
  }

  const getUrgencyBadge = (
    urgency: UrgencyBadgeProps["urgency"]
  ): JSX.Element => {
    switch (urgency) {
      case "high":
        return <Badge className="bg-red-500">High</Badge>;
      case "medium":
        return <Badge className="bg-orange-500">Medium</Badge>;
      case "low":
        return <Badge className="bg-blue-500">Low</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Material Requests
          </h1>
          <p className="text-muted-foreground">
            View and respond to material requests from the admin
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filter Requests</CardTitle>
          <CardDescription>
            Filter material requests by status and urgency
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="w-full sm:w-auto">
              <label className="text-sm font-medium mb-1 block">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full sm:w-auto">
              <label className="text-sm font-medium mb-1 block">Urgency</label>
              <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Select urgency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Urgencies</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Material Requests</CardTitle>
          <CardDescription>
            {filteredRequests.length} material requests found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Material Type</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Request Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Urgency</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.length > 0 ? (
                filteredRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.id}</TableCell>
                    <TableCell>{request.title}</TableCell>
                    <TableCell>{request.materialType}</TableCell>
                    <TableCell>
                      {request.quantity} {request.unit}
                    </TableCell>
                    <TableCell>{request.requestDate}</TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    <TableCell>{getUrgencyBadge(request.urgency)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewRequest(request)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-6 text-muted-foreground"
                  >
                    No material requests found matching your filters
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedRequest && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Material Request Details</DialogTitle>
              <DialogDescription>
                Review the details and respond to this material request
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-sm">Request ID</h3>
                  <p>{selectedRequest.id}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Status</h3>
                  <p>{getStatusBadge(selectedRequest.status)}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Requested By</h3>
                  <p>{selectedRequest.requestedBy}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Request Date</h3>
                  <p>{selectedRequest.requestDate}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Material Type</h3>
                  <p>{selectedRequest.materialType}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Quantity</h3>
                  <p>
                    {selectedRequest.quantity} {selectedRequest.unit}
                  </p>
                </div>
                <div className="col-span-2">
                  <h3 className="font-semibold text-sm">Title</h3>
                  <p>{selectedRequest.title}</p>
                </div>
                <div className="col-span-2">
                  <h3 className="font-semibold text-sm">Description</h3>
                  <p>{selectedRequest.description}</p>
                </div>
                <div className="col-span-2">
                  <h3 className="font-semibold text-sm">Notes</h3>
                  <p>{selectedRequest.notes}</p>
                </div>

                {selectedRequest.status === "accepted" && (
                  <>
                    <div className="col-span-2">
                      <h3 className="font-semibold text-sm">
                        Estimated Delivery
                      </h3>
                      <p>{selectedRequest.estimatedDelivery}</p>
                    </div>
                    <div className="col-span-2">
                      <h3 className="font-semibold text-sm">Response Notes</h3>
                      <p>{selectedRequest.responseNotes}</p>
                    </div>
                  </>
                )}

                {selectedRequest.status === "rejected" && (
                  <div className="col-span-2">
                    <h3 className="font-semibold text-sm">Rejection Reason</h3>
                    <p>{selectedRequest.responseNotes}</p>
                  </div>
                )}
              </div>

              {selectedRequest.status === "pending" && (
                <>
                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-2">Respond to Request</h3>
                    <div className="flex gap-4 mb-4">
                      <Button
                        variant={
                          responseType === "accept" ? "default" : "outline"
                        }
                        className={
                          responseType === "accept"
                            ? "bg-green-600 hover:bg-green-700"
                            : ""
                        }
                        onClick={() => setResponseType("accept")}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Accept
                      </Button>
                      <Button
                        variant={
                          responseType === "reject" ? "default" : "outline"
                        }
                        className={
                          responseType === "reject"
                            ? "bg-red-600 hover:bg-red-700"
                            : ""
                        }
                        onClick={() => setResponseType("reject")}
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Reject
                      </Button>
                    </div>

                    {responseType === "accept" && (
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium mb-1 block">
                            Estimated Delivery Date
                          </label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !estimatedDelivery && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {estimatedDelivery
                                  ? format(estimatedDelivery, "PPP")
                                  : "Select date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={estimatedDelivery}
                                onSelect={setEstimatedDelivery}
                                initialFocus
                                disabled={(date) => date < new Date()}
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-1 block">
                            Response Notes
                          </label>
                          <Textarea
                            placeholder="Add any additional notes about your acceptance..."
                            value={responseNotes}
                            onChange={(e) => setResponseNotes(e.target.value)}
                          />
                        </div>
                      </div>
                    )}

                    {responseType === "reject" && (
                      <div>
                        <label className="text-sm font-medium mb-1 block">
                          Rejection Reason
                        </label>
                        <Textarea
                          placeholder="Please provide a reason for rejecting this request..."
                          value={responseNotes}
                          onChange={(e) => setResponseNotes(e.target.value)}
                          required
                        />
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              {selectedRequest.status === "pending" && responseType && (
                <Button onClick={handleResponse}>Submit Response</Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
