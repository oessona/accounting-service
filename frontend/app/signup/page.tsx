"use client";

import React, { JSX, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, CheckCircle, ArrowRight, Layout, ShieldCheck } from "lucide-react";
import apiFetch from '../../utils/api';

type FormState = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
};

export default function SignUpPage(): JSX.Element {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  useEffect(() => {
    // If already logged in, redirect to dashboard
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (token) {
      router.push('/dashboard');
    }
  }, [router]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const validate = (): string | null => {
    if (form.name.length < 3) return "Name must be at least 3 characters";
    if (!emailRegex.test(form.email)) return "Invalid email format";
    if (form.password.length < 6) return "Password must be at least 6 characters";
    if (form.password !== form.password_confirmation) return "Passwords do not match";
    return null;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const result = await apiFetch('/api/register', {
        method: 'POST',
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          password_confirmation: form.password_confirmation
        }),
      });

      // Store token and redirect to dashboard
      if (result?.token) {
        localStorage.setItem('auth_token', result.token);
        document.cookie = `auth_token=${result.token}; path=/; max-age=604800; SameSite=Lax`;
        window.location.href = '/dashboard';
      } else {
        setSuccess("Account created successfully.");
        setForm({ name: "", email: "", password: "", password_confirmation: "" });
        // Optional: Redirect to login or auto-login logic here if token wasn't returned
        setTimeout(() => router.push('/login'), 2000);
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-[100px]" />

      <div className="w-full max-w-lg relative z-10 animate-in fade-in zoom-in-95 duration-500">
        <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-white shadow-2xl shadow-indigo-100/50 p-8 sm:p-10">

          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200 mx-auto mb-6 transform rotate-6">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 leading-tight">Join the Network</h1>
            <p className="text-slate-400 font-medium mt-2">Initialize your secure financial identity</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="name" className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                Full Name
              </label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={20} />
                <input
                  id="name"
                  name="name"
                  autoComplete="name"
                  value={form.name}
                  onChange={onChange}
                  placeholder="John Doe"
                  className="w-full h-14 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none font-bold text-slate-700 transition-all placeholder:text-slate-300"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                Email Endpoint
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={20} />
                <input
                  id="email"
                  name="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={onChange}
                  placeholder="name@company.com"
                  className="w-full h-14 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none font-bold text-slate-700 transition-all placeholder:text-slate-300"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="password" className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                  Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={20} />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    value={form.password}
                    onChange={onChange}
                    placeholder="••••••••"
                    className="w-full h-14 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none font-bold text-slate-700 transition-all placeholder:text-slate-300"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password_confirmation" className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                  Confirm
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={20} />
                  <input
                    id="password_confirmation"
                    name="password_confirmation"
                    type="password"
                    autoComplete="new-password"
                    value={form.password_confirmation}
                    onChange={onChange}
                    placeholder="••••••••"
                    className="w-full h-14 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none font-bold text-slate-700 transition-all placeholder:text-slate-300"
                    required
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-3 p-4 bg-rose-50 text-rose-600 rounded-2xl text-sm font-bold animate-in slide-in-from-top-2 border border-rose-100">
                <ShieldCheck size={18} />
                {error}
              </div>
            )}

            {success && (
              <div className="flex items-center gap-3 p-4 bg-emerald-50 text-emerald-600 rounded-2xl text-sm font-bold animate-in slide-in-from-top-2 border border-emerald-100">
                <CheckCircle size={18} />
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl shadow-lg shadow-emerald-100 transition-all active:scale-95 flex items-center justify-center gap-2 group mt-4"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Create Credentials</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-400 text-sm font-medium">
              Already authorized?{" "}
              <Link href="/login" className="text-emerald-600 hover:text-emerald-700 font-bold hover:underline">
                Access Vault
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}