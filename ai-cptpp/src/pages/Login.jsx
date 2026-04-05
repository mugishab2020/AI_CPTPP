import React, { useState } from "react";
import { Mail, Lock, Eye, Shield, User, Briefcase, Users } from "lucide-react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toastSuccess, toastError } from "../utils/toast";

const Login = () => {
  const [role, setRole] = useState("MANAGER");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
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
          <form
            className="mt-8 space-y-5"
            onSubmit={async (e) => {
              e.preventDefault();
              setError("");

              try {
                const result = await login(email, password, role);

                if (result === true) {
                  const stored = localStorage.getItem("auth_user");
                  const loggedUser = stored ? JSON.parse(stored) : null;
                  const userRole = loggedUser?.role;
                  toastSuccess(`Welcome back, ${loggedUser?.name ?? 'there'}!`);
                  if (userRole === "ADMIN") navigate("/admin");
                  else if (userRole === "MANAGER") navigate("/projectmanager");
                  else if (userRole === "CLIENT") navigate("/client_dashboard");
                  else if (userRole === "TEAM_MEMBER") navigate("/team-member");
                  else navigate("/");
                } else {
                  toastError("Invalid email or password");
                  setError("Invalid credentials");
                }
              } catch (err) {
                console.error("Login error:", err);
                toastError("Login failed. Please try again.");
                setError("Login failed");
              }
            }}
          >

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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Eye className="text-gray-400 cursor-pointer" size={18} />
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label className="text-sm font-medium text-gray-600">
                Login As
              </label>

              <div className="grid grid-cols-4 gap-3 mt-3">

                {/* Admin */}
                <button
                  type="button"
                  onClick={() => setRole("ADMIN")}
                  className={`border rounded-xl py-4 flex flex-col items-center text-sm font-medium transition ${
                    role === "ADMIN"
                      ? "border-sky-500 text-sky-600 shadow-md"
                      : "border-gray-200 text-gray-500"
                  }`}
                >
                  <Shield size={20} />
                  <span className="mt-2">Admin</span>
                </button>

                {/* Manager */}
                <button
                  type="button"
                  onClick={() => setRole("MANAGER")}
                  className={`border rounded-xl py-4 flex flex-col items-center text-sm font-medium transition ${
                    role === "MANAGER"
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
                  onClick={() => setRole("CLIENT")}
                  className={`border rounded-xl py-4 flex flex-col items-center text-sm font-medium transition ${
                    role === "CLIENT"
                      ? "border-sky-500 text-sky-600 shadow-md"
                      : "border-gray-200 text-gray-500"
                  }`}
                >
                  <User size={20} />
                  <span className="mt-2">Client</span>
                </button>

                {/* Team Member */}
                <button
                  type="button"
                  onClick={() => setRole("TEAM_MEMBER")}
                  className={`border rounded-xl py-4 flex flex-col items-center text-sm font-medium transition ${
                    role === "TEAM_MEMBER"
                      ? "border-sky-500 text-sky-600 shadow-md"
                      : "border-gray-200 text-gray-500"
                  }`}
                >
                  <Users size={20} />
                  <span className="mt-2">Team</span>
                </button>

              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <input type="checkbox" className="w-4 h-4" />
              <span>Remember me</span>
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            {/* Sign In Button */}
            <button
              type="submit"
              className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 rounded-xl shadow-md transition"
            >
              Sign In
            </button>


            {/* Signup */}
            <p className="text-center text-sm text-gray-500 mt-6">
              Don’t have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/register")}
              >
                <span className="text-sky-500 font-medium hover:underline">
                  Sign up
                </span>
              </button>
            </p>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;