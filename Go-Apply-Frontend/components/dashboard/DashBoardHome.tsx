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

export default function DashboardHome() {
  const router = useRouter();
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);

  const steps = [
    { id: 1, title: "Complete Profile", icon: User },
    { id: 2, title: "Upload Documents", icon: Upload },
    { id: 3, title: "Find Programs", icon: BookOpen },
    { id: 4, title: "Apply Application", icon: FileText },
    { id: 5, title: "Make Payment", icon: DollarSign },
    { id: 6, title: "Get Acceptance", icon: CheckCircle },
  ];

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const token = localStorage
          .getItem("authToken")
          ?.replace(/^"|"$/g, "")
          .trim();
        const res = await axios.get(`${API_URL}/users/progress`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProgress(res.data.data.progress);
      } catch (err) {
        console.error("Progress fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, []);

  const calculateCurrentStep = () => {
    if (!progress) return 1;

    if (!progress.profileComplete) return 1;
    if (!progress.hasApplications) return 2;
    if (!progress.hasDocuments) return 3;
    if (!progress.hasPaidApplications) return 4;
    if (!progress.hasAcceptedApplications) return 5;
    return 6;
  };

  const currentStep = calculateCurrentStep();
  const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100;

  const handleCompleteProfile = () => router.push("/dashboard/profile");
  const handleFindProgram = () => router.push("/dashboard/search");
  const handleViewDocuments = () => router.push("/dashboard/documents");
  const handleViewApplications = () => router.push("/dashboard/applications");
  const handleUploadDocuments = () =>
    router.push("/dashboard/documents?upload=true");

  // Check if profile is complete to show different buttons
  const isProfileComplete = progress?.profileComplete;

  if (loading) {
    return <div className="p-6 text-center">Loading your progress...</div>;
  }

  return (
    <div className="p-6 space-y-10">
      {/* My Progress Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
       <h1 className="text-4xl font-bold mb-4 text-center">
  Your Journey to Study Abroad
</h1>
<p className="text-muted-foreground text-lg mb-6 text-center">
  Track your progress and complete each step to achieve your dream
</p>

        {/* Progress Bar */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              Step {currentStep} of {steps.length}
            </span>
            <span className="text-sm font-medium text-primary">
              {Math.round(progressPercentage)}% Complete
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Steps with connecting lines */}
        <div className="max-w-5xl mx-auto relative">
          {/* Connecting line */}
          <div
            className="absolute top-7 left-0 right-0 h-0.5 bg-border hidden md:block"
            style={{
              marginLeft: "7%",
              marginRight: "7%",
            }}
          />

          {/* Active progress line */}
          <motion.div
            className="absolute top-7 left-0 h-0.5 bg-primary hidden md:block"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage * 0.86}%` }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            style={{ marginLeft: "7%" }}
          />

          {/* Steps */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 relative z-10">
            {steps.map((step, index) => {
              const isCompleted = index < currentStep - 1;
              const isCurrent = index === currentStep - 1;
              const isUpcoming = index > currentStep - 1;

              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex flex-col items-center text-center"
                >
                  <div
                    className={`
                      w-14 h-14 flex items-center justify-center rounded-full mb-3 transition-all duration-300
                      ${
                        isCompleted
                          ? "bg-primary border-2 border-primary shadow-lg shadow-primary/20"
                          : isCurrent
                          ? "bg-primary/10 border-2 border-primary ring-4 ring-primary/20 animate-pulse"
                          : "bg-muted border-2 border-border"
                      }
                    `}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-7 h-7 text-primary-foreground" />
                    ) : (
                      <step.icon
                        className={`
                          w-6 h-6 transition-colors
                          ${
                            isCurrent ? "text-primary" : "text-muted-foreground"
                          }
                        `}
                      />
                    )}
                  </div>
                  <p
                    className={`
                      text-sm font-medium transition-colors
                      ${
                        isCurrent
                          ? "text-foreground"
                          : isCompleted
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }
                    `}
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
                        In Progress
                      </span>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Conditional Sections Based on Progress */}

      {/* Profile Section - Show only if profile incomplete */}
      {!isProfileComplete && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <Card className="max-w-2xl mx-auto border-2 border-primary/20 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Before Applying</CardTitle>
              <CardDescription>
                Complete your profile before starting your application.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 px-6"
                onClick={handleCompleteProfile}
              >
                Complete Profile
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Documents Section - Show after profile complete */}
      {isProfileComplete && currentStep === 2 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center"
        >
          <Card className="max-w-2xl mx-auto border-2 border-blue-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Upload Documents</CardTitle>
              <CardDescription>
                Upload at least 1 document (optional) to continue with your
                applications.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {/* <Button
                  size="lg"
                  variant="outline"
                  className="px-6"
                  onClick={handleViewDocuments}
                >
                  View Documents
                </Button> */}
                <Button
                  size="lg"
                  className="px-6"
                  onClick={handleUploadDocuments}
                >
                  <Upload className="mr-2 w-4 h-4" />
                  Upload Document
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                * At least 1 document is recommended for better application
                processing
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Find Programs Section - Always show after profile complete */}
      {isProfileComplete && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center"
        >
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-xl">
                {currentStep === 3
                  ? "Find Programs to Apply"
                  : "Continue Exploring"}
              </CardTitle>
              <CardDescription>
                {currentStep === 3
                  ? "Search and find programs that match your profile."
                  : "Explore more programs and manage your applications."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                size="lg"
                className=" hover:bg-green-700 px-6"
                onClick={handleFindProgram}
              >
                <Search className="mr-2 w-4 h-4" />
                Find Programs
              </Button>

              {progress?.hasApplications && (
                <div className="pt-4 border-t">
                  <Button variant="outline" onClick={handleViewApplications}>
                    <FileText className="mr-2 w-4 h-4" />
                    View My Applications
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}


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
//         console.error("Progress fetch failed:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProgress();
//   }, []);

//   const calculateCurrentStep = () => {
//     if (!progress) return 1;

//     if (!progress.profileComplete) return 1;
//     if (!progress.hasDocuments) return 2;
//     if (!progress.hasApplications) return 3;
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

//   // Function to render the appropriate card based on current step
//   const renderActionCard = () => {
//     // Step 1: Profile incomplete
//     if (!isProfileComplete) {
//       return (
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
//       );
//     }

//     // Step 2: Documents required
//     if (currentStep === 2) {
//       return (
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
//       );
//     }

//     // Step 3 and above: Find programs
//     return (
//       <motion.div
//         initial={{ opacity: 0, y: 30 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6, delay: 0.3 }}
//         className="text-center"
//       >
//         <Card className="max-w-2xl mx-auto">
//           <CardHeader>
//             <CardTitle className="text-xl">
//               {currentStep === 3
//                 ? "Find Programs to Apply"
//                 : "Continue Exploring"}
//             </CardTitle>
//             <CardDescription>
//               {currentStep === 3
//                 ? "Search and find programs that match your profile."
//                 : "Explore more programs and manage your applications."}
//             </CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <Button
//               size="lg"
//               className="bg-green-600 hover:bg-green-700 px-6"
//               onClick={handleFindProgram}
//             >
//               <Search className="mr-2 w-4 h-4" />
//               Find Programs
//             </Button>

//             {progress?.hasApplications && (
//               <div className="pt-4 border-t">
//                 <Button variant="outline" onClick={handleViewApplications}>
//                   <FileText className="mr-2 w-4 h-4" />
//                   View My Applications
//                 </Button>
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       </motion.div>
//     );
//   };

//   return (
//     <div className="p-6 space-y-10">
//       {/* My Progress Section */}
//       <motion.div
//         initial={{ opacity: 0, y: 10 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.4 }}
//       >
//         <h1 className="text-4xl font-bold mb-4 text-center">
//           Your Journey to Study Abroad
//         </h1>
//         <p className="text-muted-foreground text-lg mb-6 text-center">
//           Track your progress and complete each step to achieve your dream
//         </p>

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

//       {/* Single Action Card based on current step */}
//       {renderActionCard()}
//     </div>
//   );
// }