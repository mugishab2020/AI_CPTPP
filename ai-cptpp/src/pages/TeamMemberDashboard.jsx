import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { Bell, Settings, CheckCircle, AlertCircle, Clock, Folder } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const TeamMemberDashboard = () => {
  const { token, user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeTasks: 0,
    completedTasks: 0,
    overdueTasks: 0,
  });

  const API_BASE = "http://localhost:3001";

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [projectsRes, tasksRes] = await Promise.all([
        fetch(`${API_BASE}/projects/user`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE}/tasks/assigned-to-me`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const projectsData = projectsRes.ok ? await projectsRes.json() : { data: [] };
      const tasksData = tasksRes.ok ? await tasksRes.json() : { data: [] };

      const projectsList = projectsData.data || [];
      const tasksList = tasksData.data || [];

      setProjects(projectsList);
      setTasks(tasksList);

      // Calculate stats
      const completedTasks = tasksList.filter(t => t.status === 'DONE').length;
      const activeTasks = tasksList.filter(t => ['TODO', 'IN_PROGRESS'].includes(t.status)).length;
      const now = new Date();
      const overdueTasks = tasksList.filter(t => 
        t.due_date && new Date(t.due_date) < now && t.status !== 'DONE'
      ).length;

      setStats({
        totalProjects: projectsList.length,
        activeTasks,
        completedTasks,
        overdueTasks,
      });
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar className="fixed" />

      <div className="flex-1 p-8">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome, {user?.name}!
            </h1>
            <p className="text-gray-500 mt-1">
              Here's your task and project overview.
            </p>
          </div>

          <div className="flex gap-4 text-gray-500">
            <Bell className="cursor-pointer hover:text-gray-700" size={24} />
            <Settings className="cursor-pointer hover:text-gray-700" size={24} />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Active Projects</p>
                <p className="text-3xl font-bold text-blue-600">{stats.totalProjects}</p>
              </div>
              <Folder className="text-blue-500" size={40} />
            </div>
          </div>

          <div className="bg-white border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Active Tasks</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.activeTasks}</p>
              </div>
              <Clock className="text-yellow-500" size={40} />
            </div>
          </div>

          <div className="bg-white border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Completed Tasks</p>
                <p className="text-3xl font-bold text-green-600">{stats.completedTasks}</p>
              </div>
              <CheckCircle className="text-green-500" size={40} />
            </div>
          </div>

          <div className="bg-white border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Overdue Tasks</p>
                <p className="text-3xl font-bold text-red-600">{stats.overdueTasks}</p>
              </div>
              <AlertCircle className="text-red-500" size={40} />
            </div>
          </div>
        </div>

        {/* Projects and Tasks Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Projects */}
          <div className="lg:col-span-2 bg-white border rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              Assigned Projects
            </h2>

            {loading ? (
              <p className="text-gray-500 text-center py-8">Loading...</p>
            ) : projects.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No projects assigned</p>
            ) : (
              <div className="space-y-3">
                {projects.slice(0, 5).map((project) => (
                  <div key={project.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{project.name}</h3>
                      <p className="text-sm text-gray-500">{project.description}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${project.progress || 0}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-600 w-12 text-right">
                        {project.progress || 0}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Task Summary */}
          <div className="bg-white border rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              Task Summary
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b">
                <div className="flex items-center gap-3">
                  <Clock className="text-yellow-500" size={20} />
                  <span className="text-gray-700">In Progress</span>
                </div>
                <span className="font-bold text-yellow-600">
                  {tasks.filter(t => t.status === 'IN_PROGRESS').length}
                </span>
              </div>

              <div className="flex items-center justify-between pb-4 border-b">
                <div className="flex items-center gap-3">
                  <AlertCircle className="text-red-500" size={20} />
                  <span className="text-gray-700">To Do</span>
                </div>
                <span className="font-bold text-red-600">
                  {tasks.filter(t => t.status === 'TODO').length}
                </span>
              </div>

              <div className="flex items-center justify-between pb-4 border-b">
                <div className="flex items-center gap-3">
                  <CheckCircle className="text-green-500" size={20} />
                  <span className="text-gray-700">Done</span>
                </div>
                <span className="font-bold text-green-600">
                  {tasks.filter(t => t.status === 'DONE').length}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertCircle className="text-red-500" size={20} />
                  <span className="text-gray-700">Overdue</span>
                </div>
                <span className="font-bold text-red-600">{stats.overdueTasks}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamMemberDashboard;
