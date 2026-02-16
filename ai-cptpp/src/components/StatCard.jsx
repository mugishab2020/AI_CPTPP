import React from "react";

const StatCard = ({ title, value, percent, icon, color }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex justify-between items-center">
      
      {/* Left Info */}
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h2 className="text-2xl font-bold text-gray-900 mt-1">
          {value}
        </h2>

        <p className="text-green-600 text-xs mt-2">
          ↑ {percent} vs last month
        </p>
      </div>

      {/* Right Icon */}
      <div
        className={`w-10 h-10 flex items-center justify-center rounded-xl ${color}`}
      >
        {icon}
      </div>
    </div>
  );
};

export default StatCard;
