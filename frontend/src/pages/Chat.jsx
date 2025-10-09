import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Send,
  Database,
  FileText,
  Upload,
  X,
  Menu,
  ArrowLeft,
  Paperclip,
  Bot,
  User,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import axiosInstance from "@/api/axios";

const Chat = () => {
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Database state
  const [dbUrl] = useState("mongodb://localhost:27017/mydb");
  const [isDbConnected] = useState(true);

  // Documents state
  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);

  // Chat state
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! I can help you query your database or analyze documents. What would you like to know?",
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  // Upload modal state
  const [openUpload, setOpenUpload] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  // Fetch documents on mount
  useEffect(() => {
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

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send chat message
  const sendChat = async () => {
    if (!chatInput.trim()) return;

    if (!isDbConnected && documents.length === 0) {
      alert("Please connect a database or upload documents first");
      return;
    }

    const newMessage = {
      role: "user",
      content: chatInput,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
    setChatInput("");
    setIsTyping(true);

    try {
      const res = await axiosInstance.post("/chat/answer", {
        query: chatInput,
      });
      console.log(res.data.res);
      const aiResponse = {
        role: "assistant",
        content: res.data.res || "No response from the server.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch (err) {
      console.error("Chat API error:", err.message);

      const errorMsg = {
        role: "assistant",
        content: "Sorry, I could not get a response. Please try again.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendChat();
    }
  };

  // File selection
  const handleFileSelect = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  // Drag handlers
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
    setSelectedFiles(Array.from(e.dataTransfer.files));
  };

  // Upload files
  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    const validFiles = selectedFiles.filter((file) => {
      const ext = file.name.split(".").pop().toLowerCase();
      return ["pdf", "csv"].includes(ext);
    });

    if (validFiles.length !== selectedFiles.length) {
      alert("Only PDF and CSV files are allowed");
      return;
    }

    // TODO: Replace with actual API call
    const newDocs = validFiles.map((file, index) => ({
      id: documents.length + index + 1,
      name: file.name,
      thumbnail: null,
      type: file.type,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
    }));

    setDocuments([...documents, ...newDocs]);
    setSelectedFiles([]);
    setOpenUpload(false);

    setMessages((prev) => [
      ...prev,
      {
        role: "system",
        content: `${validFiles.length} document(s) uploaded successfully`,
        timestamp: new Date(),
      },
    ]);
  };

  const removeFile = (index) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const getFileIcon = (type) => {
    if (type?.includes("pdf")) return "📄";
    if (type?.includes("excel") || type?.includes("sheet")) return "📊";
    if (type?.includes("word") || type?.includes("doc")) return "📝";
    return "📎";
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-black via-gray-950 to-black text-white overflow-hidden">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "w-80" : "w-0"
        } transition-all duration-300 bg-gradient-to-b from-white/5 to-white/[0.02] backdrop-blur-xl border-r border-white/10 flex-shrink-0 flex flex-col overflow-hidden`}
      >
        <div className="p-4 sm:p-6 border-b border-white/10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Sources
            </h2>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Database Status */}
          <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white/10">
                  <Database className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Database</p>
                  <p className="text-xs text-gray-400 truncate max-w-[150px]">
                    {isDbConnected ? "Connected" : "Disconnected"}
                  </p>
                </div>
              </div>
              <div
                className={`w-2.5 h-2.5 rounded-full ${
                  isDbConnected ? "bg-green-500 animate-pulse" : "bg-gray-500"
                }`}
              ></div>
            </div>
          </Card>
        </div>

        {/* Documents List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
              Documents
            </h3>
            <Button
              onClick={() => setOpenUpload(true)}
              className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-3">
            {documents.map((doc) => (
              <Card
                key={doc.id}
                onClick={() => setSelectedDocument(doc)}
                className={`group cursor-pointer relative overflow-hidden bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-xl border transition-all duration-300 hover:scale-[1.02] ${
                  selectedDocument?.id === doc.id
                    ? "border-white/40 shadow-lg shadow-white/10"
                    : "border-white/10 hover:border-white/20"
                }`}
              >
                <div className="p-3">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl flex-shrink-0">
                      {getFileIcon(doc.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {doc.name}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{doc.size}</p>
                    </div>
                  </div>
                </div>
                {selectedDocument?.id === doc.id && (
                  <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-white"></div>
                )}
              </Card>
            ))}
          </div>

          {documents.length === 0 && (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-sm text-gray-500">No documents yet</p>
            </div>
          )}
        </div>

        {/* Back to Dashboard */}
        <div className="p-4 border-t border-white/10">
          <Button
            onClick={() => navigate("/dashboard")}
            className="w-full bg-white/10 hover:bg-white/20 text-white py-2.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </Button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-white/10 backdrop-blur-xl bg-black/30 px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className={`${
                  isSidebarOpen ? "hidden" : "block"
                } p-2 hover:bg-white/10 rounded-lg transition-colors`}
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-lg sm:text-xl font-semibold">
                  AI Assistant
                </h1>
                <p className="text-xs sm:text-sm text-gray-400">
                  {selectedDocument
                    ? `Analyzing: ${selectedDocument.name}`
                    : isDbConnected
                    ? "Connected to database"
                    : "No source selected"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 custom-scrollbar">
          <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2 sm:gap-3 md:gap-4 ${
                  msg.role === "user" ? "flex-row-reverse" : "flex-row"
                } ${msg.role === "system" ? "justify-center" : ""}`}
              >
                {msg.role !== "system" && (
                  <div
                    className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center ${
                      msg.role === "user"
                        ? "bg-gradient-to-br from-white to-gray-300"
                        : "bg-gradient-to-br from-white/20 to-white/10 border border-white/20"
                    }`}
                  >
                    {msg.role === "user" ? (
                      <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-black" />
                    ) : (
                      <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" />
                    )}
                  </div>
                )}

                <div
                  className={`${
                    msg.role === "system"
                      ? "flex justify-center"
                      : msg.role === "user"
                      ? "flex justify-end"
                      : "flex justify-start"
                  } ${msg.role === "system" ? "w-full" : "flex-1 min-w-0"}`}
                >
                  {msg.role === "system" ? (
                    <div className="text-center">
                      <span className="inline-block bg-white/5 border border-white/10 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs text-gray-400">
                        {msg.content}
                      </span>
                    </div>
                  ) : (
                    <div
                      className={`inline-block max-w-[85%] sm:max-w-[80%] md:max-w-[75%] lg:max-w-[70%] rounded-2xl px-3 sm:px-4 md:px-5 py-2.5 sm:py-3 md:py-3.5 ${
                        msg.role === "user"
                          ? "bg-gradient-to-r from-white to-gray-100 text-black"
                          : "bg-gradient-to-br from-white/10 to-white/5 border border-white/10 text-white backdrop-blur-xl"
                      }`}
                      style={{
                        wordWrap: "break-word",
                        overflowWrap: "break-word",
                        hyphens: "auto",
                      }}
                    >
                      <p className="text-xs sm:text-sm md:text-base leading-relaxed whitespace-pre-wrap break-words">
                        {msg.content}
                      </p>
                      <p
                        className={`text-[10px] sm:text-xs mt-1.5 sm:mt-2 ${
                          msg.role === "user"
                            ? "text-gray-600"
                            : "text-gray-400"
                        } text-right`}
                      >
                        {formatTime(msg.timestamp)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-2 sm:gap-3 md:gap-4">
                <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-white/20 to-white/10 border border-white/20 flex items-center justify-center">
                  <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" />
                </div>
                <div className="inline-block bg-gradient-to-br from-white/10 to-white/5 border border-white/10 backdrop-blur-xl rounded-2xl px-4 sm:px-5 py-2.5 sm:py-3 md:py-3.5">
                  <div className="flex gap-1">
                    <span
                      className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></span>
                    <span
                      className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></span>
                    <span
                      className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Chat Input */}
        <div className="border-t border-white/10 bg-gradient-to-b from-transparent to-black/50 backdrop-blur-xl p-4 sm:p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end gap-2 sm:gap-3 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-2 sm:p-3 focus-within:border-white/40 transition-all duration-300">
              <Button
                onClick={() => setOpenUpload(true)}
                className="p-2 sm:p-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-200 flex-shrink-0"
              >
                <Paperclip className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>

              <Input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask anything about your data..."
                className="flex-1 bg-transparent border-none text-white text-sm sm:text-base placeholder-gray-500 focus:ring-0 focus:outline-none px-2"
              />

              <Button
                onClick={sendChat}
                disabled={
                  !chatInput.trim() || (!isDbConnected && !selectedDocument)
                }
                className="p-2 sm:p-2.5 bg-gradient-to-r from-white to-gray-200 hover:from-gray-100 hover:to-gray-300 text-black rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 hover:scale-105"
              >
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 text-center mt-2">
              Press Enter to send, Shift + Enter for new line
            </p>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      <Dialog open={openUpload} onOpenChange={setOpenUpload}>
        <DialogContent className="bg-gradient-to-br from-gray-950 via-black to-gray-950 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 sm:p-8 max-w-[90%] sm:max-w-lg shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-white text-2xl sm:text-3xl font-bold flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-white/20 to-white/10">
                <Upload className="w-6 h-6 text-white" />
              </div>
              Upload Documents
            </DialogTitle>
            <DialogDescription className="text-gray-400 text-sm sm:text-base mt-2">
              Upload PDF or CSV files to analyze with AI
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 space-y-5">
            {/* Drag and Drop Zone */}
            <div
              className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-10 text-center transition-all duration-300 ${
                isDragging
                  ? "border-white bg-white/10 scale-[1.02]"
                  : "border-white/20 bg-gradient-to-br from-white/5 to-transparent hover:border-white/40"
              }`}
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="inline-block p-4 rounded-full bg-gradient-to-br from-white/20 to-white/10 mb-4">
                <Upload className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
              </div>
              <p className="text-white text-base sm:text-lg font-medium mb-2">
                Drag and drop files here
              </p>
              <p className="text-gray-400 text-sm mb-5">
                PDF and CSV files only
              </p>
              <label className="cursor-pointer">
                <input
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  accept=".pdf,.csv"
                />
                <span className="inline-block bg-white hover:bg-gray-100 text-black font-semibold px-6 py-2.5 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg">
                  Browse Files
                </span>
              </label>
            </div>

            {/* Selected Files */}
            {selectedFiles.length > 0 && (
              <div className="space-y-3 max-h-56 overflow-y-auto custom-scrollbar">
                <p className="text-gray-300 text-sm font-medium flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-white"></span>
                  Selected Files ({selectedFiles.length})
                </p>
                {selectedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl rounded-xl p-3 sm:p-4 border border-white/10 hover:border-white/30 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="p-2 rounded-lg bg-white/10">
                        <FileText className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm sm:text-base truncate font-medium">
                          {file.name}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="ml-2 p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <Button
              onClick={handleUpload}
              disabled={selectedFiles.length === 0}
              className="w-full bg-gradient-to-r from-white to-gray-200 hover:from-gray-100 hover:to-gray-300 text-black font-bold py-3.5 sm:py-4 rounded-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-base sm:text-lg"
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

export default Chat;
