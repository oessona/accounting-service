'use client';

import { useState } from "react";
import { User, Mail, Settings, Clock, Shield, Users, Trash2, Edit } from "lucide-react";

export default function UserPage() {
  const [user] = useState({
    name: "Full Name",
    email: "email@example.com",
    role: "Admin",
    lastLogin: "Nov 10, 2025, 14:32",
  });

  const [showManageUsers, setShowManageUsers] = useState(false);

    const handleEdit = (name: string) => {
    alert(`Edit User ${name}`);
    // Add edit modal or navigation logic here
  };

  const handleDelete = (name: string) => {
    if (confirm(`Delete user ${name}?`)) {
      alert(`User ${name} deleted`);
      // Add deletion logic here
    }
  };

  // Mock data for managed users (only shown for admins)
  const [managedUsers] = useState([
    { id: 1, name: "Inkar Khairatkyzy", email: "ink@example.com", role: "User" },
    { id: 2, name: "Mafuyu Asahina", email: "yuki@example.com", role: "User" },
    { id: 3, name: "Snezhana Khitun", email: "snezha@example.com", role: "User" },
  ]);

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
            <p>Last login: {user.lastLogin}</p>
          </div>

          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-gray-500" />
            <p>Account Type: {user.role === "Admin" ? "Full Access" : "Limited Access"}</p>
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
            <button
              onClick={() => setShowManageUsers(!showManageUsers)}
              className="w-full text-left px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg border text-gray-800"
            >
              Manage Access
            </button>
          </div>
        </div>

        {/* Manage Users section - only for admins and when toggled */}
        {user.role === "Admin" && showManageUsers && (
          <div className="border-t border-gray-200 mt-6 pt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Users className="w-5 h-5 text-gray-500" />
              Manage Users
            </h2>
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
                  {managedUsers.map((usr) => (
                    <tr key={usr.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-800">{usr.name}</td>
                      <td className="py-3 px-4 text-gray-600">{usr.email}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${usr.role === "Admin" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"}`}>
                          {usr.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {/* Edit Button */}
                          <button
                            onClick={() => handleEdit(useState.name)} // pass user id
                            className="text-gray-600 hover:text-gray-800 hover:bg-gray-100 p-2 rounded"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDelete(useState.name)} // pass user id
                            className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
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
  );
}
