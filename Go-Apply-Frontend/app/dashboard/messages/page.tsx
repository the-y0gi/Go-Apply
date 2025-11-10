"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  MessageCircle, 
  Send, 
  Search, 
  Plus, 
  Paperclip,
  Phone,
  Video,
  MoreVertical,
  University,
  Users,
  Mail
} from "lucide-react"
import DashboardSidebar from "@/components/dashboard/DashboardSidebar"
import DashboardHeader from "@/components/dashboard/DashboardHeader"
import ProtectedRoute from "@/components/auth/ProtectedRoute"

const conversations = [
  {
    id: 1,
    name: "Dr. Sarah Chen",
    role: "Admissions Officer",
    university: "University of Toronto",
    avatar: "/placeholder-user.jpg",
    lastMessage: "Thank you for your application. We'll review it and get back to you within 2 weeks.",
    timestamp: "2:30 PM",
    unread: 0,
    online: true,
    type: "university"
  },
  {
    id: 2,
    name: "Prof. Michael Johnson",
    role: "Research Supervisor",
    university: "ETH Zurich",
    avatar: "/placeholder-user.jpg",
    lastMessage: "I'd like to discuss your research interests. Are you available for a call this week?",
    timestamp: "Yesterday",
    unread: 2,
    online: false,
    type: "university"
  },
  {
    id: 3,
    name: "Application Support",
    role: "Support Team",
    university: "University of Melbourne",
    avatar: "/placeholder-user.jpg",
    lastMessage: "Your document has been successfully uploaded and is under review.",
    timestamp: "Yesterday",
    unread: 0,
    online: true,
    type: "support"
  },
  {
    id: 4,
    name: "Emma Rodriguez",
    role: "Current Student",
    university: "Imperial College London",
    avatar: "/placeholder-user.jpg",
    lastMessage: "Happy to help with any questions about the program! The coursework is challenging but rewarding.",
    timestamp: "2 days ago",
    unread: 1,
    online: false,
    type: "student"
  },
  {
    id: 5,
    name: "GoApply Mentor",
    role: "Application Mentor",
    university: "GoApply",
    avatar: "/placeholder-user.jpg",
    lastMessage: "Great work on your SOP! I've added some suggestions for improvement.",
    timestamp: "3 days ago",
    unread: 0,
    online: true,
    type: "mentor"
  }
]

const messages = [
  {
    id: 1,
    senderId: 2,
    content: "Hi! I saw your research proposal on machine learning applications in healthcare. Very interesting work!",
    timestamp: "10:30 AM",
    type: "text"
  },
  {
    id: 2,
    senderId: "me",
    content: "Thank you, Professor Johnson! I'm really passionate about this field and would love to contribute to your research group.",
    timestamp: "10:35 AM",
    type: "text"
  },
  {
    id: 3,
    senderId: 2,
    content: "That's great to hear. I'd like to discuss your research interests in more detail. Are you available for a video call this week?",
    timestamp: "10:40 AM",
    type: "text"
  },
  {
    id: 4,
    senderId: "me",
    content: "Absolutely! I'm available Tuesday and Thursday afternoons. What time works best for you?",
    timestamp: "10:42 AM",
    type: "text"
  },
  {
    id: 5,
    senderId: 2,
    content: "Thursday at 2 PM works perfectly. I'll send you a calendar invite with the meeting link.",
    timestamp: "11:15 AM",
    type: "text"
  }
]

