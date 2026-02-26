import React, { useState } from "react";
import {
  LayoutDashboard,
  FolderKanban,
  CreditCard,
  BarChart3,
  Users,
  FileText,
  MessageSquare,
  ClipboardList,
  LogOut,
} from "lucide-react";

const Sidebar = ({ userType }) => {
  const [activeItem, setActiveItem] = useState("Dashboard"); // default active

  const sidebarMenus = {
    admin: [
      { name: "Dashboard", icon: <LayoutDashboard size={18} /> },
      { name: "Projects", icon: <FolderKanban size={18} /> },
      { name: "Payments", icon: <CreditCard size={18} /> },
      { name: "AI Analytics", icon: <BarChart3 size={18} /> },
      { name: "Users", icon: <Users size={18} /> },
      { name: "Documentation", icon: <FileText size={18} /> },
      { name: "Communication", icon: <MessageSquare size={18} /> },
      { name: "Report", icon: <ClipboardList size={18} /> },
    ],
    client: [
      { name: "Dashboard", icon: <LayoutDashboard size={18} /> },
      { name: "Projects", icon: <FolderKanban size={18} /> },
      { name: "Invoice", icon: <CreditCard size={18} /> },
      { name: "Documentation", icon: <FileText size={18} /> },
      { name: "Communication", icon: <MessageSquare size={18} /> },
    ],
    project_manager: [
      { name: "Dashboard", icon: <LayoutDashboard size={18} /> },
      { name: "Projects", icon: <FolderKanban size={18} /> },
      { name: "AI Analytics", icon: <BarChart3 size={18} /> },
      { name: "Team Members", icon: <Users size={18} /> },
      { name: "Documentation", icon: <FileText size={18} /> },
      { name: "Communication", icon: <MessageSquare size={18} /> },
    ],
  };

  const menuItems = sidebarMenus[userType] || [];

  const userProfiles = {
    admin: { name: "Administrator", role: "Admin" },
    project_manager: { name: "Mkagiraneza", role: "Project Manager" },
    client: { name: "Mkagiraneza", role: "Client" },
  };

  const userInfo = userProfiles[userType] || { name: "Guest", role: "Guest" };

  return (
    <div className="w-64 h-screen bg-slate-900 text-gray-300 flex flex-col justify-between">
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
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => setActiveItem(item.name)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition
                ${
                  activeItem === item.name
                    ? "bg-sky-600 text-white"
                    : "hover:bg-slate-800"
                }`}
            >
              {item.icon}
              {item.name}
            </button>
          ))}
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

        <button className="flex items-center gap-2 text-red-400 mt-5 text-sm hover:text-red-500">
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
