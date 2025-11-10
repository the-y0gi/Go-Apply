"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { 
  FileText, 
  Upload, 
  Download, 
  Eye, 
  Trash2, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  FileImage,
  Search,
  Filter
} from "lucide-react"
import DashboardSidebar from "@/components/dashboard/DashboardSidebar"
import DashboardHeader from "@/components/dashboard/DashboardHeader"
import ProtectedRoute from "@/components/auth/ProtectedRoute"

const documents = [
  {
    id: 1,
    name: "Academic Transcripts - Bachelor's Degree",
    type: "Transcript",
    format: "PDF",
    size: "2.4 MB",
    uploadDate: "Nov 10, 2024",
    status: "Verified",
    statusColor: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    universities: ["University of Toronto", "ETH Zurich"],
    required: true,
    expiryDate: null
  },
  {
    id: 2,
    name: "Statement of Purpose - Computer Science",
    type: "SOP",
    format: "PDF",
    size: "1.8 MB",
    uploadDate: "Nov 12, 2024",
    status: "Pending Review",
    statusColor: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    universities: ["University of Toronto", "University of Melbourne"],
    required: true,
    expiryDate: null
  },
  {
    id: 3,
    name: "IELTS Academic Test Report",
    type: "English Test",
    format: "PDF",
    size: "850 KB",
    uploadDate: "Oct 15, 2024",
    status: "Verified",
    statusColor: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    universities: ["University of Melbourne"],
    required: true,
    expiryDate: "Oct 15, 2026"
  },
  {
    id: 4,
    name: "Letter of Recommendation - Prof. Smith",
    type: "LOR",
    format: "PDF",
    size: "1.2 MB",
    uploadDate: "Nov 5, 2024",
    status: "Verified",
    statusColor: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    universities: ["University of Toronto", "ETH Zurich", "Imperial College London"],
    required: true,
    expiryDate: null
  },
  {
    id: 5,
    name: "Updated Resume - 2024",
    type: "Resume",
    format: "PDF",
    size: "640 KB",
    uploadDate: "Nov 14, 2024",
    status: "Verified",
    statusColor: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    universities: ["University of Toronto", "University of Melbourne", "ETH Zurich", "Imperial College London"],
    required: true,
    expiryDate: null
  },
  {
    id: 6,
    name: "TOEFL iBT Score Report",
    type: "English Test",
    format: "PDF",
    size: "920 KB",
    uploadDate: "Sep 20, 2024",
    status: "Verified",
    statusColor: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    universities: ["ETH Zurich"],
    required: true,
    expiryDate: "Sep 20, 2026"
  },
  {
    id: 7,
    name: "Portfolio - Software Projects",
    type: "Portfolio",
    format: "PDF",
    size: "15.2 MB",
    uploadDate: "Nov 8, 2024",
    status: "Draft",
    statusColor: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
    universities: [],
    required: false,
    expiryDate: null
  }
]

const requiredDocuments = [
  { name: "Academic Transcripts", description: "Official transcripts from all attended institutions", status: "completed" },
  { name: "Statement of Purpose", description: "Personal statement explaining your academic goals", status: "completed" },
  { name: "Letters of Recommendation", description: "2-3 letters from academic or professional references", status: "completed" },
  { name: "Resume/CV", description: "Updated resume highlighting relevant experience", status: "completed" },
  { name: "English Proficiency Test", description: "IELTS, TOEFL, or other accepted English tests", status: "completed" },
  { name: "Passport Copy", description: "Valid passport for international applications", status: "missing" },
  { name: "Research Proposal", description: "For research-based programs (if applicable)", status: "optional" }
]

