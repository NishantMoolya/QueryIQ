import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import GradientText from "@/components/ui/GradientText/GradientText";
import {
  Plus,
  MessageSquare,
  Database,
  FileText,
  X,
  Upload,
  Sparkles,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { supabase } from "@/lib/supabaseClient";
import axiosInstance from "@/api/axios";

const Dashboard = () => {
  const navigate = useNavigate();

  // State for database URL input
  const [dbUrl, setDbUrl] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);

  // State for user's uploaded documents
  const [documents, setDocuments] = useState([]);

  // State for upload modal
  const [openUpload, setOpenUpload] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  // Fetch previously uploaded documents on component mount
  useEffect(() => {
    // Mock data for demonstration
    const uploadedDocs = [
      {
        id: 1,
        name: "Sales Report Q1.pdf",
        thumbnail: null,
        type: "pdf",
        size: "2.4 MB",
      },
      {
        id: 2,
        name: "Customer Data.xlsx",
        thumbnail: null,
        type: "excel",
        size: "1.8 MB",
      },
      {
        id: 3,
        name: "Project Proposal.docx",
        thumbnail: null,
        type: "doc",
        size: "3.1 MB",
      },
    ];
    setDocuments(uploadedDocs);
  }, []);

  // Handle database connection
  const connectDatabase = async () => {
    if (dbUrl) {
      setIsConnecting(true);
      console.log("Connecting to database:", dbUrl);
      setTimeout(() => {
        setIsConnecting(false);
        setDbUrl("");
        alert("Database connected successfully!");
      }, 1500);
    }
  };

  // Handle file selection via input
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  // Drag and drop handlers
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    setSelectedFiles(files);
  };

  // Handle file upload
  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    try {
      const uploadedDocs = [];
      const pdfFiles = []; // collect PDFs for batch upload

      for (const file of selectedFiles) {
        const isCSV = file.type === "text/csv" || file.name.endsWith(".csv");

        if (isCSV) {
          // Upload CSV to Supabase
          const fileName = `${Date.now()}_${file.name}`;
          const filePath = `csv_files/${fileName}`;

          const { data, error } = await supabase.storage
            .from("csv_files")
            .upload(filePath, file, {
              cacheControl: "3600",
              upsert: false,
            });

          if (error) {
            console.error("Supabase upload error:", error.message);
            alert(`Failed to upload ${file.name}: ${error.message}`);
            continue;
          }

          const { data: publicData } = supabase.storage
            .from("csv_files")
            .getPublicUrl(filePath);

          uploadedDocs.push({
            id: documents.length + uploadedDocs.length + 1,
            name: file.name,
            type: file.type,
            size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
            thumbnail: null,
            url: publicData.publicUrl,
            storedIn: "supabase",
          });
        } else if (
          file.type === "application/pdf" ||
          file.name.endsWith(".pdf")
        ) {
          // Collect PDFs for API upload
          pdfFiles.push(file);
        } else {
          // Discard unsupported file types but still add locally
          uploadedDocs.push({
            id: documents.length + uploadedDocs.length + 1,
            name: file.name,
            type: file.type,
            size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
            thumbnail: file.type.startsWith("image/")
              ? URL.createObjectURL(file)
              : null,
            storedIn: "local",
          });
        }
      }

      // Upload all PDFs in a single request
      if (pdfFiles.length > 0) {
        const formData = new FormData();
        pdfFiles.forEach((pdf) => formData.append("files", pdf));

        try {
          const res = await axiosInstance.post("/file/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });

          // Add uploaded PDFs to documents state
          pdfFiles.forEach((pdf, idx) => {
            uploadedDocs.push({
              id: documents.length + uploadedDocs.length + 1,
              name: pdf.name,
              type: pdf.type,
              size: `${(pdf.size / (1024 * 1024)).toFixed(1)} MB`,
              thumbnail: null,
              storedIn: "api",
              apiResponse: res.data[idx] || res.data, // store response info if needed
            });
          });
        } catch (err) {
          console.error("PDF upload error:", err.message);
          alert("Error uploading PDFs: " + err.message);
        }
      }

      // Update state with all uploaded files
      if (uploadedDocs.length > 0) {
        setDocuments([...documents, ...uploadedDocs]);
        alert(
          "Upload complete. CSVs stored in Supabase, PDFs uploaded via API."
        );
      }

      setOpenUpload(false);
      setSelectedFiles([]);
    } catch (err) {
      console.error("Upload error:", err.message);
      alert("Unexpected upload error: " + err.message);
    }
  };

  // Remove selected file from list
  const removeFile = (index) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  // Get file icon based on type
  const getFileIcon = (type) => {
    if (type?.includes("pdf")) return "📄";
    if (type?.includes("excel") || type?.includes("sheet")) return "📊";
    if (type?.includes("word") || type?.includes("doc")) return "📝";
    if (type?.includes("image")) return "🖼️";
    return "📎";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-black text-white">
      {/* Subtle animated background pattern */}
      <div className="fixed inset-0 opacity-5">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      </div>

      {/* Header */}
      <div className="relative border-b border-white/10 backdrop-blur-xl bg-black/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold  bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                <GradientText
                  colors={[
                    "#d97a36",
                    "#d97a36",
                    "#4079ff",
                    "#40ffaa",
                    "#d97a36",
                  ]}
                  animationSpeed={10}
                  showBorder={false}
                  // className="font-extrabold"
                >
                   
                  Dashboard
                </GradientText>
              </h1>
              <p className="text-gray-400 text-sm sm:text-base mt-2">
                Manage your databases and documents
              </p>
            </div>
            <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-white/20" />
          </div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Connect to Database Section */}
        <div className="mb-12 sm:mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-gradient-to-br from-white/10 to-white/5 border border-white/10">
              <Database className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold">
              Connect Database
            </h2>
          </div>

          <Card className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl hover:border-white/20 transition-all duration-300">
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                value={dbUrl}
                onChange={(e) => setDbUrl(e.target.value)}
                placeholder="mongodb://username:password@host:port/database"
                className="flex-1 bg-black/40 border border-white/20 text-white text-sm sm:text-base focus:ring-2 focus:ring-white/30 focus:border-white/30 placeholder-gray-500 rounded-xl px-4 py-3 sm:py-3.5"
              />
              <Button
                onClick={connectDatabase}
                disabled={!dbUrl || isConnecting}
                className="bg-gradient-to-r from-white to-gray-200 hover:from-gray-100 hover:to-gray-300 text-black font-semibold px-8 py-3 sm:py-3.5 rounded-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-white/20 whitespace-nowrap"
              >
                {isConnecting ? "Connecting..." : "Connect"}
              </Button>
            </div>
            <p className="text-gray-500 text-xs sm:text-sm mt-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-500"></span>
              Supports MongoDB, PostgreSQL, MySQL, and more
            </p>
          </Card>
        </div>

        {/* Documents Section */}
        <div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-white/10 to-white/5 border border-white/10">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-semibold">
                  Documents
                </h2>
                <p className="text-gray-500 text-sm mt-0.5">
                  {documents.length} files uploaded
                </p>
              </div>
            </div>
            <Button
              onClick={() => setOpenUpload(true)}
              className="flex items-center gap-2 bg-white hover:bg-gray-100 text-black font-semibold px-5 py-2.5 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-white/20"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" /> Add Document
            </Button>
          </div>

          {/* Documents Grid */}
          {documents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {documents.map((doc) => (
                <Card
                  key={doc.id}
                  className="group relative overflow-hidden bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/10 rounded-2xl hover:border-white/30 transition-all duration-500 hover:scale-[1.02] cursor-pointer shadow-xl hover:shadow-2xl"
                  onClick={() => navigate(`/document/${doc.id}`)}
                >
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <div className="relative aspect-video bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center border-b border-white/10">
                    <span className="text-6xl group-hover:scale-110 transition-transform duration-300">
                      {getFileIcon(doc.type)}
                    </span>
                  </div>

                  <div className="relative p-4 bg-gradient-to-b from-transparent to-black/20">
                    <p className="text-white text-sm sm:text-base font-medium truncate mb-1">
                      {doc.name}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>{doc.size}</span>
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        View →
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="text-center py-16 sm:py-20 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl border-2 border-dashed border-white/10 hover:border-white/20 transition-all duration-300">
              <div className="inline-block p-4 rounded-full bg-gradient-to-br from-white/10 to-white/5 mb-6">
                <FileText className="w-12 h-12 sm:w-16 sm:h-16 text-white/50" />
              </div>
              <p className="text-gray-400 text-base sm:text-lg mb-6">
                No documents uploaded yet
              </p>
              <Button
                onClick={() => setOpenUpload(true)}
                className="bg-white hover:bg-gray-100 text-black font-semibold px-8 py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
              >
                Upload Your First Document
              </Button>
            </Card>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      <Dialog open={openUpload} onOpenChange={setOpenUpload}>
        <DialogContent className="bg-gradient-to-br from-gray-950 via-black to-gray-950 backdrop-blur-2xl border border-white/20 rounded-3xl p-4 sm:p-6 md:p-8 w-[95vw] sm:w-[90vw] md:w-full sm:max-w-lg max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="text-white text-xl sm:text-2xl md:text-3xl font-bold flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 rounded-lg bg-gradient-to-br from-white/20 to-white/10">
                <Upload className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              Upload Documents
            </DialogTitle>
            <DialogDescription className="text-gray-400 text-xs sm:text-sm md:text-base mt-2">
              Upload documents to query with AI
            </DialogDescription>
          </DialogHeader>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto custom-scrollbar mt-4 sm:mt-6 space-y-4 sm:space-y-5 pr-2">
            {/* Drag and Drop Zone */}
            <div
              className={`relative border-2 border-dashed rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-10 text-center transition-all duration-300 overflow-hidden ${
                isDragging
                  ? "border-white bg-white/10 scale-[1.02]"
                  : "border-white/20 bg-gradient-to-br from-white/5 to-transparent hover:border-white/40"
              }`}
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

              <div className="relative">
                <div className="inline-block p-3 sm:p-4 rounded-full bg-gradient-to-br from-white/20 to-white/10 mb-3 sm:mb-4">
                  <Upload className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" />
                </div>
                <p className="text-white text-sm sm:text-base md:text-lg font-medium mb-1 sm:mb-2">
                  Drag and drop files here
                </p>
                <p className="text-gray-400 text-xs sm:text-sm mb-4 sm:mb-5">
                  or
                </p>
                <label className="cursor-pointer">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.csv"
                  />
                  <span className="inline-block bg-white hover:bg-gray-100 text-black font-semibold px-4 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base rounded-xl transition-all duration-300 hover:scale-105 shadow-lg">
                    Browse Files
                  </span>
                </label>
              </div>
            </div>

            {/* Selected Files List - Now properly constrained */}
            {selectedFiles.length > 0 && (
              <div className="space-y-2 sm:space-y-3">
                <p className="text-gray-300 text-xs sm:text-sm font-medium flex items-center gap-2 sticky top-0 bg-gradient-to-r from-black/80 to-transparent py-2 backdrop-blur-sm z-10">
                  <span className="w-2 h-2 rounded-full bg-white"></span>
                  Selected Files ({selectedFiles.length})
                </p>

                {/* Files container with max height */}
                <div className="space-y-2 sm:space-y-3 max-h-[30vh] overflow-y-auto custom-scrollbar pr-1">
                  {selectedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="group flex items-center justify-between bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl rounded-lg sm:rounded-xl p-2.5 sm:p-3 md:p-4 border border-white/10 hover:border-white/30 transition-all duration-300"
                    >
                      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                        <div className="p-1.5 sm:p-2 rounded-lg bg-white/10 flex-shrink-0">
                          <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-xs sm:text-sm md:text-base truncate font-medium">
                            {file.name}
                          </p>
                          <p className="text-gray-500 text-[10px] sm:text-xs">
                            {(file.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className="ml-2 p-1.5 sm:p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200 flex-shrink-0"
                      >
                        <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Upload Button - Fixed at bottom */}
          <div className="flex-shrink-0 mt-4 sm:mt-5 pt-4 border-t border-white/10">
            <Button
              onClick={handleUpload}
              disabled={selectedFiles.length === 0}
              className="w-full bg-gradient-to-r from-white to-gray-200 hover:from-gray-100 hover:to-gray-300 text-black font-bold py-2.5 sm:py-3 md:py-3.5 text-sm sm:text-base md:text-lg rounded-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              Upload{" "}
              {selectedFiles.length > 0 &&
                `${selectedFiles.length} file${
                  selectedFiles.length > 1 ? "s" : ""
                }`}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Floating Chat Button */}
      <Button
        onClick={() => navigate("/Chat")}
        className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 bg-gradient-to-r from-white via-gray-100 to-white hover:from-gray-100 hover:via-white hover:to-gray-100 text-black rounded-full p-4 sm:p-5 shadow-2xl transition-all duration-300 hover:scale-110 z-50 group border-2 border-white/20"
      >
        <MessageSquare className="w-6 h-6 sm:w-7 sm:h-7 group-hover:rotate-12 transition-transform duration-300" />
      </Button>

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
