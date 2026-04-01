import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, User } from "lucide-react";
import Navbar from "../components/Navbar";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="flex justify-center items-center mt-10 px-4">
        <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-10 border border-gray-100">

          {/* Header */}
          <h2 className="text-3xl font-extrabold text-center text-gray-900">
            Create Account
          </h2>
          <p className="text-center text-gray-500 mt-2 text-sm">
            Sign up to get started with AI-CPTPP
          </p>

          {/* Form */}
          <form className="mt-8 space-y-5">

            {/* Full Name */}
            <div>
              <label className="text-sm font-medium text-gray-600">
                Full Name
              </label>
              <div className="flex items-center border rounded-xl px-3 mt-2">
                <User className="text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Enter your full name"
                  className="w-full px-3 py-3 outline-none text-sm"
                />
              </div>
            </div>

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
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  className="w-full px-3 py-3 outline-none text-sm"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword
                    ? <EyeOff className="text-gray-400" size={18} />
                    : <Eye className="text-gray-400" size={18} />
                  }
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-sm font-medium text-gray-600">
                Confirm Password
              </label>
              <div className="flex items-center border rounded-xl px-3 mt-2">
                <Lock className="text-gray-400" size={18} />
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm your password"
                  className="w-full px-3 py-3 outline-none text-sm"
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}>
                  {showConfirm
                    ? <EyeOff className="text-gray-400" size={18} />
                    : <Eye className="text-gray-400" size={18} />
                  }
                </button>
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <input type="checkbox" className="w-4 h-4" />
              <span>
                I agree to the{" "}
                <span className="text-sky-500 font-medium cursor-pointer hover:underline">
                  Terms & Conditions
                </span>
              </span>
            </div>

            {/* Sign Up Button */}
            <button
              type="button"
              onClick={() => navigate("/admin")}
              className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 rounded-xl shadow-md transition"
            >
              Create Account
            </button>

            {/* Login Link */}
            <p className="text-center text-sm text-gray-500 mt-6">
              Already have an account?{" "}
              <Link to="/login" className="text-sky-500 font-medium hover:underline">
                Sign in
              </Link>
            </p>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
