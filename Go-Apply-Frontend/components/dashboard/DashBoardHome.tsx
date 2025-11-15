// "use client";

// import { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Progress } from "@/components/ui/progress";
// import { useRouter } from "next/navigation";
// import {
//   FileText,
//   BookOpen,
//   CheckCircle,
//   User,
//   ArrowRight,
//   Upload,
//   DollarSign,
//   Search,
// } from "lucide-react";
// import axios from "axios";

// const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// interface ProgressData {
//   profileComplete: boolean;
//   hasApplications: boolean;
//   hasDocuments: boolean;
//   hasPaidApplications: boolean;
//   hasAcceptedApplications: boolean;
// }

// export default function DashboardHome() {
//   const router = useRouter();
//   const [progress, setProgress] = useState<ProgressData | null>(null);
//   const [loading, setLoading] = useState(true);

//   const steps = [
//     { id: 1, title: "Complete Profile", icon: User },
//     { id: 2, title: "Upload Documents", icon: Upload },
//     { id: 3, title: "Find Programs", icon: BookOpen },
//     { id: 4, title: "Apply Application", icon: FileText },
//     { id: 5, title: "Make Payment", icon: DollarSign },
//     { id: 6, title: "Get Acceptance", icon: CheckCircle },
//   ];

//   useEffect(() => {
//     const fetchProgress = async () => {
//       try {
//         const token = localStorage
//           .getItem("authToken")
//           ?.replace(/^"|"$/g, "")
//           .trim();
//         const res = await axios.get(`${API_URL}/users/progress`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setProgress(res.data.data.progress);
//       } catch (err) {
//          console.error("Progress fetch failed:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProgress();
//   }, []);

//   const calculateCurrentStep = () => {
//     if (!progress) return 1;

//     if (!progress.profileComplete) return 1;
//     if (!progress.hasApplications) return 2;
//     if (!progress.hasDocuments) return 3;
//     if (!progress.hasPaidApplications) return 4;
//     if (!progress.hasAcceptedApplications) return 5;
//     return 6;
//   };

//   const currentStep = calculateCurrentStep();
//   const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100;

//   const handleCompleteProfile = () => router.push("/dashboard/profile");
//   const handleFindProgram = () => router.push("/dashboard/search");
//   const handleViewDocuments = () => router.push("/dashboard/documents");
//   const handleViewApplications = () => router.push("/dashboard/applications");
//   const handleUploadDocuments = () =>
//     router.push("/dashboard/documents?upload=true");

//   // Check if profile is complete to show different buttons
//   const isProfileComplete = progress?.profileComplete;

//   if (loading) {
//     return <div className="p-6 text-center">Loading your progress...</div>;
//   }

//   return (
//     <div className="p-6 space-y-10">
//       {/* My Progress Section */}
//       <motion.div
//         initial={{ opacity: 0, y: 10 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.4 }}
//       >
//        <h1 className="text-4xl font-bold mb-4 text-center">
//   Your Journey to Study Abroad
// </h1>
// <p className="text-muted-foreground text-lg mb-6 text-center">
//   Track your progress and complete each step to achieve your dream
// </p>

//         {/* Progress Bar */}
//         <div className="max-w-4xl mx-auto mb-12">
//           <div className="flex items-center justify-between mb-2">
//             <span className="text-sm font-medium text-muted-foreground">
//               Step {currentStep} of {steps.length}
//             </span>
//             <span className="text-sm font-medium text-primary">
//               {Math.round(progressPercentage)}% Complete
//             </span>
//           </div>
//           <Progress value={progressPercentage} className="h-2" />
//         </div>

//         {/* Steps with connecting lines */}
//         <div className="max-w-5xl mx-auto relative">
//           {/* Connecting line */}
//           <div
//             className="absolute top-7 left-0 right-0 h-0.5 bg-border hidden md:block"
//             style={{
//               marginLeft: "7%",
//               marginRight: "7%",
//             }}
//           />

//           {/* Active progress line */}
//           <motion.div
//             className="absolute top-7 left-0 h-0.5 bg-primary hidden md:block"
//             initial={{ width: 0 }}
//             animate={{ width: `${progressPercentage * 0.86}%` }}
//             transition={{ duration: 0.8, ease: "easeInOut" }}
//             style={{ marginLeft: "7%" }}
//           />

//           {/* Steps */}
//           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 relative z-10">
//             {steps.map((step, index) => {
//               const isCompleted = index < currentStep - 1;
//               const isCurrent = index === currentStep - 1;
//               const isUpcoming = index > currentStep - 1;

