import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { supabase } from "@/lib/supabaseClient";
import { FileText, Loader2, Upload, X } from 'lucide-react';
import { Button } from '../button';
import axiosInstance from '@/api/axios';

const UploadFormModal = ({ openUpload, setOpenUpload, documents, setDocuments }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const allowedFileTypes = ['application/pdf', 'text/csv'];

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
    const droppedFiles = Array.from(e.dataTransfer.files);
    const validFiles = droppedFiles.filter((file) =>
      allowedFileTypes.includes(file.type)
    );
    if (validFiles.length === 0) {
      alert('Only PDF and CSV files are allowed.');
      return;
    }
    setSelectedFiles(prevFiles => {
      const allFiles = [...prevFiles, ...validFiles];
      const unique = Array.from(new Map(allFiles.map(f => [f.name, f])).values());
      return unique;
    });
  };

  const handleRemoveFile = (index) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const handleCSVUpload = async (file) => {
  try {
    const fileName = `${file.name}_${Date.now()}`;
    const filePath = `csv_files/${fileName}`;

    const { data, error } = await supabase.storage
      .from("csv_files")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });
    console.log("csv upload file res: ", data);
    
    if (error) {
      console.error("Supabase upload error:", error.message);
      throw new Error("File was not uploaded");
    }

    const { data: publicData } = supabase.storage
      .from("csv_files")
      .getPublicUrl(filePath);

    return publicData.publicUrl;
  } catch (err) {
    console.error("CSV upload failed:", err);
    throw new Error("Failed to upload CSV");
  }
};


const handlePDFUpload = async (pdfFiles) => {
  const formData = new FormData();
  pdfFiles.forEach((pdf) => formData.append("files", pdf));

  try {
    const res = await axiosInstance.post("/file/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    if (res.status === 201) return res.data;
    else throw new Error("Failed to upload PDFs");
  } catch (err) {
    console.error("PDF upload failed:", err);
    throw err;
  }
};


const handleUpload = async () => {
  if (selectedFiles.length === 0) return;

  try {
    setIsLoading(true);

    const uploadedDocs = [];
    const pdfPayloads = [];
    const csvPayloads = [];

    for (const file of selectedFiles) {
      const isCSV = file.type === "text/csv" || file.name.endsWith(".csv");
      const isPDF = file.type === "application/pdf" || file.name.endsWith(".pdf");

      if (isCSV) {
        const publicUrl = await handleCSVUpload(file);
        const payload = {
          file_name: `${file.name}_${Date.now()}`,
          file_url: publicUrl,
          file_type: "csv",
        };
        csvPayloads.push(payload);
        uploadedDocs.push({
          _id: documents.length + uploadedDocs.length + 1,
          file_name: file.name,
          file_type: "csv",
          url: publicUrl,
        });
      } 
      else if (isPDF) {
        pdfPayloads.push(file);
        uploadedDocs.push({
          _id: documents.length + uploadedDocs.length + 1,
          file_name: file.name,
          file_type: "application/pdf",
          url: null,
        });
      } 
      else {
        alert("Unsupported file type. Only PDF and CSV allowed.");
      }
    }

    // Upload all CSVs metadata
    if (csvPayloads.length > 0) {
      const res = await axiosInstance.post("/file/add", csvPayloads);
      if (res.status === 201) console.log("CSV metadata stored successfully");
      else throw new Error("Failed to store CSV metadata");
    }

    // Upload all PDFs
    if (pdfPayloads.length > 0) {
      const res = await handlePDFUpload(pdfPayloads);
      console.log("PDF upload data:", res);
    }

    // Update state
    if (uploadedDocs.length > 0) {
      setDocuments((prevDocs) => [...prevDocs, ...uploadedDocs]);
      alert("Files uploaded successfully.");
    }

    setOpenUpload(false);
    setSelectedFiles([]);
  } catch (err) {
    console.error("Upload error:", err.message);
    alert("Failed to upload files.");
  } finally {
    setIsLoading(false);
  }
};

  return (
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
            className={`relative border-2 border-dashed rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-10 text-center transition-all duration-300 overflow-hidden ${isDragging
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
                  accept=".pdf,.xlsx,.csv"
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
                      onClick={() => handleRemoveFile(index)}
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
            disabled={selectedFiles.length === 0 || isLoading}
            className="w-full bg-gradient-to-r from-white to-gray-200 hover:from-gray-100 hover:to-gray-300 text-black font-bold py-2.5 sm:py-3 md:py-3.5 text-sm sm:text-base md:text-lg rounded-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {isLoading ?
              <span className="flex justify-center py-2">
                <Loader2 className="w-6 h-6 animate-spin" />
              </span>
              : `Upload ${selectedFiles.length > 0 ? `${selectedFiles.length} file${selectedFiles.length > 1 ? "s" : ""}` : ""}`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default UploadFormModal