import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { useAuth } from "../context/AuthContext";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, CheckCircle, Clock, AlertCircle, Edit2 } from "lucide-react";

const TeamMemberProjectDetail = () => {
  const { token } = useAuth();
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [editingStatus, setEditingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  const API_BASE = "http://localhost:3001";

  const STATUS_COLORS = {
    TODO: "bg-gray-100 text-gray-700",
    IN_PROGRESS: "bg-blue-100 text-blue-700",
    BLOCKED: "bg-red-100 text-red-700",
    DONE: "bg-green-100 text-green-700",
  };

  const PRIORITY_COLORS = {
    LOW: "bg-green-100 text-green-700",
    MEDIUM: "bg-yellow-100 text-yellow-700",
    HIGH: "bg-orange-100 text-orange-700",
    URGENT: "bg-red-100 text-red-700",
  };

  useEffect(() => {
    fetchProjectDetails();
  }, [projectId]);

  const fetchProjectDetails = async () => {
    try {
      const [projectRes, tasksRes] = await Promise.all([
        fetch(`${API_BASE}/projects/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE}/tasks/project/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const projectData = projectRes.ok ? await projectRes.json() : null;
      const tasksData = tasksRes.ok ? await tasksRes.json() : { data: [] };

      if (projectData?.data) {
        setProject(projectData.data);
      }
      setTasks(tasksData.data || []);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTaskStatus = async () => {
    if (!newStatus) return;

    try {
      const res = await fetch(`${API_BASE}/tasks/${selectedTask.id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        const updatedTask = { ...selectedTask, status: newStatus };
        setSelectedTask(updatedTask);
        setTasks(tasks.map(t => t.id === selectedTask.id ? updatedTask : t));
        setEditingStatus(false);
      }
    } catch (err) {
      console.error('Update error:', err);
    }
  };

  const isOverdue = (task) => {
    if (!task.due_date || task.status === 'DONE') return false;
    return new Date(task.due_date) < new Date();
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'DONE':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'IN_PROGRESS':
        return <Clock size={16} className="text-blue-500" />;
      case 'BLOCKED':
        return <AlertCircle size={16} className="text-red-500" />;
      default:
        return <Clock size={16} className="text-gray-500" />;
    }
  };

  const taskStats = {
    total: tasks.length,
    done: tasks.filter(t => t.status === 'DONE').length,
    inProgress: tasks.filter(t => t.status === 'IN_PROGRESS').length,
    blocked: tasks.filter(t => t.status === 'BLOCKED').length,
    todo: tasks.filter(t => t.status === 'TODO').length,
  };

  const progress = taskStats.total > 0 ? Math.round((taskStats.done / taskStats.total) * 100) : 0;

  if (loading) {
    return (
      <div className="flex bg-gray-50 min-h-screen">
        <Sidebar className="fixed" />
        <div className="flex-1">
          <Topbar />
          <div className="flex items-center justify-center py-24">
            <Loader2 className="animate-spin text-blue-500" size={40} />
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex bg-gray-50 min-h-screen">
        <Sidebar className="fixed" />
        <div className="flex-1">
          <Topbar />
          <div className="p-8">
            <p className="text-gray-500">Project not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar className="fixed" />
      <div className="flex-1">
        <Topbar />

        <div className="p-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => navigate('/team-member/projects')}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
              <p className="text-gray-500 mt-1">{project.description}</p>
            </div>
          </div>

          {/* Project Info */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Client */}
            <div className="bg-white border rounded-2xl p-6 shadow-sm">
              <p className="text-xs font-bold text-gray-500 uppercase mb-2">Client</p>
              <p className="text-lg font-bold text-gray-800">{project.client?.name}</p>
              <p className="text-sm text-gray-500">{project.client?.email}</p>
            </div>

            {/* Manager */}
            <div className="bg-white border rounded-2xl p-6 shadow-sm">
              <p className="text-xs font-bold text-gray-500 uppercase mb-2">Manager</p>
              <p className="text-lg font-bold text-gray-800">{project.manager?.name}</p>
              <p className="text-sm text-gray-500">{project.manager?.email}</p>
            </div>

            {/* Progress */}
            <div className="bg-white border rounded-2xl p-6 shadow-sm">
              <p className="text-xs font-bold text-gray-500 uppercase mb-2">Progress</p>
              <p className="text-lg font-bold text-blue-600">{progress}%</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Status */}
            <div className="bg-white border rounded-2xl p-6 shadow-sm">
              <p className="text-xs font-bold text-gray-500 uppercase mb-2">Status</p>
              <p className="text-lg font-bold text-gray-800">{project.status}</p>
            </div>
          </div>

          {/* Task Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-white border rounded-2xl p-4 shadow-sm">
              <p className="text-xs text-gray-500 mb-1">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-800">{taskStats.total}</p>
            </div>
            <div className="bg-white border rounded-2xl p-4 shadow-sm">
              <p className="text-xs text-gray-500 mb-1">To Do</p>
              <p className="text-2xl font-bold text-gray-600">{taskStats.todo}</p>
            </div>
            <div className="bg-white border rounded-2xl p-4 shadow-sm">
              <p className="text-xs text-gray-500 mb-1">In Progress</p>
              <p className="text-2xl font-bold text-blue-600">{taskStats.inProgress}</p>
            </div>
            <div className="bg-white border rounded-2xl p-4 shadow-sm">
              <p className="text-xs text-gray-500 mb-1">Blocked</p>
              <p className="text-2xl font-bold text-red-600">{taskStats.blocked}</p>
            </div>
            <div className="bg-white border rounded-2xl p-4 shadow-sm">
              <p className="text-xs text-gray-500 mb-1">Done</p>
              <p className="text-2xl font-bold text-green-600">{taskStats.done}</p>
            </div>
          </div>

          {/* Tasks Section */}
          <div className="bg-white border rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Tasks</h2>

            {tasks.length === 0 ? (
              <p className="text-gray-500 text-center py-12">No tasks yet</p>
            ) : (
              <div className="space-y-3">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => setSelectedTask(task)}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      {getStatusIcon(task.status)}
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 group-hover:text-blue-600">
                          {task.title}
                        </h3>
                        {task.description && (
                          <p className="text-sm text-gray-500 line-clamp-1">
                            {task.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {task.priority && (
                        <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${PRIORITY_COLORS[task.priority]}`}>
                          {task.priority}
                        </span>
                      )}
                      <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${STATUS_COLORS[task.status]}`}>
                        {task.status.replace('_', ' ')}
                      </span>
                      {task.due_date && (
                        <span className={`text-xs font-semibold ${isOverdue(task) ? 'text-red-600' : 'text-gray-500'}`}>
                          {new Date(task.due_date).toLocaleDateString()}
                          {isOverdue(task) && ' ⚠️'}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Task Detail Modal */}
          {selectedTask && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
                <div className="p-8">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{selectedTask.title}</h2>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[selectedTask.status]}`}>
                          {selectedTask.status.replace('_', ' ')}
                        </span>
                        {selectedTask.priority && (
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${PRIORITY_COLORS[selectedTask.priority]}`}>
                            {selectedTask.priority}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedTask(null)}
                      className="text-gray-500 hover:text-gray-700 text-2xl"
                    >
                      ×
                    </button>
                  </div>

                  {/* Description */}
                  {selectedTask.description && (
                    <div className="mb-6">
                      <h3 className="text-sm font-bold text-gray-700 uppercase mb-2">Description</h3>
                      <p className="text-gray-600 leading-relaxed">
                        {selectedTask.description}
                      </p>
                    </div>
                  )}

                  {/* Task Info */}
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    {selectedTask.due_date && (
                      <div>
                        <p className="text-xs font-bold text-gray-500 uppercase mb-1">Due Date</p>
                        <p className={`font-semibold ${isOverdue(selectedTask) ? 'text-red-600' : 'text-gray-800'}`}>
                          {new Date(selectedTask.due_date).toLocaleDateString()}
                          {isOverdue(selectedTask) && ' (OVERDUE)'}
                        </p>
                      </div>
                    )}
                    {selectedTask.priority && (
                      <div>
                        <p className="text-xs font-bold text-gray-500 uppercase mb-1">Priority</p>
                        <p className="font-semibold text-gray-800">{selectedTask.priority}</p>
                      </div>
                    )}
                  </div>

                  {/* Status Update */}
                  <div className="mb-6">
                    <h3 className="text-sm font-bold text-gray-700 uppercase mb-3">Update Status</h3>
                    {editingStatus ? (
                      <div className="flex gap-2">
                        <select
                          value={newStatus}
                          onChange={(e) => setNewStatus(e.target.value)}
                          className="flex-1 border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select status...</option>
                          <option value="TODO">To Do</option>
                          <option value="IN_PROGRESS">In Progress</option>
                          <option value="BLOCKED">Blocked</option>
                          <option value="DONE">Done</option>
                        </select>
                        <button
                          onClick={handleUpdateTaskStatus}
                          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingStatus(false)}
                          className="px-4 py-2 border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg font-semibold transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingStatus(true);
                          setNewStatus(selectedTask.status);
                        }}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-semibold transition-colors flex items-center gap-2"
                      >
                        <Edit2 size={16} />
                        Change Status
                      </button>
                    )}
                  </div>

                  {/* Close Button */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => setSelectedTask(null)}
                      className="flex-1 border border-gray-200 text-gray-700 hover:bg-gray-50 py-3 rounded-lg font-semibold transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamMemberProjectDetail;
