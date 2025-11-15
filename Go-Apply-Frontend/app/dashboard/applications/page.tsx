"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  MapPin,
  Eye,
  Trash2,
  DollarSign,
} from "lucide-react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useRouter } from "next/navigation";
import ApplicationDetailModal from "@/components/applications/ApplicationDetailModal";
import toast, { Toaster } from "react-hot-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

//Fetch all user applications
const useApplications = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApps = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken")?.replace(/^"|"$/g, "");
      const res = await axios.get(`${API_URL}/applications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications(res.data.data.applications || []);
    } catch (err) {
      console.error("Error fetching applications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  return { applications, setApplications, loading, fetchApps };
};

const calculateProgress = (progress: any): number => {
  if (!progress) return 0;
  const steps = Object.values(progress).filter(Boolean).length;
  const total = Object.keys(progress).length;
  return Math.round((steps / total) * 100);
};

const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case "accepted":
      return "bg-green-100 text-green-800";
    case "rejected":
      return "bg-red-100 text-red-800";
    case "under review":
      return "bg-yellow-100 text-yellow-800";
    case "submitted":
      return "bg-blue-100 text-blue-800";
    case "draft":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case "accepted":
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    case "rejected":
      return <XCircle className="w-4 h-4 text-red-600" />;
    case "under review":
      return <Clock className="w-4 h-4 text-yellow-600" />;
    case "submitted":
      return <FileText className="w-4 h-4 text-blue-600" />;
    default:
      return <AlertCircle className="w-4 h-4 text-gray-600" />;
  }
};

export default function ApplicationsPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedApp, setSelectedApp] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const { applications, setApplications, loading, fetchApps } =
    useApplications();

  const handleNewApplication = () => router.push("/dashboard/search");

  //Delete Application
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this application?")) return;
    try {
      const token = localStorage.getItem("authToken")?.replace(/^"|"$/g, "");
      await axios.delete(`${API_URL}/applications/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications((prev) => prev.filter((a) => a._id !== id));
      toast.success("Application deleted successfully");
    } catch (err) {
      toast.error("Failed to delete application");
    }
  };

  // Payment handler
  const handlePayment = async (applicationId: string) => {
    router.push(`/dashboard/payments?applicationId=${applicationId}`);
  };

  //Update Application After Modal Changes
  const handleApplicationUpdate = (updatedApp: any) => {
    setApplications((prev) =>
      prev.map((a) => (a._id === updatedApp._id ? updatedApp : a))
    );
  };

  //Filter applications
  const filterApplications = (status: string) => {
    if (status === "all") return applications;
    return applications.filter((app) =>
      app.status.toLowerCase().includes(status.toLowerCase())
    );
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex h-screen items-center justify-center">
          <p className="text-muted-foreground">Loading your applications...</p>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Toaster position="top-right" />
      <div className="flex h-screen">
        {/* Sidebar */}
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
                    <h1 className="text-3xl font-bold">My Applications</h1>
                    <p className="text-muted-foreground mt-1">
                      Track and manage your university applications
                    </p>
                  </div>
                  <Button onClick={handleNewApplication}>
                    <FileText className="w-4 h-4 mr-2" />
                    New Application
                  </Button>
                </div>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-4 gap-4"
              >
                <StatCard
                  title="Total Applications"
                  value={applications.length}
                  icon={<FileText className="h-8 w-8 text-primary" />}
                />
                <StatCard
                  title="Under Review"
                  value={
                    applications.filter(
                      (a) => a.status.toLowerCase() === "under review"
                    ).length
                  }
                  icon={<Clock className="h-8 w-8 text-yellow-600" />}
                />
                <StatCard
                  title="Accepted"
                  value={
                    applications.filter(
                      (a) => a.status.toLowerCase() === "accepted"
                    ).length
                  }
                  icon={<CheckCircle className="h-8 w-8 text-green-600" />}
                />
                <StatCard
                  title="Draft"
                  value={
                    applications.filter(
                      (a) => a.status.toLowerCase() === "draft"
                    ).length
                  }
                  icon={<AlertCircle className="h-8 w-8 text-gray-600" />}
                />
              </motion.div>
              {/* Applications */}
              <Card className="bg-card/50 backdrop-blur border-border/50">
                <CardHeader>
                  <CardTitle>Applications</CardTitle>
                  <CardDescription>
                    Manage your applied programs & universities
                  </CardDescription>
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
                      {filterApplications(activeTab).map((app, index) => (
                        <motion.div
                          key={app._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.1 * index }}
                          className="border border-border/50 rounded-lg p-6 bg-background/50 backdrop-blur"
                        >
                          <div className="flex flex-col lg:flex-row gap-6">
                            <div className="flex-1 space-y-4">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="text-lg font-semibold">
                                    {app.programId?.name}
                                  </h3>
                                  <p className="text-muted-foreground">
                                    {app.universityId?.name}
                                  </p>
                                  <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                                    <MapPin className="w-3 h-3" />
                                    {app.universityId?.country}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  {getStatusIcon(app.status)}
                                  <Badge className={getStatusColor(app.status)}>
                                    {app.status}
                                  </Badge>
                                </div>
                              </div>

                              {/* Progress */}
                              <div className="space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-muted-foreground">
                                    Application Progress
                                  </span>
                                  <span className="font-medium">
                                    {calculateProgress(app.progress)}%
                                  </span>
                                </div>
                                <Progress
                                  value={calculateProgress(app.progress)}
                                  className="h-2"
                                />

                                {/* Steps Progress */}
                                <div className="flex justify-between items-center text-xs">
                                  {/* Personal Info */}
                                  <div
                                    className={`flex flex-col items-center ${
                                      app.progress?.personalInfo
                                        ? "text-green-600"
                                        : "text-gray-400"
                                    }`}
                                  >
                                    {app.progress?.personalInfo ? (
                                      <CheckCircle className="w-4 h-4 mb-1" />
                                    ) : (
                                      <div className="w-4 h-4 border-2 border-gray-300 rounded-full mb-1"></div>
                                    )}
                                    <span>Personal Info</span>
                                  </div>

                                  {/* Academic Info */}
                                  <div
                                    className={`flex flex-col items-center ${
                                      app.progress?.academicInfo
                                        ? "text-green-600"
                                        : "text-gray-400"
                                    }`}
                                  >
                                    {app.progress?.academicInfo ? (
                                      <CheckCircle className="w-4 h-4 mb-1" />
                                    ) : (
                                      <div className="w-4 h-4 border-2 border-gray-300 rounded-full mb-1"></div>
                                    )}
                                    <span>Academic Info</span>
                                  </div>

                                  {/* Documents */}
                                  <div
                                    className={`flex flex-col items-center ${
                                      app.progress?.documents
                                        ? "text-green-600"
                                        : "text-gray-400"
                                    }`}
                                  >
                                    {app.progress?.documents ? (
                                      <CheckCircle className="w-4 h-4 mb-1" />
                                    ) : (
                                      <FileText className="w-4 h-4 mb-1" />
                                    )}
                                    <span>Documents</span>
                                  </div>

                                  {/* Payment */}
                                  <div
                                    className={`flex flex-col items-center ${
                                      app.progress?.payment
                                        ? "text-green-600"
                                        : "text-gray-400"
                                    }`}
                                  >
                                    {app.progress?.payment ? (
                                      <CheckCircle className="w-4 h-4 mb-1" />
                                    ) : (
                                      <DollarSign className="w-4 h-4 mb-1" />
                                    )}
                                    <span>Payment</span>
                                  </div>
                                </div>
                              </div>

                              {/* Details */}
                              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                                <Info
                                  label="Deadline"
                                  value={new Date(
                                    app.deadline
                                  ).toLocaleDateString()}
                                />
                                {/* <Info label="Tuition Fee" value={`$${app.tuitionFee}`} /> */}
                                <Info
                                  label="Tuition Fee"
                                  value={
                                    app.programId?.tuitionFee?.amount
                                      ? `$${app.programId.tuitionFee.amount} ${
                                          app.programId.tuitionFee.frequency ===
                                          "per_year"
                                            ? "/year"
                                            : ""
                                        }`
                                      : "Not available"
                                  }
                                />
                                <Info
                                  label="Selected Intake"
                                  value={
                                    app.intake && app.intake.length > 0
                                      ? `${
                                          app.intake[0].season
                                            .charAt(0)
                                            .toUpperCase() +
                                          app.intake[0].season.slice(1)
                                        } ${app.intake[0].year}`
                                      : "N/A"
                                  }
                                />
                                <Info
                                  label="Submitted"
                                  value={
                                    app.submittedAt
                                      ? new Date(
                                          app.submittedAt
                                        ).toLocaleDateString()
                                      : "Not submitted"
                                  }
                                />
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex lg:flex-col gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedApp(app);
                                  setShowModal(true);
                                }}
                              >
                                <Eye className="w-4 h-4 mr-2" /> View
                              </Button>

                              {app.status === "draft" && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-destructive"
                                  onClick={() => handleDelete(app._id)}
                                >
                                  <Trash2 className="w-4 h-4 mr-2" /> Delete
                                </Button>
                              )}

                              {/* PAYMENT BUTTON */}
                              {app.progress?.payment ? (
                                <Badge className="bg-green-100 text-green-800">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Paid
                                </Badge>
                              ) : app.progress?.personalInfo &&
                                app.progress?.academicInfo &&
                                app.progress?.documents ? (
                                <Button
                                  size="sm"
                                  className="bg-green-700 hover:bg-green-800 text-white"
                                  onClick={() => handlePayment(app._id)}
                                >
                                  Payment
                                </Button>
                              ) : (
                                <Badge
                                  variant="outline"
                                  className="text-gray-500"
                                >
                                  Click View to Complete All Steps
                                </Badge>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedApp && (
        <ApplicationDetailModal
          application={selectedApp}
          onClose={() => setShowModal(false)}
          onUpdate={handleApplicationUpdate}
        />
      )}
    </ProtectedRoute>
  );
}

function StatCard({ title, value, icon }: any) {
  return (
    <Card className="bg-card/50 backdrop-blur border-border/50 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
      <CardContent className="p-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        {icon}
      </CardContent>
    </Card>
  );
}

function Info({ label, value }: any) {
  return (
    <div>
      <p className="text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}
