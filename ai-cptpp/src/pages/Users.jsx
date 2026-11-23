import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { useAuth } from "../context/AuthContext";
import { Plus, Eye, Pencil, Trash2, X, Loader2, Search, Shield } from "lucide-react";

const API_BASE = "http://localhost:3001";

const ROLES = ["ADMIN", "MANAGER", "CLIENT", "TEAM_MEMBER"];

const ROLE_STYLES = {
  ADMIN:       "bg-purple-100 text-purple-700",
  MANAGER:     "bg-green-100 text-green-700",
  CLIENT:      "bg-blue-100 text-blue-700",
  TEAM_MEMBER: "bg-pink-100 text-pink-700",
};

const ROLE_META = {
  ADMIN:       { label: "Admin",        desc: "Full system access and management",   perms: ["View all", "Edit all", "Delete all", "User Management"] },
  MANAGER:     { label: "Manager",      desc: "Manage projects and teams",           perms: ["View projects", "Edit project", "Team Management", "Invoices"] },
  CLIENT:      { label: "Client",       desc: "Client portal access",               perms: ["View own projects", "View invoices", "Pay invoices", "Communications"] },
  TEAM_MEMBER: { label: "Team Member",  desc: "Task execution and collaboration",   perms: ["View assigned tasks", "Update task status", "View project", "Communications"] },
};

