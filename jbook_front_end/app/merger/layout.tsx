import React from "react";

const MergerLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full min-h-screen flex flex-col">
      {/* Header */}
      <div className="px-14 w-full py-4 bg-primary">
        <p className="text-center text-3xl font-semibold text-white">Merger</p>
      </div>

      {/* Main Content */}
      {children}
    </div>
  );
};

export default MergerLayout;
