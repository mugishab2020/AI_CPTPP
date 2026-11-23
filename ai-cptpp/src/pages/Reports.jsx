import React, { useState } from 'react';
import { Plus, Download, Eye, Calendar, Loader2 } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { useAuth } from '../context/AuthContext';

const API_BASE = 'http://localhost:3001';

const FormatBadge = ({ type }) => (
  <span className="bg-[#E8EDFF] text-[#4F73FF] px-2 py-0.5 rounded text-[10px] font-black tracking-widest uppercase">
    {type}
  </span>
);

const reportsConfig = [
  {
    id: 1,
    name: 'Overview Report',
    type: 'Summary',
    endpoint: '/reports/overview',
    roles: ['ADMIN', 'MANAGER', 'CLIENT', 'TEAM_MEMBER'],
  },
  {
    id: 2,
    name: 'Projects Report',
    type: 'Projects',
    endpoint: '/reports/projects',
    roles: ['ADMIN', 'MANAGER', 'CLIENT', 'TEAM_MEMBER'],
  },
  {
    id: 3,
    name: 'Financial Report',
    type: 'Financial',
    endpoint: '/reports/financial',
    roles: ['ADMIN', 'MANAGER', 'CLIENT'],
  },
  {
    id: 4,
    name: 'Team Productivity Report',
    type: 'HR',
    endpoint: '/reports/team',
    roles: ['ADMIN', 'MANAGER', 'TEAM_MEMBER'],
  },
];

const Reports = () => {
  const { token, user } = useAuth();
  const [loading, setLoading] = useState({});
  const [error, setError] = useState(null);

  const fetchReport = async (report, action = 'download') => {
    setLoading((prev) => ({ ...prev, [`${report.id}-${action}`]: true }));
    setError(null);
    try {
      const res = await fetch(`${API_BASE}${report.endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to generate report');
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      if (action === 'download') {
        const a = document.createElement('a');
        a.href = url;
        a.download = `${report.name.replace(/\s+/g, '_')}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        window.open(url, '_blank');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading((prev) => ({ ...prev, [`${report.id}-${action}`]: false }));
    }
  };

  const visibleReports = reportsConfig.filter(
    (r) => !user?.role || r.roles.includes(user.role)
  );

  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 p-8">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-12">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Reports & Analytics</h1>
              <p className="text-slate-500 mt-1">Generate and download business reports as PDF</p>
            </div>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 rounded-xl px-5 py-3 text-sm">
              {error}
            </div>
          )}

          <h2 className="text-xl font-bold text-slate-900 mb-6">Available Reports</h2>

          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="p-5 font-bold text-slate-900 text-sm">Report Name</th>
                  <th className="p-5 font-bold text-slate-900 text-sm">Type</th>
                  <th className="p-5 font-bold text-slate-900 text-sm">Format</th>
                  <th className="p-5 text-center font-bold text-slate-900 text-sm">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {visibleReports.map((report) => (
                  <tr key={report.id} className="hover:bg-slate-50/30 transition-colors group">
                    <td className="p-5 text-sm font-semibold text-slate-800">{report.name}</td>
                    <td className="p-5 text-sm text-slate-400 font-medium">{report.type}</td>
                    <td className="p-5">
                      <FormatBadge type="PDF" />
                    </td>
                    <td className="p-5">
                      <div className="flex items-center justify-center gap-4 text-slate-300">
                        <button
                          onClick={() => fetchReport(report, 'download')}
                          disabled={loading[`${report.id}-download`]}
                          title="Download PDF"
                          className="hover:text-[#00A6C0] transition-colors disabled:opacity-50"
                        >
                          {loading[`${report.id}-download`]
                            ? <Loader2 size={18} className="animate-spin" />
                            : <Download size={18} />}
                        </button>
                        <button
                          onClick={() => fetchReport(report, 'view')}
                          disabled={loading[`${report.id}-view`]}
                          title="View PDF"
                          className="hover:text-[#00A6C0] transition-colors disabled:opacity-50"
                        >
                          {loading[`${report.id}-view`]
                            ? <Loader2 size={18} className="animate-spin" />
                            : <Eye size={18} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Reports;
