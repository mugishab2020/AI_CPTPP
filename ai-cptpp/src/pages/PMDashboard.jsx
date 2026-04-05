import React from 'react';
import { 
  TrendingUp, Users, Folder, AlertCircle, 
  MoreVertical, Check 
} from 'lucide-react';

// Import your existing components
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

const StatCard = ({ title, count, icon: Icon, colorClass, iconColor }) => (
  <div className="flex-1 min-w-[200px] p-6 bg-white border border-slate-100 rounded-3xl shadow-sm flex justify-between items-start">
    <div>
      <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
      <h3 className="text-3xl font-bold text-slate-900">{count}</h3>
    </div>
    <div className={`p-3 rounded-xl ${colorClass}`}>
      <Icon size={24} className={iconColor} />
    </div>
  </div>
);

const TaskItem = ({ title, project, status, priority }) => {
  const statusColors = {
    'In Progress': 'bg-blue-50 text-blue-500',
    'Pending': 'bg-slate-50 text-slate-500 border border-slate-200',
    'Done': 'bg-cyan-50 text-cyan-500'
  };

  const priorityColors = {
    'High': 'bg-slate-200 text-slate-700',
    'Medium': 'bg-slate-200 text-slate-700',
    'Low': 'bg-slate-200 text-slate-700'
  };

  return (
    <div className="flex items-center justify-between py-5 border-l-2 border-cyan-500 pl-4 mb-4 bg-white/50 hover:bg-white transition-all">
      <div>
        <h4 className="font-bold text-slate-800 text-base">{title}</h4>
        <p className="text-xs text-slate-400 mt-1">{project}</p>
      </div>
      <div className="flex items-center gap-3">
        <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold ${statusColors[status]}`}>
          {status}
        </span>
        <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold ${priorityColors[priority]}`}>
          {priority}
        </span>
      </div>
    </div>
  );
};

const TeamMember = ({ name, role }) => (
  <div className="flex items-center justify-between py-3">
    <div>
      <h4 className="font-bold text-slate-800 text-sm">{name}</h4>
      <p className="text-xs text-slate-400">{role}</p>
    </div>
    <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full" />
  </div>
);

const TeamDashboard = () => {
  return (
    <div className="flex h-screen bg-white font-sans overflow-hidden">
      
      {/* 1. SIDEBAR */}
      <Sidebar activePage="dashboard" />

      {/* 2. RIGHT CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 p-8">
        
        {/* 3. TOPBAR */}
        <Topbar />

        {/* 4. MAIN CONTENT AREA */}
        <main className="flex-1 overflow-y-auto px-10 py-8">
          
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Team Dashboard</h1>
            <p className="text-slate-500 mt-1 text-sm">Manage team tasks and collaborate on projects</p>
          </div>

          {/* Stat Cards Section */}
          <div className="flex flex-wrap gap-6 mb-12">
            <StatCard 
              title="Active Tasks" 
              count="24" 
              icon={TrendingUp} 
              colorClass="bg-orange-50" 
              iconColor="text-orange-400" 
            />
            <StatCard 
              title="Team Members" 
              count="4" 
              icon={Users} 
              colorClass="bg-purple-50" 
              iconColor="text-purple-400" 
            />
            <StatCard 
              title="Projects" 
              count="2" 
              icon={Folder} 
              colorClass="bg-indigo-50" 
              iconColor="text-indigo-400" 
            />
            <StatCard 
              title="Overdue" 
              count="1" 
              icon={AlertCircle} 
              colorClass="bg-red-50" 
              iconColor="text-red-400" 
            />
          </div>

          {/* Bottom Grid */}
          <div className="grid grid-cols-12 gap-12">
            
            {/* My Tasks (Left Column) */}
            <div className="col-span-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6">My Tasks</h2>
              <div className="space-y-2">
                <TaskItem title="Review Website Redesign" project="Website Redesign" status="In Progress" priority="High" />
                <TaskItem title="API Integration Testing" project="Mobile App Development" status="In Progress" priority="High" />
                <TaskItem title="Database Schema Review" project="Database Migration" status="Pending" priority="Medium" />
                <TaskItem title="Documentation Update" project="Website Redesign" status="Done" priority="Low" />
              </div>
            </div>

            {/* Team Members (Right Column) */}
            <div className="col-span-4 border-l border-slate-100 pl-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Team Members</h2>
              <div className="divide-y divide-slate-50">
                <TeamMember name="Alice Johnson" role="Designer" />
                <TeamMember name="Charlie Brown" role="Developer" />
                <TeamMember name="Diana Prince" role="QA Engineer" />
                <TeamMember name="Eve Wilson" role="Project Manager" />
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default TeamDashboard;