"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { 
  Calendar as CalendarIcon, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Bell, 
  Plus,
  MapPin,
  GraduationCap,
  FileText
} from "lucide-react"
import DashboardSidebar from "@/components/dashboard/DashboardSidebar"
import DashboardHeader from "@/components/dashboard/DashboardHeader"
import ProtectedRoute from "@/components/auth/ProtectedRoute"

const deadlines = [
  {
    id: 1,
    title: "University of Toronto - Application Deadline",
    university: "University of Toronto",
    program: "Master of Science in Computer Science",
    country: "Canada",
    date: "2024-12-15",
    type: "Application",
    priority: "high",
    status: "upcoming",
    daysLeft: 10,
    requirements: ["Transcripts", "SOP", "LORs", "Resume", "English Test"],
    completed: ["Transcripts", "SOP", "LORs", "Resume"],
    notes: "Final deadline - no extensions available"
  },
  {
    id: 2,
    title: "Imperial College London - Document Submission",
    university: "Imperial College London",
    program: "MSc Artificial Intelligence",
    country: "United Kingdom",
    date: "2024-12-20",
    type: "Documents",
    priority: "medium",
    status: "upcoming",
    daysLeft: 15,
    requirements: ["LORs", "Resume", "English Test"],
    completed: [],
    notes: "Submit remaining documents"
  },
  {
    id: 3,
    title: "ETH Zurich - Scholarship Application",
    university: "ETH Zurich",
    program: "Master in Computer Science",
    country: "Switzerland",
    date: "2024-12-31",
    type: "Scholarship",
    priority: "high",
    status: "upcoming",
    daysLeft: 26,
    requirements: ["Essay", "Financial Documents", "Research Proposal"],
    completed: ["Essay"],
    notes: "Merit-based scholarship deadline"
  },
  {
    id: 4,
    title: "University of Melbourne - Interview Confirmation",
    university: "University of Melbourne",
    program: "Master of Data Science",
    country: "Australia",
    date: "2024-12-08",
    type: "Interview",
    priority: "high",
    status: "upcoming",
    daysLeft: 3,
    requirements: ["Confirm availability", "Prepare presentation"],
    completed: ["Confirm availability"],
    notes: "Video interview via Zoom"
  },
  {
    id: 5,
    title: "MIT - Early Decision Deadline",
    university: "Massachusetts Institute of Technology",
    program: "Master of Engineering",
    country: "United States",
    date: "2024-11-01",
    type: "Application",
    priority: "high",
    status: "overdue",
    daysLeft: -34,
    requirements: ["Complete Application"],
    completed: [],
    notes: "Missed deadline - consider regular decision"
  },
  {
    id: 6,
    title: "University of Oxford - Reference Letters",
    university: "University of Oxford",
    program: "MSc Computer Science",
    country: "United Kingdom",
    date: "2025-01-15",
    type: "Documents",
    priority: "medium",
    status: "upcoming",
    daysLeft: 41,
    requirements: ["3 Academic References"],
    completed: ["2 Academic References"],
    notes: "Waiting for final reference"
  }
]

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
    case "medium":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
    case "low":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
    case "upcoming":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
    case "overdue":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
  }
}

const getUrgencyIndicator = (daysLeft: number) => {
  if (daysLeft < 0) return { icon: AlertTriangle, color: "text-red-500", label: "Overdue" }
  if (daysLeft <= 7) return { icon: AlertTriangle, color: "text-red-500", label: "Urgent" }
  if (daysLeft <= 14) return { icon: Clock, color: "text-yellow-500", label: "Soon" }
  return { icon: Clock, color: "text-blue-500", label: "Upcoming" }
}

