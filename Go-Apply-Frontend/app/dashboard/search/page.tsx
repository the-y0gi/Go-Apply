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
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import axios from "axios";
import { Program, University } from "@/models/program";
import { set } from "date-fns";

const toast = {
  success: (msg: string) => {
    try {
      window.alert(msg);
    } catch {
      console.error("error", msg);
    }
  },
  error: (msg: string) => {
    try {
      window.alert(msg);
    } catch {
      console.error("ERROR:", msg);
    }
  },
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const usePrograms = () => {
  const [programs, setPrograms] = useState<University[]>([]);
  const [loadingPrograms, setLoadingPrograms] = useState(true);
  const [programsError, setProgramsError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchPrograms = async () => {
      try {
        setLoadingPrograms(true);
        const res = await axios.get<{
          success: boolean;
          data: { programs: Program[] };
        }>(`${API_URL}/search/programs`);

        if (!mounted) return;

        const backendPrograms = res.data?.data?.programs || [];
        const mapped: University[] = backendPrograms.map((p) => {
          const uni = p.universityId || {};
          const tuitionAmount = p.tuitionFee?.amount ?? 0;
          const currency = p.tuitionFee?.currency ?? "AUD";

          return {
            id: (p._id ?? "").toString(),
            universityId: (p.universityId?._id || p.universityId || "")
              .toString()
              .trim(),
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
              : "Not ranked",
            rating: "4.5",
            deadline: p.applicationDeadline ?? "",
            requirements: p.requirements ?? [],
            tags: p.tags || [],
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

const useUserApplications = (token: string | null) => {
  const [appliedIds, setAppliedIds] = useState<string[]>([]);
  const [loadingApps, setLoadingApps] = useState(true);
  const [appliedIntakes, setAppliedIntakes] = useState<{
    [programId: string]: string[];
  }>({});

  useEffect(() => {
    if (!token) return;

    const fetchApplications = async () => {
      try {
        setLoadingApps(true);
        const res = await axios.get(`${API_URL}/applications`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const ids = (res.data?.data?.applications || [])
          .map((a: any) => {
            if (!a.programId) return null;
            if (typeof a.programId === "object")
              return a.programId._id?.toString();
            return a.programId.toString();
          })
          .filter(Boolean);

        const intakeMap: { [key: string]: string[] } = {};

        (res.data?.data?.applications || []).forEach((app: any) => {
          let programId: string | undefined;

          if (!app.programId) return;
          if (typeof app.programId === "object" && app.programId._id) {
            programId = String(app.programId._id);
          } else {
            programId = String(app.programId);
          }

          if (!programId) return;

          if (Array.isArray(app.intake) && app.intake.length > 0) {
            const applied = app.intake
              .filter((i: any) => i && i.season && i.year)
              .map((i: any) => `${i.season}-${i.year}`);

            if (!intakeMap[programId]) intakeMap[programId] = [];
            applied.forEach((val: string) => {
              if (!intakeMap[programId].includes(val))
                intakeMap[programId].push(val);
            });
          }
        });

        setAppliedIntakes(intakeMap);

        setAppliedIntakes(intakeMap);

        setAppliedIds(ids);
      } catch (err) {
        console.error("Failed to load user applications", err);
      } finally {
        setLoadingApps(false);
      }
    };

    fetchApplications();
  }, [token]);

  return {
    appliedIds,
    loadingApps,
    setAppliedIds,
    appliedIntakes,
    setAppliedIntakes,
  };
};

export default function SearchPage() {
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [selectedIntakesForPrograms, setSelectedIntakesForPrograms] = useState<
    Record<string, string>
  >({});
  const {
    appliedIds,
    loadingApps,
    setAppliedIds,
    appliedIntakes,
    setAppliedIntakes,
  } = useUserApplications(token);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("authToken");
      if (stored) {
        const cleanToken = stored.replace(/^"|"$/g, "").trim();
        setToken(cleanToken);
      }
    }
  }, []);

  const [appliedPrograms, setAppliedPrograms] = useState<string[]>([]);

  const [showAppliedButton, setShowAppliedButton] = useState(false);

  useEffect(() => {
    setShowAppliedButton(appliedPrograms.length > 0);
  }, [appliedPrograms]);

  useEffect(() => {
    setShowAppliedButton(false);
  }, []);

  const [applyingIds, setApplyingIds] = useState<string[]>([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedField, setSelectedField] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [tuitionRange, setTuitionRange] = useState([30000, 60000]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(4.0);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<University | null>(
    null
  );
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedIntake, setSelectedIntake] = useState<string>("");

  const {
    programs: allPrograms,
    loadingPrograms,
    programsError,
  } = usePrograms();

  const programsList = Array.isArray(allPrograms) ? allPrograms : [];

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

    const tuitionValue =
      Number(String(program.tuition).replace(/[^\d.]/g, "")) || 0;
    const matchesTuition =
      tuitionValue >= (tuitionRange[0] || 0) &&
      tuitionValue <= (tuitionRange[1] || Infinity);

    const ratingValue =
      typeof program.rating === "number"
        ? program.rating
        : parseFloat(String(program.rating)) || 0;
    const matchesRating = ratingValue >= (minRating || 0);

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
  const visiblePrograms = programsList.filter((program) => {
    const intakeKeys =
      program.intake?.map((i) => `${i.season}-${i.year}`) || [];
    const applied = appliedIntakes[program.id] || [];
    return applied.length < intakeKeys.length;
  });

  const handleFeatureToggle = (feature: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(feature)
        ? prev.filter((f) => f !== feature)
        : [...prev, feature]
    );
  };

  const checkProfileCompleteness = (
    profile: any
  ): { isComplete: boolean; missingFields: string[] } => {
    const missingFields: string[] = [];

    if (!profile.educationHistory || profile.educationHistory.length === 0) {
      missingFields.push("Education History");
    }

    if (!profile.languages || profile.languages.length === 0) {
      missingFields.push("Languages");
    }

    if (!profile.nationality) {
      missingFields.push("Nationality");
    }

    if (!profile.dateOfBirth) {
      missingFields.push("Date of Birth");
    }

    return {
      isComplete: missingFields.length === 0,
      missingFields,
    };
  };
  const handleDetails = (program: University) => {
    if (!program) return;
    setSelectedProgram(program);
    setShowDetailsModal(true);
  };
  const handleApplyNow = async (program: University) => {
    if (!program?.id) return;

    if (
      appliedPrograms.includes(program.id) ||
      applyingIds.includes(program.id)
    )
      return;

    const rawToken = localStorage.getItem("authToken") || "";
    const token = rawToken.replace(/^"|"$/g, "").trim();
    if (!token) {
      toast.error("Not signed in. Please login.");
      router.push("/auth/login");
      return;
    }

    try {
      const profileRes = await axios.get(`${API_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const userProfile = profileRes.data?.data?.profile;

      const { isComplete, missingFields } =
        checkProfileCompleteness(userProfile);

      if (!isComplete) {
        toast.error(
          `Please complete your profile: ${missingFields.join(", ")}`
        );
        router.push("/dashboard/profile");
        return;
      }
    } catch (err) {
      console.error("Profile check failed:", err);
      toast.error("Unable to verify profile. Please try again.");
      return;
    }

    try {
      setApplyingIds((prev) => [...prev, program.id]);

      const intakeValue = selectedIntakesForPrograms[program.id];
      if (!intakeValue) {
        toast.error("Please select an intake before applying!");
        return;
      }
      const [season, yearString] = intakeValue.split("-");
      const selectedIntakeObj = {
        season,
        year: Number(yearString),
      };

      const payload = {
        universityId: program.universityId,
        programId: program.id,
        intake: selectedIntakeObj,
        personalStatement: "",
      };

      const res = await axios.post(`${API_URL}/applications`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log("[handleApplyNow] server response:", res?.data);

      if (res?.data?.success) {
        setAppliedIntakes((prev) => {
          const intakeCode = `${season}-${yearString}`;

          const next = {
            ...prev,
            [program.id]: [...(prev[program.id] || []), intakeCode].filter(
              (v, i, a) => a.indexOf(v) === i
            ),
          };
          return next;
        });

        setAppliedPrograms((prev) => {
          const next = [...prev, program.id];
          try {
            localStorage.setItem("appliedPrograms", JSON.stringify(next));
          } catch {}
          return next;
        });

        setSelectedIntakesForPrograms((prev) => ({
          ...prev,
          [program.id]: "",
        }));

        setShowAppliedButton(true);

        toast.success(
          "Application created — open Applied Programs to view it."
        );
      } else {
        toast.error(res?.data?.message || "Failed to create application");
      }

      setShowAppliedButton(true);
      setShowAppliedButton(true);
      toast.success("Application created — open Applied Programs to view it.");
    } catch (err: any) {
      console.error(
        "Create application failed:",
        err?.response?.data ?? err?.message
      );

      if (err?.response?.data?.message?.includes("complete your profile")) {
        toast.error("Please complete your profile before applying");
        router.push("/dashboard/profile");
        return;
      }
      if (err?.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        router.push("/auth/login");
      } else {
        toast.error(
          err?.response?.data?.message ?? "Failed to create application"
        );
      }
    } finally {
      setApplyingIds((prev) => prev.filter((id) => id !== program.id));
    }
  };

  const isProfileComplete = (profile: any): boolean => {
    const hasEducation =
      profile.educationHistory && profile.educationHistory.length > 0;
    const hasLanguages = profile.languages && profile.languages.length > 0;
    const hasBasicInfo = profile.nationality && profile.dateOfBirth;

    return hasEducation && hasLanguages && hasBasicInfo;
  };

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
  if (loadingPrograms || loadingApps) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground text-lg">Loading programs...</p>
      </div>
    );
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
          <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {selectedProgram?.program || "Program Details"}
                </DialogTitle>
                <DialogDescription>
                  Select intake (season + year)
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                {/* Intake Dropdown */}
                <div>
                  <Label>Choose Intake</Label>
                  <Select
                    value={selectedIntake}
                    onValueChange={setSelectedIntake}
                  >
                    <SelectTrigger className="w-full mt-1">
                      <SelectValue placeholder="Select intake" />
                    </SelectTrigger>

                    <SelectContent>
                      {selectedProgram?.intake
                        ?.filter((i: any) => {
                          const programKey = selectedProgram.id;
                          const applied = appliedIntakes[programKey] || [];
                          const value = `${i.season}-${i.year}`;

                          return !applied.includes(value);
                        })
                        .map((i: any, idx: number) => {
                          const label = `${
                            i.season.charAt(0).toUpperCase() + i.season.slice(1)
                          } ${i.year}`;
                          const value = `${i.season}-${i.year}`;
                          return (
                            <SelectItem key={idx} value={value}>
                              {label}
                            </SelectItem>
                          );
                        })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowDetailsModal(false)}
                    >
                      Cancel
                    </Button>

                    <Button
                      onClick={() => {
                        if (!selectedProgram || !selectedIntake) return;

                        setSelectedIntakesForPrograms((prev) => ({
                          ...prev,
                          [selectedProgram.id]: selectedIntake,
                        }));

                        setShowDetailsModal(false);
                      }}
                    >
                      OK
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <main className="flex-1 overflow-y-auto p-6">
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
                            <SelectItem value="queensland">
                              Queensland
                            </SelectItem>
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
                            <SelectItem value="bachelors">
                              Bachelor's
                            </SelectItem>
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
                              <Label>Annual Tuition Range (AUD)</Label>
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
                                      checked={selectedFeatures.includes(
                                        feature
                                      )}
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
                    {visiblePrograms.length} programs found
                  </p>
                </div>

                <div className="grid gap-6 relative">
                  <AnimatePresence>
                    {visiblePrograms.map((program, index) => (
                      <motion.div
                        key={program.id}
                        initial={{ opacity: 0, y: 20, x: 0 }}
                        animate={{ opacity: 1, y: 0, x: 0 }}
                        exit={{
                          opacity: 0,
                          x: "100%",
                          transition: { duration: 0.5 },
                        }}
                        transition={{ duration: 0.3, delay: 0.1 * index }}
                      >
                        <Card className="bg-card/50 backdrop-blur border-border/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 hover:border-primary/20">
                          <CardContent className="p-6">
                            <div className="flex flex-col lg:flex-row gap-6">
                              {/* University Logo */}
                              <div className="flex-shrink-0">
                                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                                  <GraduationCap className="w-8 h-8 text-primary" />
                                </div>
                              </div>

                              {/* Program Details */}
                              <div className="flex-1 space-y-3">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h3 className="text-lg font-semibold text-foreground">
                                      {program.program}
                                    </h3>
                                    <p className="text-muted-foreground">
                                      {program.university}
                                    </p>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                                      <div className="flex items-center gap-1">
                                        <MapPin className="w-3 h-3" />
                                        {program.city}, {program.state}
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {program.duration}
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <DollarSign className="w-3 h-3" />
                                        {program.tuition}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="text-right space-y-1">
                                    <Badge variant="secondary">
                                      {program.ranking}
                                    </Badge>
                                    <div className="flex items-center gap-1">
                                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                      <span className="text-sm font-medium">
                                        {program.rating}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-2">
                                  {(program.tags || []).map((tag) => (
                                    <Badge
                                      key={String(tag)}
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>

                                {/* Requirements */}
                                <div>
                                  <p className="text-sm font-medium text-foreground mb-1">
                                    Requirements:
                                  </p>
                                  <div className="flex flex-wrap gap-2">
                                    {normalizeRequirements(
                                      program.requirements
                                    ).map((req) => (
                                      <span
                                        key={String(req)}
                                        className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded"
                                      >
                                        {req}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                                {selectedIntakesForPrograms[program.id] && (
                                  <p className="text-sm text-primary font-medium mt-2">
                                    Selected Intake:{" "}
                                    {selectedIntakesForPrograms[program.id]
                                      .replace("-", " ")
                                      .replace(/\b\w/g, (c) => c.toUpperCase())}
                                  </p>
                                )}

                                {/* Action buttons */}
                                <div className="flex items-center justify-between pt-2">
                                  <p className="text-sm text-muted-foreground">
                                    Application deadline:{" "}
                                    <span className="font-medium text-foreground">
                                      {program.deadline
                                        ? new Date(
                                            program.deadline
                                          ).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                          })
                                        : "N/A"}
                                    </span>
                                  </p>
                                  <div className="flex gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleDetails(program)}
                                    >
                                      Select Intake
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
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>

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
    </ProtectedRoute>
  );
}
