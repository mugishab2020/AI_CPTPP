import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { useAuth } from "../context/AuthContext";
import { Search, Loader2, CheckCircle, AlertCircle, Clock, Edit2, X } from "lucide-react";

const TeamMemberTasks = () => {
  const { token } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [selectedTask, setSelectedTask] = useState(null);
  const [editingStatus, setEditingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  const API_BASE = "http://localhost:3001";

  const STATUS_COLORS = {
    TODO: { badge: "bg-gray-100 text-gray-700", icon: "text-gray-500" },
    IN_PROGRESS: { badge: "bg-blue-100 text-blue-700", icon: "text-blue-500" },
    BLOCKED: { badge: "bg-red-100 text-red-700", icon: "text-red-500" },
    DONE: { badge: "bg-green-100 text-green-700", icon: "text-green-500" },
  };

  const PRIORITY_COLORS = {
    LOW: "bg-green-100 text-green-700",
    MEDIUM: "bg-yellow-100 text-yellow-700",
    HIGH: "bg-orange-100 text-orange-700",
    URGENT: "bg-red-100 text-red-700",
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${API_BASE}/tasks/assigned-to-me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.ok ? await res.json() : { data: [] };
      const tasksList = data.data || [];
      setTasks(tasksList);
      applyFilters(tasksList, searchTerm, filterStatus);
    } catch (err) {
      console.error('Tasks fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (tasksList, search, status) => {
    let filtered = tasksList;

    if (search) {
      filtered = filtered.filter(t =>
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.description?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (status !== "ALL") {
      filtered = filtered.filter(t => t.status === status);
    }

    setFilteredTasks(filtered);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    applyFilters(tasks, value, filterStatus);
  };

  const handleStatusFilter = (status) => {
    setFilterStatus(status);
    applyFilters(tasks, searchTerm, status);
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
        applyFilters(tasks.map(t => t.id === selectedTask.id ? updatedTask : t), searchTerm, filterStatus);
        setEditingStatus(false);
      }
    } catch (err) {
      console.error('Update task error:', err);
    }
  };

  const isOverdue = (task) => {
    if (!task.due_date || task.status === 'DONE') return false;
    return new Date(task.due_date) < new Date();
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'DONE':
        return <CheckCircle size={20} className="text-green-500" />;
      case 'IN_PROGRESS':
        return <Clock size={20} className="text-blue-500" />;
      case 'BLOCKED':
        return <AlertCircle size={20} className="text-red-500" />;
      default:
        return <Clock size={20} className="text-gray-500" />;
    }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar className="fixed" />
      <div className="flex-1">
        <Topbar />

        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
            <p className="text-gray-500 mt-1">
              Manage your assigned tasks and track progress
            </p>
          </div>

          {/* Search and Filter */}
          <div className="mb-6 space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Status Filter */}
            <div className="flex gap-2 flex-wrap">
              {['ALL', 'TODO', 'IN_PROGRESS', 'BLOCKED', 'DONE'].map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusFilter(status)}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                    filterStatus === status
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {status === 'ALL' ? 'All Tasks' : status.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Tasks List */}
          <div className="space-y-4">
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="animate-spin text-blue-500" size={32} />
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="bg-white border rounded-2xl p-12 text-center">
                <p className="text-gray-500 mb-2">No tasks found</p>
                <p className="text-gray-400 text-sm">
                  {searchTerm ? "Try adjusting your search" : "You don't have any tasks"}
                </p>
              </div>
            ) : (
              filteredTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => setSelectedTask(task)}
                  className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                >
                  <div className="flex items-start justify-between gap-4">
                    {/* Left Section */}
                    <div className="flex-1">
                      {/* Title and Status */}
                      <div className="flex items-center gap-3 mb-2">
                        {getStatusIcon(task.status)}
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {task.title}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[task.status]?.badge}`}>
                          {task.status.replace('_', ' ')}
                        </span>
                        {task.priority && (
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${PRIORITY_COLORS[task.priority]}`}>
                            {task.priority}
                          </span>
                        )}
                      </div>

                      {/* Description */}
                      {task.description && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {task.description}
                        </p>
                      )}

                      {/* Meta Info */}
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        {task.project?.name && (
                          <span className="flex items-center gap-1">
                            📁 {task.project.name}
                          </span>
                        )}
                        {task.due_date && (
                          <span className={`flex items-center gap-1 ${isOverdue(task) ? 'text-red-600 font-semibold' : ''}`}>
                            📅 {new Date(task.due_date).toLocaleDateString()}
                            {isOverdue(task) && ' (OVERDUE)'}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Right Section - Quick Action */}
                    <div className="flex items-center gap-2">
                      {task.status !== 'DONE' && task.status !== 'BLOCKED' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTask(task);
                          }}
                          className="px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
                        >
                          <Edit2 size={16} />
                          Update
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
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
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[selectedTask.status]?.badge}`}>
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
                    {selectedTask.project && (
                      <div>
                        <p className="text-xs font-bold text-gray-500 uppercase mb-1">Project</p>
                        <p className="text-gray-800 font-semibold">{selectedTask.project.name}</p>
                      </div>
                    )}
                    {selectedTask.due_date && (
                      <div>
                        <p className="text-xs font-bold text-gray-500 uppercase mb-1">Due Date</p>
                        <p className={`font-semibold ${isOverdue(selectedTask) ? 'text-red-600' : 'text-gray-800'}`}>
                          {new Date(selectedTask.due_date).toLocaleDateString()}
                          {isOverdue(selectedTask) && ' (OVERDUE)'}
                        </p>
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

export default TeamMemberTasks;
