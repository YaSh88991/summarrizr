import React, { useRef, useState } from "react";

/**
  FileUploader component (reusable for any file type)
  Props:
  accept: string, file type filter (e.g. ".txt,text/plain")
  label: string, main label/instructions
  helperText: string, optional, shown below label
  onFile: function (file: File) => void
  disabled: bool (optional)
 */
function FileUploader({ accept, label, helperText, onFile, disabled = false }) {
  const fileInputRef = useRef();
  const [dragActive, setDragActive] = useState(false);

  // Handles clicks and drag events
  const handleClick = () => {
    if (!disabled) fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && onFile) onFile(file);
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
    const file = e.dataTransfer.files?.[0];
    if (file && onFile) onFile(file);
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

      <span className="text-cyan-200 font-medium text-lg select-none">
        {label || "Click or drag a file here to upload"}
      </span>
      
      {helperText && (
        <span className="text-neutral-400 mt-1 text-xs">{helperText}</span>
      )}
    </div>
  );
}

export default FileUploader;
