"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { 
  HelpCircle, 
  Search, 
  MessageCircle, 
  BookOpen, 
  Video,
  FileText,
  Mail,
  Phone,
  Clock,
  Star,
  ChevronRight,
  ExternalLink,
  Send
} from "lucide-react"
import DashboardSidebar from "@/components/dashboard/DashboardSidebar"
import DashboardHeader from "@/components/dashboard/DashboardHeader"
import ProtectedRoute from "@/components/auth/ProtectedRoute"

const faqData = [
  {
    id: 1,
    category: "Getting Started",
    question: "How do I create my first application?",
    answer: "To create your first application, go to the 'Applications' page and click 'New Application'. Fill in your university details, program information, and upload required documents. Our step-by-step guide will walk you through the entire process."
  },
  {
    id: 2,
    category: "Applications",
    question: "Can I edit my application after submission?",
    answer: "Once submitted, applications cannot be edited. However, you can create a new version or contact the university directly if you need to make changes. We recommend reviewing all information carefully before submission."
  },
  {
    id: 3,
    category: "Documents",
    question: "What document formats are accepted?",
    answer: "We accept PDF, DOC, DOCX files up to 10MB. For transcripts and certificates, PDF format is preferred. Make sure all documents are clear and readable before uploading."
  },
  {
    id: 4,
    category: "Payments",
    question: "How do I pay application fees?",
    answer: "Application fees can be paid using credit cards, PayPal, or bank transfers. Go to the 'Payments' section, select the application, and choose your preferred payment method. All payments are secure and encrypted."
  },
  {
    id: 5,
    category: "Deadlines",
    question: "How do deadline reminders work?",
    answer: "GoApply automatically tracks all your application deadlines and sends reminders via email and push notifications. You can customize reminder timing in your settings (1, 3, 7, or 14 days before)."
  },
  {
    id: 6,
    category: "Mentorship",
    question: "How do I book a mentorship session?",
    answer: "Browse available mentors in the 'Mentorship' section, review their profiles and specialties, then click 'Book Session'. Choose a time slot that works for both you and the mentor. Sessions can be conducted via video call or phone."
  }
]

const helpResources = [
  {
    title: "Getting Started Guide",
    description: "Complete walkthrough for new users",
    type: "guide",
    icon: BookOpen,
    duration: "10 min read",
    popular: true
  },
  {
    title: "Video Tutorials",
    description: "Step-by-step video guides",
    type: "video",
    icon: Video,
    duration: "25 videos",
    popular: true
  },
  {
    title: "Application Best Practices",
    description: "Tips for successful applications",
    type: "guide",
    icon: FileText,
    duration: "15 min read",
    popular: false
  },
  {
    title: "Document Checklist",
    description: "Required documents for each country",
    type: "checklist",
    icon: FileText,
    duration: "5 min read",
    popular: true
  }
]

const supportChannels = [
  {
    name: "Live Chat",
    description: "Get instant help from our support team",
    availability: "Mon-Fri, 9AM-6PM EST",
    responseTime: "< 5 minutes",
    icon: MessageCircle,
    status: "online"
  },
  {
    name: "Email Support",
    description: "Send detailed questions via email",
    availability: "24/7",
    responseTime: "< 24 hours",
    icon: Mail,
    status: "available"
  },
  {
    name: "Phone Support",
    description: "Speak directly with a support agent",
    availability: "Mon-Fri, 10AM-5PM EST",
    responseTime: "< 2 minutes",
    icon: Phone,
    status: "available"
  }
]

