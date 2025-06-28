import { useRef, useEffect, useState } from "react";
import bgMain from "./assets/bg_main.jpg";
import Tabs from "./components/Tabs";
import VideoSummarizer from "./components/VideoSummarizr";
import TextSummarizer from "./components/textSummarizr";

function App() {
  const [currentTab, setCurrentTab] = useState("video");
  const [triggerScroll, setTriggerScroll] = useState(false);
  const summaryRef = useRef(null);

  useEffect(() => {
    if (triggerScroll && summaryRef.current) {
      summaryRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      setTriggerScroll(false);
    }
  }, [triggerScroll]);

  return (
    <div className="flex flex-col min-h-screen text-white relative overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 -z-20 w-full h-full"
        style={{
          background: `url(${bgMain}) center/cover no-repeat`,
          height: "100%",
        }}
      />
      <div className="absolute inset-0 -z-10 w-full h-full bg-gradient-to-b from-black/80 via-teal-900/40 to-black/90" />

      {/* Header */}
      <header className="w-full py-5 px-4 bg-neutral-950/80 border-b border-neutral-900 shadow-lg backdrop-blur-md z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <span className="text-3xl font-extrabold tracking-tight select-none bg-gradient-to-r from-cyan-400 via-teal-300 to-white bg-clip-text text-transparent drop-shadow">
            Suma<span className="text-white">rrizr</span>
          </span>
          <span className="text-neutral-200 font-light text-lg hidden md:block">
            Summarize anything in seconds!
          </span>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center px-2 py-6 transition-all duration-300">
        {/* Tabs */}
        <div className="w-full flex justify-center mb-10">
          <Tabs current={currentTab} setCurrent={setCurrentTab} />
        </div>

        {/* Active Panel */}
        <div className="w-full flex justify-center">
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
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 text-center text-sm text-neutral-400 bg-neutral-950/60 border-t border-neutral-800/60">
        &copy; {new Date().getFullYear()} Sumarrise &mdash; Built for devs, by
        devs.
      </footer>
    </div>
  );
}

export default App;
