import React from "react";

const UploadIcon = () => {
  return (
    <div className="relative">
      <svg
        className="h-16 w-16 text-gray-400"
        stroke="currentColor"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 13h6m-3-3v6M5 17l7-7 7 7M5 7a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H7a2 2 0 01-2-2V7z"
        />
      </svg>
      <div className="absolute inset-0 h-16 w-16 animate-pulse rounded-full bg-blue-400/10"></div>
    </div>
  );
};

export default UploadIcon;
