import React from "react";

const FeatureCard = ({ title, description }) => {
  return (
    <div className="border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
      {/* Icon */}
      <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-blue-100 mb-4">
        <span className="text-blue-600 text-lg">⏱</span>
      </div>

      {/* Title */}
      <h3 className="font-bold text-gray-900 text-lg mb-2">
        {title}
      </h3>

      {/* Description */}
      <p className="text-gray-500 text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
};

export default FeatureCard;