export default function HelpPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeTab, setActiveTab] = useState("faq")
  const [searchTerm, setSearchTerm] = useState("")
  const [supportMessage, setSupportMessage] = useState("")

  const filteredFAQ = faqData.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSendMessage = () => {
    if (supportMessage.trim()) {
      console.log("Sending support message:", supportMessage)
      setSupportMessage("")
    }
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
                <div className="text-center">
                  <h1 className="text-3xl font-bold text-foreground">Help Center</h1>
                  <p className="text-muted-foreground mt-2">Find answers to your questions and get support</p>
                </div>
              </motion.div>

              {/* Search Bar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="max-w-2xl mx-auto"
              >
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input
                    placeholder="Search for help articles, guides, or FAQs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-12 text-lg bg-card/50 backdrop-blur border-border/50"
                  />
                </div>
              </motion.div>

              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                <Card className="bg-card/50 backdrop-blur border-border/50">
                  <CardContent className="p-4 text-center">
                    <BookOpen className="w-8 h-8 text-primary mx-auto mb-2" />
                    <p className="text-2xl font-bold text-foreground">50+</p>
                    <p className="text-sm text-muted-foreground">Help Articles</p>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 backdrop-blur border-border/50">
                  <CardContent className="p-4 text-center">
                    <Video className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-foreground">25</p>
                    <p className="text-sm text-muted-foreground">Video Tutorials</p>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 backdrop-blur border-border/50">
                  <CardContent className="p-4 text-center">
                    <Clock className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-foreground">&lt; 2hrs</p>
                    <p className="text-sm text-muted-foreground">Avg Response Time</p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Main Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card className="bg-card/50 backdrop-blur border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <HelpCircle className="w-5 h-5" />
                      Support Resources
                    </CardTitle>
                    <CardDescription>Find the help you need through our comprehensive resources</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="faq">FAQ</TabsTrigger>
                        <TabsTrigger value="guides">Guides</TabsTrigger>
                        <TabsTrigger value="contact">Contact</TabsTrigger>
                        <TabsTrigger value="feedback">Feedback</TabsTrigger>
                      </TabsList>

                      {/* FAQ Section */}
                      <TabsContent value="faq" className="space-y-6 mt-6">
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-foreground">Frequently Asked Questions</h3>
                          
                          {searchTerm && (
                            <p className="text-sm text-muted-foreground">
                              Found {filteredFAQ.length} results for "{searchTerm}"
                            </p>
                          )}

                          <Accordion type="single" collapsible className="space-y-2">
                            {filteredFAQ.map((faq, index) => (
                              <motion.div
                                key={faq.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.1 * index }}
                              >
                                <AccordionItem value={`faq-${faq.id}`} className="border border-border/50 rounded-lg bg-background/50 backdrop-blur px-4">
                                  <AccordionTrigger className="hover:no-underline">
                                    <div className="flex items-center gap-3 text-left">
                                      <Badge variant="secondary" className="text-xs">
                                        {faq.category}
                                      </Badge>
                                      <span className="font-medium">{faq.question}</span>
                                    </div>
                                  </AccordionTrigger>
                                  <AccordionContent className="text-muted-foreground pt-2 pb-4">
                                    {faq.answer}
                                  </AccordionContent>
                                </AccordionItem>
                              </motion.div>
                            ))}
                          </Accordion>

                          {filteredFAQ.length === 0 && searchTerm && (
                            <div className="text-center py-8">
                              <HelpCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                              <h3 className="text-lg font-semibold text-foreground mb-2">No results found</h3>
                              <p className="text-muted-foreground mb-4">Try different keywords or browse our guides</p>
                              <Button onClick={() => setActiveTab("guides")} className="bg-primary hover:bg-primary/90">
                                Browse Guides
                              </Button>
                            </div>
                          )}
                        </div>
                      </TabsContent>

                      {/* Guides Section */}
                      <TabsContent value="guides" className="space-y-6 mt-6">
                        <div className="space-y-6">
                          <h3 className="text-lg font-semibold text-foreground">Help Resources</h3>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {helpResources.map((resource, index) => {
                              const IconComponent = resource.icon
                              return (
                                <motion.div
                                  key={resource.title}
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ duration: 0.3, delay: 0.1 * index }}
                                  className="border border-border/50 rounded-lg p-4 bg-background/50 backdrop-blur hover:bg-background/70 transition-colors cursor-pointer group"
                                >
                                  <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-3 flex-1">
                                      <div className="p-2 rounded-lg bg-primary/10">
                                        <IconComponent className="w-5 h-5 text-primary" />
                                      </div>
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                          <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                                            {resource.title}
                                          </h4>
                                          {resource.popular && (
                                            <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 text-xs">
                                              Popular
                                            </Badge>
                                          )}
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-2">{resource.description}</p>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                          <Clock className="w-3 h-3" />
                                          {resource.duration}
                                        </div>
                                      </div>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                  </div>
                                </motion.div>
                              )
                            })}
                          </div>

                          <div className="text-center">
                            <Button variant="outline" className="bg-background/50 backdrop-blur border-border/50">
                              <ExternalLink className="w-4 h-4 mr-2" />
                              View All Resources
                            </Button>
                          </div>
                        </div>
                      </TabsContent>

                      {/* Contact Section */}
                      <TabsContent value="contact" className="space-y-6 mt-6">
                        <div className="space-y-6">
                          <h3 className="text-lg font-semibold text-foreground">Get in Touch</h3>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {supportChannels.map((channel, index) => {
                              const IconComponent = channel.icon
                              return (
                                <motion.div
                                  key={channel.name}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.3, delay: 0.1 * index }}
                                  className="border border-border/50 rounded-lg p-4 bg-background/50 backdrop-blur"
                                >
                                  <div className="text-center">
                                    <div className="p-3 rounded-full bg-primary/10 w-fit mx-auto mb-3">
                                      <IconComponent className="w-6 h-6 text-primary" />
                                    </div>
                                    <h4 className="font-semibold text-foreground mb-2">{channel.name}</h4>
                                    <p className="text-sm text-muted-foreground mb-3">{channel.description}</p>
                                    <div className="space-y-1 text-xs text-muted-foreground mb-4">
                                      <p>{channel.availability}</p>
                                      <p>Response: {channel.responseTime}</p>
                                    </div>
                                    <Button 
                                      size="sm" 
                                      className="w-full bg-primary hover:bg-primary/90"
                                      disabled={channel.status !== "online" && channel.status !== "available"}
                                    >
                                      {channel.name === "Live Chat" ? "Start Chat" : 
                                       channel.name === "Email Support" ? "Send Email" : "Call Now"}
                                    </Button>
                                  </div>
                                </motion.div>
                              )
                            })}
                          </div>

                          <div className="max-w-2xl mx-auto">
                            <h4 className="font-semibold text-foreground mb-4">Send us a message</h4>
                            <div className="space-y-4">
                              <Textarea
                                placeholder="Describe your issue or question in detail..."
                                value={supportMessage}
                                onChange={(e) => setSupportMessage(e.target.value)}
                                className="min-h-[120px] bg-background/50 backdrop-blur border-border/50"
                              />
                              <div className="flex justify-end">
                                <Button 
                                  onClick={handleSendMessage}
                                  disabled={!supportMessage.trim()}
                                  className="bg-primary hover:bg-primary/90"
                                >
                                  <Send className="w-4 h-4 mr-2" />
                                  Send Message
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      {/* Feedback Section */}
                      <TabsContent value="feedback" className="space-y-6 mt-6">
                        <div className="space-y-6">
                          <div className="text-center">
                            <h3 className="text-lg font-semibold text-foreground mb-2">Help us improve</h3>
                            <p className="text-muted-foreground">Your feedback helps us make GoApply better for everyone</p>
                          </div>

                          <div className="max-w-2xl mx-auto space-y-6">
                            <Card className="bg-background/50 backdrop-blur border-border/50">
                              <CardHeader>
                                <CardTitle className="text-center">Rate your experience</CardTitle>
                              </CardHeader>
                              <CardContent className="text-center">
                                <div className="flex justify-center gap-2 mb-4">
                                  {[1, 2, 3, 4, 5].map((rating) => (
                                    <button key={rating} className="p-1 hover:scale-110 transition-transform">
                                      <Star className="w-8 h-8 text-gray-300 hover:text-yellow-400 transition-colors" />
                                    </button>
                                  ))}
                                </div>
                                <p className="text-sm text-muted-foreground">Click to rate your experience</p>
                              </CardContent>
                            </Card>

                            <Card className="bg-background/50 backdrop-blur border-border/50">
                              <CardHeader>
                                <CardTitle>Feature Request</CardTitle>
                                <CardDescription>Tell us what features you'd like to see</CardDescription>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                <Textarea
                                  placeholder="Describe the feature you'd like to see..."
                                  className="min-h-[100px] bg-background/50 backdrop-blur border-border/50"
                                />
                                <Button className="w-full bg-primary hover:bg-primary/90">
                                  Submit Feature Request
                                </Button>
                              </CardContent>
                            </Card>

                            <Card className="bg-background/50 backdrop-blur border-border/50">
                              <CardHeader>
                                <CardTitle>Report a Bug</CardTitle>
                                <CardDescription>Help us fix issues you encounter</CardDescription>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                <Textarea
                                  placeholder="Please describe the bug and steps to reproduce it..."
                                  className="min-h-[100px] bg-background/50 backdrop-blur border-border/50"
                                />
                                <Button variant="outline" className="w-full bg-background/50 backdrop-blur border-border/50">
                                  Report Bug
                                </Button>
                              </CardContent>
                            </Card>
                          </div>
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
  )
}