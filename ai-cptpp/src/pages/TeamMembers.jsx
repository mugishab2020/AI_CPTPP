import React from 'react';
import { 
  Plus, Mail, Phone, Calendar, Edit2, Trash2 
} from 'lucide-react';

// Import your custom components
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

const TeamMembers = () => {
  // Array of team members for easy API integration
  const members = [
    {
      id: 1,
      name: "Alice Johnson",
      role: "UI/UX Designer",
      email: "alice@company.com",
      phone: "+250 781 112 195",
      joined: "2023-06-15",
      status: "Active",
      projects: ["Website Redesign", "Mobile App"]
    },
    {
      id: 2,
      name: "Alice Johnson",
      role: "UI/UX Designer",
      email: "alice@company.com",
      phone: "+250 781 112 195",
      joined: "2023-06-15",
      status: "Active",
      projects: ["Website Redesign", "Mobile App"]
    },
    {
      id: 3,
      name: "Alice Johnson",
      role: "UI/UX Designer",
      email: "alice@company.com",
      phone: "+250 781 112 195",
      joined: "2023-06-15",
      status: "Active",
      projects: ["Website Redesign", "Mobile App"]
    },
    {
      id: 4,
      name: "Alice Johnson",
      role: "UI/UX Designer",
      email: "alice@company.com",
      phone: "+250 781 112 195",
      joined: "2023-06-15",
      status: "Active",
      projects: ["Website Redesign", "Mobile App"]
    }
  ];

  return (
    <div className="flex h-screen bg-white font-sans overflow-hidden">
      
      {/* 1. SIDEBAR - Project Manager Profile */}
      <Sidebar activePage="team-members" />

      <div className="flex-1 flex flex-col p-9">
        
        {/* 2. TOPBAR */}
        <Topbar />

        {/* 3. MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto px-10 py-8">
          
          {/* Header Section */}
          <div className="flex justify-between items-start mb-10">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Team Members</h1>
              <p className="text-slate-500 mt-1 text-sm font-medium">Manage and view team member details</p>
            </div>
            <button className="bg-[#00A6C0] hover:bg-cyan-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-semibold shadow-sm transition-all active:scale-95">
              <Plus size={20} strokeWidth={3} />
              Add member
            </button>
          </div>

          {/* Members Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {members.map((member) => (
              <div key={member.id} className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm relative group">
                
                {/* Top Section: Avatar, Name, and Status */}
                <div className="flex justify-between items-start mb-6">
                  <div className="flex gap-4">
                    <div className="w-14 h-14 bg-[#00A6C0] rounded-full flex items-center justify-center text-white overflow-hidden">
                      {/* Avatar Placeholder */}
                      <img 
                        src={`https://ui-avatars.com/api/?name=${member.name}&background=00A6C0&color=fff`} 
                        alt={member.name}
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">{member.name}</h3>
                      <p className="text-slate-400 text-sm font-medium">{member.role}</p>
                    </div>
                  </div>
                  <span className="bg-[#E8EDFF] text-[#4F73FF] px-4 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">
                    {member.status}
                  </span>
                </div>

                {/* Contact Info Section */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-slate-400">
                    <Mail size={18} className="text-slate-300" />
                    <span className="text-sm font-medium">{member.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-400">
                    <Phone size={18} className="text-slate-300" />
                    <span className="text-sm font-medium">{member.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-400">
                    <Calendar size={18} className="text-slate-300" />
                    <span className="text-sm font-medium text-slate-300">Joined: {member.joined}</span>
                  </div>
                </div>

                {/* Projects Section */}
                <div className="mb-8">
                  <p className="text-[10px] text-slate-300 uppercase font-black tracking-widest mb-3">Projects</p>
                  <div className="flex flex-wrap gap-2">
                    {member.projects.map((project, pIdx) => (
                      <span key={pIdx} className="bg-[#00A6C0] text-white px-4 py-1 rounded-full text-[10px] font-bold">
                        {project}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-2">
                  <button className="flex-1 py-2.5 border border-slate-200 rounded-xl flex items-center justify-center gap-2 text-slate-700 font-bold text-sm hover:bg-slate-50 transition-colors">
                    <Edit2 size={16} />
                    Edit
                  </button>
                  <button className="flex-1 py-2.5 border border-slate-200 rounded-xl flex items-center justify-center gap-2 text-red-500 font-bold text-sm hover:bg-red-50 hover:border-red-100 transition-colors">
                    <Trash2 size={16} />
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

        </main>
      </div>
    </div>
  );
};

export default TeamMembers;