//               return (
//                 <motion.div
//                   key={step.id}
//                   initial={{ opacity: 0, scale: 0.8 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   transition={{ duration: 0.3, delay: index * 0.1 }}
//                   className="flex flex-col items-center text-center"
//                 >
//                   <div
//                     className={`
//                       w-14 h-14 flex items-center justify-center rounded-full mb-3 transition-all duration-300
//                       ${
//                         isCompleted
//                           ? "bg-primary border-2 border-primary shadow-lg shadow-primary/20"
//                           : isCurrent
//                           ? "bg-primary/10 border-2 border-primary ring-4 ring-primary/20 animate-pulse"
//                           : "bg-muted border-2 border-border"
//                       }
//                     `}
//                   >
//                     {isCompleted ? (
//                       <CheckCircle className="w-7 h-7 text-primary-foreground" />
//                     ) : (
//                       <step.icon
//                         className={`
//                           w-6 h-6 transition-colors
//                           ${
//                             isCurrent ? "text-primary" : "text-muted-foreground"
//                           }
//                         `}
//                       />
//                     )}
//                   </div>
//                   <p
//                     className={`
//                       text-sm font-medium transition-colors
//                       ${
//                         isCurrent
//                           ? "text-foreground"
//                           : isCompleted
//                           ? "text-foreground"
//                           : "text-muted-foreground"
//                       }
//                     `}
//                   >
//                     {step.title}
//                   </p>
//                   {isCurrent && (
//                     <motion.div
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: 1 }}
//                       className="mt-1 px-2 py-0.5 bg-primary/10 rounded-full"
//                     >
//                       <span className="text-xs font-semibold text-primary">
//                         In Progress
//                       </span>
//                     </motion.div>
//                   )}
//                 </motion.div>
//               );
//             })}
//           </div>
//         </div>
//       </motion.div>

//       {/* Conditional Sections Based on Progress */}

//       {/* Profile Section - Show only if profile incomplete */}
//       {!isProfileComplete && (
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//           className="text-center"
//         >
//           <Card className="max-w-2xl mx-auto border-2 border-primary/20 shadow-lg">
//             <CardHeader>
//               <CardTitle className="text-xl">Before Applying</CardTitle>
//               <CardDescription>
//                 Complete your profile before starting your application.
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <Button
//                 size="lg"
//                 className="bg-primary hover:bg-primary/90 px-6"
//                 onClick={handleCompleteProfile}
//               >
//                 Complete Profile
//                 <ArrowRight className="ml-2 w-4 h-4" />
//               </Button>
//             </CardContent>
//           </Card>
//         </motion.div>
//       )}

//       {/* Documents Section - Show after profile complete */}
//       {isProfileComplete && currentStep === 2 && (
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: 0.2 }}
//           className="text-center"
//         >
//           <Card className="max-w-2xl mx-auto border-2 border-blue-200 shadow-lg">
//             <CardHeader>
//               <CardTitle className="text-xl">Upload Documents</CardTitle>
//               <CardDescription>
//                 Upload at least 1 document (optional) to continue with your
//                 applications.
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="flex flex-col sm:flex-row gap-4 justify-center">
//                 {/* <Button
//                   size="lg"
//                   variant="outline"
//                   className="px-6"
//                   onClick={handleViewDocuments}
//                 >
//                   View Documents
//                 </Button> */}
//                 <Button
//                   size="lg"
//                   className="px-6"
//                   onClick={handleUploadDocuments}
//                 >
//                   <Upload className="mr-2 w-4 h-4" />
//                   Upload Document
//                 </Button>
//               </div>
//               <p className="text-sm text-muted-foreground">
//                 * At least 1 document is recommended for better application
//                 processing
//               </p>
//             </CardContent>
//           </Card>
//         </motion.div>
//       )}

//       {/* Find Programs Section - Always show after profile complete */}
//       {isProfileComplete && (
//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6, delay: 0.3 }}
//           className="text-center"
//         >
//           <Card className="max-w-2xl mx-auto">
//             <CardHeader>
//               <CardTitle className="text-xl">
//                 {currentStep === 3
//                   ? "Find Programs to Apply"
//                   : "Continue Exploring"}
//               </CardTitle>
//               <CardDescription>
//                 {currentStep === 3
//                   ? "Search and find programs that match your profile."
//                   : "Explore more programs and manage your applications."}
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <Button
//                 size="lg"
//                 className=" hover:bg-green-700 px-6"
//                 onClick={handleFindProgram}
//               >
//                 <Search className="mr-2 w-4 h-4" />
//                 Find Programs
//               </Button>

