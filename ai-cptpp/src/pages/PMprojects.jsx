import { useState, useEffect } from 'react';
import { Search, Users, UserPlus, UserMinus, Loader2, X, ChevronDown, ChevronUp, Plus, Calendar, AlertCircle } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { useAuth } from '../context/AuthContext';

const API_BASE = 'http://localhost:3001';

const fmt = (n) => (n != null ? `$${Number(n).toLocaleString()}` : '—');

// ── Assign Member Modal ───────────────────────────────────────────────────────
const AssignModal = ({ project, token, onClose, onDone }) => {
  const [available, setAvailable] = useState([]);
  const [userId, setUserId]       = useState('');
  const [role, setRole]           = useState('Developer');
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/projects/${project.id}/available-members`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(d => setAvailable(d.data || []))
      .catch(() => setError('Failed to load team members'))
      .finally(() => setLoading(false));
  }, [project.id, token]);

  const handleAssign = async () => {
    if (!userId) { setError('Please select a team member'); return; }
    setSaving(true); setError(null);
    try {
      const res  = await fetch(`${API_BASE}/projects/${project.id}/members`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to assign member');
      onDone();
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-8 relative">
        <button onClick={onClose} className="absolute top-5 right-5 text-slate-400 hover:text-slate-600"><X size={20} /></button>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-cyan-50 rounded-full flex items-center justify-center">
            <UserPlus size={18} className="text-cyan-500" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Assign Team Member</h2>
        </div>
        <p className="text-sm text-slate-500 mb-6">
          Adding to <span className="font-semibold text-slate-700">"{project.name}"</span>
        </p>

        {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-2.5 text-sm">{error}</div>}

        {loading ? (
          <div className="flex justify-center py-6"><Loader2 size={22} className="animate-spin text-slate-300" /></div>
        ) : available.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-4">All team members are already assigned.</p>
        ) : (
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Team Member</label>
              <select value={userId} onChange={e => setUserId(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/30">
                <option value="">Select a member</option>
                {available.map(m => <option key={m.id} value={m.id}>{m.name} — {m.email}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Role on Project</label>
              <input value={role} onChange={e => setRole(e.target.value)}
                placeholder="e.g. Developer, Designer"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/30" />
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 border border-slate-200 text-slate-600 py-3 rounded-xl text-sm font-semibold hover:bg-slate-50">Cancel</button>
          <button onClick={handleAssign} disabled={saving || loading || available.length === 0}
            className="flex-1 bg-[#00A6C0] hover:bg-cyan-700 text-white py-3 rounded-xl text-sm font-bold disabled:opacity-50 flex items-center justify-center gap-2">
            {saving && <Loader2 size={14} className="animate-spin" />} Assign
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Create Task Modal ───────────────────────────────────────────────────────
const CreateTaskModal = ({ project, token, onClose, onDone }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [dueDate, setDueDate] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleCreateTask = async () => {
    if (!title.trim()) { setError('Task title is required'); return; }
    if (!assignedTo) { setError('Please select a team member to assign the task to'); return; }

    setSaving(true); setError(null);
    try {
      const taskData = {
        project_id: project.id,
        title: title.trim(),
        description: description.trim() || undefined,
        assigned_to: assignedTo,
        priority,
        due_date: dueDate ? new Date(dueDate).toISOString() : undefined,
      };

      const res = await fetch(`${API_BASE}/tasks`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create task');
      onDone();
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-8 relative">
        <button onClick={onClose} className="absolute top-5 right-5 text-slate-400 hover:text-slate-600"><X size={20} /></button>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
            <Plus size={18} className="text-green-500" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Create New Task</h2>
        </div>
        <p className="text-sm text-slate-500 mb-6">
          For project <span className="font-semibold text-slate-700">"{project.name}"</span>
        </p>

        {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-2.5 text-sm">{error}</div>}

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Task Title *</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Enter task title"
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400/30"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Task description (optional)"
              rows={3}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400/30 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Assign To *</label>
            <select
              value={assignedTo}
              onChange={e => setAssignedTo(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400/30"
            >
              <option value="">Select a team member</option>
              {project.team_members?.map(tm => (
                <option key={tm.user_id} value={tm.user_id}>
                  {tm.user?.name} — {tm.role}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Priority</label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400/30"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400/30"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 border border-slate-200 text-slate-600 py-3 rounded-xl text-sm font-semibold hover:bg-slate-50">Cancel</button>
          <button
            onClick={handleCreateTask}
            disabled={saving}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl text-sm font-bold disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving && <Loader2 size={14} className="animate-spin" />} Create Task
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Project Row with expandable team ─────────────────────────────────────────
const ProjectRow = ({ project, token, onRefresh, onAssignClick, onCreateTaskClick }) => {
  const [expanded, setExpanded] = useState(false);
  const [removing, setRemoving] = useState(null);

  const handleRemove = async (userId) => {
    setRemoving(userId);
    try {
      await fetch(`${API_BASE}/projects/${project.id}/members/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      onRefresh();
    } finally { setRemoving(null); }
  };

  return (
    <>
      <tr className="hover:bg-slate-50/40 transition-colors cursor-pointer" onClick={() => setExpanded(e => !e)}>
        <td className="px-6 py-4">
          <p className="font-semibold text-slate-800 text-sm">{project.name}</p>
          <p className="text-xs text-slate-400 mt-0.5">{project.client?.name ?? '—'}</p>
        </td>
        <td className="px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#00A6C0] rounded-full transition-all duration-700"
                style={{ width: `${project.progress ?? 0}%` }} />
            </div>
            <span className="text-xs font-bold text-slate-400">{project.progress ?? 0}%</span>
          </div>
        </td>
        <td className="px-6 py-4 text-sm text-slate-500">{fmt(project.budget)}</td>
        <td className="px-6 py-4 text-sm text-slate-500">
          {project.end_date ? new Date(project.end_date).toLocaleDateString() : '—'}
        </td>
        <td className="px-6 py-4">
          <div className="flex items-center gap-1.5 text-sm text-slate-500">
            <Users size={14} className="text-slate-300" />
            {project.team_members?.length ?? 0}
          </div>
        </td>
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={e => { e.stopPropagation(); onAssignClick(project); }}
              className="flex items-center gap-1.5 bg-[#00A6C0] hover:bg-cyan-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
            >
              <UserPlus size={13} /> Assign
            </button>
            <button
              onClick={e => { e.stopPropagation(); onCreateTaskClick(project); }}
              disabled={!project.team_members?.length}
              className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title={!project.team_members?.length ? "Assign team members first" : "Create a new task"}
            >
              <Plus size={13} /> Task
            </button>
            <span className="text-slate-300">{expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</span>
          </div>
        </td>
      </tr>

      {/* Expanded team members */}
      {expanded && (
        <tr>
          <td colSpan="6" className="px-6 pb-5 bg-slate-50/30">
            <div className="pt-3">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Team Members</p>
              {project.team_members?.length === 0 ? (
                <p className="text-sm text-slate-400 italic">No members assigned yet.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {project.team_members.map(tm => (
                    <div key={tm.id}
                      className="flex items-center gap-2 bg-white border border-slate-100 rounded-xl px-3 py-2 shadow-sm">
                      <div className="w-7 h-7 rounded-full bg-cyan-100 flex items-center justify-center text-xs font-bold text-cyan-600">
                        {tm.user?.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-700">{tm.user?.name}</p>
                        <p className="text-[10px] text-slate-400">{tm.role}</p>
                      </div>
                      <button
                        onClick={() => handleRemove(tm.user_id)}
                        disabled={removing === tm.user_id}
                        className="ml-1 text-slate-300 hover:text-red-400 transition-colors disabled:opacity-50"
                      >
                        {removing === tm.user_id
                          ? <Loader2 size={13} className="animate-spin" />
                          : <UserMinus size={13} />}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────────────
const PMprojects = () => {
  const { token } = useAuth();
  const [projects, setProjects] = useState([]);
  const [search, setSearch]     = useState('');
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const authHeader = { Authorization: `Bearer ${token}` };

  const fetchProjects = async () => {
    setLoading(true); setError(null);
    try {
      const res  = await fetch(`${API_BASE}/projects/user`, { headers: authHeader });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to load projects');
      setProjects(data.data);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleAssignClick = (project) => {
    setSelectedProject(project);
    setShowAssignModal(true);
  };

  const handleCreateTaskClick = (project) => {
    setSelectedProject(project);
    setShowCreateTaskModal(true);
  };

  const filtered = projects.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.client?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total:     projects.length,
    progress:  projects.length ? Math.round(projects.reduce((s, p) => s + (p.progress ?? 0), 0) / projects.length) : 0,
    withTeam:  projects.filter(p => p.team_members?.length > 0).length,
    completed: projects.filter(p => p.status === 'COMPLETED').length,
  };

  return (
    <div className="flex h-screen bg-white font-sans overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 p-8">
        <Topbar />
        <main className="flex-1 overflow-y-auto px-4 py-6">

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Projects</h1>
            <p className="text-slate-500 mt-1 text-sm">Manage active projects and assign team members</p>
          </div>

          {error && <div className="mb-6 bg-red-50 border border-red-200 text-red-600 rounded-xl px-5 py-3 text-sm">{error}</div>}

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
            {[
              { label: 'Active Projects',  value: stats.total,     color: 'text-slate-900' },
              { label: 'Avg Progress',     value: `${stats.progress}%`, color: 'text-cyan-600' },
              { label: 'With Team',        value: stats.withTeam,  color: 'text-blue-600'  },
              { label: 'Completed',        value: stats.completed, color: 'text-green-600' },
            ].map(s => (
              <div key={s.label} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{s.label}</p>
                <h3 className={`text-2xl font-black mt-1.5 ${s.color}`}>{loading ? '—' : s.value}</h3>
              </div>
            ))}
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Search projects..." value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A6C0]/20" />
          </div>

          {/* Table */}
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 text-[11px] uppercase tracking-widest text-slate-400 font-black">
                  <th className="px-6 py-4">Project / Client</th>
                  <th className="px-6 py-4">Progress</th>
                  <th className="px-6 py-4">Budget</th>
                  <th className="px-6 py-4">Due Date</th>
                  <th className="px-6 py-4">Team</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr><td colSpan="6" className="py-14 text-center">
                    <Loader2 size={24} className="animate-spin mx-auto text-slate-300" />
                  </td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan="6" className="py-14 text-center text-slate-400 text-sm">No active projects found</td></tr>
                ) : filtered.map(p => (
                  <ProjectRow
                    key={p.id}
                    project={p}
                    token={token}
                    onRefresh={fetchProjects}
                    onAssignClick={handleAssignClick}
                    onCreateTaskClick={handleCreateTaskClick}
                  />
                ))}
              </tbody>
            </table>
          </div>

        </main>
      </div>

      {/* Modals */}
      {showAssignModal && selectedProject && (
        <AssignModal
          project={selectedProject}
          token={token}
          onClose={() => { setShowAssignModal(false); setSelectedProject(null); }}
          onDone={() => { setShowAssignModal(false); setSelectedProject(null); fetchProjects(); }}
        />
      )}

      {showCreateTaskModal && selectedProject && (
        <CreateTaskModal
          project={selectedProject}
          token={token}
          onClose={() => { setShowCreateTaskModal(false); setSelectedProject(null); }}
          onDone={() => { setShowCreateTaskModal(false); setSelectedProject(null); fetchProjects(); }}
        />
      )}
    </div>
  );
};

export default PMprojects;
