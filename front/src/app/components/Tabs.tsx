import React from "react";

interface TabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Tabs: React.FC<TabsProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex gap-8 mb-5 border-b border-gray-700">
      {["All", "Watched", "Liked"].map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`text-lg font-semibold pb-2 ${
            activeTab === tab
              ? "text-white border-b-2 border-white"
              : "text-accent"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
