"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  Clock,
  ClipboardList,
  DollarSign,
  FileText,
  Package,
  Route,
  User,
} from "lucide-react";

// Helper component for delivery cards in admin view
export function AdminDeliveryCard({
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
