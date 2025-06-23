import React from "react";

export default function Tabs({ current, setCurrent }) {
  const tabs = [
    { id: "video", label: "Video" },
    { id: "text", label: "Text" },
    //Add rest later
  ];
  return (
    <div className="flex gap-2 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`px-5 py-2 rounded-t-lg font-semibold transition ${
            current === tab.id
              ? "bg-cyan-500 text-white shadow-lg"
              : "bg-neutral-900 text-cyan-300 hover:bg-neutral-800"
          }`}
          onClick={() => setCurrent(tab.id)}
        >
            {tab.label}
        </button>
      ))}
    </div>
  );
}
