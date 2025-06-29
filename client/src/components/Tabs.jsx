export default function Tabs({ current, setCurrent }) {
  const tabs = [
    { id: "pdf", label: "PDF"},
    { id: "video", label: "Video" },
    { id: "text", label: "Text" },
    { id: "docs", label: "Docs"},
    { id: "pptx", label: "PPTs"}
    //Add rest later
  ];
  return (
    <div className="w-full flex justify-center mt-4 mb-6">
      <div className="flex gap-5 bg-[#101926]/80 p-3 rounded-2xl shadow-xl gap-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`px-8 py-3 rounded-xl font-bold text-lg transition-all duration-300 shadow
          ${
            current === tab.id
              ? "bg-cyan-400 text-black shadow-lg scale-105"
              : "bg-black/70 text-cyan-200 hover:bg-cyan-700/30 hover:text-white"
          }`}
            style={{
              minWidth: "130px",
              outline: current === tab.id ? "2px solid #22d3ee" : "none",
              
            }}
            onClick={() => setCurrent(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