const getFileIcon = (format: string) => {
  switch (format.toLowerCase()) {
    case 'pdf':
      return <FileText className="w-5 h-5 text-red-500" />
    case 'jpg':
    case 'jpeg':
    case 'png':
      return <FileImage className="w-5 h-5 text-blue-500" />
    case 'xlsx':
    case 'xls':
      return <FileText className="w-5 h-5 text-green-500" />
    default:
      return <FileText className="w-5 h-5 text-gray-500" />
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Verified":
      return <CheckCircle className="w-4 h-4 text-green-600" />
    case "Pending Review":
      return <Clock className="w-4 h-4 text-yellow-600" />
    case "Draft":
      return <AlertCircle className="w-4 h-4 text-gray-600" />
    default:
      return <AlertCircle className="w-4 h-4 text-gray-600" />
  }
}

export default function DocumentsPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const filterDocuments = (tab: string) => {
    let filtered = documents

    if (tab !== "all") {
      filtered = filtered.filter(doc => doc.type.toLowerCase().includes(tab.toLowerCase()))
    }

    if (searchTerm) {
      filtered = filtered.filter(doc => 
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.type.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    return filtered
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
                    <h1 className="text-3xl font-bold text-foreground">Documents</h1>
                    <p className="text-muted-foreground mt-1">Manage your application documents and requirements</p>
                  </div>
                  <Button className="bg-primary hover:bg-primary/90">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Document
                  </Button>
                </div>
              </motion.div>

              {/* Document Requirements Overview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="bg-card/50 backdrop-blur border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      Document Requirements
                    </CardTitle>
                    <CardDescription>Track your application document requirements</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {requiredDocuments.map((doc, index) => (
                        <motion.div
                          key={doc.name}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: 0.1 * index }}
                          className="p-4 border border-border/50 rounded-lg bg-background/50 backdrop-blur"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-foreground text-sm">{doc.name}</h4>
                            {doc.status === "completed" && <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />}
                            {doc.status === "missing" && <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />}
                            {doc.status === "optional" && <Clock className="w-4 h-4 text-yellow-600 flex-shrink-0" />}
                          </div>
                          <p className="text-xs text-muted-foreground">{doc.description}</p>
                          <Badge 
                            className={`mt-2 text-xs ${
                              doc.status === "completed" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" :
                              doc.status === "missing" ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300" :
                              "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                            }`}
                          >
                            {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Document Library */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="bg-card/50 backdrop-blur border-border/50">
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <CardTitle>Document Library</CardTitle>
                        <CardDescription>All your uploaded documents</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                          <Input
                            placeholder="Search documents..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 bg-background/50 backdrop-blur border-border/50"
                          />
                        </div>
                        <Button variant="outline" size="sm" className="bg-background/50 backdrop-blur border-border/50">
                          <Filter className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                      <TabsList className="grid w-full grid-cols-6">
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="transcript">Transcripts</TabsTrigger>
                        <TabsTrigger value="sop">SOP</TabsTrigger>
                        <TabsTrigger value="lor">LOR</TabsTrigger>
                        <TabsTrigger value="test">Tests</TabsTrigger>
                        <TabsTrigger value="other">Other</TabsTrigger>
                      </TabsList>

                      <TabsContent value={activeTab} className="space-y-4 mt-6">
                        {filterDocuments(activeTab).map((document, index) => (
                          <motion.div
                            key={document.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 * index }}
                            className="flex items-center justify-between p-4 border border-border/50 rounded-lg bg-background/50 backdrop-blur hover:bg-background/70 transition-colors"
                          >
                            <div className="flex items-center gap-4 flex-1">
                              {getFileIcon(document.format)}
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-foreground truncate">{document.name}</h4>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                                  <span>{document.type}</span>
                                  <span>{document.format.toUpperCase()}</span>
                                  <span>{document.size}</span>
                                  <span>Uploaded {document.uploadDate}</span>
                                </div>
                                {document.universities.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {document.universities.map((uni) => (
                                      <Badge key={uni} variant="secondary" className="text-xs">
                                        {uni}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                                {document.expiryDate && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Expires: {document.expiryDate}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1">
                                {getStatusIcon(document.status)}
                                <Badge className={document.statusColor}>
                                  {document.status}
                                </Badge>
                              </div>
                              
                              <div className="flex items-center gap-1">
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <Download className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                                  <Trash2 className="w-4 h-4" />
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