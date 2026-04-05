import { useState, useEffect } from 'react';
import { Plus, TrendingUp, Users, MessageSquare, Calendar,
  FileText, X, Loader2, Clock, CheckCircle, XCircle
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { useAuth } from '../context/AuthContext';
import { toastSuccess, toastError } from '../utils/toast';

const API_BASE = 'http://localhost:3001';

const STATUS_STYLE = {
  PENDING_REVIEW: 'bg-yellow-50 text-yellow-600',
  ACTIVE:         'bg-blue-50 text-blue-600',
  COMPLETED:      'bg-green-50 text-green-600',
  CANCELLED:      'bg-red-50 text-red-500',
};

const STATUS_LABEL = {
  PENDING_REVIEW: 'Pending Review',
  ACTIVE:         'Active',
  COMPLETED:      'Completed',
  CANCELLED:      'Cancelled',
};

const STATUS_ICON = {
  PENDING_REVIEW: <Clock size={13} />,
  ACTIVE:         <TrendingUp size={13} />,
  COMPLETED:      <CheckCircle size={13} />,
  CANCELLED:      <XCircle size={13} />,
};

// ── Submit Project Modal ──────────────────────────────────────────────────────
const SubmitModal = ({ token, onClose, onCreated }) => {
  const [form, setForm]   = useState({ name: '', description: '', budget: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/projects`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          description: form.description || undefined,
          budget: form.budget ? parseFloat(form.budget) : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to submit project');
      onCreated();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-8 relative">
        <button onClick={onClose} className="absolute top-5 right-5 text-slate-400 hover:text-slate-600">
          <X size={20} />
        </button>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Submit New Project</h2>
        <p className="text-sm text-slate-400 mb-6">Your request will be reviewed by an admin before work begins.</p>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-2.5 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Project Name</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Website Redesign"
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/30"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Describe what you need..."
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/30 resize-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Budget (USD) — optional</label>
            <input
              type="number"
              min="0"
              step="100"
              value={form.budget}
              onChange={(e) => setForm(f => ({ ...f, budget: e.target.value }))}
              placeholder="e.g. 10000"
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/30"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 border border-slate-200 text-slate-600 py-3 rounded-xl text-sm font-semibold hover:bg-slate-50">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 bg-[#0022FF] hover:bg-blue-700 text-white py-3 rounded-xl text-sm font-bold disabled:opacity-50 flex items-center justify-center gap-2">
              {saving && <Loader2 size={15} className="animate-spin" />}
              {saving ? 'Submitting…' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────────────
const ClientProjects = () => {
  const { token } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [showModal, setShowModal] = useState(false);

  const authHeader = { Authorization: `Bearer ${token}` };

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const res  = await fetch(`${API_BASE}/projects`, { headers: authHeader });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch projects');
      setProjects(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const counts = {
    active:    projects.filter(p => p.status === 'ACTIVE').length,
    pending:   projects.filter(p => p.status === 'PENDING_REVIEW').length,
    completed: projects.filter(p => p.status === 'COMPLETED').length,
    total:     projects.length,
  };

  return (
    <div className="flex h-screen bg-white font-sans overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 px-9">
        <Topbar />
        <main className="flex-1 overflow-y-auto px-10 py-8 bg-slate-50/30">

          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Projects</h1>
              <p className="text-slate-500 text-sm font-medium mt-1">Track and manage all your project requests</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="bg-[#0022FF] hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-bold shadow-sm transition-all active:scale-95"
            >
              <Plus size={20} strokeWidth={3} />
              New Project
            </button>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 rounded-xl px-5 py-3 text-sm">{error}</div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
            {[
              { label: 'Total Projects',  value: counts.total,     color: 'text-slate-900' },
              { label: 'Active',          value: counts.active,    color: 'text-blue-600'  },
              { label: 'Pending Review',  value: counts.pending,   color: 'text-yellow-600'},
              { label: 'Completed',       value: counts.completed, color: 'text-green-600' },
            ].map(s => (
              <div key={s.label} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{s.label}</p>
                <h3 className={`text-3xl font-black mt-2 ${s.color}`}>
                  {loading ? '—' : s.value}
                </h3>
              </div>
            ))}
          </div>

          {/* Project Cards */}
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 size={32} className="animate-spin text-slate-300" />
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              <FileText size={40} className="mx-auto mb-3 opacity-30" />
              <p className="font-semibold">No projects yet</p>
              <p className="text-sm mt-1">Submit your first project request to get started.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {projects.map(project => (
                <div key={project.id} className="bg-white border border-slate-100 p-8 rounded-[2rem] shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-slate-800 text-xl">{project.name}</h4>
                    <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${STATUS_STYLE[project.status]}`}>
                      {STATUS_ICON[project.status]}
                      {STATUS_LABEL[project.status]}
                    </span>
                  </div>

                  {project.description && (
                    <p className="text-slate-400 text-sm mb-4 font-medium">{project.description}</p>
                  )}

                  {/* Progress */}
                  <div className="mb-6">
                    <div className="flex justify-between mb-2">
                      <span className="text-xs text-slate-300 font-bold uppercase tracking-tighter">Progress</span>
                      <span className="text-sm font-black text-slate-800">{project.progress ?? 0}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#0055FF] rounded-full transition-all duration-700"
                        style={{ width: `${project.progress ?? 0}%` }} />
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div>
                      <p className="text-[10px] text-slate-300 font-black uppercase tracking-widest mb-1">Manager</p>
                      <p className="text-sm font-bold text-slate-700">{project.manager?.name ?? 'Not assigned'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-300 font-black uppercase tracking-widest mb-1">Team</p>
                      <p className="text-sm font-bold text-slate-700">{project.team_members?.length ?? 0} members</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-300 font-black uppercase tracking-widest mb-1">Budget</p>
                      <p className="text-sm font-bold text-slate-700">
                        {project.budget ? `$${project.budget.toLocaleString()}` : 'Not set'}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-300 font-black uppercase tracking-widest mb-1">Submitted</p>
                      <div className="flex items-center gap-1.5 text-sm font-bold text-slate-700">
                        <Calendar size={14} className="text-slate-400" />
                        {new Date(project.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {showModal && (
        <SubmitModal
          token={token}
          onClose={() => setShowModal(false)}
          onCreated={() => { setShowModal(false); fetchProjects(); }}
        />
      )}
    </div>
  );
};

export default ClientProjects;
