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
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  Briefcase,
  Globe,
  Edit,
  Save,
  Upload,
  Award,
  Languages,
  BookOpen,
} from "lucide-react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { Education, Experience, Language, UserProfile } from "@/models/user";
import AddEducationForm from "./AddEducationForm";
import AddExperienceForm from "./AddExperienceForm";
import AddAchievementForm from "./AddAchievementForm";
import axios from "axios";

// API Base URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";


export default function ProfilePage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [isEditing, setIsEditing] = useState(false);
  const { user, profile, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [isAddingExperience, setIsAddingExperience] = useState(false);
  const [editingExperienceIndex, setEditingExperienceIndex] = useState<
    number | null
  >(null);

  const [isAddingEducation, setIsAddingEducation] = useState(false);
  const [editingEducationIndex, setEditingEducationIndex] = useState<
    number | null
  >(null);

  const [newSkill, setNewSkill] = useState("");
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [isAddingLanguage, setIsAddingLanguage] = useState(false);

  const [newLanguage, setNewLanguage] = useState({
    language: "",
    proficiency: "",
  });
  const [editingLanguageIndex, setEditingLanguageIndex] = useState<
    number | null
  >(null);

  const [isAddingAchievement, setIsAddingAchievement] = useState(false);
  const [editingAchievementIndex, setEditingAchievementIndex] = useState<
    number | null
  >(null);

  // Keep track of original data for cancel functionality
  const [originalData, setOriginalData] = useState({});

  // Profile data from Auth context with fallbacks
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: profile?.phone || "",
    dateOfBirth: profile?.dateOfBirth || "",
    nationality: profile?.nationality || "Australian",
    address: profile?.address || "",
    bio: profile?.bio || "",
    educationHistory: profile?.educationHistory || [],
    experience: profile?.experience || [],
    technicalSkills: profile?.technicalSkills || [],
    languages: profile?.languages || [],
    achievements: profile?.achievements || [],
  });

  // Fetch user profile data from backend
  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const rawToken = localStorage.getItem("authToken") || "";
      const token = rawToken.replace(/^"|"$/g, "").trim();

      const response = await axios.get(`${API_URL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data.success) {
        const profile = response.data.data.profile;
        setProfileData((prev) => ({
          ...prev,
          ...profile,
          firstName: profile.userId?.firstName || prev.firstName,
          lastName: profile.userId?.lastName || prev.lastName,
          email: profile.userId?.email || prev.email,
        }));
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      setError("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  // Sync profile data with Auth context when it changes
  useEffect(() => {
    if (user || profile) {
      const updatedData = {
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        email: user?.email || "",
        phone: profile?.phone || "",
        dateOfBirth: profile?.dateOfBirth || "",
        nationality: profile?.nationality || "Australian",
        address: profile?.address || "",
        bio: profile?.bio || "",
      };
      setProfileData((prev) => ({
        ...prev,
        ...updatedData,
      }));
      // Also update original data to preserve current state
      setOriginalData((prev) => ({
        ...prev,
        ...updatedData,
      }));
    }
  }, [user, profile]);

  // Fetch profile on component mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleAddExperience = async (exp: Experience, index?: number) => {
    try {
      let updatedList = [...profileData.experience];

      if (index !== undefined) {
        // Update existing experience
        updatedList[index] = exp;
      } else {
        // Add new experience
        updatedList.push(exp);
      }

      setProfileData((prev) => ({ ...prev, experience: updatedList }));

      // Update backend
      // const token = localStorage.getItem('token')
      //    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTBiNTgwNjgwY2Q5OTBlMjQ4MGM4YTIiLCJpYXQiOjE3NjIzNjE2ODYsImV4cCI6MTc2NDk1MzY4Nn0.V9yJwOZOSwtVKl2n1gEzKMbIXQSUBrdC77Qebs9xqEA"
      const rawToken = localStorage.getItem("authToken") || "";
      const token = rawToken.replace(/^"|"$/g, "").trim();

      await axios.put(
        `${API_URL}/users/profile`,
        { experience: updatedList },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setSuccessMessage("Experience updated successfully");
    } catch (error) {
     console.error("Error updating experience:", error);
      setError("Failed to update experience");
    }
  };

  const handleEditAchievement = (index: number) => {
    setEditingAchievementIndex(index);
    setIsAddingAchievement(true);
  };

  const handleSaveAchievement = async (achievement: {
    title: string;
    description: string;
    date: string;
  }) => {
    try {
      const updatedAchievements = [...profileData.achievements];

      if (editingAchievementIndex !== null) {
        // Edit existing
        updatedAchievements[
          editingAchievementIndex
        ] = `${achievement.title} (${achievement.date})`;
      } else {
        // Add new
        updatedAchievements.push(`${achievement.title} (${achievement.date})`);
      }

      setProfileData((prev: any) => ({
        ...prev,
        achievements: updatedAchievements,
      }));

      // Update backend
      // const token = localStorage.getItem('token')
      //  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTBiNTgwNjgwY2Q5OTBlMjQ4MGM4YTIiLCJpYXQiOjE3NjIzNjE2ODYsImV4cCI6MTc2NDk1MzY4Nn0.V9yJwOZOSwtVKl2n1gEzKMbIXQSUBrdC77Qebs9xqEA"
      const rawToken = localStorage.getItem("authToken") || "";
      const token = rawToken.replace(/^"|"$/g, "").trim();

      await axios.put(
        `${API_URL}/users/profile`,
        { achievements: updatedAchievements },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setIsAddingAchievement(false);
      setEditingAchievementIndex(null);
      setSuccessMessage("Achievement saved successfully");
    } catch (error) {
      console.error("Error saving achievement:", error);
      setError("Failed to save achievement");
    }
  };

  const handleAddEducation = async (edu: Education) => {
    try {
      // Safely handle case when educationHistory might be undefined
      const newEducationHistory = [
        ...(profileData.educationHistory || []),
        edu,
      ];

      // Update local state
      setProfileData((prev) => ({
        ...prev,
        educationHistory: newEducationHistory,
      }));

      // Update backend
      // const token = localStorage.getItem('token')
      //      const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTBiNTgwNjgwY2Q5OTBlMjQ4MGM4YTIiLCJpYXQiOjE3NjIzNjE2ODYsImV4cCI6MTc2NDk1MzY4Nn0.V9yJwOZOSwtVKl2n1gEzKMbIXQSUBrdC77Qebs9xqEA"
      const rawToken = localStorage.getItem("authToken") || "";
      const token = rawToken.replace(/^"|"$/g, "").trim();

      await axios.put(
        `${API_URL}/users/profile`,
        { educationHistory: newEducationHistory },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Close modal/form
      setIsAddingEducation(false);
      setSuccessMessage("Education added successfully");
    } catch (error) {
      console.error("Error adding education:", error);
      setError("Failed to add education");
    }
  };

  const handleAddSkill = async () => {
    if (!newSkill.trim()) return;

    try {
      const updatedSkills = [...profileData.technicalSkills, newSkill];
      setProfileData((prev: any) => ({
        ...prev,
        technicalSkills: updatedSkills,
      }));

      // Update backend
      // const token = localStorage.getItem('token')
      // const token =
      //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTBiNTgwNjgwY2Q5OTBlMjQ4MGM4YTIiLCJpYXQiOjE3NjIzNjE2ODYsImV4cCI6MTc2NDk1MzY4Nn0.V9yJwOZOSwtVKl2n1gEzKMbIXQSUBrdC77Qebs9xqEA";
      const rawToken = localStorage.getItem("authToken") || "";
      const token = rawToken.replace(/^"|"$/g, "").trim();

      await axios.put(
        `${API_URL}/users/profile`,
        { technicalSkills: updatedSkills },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setNewSkill("");
      setIsAddingSkill(false);
      setSuccessMessage("Skill added successfully");
    } catch (error) {
      console.error("Error adding skill:", error);
      setError("Failed to add skill");
    }
  };

  const handleAddLanguage = async (lang: Language) => {
    try {
      const newLanguages = [...profileData.languages, lang];
      setProfileData((prev) => ({ ...prev, languages: newLanguages }));

      // Update backend
      // const token = localStorage.getItem('token')
      // const token =
      //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTBiNTgwNjgwY2Q5OTBlMjQ4MGM4YTIiLCJpYXQiOjE3NjIzNjE2ODYsImV4cCI6MTc2NDk1MzY4Nn0.V9yJwOZOSwtVKl2n1gEzKMbIXQSUBrdC77Qebs9xqEA";
              const rawToken = localStorage.getItem("authToken") || ""
        const token = rawToken.replace(/^"|"$/g, "").trim()
      await axios.put(
        `${API_URL}/users/profile`,
        { languages: newLanguages },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setIsAddingLanguage(false);
      setSuccessMessage("Language added successfully");
    } catch (error) {
      console.error("Error adding language:", error);
      setError("Failed to add language");
    }
  };

  const handleEditLanguage = (index: number) => {
    const selectedLang = profileData.languages[index];
    setNewLanguage(selectedLang);
    setIsAddingLanguage(true);
    setEditingLanguageIndex(index);
  };

  const handleSaveLanguage = async () => {
    try {
      const updatedLanguages =
        editingLanguageIndex !== null
          ? profileData.languages.map((lang, index) =>
              index === editingLanguageIndex ? newLanguage : lang
            )
          : [...profileData.languages, newLanguage];

      setProfileData({
        ...profileData,
        languages: updatedLanguages,
      });

      // Update backend
      // const token = localStorage.getItem('token')
      // const token =
      //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTBiNTgwNjgwY2Q5OTBlMjQ4MGM4YTIiLCJpYXQiOjE3NjIzNjE2ODYsImV4cCI6MTc2NDk1MzY4Nn0.V9yJwOZOSwtVKl2n1gEzKMbIXQSUBrdC77Qebs9xqEA";
              const rawToken = localStorage.getItem("authToken") || ""
        const token = rawToken.replace(/^"|"$/g, "").trim()
      await axios.put(
        `${API_URL}/users/profile`,
        { languages: updatedLanguages },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setNewLanguage({ language: "", proficiency: "" });
      setIsAddingLanguage(false);
      setEditingLanguageIndex(null);
      setSuccessMessage("Language saved successfully");
    } catch (error) {
      console.error("Error saving language:", error);
      setError("Failed to save language");
    }
  };

  const handleAddAchievement = async (ach: string) => {
    try {
      const newAchievements = [...profileData.achievements, ach];
      setProfileData((prev) => ({ ...prev, achievements: newAchievements }));

      // Update backend
      // const token = localStorage.getItem('token')
      // const token =
      //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTBiNTgwNjgwY2Q5OTBlMjQ4MGM4YTIiLCJpYXQiOjE3NjIzNjE2ODYsImV4cCI6MTc2NDk1MzY4Nn0.V9yJwOZOSwtVKl2n1gEzKMbIXQSUBrdC77Qebs9xqEA";
              const rawToken = localStorage.getItem("authToken") || ""
        const token = rawToken.replace(/^"|"$/g, "").trim()
      await axios.put(
        `${API_URL}/users/profile`,
        { achievements: newAchievements },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setIsAddingAchievement(false);
      setSuccessMessage("Achievement added successfully");
    } catch (error) {
      console.error("Error adding achievement:", error);
      setError("Failed to add achievement");
    }
  };

  const handleCancelSkill = () => {
    setNewSkill("");
    setIsAddingSkill(false);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError("");

      //  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTBiNTgwNjgwY2Q5OTBlMjQ4MGM4YTIiLCJpYXQiOjE3NjIzNjE2ODYsImV4cCI6MTc2NDk1MzY4Nn0.V9yJwOZOSwtVKl2n1gEzKMbIXQSUBrdC77Qebs9xqEA"
      const rawToken = localStorage.getItem("authToken") || "";
      const token = rawToken.replace(/^"|"$/g, "").trim();
      // Update profile through backend API
      const response = await axios.put(
        `${API_URL}/users/profile`,
        {
          phone: profileData.phone,
          dateOfBirth: profileData.dateOfBirth,
          nationality: profileData.nationality,
          address: profileData.address,
          bio: profileData.bio,
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          email: profileData.email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        // Update original data to current data after successful save
        setOriginalData({ ...profileData });
        setIsEditing(false);
        setSuccessMessage("Profile updated successfully");

        // Also update Auth context if needed
        if (updateProfile) {
          await updateProfile({
            phone: profileData.phone,
            dateOfBirth: profileData.dateOfBirth,
            nationality: profileData.nationality,
            address: profileData.address,
            bio: profileData.bio,
            firstName: profileData.firstName,
            lastName: profileData.lastName,
          } as any);
        }
      }
    } catch (error: any) {
      console.error("Error saving profile:", error);
      setError(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Restore data to original state
    setProfileData({ ...profileData, ...originalData });
    setIsEditing(false);
    setError("");
    setSuccessMessage("");
  };

  const handleEdit = () => {
    // Store current state as original before editing
    setOriginalData({ ...profileData });
    setIsEditing(true);
    setError("");
    setSuccessMessage("");
  };

  const handleInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Clear messages after 5 seconds
  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
        setError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error]);

  if (loading && !profileData.firstName) {
    return (
      <ProtectedRoute>
        <div className="flex h-screen items-center justify-center">
          <div className="text-center">Loading profile...</div>
        </div>
      </ProtectedRoute>
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
          <main className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {/* Success/Error Messages */}
              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg"
                >
                  {successMessage}
                </motion.div>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg"
                >
                  {error}
                </motion.div>
              )}

              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground">
                      Profile
                    </h1>
                    <p className="text-muted-foreground mt-1">
                      Manage your personal information and preferences
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {isEditing ? (
                      <>
                        <Button
                          variant="outline"
                          onClick={handleCancel}
                          disabled={loading}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleSave}
                          disabled={loading}
                          className="bg-primary hover:bg-primary/90"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          {loading ? "Saving..." : "Save Changes"}
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={handleEdit}
                        className="bg-primary hover:bg-primary/90"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Profile Header Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="bg-card/50 backdrop-blur border-border/50 hover:bg-card/60 hover:border-primary/20 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <Avatar className="w-24 h-24">
                          <AvatarImage
                            src="/placeholder-user.jpg"
                            alt="Profile"
                          />
                          <AvatarFallback className="text-2xl">
                            {profileData.firstName[0]}
                            {profileData.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        {isEditing && (
                          <Button
                            size="sm"
                            className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                          >
                            <Upload className="w-3 h-3" />
                          </Button>
                        )}
                      </div>

                      <div className="flex-1">
                        <h2 className="text-2xl font-bold text-foreground">
                          {profileData.firstName} {profileData.lastName}
                        </h2>
                        <p className="text-muted-foreground mb-2">
                          {profileData.email}
                        </p>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {profileData.nationality}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {profileData.dateOfBirth
                              ? `Born ${new Date(
                                  profileData.dateOfBirth
                                ).toLocaleDateString()}`
                              : "Date of birth not set"}
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {profileData.phone || "Phone not set"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Profile Details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="bg-card/50 backdrop-blur border-border/50 hover:bg-card/60 transition-all duration-300">
                  <CardHeader>
                    <CardTitle>Profile Details</CardTitle>
                    <CardDescription>
                      Update your personal and professional information
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                      <TabsList className="grid w-full grid-cols-5">
                        <TabsTrigger value="personal">Personal</TabsTrigger>
                        <TabsTrigger value="education">Education</TabsTrigger>
                        <TabsTrigger value="experience">Experience</TabsTrigger>
                        <TabsTrigger value="skills">Skills</TabsTrigger>
                        <TabsTrigger value="achievements">
                          Achievements
                        </TabsTrigger>
                      </TabsList>

                      {/* Personal Information */}
                      <TabsContent value="personal" className="space-y-6 mt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                              id="firstName"
                              value={profileData.firstName}
                              onChange={(e) =>
                                handleInputChange("firstName", e.target.value)
                              }
                              disabled={!isEditing}
                              className="bg-background/50 backdrop-blur border-border/50"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                              id="lastName"
                              value={profileData.lastName}
                              onChange={(e) =>
                                handleInputChange("lastName", e.target.value)
                              }
                              disabled={!isEditing}
                              className="bg-background/50 backdrop-blur border-border/50"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              value={profileData.email}
                              onChange={(e) =>
                                handleInputChange("email", e.target.value)
                              }
                              disabled={!isEditing}
                              className="bg-background/50 backdrop-blur border-border/50"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                              id="phone"
                              value={profileData.phone}
                              onChange={(e) =>
                                handleInputChange("phone", e.target.value)
                              }
                              disabled={!isEditing}
                              className="bg-background/50 backdrop-blur border-border/50"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="dateOfBirth">Date of Birth</Label>
                            <Input
                              id="dateOfBirth"
                              type="date"
                              value={profileData.dateOfBirth}
                              onChange={(e) =>
                                handleInputChange("dateOfBirth", e.target.value)
                              }
                              disabled={!isEditing}
                              className="bg-background/50 backdrop-blur border-border/50"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="nationality">Nationality</Label>
                            <Input
                              id="nationality"
                              value={profileData.nationality}
                              onChange={(e) =>
                                handleInputChange("nationality", e.target.value)
                              }
                              disabled={!isEditing}
                              className="bg-background/50 backdrop-blur border-border/50"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="address">Address</Label>
                          <Textarea
                            id="address"
                            value={profileData.address}
                            onChange={(e) =>
                              handleInputChange("address", e.target.value)
                            }
                            disabled={!isEditing}
                            className="bg-background/50 backdrop-blur border-border/50"
                            rows={3}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="bio">Bio</Label>
                          <Textarea
                            id="bio"
                            value={profileData.bio}
                            onChange={(e) =>
                              handleInputChange("bio", e.target.value)
                            }
                            disabled={!isEditing}
                            className="bg-background/50 backdrop-blur border-border/50"
                            rows={4}
                            placeholder="Tell us about yourself..."
                          />
                        </div>
                      </TabsContent>

                      {/* Education */}
                      <TabsContent value="education" className="space-y-6 mt-6">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-foreground">
                            Education History
                          </h3>
                          {isEditing && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="bg-background/50 backdrop-blur border-border/50"
                              onClick={() => {
                                setIsAddingEducation(true);
                                setEditingEducationIndex(null);
                              }}
                            >
                              <GraduationCap className="w-4 h-4 mr-2" />
                              Add Education
                            </Button>
                          )}
                        </div>

                        {/* Add/Edit Education Form */}
                        {(isAddingEducation ||
                          editingEducationIndex !== null) && (
                          <div className="mt-4">
                            <AddEducationForm
                              initialData={
                                editingEducationIndex !== null
                                  ? (profileData.educationHistory || [])[
                                      editingEducationIndex
                                    ]
                                  : undefined
                              }
                              onSave={handleAddEducation}
                              onCancel={() => {
                                setIsAddingEducation(false);
                                setEditingEducationIndex(null);
                              }}
                            />
                          </div>
                        )}

                        {/* List of Educations */}
                        <div className="space-y-4">
                          {(profileData.educationHistory || []).map(
                            (edu: Education, index: number) => (
                              <div
                                key={index}
                                className="border border-border/50 rounded-lg p-4 bg-background/50 backdrop-blur flex justify-between items-start"
                              >
                                <div>
                                  <h4 className="font-semibold text-foreground">
                                    {edu.degree}
                                  </h4>
                                  <p className="text-muted-foreground">
                                    {edu.institution}
                                  </p>
                                  <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                                    <span>
                                      Graduation: {edu.graduationYear}
                                    </span>
                                    <span>GPA: {edu.gpa}</span>
                                    <span>{edu.honors}</span>
                                  </div>
                                </div>

                                {isEditing && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    onClick={() => {
                                      setEditingEducationIndex(index);
                                      setIsAddingEducation(false);
                                    }}
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                            )
                          )}
                        </div>
                      </TabsContent>

                      {/* Experience */}
                      <TabsContent
                        value="experience"
                        className="space-y-6 mt-6"
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-foreground">
                            Work Experience
                          </h3>
                          {isEditing && (
                            <Button
                              onClick={() => setIsAddingExperience(true)}
                              size="sm"
                              variant="outline"
                              className="flex items-center bg-background/50 backdrop-blur border-border/50"
                            >
                              <Briefcase className="w-4 h-4 mr-2" /> Add
                              Experience
                            </Button>
                          )}
                        </div>

                        {/* Form */}
                        {isAddingExperience && (
                          <div className="mt-4">
                            <AddExperienceForm
                              onSave={(newExp: Experience) => {
                                handleAddExperience(newExp);
                                setIsAddingExperience(false);
                              }}
                              onCancel={() => setIsAddingExperience(false)}
                            />
                          </div>
                        )}

                        {/* List of experiences */}
                        <div className="space-y-4">
                          {profileData.experience.map((exp, index) => (
                            <div
                              key={index}
                              className="border border-border/50 rounded-lg p-4 bg-background/50 backdrop-blur"
                            >
                              {editingExperienceIndex === index ? (
                                <AddExperienceForm
                                  initialData={exp}
                                  onSave={(updatedExp: Experience) => {
                                    handleAddExperience(updatedExp, index);
                                    setEditingExperienceIndex(null);
                                  }}
                                  onCancel={() =>
                                    setEditingExperienceIndex(null)
                                  }
                                />
                              ) : (
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-foreground">
                                      {exp.title}
                                    </h4>
                                    <p className="text-muted-foreground">
                                      {exp.company}
                                    </p>
                                    <p className="text-sm text-muted-foreground mb-2">
                                      {exp.duration}
                                    </p>
                                    <p className="text-sm text-foreground">
                                      {exp.description}
                                    </p>
                                  </div>

                                  {isEditing && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0"
                                      onClick={() =>
                                        setEditingExperienceIndex(index)
                                      }
                                    >
                                      <Edit className="w-4 h-4" />
                                    </Button>
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </TabsContent>

                      {/* Skills */}
                      <TabsContent value="skills" className="space-y-6 mt-6">
                        <div>
                          <h3 className="text-lg font-semibold text-foreground mb-4">
                            Technical Skills
                          </h3>

                          <div className="flex flex-wrap gap-2">
                            {(profileData.technicalSkills || []).map(
                              (skill, index) => (
                                <Badge
                                  key={index}
                                  variant="secondary"
                                  className="text-sm"
                                >
                                  {skill}
                                </Badge>
                              )
                            )}

                            {/* Add Skill Button */}
                            {isEditing && !isAddingSkill && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-6 bg-background/50 backdrop-blur border-border/50"
                                onClick={() => setIsAddingSkill(true)}
                              >
                                + Add Skill
                              </Button>
                            )}
                          </div>

                          {/* Add Skill Input Form */}
                          {isAddingSkill && (
                            <div className="mt-3 flex items-center gap-2">
                              <Input
                                placeholder="Enter new skill"
                                value={newSkill}
                                onChange={(e) => setNewSkill(e.target.value)}
                              />
                              <Button onClick={handleAddSkill}>Save</Button>
                              <Button
                                variant="outline"
                                onClick={handleCancelSkill}
                              >
                                Cancel
                              </Button>
                            </div>
                          )}
                        </div>

                        {/* Languages Section */}
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-foreground">
                            Languages
                          </h3>
                          {isEditing && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full bg-background/50 backdrop-blur border-border/50"
                              onClick={() => setIsAddingLanguage(true)}
                            >
                              Add Language
                            </Button>
                          )}
                        </div>

                        {(profileData.languages || []).map((lang, index) => (
                          <div
                            key={index}
                            className="border border-border/50 rounded-lg p-4 bg-background/50 backdrop-blur flex justify-between items-center"
                          >
                            <span>
                              {lang.language} - {lang.proficiency}
                            </span>
                            {isEditing && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => handleEditLanguage(index)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        ))}

                        {isAddingLanguage && (
                          <div className="border border-border/50 rounded-lg p-4 bg-background/50 backdrop-blur mt-2 space-y-3">
                            <div className="flex flex-col gap-2">
                              <label className="text-sm font-medium text-foreground">
                                Language
                              </label>
                              <Input
                                placeholder="e.g. English"
                                value={newLanguage.language}
                                onChange={(e) =>
                                  setNewLanguage({
                                    ...newLanguage,
                                    language: e.target.value,
                                  })
                                }
                              />
                            </div>

                            <div className="flex flex-col gap-2">
                              <label className="text-sm font-medium text-foreground">
                                Proficiency
                              </label>
                              <Input
                                placeholder="e.g. Fluent"
                                value={newLanguage.proficiency}
                                onChange={(e) =>
                                  setNewLanguage({
                                    ...newLanguage,
                                    proficiency: e.target.value,
                                  })
                                }
                              />
                            </div>

                            <div className="flex gap-2">
                              <Button size="sm" onClick={handleSaveLanguage}>
                                Save
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setIsAddingLanguage(false);
                                  setEditingLanguageIndex(null);
                                  setNewLanguage({
                                    language: "",
                                    proficiency: "",
                                  });
                                }}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        )}
                      </TabsContent>

                      {/* Achievements */}
                      <TabsContent
                        value="achievements"
                        className="space-y-6 mt-6"
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-foreground">
                            Achievements & Awards
                          </h3>
                          {isEditing && !isAddingAchievement && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="bg-background/50 backdrop-blur border-border/50"
                              onClick={() => setIsAddingAchievement(true)}
                            >
                              <Award className="w-4 h-4 mr-2" />
                              Add Achievement
                            </Button>
                          )}
                        </div>

                        {/* Add Achievement Form */}
                        {isAddingAchievement && (
                          <div className="mt-4">
                            <AddAchievementForm
                              onSave={handleSaveAchievement}
                              onCancel={() => {
                                setIsAddingAchievement(false);
                                setEditingAchievementIndex(null);
                              }}
                            />
                          </div>
                        )}

                        {/* List of Achievements */}
                        <div className="space-y-3">
                          {profileData.achievements.map(
                            (achievement, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-3 p-3 border border-border/50 rounded-lg bg-background/50 backdrop-blur"
                              >
                                <Award className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                                <span className="text-foreground">
                                  {achievement}
                                </span>
                                {isEditing && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0 ml-auto"
                                    onClick={() => handleEditAchievement(index)}
                                  >
                                    <Edit className="w-3 h-3" />
                                  </Button>
                                )}
                              </div>
                            )
                          )}
                        </div>
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
  );
}
