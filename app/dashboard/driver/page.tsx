"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Truck, MapPin, CheckCircle, Clock, ArrowUpRight, Calendar, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

// Mock data for routes
const mockRoutes = [
  {
    id: "route1",
    name: "Morning Delivery Route",
    date: "2023-05-15",
    startTime: "08:00 AM",
    endTime: "12:00 PM",
    stops: [
      { id: "stop1", name: "Dairy Mart Shop", address: "123 Main St", time: "08:30 AM", status: "completed" },
      { id: "stop2", name: "Fresh Dairy Shop", address: "456 Oak Ave", time: "09:45 AM", status: "completed" },
      { id: "stop3", name: "Milk & More", address: "789 Pine Blvd", time: "11:00 AM", status: "pending" },
    ],
    totalDistance: "28 km",
    status: "in_progress",
  },
  {
    id: "route2",
    name: "Afternoon Pickup Route",
    date: "2023-05-15",
    startTime: "02:00 PM",
    endTime: "06:00 PM",
    stops: [
      { id: "stop4", name: "Farm Fresh Dairy", address: "101 Country Rd", time: "02:30 PM", status: "pending" },
      { id: "stop5", name: "Cheese Masters", address: "202 Dairy Lane", time: "04:00 PM", status: "pending" },
      { id: "stop6", name: "Dairy Delights", address: "303 Milk Way", time: "05:15 PM", status: "pending" },
    ],
    totalDistance: "35 km",
    status: "pending",
  },
  {
    id: "route3",
    name: "Tomorrow Morning Route",
    date: "2023-05-16",
    startTime: "07:00 AM",
    endTime: "11:00 AM",
    stops: [
      { id: "stop7", name: "Organic Dairy Shop", address: "404 Green St", time: "07:30 AM", status: "scheduled" },
      { id: "stop8", name: "Premium Dairy", address: "505 Quality Ave", time: "09:00 AM", status: "scheduled" },
      { id: "stop9", name: "Dairy Express", address: "606 Fast Blvd", time: "10:15 AM", status: "scheduled" },
    ],
    totalDistance: "32 km",
    status: "scheduled",
  },
]

