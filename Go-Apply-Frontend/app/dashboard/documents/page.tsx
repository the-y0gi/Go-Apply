"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
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
import {
  FileText,
  Upload,
  Eye,
  Download,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  FileImage,
  X,
} from "lucide-react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

//Required Docs
const REQUIRED_DOCS = [
  {
    type: "transcript",
    name: "Academic Transcripts",
    description: "Official transcripts from all attended institutions",
  },
  {
    type: "sop",
    name: "Statement of Purpose",
    description: "Personal statement explaining your academic goals",
  },
  {
    type: "lor",
    name: "Letters of Recommendation",
    description: "2-3 letters from academic or professional references",
  },
  {
    type: "resume",
    name: "Resume / CV",
    description: "Updated resume highlighting relevant experience",
  },
  {
    type: "english_test",
    name: "English Proficiency Test",
    description: "IELTS, TOEFL, or other accepted English tests",
  },
  {
    type: "passport",
    name: "Passport Copy",
    description: "Valid passport for international applications",
  },
  {
    type: "financial_documents",
    name: "Financial Documents",
    description: "Proof of funds or bank statements",
  },
  {
    type: "other",
    name: "Other Documents",
    description: "Any additional or optional supporting document",
  },
];

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function DocumentsPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [selectedType, setSelectedType] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get JWT Token 
  const getToken = () => {
    const raw =
      localStorage.getItem("authToken") || localStorage.getItem("token") || "";
    return raw.replace(/^"|"$/g, "").trim();
  };

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const res = await axios.get(`${API_URL}/documents`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDocuments(res.data.data.documents || []);
    } catch (err) {
      toast.error("Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleFileSelect = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setShowTypeModal(true);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !selectedType) {
      toast.error("Please select file and document type");
      return;
    }

    const formData = new FormData();
    formData.append("document", selectedFile);
    formData.append("type", selectedType);

    try {
      setUploading(true);
      const token = getToken();
      await axios.post(`${API_URL}/documents/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Document uploaded successfully");
      setShowTypeModal(false);
      setSelectedFile(null);
      setSelectedType("");
      fetchDocuments();
    } catch (err: any) {
      console.error("Upload error:", err);
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this document?")) return;
    try {
      const token = getToken();
      await axios.delete(`${API_URL}/documents/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Document deleted");
      setDocuments((prev) => prev.filter((d) => d._id !== id));
    } catch {
      toast.error("Failed to delete");
    }
  };

  const getFileIcon = (mime: string) => {
    if (mime.includes("pdf"))
      return <FileText className="w-5 h-5 text-red-500" />;
    if (mime.includes("image"))
      return <FileImage className="w-5 h-5 text-blue-500" />;
    return <FileText className="w-5 h-5 text-gray-500" />;
  };

  const missingDocs = REQUIRED_DOCS.filter(
    (doc) => !documents.some((d) => d.type === doc.type)
  );

  const getDocStatus = (type: string) =>
    documents.some((doc) => doc.type === type) ? "completed" : "missing";

  return (
    <ProtectedRoute>
      <Toaster position="top-right" />
      <div className="flex h-screen">
        <DashboardSidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <DashboardHeader />
          <main className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-between"
            >
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Documents
                </h1>
                <p className="text-muted-foreground mt-1">
                  Manage your application documents and requirements
                </p>
              </div>
              <div>
                <Button
                  className="bg-primary hover:bg-primary/90"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" /> Upload Document
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                />
              </div>
            </motion.div>

            {/*  Document Requirements Section */}
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Document Requirements
                </CardTitle>
                <CardDescription>
                  Track your document completion status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {REQUIRED_DOCS.map((doc, idx) => {
                    const status = getDocStatus(doc.type);
                    return (
                      <motion.div
                        key={doc.type}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.05 * idx }}
                        className="p-4 border border-border/50 rounded-lg bg-background/50 backdrop-blur"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium text-foreground text-sm">
                            {doc.name}
                          </h4>
                          {status === "completed" ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-red-600" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {doc.description}
                        </p>
                        <Badge
                          className={`mt-2 text-xs ${
                            status === "completed"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                          }`}
                        >
                          {status === "completed" ? "Completed" : "Missing"}
                        </Badge>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/*Uploaded Document Library*/}

            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardHeader>
                <CardTitle>Your Uploaded Documents</CardTitle>
                <CardDescription>
                  View, download, or delete uploaded files
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p>Loading documents...</p>
                ) : documents.length === 0 ? (
                  <p className="text-muted-foreground">
                    No documents uploaded yet.
                  </p>
                ) : (
                  documents.map((doc, idx) => (
                    <motion.div
                      key={doc._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      className="flex items-center justify-between p-4 mb-2 border border-border/50 rounded-lg bg-background/50 hover:bg-background/70 transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        {getFileIcon(doc.mimeType || "")}
                        <div>
                          <p className="font-medium">{doc.originalName}</p>
                          <p className="text-sm text-muted-foreground">
                            Type: {doc.type.toUpperCase()} |{" "}
                            {(doc.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* <Badge
                          className={`text-xs ${
                            doc.status === "verified"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {doc.status === "verified" ? "Verified" : "Pending"}
                        </Badge> */}

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(doc.url, "_blank")}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const link = document.createElement("a");
                            link.href = doc.url;
                            link.download = doc.originalName || "document";
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          }}
                        >
                          <Download className="w-4 h-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDelete(doc._id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))
                )}
              </CardContent>
            </Card>
          </main>
        </div>
      </div>

      {/* Upload Modal */}
      {showTypeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-neutral-900 p-6 rounded-lg shadow-xl w-[90%] max-w-md relative">
            <button
              onClick={() => setShowTypeModal(false)}
              className="absolute right-3 top-3 text-gray-500 hover:text-gray-800"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-semibold mb-2">Select Document Type</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Choose what kind of document you are uploading.
            </p>
            <select
              className="w-full border rounded-md p-2 bg-background"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="">Select type</option>
              {missingDocs.map((doc) => (
                <option key={doc.type} value={doc.type}>
                  {doc.name}
                </option>
              ))}
            </select>

            <div className="flex justify-end mt-4 gap-2">
              <Button variant="outline" onClick={() => setShowTypeModal(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleUpload}
                disabled={uploading}
                className="bg-primary hover:bg-primary/90"
              >
                {uploading ? "Uploading..." : "Upload"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}
