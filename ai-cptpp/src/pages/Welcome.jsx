import React, { useEffect } from "react";

import FeaturesSection from "../components/FeaturesSection";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Welcome = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // If user is already logged in, redirect to their dashboard
    if (user) {
      if (user.role === "ADMIN") navigate("/admin");
      else if (user.role === "MANAGER") navigate("/projectmanager");
      else if (user.role === "CLIENT") navigate("/client_dashboard");
      else if (user.role === "TEAM_MEMBER") navigate("/team-member");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <div className="flex flex-col items-center text-center mt-20 px-6">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-snug">
          Intelligent Project Tracking <br />
          <span className="text-sky-500">& Payment Management</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 max-w-2xl text-gray-500 text-lg">
          Centralize project management, client communication, and payment
          processing with AI-powered insights. Get real-time visibility,
          predict delays, and manage payments securely.
        </p>

        {/* Buttons */}
        <div className="mt-10 flex gap-6">
          <button className="bg-sky-500 hover:bg-sky-600 text-white font-semibold px-8 py-3 rounded-xl flex items-center gap-2 shadow-md" 
          onClick={() => navigate("/login")}>
            Get Started →
          </button>

          <button className="border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold px-8 py-3 rounded-xl shadow-sm">
            Watch Demo
          </button>
        </div>

        {/* Trusted Section */}
        <p className="mt-14 text-gray-400 text-sm">
          Trusted by leading companies
        </p>

        <div className="flex gap-4 mt-6">
          <div className="w-14 h-10 bg-sky-100 rounded-lg"></div>
          <div className="w-14 h-10 bg-sky-100 rounded-lg"></div>
          <div className="w-14 h-10 bg-sky-50 rounded-lg"></div>
        </div>

        {/* Next Section Title */}
      
        
      </div>
      <FeaturesSection />
      <Footer />
    </div>
  );
};

export default Welcome;
