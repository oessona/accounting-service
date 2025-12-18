"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Settings,
  LogOut,
  ChevronDown,
  Shield,
  CreditCard
} from "lucide-react";
import apiFetch from "../../utils/api";

export default function AccountMenu() {
  const [open, setOpen] = useState(false);
  const [userData, setUserData] = useState<{ name: string; role: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      try {
        const data = await apiFetch('/api/user', { method: 'GET' });
        if (data) setUserData(data);
      } catch (e) {
        console.error(e);
      }
    }
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await apiFetch('/api/logout', { method: 'POST', silent: true });
    } catch (e) {
      console.error('Logout error:', e);
    } finally {
      localStorage.removeItem('auth_token');
      document.cookie = 'auth_token=; path=/; max-age=0';
      window.location.href = '/login';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 bg-slate-50 hover:bg-slate-100 px-4 py-2 rounded-2xl transition-all border border-slate-100 group"
      >
        <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100 group-hover:scale-110 transition-transform">
          <User size={18} />
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-xs font-black text-slate-900 leading-none mb-1">{userData?.name || 'Account'}</p>
          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-tighter">{userData?.role || 'Guest'}</p>
        </div>
        <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          ></div>
          <div className="absolute right-0 mt-3 w-64 bg-white/90 backdrop-blur-xl shadow-2xl shadow-indigo-100/50 rounded-[2rem] border border-white p-4 z-50 animate-in fade-in zoom-in-95 duration-200">
            <div className="px-4 py-4 border-b border-slate-50 mb-3">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Identity Protocol</p>
              <p className="font-black text-slate-900 leading-none">{userData?.name || 'Authorized User'}</p>
              <div className="mt-3 flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter ${userData?.role === 'admin' ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600'}`}>
                  {userData?.role || 'Verified'}
                </span>
              </div>
            </div>

            <nav className="space-y-1">
              <button
                onClick={() => {
                  setOpen(false);
                  router.push('/userpage');
                }}
                className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-2xl hover:bg-slate-50 text-slate-600 hover:text-indigo-600 transition-all group"
              >
                <div className="w-8 h-8 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:shadow-sm group-hover:text-indigo-600 transition-all">
                  <Settings size={16} />
                </div>
                <span className="text-sm font-bold">Preferences</span>
              </button>

              {userData?.role === 'admin' && (
                <button
                  onClick={() => {
                    setOpen(false);
                    router.push('/adminpage');
                  }}
                  className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-2xl hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 transition-all group"
                >
                  <div className="w-8 h-8 bg-indigo-50/50 rounded-xl flex items-center justify-center text-indigo-500 group-hover:bg-white group-hover:shadow-sm transition-all">
                    <Shield size={16} />
                  </div>
                  <span className="text-sm font-bold">Admin Console</span>
                </button>
              )}

              <div className="h-px bg-slate-50 my-2 mx-4" />

              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-2xl hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-all group"
              >
                <div className="w-8 h-8 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300 group-hover:bg-white group-hover:shadow-sm group-hover:text-rose-600 transition-all">
                  <LogOut size={16} />
                </div>
                <span className="text-sm font-bold">Terminate Session</span>
              </button>
            </nav>
          </div>
        </>
      )}
    </div>
  );
}
