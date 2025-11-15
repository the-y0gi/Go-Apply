// "use client"

// import { motion } from "framer-motion"
// import { Button } from "@/components/ui/button"
// import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
// import { Bell, Search, LogOut, User, ChevronDown } from "lucide-react"
// import { Input } from "@/components/ui/input"
// import { useAuth } from "@/contexts/AuthContext"
// import { useRouter } from "next/navigation"
// import { useState, useEffect, useRef } from "react"
// import { cn } from "@/lib/utils"

// export default function DashboardHeader() {
//   const { user, signOut } = useAuth()
//   const router = useRouter()
//   const [profileMenuOpen, setProfileMenuOpen] = useState(false)
//   const profileMenuRef = useRef<HTMLDivElement>(null)

//   // Close menu when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
//         setProfileMenuOpen(false)
//       }
//     }

//     if (profileMenuOpen) {
//       document.addEventListener('mousedown', handleClickOutside)
//     }

//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside)
//     }
//   }, [profileMenuOpen])

//   const handleLogout = () => {
//     signOut()
//     router.push('/')
//   }

//   const getUserInitials = () => {
//     if (user?.firstName && user?.lastName) {
//       return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
//     }
//     return user?.email?.[0]?.toUpperCase() || 'U'
//   }

//   const getUserDisplayName = () => {
//     if (user?.firstName && user?.lastName) {
//       return `${user.firstName} ${user.lastName}`
//     }
//     return user?.email || 'User'
//   }
//   return (
//     <header className="h-16 border-b border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50 px-6 flex items-center justify-between relative z-50">
//       <div className="flex items-center gap-4">
//         <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
//       </div>

//       <div className="flex items-center gap-4">
//         {/* Search */}
//         {/* <div className="relative hidden md:block">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
//           <Input
//             type="text"
//             placeholder="Search programs, universities..."
//             className="pl-10 w-64 bg-background/50 backdrop-blur border-border/50"
//           />
//         </div> */}

//         {/* Notifications */}
//         <Button variant="ghost" size="icon" className="relative">
//           <Bell className="h-4 w-4" />
//           <span className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full"></span>
//         </Button>

//         {/* User Profile Menu */}
//         <div className="relative z-[999998]" ref={profileMenuRef}>
//           <Button 
//             variant="ghost" 
//             className="flex items-center gap-2 p-2 hover:bg-accent"
//             onClick={() => setProfileMenuOpen(!profileMenuOpen)}
//           >
//             <Avatar className="h-8 w-8">
//               <AvatarImage src="/placeholder-user.jpg" />
//               <AvatarFallback className="bg-primary text-primary-foreground">
//                 {getUserInitials()}
//               </AvatarFallback>
//             </Avatar>
//             <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform duration-300", profileMenuOpen && "rotate-180")} />
//           </Button>
          
//           {/* Profile menu with search-style animation */}
//           <div className={cn(
//             "absolute top-full right-0 mt-2 w-64 bg-card border border-border rounded-lg shadow-lg transition-all duration-300 origin-top-right z-[999999]",
//             profileMenuOpen 
//               ? "opacity-100 scale-100 pointer-events-auto" 
//               : "opacity-0 scale-95 pointer-events-none"
//           )}>
//             <div className="p-4 border-b border-border">
//               <div className="flex flex-col space-y-1">
//                 <p className="text-sm font-medium leading-none">{getUserDisplayName()}</p>
//                 <p className="text-xs leading-none text-muted-foreground">
//                   {user?.email}
//                 </p>
//               </div>
//             </div>
//             <div className="p-2">
//               <Button 
//                 variant="ghost" 
//                 className="w-full justify-start" 
//                 onClick={() => {
//                   router.push('/dashboard/profile')
//                   setProfileMenuOpen(false)
//                 }}
//               >
//                 <User className="mr-2 h-4 w-4" />
//                 <span>Profile</span>
//               </Button>
//               <div className="border-t border-border my-2" />
//               <Button 
//                 variant="ghost" 
//                 className="w-full justify-start text-destructive hover:text-destructive" 
//                 onClick={() => {
//                   handleLogout()
//                   setProfileMenuOpen(false)
//                 }}
//               >
//                 <LogOut className="mr-2 h-4 w-4" />
//                 <span>Log out</span>
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </header>
//   )
// }


