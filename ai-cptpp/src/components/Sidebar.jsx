import React, { useState } from "react";
import {
  LayoutDashboard,
  CreditCard,
  BarChart3,
  Users,
  FileText,
  MessageSquare,
  ClipboardList,
  LogOut,
  // new icons
  ChartBarStacked,
  ChartColumnStacked,
  FileStack,
  SquareStack,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const Sidebar = ({ userType: propUserType }) => {
  // determine logged-in role from auth context
  const { user } = useAuth();

  // normalize a role string into the keys used by sidebarMenus
  const normalize = (role) => {
    if (!role) return null;
    return role.toLowerCase().replace(/ /g, "_");
  };

  // prefer authenticated user; fall back to prop for testing or pages with static value
  const resolvedType = normalize(user?.role) || propUserType || "guest";
  const navigate = useNavigate();
  const location = useLocation();

  const sidebarMenus = {
    admin: [
      { name: "Dashboard", icon: <LayoutDashboard size={18} />, navigation: "/admin" },
      // projects icon changed to stacked bar chart
      { name: "Projects", icon: <ChartBarStacked size={18} />, navigation: "/projects" },
      { name: "Payments", icon: <CreditCard size={18} />, navigation: "/payments" },
      // AI analytics using column-stacked chart (no axes)
      { name: "AI Analytics", icon: <ChartColumnStacked size={18} />, navigation: "/ai-analytics" },
      { name: "Users", icon: <Users size={18} />, navigation: "/users" },
      // documentation icon uses file stack
      { name: "Documentation", icon: <FileStack size={18} />, navigation: "/documentation" },
      // communication icon uses square stack
      { name: "Communication", icon: <SquareStack size={18} />, navigation: "/communication" },
      { name: "Report", icon: <ClipboardList size={18} />, navigation: "/reports" },
    ],
    client: [
      { name: "Dashboard", icon: <LayoutDashboard size={18} />, navigation: "/client_dashboard" },
      { name: "Projects", icon: <ChartBarStacked size={18} />, navigation: "/client_projects" },
      { name: "Invoice", icon: <CreditCard size={18} />, navigation: "/invoice" },
      { name: "Documentation", icon: <FileStack size={18} />, navigation: "/documentation" },
      { name: "Communication", icon: <SquareStack size={18} />, navigation: "/client_communication" },
    ],
    manager: [
      { name: "Dashboard", icon: <LayoutDashboard size={18} />, navigation: "/projectmanager" },
      { name: "Projects", icon: <ChartBarStacked size={18} />, navigation: "/pm_projects" },
      { name: "AI Analytics", icon: <ChartColumnStacked size={18} />, navigation: "/ai-analytics" },
      { name: "Team Members", icon: <Users size={18} />, navigation: "/team_members" },
      { name: "Documentation", icon: <FileStack size={18} />, navigation: "/documentation" },
      { name: "Communication", icon: <SquareStack size={18} />, navigation: "/communication" },
    ],
    team_member: [
      { name: "Dashboard", icon: <LayoutDashboard size={18} />, navigation: "/team-member" },
      { name: "Projects", icon: <ChartBarStacked size={18} />, navigation: "/team-member/projects" },
      { name: "Tasks", icon: <ClipboardList size={18} />, navigation: "/team-member/tasks" },
      { name: "Reports", icon: <BarChart3 size={18} />, navigation: "/team-member/reports" },
      { name: "Communication", icon: <SquareStack size={18} />, navigation: "/team-member/communication" },
      { name: "Documentation", icon: <FileStack size={18} />, navigation: "/team-member/documentation" },
    ],
  };

  const menuItems = sidebarMenus[resolvedType] || [];

  // dynamic profile info based on authenticated user
  let userInfo;
  if (user) {
    const nameFromEmail = user.email?.split("@")[0] || "User";
    userInfo = { name: nameFromEmail, role: user.role };
  } else if (propUserType) {
    // fallback static profiles if prop provided
    const profiles = {
      admin: { name: "Administrator", role: "Admin" },
      manager: { name: "Manager", role: "Manager" },
      client: { name: "Client", role: "Client" },
    };
    userInfo = profiles[propUserType];
  }

  return (
    <>
    <div className="w-64 shrink-0" /> {/* spacer so content isn't hidden behind fixed sidebar */}
    <div className="fixed top-0 left-0 w-64 h-screen bg-[#182134] text-gray-300 flex flex-col justify-between z-40">
      <div className="flex-1 overflow-y-auto">
        {/* Logo */}
        <div className="flex items-center gap-2 px-6 py-6">
          <div className="w-9 h-9 bg-sky-500 rounded-lg flex items-center justify-center text-white font-bold">
            AI
          </div>
          <h1 className="text-white font-semibold text-lg">AI-CPTPP</h1>
        </div>

        {/* Menu */}
        <nav className="mt-6 space-y-2 px-4">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.navigation;

            return (
              <button
                key={index}
                onClick={() => navigate(item.navigation)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition
                  ${
                    isActive
                      ? "bg-sky-600 text-white"
                      : "hover:bg-slate-800"
                  }`}
              >
                {item.icon}
                {item.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom User Info */}
      <div className="px-6 py-6 border-t border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-sky-600 rounded-full flex items-center justify-center text-white">
            {userInfo.name.charAt(0)}
          </div>
          <div>
            <p className="text-white font-semibold text-sm">{userInfo.name}</p>
            <p className="text-gray-400 text-xs">{userInfo.role}</p>
          </div>
        </div>

        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 text-red-400 mt-5 text-sm hover:text-red-500"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
    </>
  );
};

export default Sidebar;