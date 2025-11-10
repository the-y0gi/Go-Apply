"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Application } from "@/models/application"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  MapPin, 
  Calendar,
  Eye,
  Edit,
  Trash2
} from "lucide-react"
import DashboardSidebar from "@/components/dashboard/DashboardSidebar"
import DashboardHeader from "@/components/dashboard/DashboardHeader"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import { useRouter } from "next/navigation"

// Applications loaded from backend
const useApplications = () => {
  const [applications, setApplications] = useState<Application[]>([])
  const [loadingApplications, setLoadingApplications] = useState(true)
  const [applicationsError, setApplicationsError] = useState<string | null>(null)

  useEffect(() => {
      let mounted = true
    const fetchApplications = async () => {
      try {
        setLoadingApplications(true)
        // read token, strip surrounding quotes if present
        const rawToken = localStorage.getItem("authToken") || ""
        const token = rawToken.replace(/^"|"$/g, "").trim()

        if (!token) {
          if (!mounted) return
          setApplicationsError("No auth token found. Please login.")
          setApplications([])
          return
        }

        // set default header so all axios requests use it
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`

        // remove trailing slash from URL
        const res = await axios.get<{ success: boolean; data: { applications: Application[] } }>(
          "http://localhost:5000/api/applications/",
          { headers: { "Content-Type": "application/json" } }
        )

        if (!mounted) return
        setApplications(res.data?.data?.applications || [])
        setApplicationsError(null)
      } catch (err: any) {
        if (!mounted) return
        console.error("Failed to load applications:", err.response?.data ?? err.message)
        if (err.response?.status === 401) {
          setApplicationsError("Unauthorized. Please sign in again.")
          // optional: redirect to login
          // router.push("/auth/login")
        } else {
          setApplicationsError("Failed to load applications.")
        }
        setApplications([])
      } finally {
        if (mounted) setLoadingApplications(false)
      }
    }

    fetchApplications()
    return () => {
      mounted = false
    }
  }, [])

  return { applications, loadingApplications, applicationsError }
}

const calculateProgress = (progress: Application['progress']): number => {
  const steps = Object.values(progress).filter(Boolean).length;
  const total = Object.keys(progress).length;
  return Math.round((steps / total) * 100);
};

const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'accepted':
      return 'bg-green-100 text-green-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    case 'under review':
      return 'bg-yellow-100 text-yellow-800';
    case 'submitted':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function ApplicationsPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const router = useRouter()
  
  // Replace static applications with backend data
  const { applications, loadingApplications, applicationsError } = useApplications()

  // Add loading state
  if (loadingApplications) {
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
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-muted-foreground">Loading applications...</p>
                </div>
              </div>
            </main>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  // Update the filterApplications function to work with backend data
  const filterApplications = (status: string) => {
    if (status === "all") return applications
    return applications.filter(app => 
      app.status.toLowerCase().includes(status.toLowerCase())
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Accepted":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "Rejected":
        return <XCircle className="w-4 h-4 text-red-600" />
      case "Under Review":
        return <Clock className="w-4 h-4 text-yellow-600" />
      case "Submitted":
        return <FileText className="w-4 h-4 text-blue-600" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />
    }
  }

  const handleNewApplication = () => {
    router.push('/dashboard/search');
  }

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
                    <h1 className="text-3xl font-bold text-foreground">My Applications</h1>
                    <p className="text-muted-foreground mt-1">Track and manage your university applications</p>
                  </div>
                  <Button className="bg-primary hover:bg-primary/90"
                  onClick={handleNewApplication}>
                    <FileText className="w-4 h-4 mr-2" />
                    New Application
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
                <Card className="bg-card/50 backdrop-blur border-border/50 hover:bg-card/60 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Applications</p>
                        <p className="text-2xl font-bold text-foreground">{applications.length}</p>
                      </div>
                      <FileText className="h-8 w-8 text-primary" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 backdrop-blur border-border/50 hover:bg-card/60 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Under Review</p>
                        <p className="text-2xl font-bold text-foreground">
                          {applications.filter(app => app.status === "Under Review").length}
                        </p>
                      </div>
                      <Clock className="h-8 w-8 text-yellow-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 backdrop-blur border-border/50 hover:bg-card/60 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Accepted</p>
                        <p className="text-2xl font-bold text-foreground">
                          {applications.filter(app => app.status === "Accepted").length}
                        </p>
                      </div>
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 backdrop-blur border-border/50 hover:bg-card/60 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">In Draft</p>
                        <p className="text-2xl font-bold text-foreground">
                          {applications.filter(app => app.status === "Draft").length}
                        </p>
                      </div>
                      <AlertCircle className="h-8 w-8 text-gray-600" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Applications List */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="bg-card/50 backdrop-blur border-border/50 hover:bg-card/60 transition-all duration-300">
                  <CardHeader>
                    <CardTitle>Applications</CardTitle>
                    <CardDescription>Manage your university applications</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                      <TabsList className="grid w-full grid-cols-5">
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="draft">Draft</TabsTrigger>
                        <TabsTrigger value="submitted">Submitted</TabsTrigger>
                        <TabsTrigger value="review">Under Review</TabsTrigger>
                        <TabsTrigger value="accepted">Accepted</TabsTrigger>
                      </TabsList>

                      <TabsContent value={activeTab} className="space-y-4 mt-6">
                        {filterApplications(activeTab).map((application, index) => (
                          <motion.div
                            key={application._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 * index }}
                            className="border border-border/50 rounded-lg p-6 bg-background/50 backdrop-blur"
                          >
                            <div className="flex flex-col lg:flex-row gap-6">
                              {/* Application Info */}
                              <div className="flex-1 space-y-4">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h3 className="text-lg font-semibold text-foreground">
                                      {application.programId.name}
                                    </h3>
                                    <p className="text-muted-foreground">
                                      {application.universityId.name}
                                    </p>
                                    <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                                      <MapPin className="w-3 h-3" />
                                      {application.universityId.country}
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center gap-2">
                                    {getStatusIcon(application.status)}
                                    <Badge className={getStatusColor(application.status)}>
                                      {application.status}
                                    </Badge>
                                  </div>
                                </div>

                                {/* Progress */}
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Application Progress</span>
                                    <span className="text-foreground font-medium">
                                      {calculateProgress(application.progress ?? { personalInfo: false, academicInfo: false, documents: false, submitted: false })}%
                                    </span>
                                  </div>
                                  <Progress 
                                    value={calculateProgress(application.progress ?? { personalInfo: false, academicInfo: false, documents: false, submitted: false })} 
                                    className="h-2" 
                                  />
                                </div>

                                {/* Documents */}
                                <div className="space-y-2">
                                  <p className="text-sm font-medium text-foreground">Documents:</p>
                                  <div className="flex flex-wrap gap-2">
                                    {(application.documents || []).map((doc, idx) => (
                                      <Badge key={`${doc}-${idx}`} variant="secondary" className="text-xs">
                                        {doc}
                                      </Badge>
                                    ))}
                                    {(application.missingDocuments || []).map((doc, idx) => (
                                      <Badge key={`${doc}-${idx}`} variant="destructive" className="text-xs">
                                        {doc} (Missing)
                                      </Badge>
                                    ))}
                                  </div>
                                </div>

                                {/* Application Details */}
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                                  <div>
                                    <p className="text-muted-foreground">Submitted</p>
                                    <p className="font-medium text-foreground">
                                      {application.submittedAt ? new Date(application.submittedAt).toLocaleDateString() : 'Not submitted'}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">Deadline</p>
                                    <p className="font-medium text-foreground">
                                      {new Date(application.deadline).toLocaleDateString()}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">Application Fee</p>
                                    <p className="font-medium text-foreground">
                                      ${application.applicationFee}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">Last Update</p>
                                    <p className="font-medium text-foreground">
                                      {application.lastUpdate ? new Date(application.lastUpdate).toLocaleDateString() : 'N/A'}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="flex lg:flex-col gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="bg-background/50 backdrop-blur border-border/50"
                                  onClick={() => router.push(`/dashboard/applications/${application._id}`)}
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  View
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="bg-background/50 backdrop-blur border-border/50"
                                >
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="bg-background/50 backdrop-blur border-border/50 text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                                </Button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}