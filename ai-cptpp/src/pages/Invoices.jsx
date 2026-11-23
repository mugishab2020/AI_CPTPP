import { useState, useEffect } from 'react';
import { Plus, Search, Eye, Download, Loader2, X } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { useAuth } from '../context/AuthContext';

const API_BASE = 'http://localhost:3001';

const fmt = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

const statusStyle = (status) => {
  switch (status) {
    case 'PAID':      return 'bg-green-50 text-green-600';
    case 'PENDING':   return 'bg-orange-50 text-orange-500';
    case 'OVERDUE':   return 'bg-red-50 text-red-500';
    case 'CANCELLED': return 'bg-gray-100 text-gray-500';
    default:          return 'bg-gray-100 text-gray-500';
  }
};

const EMPTY_FORM = { project_id: '', client_id: '', amount: '', due_date: '' };

// ── Create Invoice Modal ──────────────────────────────────────────────────────
const CreateInvoiceModal = ({ token, onClose, onCreated }) => {
  const [form, setForm]         = useState(EMPTY_FORM);
  const [projects, setProjects] = useState([]);
  const [clients, setClients]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/invoices/form-data`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => {
        setProjects(d.data.projects);
        setClients(d.data.clients);
      })
      .catch(() => setError('Failed to load form data'))
      .finally(() => setLoading(false));
  }, [token]);

  // Auto-fill client when project is selected
  const handleProjectChange = (projectId) => {
    const project = projects.find((p) => p.id === projectId);
    setForm((f) => ({
      ...f,
      project_id: projectId,
      client_id: project?.client_id ?? f.client_id,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/invoices`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          amount: parseFloat(form.amount),
          due_date: new Date(form.due_date).toISOString(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create invoice');
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
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold text-slate-900 mb-6">New Invoice</h2>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-2.5 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 size={28} className="animate-spin text-slate-400" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Project */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                Project
              </label>
              <select
                required
                value={form.project_id}
                onChange={(e) => handleProjectChange(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A6C0]/30"
              >
                <option value="">Select a project</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            {/* Client */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                Client
              </label>
              <select
                required
                value={form.client_id}
                onChange={(e) => setForm((f) => ({ ...f, client_id: e.target.value }))}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A6C0]/30"
              >
                <option value="">Select a client</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>{c.name} — {c.email}</option>
                ))}
              </select>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                Amount (USD)
              </label>
              <input
                type="number"
                required
                min="1"
                step="0.01"
                placeholder="e.g. 5000"
                value={form.amount}
                onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A6C0]/30"
              />
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                Due Date
              </label>
              <input
                type="date"
                required
                value={form.due_date}
                onChange={(e) => setForm((f) => ({ ...f, due_date: e.target.value }))}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A6C0]/30"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 border border-slate-200 text-slate-600 py-3 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-[#00A6C0] hover:bg-cyan-700 text-white py-3 rounded-xl text-sm font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : null}
                {saving ? 'Creating…' : 'Create Invoice'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────────────
const Invoices = () => {
  const { token, user } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [stats, setStats]       = useState(null);
  const [search, setSearch]     = useState('');
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [payingId, setPayingId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const authHeader = { Authorization: `Bearer ${token}` };
  const canCreate = user?.role === 'ADMIN' || user?.role === 'MANAGER';

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [invRes, statsRes] = await Promise.all([
        fetch(`${API_BASE}/invoices`, { headers: authHeader }),
        fetch(`${API_BASE}/payments/stats`, { headers: authHeader }),
      ]);
      const [invData, statsData] = await Promise.all([invRes.json(), statsRes.json()]);
      if (!invRes.ok) throw new Error(invData.message || 'Failed to fetch invoices');
      setInvoices(invData.data);
      setStats(statsData.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handlePay = async (invoice) => {
    setPayingId(invoice.id);
    try {
      const res = await fetch(`${API_BASE}/payments/invoice/${invoice.id}`, {
        method: 'POST',
        headers: { ...authHeader, 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: invoice.amount, method: 'CARD' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Payment failed');
      await fetchData();
    } catch (err) {
      setError(err.message);
    } finally {
      setPayingId(null);
    }
  };

  const filtered = invoices.filter((inv) => {
    const q = search.toLowerCase();
    return (
      inv.project?.name?.toLowerCase().includes(q) ||
      inv.client?.name?.toLowerCase().includes(q) ||
      inv.id?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex h-screen bg-white font-sans overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 p-9">
        <Topbar />
        <main className="flex-1 overflow-y-auto px-10 py-8 bg-slate-50/30">

          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Invoices</h1>
              <p className="text-slate-500 text-sm font-medium mt-1">Manage invoices and track payments</p>
            </div>
            {canCreate && (
              <button
                onClick={() => setShowModal(true)}
                className="bg-[#00A6C0] hover:bg-cyan-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-bold shadow-sm transition-all active:scale-95"
              >
                <Plus size={20} strokeWidth={3} />
                New Invoice
              </button>
            )}
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 rounded-xl px-5 py-3 text-sm">
              {error}
            </div>
          )}

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-[#0022FF] p-8 rounded-[1.5rem] text-white shadow-lg shadow-blue-100">
              <p className="text-xs font-bold tracking-widest opacity-80 uppercase">Total Revenue</p>
              <h3 className="text-4xl font-black mt-2">{loading ? '—' : fmt(stats?.totalRevenue ?? 0)}</h3>
              <p className="text-sm mt-4 font-bold opacity-70">{loading ? '...' : `From ${stats?.totalCount ?? 0} invoices`}</p>
            </div>
            <div className="bg-[#008000] p-8 rounded-[1.5rem] text-white shadow-lg shadow-green-100">
              <p className="text-xs font-bold tracking-widest opacity-80 uppercase">Paid</p>
              <h3 className="text-4xl font-black mt-2">{loading ? '—' : fmt(stats?.paidAmount ?? 0)}</h3>
              <p className="text-sm mt-4 font-bold opacity-70">{loading ? '...' : `${stats?.paidCount ?? 0} invoices paid`}</p>
            </div>
            <div className="bg-[#FF9900] p-8 rounded-[1.5rem] text-white shadow-lg shadow-orange-100">
              <p className="text-xs font-bold tracking-widest opacity-80 uppercase">Pending & Overdue</p>
              <h3 className="text-4xl font-black mt-2">{loading ? '—' : fmt(stats?.pendingAmount ?? 0)}</h3>
              <p className="text-sm mt-4 font-bold opacity-70">{loading ? '...' : `${stats?.pendingCount ?? 0} invoices awaiting`}</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search invoices..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>

          {/* Table */}
          <div className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  {['Invoice', 'Project', 'Client', 'Amount', 'Due Date', 'Status', 'Action'].map((h) => (
                    <th key={h} className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-8 py-12 text-center">
                      <Loader2 size={24} className="animate-spin mx-auto text-slate-400" />
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-8 py-12 text-center text-slate-400 text-sm">
                      No invoices found
                    </td>
                  </tr>
                ) : (
                  filtered.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50/30 transition-colors">
                      <td className="px-8 py-6 text-sm font-bold text-slate-500">{inv.id.slice(0, 8)}…</td>
                      <td className="px-8 py-6 text-sm font-bold text-slate-800">{inv.project?.name ?? '—'}</td>
                      <td className="px-8 py-6 text-sm font-medium text-slate-500">{inv.client?.name ?? '—'}</td>
                      <td className="px-8 py-6 text-sm font-black text-slate-900">{fmt(inv.amount)}</td>
                      <td className="px-8 py-6 text-sm font-medium text-slate-400">
                        {new Date(inv.due_date).toLocaleDateString()}
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${statusStyle(inv.status)}`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <button title="View" className="text-slate-300 hover:text-[#00A6C0] transition-colors">
                            <Eye size={16} />
                          </button>
                          <button title="Download" className="text-slate-300 hover:text-[#00A6C0] transition-colors">
                            <Download size={16} />
                          </button>
                          {user?.role === 'CLIENT' && inv.status === 'PENDING' && (
                            <button
                              onClick={() => handlePay(inv)}
                              disabled={payingId === inv.id}
                              className="bg-[#00A6C0] hover:bg-cyan-700 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full transition-all disabled:opacity-50 flex items-center gap-1"
                            >
                              {payingId === inv.id ? <Loader2 size={12} className="animate-spin" /> : 'Pay'}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </main>
      </div>

      {showModal && (
        <CreateInvoiceModal
          token={token}
          onClose={() => setShowModal(false)}
          onCreated={() => { setShowModal(false); fetchData(); }}
        />
      )}
    </div>
  );
};

export default Invoices;
