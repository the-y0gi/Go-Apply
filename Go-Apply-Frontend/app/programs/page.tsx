"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Search,
  Filter,
  MapPin,
  Star,
  GraduationCap,
  Clock,
  DollarSign,
} from "lucide-react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
// import ProtectedRoute from "@/components/auth/ProtectedRoute"
import axios from "axios";
import { Program, University } from "@/models/program";
import { set } from "date-fns";
import Navbar from "@/components/navbar";
import SignInModal from "@/components/auth/SignInModal";
import toast, { Toaster } from "react-hot-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";


const formatDeadline = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};


// Programs loaded from backend
const usePrograms = () => {
  const [programs, setPrograms] = useState<University[]>([]);
  const [loadingPrograms, setLoadingPrograms] = useState(true);
  const [programsError, setProgramsError] = useState<string | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
const [selectedProgram, setSelectedProgram] = useState<University | null>(null);




  useEffect(() => {
    let mounted = true;
    const fetchPrograms = async () => {
      try {
        setLoadingPrograms(true);
        // call backend; you can pass query params here if needed
        const res = await axios.get<{
          success: boolean;
          data: { programs: Program[] };
        }>(`${API_URL}/search/programs`);

        if (!mounted) return;

        const backendPrograms = res.data?.data?.programs || [];

        // map backend Program -> frontend University-like shape used in the UI
        const mapped: University[] = backendPrograms.map((p) => {
          const uni = p.universityId || {};
          const tuitionAmount = p.tuitionFee?.amount ?? 0;
          const currency = p.tuitionFee?.currency ?? "INR";
          return {
            id: (p._id ?? "").toString(),
            universityId: uni._id ?? "", // <-- added
            university: uni.name ?? "Unknown University",
            program: p.name ?? "",
            city: uni.city ?? "",
            state: uni.country ?? "",
            duration: p.duration ?? "",
            tuition: tuitionAmount
              ? `${currency} ${tuitionAmount.toLocaleString()}`
              : "N/A",
            ranking: uni.ranking?.global
              ? `#${uni.ranking.global}`
              : p.ranking ?? "",
            rating: (p.rating ?? 4.5).toString(),
            deadline: p.applicationDeadline ?? "",
            requirements: p.requirements ?? [],
            tags: p.tags ?? [],
            intake: p.intake || [],
          } as University;
        });

        setPrograms(mapped);
        setProgramsError(null);
      } catch (err: any) {
        console.error("Failed to load programs", err);
        if (!mounted) return;
        setProgramsError("Failed to load programs");
        setPrograms([]);
      } finally {
        if (mounted) setLoadingPrograms(false);
      }
    };

    fetchPrograms();
    return () => {
      mounted = false;
    };
  }, []);

  return { programs, loadingPrograms, programsError };
};

