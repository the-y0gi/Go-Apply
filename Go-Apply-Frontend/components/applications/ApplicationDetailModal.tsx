//working code before using gpt
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Calendar, DollarSign, BookOpen } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Props {
  application: any;
  onClose: () => void;
  onUpdate: (updatedApp: any) => void;
}

interface DocumentsData {
  uploaded: { type: string; url?: string }[];
  required: string[];
  missing: string[];
}

export default function ApplicationDetailModal({
  application,
  onClose,
  onUpdate,
}: Props) {
  const [program, setProgram] = useState<any>(null);
  const [docs, setDocs] = useState<DocumentsData>({
    uploaded: [],
    required: [],
    missing: [],
  });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  //Fetch program details + user's uploaded documents
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authToken")?.replace(/^"|"$/g, "");
        if (!token) return;

        // Program ID safely get karo
        const programId =
          typeof application.programId === "object"
            ? application.programId._id
            : application.programId;

        const [programRes, docRes] = await Promise.all([
          axios.get(`${API_URL}/applications/program/${programId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_URL}/documents`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const programData = programRes.data?.data?.program;
        const uploadedDocs = docRes.data?.data?.documents || [];

        const requiredDocs = programData?.requirements?.documentsRequired || [];
        const uploadedTypes = uploadedDocs.map((d: any) => d.type);
        const missingDocs = requiredDocs.filter(
          (doc: string) => !uploadedTypes.includes(doc)
        );

        setProgram(programData);
        setDocs({
          uploaded: uploadedDocs.filter((d: any) =>
            uploadedTypes.includes(d.type)
          ),
          required: requiredDocs,
          missing: missingDocs,
        });
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [application]);

  //Auto progress update when all docs uploaded
  // useEffect(() => {
  //   const updateProgressIfAllDocsUploaded = async () => {
  //     if (docs.missing.length === 0) {
  //       try {
  //         const token = localStorage
  //           .getItem("authToken")
  //           ?.replace(/^"|"$/g, "");
  //         const res = await axios.patch(
  //           `${API_URL}/applications/${application._id}/update-progress`,
  //           { progress: { ...application.progress, documents: true } },
  //           { headers: { Authorization: `Bearer ${token}` } }
  //         );
  //         onUpdate(res.data.data.application);
  //       } catch (err) {
  //         console.error("Progress update failed:", err);
  //       }
  //     }
  //   };

  //   updateProgressIfAllDocsUploaded();
  // }, [docs.missing.length]);

  useEffect(() => {
    const updateProgressIfAllDocsUploaded = async () => {
      const allRequiredDocsUploaded =
        docs.required.length > 0 &&
        docs.uploaded.length >= docs.required.length;

      if (allRequiredDocsUploaded && !application.progress?.documents) {
        try {
          const token = localStorage
            .getItem("authToken")
            ?.replace(/^"|"$/g, "");
          const res = await axios.patch(
            `${API_URL}/applications/${application._id}/update-progress`,
            { progress: { ...application.progress, documents: true } },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          onUpdate(res.data.data.application);

          toast({
            title: "All Documents Uploaded",
            description:
              "All required documents have been uploaded successfully!",
          });
        } catch (err) {
          console.error("Progress update failed:", err);
        }
      }
    };

    updateProgressIfAllDocsUploaded();
  }, [
    docs.uploaded.length,
    docs.required.length,
    application.progress?.documents,
  ]);

  // Upload missing document
  const handleUploadDocument = async (type: string) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "*/*";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("document", file);
      formData.append("type", type);
      formData.append("applicationId", application._id);

      try {
        setUploading(true);
        const token = localStorage.getItem("authToken")?.replace(/^"|"$/g, "");
        const res = await axios.post(`${API_URL}/documents/upload`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        const uploadedDoc = res.data?.data?.document || { type };

        toast({
          title: "Upload Successful",
          description: `${type.toUpperCase()} uploaded successfully.`,
        });

        //Instantly update UI (no reload)
        setDocs((prev) => ({
          ...prev,
          uploaded: [...prev.uploaded, uploadedDoc],
          missing: prev.missing.filter((d) => d !== type),
        }));
      } catch (err) {
        toast({
          title: "❌ Upload Failed",
          description: "Please try again later.",
          variant: "destructive",
        });
      } finally {
        setUploading(false);
      }
    };
    input.click();
  };

  if (loading)
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent>
          <p>Loading application details...</p>
        </DialogContent>
      </Dialog>
    );

  const allDocsUploaded = docs.missing.length === 0;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {program?.name || "Program Details"}
          </DialogTitle>
          <DialogDescription>
            {application.universityId.name} — {application.universityId.country}
          </DialogDescription>
        </DialogHeader>

        {/* University & Program Info */}
        <div className="grid md:grid-cols-2 gap-4 my-4">
          <Card>
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <p>{application.universityId.city || "N/A"}</p>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <p>Intakes: {program?.intake?.join(", ") || "N/A"}</p>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-muted-foreground" />
                <p>Duration: {program?.duration || "N/A"}</p>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                <p>
                  Tuition Fee: {program?.tuitionFee?.amount}{" "}
                  {program?.tuitionFee?.currency} / year
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 space-y-2">
              <p>
                <strong>Application Fee:</strong> $
                {program?.applicationFee || "N/A"}
              </p>
              <p>
                <strong>Deadline:</strong>{" "}
                {new Date(program?.applicationDeadline).toLocaleDateString() ||
                  "N/A"}
              </p>
              <p>
                <strong>Acceptance Rate:</strong>{" "}
                {program?.acceptanceRate || "N/A"}%
              </p>
              <p>
                <strong>Total Seats:</strong> {program?.totalSeats || "N/A"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Required Documents */}
        {/* <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">Required Documents</h3>
          <div className="space-y-2">
            {docs.required.map((type) => {
              const uploaded = docs.uploaded.some((d) => d.type === type);
              return (
                <div
                  key={type}
                  className="flex items-center justify-between border p-2 rounded-md"
                >
                  <span>{type.toUpperCase()}</span>
                  {uploaded ? (
                    <Badge className="bg-green-100 text-green-800">
                      Uploaded
                    </Badge>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => handleUploadDocument(type)}
                      disabled={uploading}
                    >
                      {uploading ? "Uploading..." : "Upload"}
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </div> */}

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">Required Documents</h3>

          <div className="mb-4 p-3 bg-blue-50 rounded-md">
            <p className="text-sm text-blue-700">
              {docs.uploaded.length} of {docs.required.length} documents
              uploaded
              {docs.uploaded.length === docs.required.length &&
                " — All documents Uploaded!"}
            </p>
          </div>

          <div className="space-y-2">
            {docs.required.map((type) => {
              const uploaded = docs.uploaded.some((d) => d.type === type);
              return (
                <div
                  key={type}
                  className="flex items-center justify-between border p-2 rounded-md"
                >
                  <span>{type.toUpperCase()}</span>
                  {uploaded ? (
                    <Badge className="bg-green-100 text-green-800">
                      Uploaded
                    </Badge>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => handleUploadDocument(type)}
                      disabled={uploading}
                    >
                      {uploading ? "Uploading..." : "Upload"}
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
