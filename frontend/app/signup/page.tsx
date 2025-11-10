"use client";

import React, { JSX, useState } from "react";
import Link from "next/link";

type FormState = {
  email: string;
  password: string;
  confirm: string;
};

export default function SignUpPage(): JSX.Element {
  const [form, setForm] = useState<FormState>({
    email: "",
    password: "",
    confirm: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const validate = (): string | null => {
    if (!emailRegex.test(form.email)) return "Invalid email format";
    if (form.password.length < 6) return "Password must be at least 6 characters";
    if (form.password !== form.confirm) return "Passwords do not match";
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
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || "Failed to register");
      }

      setSuccess("Account created. Check your email to verify (if applicable).");
      setForm({ email: "", password: "", confirm: "" });
    } catch (err: any) {
      setError(err?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="w-full min-h-screen bg-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-full max-w-md bg-white rounded-xl border border-gray-200 shadow-md p-6 sm:p-8">
          <h1 className="text-center text-2xl sm:text-3xl font-semibold mb-6 text-gray-900">Sign Up</h1>

          <form onSubmit={onSubmit} className="space-y-4 text-gray-600">
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                name="email"
                autoComplete="email"
                value={form.email}
                onChange={onChange}
                placeholder="Enter your email..."
                className={`w-full border ${error && form.email && !emailRegex.test(form.email) ? 'border-red-600' : 'border-gray-300'} rounded-md px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                value={form.password}
                onChange={onChange}
                placeholder="Create a password..."
                className={`w-full border ${error && form.password.length < 6 ? 'border-red-600' : 'border-gray-300'} rounded-md px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2`}
                required
              />
            </div>

            <div>
              <label htmlFor="confirm" className="sr-only">
                Confirm Password
              </label>
              <input
                id="confirm"
                name="confirm"
                type="password"
                autoComplete="new-password"
                value={form.confirm}
                onChange={onChange}
                placeholder="Confirm your password"
                className={`w-full border ${error && form.password !== form.confirm ? 'border-red-600' : 'border-gray-300'} rounded-md px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                required
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 p-2 rounded-md">
                {error}
              </p>
            )}
            {success && (
              <p className="text-sm text-green-600 bg-green-50 p-2 rounded-md">
                {success}
              </p>
            )}

            <button
              type="submit"
              className={`w-full mt-2 inline-flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 rounded-md shadow-sm transition-colors ${
                loading ? "opacity-70 cursor-wait" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Signing up..." : "Sign up"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-emerald-600 hover:text-emerald-700 hover:underline font-medium">
              Login
            </Link>
          </p>
      </div>
    </main>
  );
}