//               {progress?.hasApplications && (
//                 <div className="pt-4 border-t">
//                   <Button variant="outline" onClick={handleViewApplications}>
//                     <FileText className="mr-2 w-4 h-4" />
//                     View My Applications
//                   </Button>
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </motion.div>
//       )}
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import {
  FileText,
  BookOpen,
  CheckCircle,
  User,
  ArrowRight,
  Upload,
  DollarSign,
  Search,
  GraduationCap,
  Users,
  Plus,
  MapPin,
  Calendar,
  Edit,
  Clock,
  Send,
  Eye,
  Loader2,
  AlertCircle,
  FileUser,
  FileUserIcon,
} from "lucide-react";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface ProgressData {
  profileComplete: boolean;
  hasApplications: boolean;
  hasDocuments: boolean;
  hasPaidApplications: boolean;
  hasAcceptedApplications: boolean;
}

interface DashboardStats {
  applicationsSubmitted: number;
  programsTracked: number;
  documentsUploaded: number;
  profileCompletion: string;
}

interface Application {
  id: string;
  university: string;
  program: string;
  country: string;
  status: "Under Review" | "Submitted" | "Draft" | "Accepted" | "Rejected";
  statusColor: string;
  deadline: string;
  progress: number;
  currentStep: number;
  appliedDate: string;
  degreeType: string;
}

interface DashboardResponse {
  success: boolean;
  data: {
    stats: DashboardStats;
    progress: ProgressData;
  };
}

interface ApplicationsResponse {
  success: boolean;
  data: {
    applications: Application[];
    total: number;
  };
}

