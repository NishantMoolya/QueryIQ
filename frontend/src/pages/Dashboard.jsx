import React from "react";
import GradientText from "@/components/ui/GradientText/GradientText";
import ConnectDatabases from "@/components/ui/dashboard/ConnectDatabases"
import ConnectDocuments from "@/components/ui/dashboard/ConnectDocuments"
import ChatButton from "@/components/ui/dashboard/ChatButton";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-black text-white">
      {/* Subtle animated background pattern */}
      <div className="fixed inset-0 opacity-5">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Connect to Database Section */}
        <ConnectDatabases />

        {/* Documents Section */}
        <ConnectDocuments />
      </div>

      {/* Floating Chat Button */}
      <ChatButton />
    </div>
  );
};

export default Dashboard;
