import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="mt-6 flex flex-col items-center justify-center text-center">
      <div className="relative">
        <svg
          className="h-10 w-10 animate-spin text-blue-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <div className="absolute inset-0 h-10 w-10 animate-ping rounded-full bg-blue-400/20"></div>
      </div>
      <p className="mt-4 text-sm font-medium text-gray-300">
        Processing your file... This may take a moment.
      </p>
    </div>
  );
};

export default LoadingSpinner;
