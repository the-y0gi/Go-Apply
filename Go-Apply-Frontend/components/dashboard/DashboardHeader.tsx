"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Bell, Search, LogOut, User, ChevronDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

export default function DashboardHeader() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const profileMenuRef = useRef<HTMLDivElement>(null)

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false)
      }
    }

    if (profileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [profileMenuOpen])

  const handleLogout = () => {
    signOut()
    router.push('/')
  }

  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    }
    return user?.email?.[0]?.toUpperCase() || 'U'
  }

  const getUserDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`
    }
    return user?.email || 'User'
  }
  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50 px-6 flex items-center justify-between relative z-50">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Search programs, universities..."
            className="pl-10 w-64 bg-background/50 backdrop-blur border-border/50"
          />
        </div>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full"></span>
        </Button>

        {/* User Profile Menu */}
        <div className="relative z-[999998]" ref={profileMenuRef}>
          <Button 
            variant="ghost" 
            className="flex items-center gap-2 p-2 hover:bg-accent"
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder-user.jpg" />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform duration-300", profileMenuOpen && "rotate-180")} />
          </Button>
          
          {/* Profile menu with search-style animation */}
          <div className={cn(
            "absolute top-full right-0 mt-2 w-64 bg-card border border-border rounded-lg shadow-lg transition-all duration-300 origin-top-right z-[999999]",
            profileMenuOpen 
              ? "opacity-100 scale-100 pointer-events-auto" 
              : "opacity-0 scale-95 pointer-events-none"
          )}>
            <div className="p-4 border-b border-border">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{getUserDisplayName()}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </div>
            <div className="p-2">
              <Button 
                variant="ghost" 
                className="w-full justify-start" 
                onClick={() => {
                  router.push('/dashboard/profile')
                  setProfileMenuOpen(false)
                }}
              >
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Button>
              <div className="border-t border-border my-2" />
              <Button 
                variant="ghost" 
                className="w-full justify-start text-destructive hover:text-destructive" 
                onClick={() => {
                  handleLogout()
                  setProfileMenuOpen(false)
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}