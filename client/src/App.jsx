import { useState } from "react";
import Loader from "./components/Loader";
import bgMain from "./assets/bg_main.jpg";

function App() {
  const [videoUrl, setVideoUrl] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSummarize = async () => {
    setLoading(true);
    setSummary("");
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: videoUrl }),
      });

      const data = await res.json();
      if (res.ok) {
        setSummary(data.summary);
      } else {
        setError(data.error || "Failed to summarize video");
      }
    } catch (err) {
      setError("Failed to connect to Server");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500); // Reset after 1.5s
  };

  return (
    <div className="flex flex-col min-h-screen text-white relative overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 -z-20 w-full h-full"
        style={{
          background: `url(${bgMain}) center/cover no-repeat`,
          height: "100%", // <-- This is the key! Was "100vh" before.
        }}
      />
      <div className="absolute inset-0 -z-10 w-full h-full bg-gradient-to-b from-black/80 via-teal-900/40 to-black/90" />
      
      {/* Header */}
      <header className="w-full py-5 px-4 bg-neutral-950/80 border-b border-neutral-900 shadow-lg backdrop-blur-md z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <span className="text-3xl font-extrabold tracking-tight select-none bg-gradient-to-r from-cyan-400 via-teal-300 to-white bg-clip-text text-transparent drop-shadow">
            Suma<span className="text-white">rrize</span>
          </span>
          <span className="text-neutral-200 font-light text-lg hidden md:block">
            Summarize any YouTube video in seconds!
          </span>
        </div>
      </header>

      {/* Main card */}
      <main className="flex-1 flex flex-col items-center justify-center px-2">
        <div className="w-full max-w-xl bg-[#111827]/95 rounded-3xl shadow-2xl p-10 mt-10 mb-10 flex flex-col items-center border border-cyan-200/25 ring-2 ring-cyan-400/10 backdrop-blur-xl transition-all hover:scale-[1.01] hover:shadow-[0_4px_60px_0_rgba(0,255,255,0.25)]">
          <h1 className="text-5xl font-black mb-8 text-center tracking-tight bg-gradient-to-r from-cyan-300 via-teal-300 to-white bg-clip-text text-transparent drop-shadow-lg">
            Sumarrise
          </h1>
          <input
            type="text"
            className="w-full px-5 py-3 rounded-lg border border-neutral-700 bg-neutral-950/70 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition mb-6 placeholder:text-neutral-400"
            placeholder="Paste your video URL here"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            disabled={loading}
          />
          <button
            className="w-full py-3 rounded-lg font-bold text-lg bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-teal-400 hover:to-cyan-500 shadow-xl hover:scale-105 transition-all duration-150 disabled:opacity-50"
            onClick={handleSummarize}
            disabled={loading || !videoUrl}
          >
            {loading ? "Summarizing..." : "Summarize"}
          </button>

          {/* Loader, summary, or error */}
          {loading ? (
            <div className="mt-8 flex justify-center">
              <Loader />
              {/* Or, use this for a simple animated spinner:
            <div className="w-12 h-12 border-4 border-t-cyan-400 border-b-teal-400 border-r-transparent border-l-transparent rounded-full animate-spin"></div>
            */}
            </div>
          ) : (
            <>
              {summary && (
                <div className="mt-8 w-full bg-neutral-950/70 border border-cyan-400/20 rounded-lg p-6 text-base leading-relaxed shadow-lg relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-cyan-300">
                      Summary:
                    </span>
                    <button
                      className={`ml-2 px-3 py-1 rounded-md text-xs font-bold border border-cyan-400 transition bg-cyan-600 hover:bg-cyan-500 active:scale-95 focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
                        copied ? "bg-green-600 border-green-400" : ""
                      }`}
                      onClick={handleCopy}
                    >
                      {copied ? "Copied!" : "Copy"}
                    </button>
                  </div>
                  <div className="whitespace-pre-line">{summary}</div>
                </div>
              )}
              {error && (
                <div className="mt-6 w-full flex items-center justify-center gap-2 text-red-400 bg-red-900/40 border border-red-400/40 font-semibold text-center rounded-lg p-4 animate-pulse shadow">
                  <svg
                    className="w-5 h-5 text-red-400 inline-block mr-1"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 8v4m0 4h.01m-6.938 4h13.856c1.054 0 1.658-1.14 1.105-2.016l-6.928-12.07a1.25 1.25 0 0 0-2.21 0l-6.928 12.07c-.553.876.051 2.016 1.105 2.016z" />
                  </svg>
                  <b>Error:</b> {error}
                </div>
              )}
            </>
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