export default function MessagesPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [selectedConversation, setSelectedConversation] = useState(conversations[1])
  const [newMessage, setNewMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.university.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.role.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // In a real app, this would send the message to the server
      console.log("Sending message:", newMessage)
      setNewMessage("")
    }
  }

  const totalUnread = conversations.reduce((sum, conv) => sum + conv.unread, 0)

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "university":
        return <University className="w-4 h-4" />
      case "student":
        return <Users className="w-4 h-4" />
      case "mentor":
        return <MessageCircle className="w-4 h-4" />
      default:
        return <Mail className="w-4 h-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "university":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "student":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "mentor":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
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
          <main className="flex-1 overflow-hidden p-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="h-full"
            >
              <Card className="h-full bg-card/50 backdrop-blur border-border/50">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <MessageCircle className="w-5 h-5" />
                        Messages
                        {totalUnread > 0 && (
                          <Badge className="bg-red-500 text-white">
                            {totalUnread}
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription>Chat with universities, mentors, and students</CardDescription>
                    </div>
                    <Button size="sm" className="bg-primary hover:bg-primary/90">
                      <Plus className="w-4 h-4 mr-2" />
                      New Chat
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent className="flex-1 flex gap-6 overflow-hidden p-6 pt-0">
                  {/* Conversations List */}
                  <div className="w-80 flex flex-col bg-background/50 backdrop-blur rounded-lg border border-border/50">
                    <div className="p-4 border-b border-border/50">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          placeholder="Search conversations..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 bg-background/50 backdrop-blur border-border/50"
                        />
                      </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto">
                      {filteredConversations.map((conversation, index) => (
                        <motion.div
                          key={conversation.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.1 * index }}
                          className={`p-4 border-b border-border/50 cursor-pointer hover:bg-background/70 transition-colors ${
                            selectedConversation.id === conversation.id ? "bg-background/70" : ""
                          }`}
                          onClick={() => setSelectedConversation(conversation)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <Avatar className="w-10 h-10">
                                <AvatarImage src={conversation.avatar} alt={conversation.name} />
                                <AvatarFallback>
                                  {conversation.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              {conversation.online && (
                                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                              )}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium text-foreground truncate">{conversation.name}</h4>
                                <span className="text-xs text-muted-foreground">{conversation.timestamp}</span>
                              </div>
                              
                              <div className="flex items-center gap-1 mt-1">
                                {getTypeIcon(conversation.type)}
                                <p className="text-xs text-muted-foreground truncate">{conversation.role}</p>
                              </div>
                              
                              <p className="text-sm text-muted-foreground truncate mt-1">
                                {conversation.lastMessage}
                              </p>
                              
                              <div className="flex items-center justify-between mt-2">
                                <Badge className={getTypeColor(conversation.type)} variant="secondary">
                                  {conversation.university}
                                </Badge>
                                {conversation.unread > 0 && (
                                  <Badge className="bg-red-500 text-white">
                                    {conversation.unread}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Chat Area */}
                  <div className="flex-1 flex flex-col bg-background/50 backdrop-blur rounded-lg border border-border/50">
                    {/* Chat Header */}
                    <div className="p-4 border-b border-border/50 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={selectedConversation.avatar} alt={selectedConversation.name} />
                            <AvatarFallback>
                              {selectedConversation.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          {selectedConversation.online && (
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{selectedConversation.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {selectedConversation.role} • {selectedConversation.university}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Phone className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Video className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {messages.map((message, index) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.1 * index }}
                          className={`flex ${message.senderId === "me" ? "justify-end" : "justify-start"}`}
                        >
                          <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.senderId === "me"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}>
                            <p className="text-sm">{message.content}</p>
                            <p className={`text-xs mt-1 ${
                              message.senderId === "me" 
                                ? "text-primary-foreground/70" 
                                : "text-muted-foreground"
                            }`}>
                              {message.timestamp}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Message Input */}
                    <div className="p-4 border-t border-border/50">
                      <div className="flex items-end gap-2">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Paperclip className="w-4 h-4" />
                        </Button>
                        <Textarea
                          placeholder="Type your message..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          className="min-h-[80px] bg-background/50 backdrop-blur border-border/50 resize-none"
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault()
                              handleSendMessage()
                            }
                          }}
                        />
                        <Button 
                          onClick={handleSendMessage}
                          disabled={!newMessage.trim()}
                          className="bg-primary hover:bg-primary/90"
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}