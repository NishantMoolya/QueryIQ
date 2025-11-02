import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, Bot, User } from "lucide-react";
import axiosInstance from "@/api/axios";
import ChatInput from "@/components/ui/chat/ChatInput";
import TypingIndicator from "@/components/ui/chat/TypingIndicator";
import ChatSidebar from "@/components/ui/chat/ChatSidebar";
import ChatTextResponse from "@/components/ui/chat/ChatTextResponse";
import ChatTableResponse from "@/components/ui/chat/ChatTableResponse";

const Chat = () => {
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [selectedDB, setSelectedDB] = useState("");
  const [selectedDocuments, setSelectedDocuments] = useState([]);

  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
      "Hello! I can help you query your database or analyze documents. What would you like to know?",
      timestamp: new Date(),
      type: "str",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleDBSelect = (id, status) => {
    // console.log(id, status);
    if(status) setSelectedDB("");
    else setSelectedDB(id);
  }

  const handleDocSelect = (id, status) => {
    // console.log(id, status);
    
    if(status) {
      const newData = selectedDocuments.filter((item) => {
        if(item === id) return false;
        else return true;
      });
      // console.log("newdata:", newData);
      
      setSelectedDocuments(newData);
    } 
    else {
      setSelectedDocuments(p => [...p,id]);
    }
  }
  
  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    let timer = setTimeout(() => setIsSidebarOpen(true), 800);
    return () => clearTimeout(timer);
  }, []);

  // Send chat message
  const sendChat = async () => {
    if (chatInput.trim().length === 0) return;

    if (selectedDB.length === 0 && selectedDocuments.length === 0) {
      alert("Please select a database or documents.");
      return;
    }

    const newMessage = {
      role: "user",
      content: chatInput.trim(),
      timestamp: new Date(),
      type: "str",
    };
    setMessages((prev) => [...prev, newMessage]);
    setChatInput("");
    setIsTyping(true);

    try {
      let payload = {
        query: chatInput.trim(),
        sources: [...selectedDocuments]
      }
      if(selectedDB.length > 0) payload.sources.push(selectedDB);

      const res = await axiosInstance.post("/chat/answer", payload);

      const responseData = res?.data?.data;
      const responseType = responseData?.type || "str";
      const responseContent = responseData?.res;

      console.log("This data comes from the LLM:", responseContent);

      let formattedContent = responseContent;
      console.log("type is here" + responseType);
      if (responseType === "json") {
        let jsonData = responseContent;

        // Parse JSON string if needed
        if (typeof responseContent === "string") {
          try {
            jsonData = JSON.parse(responseContent);
          } catch (err) {
            console.error("Failed to parse JSON string:", err);
            jsonData = null;
          }
        }

        // Handle array of objects
        if (Array.isArray(jsonData)) {
          if (jsonData.length > 0) {
            const keys = Object.keys(jsonData[0]);
            formattedContent = `
          <table style="
            border-collapse: collapse; 
            width: 100%; 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #f0f0f0;
            background-color: #1e1e2f;
            box-shadow: 0 2px 6px rgba(0,0,0,0.4);
            border-radius: 8px;
            overflow: hidden;
          ">
            <thead>
              <tr style="background-color: #2c2c3d; text-transform: uppercase; font-size: 12px; letter-spacing: 0.5px;">
                ${keys
                .map(
                  (key) =>
                    `<th style="
                        padding: 10px 12px; 
                        text-align: left; 
                        border-bottom: 2px solid #444;
                      ">${key}</th>`
                )
                .join("")}
              </tr>
            </thead>
            <tbody>
              ${jsonData
                .map(
                  (row, i) => `
                <tr style="
                  background-color: ${i % 2 === 0 ? '#262636' : '#1e1e2f'};
                  transition: background 0.3s;
                ">
                  ${keys
                      .map(
                        (key) =>
                          `<td style="
                          padding: 8px 12px; 
                          border-bottom: 1px solid #333;
                        ">${row[key]}</td>`
                      )
                      .join("")}
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
          `;
          } else {
            formattedContent = "<p>No data available</p>";
          }
        }

        // Handle single object
        else if (jsonData && typeof jsonData === "object") {
          const entries = Object.entries(jsonData);
          formattedContent = `
        <table style="
          border-collapse: collapse;
          width: 100%;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #f0f0f0;
          background-color: #1e1e2f;
          box-shadow: 0 2px 6px rgba(0,0,0,0.4);
          border-radius: 8px;
          overflow: hidden;
        ">
          <thead>
            <tr style="
              background-color: #2c2c3d; 
              text-transform: uppercase; 
              font-size: 12px; 
              letter-spacing: 0.5px;
            ">
              <th style="padding: 10px 12px; text-align: left; border-bottom: 2px solid #444;">Key</th>
              <th style="padding: 10px 12px; text-align: left; border-bottom: 2px solid #444;">Value</th>
            </tr>
          </thead>
          <tbody>
            ${entries
              .map(
                ([key, value], i) => `
              <tr style="
                background-color: ${i % 2 === 0 ? '#262636' : '#1e1e2f'};
                transition: background 0.3s;
              ">
                <td style="padding: 8px 12px; border-bottom: 1px solid #333;">${key}</td>
                <td style="padding: 8px 12px; border-bottom: 1px solid #333;">${JSON.stringify(
                  value
                )}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
        `;
        }
      }

      const aiResponse = {
        role: "assistant",
        content: formattedContent || "No response from the server.",
        timestamp: new Date(),
        type: responseType,
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch (err) {
      console.error("Chat API error:", err.message);

      const errorMsg = {
        role: "assistant",
        content: "Sorry, I could not get a response. Please try again.",
        timestamp: new Date(),
        type: "str",
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

  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-black via-gray-950 to-black text-white overflow-hidden">
      {/* Sidebar */}
      <ChatSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} handleDBSelect={handleDBSelect} handleDocSelect={handleDocSelect} selectedDB={selectedDB} selectedDocuments={selectedDocuments} />

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-white/10 backdrop-blur-xl bg-black/30 px-4 sm:px-6 py-4">
          <div className="flex items-center">
            <div className="flex items-center gap-3 flex-1">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className={`${isSidebarOpen ? "hidden" : "block"
                  } p-2 hover:bg-white/10 rounded-lg transition-colors`}
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="flex flex-1 items-center justify-between">
                <h1 className="text-lg sm:text-xl font-semibold">
                  QueryIQ
                </h1>
                <Button
                  size={"sm"}
                  onClick={() => navigate("/dashboard")}
                  className="bg-white/10 hover:bg-white/20 text-white py-2.5 transition-all duration-300"
                >
                  Dashboard
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 custom-scrollbar">
          <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-2 sm:gap-3 md:gap-4 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                <div
                  className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-white/20 to-white/10 border border-white/20`}>
                  {msg.role === "user" ? (
                    <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" />
                  ) : (
                    <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" />
                  )}
                </div>

                <div className={`flex ${msg.role === "user" ? "flex justify-end" : "flex justify-start"} flex-1 min-w-0`}>
                  {msg.role === "assistant" 
                    ? <div className="max-w-[800px]">
                      {msg.type === "json" ? <ChatTableResponse data={msg.content} /> : <ChatTextResponse text={msg.content} />}
                    </div>
                    : <ChatTextResponse text={msg.content} />}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && <TypingIndicator />}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Chat Input */}
        <ChatInput input={chatInput} setInput={setChatInput} handleSend={sendChat} handleKeyPress={handleKeyPress} isDisabled={!((chatInput.trim().length > 0) && (selectedDB.length > 0 || selectedDocuments.length > 0))} />
      </div>
    </div>
  );
};

export default Chat;
