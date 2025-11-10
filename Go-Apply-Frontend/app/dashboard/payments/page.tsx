"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  CreditCard, 
  DollarSign, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Receipt,
  Download,
  Plus,
  MapPin,
  University,
  Calendar
} from "lucide-react"
import DashboardSidebar from "@/components/dashboard/DashboardSidebar"
import DashboardHeader from "@/components/dashboard/DashboardHeader"
import ProtectedRoute from "@/components/auth/ProtectedRoute"

const payments = [
  {
    id: 1,
    university: "University of Toronto",
    program: "Master of Science in Computer Science",
    country: "Canada",
    type: "Application Fee",
    amount: 125,
    currency: "CAD",
    status: "Completed",
    statusColor: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    paymentDate: "Nov 15, 2024",
    paymentMethod: "Credit Card ****4567",
    transactionId: "TXN-CAD-001",
    receipt: true
  },
  {
    id: 2,
    university: "University of Melbourne",
    program: "Master of Data Science",
    country: "Australia",
    type: "Application Fee",
    amount: 100,
    currency: "AUD",
    status: "Completed",
    statusColor: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    paymentDate: "Oct 20, 2024",
    paymentMethod: "PayPal",
    transactionId: "TXN-AUD-002",
    receipt: true
  },
  {
    id: 3,
    university: "ETH Zurich",
    program: "Master in Computer Science",
    country: "Switzerland",
    type: "Application Fee",
    amount: 150,
    currency: "EUR",
    status: "Completed",
    statusColor: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    paymentDate: "Sep 10, 2024",
    paymentMethod: "Bank Transfer",
    transactionId: "TXN-EUR-003",
    receipt: true
  },
  {
    id: 4,
    university: "Imperial College London",
    program: "MSc Artificial Intelligence",
    country: "United Kingdom",
    type: "Application Fee",
    amount: 75,
    currency: "GBP",
    status: "Pending",
    statusColor: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    paymentDate: "Pending",
    paymentMethod: "Not selected",
    transactionId: "N/A",
    receipt: false
  },
  {
    id: 5,
    university: "University of Toronto",
    program: "Master of Science in Computer Science",
    country: "Canada",
    type: "Deposit Fee",
    amount: 500,
    currency: "CAD",
    status: "Required",
    statusColor: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    paymentDate: "Due: Jan 15, 2025",
    paymentMethod: "Not selected",
    transactionId: "N/A",
    receipt: false
  },
  {
    id: 6,
    university: "GoApply",
    program: "Platform Services",
    country: "Global",
    type: "Service Fee",
    amount: 49,
    currency: "USD",
    status: "Completed",
    statusColor: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    paymentDate: "Aug 15, 2024",
    paymentMethod: "Credit Card ****4567",
    transactionId: "TXN-USD-006",
    receipt: true
  }
]

const paymentMethods = [
  {
    id: 1,
    type: "Credit Card",
    last4: "4567",
    brand: "Visa",
    expiry: "12/26",
    isDefault: true
  },
  {
    id: 2,
    type: "PayPal",
    email: "john.doe@email.com",
    isDefault: false
  },
  {
    id: 3,
    type: "Bank Account",
    last4: "8901",
    bank: "Chase Bank",
    isDefault: false
  }
]

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Completed":
      return <CheckCircle className="w-4 h-4 text-green-600" />
    case "Pending":
      return <Clock className="w-4 h-4 text-yellow-600" />
    case "Required":
      return <AlertCircle className="w-4 h-4 text-blue-600" />
    case "Failed":
      return <AlertCircle className="w-4 h-4 text-red-600" />
    default:
      return <AlertCircle className="w-4 h-4 text-gray-600" />
  }
}

