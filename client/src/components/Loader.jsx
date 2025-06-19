import React from "react";

export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center mt-8">
      <svg
        width="64"
        height="64"
        viewBox="0 0 64 64"
        style={{ display: "block" }}
        className="loader-pencil"
      >
        {/* Pencil body */}
        <rect
          x="28"
          y="12"
          width="8"
          height="28"
          rx="2"
          fill="#fff"
          stroke="#bbb"
          strokeWidth="1.2"
        />
        {/* Wood part */}
        <polygon
          points="28,40 36,40 32,48"
          fill="#eab676"
          stroke="#b4844a"
          strokeWidth="0.7"
        />
        {/* Pencil tip (sharp triangle) */}
        <polygon
          points="30,46 34,46 32,52"
          fill="#fff" // White tip
          stroke="#222" // Dark outline for contrast
          strokeWidth="1.1" // Slightly thicker outline for better separation
        />
        {/* Eraser */}
        <rect
          x="28"
          y="8"
          width="8"
          height="6"
          rx="2"
          fill="#ef476f"
          stroke="#bbb"
          strokeWidth="1.2"
        />
      </svg>

      {/* Writing squiggle */}
      <svg
        width="54"
        height="24"
        viewBox="0 0 54 24"
        style={{ marginTop: "-10px", marginLeft: "10px" }}
        className="pointer-events-none"
      >
        <path
          id="squiggle"
          d="M 4 20 Q 12 12, 20 20 T 36 20 T 52 20"
          fill="none"
          stroke="#39e1e6"
          strokeWidth="4"
          strokeLinecap="round"
        >
          <animate
            attributeName="stroke-dashoffset"
            values="48;0;48"
            keyTimes="0;0.5;1"
            dur="1.1s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="stroke-dasharray"
            values="0,52;52,0;0,52"
            keyTimes="0;0.5;1"
            dur="1.1s"
            repeatCount="indefinite"
          />
        </path>
      </svg>
      <style>{`
        .loader-pencil {
          animation: pencil-write 1.1s infinite cubic-bezier(.5,1.8,.7,1.2);
          transform-origin: 50% 95%;
        }
        @keyframes pencil-write {
          0%   { transform: translateY(0px) rotate(-18deg);}
          18%  { transform: translateY(-2px) rotate(-12deg);}
          38%  { transform: translateY(-6px) rotate(-8deg);}
          52%  { transform: translateY(-4px) rotate(0deg);}
          75%  { transform: translateY(-7px) rotate(8deg);}
          100% { transform: translateY(0px) rotate(-18deg);}
        }
      `}</style>
    </div>
  );
}
