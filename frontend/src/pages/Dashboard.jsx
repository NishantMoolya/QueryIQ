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
                >

                  Dashboard
                </GradientText>
              </h1>
              <p className="text-gray-400 text-sm sm:text-base mt-2">
                Manage your databases and documents
              </p>
            </div>
          </div>
        </div>
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
