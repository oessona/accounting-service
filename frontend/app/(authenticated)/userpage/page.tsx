'use client';

import { useEffect, useState } from "react";
import { User, Mail, Settings, Clock, Shield, Lock, Bell, BellRing, Smartphone, Keyboard } from "lucide-react";
import apiFetch from "../../../utils/api";

export default function UserPage() {
  const [user, setUser] = useState({
    name: "Authorized User",
    email: "email@vault.com",
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

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh]">
        <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-400 font-black uppercase tracking-widest text-xs animate-pulse">Retrieving Profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-10">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10">
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm uppercase tracking-widest mb-1">
            <User size={16} />
            <span>Identity Management</span>
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Personal Preferences</h1>
          <p className="text-slate-500 mt-2 text-lg">Manage your digital footprint and application settings.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 text-center relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-indigo-500 to-violet-600 opacity-10 group-hover:opacity-20 transition-opacity"></div>

              <div className="relative pt-6">
                <div className="w-24 h-24 bg-white border-4 border-white shadow-xl rounded-[2rem] mx-auto flex items-center justify-center text-indigo-600 mb-6 transition-transform group-hover:scale-105">
                  <User size={40} strokeWidth={2.5} />
                </div>
                <h2 className="text-2xl font-black text-slate-900 leading-tight mb-1">{user.name}</h2>
                <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${user.role === 'admin' ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600'}`}>
                  {user.role} Status
                </span>
              </div>

              <div className="mt-10 space-y-4 text-left">
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl group/item hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-slate-50">
                  <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-400 group-hover/item:text-indigo-600 transition-colors">
                    <Mail size={18} />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Endpoint</p>
                    <p className="text-sm font-bold text-slate-700 truncate">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl group/item hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-slate-50">
                  <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-400 group-hover/item:text-indigo-600 transition-colors">
                    <Clock size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Authorization Date</p>
                    <p className="text-sm font-bold text-slate-700">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Pending'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl group/item hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-slate-50">
                  <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-400 group-hover/item:text-indigo-600 transition-colors">
                    <Shield size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol Clearancce</p>
                    <p className="text-sm font-bold text-slate-700">
                      {user.role === "admin" ? "Level 1: System Admin" : "Level 0: Standard Access"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Settings Section */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-slate-100 h-full">
              <div className="flex items-center gap-3 mb-10">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-600">
                  <Settings size={22} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 leading-none">Security & System</h3>
                  <p className="text-slate-500 font-medium">Fine-tune your user experience</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="group flex items-center justify-between p-6 bg-slate-50 rounded-[2rem] hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all border border-transparent hover:border-slate-100">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                      <Lock size={24} />
                    </div>
                    <div>
                      <p className="text-lg font-black text-slate-900 leading-tight">Credential Update</p>
                      <p className="text-sm text-slate-500 italic">Reset your authorization token</p>
                    </div>
                  </div>
                  <button className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold text-sm shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    Modify
                  </button>
                </div>

                <div className="group flex items-center justify-between p-6 bg-slate-50 rounded-[2rem] hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all border border-transparent hover:border-slate-100">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center">
                      <BellRing size={24} />
                    </div>
                    <div>
                      <p className="text-lg font-black text-slate-900 leading-tight">Global Notifications</p>
                      <p className="text-sm text-slate-500 italic">Manage push and pull alerts</p>
                    </div>
                  </div>
                  <button className="bg-white text-amber-600 px-6 py-3 rounded-xl font-bold text-sm shadow-sm group-hover:bg-amber-500 group-hover:text-white transition-all">
                    Configure
                  </button>
                </div>

                <div className="group flex items-center justify-between p-6 bg-slate-50 rounded-[2rem] hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all border border-transparent hover:border-slate-100">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                      <Smartphone size={24} />
                    </div>
                    <div>
                      <p className="text-lg font-black text-slate-900 leading-tight">Device Protocol</p>
                      <p className="text-sm text-slate-500 italic">Trusted device management</p>
                    </div>
                  </div>
                  <button className="bg-white text-emerald-600 px-6 py-3 rounded-xl font-bold text-sm shadow-sm group-hover:bg-emerald-600 group-hover:text-white transition-all">
                    Audit
                  </button>
                </div>

                <div className="group flex items-center justify-between p-6 bg-slate-50 rounded-[2rem] hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all border border-transparent hover:border-slate-100">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-violet-50 text-violet-600 rounded-2xl flex items-center justify-center">
                      <Keyboard size={24} />
                    </div>
                    <div>
                      <p className="text-lg font-black text-slate-900 leading-tight">Workflow Logic</p>
                      <p className="text-sm text-slate-500 italic">Configure keyboard shortcuts</p>
                    </div>
                  </div>
                  <button className="bg-white text-violet-600 px-6 py-3 rounded-xl font-bold text-sm shadow-sm group-hover:bg-violet-600 group-hover:text-white transition-all">
                    Setup
                  </button>
                </div>
              </div>

              <div className="mt-12 bg-slate-900 rounded-[2.5rem] p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 opacity-20 blur-[60px]"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div>
                    <h4 className="text-white font-black text-xl mb-1">Advanced Architecture</h4>
                    <p className="text-slate-400 text-sm">Need deep system customization or API access?</p>
                  </div>
                  <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-2xl font-black text-sm transition-all whitespace-nowrap">
                    Contact Engineering
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}