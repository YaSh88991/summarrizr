import React, { useState } from "react";
import { handleCopyToClipboard } from "../utils/copyToClipboard";
import FileUploader from "./FileUploader";
import Loader from "./Loader";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function DocsSummarizr({ summaryRef, triggerScroll }) {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Handles file select/remove + validation
  const handleFileUpload = (fileObj) => {
    setSummary("");
    setError("");
    setFile(null);

    if (!fileObj) {
      setSummary("");
      setError("");
      setFile(null);
      return;
    }
    // Validate type
    if (
      (!fileObj.type ||
        fileObj.type !==
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document") &&
      !fileObj.name.toLowerCase().endsWith(".docx")
    ) {
      setError("Please provide a DOCX file!");
      triggerScroll(true);
      return;
    }
    // Validate size
    if (fileObj.size > MAX_FILE_SIZE) {
      setError("File is too large (max 5MB).");
      triggerScroll(true);
      return;
    }
    setFile(fileObj);
  };

  // Submit file to backend
  //not using handlesumaaryAPI util function because we need officeparser lib for pdf/docs/ppt file types so we will have to do much customization in that function so instead using this new handler

  const handleSummarize = async () => {
    if (!file) return;

    setLoading(true);
    setSummary("");
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${API_URL}/api/summarize/docs`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setSummary(data.summary);
        setError("");
        triggerScroll(true);
      } else {
        setError(data.error || "Sorry! Unexpected error occurred!");
        triggerScroll(true);
      }
    } catch (err) {
      setError("Failed to connect to Server");
      triggerScroll(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => handleCopyToClipboard(summary, setCopied);

  return (
    <div className="w-full max-w-6xl bg-[#111827]/95 rounded-3xl shadow-2xl p-10 flex flex-col items-center border border-cyan-200/25 ring-2 ring-cyan-400/10 backdrop-blur-xl transition-all hover:scale-[1.01] hover:shadow-[0_4px_60px_0_rgba(0,255,255,0.25)]">
      <h1 className="text-5xl font-black mb-8 text-center tracking-tight bg-gradient-to-r from-cyan-300 via-teal-300 to-white bg-clip-text text-transparent drop-shadow-lg">
        Sumarrise
      </h1>
      <FileUploader
        accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        label="Click or drag a .docx file here to upload"
        helperText="Only .docx files are supported for DOCX summarization (max 5MB)"
        onFile={handleFileUpload}
        file={file}
        maxSizeMB={5}
      />
      <button
        className="w-full py-3 rounded-lg font-bold text-lg bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-teal-400 hover:to-cyan-500 shadow-xl hover:scale-105 transition-all duration-150 disabled:opacity-50"
        onClick={handleSummarize}
        disabled={loading || !file}
      >
        {loading ? "Summarizing..." : "Summarize"}
      </button>

      {/* Loader, summary, or error */}
      {loading ? (
        <div className="mt-8 flex justify-center">
          <Loader />
        </div>
      ) : (
        <>
          {summary && (
            <div
              ref={summaryRef}
              className="mt-8 w-full bg-neutral-950/70 border border-cyan-400/20 rounded-lg p-6 text-base leading-relaxed shadow-lg relative"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-cyan-300">Summary:</span>
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
            <div
              ref={summaryRef}
              className="mt-6 w-full flex items-center justify-center gap-2 text-red-400 bg-red-900/40 border border-red-400/40 font-semibold text-center rounded-lg p-4 animate-pulse shadow"
            >
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
  );
}
