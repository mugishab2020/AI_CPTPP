import { useState, useEffect } from 'react';
import {
  Plus, Bell, MessageSquare, Send, Loader2,
  X, Check, Mail, CornerUpLeft
} from 'lucide-react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useAuth } from '../context/AuthContext';

const API_BASE = 'http://localhost:3001';

// ── Compose / Reply Modal ─────────────────────────────────────────────────────
const ComposeModal = ({ token, onClose, onSent, prefill = {} }) => {
  const [users,      setUsers]      = useState([]);
  const [receiverId, setReceiverId] = useState(prefill.receiverId || '');
  const [subject,    setSubject]    = useState(prefill.subject    || '');
  const [body,       setBody]       = useState(prefill.body       || '');
  const [loading,    setLoading]    = useState(true);
  const [sending,    setSending]    = useState(false);
  const [error,      setError]      = useState(null);

  const isReply = !!prefill.receiverId;

  useEffect(() => {
    fetch(`${API_BASE}/communications/messageable-users`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(d => setUsers(d.data || []))
      .catch(() => setError('Failed to load users'))
      .finally(() => setLoading(false));
  }, [token]);

  const handleSend = async () => {
    if (!receiverId || !subject || !body) { setError('All fields are required'); return; }
    setSending(true); setError(null);
    try {
      const res = await fetch(`${API_BASE}/communications`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, body, type: 'MESSAGE', receiver_id: receiverId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to send');
      onSent();
    } catch (err) { setError(err.message); setSending(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-8 relative">
        <button onClick={onClose} className="absolute top-5 right-5 text-slate-400 hover:text-slate-600">
          <X size={20} />
        </button>
        <h2 className="text-xl font-bold text-slate-900 mb-6">
          {isReply ? 'Reply to Message' : 'New Message'}
        </h2>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-2.5 text-sm">{error}</div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">To</label>
            {loading ? (
              <div className="flex items-center gap-2 text-slate-400 text-sm py-2">
                <Loader2 size={15} className="animate-spin" /> Loading users…
              </div>
            ) : (
              <select
                value={receiverId}
                onChange={e => setReceiverId(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
              >
                <option value="">Select recipient…</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.role?.replace('_', ' ')})
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="Message subject"
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Message</label>
            <textarea
              rows={4}
              value={body}
              onChange={e => setBody(e.target.value)}
              placeholder="Write your message…"
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/30 resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose}
            className="flex-1 border border-slate-200 text-slate-600 py-3 rounded-xl text-sm font-semibold hover:bg-slate-50">
            Cancel
          </button>
          <button onClick={handleSend} disabled={sending || loading}
            className="flex-1 bg-[#00A6C0] hover:bg-cyan-700 text-white py-3 rounded-xl text-sm font-bold disabled:opacity-50 flex items-center justify-center gap-2">
            {sending ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
            {sending ? 'Sending…' : isReply ? 'Send Reply' : 'Send Message'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Message card ──────────────────────────────────────────────────────────────
const MessageCard = ({ msg, currentUserId, onMarkRead, token, onReplySent }) => {
  const isUnread   = msg.status === 'UNREAD';
  const isIncoming = msg.receiver_id === currentUserId;
  const [replying, setReplying] = useState(false);
  const [replyBody, setReplyBody] = useState('');
  const [sending,  setSending]  = useState(false);
  const [replyErr, setReplyErr] = useState(null);

  const handleSendReply = async () => {
    if (!replyBody.trim()) return;
    setSending(true); setReplyErr(null);
    try {
      const res = await fetch(`${API_BASE}/communications`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: msg.subject?.startsWith('Re:') ? msg.subject : `Re: ${msg.subject || ''}`,
          body: replyBody,
          type: 'MESSAGE',
          receiver_id: msg.sender_id,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to send reply');
      setReplyBody('');
      setReplying(false);
      onReplySent();
    } catch (err) { setReplyErr(err.message); }
    finally { setSending(false); }
  };

  return (
    <div className={`bg-white border rounded-xl shadow-sm transition-all overflow-hidden ${
      isUnread && isIncoming ? 'border-l-4 border-l-cyan-500 border-slate-100' : 'border-slate-100'
    }`}>
      {/* Message content */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <div>
            <p className="font-semibold text-slate-800 text-sm">{msg.subject || '(no subject)'}</p>
            <p className="text-xs text-slate-400 mt-0.5">
              {isIncoming
                ? `From: ${msg.sender?.name ?? 'Unknown'}`
                : `To: ${msg.receiver?.name ?? 'Unknown'}`}
              {' · '}{new Date(msg.created_at).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {isUnread && isIncoming && (
              <span className="bg-cyan-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">
                New
              </span>
            )}
            {!isIncoming && (
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest">Sent</span>
            )}
          </div>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed">{msg.body}</p>

        <div className="flex items-center gap-3 mt-3">
          {isIncoming && (
            <button
              onClick={() => { setReplying(r => !r); setReplyErr(null); }}
              className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${
                replying ? 'text-cyan-700' : 'text-cyan-600 hover:text-cyan-700'
              }`}
            >
              <CornerUpLeft size={13} />
              {replying ? 'Cancel Reply' : 'Reply'}
            </button>
          )}
          {isUnread && isIncoming && (
            <button onClick={() => onMarkRead(msg.id)}
              className="flex items-center gap-1 text-slate-400 text-xs font-semibold hover:text-slate-600 transition-colors">
              <Check size={13} /> Mark as read
            </button>
          )}
        </div>
      </div>

      {/* Inline reply box */}
      {replying && (
        <div className="border-t border-slate-100 bg-slate-50/60 px-5 py-4">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
            Replying to {msg.sender?.name}
          </p>
          {replyErr && (
            <div className="mb-2 text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{replyErr}</div>
          )}
          <textarea
            rows={3}
            value={replyBody}
            onChange={e => setReplyBody(e.target.value)}
            placeholder="Write your reply…"
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/30 resize-none bg-white"
          />
          <div className="flex justify-end mt-2">
            <button
              onClick={handleSendReply}
              disabled={sending || !replyBody.trim()}
              className="flex items-center gap-2 bg-[#00A6C0] hover:bg-cyan-700 text-white px-4 py-2 rounded-xl text-sm font-bold disabled:opacity-50 transition-colors"
            >
              {sending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
              {sending ? 'Sending…' : 'Send Reply'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Main exported component ───────────────────────────────────────────────────
const CommunicationPage = () => {
  const { token, user } = useAuth();
  const [tab,     setTab]     = useState('inbox');
  const [messages,setMessages]= useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  // compose = null (closed) | {} (new) | { receiverId, subject, body } (reply)
  const [compose, setCompose] = useState(null);

  const authHeader = { Authorization: `Bearer ${token}` };

  const fetchMessages = async () => {
    setLoading(true); setError(null);
    try {
      const res  = await fetch(`${API_BASE}/communications/my-messages`, { headers: authHeader });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to load');
      setMessages(data.data || []);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (token) fetchMessages(); }, [token]);

  const handleMarkRead = async (id) => {
    try {
      await fetch(`${API_BASE}/communications/${id}/read`, {
        method: 'PATCH',
        headers: { ...authHeader, 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'READ' }),
      });
      setMessages(prev => prev.map(m => m.id === id ? { ...m, status: 'READ' } : m));
    } catch (err) { console.error(err); }
  };

  const handleMarkAllRead = async () => {
    const unread = messages.filter(m => m.status === 'UNREAD' && m.receiver_id === user?.id);
    await Promise.all(unread.map(m => handleMarkRead(m.id)));
  };

  const inbox   = messages.filter(m => m.receiver_id === user?.id && m.type !== 'NOTIFICATION');
  const sent    = messages.filter(m => m.sender_id   === user?.id && m.type !== 'NOTIFICATION');
  const notifs  = messages.filter(m => m.type === 'NOTIFICATION');
  const unreadCount = inbox.filter(m => m.status === 'UNREAD').length;

  const tabItems = [
    { key: 'inbox',  label: 'Inbox',         icon: MessageSquare, count: unreadCount },
    { key: 'sent',   label: 'Sent',           icon: Send,          count: 0 },
    { key: 'notifs', label: 'Notifications',  icon: Bell,          count: notifs.filter(n => n.status === 'UNREAD').length },
  ];

  const currentList = tab === 'inbox' ? inbox : tab === 'sent' ? sent : notifs;

  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 p-8">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6">

          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Communications</h1>
              <p className="text-slate-400 mt-1">Manage conversations and notifications</p>
            </div>
            <button onClick={() => setCompose({})}
              className="bg-[#00A6C0] hover:bg-cyan-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-bold shadow-sm transition-all active:scale-95">
              <Plus size={20} strokeWidth={3} /> New Message
            </button>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 rounded-xl px-5 py-3 text-sm">{error}</div>
          )}

          {/* Tabs */}
          <div className="flex gap-8 border-b border-slate-200 mb-6">
            {tabItems.map(t => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`flex items-center gap-2 pb-4 font-semibold text-sm transition-colors ${
                  tab === t.key ? 'text-cyan-600 border-b-2 border-cyan-600' : 'text-slate-400 hover:text-slate-600'
                }`}>
                <t.icon size={16} />
                {t.label}
                {t.count > 0 && (
                  <span className="bg-cyan-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">
                    {t.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Unread bar */}
          {tab === 'inbox' && (
            <div className="flex justify-between items-center bg-white border border-slate-200 rounded-xl px-5 py-3 mb-6">
              <p className="text-slate-500 text-sm">
                {unreadCount > 0
                  ? <><span className="font-bold text-cyan-600">{unreadCount}</span> unread message{unreadCount > 1 ? 's' : ''}</>
                  : 'All messages read'}
              </p>
              {unreadCount > 0 && (
                <button onClick={handleMarkAllRead}
                  className="text-cyan-600 border border-cyan-200 px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-cyan-50 transition-colors flex items-center gap-1.5">
                  <Check size={13} /> Mark all as read
                </button>
              )}
            </div>
          )}

          {/* Message list */}
          <div className="space-y-3 pb-10">
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 size={24} className="animate-spin text-slate-300" />
              </div>
            ) : currentList.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <Mail size={36} className="mx-auto mb-3 opacity-20" />
                <p className="text-sm">
                  {tab === 'inbox' ? 'No messages received yet' :
                   tab === 'sent'  ? 'No messages sent yet' :
                   'No notifications yet'}
                </p>
              </div>
            ) : currentList.map(msg => (
              <MessageCard
                key={msg.id}
                msg={msg}
                currentUserId={user?.id}
                token={token}
                onMarkRead={handleMarkRead}
                onReplySent={fetchMessages}
                onReply={prefill => setCompose(prefill)}
              />
            ))}
          </div>
        </main>
      </div>

      {compose !== null && (
        <ComposeModal
          token={token}
          prefill={compose}
          onClose={() => setCompose(null)}
          onSent={() => { setCompose(null); fetchMessages(); }}
        />
      )}
    </div>
  );
};

export default CommunicationPage;