// ── Invite / Edit Modal ───────────────────────────────────────────────────────
const UserModal = ({ token, editUser, onClose, onSaved }) => {
  const isEdit = !!editUser;
  const [form, setForm] = useState({
    name:         editUser?.name         ?? "",
    email:        editUser?.email        ?? "",
    role:         editUser?.role         ?? "TEAM_MEMBER",
    password:     "",
    phone_number: editUser?.phone_number ?? "",
    address:      editUser?.address      ?? "",
    department:   editUser?.department   ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const url    = isEdit ? `${API_BASE}/users/${editUser.id}` : `${API_BASE}/auth/admin/register-team-member`;
      const method = isEdit ? "PATCH" : "POST";
      const body   = isEdit
        ? { 
            name: form.name, 
            email: form.email, 
            role: form.role,
            phone_number: form.phone_number,
            address: form.address,
            department: form.department,
          }
        : { 
            name: form.name, 
            email: form.email, 
            role: form.role, 
            password: form.password,
            phone_number: form.phone_number,
            address: form.address,
            department: form.department,
          };

      const res  = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Request failed");
      onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-8 relative">
        <button onClick={onClose} className="absolute top-5 right-5 text-slate-400 hover:text-slate-600">
          <X size={20} />
        </button>
        <h2 className="text-xl font-bold text-slate-900 mb-6">
          {isEdit ? "Edit User" : "Invite User"}
        </h2>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-2.5 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Name</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Full name"
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Email</label>
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="email@example.com"
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Phone Number</label>
            <input
              type="tel"
              value={form.phone_number}
              onChange={(e) => setForm((f) => ({ ...f, phone_number: e.target.value }))}
              placeholder="+1 (555) 000-0000"
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Address</label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
              placeholder="Street address"
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Department</label>
            <input
              type="text"
              value={form.department}
              onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}
              placeholder="e.g., Engineering, Design"
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Role</label>
            <select
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
            >
              {!isEdit && <option value="TEAM_MEMBER">{ROLE_META["TEAM_MEMBER"].label}</option>}
              {!isEdit && <option value="MANAGER">{ROLE_META["MANAGER"].label}</option>}
              {isEdit && ROLES.map((r) => (
                <option key={r} value={r}>{ROLE_META[r].label}</option>
              ))}
            </select>
          </div>
          {!isEdit && (
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                Temporary Password
              </label>
              <input
                required
                type="password"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                placeholder="Min 6 characters"
                minLength={6}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
              />
            </div>
          )}
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
              className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white py-3 rounded-xl text-sm font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving && <Loader2 size={15} className="animate-spin" />}
              {isEdit ? "Save Changes" : "Register Team Member"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── Delete Confirm Modal ──────────────────────────────────────────────────────
const DeleteModal = ({ user: target, token, onClose, onDeleted }) => {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      const res  = await fetch(`${API_BASE}/users/${target.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Delete failed");
      onDeleted();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-8 relative">
        <button onClick={onClose} className="absolute top-5 right-5 text-slate-400 hover:text-slate-600">
          <X size={20} />
        </button>
        <div className="flex items-center justify-center w-12 h-12 bg-red-50 rounded-full mb-4">
          <Trash2 size={22} className="text-red-500" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 mb-1">Delete User</h2>
        <p className="text-sm text-slate-500 mb-6">
          Are you sure you want to delete <span className="font-semibold text-slate-700">{target.name}</span>? This cannot be undone.
        </p>
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-2.5 text-sm">
            {error}
          </div>
        )}
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 border border-slate-200 text-slate-600 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-50">
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-xl text-sm font-bold disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────────────
const Users = () => {
  const { token, user: me } = useAuth();
  const [users,   setUsers]   = useState([]);
  const [stats,   setStats]   = useState(null);
  const [search,  setSearch]  = useState("");
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [modal,   setModal]   = useState(null); // null | { type: 'invite' | 'edit' | 'delete', user? }

  const authHeader = { Authorization: `Bearer ${token}` };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [usersRes, statsRes] = await Promise.all([
        fetch(`${API_BASE}/users`,       { headers: authHeader }),
        fetch(`${API_BASE}/users/stats`, { headers: authHeader }),
      ]);
      const [usersData, statsData] = await Promise.all([usersRes.json(), statsRes.json()]);
      if (!usersRes.ok) throw new Error(usersData.message || "Failed to fetch users");
      setUsers(usersData.data);
      setStats(statsData.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.role.toLowerCase().includes(q);
  });

  // derive stat counts from byRole
  const countByRole = (role) => stats?.byRole?.find((r) => r.role === role)?._count?.id ?? 0;

  const closeModal = () => setModal(null);
  const onSaved    = () => { closeModal(); fetchData(); };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 p-8">
        <Topbar />

        <div className="flex justify-between items-center mt-2 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">User & Role Management</h1>
            <p className="text-gray-500 mt-1">Manage team members and their permissions</p>
          </div>
          <button
            onClick={() => setModal({ type: "invite" })}
            className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white px-5 py-2.5 rounded-xl font-semibold transition-all active:scale-95"
          >
            <Plus size={18} />
            Invite User
          </button>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 rounded-xl px-5 py-3 text-sm">
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: "Total Users",   value: stats?.total ?? "—",              color: "text-slate-900" },
            { label: "Managers",      value: countByRole("MANAGER"),           color: "text-green-600" },
            { label: "Clients",       value: countByRole("CLIENT"),            color: "text-blue-600"  },
            { label: "Team Members",  value: countByRole("TEAM_MEMBER"),       color: "text-pink-600"  },
          ].map((s) => (
            <div key={s.label} className="bg-white border rounded-2xl p-6 shadow-sm">
              <p className="text-gray-500 text-sm">{s.label}</p>
              <h2 className={`text-2xl font-bold mt-2 ${s.color}`}>
                {loading ? <Loader2 size={20} className="animate-spin" /> : s.value}
              </h2>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by name, email or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-slate-200 rounded-xl px-4 py-3 pl-11 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
          />
        </div>

        {/* Table */}
        <div className="bg-white border rounded-2xl shadow-sm overflow-hidden mb-12">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 border-b text-[11px] uppercase tracking-widest font-bold bg-slate-50/50">
                <th className="text-left px-6 py-4">Name</th>
                <th className="text-left px-6 py-4">Email</th>
                <th className="text-left px-6 py-4">Role</th>
                <th className="text-left px-6 py-4">Projects</th>
                <th className="text-left px-6 py-4">Joined</th>
                <th className="text-center px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center">
                    <Loader2 size={24} className="animate-spin mx-auto text-slate-400" />
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400 text-sm">
                    No users found
                  </td>
                </tr>
              ) : (
                filtered.map((u) => {
                  const projectCount =
                    (u._count?.managed_projects ?? 0) +
                    (u._count?.client_projects ?? 0) +
                    (u._count?.team_memberships ?? 0);
                  return (
                    <tr key={u.id} className="border-b last:border-none hover:bg-slate-50/40 transition-colors">
                      <td className="px-6 py-4 font-semibold text-slate-800">{u.name}</td>
                      <td className="px-6 py-4 text-slate-500">{u.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${ROLE_STYLES[u.role] ?? "bg-gray-100 text-gray-600"}`}>
                          {ROLE_META[u.role]?.label ?? u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500">{projectCount}</td>
                      <td className="px-6 py-4 text-slate-400">{new Date(u.created_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={() => setModal({ type: "edit", user: u })}
                            title="Edit"
                            className="text-slate-300 hover:text-cyan-500 transition-colors"
                          >
                            <Pencil size={16} />
                          </button>
                          {u.id !== me?.id && (
                            <button
                              onClick={() => setModal({ type: "delete", user: u })}
                              title="Delete"
                              className="text-slate-300 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Roles & Permissions */}
        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Shield size={20} className="text-cyan-500" />
          Roles & Permissions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ROLES.map((role) => (
            <div key={role} className="bg-white border rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-base font-bold text-slate-900">{ROLE_META[role].label}</h3>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${ROLE_STYLES[role]}`}>
                  {countByRole(role)} users
                </span>
              </div>
              <p className="text-slate-400 text-sm mb-4">{ROLE_META[role].desc}</p>
              <div className="space-y-1.5">
                {ROLE_META[role].perms.map((p) => (
                  <div key={p} className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="text-green-500 font-bold">✓</span> {p}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {modal?.type === "invite" && (
        <UserModal token={token} editUser={null} onClose={closeModal} onSaved={onSaved} />
      )}
      {modal?.type === "edit" && (
        <UserModal token={token} editUser={modal.user} onClose={closeModal} onSaved={onSaved} />
      )}
      {modal?.type === "delete" && (
        <DeleteModal user={modal.user} token={token} onClose={closeModal} onDeleted={onSaved} />
      )}
    </div>
  );
};

export default Users;
