import React from "react";
const tabs = ["Posts", "Tests", "Boards", "Descs"];
const SearchPageHeader = ({onSelect, activeTab, ref}) => {
  return (
    <div ref={ref} className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-200">
      {/* Tabs */}
      <div className="flex overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onSelect(tab)}
            className={`flex-1 px-4 hover:bg-gray-100 transition-colors relative ${
              activeTab === tab ? "font-bold" : "text-gray-500"
            }`}
          >
            <span
              className={`block py-4 border-b-4 ${
                activeTab === tab ? "border-b-black" : "border-b-transparent"
              }`}
            >
              {tab}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchPageHeader;
