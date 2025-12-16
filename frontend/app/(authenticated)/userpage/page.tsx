'use client';

import { useEffect, useState } from "react";
import { User, Mail, Settings, Clock, Shield, Users, Trash2, Edit } from "lucide-react";
import apiFetch from "../../../utils/api";

export default function UserPage() {
  const [user, setUser] = useState({
    name: "Full Name",
    email: "email@example.com",
    role: "user",
    created_at: null as string | null,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    apiFetch('/api/user', { method: 'GET' })
      .then((data: any) => {
        if (data) {
          setUser(data);
        }
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto bg-white shadow-sm rounded-xl p-6 border border-gray-200">
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-indigo-100 text-indigo-600 rounded-full p-3">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{user.name}</h1>
            <p className="text-sm text-gray-600">{user.role}</p>
          </div>
        </div>

        <div className="space-y-4 text-gray-800">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-gray-500" />
            <p>{user.email}</p>
          </div>

          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-gray-500" />
            <p>Member since: {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</p>
          </div>

          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-gray-500" />
            <p>Account Type: {user.role === "admin" ? "Administrator" : "Standard User"}</p>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-6 pt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Settings className="w-5 h-5 text-gray-500" />
            Settings
          </h2>
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg border text-gray-800">
              Change Password
            </button>
            <button className="w-full text-left px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg border text-gray-800">
              Notification Preferences
            </button>

          </div>
        </div>
      </div>
    </div>)
}