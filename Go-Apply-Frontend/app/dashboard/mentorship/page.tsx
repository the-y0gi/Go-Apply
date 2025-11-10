"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Users, 
  MessageCircle, 
  Calendar, 
  Star, 
  MapPin,
  GraduationCap,
  Briefcase,
  Clock,
  Video,
  Phone,
  Heart,
  CheckCircle
} from "lucide-react"
import DashboardSidebar from "@/components/dashboard/DashboardSidebar"
import DashboardHeader from "@/components/dashboard/DashboardHeader"
import ProtectedRoute from "@/components/auth/ProtectedRoute"

const mentors = [
  {
    id: 1,
    name: "Dr. Sarah Chen",
    title: "Senior Data Scientist",
    company: "Google",
    university: "Stanford University",
    degree: "PhD in Computer Science",
    specialties: ["Machine Learning", "Data Science", "PhD Applications"],
    rating: 4.9,
    reviews: 127,
    sessions: 89,
    location: "San Francisco, CA",
    avatar: "/placeholder-user.jpg",
    hourlyRate: 150,
    availability: "Available",
    nextSlot: "Today, 3:00 PM",
    bio: "Former admissions committee member at Stanford. Helped 200+ students get into top-tier programs.",
    isMatched: false,
    isFavorite: true
  },
  {
    id: 2,
    name: "Prof. Michael Johnson",
    title: "Associate Professor",
    company: "MIT",
    university: "MIT",
    degree: "PhD in Artificial Intelligence",
    specialties: ["AI/ML", "Research", "Graduate School"],
    rating: 4.8,
    reviews: 89,
    sessions: 156,
    location: "Boston, MA",
    avatar: "/placeholder-user.jpg",
    hourlyRate: 120,
    availability: "Busy",
    nextSlot: "Tomorrow, 10:00 AM",
    bio: "Research supervisor with expertise in AI ethics and machine learning systems.",
    isMatched: true,
    isFavorite: false
  },
  {
    id: 3,
    name: "Emma Rodriguez",
    title: "Software Engineer",
    company: "Microsoft",
    university: "University of Toronto",
    degree: "Master's in Computer Science",
    specialties: ["Software Engineering", "Career Guidance", "Interview Prep"],
    rating: 4.7,
    reviews: 203,
    sessions: 234,
    location: "Seattle, WA",
    avatar: "/placeholder-user.jpg",
    hourlyRate: 80,
    availability: "Available",
    nextSlot: "Today, 5:30 PM",
    bio: "Recent grad from UofT, now at Microsoft. Specializes in helping international students.",
    isMatched: false,
    isFavorite: false
  }
]

const upcomingSessions = [
  {
    id: 1,
    mentorName: "Prof. Michael Johnson",
    date: "Today",
    time: "3:00 PM - 4:00 PM",
    type: "Video Call",
    topic: "Research Proposal Review",
    status: "confirmed"
  },
  {
    id: 2,
    mentorName: "Dr. Sarah Chen",
    date: "Tomorrow",
    time: "2:00 PM - 3:00 PM",
    type: "Phone Call",
    topic: "Application Strategy",
    status: "confirmed"
  },
  {
    id: 3,
    mentorName: "Emma Rodriguez",
    date: "Friday",
    time: "4:00 PM - 5:00 PM",
    type: "Video Call",
    topic: "Interview Preparation",
    status: "pending"
  }
]

const myMentors = mentors.filter(m => m.isMatched)

