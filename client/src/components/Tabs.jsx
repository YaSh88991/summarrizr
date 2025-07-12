import React from 'react';
export default function Tabs({ current, setCurrent }) {
  const tabs = [
    { id: "pdf", label: "PDF" },
    { id: "video", label: "Video" },
    { id: "text", label: "Text" },
    { id: "docs", label: "Docs" },
    { id: "pptx", label: "PPTs" },
    { id: "excel", label: "Excel" }
  ];

  return (
    <div className="w-full flex justify-center">
      <div className="flex gap-5 md:gap-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`
              px-8 py-2 md:py-3 font-bold text-base md:text-lg
              rounded-full focus:outline-none
              transition-all duration-150
              relative
              ${
                current === tab.id
                  ? "bg-gradient-to-r from-cyan-400 via-teal-400 to-blue-400 text-black ring-2 ring-cyan-300"
                  : "bg-black/100 text-cyan-200 hover:bg-cyan-700/30 hover:text-white"
              }
              ${current === tab.id ? "scale-110 shadow-xl" : ""}
            `}
            style={{
              minWidth: "120px",
              // Gradient border for active tab using box-shadow if you want even more pop:
              boxShadow:
                current === tab.id
                  ? "0 0 0 3px #22d3ee, 0 2px 10px 0 rgba(34,211,238,0.30)"
                  : undefined,
            }}
            onClick={() => setCurrent(tab.id)}
          >
            {tab.label}
            {/* Add a subtle gradient border below using pseudo-element in CSS if needed */}
          </button>
        ))}
      </div>
    </div>
  );
}
