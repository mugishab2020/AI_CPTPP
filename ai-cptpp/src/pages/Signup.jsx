import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, Shield, Briefcase, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toastSuccess, toastError } from '../utils/toast';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('CLIENT'); // Default role
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { register } = useAuth();

  const roles = [
    { id: 'ADMIN', icon: <Shield size={24} />, label: 'Admin' },
    { id: 'MANAGER', icon: <Briefcase size={24} />, label: 'Manager' },
    { id: 'CLIENT', icon: <Users size={24} />, label: 'Client' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Navbar matching Login Screen */}
      <nav className="flex justify-between items-center px-12 py-6">
        <div className="flex items-center gap-2">
          <div className="bg-[#00A6C0] p-1.5 rounded-lg">
            <div className="text-white font-black text-xs italic">AI</div>
          </div>
          <span className="font-bold text-slate-800 tracking-tight">AI-CPTPP</span>
        </div>
        <div className="flex gap-8 items-center text-sm font-medium text-slate-500">
          <a href="#" className="hover:text-slate-800">Features</a>
          <a href="#" className="hover:text-slate-800">Contact</a>
          <a href="#" className="hover:text-slate-800">Faqs</a>
          <a href="/login" className="text-[#00A6C0] font-bold">Sign in</a>
        </div>
      </nav>

      {/* Register Card Container */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 w-full max-w-md border border-slate-100">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-slate-800">Create Account</h1>
            <p className="text-slate-400 text-sm font-medium mt-2 tracking-wide">
              Join us to start managing your projects
            </p>
          </div>

          <form className="space-y-5"
            onSubmit={async (e) => {
              e.preventDefault();
              setError('');
              try {
                const ok = await register(name, email, password, role);
                if (ok) {
                  toastSuccess('Account created! Please sign in.');
                  navigate('/login');
                } else {
                  toastError('Registration failed. Please try again.');
                  setError('Registration failed');
                }
              } catch (err) {
                console.error('Registration error:', err);
                toastError('Registration failed. Please try again.');
                setError('Registration failed');
              }
            }}
          >
            {/* Full Name Field */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  type="text" 
                  placeholder="Enter your name"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A6C0]/20 focus:border-[#00A6C0] transition-all"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A6C0]/20 focus:border-[#00A6C0] transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Create a password"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A6C0]/20 focus:border-[#00A6C0] transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Role Selection Tiles */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 ml-1">
                Register As
              </label>
              <div className="grid grid-cols-3 gap-3">
                {roles.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setRole(item.id)}
                    className={`flex flex-col items-center justify-center py-4 rounded-2xl border transition-all ${
                      role === item.id 
                        ? 'border-[#00A6C0] bg-white text-[#00A6C0] shadow-md shadow-cyan-100/50' 
                        : 'border-slate-100 bg-white text-slate-300 hover:border-slate-200 hover:text-slate-400'
                    }`}
                  >
                    {item.icon}
                    <span className={`text-[10px] font-black uppercase mt-2 tracking-widest ${
                      role === item.id ? 'text-[#00A6C0]' : 'text-slate-400'
                    }`}>
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button className="w-full bg-[#00A6C0] hover:bg-cyan-600 text-white font-black py-4 rounded-2xl shadow-lg shadow-cyan-200 transition-all active:scale-[0.98] mt-4 tracking-widest uppercase text-sm">
              Sign Up
            </button>
            {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
          </form>

          <p className="text-center mt-8 text-sm font-medium text-slate-400">
            Already have an account? <a href="/login" className="text-[#00A6C0] font-bold">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;