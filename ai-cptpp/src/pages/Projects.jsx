import { useState, useEffect } from 'react';
import { Search, Eye, FileText, Trash2, Loader2, Users, X, DollarSign, Calendar, CheckCircle, XCircle, ArrowLeft, Clock, User } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { useAuth } from '../context/AuthContext';

const API_BASE = 'http://localhost:3001';
const STATUS_STYLE = { PENDING_REVIEW: 'bg-yellow-50 text-yellow-700 border-yellow-200', ACTIVE: 'bg-blue-50 text-blue-600 border-blue-200', COMPLETED: 'bg-green-50 text-green-600 border-green-200', CANCELLED: 'bg-red-50 text-red-500 border-red-200' };
const fmt = (n) => n != null ? `$${Number(n).toLocaleString()}` : '—';
const InfoTile = ({ label, value }) => (<div className="bg-slate-50 rounded-xl p-3"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</p><p className="text-sm font-semibold text-slate-800">{value || '—'}</p></div>);

const ProjectModal = ({ project, token, onClose, onDone }) => {
  const [step, setStep] = useState('view');
  const [managers, setManagers] = useState([]);
  const [managerId, setManagerId] = useState('');
  const [budget, setBudget] = useState(project.budget ?? '');
  const [dueDate, setDueDate] = useState(project.end_date ? project.end_date.slice(0,10) : '');
  const [loadingMgr, setLoadingMgr] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (step !== 'approve') return;
    setLoadingMgr(true);
    fetch(`${API_BASE}/users`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => setManagers((d.data || []).filter(u => u.role === 'MANAGER')))
      .catch(() => setError('Failed to load managers')).finally(() => setLoadingMgr(false));
  }, [step]);

  const goBack = () => { setStep('view'); setError(null); };

  const handleApprove = async () => {
    if (!managerId) { setError('Please select a manager'); return; }
    setSaving(true); setError(null);
    try {
      const patch = {};
      if (budget !== '') patch.budget = parseFloat(budget);
      if (dueDate !== '') patch.end_date = new Date(dueDate).toISOString();
      if (Object.keys(patch).length > 0) {
        const pr = await fetch(`${API_BASE}/projects/${project.id}`, { method: 'PATCH', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(patch) });
        if (!pr.ok) { const d = await pr.json(); throw new Error(d.message || 'Failed to update'); }
      }
      const res = await fetch(`${API_BASE}/projects/${project.id}/review`, { method: 'PATCH', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'approve', manager_id: managerId }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to approve');
      onDone();
    } catch (err) { setError(err.message); setSaving(false); }
  };

  const handleReject = async () => {
    setSaving(true); setError(null);
    try {
      const res = await fetch(`${API_BASE}/projects/${project.id}/review`, { method: 'PATCH', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'reject' }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to reject');
      onDone();
    } catch (err) { setError(err.message); setSaving(false); }
  };

  const isPending = project.status === 'PENDING_REVIEW';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl mx-4 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-8 pt-7 pb-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2">
            {step !== 'view' && <button onClick={goBack} className="text-slate-400 hover:text-slate-600 mr-1"><ArrowLeft size={18} /></button>}
            <div>
              <h2 className="text-lg font-bold text-slate-900">{step === 'view' ? 'Project Details' : step === 'approve' ? 'Approve Project' : 'Reject Project'}</h2>
              <p className="text-xs text-slate-400">{project.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
        </div>

        <div className="overflow-y-auto flex-1 px-8 py-6">
          {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-2.5 text-sm">{error}</div>}

          {step === 'view' && (
            <div className="space-y-5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border ${STATUS_STYLE[project.status] ?? 'bg-gray-50 text-gray-500 border-gray-200'}`}>{project.status?.replace('_', ' ')}</span>
                {isPending && <span className="flex items-center gap-1 text-xs text-yellow-600 font-semibold"><Clock size={12} /> Awaiting your review</span>}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <InfoTile label="Client" value={project.client?.name} />
                <InfoTile label="Manager" value={project.manager?.name ?? 'Not assigned'} />
                <InfoTile label="Budget" value={fmt(project.budget)} />
                <InfoTile label="Due Date" value={project.end_date ? new Date(project.end_date).toLocaleDateString() : null} />
                <InfoTile label="Submitted" value={new Date(project.created_at).toLocaleDateString()} />
                <InfoTile label="Team" value={`${project.team_members?.length ?? 0} members`} />
              </div>
              {project.description && <div className="bg-slate-50 rounded-xl p-4"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Description</p><p className="text-sm text-slate-700 leading-relaxed">{project.description}</p></div>}
              <div>
                <div className="flex justify-between mb-1.5"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Progress</p><span className="text-sm font-black text-slate-800">{project.progress ?? 0}%</span></div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-blue-500 rounded-full" style={{ width: `${project.progress ?? 0}%` }} /></div>
              </div>
              {project.team_members?.length > 0 && (
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Team Members</p>
                  <div className="flex flex-wrap gap-2">
                    {project.team_members.map(tm => (
                      <div key={tm.id} className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-xl px-3 py-1.5">
                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-600">{tm.user?.name?.charAt(0)}</div>
                        <span className="text-xs font-semibold text-slate-700">{tm.user?.name}</span>
                        <span className="text-[10px] text-slate-400">{tm.role}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 'approve' && (
            <div className="space-y-4">
              <p className="text-sm text-slate-500">Assign a manager, set the approved budget and project deadline. The project will become <span className="font-semibold text-blue-600">Active</span> immediately.</p>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5"><User size={11} className="inline mr-1" />Project Manager <span className="text-red-400 normal-case font-normal">(required)</span></label>
                {loadingMgr ? <div className="flex items-center gap-2 text-slate-400 text-sm py-2"><Loader2 size={15} className="animate-spin" /> Loading managers…</div>
                  : managers.length === 0 ? <p className="text-sm text-red-400 py-1">No managers found.</p>
                  : <select value={managerId} onChange={e => setManagerId(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400/30"><option value="">Select a manager…</option>{managers.map(m => <option key={m.id} value={m.id}>{m.name} — {m.email}</option>)}</select>}
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5"><DollarSign size={11} className="inline mr-1" />Approved Budget (USD)</label>
                <input type="number" min="0" step="100" value={budget} onChange={e => setBudget(e.target.value)} placeholder="e.g. 15000" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400/30" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5"><Calendar size={11} className="inline mr-1" />Project Due Date</label>
                <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400/30" />
              </div>
            </div>
          )}

          {step === 'rejecting' && (
            <div className="flex items-start gap-3 bg-orange-50 border border-orange-100 rounded-xl p-4">
              <XCircle size={20} className="text-orange-500 shrink-0 mt-0.5" />
              <p className="text-sm text-orange-700">You are about to reject <span className="font-bold">"{project.name}"</span>. The client's request will be cancelled.</p>
            </div>
          )}
        </div>

        <div className="px-8 py-5 border-t border-slate-100 flex gap-3 shrink-0">
          {step === 'view' && (<>
            <button onClick={onClose} className="flex-1 border border-slate-200 text-slate-600 py-3 rounded-xl text-sm font-semibold hover:bg-slate-50">Close</button>
            {isPending && (<>
              <button onClick={() => { setStep('rejecting'); setError(null); }} className="flex-1 flex items-center justify-center gap-1.5 border border-orange-200 text-orange-500 hover:bg-orange-50 py-3 rounded-xl text-sm font-bold"><XCircle size={15} /> Reject</button>
              <button onClick={() => { setStep('approve'); setError(null); }} className="flex-1 flex items-center justify-center gap-1.5 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl text-sm font-bold"><CheckCircle size={15} /> Approve</button>
            </>)}
          </>)}
          {step === 'approve' && (<>
            <button onClick={goBack} className="flex-1 border border-slate-200 text-slate-600 py-3 rounded-xl text-sm font-semibold hover:bg-slate-50">Back</button>
            <button onClick={handleApprove} disabled={saving || loadingMgr || managers.length === 0} className="flex-[2] bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl text-sm font-bold disabled:opacity-50 flex items-center justify-center gap-2">{saving && <Loader2 size={14} className="animate-spin" />}{saving ? 'Approving…' : 'Confirm Approval'}</button>
          </>)}
          {step === 'rejecting' && (<>
            <button onClick={goBack} className="flex-1 border border-slate-200 text-slate-600 py-3 rounded-xl text-sm font-semibold hover:bg-slate-50">Back</button>
            <button onClick={handleReject} disabled={saving} className="flex-[2] bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl text-sm font-bold disabled:opacity-50 flex items-center justify-center gap-2">{saving && <Loader2 size={14} className="animate-spin" />}{saving ? 'Rejecting…' : 'Confirm Rejection'}</button>
          </>)}
        </div>
      </div>
    </div>
  );
};

const DeleteModal = ({ project, token, onClose, onDone }) => {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const submit = async () => {
    setSaving(true); setError(null);
    try {
      const res = await fetch(`${API_BASE}/projects/${project.id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed');
      onDone();
    } catch (err) { setError(err.message); setSaving(false); }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-8 relative">
        <button onClick={onClose} className="absolute top-5 right-5 text-slate-400 hover:text-slate-600"><X size={20} /></button>
        <div className="flex items-center gap-3 mb-2"><div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center"><Trash2 size={20} className="text-red-500" /></div><h2 className="text-lg font-bold text-slate-900">Delete Project</h2></div>
        <p className="text-sm text-slate-500 mb-6">Permanently delete <span className="font-semibold text-slate-700">"{project.name}"</span>? This cannot be undone.</p>
        {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-2.5 text-sm">{error}</div>}
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 border border-slate-200 text-slate-600 py-3 rounded-xl text-sm font-semibold hover:bg-slate-50">Cancel</button>
          <button onClick={submit} disabled={saving} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl text-sm font-bold disabled:opacity-50 flex items-center justify-center gap-2">{saving && <Loader2 size={14} className="animate-spin" />} Delete</button>
        </div>
      </div>
    </div>
  );
};

const Projects = () => {
  const { token } = useAuth();
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState(null);

  const authHeader = { Authorization: `Bearer ${token}` };

  const fetchData = async () => {
    setLoading(true); setError(null);
    try {
      const res = await fetch(`${API_BASE}/projects`, { headers: authHeader });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to load');
      setProjects(data.data || []);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const onDone = () => { setModal(null); fetchData(); };

  const filtered = projects.filter(p => {
    const q = search.toLowerCase();
    return (p.name.toLowerCase().includes(q) || p.client?.name?.toLowerCase().includes(q)) && (filter === 'ALL' || p.status === filter);
  });

  const pendingCount = projects.filter(p => p.status === 'PENDING_REVIEW').length;

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 p-8">
        <Topbar />
        <div className="mt-2 mb-6"><h1 className="text-3xl font-bold text-slate-900">Projects</h1><p className="text-slate-500 mt-1">Review, approve and monitor all projects</p></div>

        {!loading && pendingCount > 0 && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-2xl px-5 py-3.5 flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 shrink-0" />
            <p className="text-sm text-yellow-800 font-medium"><span className="font-bold">{pendingCount}</span> project{pendingCount > 1 ? 's' : ''} awaiting review — click the eye icon to review.</p>
          </div>
        )}

        {error && <div className="mb-6 bg-red-50 border border-red-200 text-red-600 rounded-xl px-5 py-3 text-sm">{error}</div>}

        <div className="flex flex-col md:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
            <input type="text" placeholder="Search by name or client..." value={search} onChange={e => setSearch(e.target.value)} className="w-full border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/20 bg-white" />
          </div>
          <select value={filter} onChange={e => setFilter(e.target.value)} className="border border-slate-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none">
            <option value="ALL">All Statuses</option>
            <option value="PENDING_REVIEW">Pending Review</option>
            <option value="ACTIVE">Active</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-[11px] uppercase tracking-widest text-slate-400 font-black">
                <th className="px-6 py-4">Project</th><th className="px-6 py-4">Client</th><th className="px-6 py-4">Manager</th>
                <th className="px-6 py-4">Progress</th><th className="px-6 py-4">Team</th><th className="px-6 py-4">Budget</th>
                <th className="px-6 py-4">Due Date</th><th className="px-6 py-4">Status</th><th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? <tr><td colSpan="9" className="py-14 text-center"><Loader2 size={24} className="animate-spin mx-auto text-slate-300" /></td></tr>
                : filtered.length === 0 ? <tr><td colSpan="9" className="py-14 text-center text-slate-400 text-sm">No projects found</td></tr>
                : filtered.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="px-6 py-4"><p className="font-semibold text-slate-800 text-sm">{p.name}</p><p className="text-xs text-slate-400 mt-0.5">{new Date(p.created_at).toLocaleDateString()}</p></td>
                    <td className="px-6 py-4 text-sm text-slate-500">{p.client?.name ?? '—'}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{p.manager?.name ?? <span className="text-slate-300 italic text-xs">Unassigned</span>}</td>
                    <td className="px-6 py-4"><div className="flex items-center gap-2"><div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-blue-500 rounded-full" style={{ width: `${p.progress ?? 0}%` }} /></div><span className="text-xs text-slate-400 font-bold">{p.progress ?? 0}%</span></div></td>
                    <td className="px-6 py-4"><div className="flex items-center gap-1.5 text-sm text-slate-500"><Users size={14} className="text-slate-300" />{p.team_members?.length ?? 0}</div></td>
                    <td className="px-6 py-4 text-sm text-slate-500">{fmt(p.budget)}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{p.end_date ? new Date(p.end_date).toLocaleDateString() : '—'}</td>
                    <td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${STATUS_STYLE[p.status] ?? 'bg-gray-50 text-gray-500 border-gray-200'}`}>{p.status?.replace('_', ' ')}</span></td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => setModal({ type: 'view', project: p })} title="View / Review" className="p-1.5 rounded-lg text-slate-400 hover:text-[#00A6C0] hover:bg-slate-50 transition-colors"><Eye size={16} /></button>
                        <button title="Documents" className="p-1.5 rounded-lg text-slate-400 hover:text-[#00A6C0] hover:bg-slate-50 transition-colors"><FileText size={16} /></button>
                        <button onClick={() => setModal({ type: 'delete', project: p })} title="Delete" className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal?.type === 'view' && <ProjectModal project={modal.project} token={token} onClose={() => setModal(null)} onDone={onDone} />}
      {modal?.type === 'delete' && <DeleteModal project={modal.project} token={token} onClose={() => setModal(null)} onDone={onDone} />}
    </div>
  );
};

export default Projects;
