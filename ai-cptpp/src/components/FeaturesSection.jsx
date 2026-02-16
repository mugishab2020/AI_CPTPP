import React from "react";
import FeatureCard from "./FeatureCard";

const FeaturesSection = () => {
  const features = [
    {
      title: "Real-Time Analytics",
      description:
        "Monitor project progress, team performance, and financial metrics with interactive dashboards and custom reports.",
    },
    {
      title: "Secure Payments",
      description:
        "PCI-compliant payment processing, automated invoicing, and transparent transaction management.",
    },
    {
      title: "Document Management",
      description:
        "Centralized storage, version control, electronic signatures, and access permissions for all project documents.",
    },
    {
      title: "Team Collaboration",
      description:
        "Unified communication, task assignment, and real-time activity feeds for seamless team coordination.",
    },
    {
      title: "AI-Powered Insights",
      description:
        "Predictive delay forecasting, risk assessment, and intelligent recommendations to keep projects on track.",
    },
    {
      title: "Automation",
      description:
        "Automated notifications, scheduled reports, templated communications, and workflow optimization.",
    },
  ];

  return (
    <div className="mt-20 px-10 max-w-6xl mx-auto">
      {/* Section Heading */}
      <h2 className="text-3xl font-extrabold text-center text-gray-900">
        Powerful Features for Modern Teams
      </h2>

      <p className="text-center text-gray-500 mt-4 max-w-2xl mx-auto">
        Everything you need to manage projects, communicate with clients, and
        process payments securely — powered by AI.
      </p>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>

      {/* CTA Banner */}
      <div className="mt-20 rounded-3xl p-12 bg-gradient-to-r from-blue-500 to-green-500 text-white text-center shadow-lg">
        <h2 className="text-3xl font-extrabold">
          Ready to transform your project management?
        </h2>

        <p className="mt-4 text-white/90 max-w-2xl mx-auto">
          Join hundreds of companies using AI-CPTPP to streamline their operations
          and improve client satisfaction.
        </p>

        <button className="mt-8 bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-xl font-semibold shadow-md transition">
          Get Started →
        </button>
      </div>
    </div>
  );
};

export default FeaturesSection;
