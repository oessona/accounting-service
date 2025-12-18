"use client";

import React, { useState, FormEvent, JSX, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, Layout, ArrowRight, ShieldCheck } from "lucide-react";

export default function LoginPage(): JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  useEffect(() => {
    // If already logged in, redirect to dashboard
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (token) {
      router.push('/dashboard');
    }
  }, [router]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!emailRegex.test(email)) {
      setError("Invalid email format");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || 'http://localhost:8090';
      const response = await fetch(`${API_BASE}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Login failed' }));
        setError(errorData.message || 'Invalid credentials');
        setLoading(false);
        return;
      }

      const data = await response.json();
      const token = data.token;

      if (!token) {
        setError('No token received from server');
        setLoading(false);
        return;
      }

      localStorage.setItem('auth_token', token);
      document.cookie = `auth_token=${token}; path=/; max-age=604800; SameSite=Lax`;

      const redirectTo = searchParams.get('redirect') || '/dashboard';
      window.location.href = redirectTo;
    } catch (err: any) {
      setError(err?.message || "Login failed");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-[100px]" />

      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-500">
        <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-white shadow-2xl shadow-indigo-100/50 p-8 sm:p-10">

          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 mx-auto mb-6 transform -rotate-6">
              <Layout className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 leading-tight">Welcome Back</h1>
            <p className="text-slate-400 font-medium mt-2">Enter your credentials to access the vault</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                <input
                  id="email"
                  name="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full h-14 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none font-bold text-slate-700 transition-all placeholder:text-slate-300"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-14 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none font-bold text-slate-700 transition-all placeholder:text-slate-300"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-3 p-4 bg-rose-50 text-rose-600 rounded-2xl text-sm font-bold animate-in slide-in-from-top-2">
                <ShieldCheck size={18} />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-lg shadow-indigo-100 transition-all active:scale-95 flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Authenticate</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-400 text-sm font-medium">
              New to the platform?{" "}
              <Link href="/signup" className="text-indigo-600 hover:text-indigo-700 font-bold hover:underline">
                Create Account
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-slate-300 text-[10px] font-black uppercase tracking-[0.2em] mt-8">
          Secure Financial Infrastructure
        </p>
      </div>
    </div>
  );
}