export default function MentorshipPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeTab, setActiveTab] = useState("discover")

  const toggleFavorite = (mentorId: number) => {
    // In a real app, this would update the backend
    console.log(`Toggle favorite for mentor ${mentorId}`)
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
                    <h1 className="text-3xl font-bold text-foreground">Mentorship</h1>
                    <p className="text-muted-foreground mt-1">Connect with experienced mentors to guide your journey</p>
                  </div>
                  <Button className="bg-primary hover:bg-primary/90">
                    <Users className="w-4 h-4 mr-2" />
                    Book Session
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
                        <p className="text-sm font-medium text-muted-foreground">My Mentors</p>
                        <p className="text-2xl font-bold text-foreground">{myMentors.length}</p>
                      </div>
                      <Users className="h-8 w-8 text-primary" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 backdrop-blur border-border/50 hover:bg-card/60 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Sessions</p>
                        <p className="text-2xl font-bold text-foreground">12</p>
                      </div>
                      <Calendar className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 backdrop-blur border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Upcoming</p>
                        <p className="text-2xl font-bold text-foreground">{upcomingSessions.length}</p>
                      </div>
                      <Clock className="h-8 w-8 text-yellow-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 backdrop-blur border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Hours Completed</p>
                        <p className="text-2xl font-bold text-foreground">18</p>
                      </div>
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Main Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="bg-card/50 backdrop-blur border-border/50">
                  <CardHeader>
                    <CardTitle>Mentorship Hub</CardTitle>
                    <CardDescription>Discover mentors, manage sessions, and track your progress</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="discover">Discover</TabsTrigger>
                        <TabsTrigger value="my-mentors">My Mentors</TabsTrigger>
                        <TabsTrigger value="sessions">Sessions</TabsTrigger>
                        <TabsTrigger value="favorites">Favorites</TabsTrigger>
                      </TabsList>

                      {/* Discover Mentors */}
                      <TabsContent value="discover" className="space-y-6 mt-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {mentors.map((mentor, index) => (
                            <motion.div
                              key={mentor.id}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.3, delay: 0.1 * index }}
                              className="border border-border/50 rounded-lg p-6 bg-background/50 backdrop-blur hover:bg-background/70 transition-colors"
                            >
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-4">
                                  <Avatar className="w-16 h-16">
                                    <AvatarImage src={mentor.avatar} alt={mentor.name} />
                                    <AvatarFallback>
                                      {mentor.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <h3 className="font-semibold text-foreground text-lg">{mentor.name}</h3>
                                    <p className="text-muted-foreground">{mentor.title}</p>
                                    <p className="text-sm text-muted-foreground">{mentor.company}</p>
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    onClick={() => toggleFavorite(mentor.id)}
                                  >
                                    <Heart className={`w-4 h-4 ${mentor.isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
                                  </Button>
                                  <Badge className={
                                    mentor.availability === "Available" 
                                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                  }>
                                    {mentor.availability}
                                  </Badge>
                                </div>
                              </div>

                              <div className="space-y-3 mb-4">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <GraduationCap className="w-4 h-4" />
                                  {mentor.degree} from {mentor.university}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <MapPin className="w-4 h-4" />
                                  {mentor.location}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                  {mentor.rating} ({mentor.reviews} reviews) • {mentor.sessions} sessions
                                </div>
                              </div>

                              <div className="mb-4">
                                <p className="text-sm text-muted-foreground mb-2">Specialties:</p>
                                <div className="flex flex-wrap gap-2">
                                  {mentor.specialties.map((specialty) => (
                                    <Badge key={specialty} variant="secondary" className="text-xs">
                                      {specialty}
                                    </Badge>
                                  ))}
                                </div>
                              </div>

                              <p className="text-sm text-muted-foreground mb-4">{mentor.bio}</p>

                              <div className="flex items-center justify-between">
                                <div className="text-sm">
                                  <p className="font-medium text-foreground">${mentor.hourlyRate}/hour</p>
                                  <p className="text-muted-foreground">Next: {mentor.nextSlot}</p>
                                </div>
                                <div className="flex gap-2">
                                  <Button variant="outline" size="sm" className="bg-background/50 backdrop-blur border-border/50">
                                    <MessageCircle className="w-4 h-4 mr-1" />
                                    Message
                                  </Button>
                                  <Button size="sm" className="bg-primary hover:bg-primary/90">
                                    Book Session
                                  </Button>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </TabsContent>

                      {/* My Mentors */}
                      <TabsContent value="my-mentors" className="space-y-4 mt-6">
                        {myMentors.length > 0 ? (
                          myMentors.map((mentor, index) => (
                            <motion.div
                              key={mentor.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: 0.1 * index }}
                              className="border border-border/50 rounded-lg p-4 bg-background/50 backdrop-blur"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <Avatar className="w-12 h-12">
                                    <AvatarImage src={mentor.avatar} alt={mentor.name} />
                                    <AvatarFallback>
                                      {mentor.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <h3 className="font-semibold text-foreground">{mentor.name}</h3>
                                    <p className="text-sm text-muted-foreground">{mentor.title} • {mentor.company}</p>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button variant="outline" size="sm" className="bg-background/50 backdrop-blur border-border/50">
                                    <MessageCircle className="w-4 h-4 mr-1" />
                                    Message
                                  </Button>
                                  <Button size="sm" className="bg-primary hover:bg-primary/90">
                                    <Calendar className="w-4 h-4 mr-1" />
                                    Schedule
                                  </Button>
                                </div>
                              </div>
                            </motion.div>
                          ))
                        ) : (
                          <div className="text-center py-12">
                            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-foreground mb-2">No mentors yet</h3>
                            <p className="text-muted-foreground mb-4">Start by discovering and connecting with mentors</p>
                            <Button onClick={() => setActiveTab("discover")} className="bg-primary hover:bg-primary/90">
                              Discover Mentors
                            </Button>
                          </div>
                        )}
                      </TabsContent>

                      {/* Sessions */}
                      <TabsContent value="sessions" className="space-y-4 mt-6">
                        <h3 className="text-lg font-semibold text-foreground mb-4">Upcoming Sessions</h3>
                        {upcomingSessions.map((session, index) => (
                          <motion.div
                            key={session.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 * index }}
                            className="border border-border/50 rounded-lg p-4 bg-background/50 backdrop-blur"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <h4 className="font-semibold text-foreground">{session.topic}</h4>
                                <p className="text-sm text-muted-foreground">with {session.mentorName}</p>
                                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {session.date}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {session.time}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    {session.type === "Video Call" ? (
                                      <Video className="w-3 h-3" />
                                    ) : (
                                      <Phone className="w-3 h-3" />
                                    )}
                                    {session.type}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className={
                                  session.status === "confirmed"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                }>
                                  {session.status}
                                </Badge>
                                <Button variant="outline" size="sm" className="bg-background/50 backdrop-blur border-border/50">
                                  Join Call
                                </Button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </TabsContent>

                      {/* Favorites */}
                      <TabsContent value="favorites" className="space-y-4 mt-6">
                        {mentors.filter(m => m.isFavorite).length > 0 ? (
                          mentors.filter(m => m.isFavorite).map((mentor, index) => (
                            <motion.div
                              key={mentor.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: 0.1 * index }}
                              className="border border-border/50 rounded-lg p-4 bg-background/50 backdrop-blur"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <Avatar className="w-12 h-12">
                                    <AvatarImage src={mentor.avatar} alt={mentor.name} />
                                    <AvatarFallback>
                                      {mentor.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <h3 className="font-semibold text-foreground">{mentor.name}</h3>
                                    <p className="text-sm text-muted-foreground">{mentor.title} • {mentor.company}</p>
                                    <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                      {mentor.rating} • ${mentor.hourlyRate}/hour
                                    </div>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button variant="outline" size="sm" className="bg-background/50 backdrop-blur border-border/50">
                                    <MessageCircle className="w-4 h-4 mr-1" />
                                    Message
                                  </Button>
                                  <Button size="sm" className="bg-primary hover:bg-primary/90">
                                    Book Session
                                  </Button>
                                </div>
                              </div>
                            </motion.div>
                          ))
                        ) : (
                          <div className="text-center py-12">
                            <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-foreground mb-2">No favorite mentors yet</h3>
                            <p className="text-muted-foreground mb-4">Add mentors to your favorites for quick access</p>
                            <Button onClick={() => setActiveTab("discover")} className="bg-primary hover:bg-primary/90">
                              Discover Mentors
                            </Button>
                          </div>
                        )}
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