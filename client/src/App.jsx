import { useState } from "react";
import "./App.css";

function App() {
  //Setters for video url i/p, sumarry, loading and error messages
  const [videoUrl, setVideoUrl] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  return (
    <div className="sumarrise-container">
      <h1>Sumarrise</h1>
      <input
        className="video-url-input"
        type="text"
        placeholder="Paste your video URL here"
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
      />
      <button
        className="summarize-btn"
        onClick={handleSummarize}
        disabled={loading || !videoUrl}
      >
        {loading ? "Summarizing..." : "Summarize"}
      </button>
      
      {summary && (
        <div className="summary-box">
          <h2>Summary:</h2>
          <p>{summary}</p>
        </div>
      )}

      {error && (
        <div className="error-msg">
          <b>Error:</b> {error}
        </div>
      )}
    </div>
  );
}

export default App;