export default function ProgramsPage() {
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [signInOpen, setSignInOpen] = useState(false)
  const [registerOpen, setRegisterOpen] = useState(false)
  // store applied program ids as strings (backend _id)
  const [appliedPrograms, setAppliedPrograms] = useState<string[]>([]);

  const [showAppliedButton, setShowAppliedButton] = useState(false);
  // update floating button visibility when appliedPrograms change
  useEffect(() => {
    setShowAppliedButton(appliedPrograms.length > 0);
  }, [appliedPrograms]);

  useEffect(() => {
    setShowAppliedButton(false);
  }, []);

  const [applyingIds, setApplyingIds] = useState<string[]>([]); // in-flight applies
  const [selectedState, setSelectedState] = useState("");
  const [selectedField, setSelectedField] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [tuitionRange, setTuitionRange] = useState([30000, 60000]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(4.0);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
const [showDetailsModal, setShowDetailsModal] = useState(false);
const [selectedProgram, setSelectedProgram] = useState<University | null>(null);

  const {
    programs: allPrograms,
    loadingPrograms,
    programsError,
  } = usePrograms();

  // Ensure we always have an array to filter (protects against undefined)
  const programsList = Array.isArray(allPrograms) ? allPrograms : [];

  // Filter programs based on search criteria
  const filteredPrograms = programsList.filter((program) => {
    const matchesSearch =
      searchQuery === "" ||
      program.program.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.university.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesState =
      selectedState === "" ||
      program.state.toLowerCase().replace(/\s+/g, "-") === selectedState;

    const matchesField =
      selectedField === "" ||
      program.program.toLowerCase().includes(selectedField.replace("-", " "));

    const matchesLevel =
      selectedLevel === "" ||
      program.program.toLowerCase().includes(selectedLevel.replace("s", ""));

    // Robust tuition parsing: strip all non-digit/period characters
    const tuitionValue =
      Number(String(program.tuition).replace(/[^\d.]/g, "")) || 0;
    const matchesTuition =
      tuitionValue >= (tuitionRange[0] || 0) &&
      tuitionValue <= (tuitionRange[1] || Infinity);

    // Normalize rating to number
    const ratingValue =
      typeof program.rating === "number"
        ? program.rating
        : parseFloat(String(program.rating)) || 0;
    const matchesRating = ratingValue >= (minRating || 0);

    // Feature matching (boolean)
    const matchesFeatures =
      selectedFeatures.length === 0 ||
      selectedFeatures.some((feature) =>
        (program.tags || []).some((tag) =>
          tag.toLowerCase().includes(feature.toLowerCase())
        )
      );

    return (
      matchesSearch &&
      matchesState &&
      matchesField &&
      matchesLevel &&
      matchesTuition &&
      matchesRating &&
      matchesFeatures
    );
  });

  const handleFeatureToggle = (feature: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(feature)
        ? prev.filter((f) => f !== feature)
        : [...prev, feature]
    );
  };
  const handleDetails = (program: University) => {
  setSelectedProgram(program);
  setShowDetailsModal(true);
};

  const handleApplyNow = async (program: University) => {

    window.dispatchEvent(new Event("signInOpen"))
    setSignInOpen(true);
  };

  // Normalize requirements coming from backend (array, object or string)
  const normalizeRequirements = (requirements: any): string[] => {
    if (!requirements) return [];
    if (Array.isArray(requirements)) return requirements.filter(Boolean);
    if (typeof requirements === "object") {
      const docs = Array.isArray(requirements.documentsRequired)
        ? requirements.documentsRequired
        : [];
      const prereq = Array.isArray(requirements.prerequisites)
        ? requirements.prerequisites
        : [];
      const tests = Array.isArray(requirements.englishTests)
        ? requirements.englishTests.map(
            (t: any) => `${t.testType}: ${t.minScore}`
          )
        : [];
      const extras: string[] = [];
      if (requirements.minGPA) extras.push(`GPA: ${requirements.minGPA}`);
      if (requirements.workExperience?.required) {
        extras.push(
          `Work Exp: ${requirements.workExperience.minYears || "N/A"} yrs`
        );
      }
      return [...docs, ...prereq, ...tests, ...extras].filter(Boolean);
    }
    return String(requirements)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  };

  return (
    //  <ProtectedRoute>
    <div className="flex h-screen">
   
          <Toaster position="top-right" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div>
          {/*  Navbar at top */}
          <Navbar />
        </div>
        <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
<DialogContent>
  <DialogHeader>
    <DialogTitle>{selectedProgram?.program}</DialogTitle>
    <DialogDescription>Program intake details</DialogDescription>
  </DialogHeader>

  {/* Insert box here */}
  <div className="mt-4 p-4 rounded-lg border border-blue-200 bg-blue-50">
    <p className="text-sm text-blue-700 font-medium mb-2">
      Great news! This program is available for the following intakes:
    </p>

    {selectedProgram?.intake?.length ? (
      <ul className="list-disc ml-5 text-sm text-blue-800">
        {selectedProgram.intake.map((i: any, idx: number) => (
          <li key={idx}>
            {i.season.charAt(0).toUpperCase() + i.season.slice(1)} {i.year}
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-sm text-blue-700">No intake information available.</p>
    )}
  </div>
</DialogContent>

</Dialog>


        <main className="flex-1 overflow-y-auto p-6 pt-20 bg-gray-50">
          <div className="space-y-6">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl font-bold text-foreground">
                Find Programs
              </h1>
              <p className="text-muted-foreground mt-1">
                Discover programs that match your interests and goals
              </p>
            </motion.div>

            {/* Search and Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="bg-card/50 backdrop-blur border-border/50 hover:bg-card/60 transition-all duration-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    Search & Filter Programs
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="search">Search Programs</Label>
                      <Input
                        id="search"
                        placeholder="Computer Science, Engineering..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-background/50 backdrop-blur border-border/50"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>State/Territory</Label>
                      <Select
                        value={selectedState}
                        onValueChange={setSelectedState}
                      >
                        <SelectTrigger className="bg-background/50 backdrop-blur border-border/50">
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="victoria">Victoria</SelectItem>
                          <SelectItem value="new-south-wales">
                            New South Wales
                          </SelectItem>
                          <SelectItem value="queensland">Queensland</SelectItem>
                          <SelectItem value="western-australia">
                            Western Australia
                          </SelectItem>
                          <SelectItem value="south-australia">
                            South Australia
                          </SelectItem>
                          <SelectItem value="tasmania">Tasmania</SelectItem>
                          <SelectItem value="act">ACT</SelectItem>
                          <SelectItem value="northern-territory">
                            Northern Territory
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Field of Study</Label>
                      <Select
                        value={selectedField}
                        onValueChange={setSelectedField}
                      >
                        <SelectTrigger className="bg-background/50 backdrop-blur border-border/50">
                          <SelectValue placeholder="Select field" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="computer-science">
                            Computer Science
                          </SelectItem>
                          <SelectItem value="data-science">
                            Data Science
                          </SelectItem>
                          <SelectItem value="engineering">
                            Engineering
                          </SelectItem>
                          <SelectItem value="business">Business</SelectItem>
                          <SelectItem value="medicine">Medicine</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Study Level</Label>
                      <Select
                        value={selectedLevel}
                        onValueChange={setSelectedLevel}
                      >
                        <SelectTrigger className="bg-background/50 backdrop-blur border-border/50">
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="masters">Master's</SelectItem>
                          <SelectItem value="bachelors">Bachelor's</SelectItem>
                          <SelectItem value="phd">PhD</SelectItem>
                          <SelectItem value="diploma">Diploma</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button className="bg-primary hover:bg-primary/90">
                      <Search className="w-4 h-4 mr-2" />
                      Search Programs
                    </Button>
                    <Dialog
                      open={showAdvancedFilters}
                      onOpenChange={setShowAdvancedFilters}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="bg-background/50 backdrop-blur border-border/50"
                        >
                          <Filter className="w-4 h-4 mr-2" />
                          Advanced Filters
                          {(selectedFeatures.length > 0 ||
                            minRating > 4.0 ||
                            tuitionRange[0] !== 30000 ||
                            tuitionRange[1] !== 60000) && (
                            <Badge
                              variant="secondary"
                              className="ml-2 h-4 w-4 p-0 flex items-center justify-center text-xs"
                            >
                              {selectedFeatures.length +
                                (minRating > 4.0 ? 1 : 0) +
                                (tuitionRange[0] !== 30000 ||
                                tuitionRange[1] !== 60000
                                  ? 1
                                  : 0)}
                            </Badge>
                          )}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Advanced Filters</DialogTitle>
                          <DialogDescription>
                            Refine your search with additional criteria
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-6">
                          {/* Tuition Range */}
                          <div className="space-y-3">
                            <Label>Annual Tuition Range (INR)</Label>
                            <div className="px-2">
                              <Slider
                                value={tuitionRange}
                                onValueChange={setTuitionRange}
                                max={80000}
                                min={20000}
                                step={5000}
                                className="w-full"
                              />
                            </div>
                            <div className="flex justify-between text-sm text-muted-foreground">
                              <span>${tuitionRange[0].toLocaleString()}</span>
                              <span>${tuitionRange[1].toLocaleString()}</span>
                            </div>
                          </div>

                          {/* Minimum Rating */}
                          <div className="space-y-3">
                            <Label>Minimum Rating</Label>
                            <div className="px-2">
                              <Slider
                                value={[minRating]}
                                onValueChange={(value) =>
                                  setMinRating(value[0])
                                }
                                max={5.0}
                                min={3.0}
                                step={0.1}
                                className="w-full"
                              />
                            </div>
                            <div className="flex justify-between text-sm text-muted-foreground">
                              <span>3.0</span>
                              <span className="font-medium">
                                {minRating.toFixed(1)} ⭐
                              </span>
                              <span>5.0</span>
                            </div>
                          </div>

                          {/* Program Features */}
                          <div className="space-y-3">
                            <Label>Program Features</Label>
                            <div className="grid grid-cols-1 gap-3">
                              {[
                                "Industry-focused",
                                "Research-based",
                                "Internship",
                                "Part-time work allowed",
                                "AI/ML",
                                "Scholarships available",
                              ].map((feature) => (
                                <div
                                  key={feature}
                                  className="flex items-center space-x-2"
                                >
                                  <Checkbox
                                    id={feature}
                                    checked={selectedFeatures.includes(feature)}
                                    onCheckedChange={() =>
                                      handleFeatureToggle(feature)
                                    }
                                  />
                                  <Label
                                    htmlFor={feature}
                                    className="text-sm font-normal"
                                  >
                                    {feature}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Clear Filters */}
                          <div className="flex gap-2 pt-4">
                            <Button
                              variant="outline"
                              onClick={() => {
                                setTuitionRange([30000, 60000]);
                                setMinRating(4.0);
                                setSelectedFeatures([]);
                              }}
                              className="flex-1"
                            >
                              Clear All
                            </Button>
                            <Button
                              onClick={() => setShowAdvancedFilters(false)}
                              className="flex-1"
                            >
                              Apply Filters
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Results */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">
                  Search Results
                </h2>
                <p className="text-sm text-muted-foreground">
                  {filteredPrograms.length} programs found
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
               <AnimatePresence>
  {filteredPrograms
    .filter((program) => !appliedPrograms.includes(program.id))
    .map((program, index) => (
      <motion.div
        key={program.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{
          opacity: 0,
          y: 20,
        }}
        transition={{ duration: 0.3, delay: 0.1 * index }}
      >
        <Card className="group relative w-full h-full bg-white border border-gray-200 rounded-2xl hover:shadow-2xl hover:border-primary/40 transition-all duration-300 overflow-hidden">
          {/* Top Accent Bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary/80 to-primary"></div>
          
          <CardContent className="p-6 flex flex-col h-full">
            {/* Header Section */}
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-start gap-4 flex-1">
                {/* Logo */}
                <div className="w-14 h-14 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <GraduationCap className="w-7 h-7 text-primary" />
                </div>

                {/* Title & University */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-gray-900 leading-tight mb-1 group-hover:text-primary transition-colors">
                    {program.program}
                  </h3>
                  <p className="text-sm font-medium text-gray-600">
                    {program.university}
                  </p>
                </div>
              </div>

              {/* Ranking & Rating */}
              <div className="flex flex-col items-end gap-2 ml-3">
                <Badge variant="secondary" className="font-semibold text-xs px-3 py-1">
                  {program.ranking}
                </Badge>
                <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-lg">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />
                  <span className="text-sm font-bold text-gray-800">
                    {program.rating}
                  </span>
                </div>
              </div>
            </div>

            {/* Info Section */}
            <div className="space-y-2.5 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center">
                  <MapPin className="w-4 h-4 " />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {program.city}, {program.state}
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 bg-purple-50 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {program.duration}
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 bg-green-50 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {program.tuition}
                </span>
              </div>
            </div>

            {/* Tags */}
            {(program.tags || []).length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {program.tags.map((tag) => (
                  <Badge
                    key={String(tag)}
                    variant="outline"
                    className="text-xs font-medium px-2.5 py-1"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Requirements */}
            <div className="bg-gray-50 rounded-xl p-4 mb-5">
              <p className="text-xs font-semibold text-gray-700 mb-2.5 uppercase tracking-wide">
                Requirements
              </p>
              <div className="flex flex-wrap gap-2">
                {normalizeRequirements(program.requirements).map((req) => (
                  <span
                    key={String(req)}
                    className="text-xs font-medium text-gray-700 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm"
                  >
                    {req}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="mt-auto pt-4 border-t border-gray-100">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-xs text-gray-500">
                    Deadline:
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {formatDeadline(program.deadline)}
                  </span>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleDetails(program)}
                  >
                    Details
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleApplyNow(program)}
                  >
                    Apply Now
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    ))}
</AnimatePresence>
                    <SignInModal
                            isOpen={signInOpen}
                            onClose={() => setSignInOpen(false)}
                            onSwitchToRegister={() => {
                              setSignInOpen(false)
                              setRegisterOpen(true)
                            }}
                          />
                {/* Floating button to view applied programs */}
                <AnimatePresence>
                  {showAppliedButton && (
                    <motion.div
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 100 }}
                      className="fixed bottom-8 right-8 z-50"
                    >
                      <Button
                        size="lg"
                        className="bg-green-600 hover:bg-green-700 text-white shadow-lg flex items-center gap-2"
                        onClick={() => router.push("/dashboard/applications")}
                      >
                        <span>View Applied Programs</span>
                        <span className="bg-white text-green-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
                          {appliedPrograms.length}
                        </span>
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
