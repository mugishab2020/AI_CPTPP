import React from "react";
import Sidebar from "../components/Sidebar";
import { 
  Bell, Settings, RefreshCcw, Upload, 
  TrendingUp, Target, BrainCircuit, AlertCircle 
} from "lucide-react";

const AIAnalytics = () => {
  const userType = "admin";

  const metrics = [
    { 
      label: "Avg. Efficiency", 
      value: "87%", 
      trend: "↑ 5% from last month", 
      trendColor: "text-green-500", 
      icon: <TrendingUp className="text-green-600" size={20} />, 
      bgColor: "bg-green-50" 
    },
    { 
      label: "On-Time Delivery", 
      value: "92%", 
      trend: "↑ 3% from last month", 
      trendColor: "text-green-500", 
      icon: <Target className="text-blue-600" size={20} />, 
      bgColor: "bg-blue-50" 
    },
    { 
      label: "Quality Score", 
      value: "91%", 
      trend: "↑ 7% from last month", 
      trendColor: "text-green-500", 
      icon: <BrainCircuit className="text-purple-600" size={20} />, 
      bgColor: "bg-purple-50" 
    },
    { 
      label: "At-Risk Projects", 
      value: "3", 
      trend: "Requires attention", 
      trendColor: "text-red-500", 
      icon: <AlertCircle className="text-red-600" size={20} />, 
      bgColor: "bg-red-50" 
    },
  ];

  // New Data for the bottom section
  const recommendations = [
    {
      title: "Project Delay Risk",
      desc: "Dashboard Upgrade has 78% probability of delay due to resource constraints",
      rec: "Add 2 additional developers to the team",
      level: "High",
      theme: "border-red-200 bg-red-50/30 text-red-800",
      badge: "bg-red-100 text-red-600"
    },
    {
      title: "Budget Overrun Alert",
      desc: "AI Integration project may exceed budget by $8,000 at current burn rate",
      rec: "Review scope and timeline with client",
      level: "Medium",
      theme: "border-yellow-200 bg-yellow-50/30 text-yellow-800",
      badge: "bg-yellow-100 text-yellow-600"
    },
    {
      title: "Team Capacity Issue",
      desc: "3 team members are at 120% capacity this month",
      rec: "Redistribute tasks to available team members",
      level: "High",
      theme: "border-red-200 bg-red-50/30 text-red-800",
      badge: "bg-red-100 text-red-600"
    },
    {
      title: "Quality Improvement",
      desc: "Code quality metrics have improved 15% month-over-month",
      rec: "Continue current development practices",
      level: "Low",
      theme: "border-green-200 bg-green-50/30 text-green-800",
      badge: "bg-green-100 text-green-600"
    }
  ];

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar userType={userType} />

      {/* Main Content - ml-64 to accommodate Sidebar */}
      <div className="flex-1 ml-1 p-8">
        
        {/* Top Header Navigation */}
        <div className="flex justify-end gap-5 mb-2 text-gray-400">
          <Bell size={22} className="cursor-pointer hover:text-gray-600" />
          <Settings size={22} className="cursor-pointer hover:text-gray-600" />
        </div>

        {/* Page Title & Actions */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">AI Analytics & Performance</h1>
            <p className="text-gray-500 mt-1">Predictive insights and performance metrics powered by AI</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-sky-400 text-sky-500 rounded-2xl hover:bg-sky-50 transition font-medium">
              <RefreshCcw size={18} /> Refresh
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#00a3cc] text-white rounded-xl hover:bg-[#008fb3] transition font-medium shadow-sm">
              <Upload size={18} /> Export
            </button>
          </div>
        </div>

        {/* Analytics Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {metrics.map((item, idx) => (
            <div key={idx} className="border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden bg-white">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-400 mb-1">{item.label}</p>
                  <h3 className="text-3xl font-bold text-slate-900">{item.value}</h3>
                </div>
                <div className={`p-3 rounded-xl ${item.bgColor}`}>
                  {item.icon}
                </div>
              </div>
              <p className={`text-xs font-semibold ${item.trendColor}`}>
                {item.trend}
              </p>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <div className="border border-gray-100 rounded-3xl p-8 shadow-sm bg-white">
            <h3 className="text-xl font-bold text-slate-800 mb-8">Project Status Trend</h3>
            <div className="aspect-[16/9] w-full flex items-center justify-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <p className="text-gray-400 text-sm italic">[Area Chart Visualization]</p>
            </div>
          </div>

          <div className="border border-gray-100 rounded-3xl p-8 shadow-sm bg-white">
            <h3 className="text-xl font-bold text-slate-800 mb-8">Monthly Revenue</h3>
            <div className="aspect-[16/9] w-full flex items-center justify-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <p className="text-gray-400 text-sm italic">[Line Chart Visualization]</p>
            </div>
          </div>
        </div>

        {/* AI Recommendations Section */}
        <div className="mb-10">
          <h3 className="text-xl font-bold text-slate-900 mb-6">AI-Powered Insights & Recommendations</h3>
          <div className="space-y-4">
            {recommendations.map((item, idx) => (
              <div key={idx} className={`border rounded-[22px] p-6 ${item.theme}`}>
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <div className="mt-1"><BrainCircuit size={24} /></div>
                    <div>
                      <h4 className="font-bold text-lg">{item.title}</h4>
                      <p className="text-sm mt-1 opacity-80">{item.desc}</p>
                    </div>
                  </div>
                  <span className={`px-4 py-1 rounded-full text-xs font-bold ${item.badge}`}>
                    {item.level}
                  </span>
                </div>
                <div className="mt-4 pt-4 border-t border-current border-opacity-10 text-sm">
                  <span className="font-bold">Recommendation:</span> {item.rec}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Project Completion Forecast Section */}
        <div className="border border-gray-100 rounded-[32px] p-8 shadow-sm bg-white">
          <h3 className="text-xl font-bold text-slate-900 mb-8">Project Completion Forecast</h3>
          <div className="space-y-8">
            {/* Project 1 */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="font-bold text-slate-700">E-Commerce</span>
                <span className="px-3 py-1 bg-sky-100 text-sky-600 rounded-full text-[10px] font-bold uppercase tracking-wider">On Track</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-sky-500 rounded-full" style={{ width: '95%' }}></div>
                </div>
                <span className="text-sm font-bold text-gray-400">95%</span>
              </div>
            </div>

            {/* Project 2 */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="font-bold text-slate-700">Mobile App</span>
                <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-[10px] font-bold uppercase tracking-wider">Completed</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: '100%' }}></div>
                </div>
                <span className="text-sm font-bold text-gray-400">100%</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AIAnalytics;