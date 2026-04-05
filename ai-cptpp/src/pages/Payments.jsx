import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { useAuth } from "../context/AuthContext";
import { Search, Eye, Download, Loader2 } from "lucide-react";

const API_BASE = "http://localhost:3001";

const METHOD_COLORS = {
  CARD: "from-blue-700 to-sky-400",
  BANK_TRANSFER: "from-blue-600 to-cyan-400",
  MOBILE_MONEY: "from-cyan-500 to-teal-400",
  CASH: "from-blue-500 to-blue-400",
};

const METHOD_LABELS = {
  CARD: "Credit / Debit Card",
  BANK_TRANSFER: "Bank Transfer",
  MOBILE_MONEY: "Mobile Money",
  CASH: "Cash",
};

const statusStyle = (status) => {
  switch (status) {
    case "PAID": return "bg-[#e6fcf5] text-[#20c997]";
    case "PENDING": return "bg-[#fff4e6] text-[#ff922b]";
    case "OVERDUE": return "bg-[#fff5f5] text-[#ff6b6b]";
    case "CANCELLED": return "bg-gray-100 text-gray-500";
    default: return "bg-gray-100 text-gray-600";
  }
};

const fmt = (n) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

const Payments = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);
  const [payments, setPayments] = useState([]);
  const [methodStats, setMethodStats] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const authHeader = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      try {
        const [statsRes, paymentsRes, methodRes] = await Promise.all([
          fetch(`${API_BASE}/payments/stats`, { headers: authHeader }),
          fetch(`${API_BASE}/payments`, { headers: authHeader }),
          fetch(`${API_BASE}/payments/method-stats`, { headers: authHeader }),
        ]);

        const [statsData, paymentsData, methodData] = await Promise.all([
          statsRes.json(),
          paymentsRes.json(),
          methodRes.json(),
        ]);

        if (!statsRes.ok) throw new Error(statsData.message || "Failed to load stats");
        if (!paymentsRes.ok) throw new Error(paymentsData.message || "Failed to load payments");

        setStats(statsData.data);
        setPayments(paymentsData.data);
        setMethodStats(methodData.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [token]);

  const filtered = payments.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.invoice?.project?.name?.toLowerCase().includes(q) ||
      p.invoice?.client?.name?.toLowerCase().includes(q) ||
      p.invoice?.id?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 p-8">
        <Topbar />

        <main className="flex-1 overflow-y-auto px-4 py-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Payments & Invoices</h1>
            <p className="text-gray-500 mt-1">Track all payments and invoice activity</p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 rounded-xl px-5 py-3 text-sm">
              {error}
            </div>
          )}

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-[#0033ff] rounded-xl p-6 text-white shadow-sm">
              <p className="text-sm font-semibold opacity-90">Total Revenue</p>
              <h2 className="text-3xl font-bold mt-2">
                {loading ? "—" : fmt(stats?.totalRevenue ?? 0)}
              </h2>
              <p className="text-xs mt-6 opacity-80">
                {loading ? "..." : `From ${stats?.totalCount ?? 0} invoices`}
              </p>
            </div>
            <div className="bg-[#008a00] rounded-xl p-6 text-white shadow-sm">
              <p className="text-sm font-semibold opacity-90">Paid</p>
              <h2 className="text-3xl font-bold mt-2">
                {loading ? "—" : fmt(stats?.paidAmount ?? 0)}
              </h2>
              <p className="text-xs mt-6 opacity-80">
                {loading ? "..." : `${stats?.paidCount ?? 0} invoices paid`}
              </p>
            </div>
            <div className="bg-[#ff9f1c] rounded-xl p-6 text-white shadow-sm">
              <p className="text-sm font-semibold opacity-90">Pending & Overdue</p>
              <h2 className="text-3xl font-bold mt-2">
                {loading ? "—" : fmt(stats?.pendingAmount ?? 0)}
              </h2>
              <p className="text-xs mt-6 opacity-80">
                {loading ? "..." : `${stats?.pendingCount ?? 0} invoices awaiting`}
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by project, client or invoice ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all shadow-sm"
            />
          </div>

          {/* Payments Table */}
          <div className="border border-gray-100 rounded-[24px] overflow-hidden shadow-sm mb-10">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#f8f9fa] border-b border-gray-100">
                <tr className="text-slate-900 font-bold text-sm">
                  <th className="p-5">Invoice</th>
                  <th className="p-5">Project</th>
                  <th className="p-5">Client</th>
                  <th className="p-5">Amount</th>
                  <th className="p-5">Method</th>
                  <th className="p-5">Date</th>
                  <th className="p-5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="p-10 text-center text-slate-400">
                      <Loader2 size={24} className="animate-spin mx-auto" />
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-10 text-center text-slate-400 text-sm">
                      No payments found
                    </td>
                  </tr>
                ) : (
                  filtered.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-5 text-sm font-medium text-gray-500 truncate max-w-[120px]">
                        {p.invoice?.id?.slice(0, 8)}…
                      </td>
                      <td className="p-5 text-sm font-medium text-gray-700">
                        {p.invoice?.project?.name ?? "—"}
                      </td>
                      <td className="p-5 text-sm font-semibold text-slate-700">
                        {p.invoice?.client?.name ?? "—"}
                      </td>
                      <td className="p-5 text-sm font-bold text-slate-800">
                        {fmt(p.amount)}
                      </td>
                      <td className="p-5 text-sm text-gray-500">
                        {METHOD_LABELS[p.method] ?? p.method}
                      </td>
                      <td className="p-5 text-sm text-gray-400">
                        {new Date(p.paid_at).toLocaleDateString()}
                      </td>
                      <td className="p-5">
                        <span className={`px-4 py-1.5 rounded-full text-[11px] font-bold ${statusStyle(p.invoice?.status)}`}>
                          {p.invoice?.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Payment Methods Distribution */}
          <div className="border border-gray-100 rounded-[28px] p-8 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-8">Payment Methods Distribution</h3>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 size={24} className="animate-spin text-slate-400" />
              </div>
            ) : methodStats.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-6">No payment data yet</p>
            ) : (
              <div className="space-y-5">
                {methodStats.map((m) => (
                  <div key={m.method} className="border border-gray-100 rounded-[20px] p-5 hover:bg-gray-50 transition-all">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-bold text-slate-800 text-lg">
                        {METHOD_LABELS[m.method] ?? m.method}
                      </span>
                      <span className="text-sm font-medium text-gray-400">
                        {m.count} transactions ({m.percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${METHOD_COLORS[m.method] ?? "from-blue-500 to-blue-400"} transition-all duration-700`}
                        style={{ width: `${m.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Payments;
