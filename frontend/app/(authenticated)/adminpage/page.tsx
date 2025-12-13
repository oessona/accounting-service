"use client";

import React, { useState } from "react";
import { Users, Trash2, Edit } from "lucide-react";
import apiFetch from "../../../utils/api";

export default function AdminPage() {
  const [tab, setTab] = useState<'manage' | 'activity'>('manage');
  const [filter, setFilter] = useState('all');
  const [managedUsers, setManagedUsers] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/api/admin/users', { method: 'GET' });
      if (Array.isArray(data)) setManagedUsers(data);
    } catch (e) {
      console.error(e);
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const fetchActivity = async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/api/admin/activity', { method: 'GET' });
      if (Array.isArray(data)) setAuditLogs(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (tab === 'manage') fetchUsers();
    if (tab === 'activity') fetchActivity();
  }, [tab]);

  const handleEdit = (id: number) => {
    alert(`Open edit for user id ${id}`);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete user?')) return;
    try {
      await apiFetch(`/api/admin/users/${id}`, { method: 'DELETE' });
      setManagedUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete user');
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-6xl mx-auto bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-indigo-100 text-indigo-600 rounded-full p-3">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-600">Manage users and view activity logs</p>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => setTab('manage')} className={`px-3 py-1 rounded ${tab === 'manage' ? 'bg-emerald-600 text-white' : 'bg-gray-50 text-gray-700'}`}>Manage Users</button>
          <button onClick={() => setTab('activity')} className={`px-3 py-1 rounded ${tab === 'activity' ? 'bg-emerald-600 text-white' : 'bg-gray-50 text-gray-700'}`}>
            User Activity
          </button>
        </div>

        {tab === 'manage' && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Role</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {managedUsers.map(u => (
                  <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-800">{u.name}</td>
                    <td className="py-3 px-4 text-gray-600">{u.email}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => handleEdit(u.id)} className="text-gray-600 hover:text-gray-800 hover:bg-gray-100 p-2 rounded"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(u.id)} className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'activity' && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="text-sm text-gray-600">Filter</div>
                <select value={filter} onChange={(e) => setFilter(e.target.value)} className="border rounded px-2 py-1 text-sm">
                  <option value="all">All</option>
                  <option value="login">Logins</option>
                  <option value="create_transaction">Adds</option>
                  <option value="edit_transaction">Edits</option>
                  <option value="delete_transaction">Deletes</option>
                </select>
              </div>
              <div className="text-sm text-gray-600">{auditLogs.length} events</div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Time</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">User</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Action</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Target</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.filter(a => filter === 'all' ? true : a.action === filter).map(a => (
                    <tr key={a.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-600">{new Date(a.at).toLocaleString()}</td>
                      <td className="py-3 px-4 text-gray-800">{a.user}</td>
                      <td className="py-3 px-4 text-gray-700">{a.action.replace('_', ' ')}</td>
                      <td className="py-3 px-4 text-gray-600">{a.target}</td>
                      <td className="py-3 px-4 text-gray-600">{a.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
