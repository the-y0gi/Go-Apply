"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Home,
  Search,
  BookOpen,
  FileText,
  MessageSquare,
  User,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Calendar,
  CreditCard
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { usePathname } from "next/navigation"

interface DashboardSidebarProps {
  collapsed: boolean
  onToggle: () => void
}

const menuItems = [
  { icon: Home, label: "Overview", href: "/dashboard" },
  { icon: Search, label: "Find Programs", href: "/dashboard/search" },
  { icon: BookOpen, label: "My Applications", href: "/dashboard/applications", badge: "3" },
  { icon: FileText, label: "Documents", href: "/dashboard/documents" },
  { icon: Calendar, label: "Deadlines", href: "/dashboard/deadlines" },
  { icon: MessageSquare, label: "Messages", href: "/dashboard/messages", badge: "2" },
  { icon: CreditCard, label: "Payments", href: "/dashboard/payments" },
  { icon: GraduationCap, label: "Mentorship", href: "/dashboard/mentorship" },
]

const bottomItems = [
  { icon: User, label: "Profile", href: "/dashboard/profile" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
  { icon: HelpCircle, label: "Help & Support", href: "/dashboard/help" },
]

export default function DashboardSidebar({ collapsed, onToggle }: DashboardSidebarProps) {
  const pathname = usePathname()
  return (
    <motion.aside
      animate={{ width: collapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="border-r border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50 flex flex-col overflow-visible relative z-50"
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border">
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            <div className="h-8 w-8 rounded-md bg-primary" />
            <span className="text-xl font-semibold text-foreground">GoApply</span>
          </motion.div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="text-muted-foreground hover:text-foreground"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-visible">
        {menuItems.map((item, index) => (
          <motion.div
            key={item.href}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link href={item.href}>
              <Button
                variant={pathname === item.href ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start h-12 relative group",
                  collapsed ? "px-3" : "px-4",
                  pathname === item.href && "bg-primary/10 text-primary hover:bg-primary/20"
                )}
                onClick={(e) => {
                  // Prevent sidebar from toggling when clicking navigation items
                  e.stopPropagation()
                }}
              >
                <item.icon className={cn("h-5 w-5", collapsed ? "mx-auto" : "mr-3")} />
                {!collapsed && (
                  <span className="flex-1 text-left">{item.label}</span>
                )}
                {!collapsed && item.badge && (
                  <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
                
                {/* Tooltip for collapsed state */}
                {collapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-sm rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-[999999] border border-border/50 backdrop-blur">
                    {item.label}
                    {item.badge && (
                      <span className="ml-2 bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </Button>
            </Link>
          </motion.div>
        ))}
      </nav>

      {/* Bottom Navigation */}
      <div className="p-4 space-y-2 border-t border-border overflow-visible">
        {bottomItems.map((item, index) => (
          <motion.div
            key={item.href}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: (menuItems.length + index) * 0.1 }}
          >
            <Link href={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start h-10 relative group",
                  collapsed ? "px-3" : "px-4"
                )}
                onClick={(e) => {
                  // Prevent sidebar from toggling when clicking navigation items
                  e.stopPropagation()
                }}
              >
                <item.icon className={cn("h-4 w-4", collapsed ? "mx-auto" : "mr-3")} />
                {!collapsed && (
                  <span className="flex-1 text-left text-sm">{item.label}</span>
                )}
                
                {/* Tooltip for collapsed state */}
                {collapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-sm rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-[999999] border border-border/50 backdrop-blur">
                    {item.label}
                  </div>
                )}
              </Button>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.aside>
  )
}