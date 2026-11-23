import React from 'react';
import { 
  TrendingUp, DollarSign, Calendar, MessageSquare, 
  MoreVertical, Clock, FileText, Download 
} from 'lucide-react';

import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

const ClientDashboard = () => {
  // Data for mapping
  const activeProjects = [
    { id: 1, name: "Website Redesign", progress: 65, date: "2/15/2025", priority: "High", team: ["A", "B"] },
    { id: 2, name: "Mobile App Development", progress: 65, date: "2/15/2025", priority: "High", team: ["C", "D"] },
    { id: 3, name: "Website Redesign", progress: 65, date: "2/15/2025", priority: "High", team: ["A", "B"] },
    { id: 4, name: "Mobile App Development", progress: 65, date: "2/15/2025", priority: "High", team: ["C", "D"] },
  ];

  const milestones = [
    { title: "Design Approval", project: "Website Redesign", date: "2/15/2025" },
    { title: "Beta Release", project: "Mobile App Development", date: "2/15/2025" },
    { title: "Testing Phase", project: "Database Migration", date: "2/15/2025" },
  ];

  const recentDocs = [
    { name: "Project Charter.pdf", info: "Team Lead • 2 days ago" },
    { name: "Budget Allocation.xlsx", info: "Team Lead • 2 days ago" },
    { name: "Technical Specs.docx", info: "Team Lead • 2 days ago" },
  ];

  return (
    <div className="flex h-screen bg-white font-sans overflow-hidden">
      {/* 1. SIDEBAR - Client Profile */}
      <Sidebar activePage="dashboard" />

      <div className="flex-1 flex flex-col min-w-0 p-9">
        {/* 2. TOPBAR */}
        <Topbar />

        <main className="flex-1 overflow-y-auto px-10 py-8 bg-slate-50/30">
          
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Dashboard</h1>
            <p className="text-slate-500 text-sm font-medium mt-1">
              Track your projects, milestones, and documents in one place.
            </p>
          </div>

          {/* Stats Summary Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
             <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex justify-between items-start">
                <div>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Active Projects</p>
                  <h3 className="text-3xl font-bold text-slate-900 mt-2">3</h3>
                </div>
                <div className="bg-orange-50 p-3 rounded-2xl text-orange-400">
                  <TrendingUp size={24} />
                </div>
             </div>
             <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex justify-between items-start">
                <div>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Spent</p>
                  <h3 className="text-3xl font-bold text-slate-900 mt-2">$45K</h3>
                </div>
                <div className="bg-purple-50 p-3 rounded-2xl text-purple-400">
                  <DollarSign size={24} />
                </div>
             </div>
             <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex justify-between items-start">
                <div>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Upcoming Milestones</p>
                  <h3 className="text-3xl font-bold text-slate-900 mt-2">3</h3>
                </div>
                <div className="bg-indigo-50 p-3 rounded-2xl text-indigo-400">
                  <Calendar size={24} />
                </div>
             </div>
             <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex justify-between items-start">
                <div>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Unread Messages</p>
                  <h3 className="text-3xl font-bold text-slate-900 mt-2">2</h3>
                </div>
                <div className="bg-red-50 p-3 rounded-2xl text-red-400">
                  <MessageSquare size={24} />
                </div>
             </div>
          </div>

          {/* Project Grid - Refined Card Style */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
            {activeProjects.map((proj) => (
              <div key={proj.id} className="bg-white border border-slate-100 p-8 rounded-[2rem] shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-slate-800 text-xl">{proj.name}</h4>
                  <MoreVertical size={20} className="text-slate-300 cursor-pointer" />
                </div>
                <span className="bg-[#E8EDFF] text-[#4F73FF] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest inline-block">
                  In Progress
                </span>

                {/* Progress Section */}
                <div className="mt-8">
                  <div className="flex justify-between mb-2 items-center">
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-tighter">Progress</span>
                    <span className="text-sm font-black text-slate-900">{proj.progress}%</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#0055FF] rounded-full transition-all duration-1000" 
                      style={{ width: `${proj.progress}%` }} 
                    />
                  </div>
                </div>

                {/* Info Row */}
                <div className="flex justify-between items-center mt-6">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Calendar size={16} />
                    <span className="text-sm font-bold">{proj.date}</span>
                  </div>
                  <span className="text-sm font-black text-red-500">{proj.priority}</span>
                </div>

                {/* Bottom Row: Team and Actions */}
                <div className="mt-8 space-y-3 items-center justify-between border-t border-slate-50 pt-6">
                  <div className="flex items-center gap-4">
                    <p className='text-slate-400 text-xs font-bold uppercase tracking-widest'>Team:</p>
                    <div className="flex space-x-2">
                      {proj.team.map((initial, i) => (
                        <div 
                          key={i} 
                          className="w-9 h-9 rounded-full border-2 border-white bg-[#E8EDFF] flex items-center justify-center text-[11px] font-black text-[#4F73FF]"
                        >
                          {initial}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-3 justify-start">
                    <button className="w-[45%] px-5 py-2.5 border border-slate-200 rounded-2xl text-xs font-black text-slate-600 hover:bg-slate-50 transition-all">
                      Track Progress
                    </button>
                    <button className="w-[45%] px-8 py-2.5 bg-[#0022FF] text-white rounded-2xl text-xs font-black hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-95">
                      Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Sections: Milestones and Documents */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Upcoming Milestones */}
            <div className="bg-white border border-slate-100 p-8 rounded-[2rem] shadow-sm">
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-bold text-slate-800 text-xl tracking-tight">Upcoming Milestones</h3>
                <button className="text-[#4F73FF] text-xs font-black border border-[#4F73FF]/20 px-5 py-2 rounded-xl hover:bg-blue-50 transition-colors">
                  View Calendar
                </button>
              </div>
              <div className="space-y-4">
                {milestones.map((ms, i) => (
                  <div key={i} className="flex justify-between items-center p-5 border border-slate-100 rounded-[1.5rem] hover:bg-slate-50/50 transition-colors cursor-pointer">
                    <div>
                      <h5 className="font-bold text-slate-900 text-base">{ms.title}</h5>
                      <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-tight">{ms.project}</p>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-black">
                      <Clock size={16} />
                      {ms.date}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Documents */}
            <div className="bg-white border border-slate-100 p-8 rounded-[2rem] shadow-sm">
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-bold text-slate-800 text-xl tracking-tight">Recent Documents</h3>
                <button className="text-[#4F73FF] text-xs font-black border border-[#4F73FF]/20 px-5 py-2 rounded-xl hover:bg-blue-50 transition-colors">
                  Browse All
                </button>
              </div>
              <div className="space-y-4">
                {recentDocs.map((doc, i) => (
                  <div key={i} className="flex justify-between items-center p-5 border border-slate-100 rounded-[1.5rem] hover:bg-slate-50/50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="bg-[#E8F1FF] p-3 rounded-2xl">
                        <FileText className="text-[#4F73FF]" size={22} />
                      </div>
                      <div>
                        <h5 className="font-bold text-slate-900 text-base">{doc.name}</h5>
                        <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest">{doc.info}</p>
                      </div>
                    </div>
                    <button className="text-[#4F73FF] text-xs font-black hover:underline decoration-2 underline-offset-4 flex items-center gap-1 uppercase tracking-widest">
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default ClientDashboard;