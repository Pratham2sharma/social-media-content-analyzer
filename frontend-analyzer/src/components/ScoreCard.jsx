import React from "react";

const ScoreCard = ({ title, value, description }) => {
  return (
    <div className="rounded-lg border border-gray-600 bg-linear-to-br from-gray-700/50 to-gray-800/50 backdrop-blur-sm p-6 shadow-lg hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300">
      <p className="text-sm font-medium text-gray-400">{title}</p>
      <p className="mt-2 text-3xl font-bold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
        {value}
      </p>
      <p className="mt-3 text-sm text-gray-300 leading-relaxed">
        {description}
      </p>
    </div>
  );
};

export default ScoreCard;
