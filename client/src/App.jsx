import { useState } from "react";
import Loader from "./components/Loader";

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
    <div className="flex flex-col min-h-screen bg-neutral-900 text-white">
      {/* Header */}
      <header className="w-full py-5 px-4 bg-neutral-950 border-b border-neutral-800 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <span className="text-2xl font-extrabold tracking-tight select-none">
            <span className="text-blue-400">Suma</span>
            <span className="text-white">rrize</span>
          </span>
          <span className="text-neutral-400 font-light text-lg bold hidden md:block">
            Summarize any YouTube video in seconds!
          </span>
        </div>
      </header>

      {/* Main card */}
      <main className="flex-1 flex flex-col items-center justify-center px-2">
        <div className="w-full max-w-xl bg-neutral-800 rounded-2xl shadow-xl p-8 mt-8 mb-8 flex flex-col items-center">
          <h1 className="text-4xl font-bold mb-8 text-center tracking-tight">
            Sumarrise
          </h1>
          <input
            type="text"
            className="w-full px-4 py-2 rounded-lg border border-neutral-700 bg-neutral-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition mb-6"
            placeholder="Paste your video URL here"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            disabled={loading}
          />
          <button
            className="w-full py-3 rounded-lg font-semibold text-lg bg-blue-600 hover:bg-blue-700 transition disabled:opacity-60"
            onClick={handleSummarize}
            disabled={loading || !videoUrl}
          >
            {loading ? "Summarizing..." : "Summarize"}
          </button>

          {/* Loader, summary, or error */}
          {loading ? (
            <Loader />
          ) : (
            <>
              {summary && (
                <div className="mt-8 w-full bg-neutral-900 border border-blue-700 rounded-lg p-5 text-base leading-relaxed shadow-lg relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-blue-300">
                      Summary:
                    </span>
                    <button
                      className={`ml-2 px-3 py-1 rounded-md text-xs font-bold border border-blue-400 transition bg-blue-600 hover:bg-blue-700 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
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
                <div className="mt-6 w-full bg-red-950 border border-red-600 text-red-300 font-semibold text-center rounded-lg p-4 shadow-lg flex items-center justify-center gap-2">
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
      <footer className="w-full py-4 text-center text-sm text-neutral-500 bg-neutral-950 border-t border-neutral-800">
        &copy; {new Date().getFullYear()} Sumarrise &mdash; Built for devs, by
        devs.
      </footer>
    </div>
  );
}

export default App;