export default function DashboardHome() {
  const router = useRouter();
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Stats data with real API integration
  const statsData = [
    {
      title: "Applications Submitted",
      value: stats?.applicationsSubmitted.toString() || "0",
      change: "+2 this month",
      icon: BookOpen,
      color: "text-blue-600",
    },
    {
      title: "Programs Tracked",
      value: stats?.programsTracked.toString() || "0",
      change: `${stats?.programsTracked || 0} active`,
      icon: GraduationCap,
      color: "text-primary",
    },
    {
      title: "Documents Uploaded",
      value: stats?.documentsUploaded.toString() || "0",
      change: "2 remaining",
      icon: FileText,
      color: "text-green-600",
    },
    {
      title: "Profile Completion",
      value: stats?.profileCompletion || "0%",
      change: stats?.profileCompletion === "100%" ? "Complete!" : "In Progress",
      icon: Users,
      color: "text-orange-600",
    },
  ];

  // Calculate current global step based on progress
  const calculateCurrentGlobalStep = () => {
    if (!progress) return 1;

    if (!progress.profileComplete) return 1;
    if (!progress.hasDocuments) return 2;
    return 3; // Find Programs
  };

  const currentGlobalStep = calculateCurrentGlobalStep();
  // Global Steps (3 Steps) - Now dynamic
  const globalSteps = [
    {
      id: 1,
      title: "Complete Profile",
      icon: User,
      description: "Setup your basic information",
      completed: currentGlobalStep > 1,
      buttonText: currentGlobalStep === 1 ? "Complete Profile" : "View Profile",
      action: () => router.push("/dashboard/profile"),
    },
    {
      id: 2,
      title: "Upload Documents",
      icon: Upload,
      description: "Add required documents (optional)",
      completed: currentGlobalStep > 2,
      buttonText:
        currentGlobalStep === 2 ? "Upload Documents" : "Manage Documents",
      action: () => router.push("/dashboard/documents"),
    },
    {
      id: 3,
      title: "Find Programs",
      icon: Search,
      description: "Discover matching programs",
      completed: currentGlobalStep > 3,
      buttonText: "Find Programs",
      action: () => router.push("/dashboard/search"),
    },
  ];
  const globalProgressPercentage =
    ((currentGlobalStep - 1) / (globalSteps.length - 1)) * 100;

  // Application Steps (5 Steps)
  const applicationSteps = [
    { id: 1, title: "Apply", icon: FileText, shortTitle: "Apply" },
    { id: 2, title: "Payment", icon: DollarSign, shortTitle: "Pay" },
    { id: 3, title: "Submitted", icon: Send, shortTitle: "Submit" },
    { id: 4, title: "Under Review", icon: Clock, shortTitle: "Review" },
    { id: 5, title: "Decision", icon: CheckCircle, shortTitle: "Decision" },
  ];

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage
        .getItem("authToken")
        ?.replace(/^"|"$/g, "")
        .trim();

      if (!token) {
        router.push("/login");
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };

      // Parallel API calls for better performance
      const [progressRes, applicationsRes] = await Promise.all([
        axios.get<DashboardResponse>(`${API_URL}/dashboard/progress`, {
          headers,
        }),
        axios.get<ApplicationsResponse>(`${API_URL}/dashboard/applications`, {
          headers,
        }),
      ]);

      if (progressRes.data.success) {
        setStats(progressRes.data.data.stats);
        setProgress(progressRes.data.data.progress);
      }

      if (applicationsRes.data.success) {
        setApplications(applicationsRes.data.data.applications);
      }
    } catch (err: any) {
      console.error("Dashboard data fetch failed:", err);
      setError(
        err.response?.data?.message ||
          "Failed to load dashboard data. Please try again."
      );

      // Fallback to mock data for demo
      setStats({
        applicationsSubmitted: 2,
        programsTracked: 2,
        documentsUploaded: 5,
        profileCompletion: "100%",
      });

      setProgress({
        profileComplete: true,
        hasApplications: true,
        hasDocuments: true,
        hasPaidApplications: false,
        hasAcceptedApplications: false,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleFindProgram = () => router.push("/dashboard/applications");
  const handleViewApplications = () => router.push("/dashboard/applications");
  const handleNewApplication = () => router.push("/dashboard/search");
  const handleRetry = () => fetchDashboardData();

  const getApplicationStepStatus = (
    application: Application,
    stepIndex: number
  ) => {
    if (stepIndex < application.currentStep) return "completed";
    if (stepIndex === application.currentStep) return "current";
    return "upcoming";
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Submitted":
        return "default";
      case "Under Review":
        return "secondary";
      case "Accepted":
        return "success";
      case "Rejected":
        return "destructive";
      default:
        return "outline";
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            Failed to load dashboard
          </h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={handleRetry}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Welcome back! 👋
            </h1>
            <p className="text-muted-foreground mt-1">
              Track your study abroad journey and manage all your applications
            </p>
          </div>
          {error && (
            <div className="flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="w-4 h-4" />
              <span>Using demo data</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Stats Grid */}
      {/* <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {statsData.map((stat, index) => (
          <Card key={index} className="bg-card/50 backdrop-blur border-border/50 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-2">{stat.change}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div> */}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {statsData.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
          >
            <Card
              className="group bg-card/60 backdrop-blur-md border border-border/40 
                       hover:border-primary/40 hover:shadow-[0_0_15px_-3px_var(--primary)] 
                       transition-all duration-300 rounded-xl"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  {/* Text Section */}
                  <div>
                    <p className="text-sm font-medium text-muted-foreground tracking-wide">
                      {stat.title}
                    </p>

                    <p className="text-3xl font-bold text-foreground mt-2 group-hover:text-primary transition-colors">
                      {stat.value}
                    </p>
                  </div>

                  {/* Icon box */}
                  <div
                    className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 
                            transition-colors duration-300 flex items-center justify-center"
                  >
                    <stat.icon className={`h-7 w-7 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Global Progress Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Your Journey Starts Here</CardTitle>
            <CardDescription>
              Complete these steps to start your study abroad application
              process
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="max-w-3xl mx-auto">
              <div className="relative">
                {/* Connecting Line Container */}
                <div className="absolute top-7 left-[calc(50%/3)] right-[calc(50%/3)] h-0.5 bg-border" />

                {/* Progress Line */}
                <motion.div
                  className="absolute top-7 left-[calc(50%/3)] h-0.5 bg-primary transition-all duration-500"
                  initial={{ width: 0 }}
                  animate={{
                    width: `calc((100% - (100%/3)) * ${
                      (currentGlobalStep - 1) / (globalSteps.length - 1)
                    })`,
                  }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                />

                {/* Steps */}
                <div className="grid grid-cols-3 gap-8 relative z-10">
                  {globalSteps.map((step, index) => {
                    const isCompleted = index < currentGlobalStep - 1;
                    const isCurrent = index === currentGlobalStep - 1;

                    return (
                      <motion.div
                        key={step.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex flex-col items-center text-center"
                      >
                        <div
                          className={`w-14 h-14 flex items-center justify-center rounded-full border-2 transition-all
                          ${
                            isCompleted
                              ? "bg-primary border-primary shadow-md shadow-primary/20"
                              : isCurrent
                              ? "bg-primary/10 border-primary ring-4 ring-primary/20"
                              : "bg-muted border-border"
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle className="text-primary-foreground w-7 h-7" />
                          ) : (
                            <step.icon
                              className={`w-6 h-6 ${
                                isCurrent
                                  ? "text-primary"
                                  : "text-muted-foreground"
                              }`}
                            />
                          )}
                        </div>
                        <p
                          className={`text-sm font-medium mt-2 ${
                            isCurrent
                              ? "text-foreground"
                              : isCompleted
                              ? "text-foreground"
                              : "text-muted-foreground"
                          }`}
                        >
                          {step.title}
                        </p>
                        {isCurrent && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-1 px-2 py-0.5 bg-primary/10 rounded-full"
                          >
                            <span className="text-xs font-semibold text-primary">
                              Current Step
                            </span>
                          </motion.div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Single Action Button */}
              <div className="flex justify-center mt-8">
                <Button
                  size="lg"
                  className={`
                    ${
                      currentGlobalStep === 3
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-primary hover:bg-primary/90"
                    }
                    px-8
                  `}
                  onClick={globalSteps[currentGlobalStep - 1].action}
                >
                  {globalSteps[currentGlobalStep - 1].buttonText}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* My Applications Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-6">
            <div>
              <CardTitle className="text-2xl">My Applications</CardTitle>
              <CardDescription>
                Track and manage all your program applications •{" "}
                {applications.length} total
              </CardDescription>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleFindProgram}>
                <Search className="w-4 h-4 mr-2" />
                Go To Application
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {applications.map((application) => (
              <div
                key={application.id}
                className="group p-6 rounded-xl border border-border/50 bg-background/50 hover:bg-accent/50 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Left Section - Program Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center">
                            <GraduationCap className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                              {application.university}
                            </h3>
                            <p className="text-muted-foreground">
                              {application.program}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {application.country}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Applied: {application.appliedDate}
                          </div>
                          <div className="flex items-center gap-1">
                            <FileText className="w-4 h-4" />
                            Deadline: {application.deadline}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge
                          variant={getStatusVariant(application.status) as any}
                          className="text-sm"
                        >
                          {application.status}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Right Section - Progress Steps */}
                  <div className="lg:w-96">
                    <div className="bg-muted/30 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-foreground">
                          Application Steps
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Step {application.currentStep} of{" "}
                          {applicationSteps.length}
                        </span>
                      </div>

                      {/* Compact Progress Steps */}
                      <div className="relative">
                        {/* Background Line */}
                        <div className="absolute top-3 left-1/2 right-1/2 h-1 bg-border rounded-full -translate-x-1/2 w-[calc(100%-24px)]" />

                        {/* Progress Line */}
                        <div
                          className="absolute top-3 left-0 h-1 bg-primary rounded-full transition-all duration-500"
                          style={{
                            width: `${
                              ((application.currentStep - 1) /
                                (applicationSteps.length - 1)) *
                              100
                            }%`,
                          }}
                        />

                        {/* Steps */}
                        <div className="relative flex justify-between">
                          {applicationSteps.map((step, index) => {
                            const stepStatus = getApplicationStepStatus(
                              application,
                              index + 1
                            );
                            const isCompleted = stepStatus === "completed";
                            const isCurrent = stepStatus === "current";
                            const isUpcoming = stepStatus === "upcoming";

                            return (
                              <div
                                key={step.id}
                                className="flex flex-col items-center"
                              >
                                <div
                                  className={`
                                    w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-medium
                                    transition-all duration-300 z-10
                                    ${
                                      isCompleted
                                        ? "bg-primary border-primary text-white shadow-lg shadow-primary/30"
                                        : isCurrent
                                        ? "bg-white border-primary text-primary shadow-lg shadow-primary/30"
                                        : "bg-white border-border text-muted-foreground"
                                    }
                                  `}
                                >
                                  {isCompleted ? (
                                    <CheckCircle className="w-3 h-3" />
                                  ) : (
                                    step.shortTitle.charAt(0)
                                  )}
                                </div>
                                <span
                                  className={`
                                    text-[10px] font-medium mt-1 text-center max-w-[50px] truncate
                                    ${
                                      isCurrent
                                        ? "text-primary font-semibold"
                                        : isCompleted
                                        ? "text-foreground"
                                        : "text-muted-foreground"
                                    }
                                  `}
                                >
                                  {step.shortTitle}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Empty State */}
            {applications.length === 0 && (
              <div className="text-center py-16 border-2 border-dashed border-border rounded-xl">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  No applications yet
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Start your study abroad journey by finding and applying to
                  programs that match your profile
                </p>
                <div className="flex gap-3 justify-center">
                  <Button variant="outline" onClick={handleFindProgram}>
                    <Search className="w-4 h-4 mr-2" />
                    Browse Programs
                  </Button>
                  {/* <Button className="bg-primary hover:bg-primary/90" onClick={handleNewApplication}>
                    <Plus className="w-4 h-4 mr-2" />
                    Start Application
                  </Button> */}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
