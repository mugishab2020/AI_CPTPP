import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { Clock, TrendingUp, DollarSign, Users, FolderKanban } from "lucide-react";
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell,
} from "recharts";

const API_BASE = "http://localhost:3001";
const fmt = (n) => n != null ? `$${Number(n).toLocaleString()}` : "$0";
const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"];

const StatCard = ({ title, value, sub, icon: Icon, iconBg, iconColor }) => (
  <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex justify-between items-start">
    <div>
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className="text-3xl font-bold text-gray-900 mt-1">{value}</h2>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
    <div className={`${iconBg} p-3 rounded-2xl ${iconColor}`}>
      <Icon size={22} />
    </div>
  </div>
);

const AdminDashboard = () => {
  const { token } = useAuth();
  const navigate  = useNavigate();

  const [projects, setProjects] = useState([]);
  const [pending,  setPending]  = useState([]);
  const [users,    setUsers]    = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading,  setLoading]  = useState(true);

  const authHeader = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const load = async () => {
      try {
        const [pRes, pendRes, uRes, iRes] = await Promise.all([
          fetch(`${API_BASE}/projects`,         { headers: authHeader }),
          fetch(`${API_BASE}/projects/pending`, { headers: authHeader }),
          fetch(`${API_BASE}/users`,            { headers: authHeader }),
          fetch(`${API_BASE}/invoices`,         { headers: authHeader }),
        ]);
        setProjects(pRes.ok   ? (await pRes.json()).data    || [] : []);
        setPending(pendRes.ok ? (await pendRes.json()).data || [] : []);
        setUsers(uRes.ok      ? (await uRes.json()).data    || [] : []);
        setInvoices(iRes.ok   ? (await iRes.json()).data    || [] : []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const totalRevenue   = invoices.filter(i => i.status === 'PAID').reduce((s, i) => s + i.amount, 0);
  const activeProjects = projects.filter(p => p.status === 'ACTIVE').length;
  const totalClients   = users.filter(u => u.role === 'CLIENT').length;
  const completedCount = projects.filter(p => p.status === 'COMPLETED').length;
  const completionRate = projects.length ? Math.round((completedCount / projects.length) * 100) : 0;
  const invoiceRate    = invoices.length ? Math.round((invoices.filter(i => i.status === 'PAID').length / invoices.length) * 100) : 0;

  const trendData = (() => {
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const map = {};
    projects.forEach(p => {
      const m = months[new Date(p.created_at).getMonth()];
      if (!map[m]) map[m] = { month: m, active: 0, completed: 0, pending: 0 };
      if (p.status === 'COMPLETED') map[m].completed++;
      else if (p.status === 'ACTIVE') map[m].active++;
      else if (p.status === 'PENDING_REVIEW') map[m].pending++;
    });
    return Object.values(map);
  })();

  const revenueData = (() => {
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const map = {};
    invoices.filter(i => i.status === 'PAID').forEach(i => {
      const m = months[new Date(i.created_at).getMonth()];
      map[m] = (map[m] || 0) + i.amount;
    });
    return months.filter(m => map[m]).map(m => ({ month: m, revenue: map[m] }));
  })();

  const pieData = [
    { name: 'Active',    value: activeProjects },
    { name: 'Completed', value: completedCount },
    { name: 'Pending',   value: pending.length },
    { name: 'Cancelled', value: projects.filter(p => p.status === 'CANCELLED').length },
  ].filter(d => d.value > 0);

  return (
    <div className="flex bg-gray-50 min-h-screen font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 p-8">
        <Topbar />

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back! Here is your platform overview.</p>
        </div>

        {!loading && pending.length > 0 && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-2xl px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock size={20} className="text-yellow-500 shrink-0" />
              <div>
                <p className="font-bold text-yellow-800 text-sm">
                  {pending.length} project{pending.length > 1 ? 's' : ''} awaiting your review
                </p>
                <p className="text-yellow-600 text-xs mt-0.5 line-clamp-1">
                  {pending.map(p => p.name).join(' · ')}
                </p>
              </div>
            </div>
            <button onClick={() => navigate('/projects')}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors shrink-0 ml-4">
              Review Now
            </button>
          </div>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Projects"  value={loading ? '...' : projects.length}
            sub={completionRate + '% completed'}
            icon={FolderKanban} iconBg="bg-orange-100" iconColor="text-orange-500" />
          <StatCard title="Total Revenue"   value={loading ? '...' : fmt(totalRevenue)}
            sub={invoices.filter(i=>i.status==='PAID').length + ' paid invoices'}
            icon={DollarSign} iconBg="bg-blue-100" iconColor="text-blue-500" />
          <StatCard title="Active Clients"  value={loading ? '...' : totalClients}
            sub={users.length + ' total users'}
            icon={Users} iconBg="bg-purple-100" iconColor="text-purple-500" />
          <StatCard title="Active Projects" value={loading ? '...' : activeProjects}
            sub={pending.length + ' pending review'}
            icon={TrendingUp} iconBg="bg-green-100" iconColor="text-green-500" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h2 className="text-base font-bold text-gray-800 mb-4">Project Status Trend</h2>
            <div className="w-full h-56">
              <ResponsiveContainer>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="active"    stroke="#3B82F6" strokeWidth={2.5} dot={{ r: 3 }} name="Active" />
                  <Line type="monotone" dataKey="completed" stroke="#10B981" strokeWidth={2.5} dot={{ r: 3 }} name="Completed" />
                  <Line type="monotone" dataKey="pending"   stroke="#F59E0B" strokeWidth={2.5} dot={{ r: 3 }} name="Pending" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h2 className="text-base font-bold text-gray-800 mb-4">Monthly Revenue</h2>
            <div className="w-full h-56">
              <ResponsiveContainer>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h2 className="text-base font-bold text-gray-800 mb-4">Project Distribution</h2>
            <div className="flex items-center gap-6">
              <PieChart width={180} height={180}>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={80} paddingAngle={3} dataKey="value">
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
              <div className="space-y-2.5 text-sm">
                {pieData.map((d, i) => (
                  <div key={d.name} className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                    <span className="text-gray-600">{d.name}:</span>
                    <span className="font-bold text-gray-800">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h2 className="text-base font-bold text-gray-800 mb-5">Quick Stats</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-500">Project Completion Rate</span>
                  <span className="text-sm font-bold text-green-600">{completionRate}%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: completionRate + '%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-500">Invoice Collection Rate</span>
                  <span className="text-sm font-bold text-blue-600">{invoiceRate}%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: invoiceRate + '%' }} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400">Total Users</p>
                  <p className="text-xl font-bold text-gray-800 mt-0.5">{loading ? '...' : users.length}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400">Pending Invoices</p>
                  <p className="text-xl font-bold text-orange-500 mt-0.5">{loading ? '...' : invoices.filter(i=>i.status==='PENDING').length}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400">Managers</p>
                  <p className="text-xl font-bold text-gray-800 mt-0.5">{loading ? '...' : users.filter(u=>u.role==='MANAGER').length}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400">Team Members</p>
                  <p className="text-xl font-bold text-gray-800 mt-0.5">{loading ? '...' : users.filter(u=>u.role==='TEAM_MEMBER').length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-base font-bold text-gray-800">Recent Projects</h2>
            <button onClick={() => navigate('/projects')} className="text-sm text-blue-500 hover:text-blue-700 font-semibold">View All</button>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 border-b text-xs uppercase tracking-widest font-black">
                <th className="text-left pb-3">Project</th>
                <th className="text-left pb-3">Client</th>
                <th className="text-left pb-3">Manager</th>
                <th className="text-left pb-3">Progress</th>
                <th className="text-left pb-3">Status</th>
                <th className="text-left pb-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="py-8 text-center text-gray-400">Loading...</td></tr>
              ) : projects.length === 0 ? (
                <tr><td colSpan="6" className="py-8 text-center text-gray-400">No projects yet</td></tr>
              ) : projects.slice(0, 6).map(p => (
                <tr key={p.id} className="border-b last:border-none hover:bg-slate-50/40 transition-colors">
                  <td className="py-3.5 font-semibold text-gray-800">{p.name}</td>
                  <td className="text-gray-500">{p.client ? p.client.name : '—'}</td>
                  <td className="text-gray-500">{p.manager ? p.manager.name : 'Unassigned'}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-blue-500 h-full rounded-full" style={{ width: (p.progress || 0) + '%' }} />
                      </div>
                      <span className="text-xs text-gray-400">{p.progress || 0}%</span>
                    </div>
                  </td>
                  <td>
                    <span className={'px-2.5 py-1 rounded-full text-xs font-bold ' + (
                      p.status === 'COMPLETED'      ? 'bg-green-100 text-green-600'   :
                      p.status === 'ACTIVE'         ? 'bg-blue-100 text-blue-600'     :
                      p.status === 'PENDING_REVIEW' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-500'
                    )}>
                      {p.status ? p.status.replace('_', ' ') : ''}
                    </span>
                  </td>
                  <td>
                    <button onClick={() => navigate('/projects')} className="text-blue-500 hover:text-blue-700 font-semibold text-xs">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
