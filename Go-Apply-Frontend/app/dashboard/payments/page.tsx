"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";

import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

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
  Calendar,
} from "lucide-react";

// Base API
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const paymentMethods = [
  { id: 1, type: "Credit Card" },
  { id: 2, type: "PayPal" },
  { id: 3, type: "Bank Account" },
];

type AnyObj = Record<string, any>;

type MergedForUI = {
  application: AnyObj;
  payment: AnyObj | null;
  uiStatus: "completed" | "pending" | "required";
  amount?: number;
  currency?: string;
  paymentMethod?: string;
  transactionId?: string;
  createdAt?: string | Date;
  [k: string]: any;
};

export default function PaymentsPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("all");

  const [applications, setApplications] = useState<AnyObj[]>([]);
  const [selectedAppId, setSelectedAppId] = useState<string>("");

  const [loadingApps, setLoadingApps] = useState<boolean>(false);
  const [loadingPayments, setLoadingPayments] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const [token, setToken] = useState<string | null>(null);

  const [payments, setPayments] = useState<AnyObj[]>([]);
  const [mergedData, setMergedData] = useState<MergedForUI[]>([]);

  const [refreshFlag, setRefreshFlag] = useState<number>(0);
  const [creatingOrder, setCreatingOrder] = useState<boolean>(false);

  const searchParams = useSearchParams();
  const paramAppId = searchParams.get("applicationId");

  // Load token from localStorage (client-side only)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem("authToken") || "";
    const cleaned = raw.replace(/^"|"$/g, "").trim();
    setToken(cleaned || null);
  }, []);

  // If applicationId present in query params, auto-select it
  useEffect(() => {
    if (paramAppId) setSelectedAppId(paramAppId);
  }, [paramAppId]);

  // Load Razorpay SDK script once
  useEffect(() => {
    if (typeof window === "undefined") return;

    const existing = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );
    if (existing) return;

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => console.log("Razorpay SDK Loaded");
    script.onerror = () => console.error("Razorpay SDK Failed to Load");

    return () => {
      const s = document.querySelector(
        'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
      );
      if (s) s.remove();
    };
  }, []);

  // Fetch applications and payments, normalize and merge for UI
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const load = async () => {
      setLoading(true);
      setLoadingApps(true);
      setLoadingPayments(true);

      try {
        const [appsRes, payRes] = await Promise.all([
          axios.get(`${API}/applications`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API}/payments/history`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const apps: AnyObj[] = appsRes?.data?.data?.applications || [];
        const pays: AnyObj[] = payRes?.data?.data?.payments || [];

        // Normalize applicationId in payments to simple string
        const normalizedPays = pays.map((p: AnyObj) => {
          const rawAppId = p.applicationId;
          let appIdStr = rawAppId;

          if (rawAppId && typeof rawAppId === "object") {
            // handle { _id: '...' } or { $oid: '...' } or mongoose doc
            appIdStr =
              rawAppId._id || rawAppId.$oid || rawAppId.toString() || "";
          }
          return { ...p, applicationId: String(appIdStr) };
        });

        // Build merged UI list: iterate all applications so each app appears
        const mergedUI: MergedForUI[] = apps.map((app) => {
          const appId = String(app._id);

          // prefer paid record
          const paid = normalizedPays.find(
            (p: AnyObj) =>
              String(p.applicationId) === appId &&
              (p.status === "paid" ||
                p.paymentStatus === "paid" ||
                p.status === "refunded")
          );

          // otherwise prefer pending/created
          const pending = normalizedPays.find(
            (p: AnyObj) =>
              String(p.applicationId) === appId &&
              p.status !== "paid" &&
              p.status !== "refunded" &&
              (p.status === "created" ||
                p.paymentStatus === "created" ||
                p.status === "pending")
          );

          let uiStatus: MergedForUI["uiStatus"] = "required";
          let selPayment: AnyObj | null = null;

          if (paid) {
            uiStatus = "completed";
            selPayment = paid;
          } else if (pending) {
            uiStatus = "pending";
            selPayment = pending;
          } else {
            uiStatus = "required";
            selPayment = null;
          }

          return {
            application: app,
            payment: selPayment,
            uiStatus,
            amount: selPayment
              ? selPayment.amount || selPayment.amountPaid
              : undefined,
            currency: selPayment ? selPayment.currency : undefined,
            paymentMethod:
              selPayment?.paymentMethod ||
              selPayment?.payment_method ||
              undefined,
            transactionId:
              selPayment?.razorpayOrderId ||
              selPayment?.transactionId ||
              selPayment?.orderId ||
              undefined,
            createdAt:
              selPayment?.createdAt ||
              selPayment?.paymentDate ||
              selPayment?.createdAt,
          };
        });

        setApplications(apps);
        setPayments(normalizedPays);
        setMergedData(mergedUI);
      } catch (err) {
        console.error("Payment load error:", err);
      } finally {
        setLoading(false);
        setLoadingApps(false);
        setLoadingPayments(false);
      }
    };

    load();
  }, [token, refreshFlag]);

  // Single unified startPayment function (uses backend for order + key)
  const startPayment = async (appId: string) => {
    if (!token) return alert("Login required!");

    const application = applications.find(
      (a) => String(a._id) === String(appId)
    );
    if (!application) return alert("Application not found!");

    // choose amount: prefer application.applicationFee else fallback
    const amount =
      application.programId?.applicationFee ||
      application.applicationFee ||
      100;

    try {
      setCreatingOrder(true);

      // create order on backend
      const res = await axios.post(
        `${API}/payments/create-order`,
        { amount, applicationId: appId, currency: "INR" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!res?.data?.success) {
        console.error("Create order response:", res?.data);
        return alert("Failed to create order");
      }

      const { order, key } = res.data.data;

      if (!(window as any).Razorpay) return alert("Razorpay SDK not ready!");

      const options = {
        key,
        amount: order.amount,
        currency: order.currency,
        name: "GoApply",
        description: "Application Fee",
        order_id: order.id,
        handler: async (response: any) => {
          try {
            const verify = await axios.post(
              `${API}/payments/verify`,
              {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            if (verify.data?.success) {
              alert("Payment Successful!");
              // refresh lists
              setRefreshFlag((f) => f + 1);
            } else {
              alert("Verification Failed");
            }
          } catch (err) {
            console.error("Verification error:", err);
            alert("Verification request failed");
          }
        },
        prefill: {
          name: application?.applicantName || "User",
          email: application?.applicantEmail || "user@email",
          contact: application?.applicantPhone || "9999999999",
        },
        theme: { color: "#2563eb" },
      };

      new (window as any).Razorpay(options).open();
    } catch (err) {
      console.error("Payment Error:", err);
      alert("Payment creation error");
    } finally {
      setCreatingOrder(false);
    }
  };

  // small derived stats
  const completedPaymentsCount = mergedData.filter(
    (m) => m.uiStatus === "completed"
  ).length;
  const pendingPaymentsCount = mergedData.filter(
    (m) => m.uiStatus === "pending"
  ).length;
  const totalSpent = mergedData
    .filter((m) => m.uiStatus === "completed")
    .reduce((s, m) => s + (Number(m.amount || 0) || 0), 0);

  // UI render loading fallback
  if (loading && !token) {
    // If not logged, show protected route wrapper will likely redirect - still keep small loader
    return (
      <ProtectedRoute>
        <p className="text-center py-10">Loading payments...</p>
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
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground">
                      Payments
                    </h1>
                    <p className="text-muted-foreground mt-1">
                      Manage your application fees and payments
                    </p>
                  </div>

                  {/* <div className="flex items-center gap-3">
                    <select
                      value={selectedAppId}
                      onChange={(e) => setSelectedAppId(e.target.value)}
                      className="border border-border rounded px-3 py-2 text-sm"
                      disabled={loadingApps}
                    >
                      <option value="">{loadingApps ? "Loading applications..." : "Select Application"}</option>

                      {applications.map((app) => (
                        <option key={app._id} value={app._id}>
                          {app.universityId?.name
                            ? `${app.universityId.name} (${app.universityId.country || "—"}) – ${app.programId?.name || "Unknown Program"}`
                            : `Application ${app._id}`}
                        </option>
                      ))}
                    </select>

                    <Button
                      className="bg-primary hover:bg-primary/90"
                      onClick={() => startPayment(selectedAppId)}
                      disabled={!selectedAppId || creatingOrder}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Pay Fee
                    </Button>
                  </div> */}
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
                        <p className="text-sm font-medium text-muted-foreground">
                          Total Spent
                        </p>
                        <p className="text-2xl font-bold text-foreground">
                          ${totalSpent.toFixed(0)}
                        </p>
                      </div>
                      <DollarSign className="h-8 w-8 text-primary" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 backdrop-blur border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Completed
                        </p>
                        <p className="text-2xl font-bold text-foreground">
                          {completedPaymentsCount}
                        </p>
                      </div>
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 backdrop-blur border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Pending
                        </p>
                        <p className="text-2xl font-bold text-foreground">
                          {pendingPaymentsCount}
                        </p>
                      </div>
                      <Clock className="h-8 w-8 text-yellow-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 backdrop-blur border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Payment Methods
                        </p>
                        <p className="text-2xl font-bold text-foreground">
                          {paymentMethods.length}
                        </p>
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
                      <CardDescription>
                        Manage your payment methods
                      </CardDescription>
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
                          <div className="flex items-center gap-3">
                            <CreditCard className="w-5 h-5 text-muted-foreground" />
                            <span className="font-medium text-foreground">
                              {method.type}
                            </span>
                          </div>
                        </motion.div>
                      ))}

                      <Button
                        variant="outline"
                        className="w-full bg-background/50 backdrop-blur border-border/50"
                        onClick={() => startPayment(selectedAppId)}
                      >
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
                      <CardDescription>
                        View all your payment transactions
                      </CardDescription>
                    </CardHeader>

                    <CardContent>
                      <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="grid w-full grid-cols-4">
                          <TabsTrigger value="all">All</TabsTrigger>
                          <TabsTrigger value="completed">Completed</TabsTrigger>
                          <TabsTrigger value="pending">Pending</TabsTrigger>
                          <TabsTrigger value="required">Required</TabsTrigger>
                        </TabsList>

                        <TabsContent
                          value={activeTab}
                          className="space-y-4 mt-6"
                        >
                          {loadingPayments ? (
                            <p className="text-center text-muted-foreground">
                              Loading payment history...
                            </p>
                          ) : mergedData.length === 0 ? (
                            <p className="text-center text-muted-foreground">
                              No payments found.
                            </p>
                          ) : (
                            mergedData
                              .filter((item) => {
                                if (activeTab === "all") return true;
                                return item.uiStatus === activeTab;
                              })
                              .map((item, index) => {
                                const app = item.application;
                                const isPaid = item.uiStatus === "completed";
                                const isPending = item.uiStatus === "pending";

                                const paymentStatusLabel = isPaid
                                  ? "Completed"
                                  : isPending
                                  ? "Pending"
                                  : "Required";

                                const statusColor = isPaid
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";

                                return (
                                  <motion.div
                                    key={app?._id || index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                      duration: 0.3,
                                      delay: 0.05 * index,
                                    }}
                                    className="border border-border/50 rounded-lg p-4 bg-background/50 backdrop-blur hover:bg-background/70 transition-colors"
                                  >
                                    <div className="flex items-start justify-between">
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                          <h3 className="font-semibold text-foreground">
                                            {item.description ||
                                              "Application Fee"}
                                          </h3>
                                          <Badge className={statusColor}>
                                            {paymentStatusLabel}
                                          </Badge>
                                        </div>

                                        <div className="space-y-1 text-sm text-muted-foreground mb-3">
                                          <div className="flex items-center gap-1">
                                            <University className="w-3 h-3" />
                                            {app?.programId?.name ||
                                              "Program not found"}
                                          </div>
                                          <div className="flex items-center gap-1">
                                            <MapPin className="w-3 h-3" />
                                            {app?.universityId?.name ||
                                              "Unknown University"}
                                            {app?.universityId?.country
                                              ? `, ${app.universityId.country}`
                                              : ""}
                                          </div>
                                          <div className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {item.createdAt
                                              ? new Date(
                                                  item.createdAt
                                                ).toLocaleDateString()
                                              : "—"}
                                          </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                          <div>
                                            <p className="text-muted-foreground">
                                              Amount
                                            </p>
                                            <p className="font-medium text-foreground">
                                              {item.amount
                                                ? item.amount 
                                                : app.programId
                                                    ?.applicationFee ||
                                                  "—"}{" "}
                                              {item.currency ?? "INR"}
                                            </p>
                                          </div>

                                          <div>
                                            <p className="text-muted-foreground">
                                              Payment Method
                                            </p>
                                            <p className="font-medium text-foreground">
                                              {item.paymentMethod || "—"}
                                            </p>
                                          </div>

                                          <div className="col-span-2">
                                            <p className="text-muted-foreground">
                                              Transaction ID
                                            </p>
                                            <p className="font-mono text-sm text-foreground">
                                              {item.transactionId ??
                                                item.razorpayOrderId ??
                                                "N/A"}
                                            </p>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="flex flex-col gap-2 ml-4">
                                        {isPaid ? (
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            className="bg-background/50 backdrop-blur border-border/50"
                                          >
                                            <Download className="w-4 h-4 mr-1" />
                                            Receipt
                                          </Button>
                                        ) : isPending ? (
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            className="text-primary border-primary hover:bg-primary/10"
                                            onClick={() =>
                                              startPayment(app._id)
                                            }
                                          >
                                            Pay Now
                                          </Button>
                                        ) : (
                                          <Button
                                            size="sm"
                                            onClick={() =>
                                              startPayment(app._id)
                                            }
                                          >
                                            Pay Now
                                          </Button>
                                        )}
                                      </div>
                                    </div>
                                  </motion.div>
                                );
                              })
                          )}
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
  );
}
