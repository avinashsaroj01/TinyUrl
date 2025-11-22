import React from "react";

const StatCard = ({ title, value, description }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 transform hover:scale-[1.01] transition duration-300">
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="mt-1 text-3xl font-extrabold text-indigo-600 truncate">
        {value}
      </p>
      {description && (
        <p className="mt-2 text-xs text-gray-400">{description}</p>
      )}
    </div>
  );
};

export default StatCard;
