import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { useAuth } from "../context/AuthContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { Calendar, Filter, Download, TrendingUp } from "lucide-react";

const TeamMemberReport = () => {
  const { token } = useAuth();
  const [reportData, setReportData] = useState({
    taskCompletion: [],
    projectProgress: [],
    timeTracking: [],
    productivity: null,
  });
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("30days");

  const API_BASE = "http://localhost:3001";

  useEffect(() => {
    fetchReportData();
  }, [dateRange]);

  const fetchReportData = async () => {
    try {
      const res = await fetch(`${API_BASE}/reports/team-member?range=${dateRange}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.ok ? await res.json() : null;
      if (data?.data) {
        setReportData(data.data);
      }
    } catch (err) {
      console.error('Report fetch error:', err);
      // Set dummy data for demonstration
      setReportData({
        taskCompletion: [
          { week: "Week 1", completed: 5, pending: 3, blocked: 1 },
          { week: "Week 2", completed: 7, pending: 2, blocked: 0 },
          { week: "Week 3", completed: 6, pending: 4, blocked: 1 },
          { week: "Week 4", completed: 8, pending: 1, blocked: 0 },
        ],
        projectProgress: [
          { name: "Project A", progress: 75, target: 100 },
          { name: "Project B", progress: 60, target: 100 },
          { name: "Project C", progress: 90, target: 100 },
          { name: "Project D", progress: 45, target: 100 },
        ],
        timeTracking: [
          { date: "Mon", hours: 8 },
          { date: "Tue", hours: 7.5 },
          { date: "Wed", hours: 8.5 },
          { date: "Thu", hours: 8 },
          { date: "Fri", hours: 7 },
        ],
        productivity: { onTime: 85, delayed: 10, blocked: 5 },
      });
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ["#10B981", "#F59E0B", "#EF4444"];

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar className="fixed" />
      <div className="flex-1">
        <Topbar />

        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Reports</h1>
              <p className="text-gray-500 mt-1">Track your performance and productivity</p>
            </div>

            <div className="flex gap-3">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="90days">Last 90 Days</option>
              </select>

              <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold flex items-center gap-2 transition-colors">
                <Download size={18} />
                Export
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white border rounded-2xl p-6 shadow-sm">
              <p className="text-gray-500 text-sm mb-2">Tasks Completed</p>
              <p className="text-3xl font-bold text-green-600">26</p>
              <p className="text-xs text-gray-500 mt-2">↑ 12% from last period</p>
            </div>

            <div className="bg-white border rounded-2xl p-6 shadow-sm">
              <p className="text-gray-500 text-sm mb-2">On-Time Completion</p>
              <p className="text-3xl font-bold text-blue-600">92%</p>
              <p className="text-xs text-gray-500 mt-2">Above target</p>
            </div>

            <div className="bg-white border rounded-2xl p-6 shadow-sm">
              <p className="text-gray-500 text-sm mb-2">Avg Hours/Day</p>
              <p className="text-3xl font-bold text-purple-600">7.8</p>
              <p className="text-xs text-gray-500 mt-2">Within target</p>
            </div>

            <div className="bg-white border rounded-2xl p-6 shadow-sm">
              <p className="text-gray-500 text-sm mb-2">Active Projects</p>
              <p className="text-3xl font-bold text-orange-600">4</p>
              <p className="text-xs text-gray-500 mt-2">All on track</p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Task Completion Trend */}
            <div className="bg-white border rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Task Completion Trend</h2>
              <div className="w-full h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={reportData.taskCompletion}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="completed" fill="#10B981" />
                    <Bar dataKey="pending" fill="#F59E0B" />
                    <Bar dataKey="blocked" fill="#EF4444" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Time Tracking */}
            <div className="bg-white border rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Daily Hours Logged</h2>
              <div className="w-full h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={reportData.timeTracking}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="hours" stroke="#3B82F6" strokeWidth={3} dot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Project Progress & Productivity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Project Progress */}
            <div className="lg:col-span-2 bg-white border rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Project Progress</h2>
              <div className="space-y-4">
                {reportData.projectProgress?.map((project, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold text-gray-800">{project.name}</h3>
                      <span className="text-sm font-bold text-blue-600">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-blue-500 h-3 rounded-full transition-all"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Productivity Pie Chart */}
            <div className="bg-white border rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Task Status Distribution</h2>
              <div className="w-full h-64 flex items-center justify-center">
                {reportData.productivity && (
                  <PieChart width={200} height={200}>
                    <Pie
                      data={[
                        { name: "On Time", value: reportData.productivity.onTime },
                        { name: "Delayed", value: reportData.productivity.delayed },
                        { name: "Blocked", value: reportData.productivity.blocked },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {COLORS.map((color, index) => (
                        <Cell key={index} fill={color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                )}
              </div>
              <div className="space-y-2 text-sm mt-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">On Time:</span>
                  <span className="font-bold text-green-600">{reportData.productivity?.onTime}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delayed:</span>
                  <span className="font-bold text-yellow-600">{reportData.productivity?.delayed}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Blocked:</span>
                  <span className="font-bold text-red-600">{reportData.productivity?.blocked}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamMemberReport;
