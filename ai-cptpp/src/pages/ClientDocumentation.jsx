import React from 'react';
import { 
  Plus, Search, Folder, FileText, Eye, Download, MoreVertical 
} from 'lucide-react';

import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

const ClientDocumentation = () => {
  const stats = [
    { label: "Total Documents", value: "127", color: "text-slate-900" },
    { label: "Total Folders", value: "8", color: "text-green-600" },
    { label: "Total Size", value: "245 GB", color: "text-blue-600" },
    { label: "Pending Reviews", value: "5", color: "text-red-600" },
  ];

  const folders = [
    { name: "Contracts", items: "8 items", modified: "2/8/2024" },
    { name: "Design Assets", items: "8 items", modified: "2/8/2024" },
    { name: "Specifications", items: "8 items", modified: "2/8/2024" },
    { name: "Reports", items: "8 items", modified: "2/8/2024" },
  ];

  const documents = [
    { name: "Project Charter - E-Commerce", versions: "3 versions", project: "E-Commerce Platform", size: "2.4 MB", access: "Private", date: "2/15/2025" },
    { name: "Technical Specifications", versions: "3 versions", project: "Mobile App Redesign", size: "2.4 MB", access: "Shared", date: "2/15/2025" },
  ];

  return (
    <div className="flex h-screen bg-white font-sans overflow-hidden">
      <Sidebar activePage="documentation" />

      <div className="flex-1 flex flex-col p-9 min-w-0">
        <Topbar />

        <main className="flex-1 overflow-y-auto px-10 py-8 bg-slate-50/30">
          
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Document Management</h1>
              <p className="text-slate-500 text-sm font-medium mt-1">Store, organize, and share project documents</p>
            </div>
            <button className="bg-[#00A6C0] hover:bg-cyan-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-bold shadow-sm transition-all">
              <Plus size={20} strokeWidth={3} />
              upload document
            </button>
          </div>

          {/* 1. Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white p-8 rounded-[1.5rem] border border-slate-100 shadow-sm">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{stat.label}</p>
                <h3 className={`text-3xl font-black ${stat.color}`}>{stat.value}</h3>
              </div>
            ))}
          </div>

          {/* 2. Search Bar */}
          <div className="relative mb-10">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search users..." 
              className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none"
            />
          </div>

          {/* 3. Folder Grid */}
          <div className="mb-12">
            <h2 className="text-xl font-black text-slate-900 mb-6">Folder</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {folders.map((folder, i) => (
                <div key={i} className="bg-[#F8FAFF] border border-blue-100 p-6 rounded-[1.5rem] group hover:bg-blue-600 transition-all cursor-pointer">
                  <div className="bg-white w-12 h-12 rounded-xl flex items-center justify-center mb-6 shadow-sm group-hover:bg-blue-500">
                    <Folder className="text-blue-600 group-hover:text-white" size={24} />
                  </div>
                  <h4 className="font-bold text-slate-800 text-lg group-hover:text-white transition-colors">{folder.name}</h4>
                  <div className="flex justify-between mt-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase group-hover:text-blue-100">{folder.items}</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase group-hover:text-blue-100">Modified {folder.modified}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Recent Documents Table */}
          <div>
            <h2 className="text-xl font-black text-slate-900 mb-6">Recent Documents</h2>
            <div className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Name</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Projects</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Size</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Access</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Uploaded</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {documents.map((doc, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <FileText className="text-blue-600" size={20} />
                          <div>
                            <p className="text-sm font-bold text-slate-800">{doc.name}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">{doc.versions}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-xs font-bold text-slate-500">{doc.project}</td>
                      <td className="px-8 py-6 text-xs font-black text-slate-900">{doc.size}</td>
                      <td className="px-8 py-6 text-center">
                        <div className="flex items-center justify-center gap-1.5 text-[10px] font-black text-slate-400 uppercase">
                          {doc.access === 'Private' ? '🔒' : '🌐'} {doc.access}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-400">
                           {doc.date}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center justify-center gap-4 text-slate-300">
                          <Eye size={18} className="hover:text-blue-600 cursor-pointer" />
                          <Download size={18} className="hover:text-blue-600 cursor-pointer" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};

export default ClientDocumentation;