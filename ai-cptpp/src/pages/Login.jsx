import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, Shield, User, Briefcase } from "lucide-react";
import Navbar from "../components/Navbar";

const Login = () => {
  const [role, setRole] = useState("Project Manager");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar (simple top logo) */}
      <Navbar />

      {/* Login Card */}
      <div className="flex justify-center items-center mt-10 px-4">
        <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-10 border border-gray-100">
          
          {/* Header */}
          <h2 className="text-3xl font-extrabold text-center text-gray-900">
            Welcome Back
          </h2>
          <p className="text-center text-gray-500 mt-2 text-sm">
            Sign in to your account to continue
          </p>

          {/* Form */}
          <form className="mt-8 space-y-5">

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-gray-600">
                Email Address
              </label>
              <div className="flex items-center border rounded-xl px-3 mt-2">
                <Mail className="text-gray-400" size={18} />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-3 py-3 outline-none text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium text-gray-600">
                Password
              </label>
              <div className="flex items-center border rounded-xl px-3 mt-2">
                <Lock className="text-gray-400" size={18} />
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="w-full px-3 py-3 outline-none text-sm"
                />
                <Eye className="text-gray-400 cursor-pointer" size={18} />
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label className="text-sm font-medium text-gray-600">
                Login As
              </label>

              <div className="grid grid-cols-3 gap-3 mt-3">

                {/* Admin */}
                <button
                  type="button"
                  onClick={() => setRole("Admin")}
                  className={`border rounded-xl py-4 flex flex-col items-center text-sm font-medium transition ${
                    role === "Admin"
                      ? "border-sky-500 text-sky-600 shadow-md"
                      : "border-gray-200 text-gray-500"
                  }`}
                >
                  <Shield size={20} />
                  <span className="mt-2">Admin</span>
                </button>

                {/* Project Manager */}
                <button
                  type="button"
                  onClick={() => setRole("Project Manager")}
                  className={`border rounded-xl py-4 flex flex-col items-center text-sm font-medium transition ${
                    role === "Project Manager"
                      ? "border-sky-500 text-sky-600 shadow-md"
                      : "border-gray-200 text-gray-500"
                  }`}
                >
                  <Briefcase size={20} />
                  <span className="mt-2">Manager</span>
                </button>

                {/* Client */}
                <button
                  type="button"
                  onClick={() => setRole("Client")}
                  className={`border rounded-xl py-4 flex flex-col items-center text-sm font-medium transition ${
                    role === "Client"
                      ? "border-sky-500 text-sky-600 shadow-md"
                      : "border-gray-200 text-gray-500"
                  }`}
                >
                  <User size={20} />
                  <span className="mt-2">Client</span>
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <input type="checkbox" className="w-4 h-4" />
              <span>Remember me</span>
            </div>

            {/* Sign In Button */}
            <button
              type="button"
              onClick={() => navigate("/admin")}
              className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 rounded-xl shadow-md transition"
            >
              Sign In
            </button>

            {/* Signup */}
            <p className="text-center text-sm text-gray-500 mt-6">
              Don’t have an account?{" "}
              <Link to="/signup" className="text-sky-500 font-medium hover:underline">
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
