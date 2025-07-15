import React, { useRef, useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import bg_summ from "./assets/bg_summ.mp4";
import Tabs from "./components/Tabs";
import VideoSummarizer from "./components/VideoSummarizr";
import TextSummarizer from "./components/TextSummarizr";
import PdfSummarizr from "./components/PdfSummarizr";
import DocsSummarizr from "./components/DocsSummarizr";
import PptSummarizr from "./components/PptSummarizr";
import ExcelSummarizr from "./components/ExcelSummarizr";

export default function App() {
  const [currentTab, setCurrentTab] = useState("video");
  const [triggerScroll, setTriggerScroll] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [showSettingsMsg, setShowSettingsMsg] = useState(false);

  const EXTRA_MENU = [
    { label: "Settings", onClick: () => setShowSettingsMsg(true) },
    { label: "About", onClick: () => setAboutOpen(true) },
  ];

  const summaryRef = useRef(null);

  // Responsive: show tabs inside burger under md (tailwind: <768px)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (triggerScroll && summaryRef.current) {
      summaryRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      setTriggerScroll(false);
    }
  }, [triggerScroll]);

  // Tabs array for both places
  const tabs = [
    { id: "pdf", label: "PDF" },
    { id: "video", label: "Video" },
    { id: "text", label: "Text" },
    { id: "docs", label: "Docs" },
    { id: "pptx", label: "PPTs" },
    { id: "excel", label: "Excel" },
  ];

  return (
    <div className="flex flex-col min-h-screen text-white relative overflow-hidden">
      {/* --- BG Video & Gradient --- */}
      <video
        className="absolute inset-0 -z-20 w-full h-full object-cover"
        src={bg_summ}
        autoPlay
        loop
        muted
        playsInline
      />
      <div className="absolute inset-0 -z-10 w-full h-full bg-gradient-to-b from-black/80 via-teal-900/40 to-black/90" />

      {/* --- Header --- */}
      <header className="w-full px-6 pt-7 pb-2 z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
          {/* --- Logo --- */}
          <span className="text-3xl font-extrabold tracking-tight select-none bg-gradient-to-r from-cyan-400 via-teal-300 to-white bg-clip-text text-transparent drop-shadow">
            Sumarrizr
          </span>

          {/* --- Tabs (center, only PC) --- */}
          <div className="hidden md:flex flex-1 justify-center">
            <Tabs current={currentTab} setCurrent={setCurrentTab} tabs={tabs} />
          </div>

          {/* --- Hamburger always visible --- */}
          <button
            className="w-12 h-12 flex items-center justify-center rounded-full bg-black/70 hover:bg-black/90 border-2 border-cyan-500 transition"
            aria-label="Menu"
            onClick={() => setDrawerOpen(true)}
          >
            <Menu size={32} strokeWidth={2.5} />
          </button>
        </div>
      </header>

      {/* --- Drawer Overlay & Drawer Panel --- */}
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-300 ${
          drawerOpen
            ? "bg-black/50 pointer-events-auto"
            : "pointer-events-none bg-transparent"
        }`}
        style={{ backdropFilter: drawerOpen ? "blur(2px)" : "none" }}
        onClick={() => setDrawerOpen(false)}
        aria-hidden={!drawerOpen}
        inert={!drawerOpen}
      />
      {/* Drawer */}
      <aside
        className={`
          fixed top-0 right-0 z-50 h-full w-[88vw] max-w-xs bg-neutral-900/95 shadow-2xl
          transition-transform duration-300 rounded-s-3xl
          flex flex-col pt-6 px-4
          ${drawerOpen ? "translate-x-0" : "translate-x-full"}
        `}
        tabIndex={drawerOpen ? 0 : -1}
        style={{ outline: "none" }}
      >
        {/* Close Button */}
        <button
          className="self-end mb-4 rounded-full bg-black/60 border border-cyan-500 p-2"
          onClick={() => setDrawerOpen(false)}
          aria-label="Close"
        >
          <X size={28} />
        </button>
        {/* --- Tabs (mobile only) --- */}
        {isMobile && (
          <div className="flex flex-col gap-4 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setCurrentTab(tab.id);
                  setDrawerOpen(false);
                }}
                className={`
                  px-8 py-3 rounded-full font-bold text-lg transition-all duration-300
                  shadow ring-2
                  ${
                    currentTab === tab.id
                      ? "bg-gradient-to-r from-cyan-400 to-teal-400 text-black ring-cyan-400"
                      : "bg-black/90 text-cyan-200 hover:bg-cyan-700/30 hover:text-white ring-cyan-900"
                  }
                `}
                style={{
                  minWidth: "130px",
                  outline: currentTab === tab.id ? "2px solid #22d3ee" : "none",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
        {/* --- Extra Menu Items --- */}
        <div className="flex flex-col gap-2 mt-auto mb-4">
          {EXTRA_MENU.map((item) => (
            <button
              key={item.label}
              className="w-full px-5 py-3 rounded-xl font-bold text-lg transition-all duration-150 bg-neutral-800/80 text-cyan-200 hover:bg-cyan-700/30 hover:text-white"
              onClick={item.onClick}
            >
              {item.label}
            </button>
          ))}
        </div>
      </aside>

      {/* --- Main Content & Footer --- */}
      <main className="flex-1 flex flex-col items-center px-2 pt-20 pb-6 transition-all duration-300">
        <div className="w-full flex justify-center mt-2">
          {currentTab === "video" && (
            <VideoSummarizer
              summaryRef={summaryRef}
              triggerScroll={setTriggerScroll}
            />
          )}
          {currentTab === "text" && (
            <TextSummarizer
              summaryRef={summaryRef}
              triggerScroll={setTriggerScroll}
            />
          )}
          {currentTab === "pdf" && (
            <PdfSummarizr
              summaryRef={summaryRef}
              triggerScroll={setTriggerScroll}
            />
          )}
          {currentTab === "docs" && (
            <DocsSummarizr
              summaryRef={summaryRef}
              triggerScroll={setTriggerScroll}
            />
          )}
          {currentTab === "pptx" && (
            <PptSummarizr
              summaryRef={summaryRef}
              triggerScroll={setTriggerScroll}
            />
          )}
          {currentTab === "excel" && (
            <ExcelSummarizr
              summaryRef={summaryRef}
              triggerScroll={setTriggerScroll}
            />
          )}
        </div>
      </main>
      <footer className="w-full py-4 text-center text-sm border-t border-neutral-800/60 bg-neutral-950/60">
        <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-white bg-clip-text text-transparent font-semibold">
          &copy; {new Date().getFullYear()} Sumarrizr &mdash; Built for all, by
          a dev who is just learning
          <span className="mx-2 text-cyan-300">|</span>
          <a
            href="https://github.com/YaSh88991/summarrizr"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          <span className="mx-2 text-cyan-300">|</span>
          <a href="mailto:vermayash8786@gmail.com">Contact</a>
        </span>
      </footer>

      {aboutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#161d26] rounded-2xl p-8 max-w-lg w-full shadow-xl border border-cyan-400/30 relative">
            <button
              onClick={() => setAboutOpen(false)}
              className="absolute top-3 right-3 text-cyan-400 hover:text-cyan-200"
              aria-label="Close"
            >
              <X size={28} />
            </button>
            <h2 className="text-2xl font-bold mb-4 text-cyan-300">
              About Sumarrizr
            </h2>
            <p className="mb-4 text-neutral-200">
              <b>Sumarrizr</b> lets you instantly generate a 100 word summary
              for PDFs, docs, PPTs, videos, and plain text using AI. It’s fast,
              simple, and free for all!
            </p>
            <div className="text-neutral-400">
              <b>Upcoming features:</b>
              <ul className="list-disc ml-5 mt-1 space-y-1">
                <li>Support for more file types</li>
                <li>Multi-language support</li>
                <li>Summarize web articles and images</li>
                <li>User accounts for history/favorites</li>
                <li>Export summaries to PDF/Word</li>
              </ul>
            </div>
          </div>
        </div>
      )}
      {showSettingsMsg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#161d26] rounded-2xl p-8 max-w-xs w-full shadow-xl border border-cyan-400/30 relative text-center">
            <button
              onClick={() => setShowSettingsMsg(false)}
              className="absolute top-3 right-3 text-cyan-400 hover:text-cyan-200"
              aria-label="Close"
            >
              <X size={28} />
            </button>
            <h2 className="text-xl font-bold mb-4 text-cyan-300">Settings</h2>
            <p className="mb-2 text-neutral-200">
              We’re working on adding more settings options. Stay tuned!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