"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";
import {
  Bell,
  Search,
  LogOut,
  User,
  ChevronDown,
  CheckCircle,
  FileText,
  DollarSign,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import axios from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";


interface NotificationType {
  _id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  relatedId?: string;
}

interface NotificationsApiResponse {
  data: {
    notifications: NotificationType[];
    unreadCount: number;
  };
}


export default function DashboardHeader() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const [profileMenuOpen, setProfileMenuOpen] = useState<boolean>(false);
  const [notificationMenuOpen, setNotificationMenuOpen] =
    useState<boolean>(false);

  const profileMenuRef = useRef<HTMLDivElement | null>(null);
  const notificationMenuRef = useRef<HTMLDivElement | null>(null);

  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);


  const fetchNotifications = async (): Promise<void> => {
    try {
      setLoading(true);
      const token = localStorage
        .getItem("authToken")
        ?.replace(/^"|"$/g, "")
        .trim();

      const response = await axios.get<NotificationsApiResponse>(
        `${API_URL}/notifications`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setNotifications(response.data.data.notifications);
      setUnreadCount(response.data.data.unreadCount);
    } catch (error) {
       console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };


  const markAllAsRead = async (): Promise<void> => {
    try {
      const token = localStorage
        .getItem("authToken")
        ?.replace(/^"|"$/g, "")
        .trim();

      await axios.post(
        `${API_URL}/notifications/mark-all-read`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUnreadCount(0);
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true }))
      );
    } catch (error) {
       console.error("Error marking notifications as read:", error);
    }
  };


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setProfileMenuOpen(false);
      }
      if (
        notificationMenuRef.current &&
        !notificationMenuRef.current.contains(event.target as Node)
      ) {
        setNotificationMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
  const handleRefreshNotifications = () => {
    fetchNotifications()
  }

  window.addEventListener('refreshNotifications', handleRefreshNotifications)
  
  return () => {
    window.removeEventListener('refreshNotifications', handleRefreshNotifications)
  }
}, [])


  useEffect(() => {
    fetchNotifications();
  }, []);


  const handleLogout = (): void => {
    signOut();
    router.push("/");
  };

  const handleNotificationClick = (): void => {
    setNotificationMenuOpen(!notificationMenuOpen);
    if (!notificationMenuOpen && unreadCount > 0) {
      markAllAsRead();
    }
  };

  const getUserInitials = (): string => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    return user?.email?.[0]?.toUpperCase() ?? "U";
  };

  const getUserDisplayName = (): string => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user?.email ?? "User";
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "welcome":
        return <User className="h-4 w-4 text-blue-500" />;
      case "profile":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "application":
        return <FileText className="h-4 w-4 text-orange-500" />;
      case "payment":
        return <DollarSign className="h-4 w-4 text-green-500" />;
      case "status":
        return <Bell className="h-4 w-4 text-purple-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };


  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur px-6 flex items-center justify-between relative z-50">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative" ref={notificationMenuRef}>
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={handleNotificationClick}
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Button>

          {/* Notifications Dropdown */}
          <div
            className={cn(
              "absolute top-full right-0 mt-2 w-80 bg-card border border-border rounded-lg shadow-lg transition-all duration-300 origin-top-right z-[999999] max-h-96 overflow-hidden",
              notificationMenuOpen
                ? "opacity-100 scale-100 pointer-events-auto"
                : "opacity-0 scale-95 pointer-events-none"
            )}
          >
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Notifications</h3>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-primary"
                  onClick={markAllAsRead}
                >
                  Mark all read
                </Button>
              )}
            </div>

            <div className="overflow-y-auto max-h-64">
              {loading ? (
                <div className="p-4 text-center text-muted-foreground">
                  Loading notifications...
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  No notifications yet
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {notifications.map((notification) => (
                    <div
                      key={notification._id}
                      className={cn(
                        "p-4 hover:bg-accent/50 transition-colors cursor-pointer",
                        !notification.isRead &&
                          "bg-blue-50 dark:bg-blue-950/20"
                      )}
                      onClick={() => {
                        if (notification.relatedId) {
                          router.push("/dashboard/applications");
                        }
                        setNotificationMenuOpen(false);
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">
                            {notification.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {new Date(notification.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </p>
                        </div>

                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Profile Menu */}
        <div className="relative z-[999998]" ref={profileMenuRef}>
          <Button
            variant="ghost"
            className="flex items-center gap-2 p-2"
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder-user.jpg" />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>

            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform duration-300",
                profileMenuOpen && "rotate-180"
              )}
            />
          </Button>

          <div
            className={cn(
              "absolute top-full right-0 mt-2 w-64 bg-card border border-border rounded-lg shadow-lg transition-all duration-300 origin-top-right z-[999999]",
              profileMenuOpen
                ? "opacity-100 scale-100 pointer-events-auto"
                : "opacity-0 scale-95 pointer-events-none"
            )}
          >
            <div className="p-4 border-b border-border">
              <p className="text-sm font-medium">{getUserDisplayName()}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>

            <div className="p-2">
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  router.push("/dashboard/profile");
                  setProfileMenuOpen(false);
                }}
              >
                <User className="h-4 w-4 mr-2" /> Profile
              </Button>

              <div className="my-2 border-t border-border" />

              <Button
                variant="ghost"
                className="w-full justify-start text-destructive"
                onClick={() => {
                  handleLogout();
                  setProfileMenuOpen(false);
                }}
              >
                <LogOut className="h-4 w-4 mr-2" /> Log out
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