export default function DriverDashboard() {
  const { user } = useAuth()
  const [isActive, setIsActive] = useState(true)
  const [selectedTab, setSelectedTab] = useState("today")
  const [availabilityDays, setAvailabilityDays] = useState({
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: false,
    sunday: false,
  })
  const [availabilityHours, setAvailabilityHours] = useState({
    start: "08:00",
    end: "17:00",
  })
  const [preferredArea, setPreferredArea] = useState("All Areas")
  const [maxDistance, setMaxDistance] = useState("50")
  const [notes, setNotes] = useState("")

  const handleStatusChange = (checked: boolean) => {
    setIsActive(checked)
    toast.success(`Status updated to ${checked ? "Active" : "Inactive"}`)
  }

  const handleAvailabilityDayChange = (day: string, checked: boolean) => {
    setAvailabilityDays((prev) => ({
      ...prev,
      [day]: checked,
    }))
  }

  const handleSaveAvailability = () => {
    toast.success("Availability settings saved successfully")
  }

  const todayRoutes = mockRoutes.filter((route) => route.date === "2023-05-15")
  const upcomingRoutes = mockRoutes.filter((route) => route.date !== "2023-05-15")
  const completedStops = todayRoutes
    .flatMap((route) => route.stops)
    .filter((stop) => stop.status === "completed").length
  const pendingStops = todayRoutes.flatMap((route) => route.stops).filter((stop) => stop.status === "pending").length
  const totalDistance = todayRoutes.reduce((sum, route) => sum + Number.parseInt(route.totalDistance), 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Driver Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.name}</p>
        </div>
        <Card className="w-full sm:w-auto">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="active-status">Active Status</Label>
              <Switch id="active-status" checked={isActive} onCheckedChange={handleStatusChange} />
            </div>
            <div
              className={`ml-2 rounded-full px-2 py-1 text-xs ${
                isActive
                  ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                  : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
              }`}
            >
              {isActive ? "Active" : "Inactive"}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="today" onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="today">Today's Routes</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming Routes</TabsTrigger>
          <TabsTrigger value="availability">My Availability</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Today's Deliveries</CardTitle>
                <Truck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{todayRoutes.length}</div>
                <p className="text-xs text-muted-foreground">
                  {completedStops} completed, {pendingStops} pending
                </p>
                <Button variant="link" className="mt-2 h-auto p-0 text-xs" asChild>
                  <Link href="/dashboard/driver/deliveries" className="flex items-center gap-1">
                    View deliveries <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Distance</CardTitle>
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalDistance} km</div>
                <p className="text-xs text-muted-foreground">Today's routes</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Next Stop</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {pendingStops > 0
                    ? todayRoutes.flatMap((route) => route.stops).find((stop) => stop.status === "pending")?.name
                    : "No pending stops"}
                </div>
                <p className="text-xs text-muted-foreground">
                  {pendingStops > 0
                    ? todayRoutes.flatMap((route) => route.stops).find((stop) => stop.status === "pending")?.time
                    : "All deliveries completed"}
                </p>
              </CardContent>
            </Card>
          </div>

          {todayRoutes.map((route) => (
            <Card key={route.id}>
              <CardHeader>
                <CardTitle>{route.name}</CardTitle>
                <CardDescription>
                  {route.startTime} - {route.endTime} • {route.totalDistance} total
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {route.stops.map((stop, index) => (
                    <div key={stop.id} className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="rounded-full bg-primary/10 p-2">
                            <Truck className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{stop.name}</p>
                            <p className="text-sm text-muted-foreground">{stop.address}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`rounded-full px-2 py-1 text-xs ${
                              stop.status === "completed"
                                ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
                            }`}
                          >
                            {stop.status === "completed" ? "Completed" : "Pending"}
                          </span>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Scheduled time</p>
                          <p className="text-sm font-medium">{stop.time}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Stop</p>
                          <p className="text-sm font-medium">
                            {index + 1} of {route.stops.length}
                          </p>
                        </div>
                        {stop.status !== "completed" && (
                          <Button size="sm" className="gap-1">
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
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-6">
          {upcomingRoutes.length > 0 ? (
            upcomingRoutes.map((route) => (
              <Card key={route.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{route.name}</CardTitle>
                      <CardDescription>
                        {new Date(route.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "short",
                          day: "numeric",
                        })}{" "}
                        •{route.startTime} - {route.endTime} • {route.totalDistance} total
                      </CardDescription>
                    </div>
                    <div
                      className={`rounded-full px-3 py-1 text-xs ${
                        route.status === "scheduled"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
                      }`}
                    >
                      {route.status === "scheduled" ? "Scheduled" : "In Progress"}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {route.stops.map((stop, index) => (
                      <div key={stop.id} className="rounded-lg border p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="rounded-full bg-primary/10 p-2">
                              <Truck className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{stop.name}</p>
                              <p className="text-sm text-muted-foreground">{stop.address}</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Stop {index + 1}</p>
                            <p className="text-sm text-muted-foreground">{stop.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No Upcoming Routes</h3>
                <p className="text-sm text-muted-foreground text-center mt-2">
                  You don't have any upcoming routes scheduled. Check back later or contact your manager.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="availability" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>My Availability</CardTitle>
              <CardDescription>Set your working days and hours</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-3">Available Days</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(availabilityDays).map(([day, isAvailable]) => (
                    <div key={day} className="flex items-center gap-2">
                      <Switch
                        id={`day-${day}`}
                        checked={isAvailable}
                        onCheckedChange={(checked) => handleAvailabilityDayChange(day, checked)}
                      />
                      <Label htmlFor={`day-${day}`} className="capitalize">
                        {day}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="start-time">Start Time</Label>
                  <Input
                    id="start-time"
                    type="time"
                    value={availabilityHours.start}
                    onChange={(e) => setAvailabilityHours((prev) => ({ ...prev, start: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-time">End Time</Label>
                  <Input
                    id="end-time"
                    type="time"
                    value={availabilityHours.end}
                    onChange={(e) => setAvailabilityHours((prev) => ({ ...prev, end: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="preferred-area">Preferred Area</Label>
                  <Select value={preferredArea} onValueChange={setPreferredArea}>
                    <SelectTrigger id="preferred-area">
                      <SelectValue placeholder="Select area" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All Areas">All Areas</SelectItem>
                      <SelectItem value="North Region">North Region</SelectItem>
                      <SelectItem value="South Region">South Region</SelectItem>
                      <SelectItem value="East Region">East Region</SelectItem>
                      <SelectItem value="West Region">West Region</SelectItem>
                      <SelectItem value="Central">Central</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-distance">Maximum Distance (km)</Label>
                  <Input
                    id="max-distance"
                    type="number"
                    value={maxDistance}
                    onChange={(e) => setMaxDistance(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional information about your availability..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="flex items-center gap-2 rounded-md border border-yellow-200 bg-yellow-50 p-3 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-200">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <p className="text-sm">
                  Changes to your availability may affect your assigned routes. Please inform your manager of any
                  long-term changes.
                </p>
              </div>

              <Button onClick={handleSaveAvailability} className="w-full md:w-auto">
                Save Availability
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
