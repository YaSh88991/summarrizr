import React, { useRef, useState, useEffect } from "react";

/**
  FileUploader component (reusable for any file type)
  Props:
  accept: string, file type filter (e.g. ".txt,text/plain")
  label: string, main label/instructions
  helperText: string, optional, shown below label
  onFile: function (file: File|null) => void  // call with file or null if removed
  disabled: bool (optional)
  maxSizeMB: number (optional, for max file size validation, error shown in parent)
  file: File|null  // controlled mode
 */

function FileUploader({
  accept,
  label,
  helperText,
  onFile,
  disabled = false,
  maxSizeMB = 5,
  file, // controlled file
}) {
  const fileInputRef = useRef();
  const [dragActive, setDragActive] = useState(false);

  // Remove handler
  const handleRemove = (e) => {
    e.stopPropagation();
    if (onFile) onFile(null); // Let parent reset its state
  };

  // File input change
  const handleFileChange = (e) => {
    const fileObj = e.target.files?.[0];
    if (onFile) onFile(fileObj || null);
  };

  // Drag and drop logic
  const handleClick = () => {
    if (!disabled) fileInputRef.current.click();
  };
  const handleDragOver = (e) => {
    e.preventDefault();
    if (!disabled) setDragActive(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (disabled) return;
    const fileObj = e.dataTransfer.files?.[0];
    if (onFile) onFile(fileObj || null);
  };

  return (
    <div
      className={`
        max-w-6xl flex flex-col items-center justify-center border-2 
        ${dragActive ? "border-cyan-400" : "border-cyan-700/60"}
        border-dashed rounded-xl p-6 
        bg-[#16202a]/90 shadow-xl transition-all duration-150 cursor-pointer my-4 w-full max-w-lg
        hover:bg-[#16202a]/95 outline-none ring-2 ring-cyan-500/20
        ${disabled ? "opacity-60 pointer-events-none" : ""}
      `}
      style={{
        minHeight: "120px",
        boxShadow: dragActive
          ? "0 0 20px 4px #06b6d4, 0 2px 30px 0 #0e2230"
          : "0 2px 20px 0 rgba(0,255,255,0.10)",
      }}
      tabIndex={0}
      role="button"
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        accept={accept}
        onChange={handleFileChange}
        style={{ display: "none" }}
        disabled={disabled}
      />

      {/* Show prompt only if no file */}
      {!file ? (
        <>
          <span className="text-cyan-200 font-medium text-lg select-none">
            {label || "Click or drag a file here to upload"}
          </span>
          {helperText && (
            <span className="text-neutral-400 mt-1 text-xs">{helperText}</span>
          )}
        </>
      ) : (
        // Show file info and Remove button
        <div className="w-full flex items-center justify-between gap-4 bg-neutral-900/80 px-5 py-3 rounded-lg border border-cyan-700/30 max-w-md shadow">
          <span className="text-cyan-200 font-semibold truncate">
            {file.name}
          </span>
          <span className="text-xs text-neutral-400">
            ({(file.size / 1024 / 1024).toFixed(2)} MB)
          </span>
          <button
            className="ml-auto px-3 py-1 text-xs rounded bg-red-500/80 hover:bg-red-500 text-white font-semibold transition"
            onClick={handleRemove}
            type="button"
          >
            Remove
          </button>
        </div>
      )}
    </div>
  );
}

export default FileUploader;