export default function PaymentsPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeTab, setActiveTab] = useState("all")

  const filterPayments = (status: string) => {
    if (status === "all") return payments
    return payments.filter(payment => payment.status.toLowerCase() === status)
  }

  const totalSpent = payments
    .filter(p => p.status === "Completed")
    .reduce((sum, p) => sum + (p.currency === "USD" ? p.amount : p.amount * 0.75), 0) // Simple USD conversion

  const pendingPayments = payments.filter(p => p.status === "Pending" || p.status === "Required").length
  const completedPayments = payments.filter(p => p.status === "Completed").length

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
                    <h1 className="text-3xl font-bold text-foreground">Payments</h1>
                    <p className="text-muted-foreground mt-1">Manage your application fees and payments</p>
                  </div>
                  <Button className="bg-primary hover:bg-primary/90">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Payment Method
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
                <Card className="bg-card/50 backdrop-blur border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Spent</p>
                        <p className="text-2xl font-bold text-foreground">${totalSpent.toFixed(0)}</p>
                      </div>
                      <DollarSign className="h-8 w-8 text-primary" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 backdrop-blur border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Completed</p>
                        <p className="text-2xl font-bold text-foreground">{completedPayments}</p>
                      </div>
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 backdrop-blur border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Pending</p>
                        <p className="text-2xl font-bold text-foreground">{pendingPayments}</p>
                      </div>
                      <Clock className="h-8 w-8 text-yellow-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 backdrop-blur border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Payment Methods</p>
                        <p className="text-2xl font-bold text-foreground">{paymentMethods.length}</p>
                      </div>
                      <CreditCard className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Payment Methods */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="lg:col-span-1"
                >
                  <Card className="bg-card/50 backdrop-blur border-border/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CreditCard className="w-5 h-5" />
                        Payment Methods
                      </CardTitle>
                      <CardDescription>Manage your payment methods</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {paymentMethods.map((method, index) => (
                        <motion.div
                          key={method.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: 0.1 * index }}
                          className="p-4 border border-border/50 rounded-lg bg-background/50 backdrop-blur"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <CreditCard className="w-4 h-4 text-muted-foreground" />
                              <span className="font-medium text-foreground">{method.type}</span>
                            </div>
                            {method.isDefault && (
                              <Badge className="bg-primary/10 text-primary border-primary/20">
                                Default
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {method.type === "Credit Card" && (
                              <>
                                <p>{method.brand} •••• {method.last4}</p>
                                <p>Expires {method.expiry}</p>
                              </>
                            )}
                            {method.type === "PayPal" && (
                              <p>{method.email}</p>
                            )}
                            {method.type === "Bank Account" && (
                              <>
                                <p>{method.bank}</p>
                                <p>•••• {method.last4}</p>
                              </>
                            )}
                          </div>
                        </motion.div>
                      ))}
                      
                      <Button variant="outline" className="w-full bg-background/50 backdrop-blur border-border/50">
                        <Plus className="w-4 h-4 mr-2" />
                        Add New Method
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Payment History */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="lg:col-span-2"
                >
                  <Card className="bg-card/50 backdrop-blur border-border/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Receipt className="w-5 h-5" />
                        Payment History
                      </CardTitle>
                      <CardDescription>View all your payment transactions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="grid w-full grid-cols-4">
                          <TabsTrigger value="all">All</TabsTrigger>
                          <TabsTrigger value="completed">Completed</TabsTrigger>
                          <TabsTrigger value="pending">Pending</TabsTrigger>
                          <TabsTrigger value="required">Required</TabsTrigger>
                        </TabsList>

                        <TabsContent value={activeTab} className="space-y-4 mt-6">
                          {filterPayments(activeTab).map((payment, index) => (
                            <motion.div
                              key={payment.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: 0.1 * index }}
                              className="border border-border/50 rounded-lg p-4 bg-background/50 backdrop-blur hover:bg-background/70 transition-colors"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h3 className="font-semibold text-foreground">{payment.type}</h3>
                                    <div className="flex items-center gap-1">
                                      {getStatusIcon(payment.status)}
                                      <Badge className={payment.statusColor}>
                                        {payment.status}
                                      </Badge>
                                    </div>
                                  </div>
                                  
                                  <div className="space-y-1 text-sm text-muted-foreground mb-3">
                                    <div className="flex items-center gap-1">
                                      <University className="w-3 h-3" />
                                      {payment.program}
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <MapPin className="w-3 h-3" />
                                      {payment.university}, {payment.country}
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Calendar className="w-3 h-3" />
                                      {payment.paymentDate}
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <p className="text-muted-foreground">Amount</p>
                                      <p className="font-semibold text-foreground">
                                        {payment.amount} {payment.currency}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-muted-foreground">Payment Method</p>
                                      <p className="font-medium text-foreground">{payment.paymentMethod}</p>
                                    </div>
                                    {payment.transactionId !== "N/A" && (
                                      <div className="col-span-2">
                                        <p className="text-muted-foreground">Transaction ID</p>
                                        <p className="font-mono text-sm text-foreground">{payment.transactionId}</p>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <div className="flex flex-col gap-2 ml-4">
                                  {payment.status === "Pending" || payment.status === "Required" ? (
                                    <Button size="sm" className="bg-primary hover:bg-primary/90">
                                      Pay Now
                                    </Button>
                                  ) : (
                                    payment.receipt && (
                                      <Button variant="outline" size="sm" className="bg-background/50 backdrop-blur border-border/50">
                                        <Download className="w-4 h-4 mr-1" />
                                        Receipt
                                      </Button>
                                    )
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}