import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import { Plus, Search, Eye, FileEdit, Trash2, Bell, Settings } from "lucide-react";

const Projects = () => {
  const userType = "admin";
  const [searchTerm, setSearchTerm] = useState("");

  const projects = [
    { name: "E-Commerce Platform", client: "Tech Corp", progress: 95, status: "In Progress", budget: "$50,000", spent: "$37,500", teamCount: 5 },
    { name: "Mobile App Redesign", client: "StartUp Inc", progress: 95, status: "In Progress", budget: "$50,000", spent: "$37,500", teamCount: 3 },
    { name: "AI Integration", client: "Enterprise Ltd", progress: 95, status: "Completed", budget: "$50,000", spent: "$37,500", teamCount: 3 },
    { name: "Dashboard Upgrade", client: "Digital Inc", progress: 95, status: "Delayed", budget: "$50,000", spent: "$37,500", teamCount: 3 },
  ];

  const getStatusStyles = (status) => {
    switch (status) {
      case "In Progress": return "bg-blue-100 text-blue-600";
      case "Completed": return "bg-green-100 text-green-600";
      case "Delayed": return "bg-red-100 text-red-400";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Existing Sidebar */}
      <Sidebar userType={userType} />

      {/* Main Content Area - Adjusted margin and padding */}
      <div className="flex-1 ml-[20px] p-6 lg:p-10">
        
        {/* Top Utility Icons */}
        <div className="flex justify-end gap-5 mb-2 text-gray-400">
          <Bell size={20} className="cursor-pointer hover:text-gray-600" />
          <Settings size={20} className="cursor-pointer hover:text-gray-600" />
        </div>

        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Projects</h1>
            <p className="text-sm text-gray-500">Manage and track all your projects</p>
          </div>
          <button className="bg-[#00a3cc] hover:bg-[#008fb3] text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition shadow-sm text-sm">
            <Plus size={18} /> New Project
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search project..."
            className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-1 focus:ring-sky-500 outline-none transition text-sm"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Projects Table */}
        <div className="border border-gray-100 rounded-xl shadow-sm overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-gray-100 bg-white">
                <th className="p-4 text-sm text-slate-900 font-bold">Project Name</th>
                <th className="p-4 text-sm text-slate-900 font-bold">Client</th>
                <th className="p-4 text-sm text-slate-900 font-bold">Progress</th>
                <th className="p-4 text-sm text-slate-900 font-bold">Status</th>
                <th className="p-4 text-sm text-slate-900 font-bold">Budget</th>
                <th className="p-4 text-sm text-slate-900 font-bold text-center">Team</th>
                <th className="p-4 text-sm text-slate-900 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {projects.map((project, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-sm font-bold text-slate-800">{project.name}</td>
                  <td className="p-4 text-sm text-gray-600">{project.client}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-gray-100 rounded-full">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: `${project.progress}%` }}></div>
                      </div>
                      <span className="text-[11px] text-gray-400 font-medium">{project.progress}%</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusStyles(project.status)}`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-700 text-sm">{project.budget}</span>
                      <span className="text-[10px] text-gray-400">Spent: {project.spent}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center items-center -space-x-2">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="w-7 h-7 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-blue-600">
                            T
                          </div>
                        ))}
                        {project.teamCount > 3 && <span className="text-[10px] text-gray-400 ml-3">+{project.teamCount - 3}</span>}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-3 text-gray-400">
                      <Eye size={16} className="cursor-pointer hover:text-sky-500" />
                      <FileEdit size={16} className="cursor-pointer hover:text-sky-500" />
                      <Trash2 size={16} className="cursor-pointer hover:text-red-500" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Projects;