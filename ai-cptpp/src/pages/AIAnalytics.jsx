import { useState, useEffect } from 'react';
import {
  TrendingUp, Target, BrainCircuit, AlertCircle,
  CheckCircle, Clock, DollarSign, Loader2, RefreshCcw
} from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, LineChart, Line
} from 'recharts';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { useAuth } from '../context/AuthContext';

const API_BASE = 'http://localhost:3001';
const fmt = (n) => `$${Number(n ?? 0).toLocaleString()}`;

const LEVEL_STYLE = {
  High:   'border-red-200 bg-red-50/40 text-red-800',
  Medium: 'border-yellow-200 bg-yellow-50/40 text-yellow-800',
  Low:    'border-green-200 bg-green-50/40 text-green-800',
};
const LEVEL_BADGE = {
  High:   'bg-red-100 text-red-600',
  Medium: 'bg-yellow-100 text-yellow-700',
  Low:    'bg-green-100 text-green-600',
};

const StatCard = ({ label, value, sub, icon: Icon, bg, color }) => (
  <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
    <div className="flex justify-between items-start mb-3">
      <div>
        <p className="text-sm text-gray-400 font-medium">{label}</p>
        <h3 className="text-3xl font-bold text-slate-900 mt-1">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl ${bg}`}>
        <Icon size={20} className={color} />
      </div>
    </div>
    {sub && <p className="text-xs text-gray-400">{sub}</p>}
  </div>
);

const AIAnalytics = () => {
  const { token } = useAuth();
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const load = async () => {
    setLoading(true); setError(null);
    try {
      const res  = await fetch(`${API_BASE}/analytics/overview`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to load analytics');
      setData(json.data);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [token]);

  const s = data?.summary;

  // Chart data from project forecasts
  const progressChartData = (data?.projectForecasts || []).map(p => ({
    name: p.name.length > 14 ? p.name.slice(0, 14) + '…' : p.name,
    progress: p.progress,
  }));

  // Team efficiency chart
  const teamChartData = (data?.teamPerformance || []).map(m => ({
    name: m.name.split(' ')[0],
    efficiency: m.efficiency,
    completed: m.completed,
  }));

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 p-8">
        <Topbar />

        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">AI Analytics & Performance</h1>
            <p className="text-gray-500 mt-1">Predictive insights and performance metrics</p>
          </div>
          <button onClick={load} disabled={loading}
            className="flex items-center gap-2 px-4 py-2 border border-sky-400 text-sky-500 rounded-xl hover:bg-sky-50 transition font-medium disabled:opacity-50">
            <RefreshCcw size={16} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 rounded-xl px-5 py-3 text-sm">{error}</div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 size={32} className="animate-spin text-slate-300" />
          </div>
        ) : (
          <>
            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              <StatCard label="Task Completion"  value={`${s?.completionRate ?? 0}%`}
                sub={`${s?.doneTasks ?? 0} of ${s?.totalTasks ?? 0} tasks done`}
                icon={CheckCircle} bg="bg-green-50" color="text-green-600" />
              <StatCard label="On-Time Rate"     value={`${s?.onTimeRate ?? 0}%`}
                sub={`${s?.completedProjects ?? 0} projects completed`}
                icon={Target} bg="bg-blue-50" color="text-blue-600" />
              <StatCard label="Overdue Tasks"    value={s?.overdueTasks ?? 0}
                sub="Requires immediate attention"
                icon={AlertCircle} bg="bg-red-50" color="text-red-600" />
              <StatCard label="Revenue Collected" value={fmt(s?.paidRevenue)}
                sub={`${fmt(s?.pendingRevenue)} pending`}
                icon={DollarSign} bg="bg-purple-50" color="text-purple-600" />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Project progress */}
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <h3 className="text-base font-bold text-slate-800 mb-4">Project Progress</h3>
                {progressChartData.length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-10">No active projects</p>
                ) : (
                  <div className="h-52">
                    <ResponsiveContainer>
                      <BarChart data={progressChartData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} unit="%" />
                        <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={90} />
                        <Tooltip formatter={(v) => [`${v}%`, 'Progress']} />
                        <Bar dataKey="progress" fill="#3B82F6" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>

              {/* Team efficiency */}
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <h3 className="text-base font-bold text-slate-800 mb-4">Team Efficiency</h3>
                {teamChartData.length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-10">No team data available</p>
                ) : (
                  <div className="h-52">
                    <ResponsiveContainer>
                      <LineChart data={teamChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                        <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} unit="%" />
                        <Tooltip formatter={(v) => [`${v}%`, 'Efficiency']} />
                        <Line type="monotone" dataKey="efficiency" stroke="#10B981" strokeWidth={2.5} dot={{ r: 4 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </div>

            {/* AI Insights */}
            {data?.insights?.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <BrainCircuit size={20} className="text-purple-500" />
                  AI-Powered Insights
                </h3>
                <div className="space-y-3">
                  {data.insights.map((ins, i) => (
                    <div key={i} className={`border rounded-2xl p-5 ${LEVEL_STYLE[ins.level]}`}>
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-base">{ins.title}</h4>
                        <span className={`px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-widest ${LEVEL_BADGE[ins.level]}`}>
                          {ins.level}
                        </span>
                      </div>
                      <p className="text-sm opacity-80 mb-2">{ins.desc}</p>
                      <p className="text-sm"><span className="font-bold">Recommendation:</span> {ins.rec}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Team Performance Table */}
            {data?.teamPerformance?.length > 0 && (
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-8">
                <h3 className="text-base font-bold text-slate-800 mb-5">Team Member Performance</h3>
                <div className="space-y-4">
                  {data.teamPerformance.map(m => (
                    <div key={m.id} className="border border-slate-100 rounded-xl p-4">
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <p className="font-bold text-slate-800">{m.name}</p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {m.completed} completed · {m.inProgress} in progress
                            {m.overdue > 0 && <span className="text-red-500 ml-2">· {m.overdue} overdue</span>}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-black ${
                          m.efficiency >= 80 ? 'bg-green-100 text-green-700' :
                          m.efficiency >= 50 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-600'
                        }`}>
                          {m.efficiency}% efficiency
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-700 ${
                          m.efficiency >= 80 ? 'bg-green-500' :
                          m.efficiency >= 50 ? 'bg-yellow-400' : 'bg-red-400'
                        }`} style={{ width: `${m.efficiency}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Project Forecast */}
            {data?.projectForecasts?.length > 0 && (
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <h3 className="text-base font-bold text-slate-800 mb-5">Project Completion Forecast</h3>
                <div className="space-y-4">
                  {data.projectForecasts.map(p => (
                    <div key={p.id}>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="font-semibold text-slate-700 text-sm">{p.name}</span>
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            p.status === 'COMPLETED' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                          }`}>{p.status}</span>
                          <span className="text-xs font-bold text-slate-400">{p.progress}%</span>
                        </div>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-700 ${
                          p.status === 'COMPLETED' ? 'bg-green-500' : 'bg-blue-500'
                        }`} style={{ width: `${p.progress}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AIAnalytics;