export default function DeadlinesPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeTab, setActiveTab] = useState("upcoming")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  const filterDeadlines = (status: string) => {
    if (status === "all") return deadlines
    if (status === "overdue") return deadlines.filter(d => d.daysLeft < 0)
    if (status === "urgent") return deadlines.filter(d => d.daysLeft >= 0 && d.daysLeft <= 7)
    if (status === "upcoming") return deadlines.filter(d => d.daysLeft > 7)
    return deadlines.filter(d => d.status === status)
  }

  const upcomingCount = deadlines.filter(d => d.status === "upcoming").length
  const overdueCount = deadlines.filter(d => d.daysLeft < 0).length
  const urgentCount = deadlines.filter(d => d.daysLeft >= 0 && d.daysLeft <= 7).length

  return (
    <ProtectedRoute>
      <div className="flex h-screen">
        <DashboardSidebar 
          collapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <DashboardHeader />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground">Deadlines</h1>
                    <p className="text-muted-foreground mt-1">Track important dates and application deadlines</p>
                  </div>
                  <Button className="bg-primary hover:bg-primary/90">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Deadline
                  </Button>
                </div>
              </motion.div>

              {/* Stats Overview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-4 gap-4"
              >
                <Card className="bg-card/50 backdrop-blur border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Deadlines</p>
                        <p className="text-2xl font-bold text-foreground">{deadlines.length}</p>
                      </div>
                      <CalendarIcon className="h-8 w-8 text-primary" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 backdrop-blur border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Overdue</p>
                        <p className="text-2xl font-bold text-foreground">{overdueCount}</p>
                      </div>
                      <AlertTriangle className="h-8 w-8 text-red-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 backdrop-blur border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Urgent (≤7 days)</p>
                        <p className="text-2xl font-bold text-foreground">{urgentCount}</p>
                      </div>
                      <Clock className="h-8 w-8 text-yellow-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 backdrop-blur border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Upcoming</p>
                        <p className="text-2xl font-bold text-foreground">{upcomingCount}</p>
                      </div>
                      <CheckCircle className="h-8 w-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Calendar */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="lg:col-span-1"
                >
                  <Card className="bg-card/50 backdrop-blur border-border/50">
                    <CardHeader>
                      <CardTitle>Calendar</CardTitle>
                      <CardDescription>View deadlines by date</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        className="rounded-md border border-border/50"
                      />
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Deadlines List */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="lg:col-span-2"
                >
                  <Card className="bg-card/50 backdrop-blur border-border/50">
                    <CardHeader>
                      <CardTitle>Deadlines</CardTitle>
                      <CardDescription>Manage your application deadlines</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="grid w-full grid-cols-4">
                          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                          <TabsTrigger value="urgent">Urgent</TabsTrigger>
                          <TabsTrigger value="overdue">Overdue</TabsTrigger>
                          <TabsTrigger value="all">All</TabsTrigger>
                        </TabsList>

                        <TabsContent value={activeTab} className="space-y-4 mt-6">
                          {filterDeadlines(activeTab).map((deadline, index) => {
                            const urgency = getUrgencyIndicator(deadline.daysLeft)
                            const UrgencyIcon = urgency.icon
                            
                            return (
                              <motion.div
                                key={deadline.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.1 * index }}
                                className="border border-border/50 rounded-lg p-4 bg-background/50 backdrop-blur hover:bg-background/70 transition-colors"
                              >
                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <h3 className="font-semibold text-foreground">{deadline.title}</h3>
                                      <Badge className={getPriorityColor(deadline.priority)}>
                                        {deadline.priority}
                                      </Badge>
                                      <Badge className={getStatusColor(deadline.status)}>
                                        {deadline.status}
                                      </Badge>
                                    </div>
                                    
                                    <div className="space-y-1 text-sm text-muted-foreground">
                                      <div className="flex items-center gap-1">
                                        <GraduationCap className="w-3 h-3" />
                                        {deadline.program}
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <MapPin className="w-3 h-3" />
                                        {deadline.university}, {deadline.country}
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <CalendarIcon className="w-3 h-3" />
                                        {new Date(deadline.date).toLocaleDateString()}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <div className="text-right">
                                      <div className={`flex items-center gap-1 ${urgency.color}`}>
                                        <UrgencyIcon className="w-4 h-4" />
                                        <span className="text-sm font-medium">
                                          {deadline.daysLeft < 0 
                                            ? `${Math.abs(deadline.daysLeft)} days overdue`
                                            : `${deadline.daysLeft} days left`
                                          }
                                        </span>
                                      </div>
                                      <p className="text-xs text-muted-foreground">{urgency.label}</p>
                                    </div>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                      <Bell className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>

                                {/* Requirements Progress */}
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-foreground">Requirements</p>
                                    <p className="text-sm text-muted-foreground">
                                      {deadline.completed.length}/{deadline.requirements.length} completed
                                    </p>
                                  </div>
                                  
                                  <div className="flex flex-wrap gap-1">
                                    {deadline.requirements.map((req) => (
                                      <Badge
                                        key={req}
                                        variant={deadline.completed.includes(req) ? "default" : "secondary"}
                                        className={`text-xs ${
                                          deadline.completed.includes(req)
                                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                            : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
                                        }`}
                                      >
                                        {deadline.completed.includes(req) && <CheckCircle className="w-3 h-3 mr-1" />}
                                        {req}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>

                                {deadline.notes && (
                                  <div className="mt-3 p-2 bg-muted/50 rounded text-sm text-muted-foreground">
                                    <FileText className="w-3 h-3 inline mr-1" />
                                    {deadline.notes}
                                  </div>
                                )}
                              </motion.div>
                            )
                          })}
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}