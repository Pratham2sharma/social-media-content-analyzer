import React from "react";

const SuggestionItem = ({ text }) => {
  const isPositive = text.includes("Great") || text.includes("Excellent");
  const Icon = isPositive ? (
    <svg
      className="h-5 w-5 text-green-400"
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    </svg>
  ) : (
    <svg
      className="h-5 w-5 text-amber-400"
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path
        fillRule="evenodd"
        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM10 13a1 1 0 100-2 1 1 0 000 2zm-1-4a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
        clipRule="evenodd"
      />
    </svg>
  );
  return (
    <li className="flex items-start p-3 rounded-lg bg-gray-700/30 border border-gray-600/50 hover:bg-gray-700/50 transition-all duration-200">
      <span className="mr-3 mt-0.5 shrink-0">{Icon}</span>
      <span className="text-gray-200 leading-relaxed">{text}</span>
    </li>
  );
};

export default SuggestionItem;
