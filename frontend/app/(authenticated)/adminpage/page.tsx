"use client";

import React, { useState } from "react";
import {
  Users,
  Trash2,
  Edit,
  AlertCircle,
  Activity,
  ShieldCheck,
  ChevronRight,
  Search,
  Filter,
  MonitorCheck,
  History,
  Lock,
  UserCheck,
  Shield
} from "lucide-react";
import apiFetch from "../../../utils/api";

export default function AdminPage() {
  const [tab, setTab] = useState<'manage' | 'activity'>('manage');
  const [filter, setFilter] = useState('all');
  const [managedUsers, setManagedUsers] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [accessDenied, setAccessDenied] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  React.useEffect(() => {
    const checkAdmin = async () => {
      try {
        const userData = await apiFetch('/api/user', { method: 'GET' });
        setUser(userData);
        if (userData?.role !== 'admin') {
          setAccessDenied(true);
        }
      } catch (e) {
        console.error(e);
        setError('Failed to verify permissions');
      }
    };
    checkAdmin();
  }, []);

  const fetchUsers = async () => {
    if (accessDenied) return;
    setLoading(true);
    try {
      const data = await apiFetch('/api/admin/users', { method: 'GET' });
      if (Array.isArray(data)) setManagedUsers(data);
    } catch (e: any) {
      console.error(e);
      if (e.status === 403) {
        setAccessDenied(true);
        setError('Access denied: Admin privileges required');
      } else {
        setError('Failed to fetch users');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchActivity = async () => {
    if (accessDenied) return;
    setLoading(true);
    try {
      const data = await apiFetch('/api/admin/activity', { method: 'GET' });
      if (Array.isArray(data)) setAuditLogs(data);
    } catch (e: any) {
      console.error(e);
      if (e.status === 403) {
        setAccessDenied(true);
        setError('Access denied: Admin privileges required');
      }
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (tab === 'manage' && !accessDenied) fetchUsers();
    if (tab === 'activity' && !accessDenied) fetchActivity();
  }, [tab, accessDenied]);

  const handleEdit = (id: number) => {
    alert(`Editing configuration for user ID ${id}`);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you absolutely sure you want to terminate this user entity?')) return;
    try {
      await apiFetch(`/api/admin/users/${id}`, { method: 'DELETE' });
      setManagedUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to execute termination');
    }
  };

  if (accessDenied) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
        <div className="bg-white rounded-[3rem] p-12 shadow-2xl shadow-rose-100 max-w-lg text-center border border-rose-100">
          <div className="w-24 h-24 bg-rose-50 text-rose-500 rounded-[2rem] flex items-center justify-center mx-auto mb-8 animate-bounce">
            <Lock size={48} strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">Restricted Area</h1>
          <p className="text-slate-500 text-lg mb-8 leading-relaxed">
            You attempt to access the <span className="text-rose-600 font-bold uppercase tracking-wider">Control Hub</span> without sufficient clearance level.
          </p>
          <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-center gap-3 mb-8">
            <Shield size={18} className="text-slate-400" />
            <span className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Required Level: SYS_ADMIN</span>
          </div>
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="w-full bg-slate-900 hover:bg-black text-white px-8 h-16 rounded-[1.5rem] font-black tracking-tight transition-all active:scale-95"
          >
            Return to Safe Zone
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-10">
      <div className="max-w-7xl mx-auto">

        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm uppercase tracking-widest mb-1">
              <ShieldCheck size={16} />
              <span>Core Operational Hub</span>
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">System Console</h1>
            <p className="text-slate-500 mt-2 text-lg">Managing infrastructure, entities, and data flows.</p>
          </div>

          <div className="flex bg-white p-2 rounded-[1.5rem] shadow-sm border border-slate-100">
            <button
              onClick={() => setTab('manage')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${tab === 'manage' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <Users size={16} />
              Entities
            </button>
            <button
              onClick={() => setTab('activity')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${tab === 'activity' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <Activity size={16} />
              Audit Logs
            </button>
          </div>
        </header>

        {error && (
          <div className="mb-8 flex items-center gap-4 bg-amber-50 border border-amber-100 p-6 rounded-[2rem] animate-in slide-in-from-top-4 duration-500">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-amber-500 shadow-sm">
              <AlertCircle size={24} />
            </div>
            <div>
              <p className="text-amber-900 font-black tracking-tight leading-none mb-1">Environmental Warning</p>
              <p className="text-amber-600 text-sm font-medium">{error}</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden min-h-[500px]">
          {tab === 'manage' && (
            <div className="animate-in fade-in duration-500">
              <div className="p-8 lg:p-10 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 leading-none mb-1">User Directory</h3>
                  <p className="text-slate-400 font-medium italic">Scaling {managedUsers.length} total active nodes</p>
                </div>
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                  <input
                    type="text"
                    placeholder="Search by ID or Name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 pr-6 h-12 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-slate-700 w-full md:w-64"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50/50 text-left">
                      <th className="px-10 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Digital Entity</th>
                      <th className="px-10 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Protocol Clearance</th>
                      <th className="px-10 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Ops Control</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {loading ? (
                      <tr>
                        <td colSpan={3} className="py-20 text-center">
                          <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
                          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest animate-pulse">Scanning Grid...</p>
                        </td>
                      </tr>
                    ) : managedUsers.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="py-20 text-center">
                          <MonitorCheck className="w-16 h-16 text-slate-100 mx-auto mb-4" />
                          <p className="text-slate-400 font-black uppercase tracking-widest text-xs">No active nodes detected</p>
                        </td>
                      </tr>
                    ) : managedUsers.map(u => (
                      <tr key={u.id} className="group hover:bg-slate-50/30 transition-colors">
                        <td className="px-10 py-6">
                          <div className="flex items-center gap-5">
                            <div className="w-12 h-12 bg-slate-100 rounded-[1.2rem] flex items-center justify-center text-slate-400 font-black group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                              {u.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-lg font-black text-slate-900 group-hover:text-indigo-600 transition-colors leading-none mb-1">{u.name}</p>
                              <p className="text-sm text-slate-400 font-medium italic">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-10 py-6">
                          <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${u.role === 'admin' ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600'}`}>
                            {u.role === 'admin' ? <ShieldCheck size={12} /> : <UserCheck size={12} />}
                            {u.role === 'admin' ? 'System Administrator' : 'Verified Entity'}
                          </span>
                        </td>
                        <td className="px-10 py-6">
                          <div className="flex justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleEdit(u.id)} className="w-11 h-11 bg-white hover:shadow-xl hover:-translate-y-1 rounded-2xl flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-all border border-slate-100 shadow-sm"><Edit size={18} /></button>
                            <button onClick={() => handleDelete(u.id)} className="w-11 h-11 bg-white hover:shadow-xl hover:-translate-y-1 rounded-2xl flex items-center justify-center text-slate-400 hover:text-rose-600 transition-all border border-slate-100 shadow-sm"><Trash2 size={18} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === 'activity' && (
            <div className="animate-in slide-in-from-right-10 duration-500">
              <div className="p-8 lg:p-10 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 leading-none mb-1">Audit Ledger</h3>
                  <p className="text-slate-400 font-medium italic">Streaming {auditLogs.length} verified events</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100">
                    <Filter size={14} className="text-indigo-600" />
                    <select
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      className="bg-transparent text-xs font-black text-slate-600 uppercase tracking-widest cursor-pointer outline-none"
                    >
                      <option value="all">Full Flux</option>
                      <option value="Transaction Created">Ledgers</option>
                      <option value="login">Entrance</option>
                      <option value="edit">Modifications</option>
                      <option value="delete">Terminations</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50/50 text-left">
                      <th className="px-10 py-5 text-xs font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Timestamp</th>
                      <th className="px-10 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Active Node</th>
                      <th className="px-10 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Protocol Op</th>
                      <th className="px-10 py-5 text-xs font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Op Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {loading ? (
                      <tr>
                        <td colSpan={4} className="py-20 text-center">
                          <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
                          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest animate-pulse">Syncing Streams...</p>
                        </td>
                      </tr>
                    ) : auditLogs.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-20 text-center">
                          <History className="w-16 h-16 text-slate-100 mx-auto mb-4" />
                          <p className="text-slate-400 font-black uppercase tracking-widest text-xs">No ledger entries detected</p>
                        </td>
                      </tr>
                    ) : auditLogs.filter(a => filter === 'all' ? true : a.action.includes(filter)).map(a => (
                      <tr key={a.id} className="hover:bg-slate-50/20 transition-colors group">
                        <td className="px-10 py-6 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">
                              {new Date(a.at).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase">
                              {new Date(a.at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                            </span>
                          </div>
                        </td>
                        <td className="px-10 py-6">
                          <span className="text-sm font-black text-slate-700">{a.user}</span>
                        </td>
                        <td className="px-10 py-6">
                          <span className="inline-block px-3 py-1 text-[9px] font-black uppercase tracking-[0.1em] rounded-lg bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                            {a.action}
                          </span>
                        </td>
                        <td className="px-10 py-6">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-slate-300 font-mono mb-1">{a.target}</span>
                            <span className="text-xs font-medium text-slate-500 italic max-w-sm line-clamp-1">{a.details}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
