"use client";

import React, { useState, FormEvent, JSX } from "react";
import Link from "next/link";

export default function LoginPage(): JSX.Element {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Email validation regex
    
    if (!emailRegex.test(email)) {
      setError("Invalid email format");
      setLoading(false);
      return;
    }

    // Simple password validation (example: must be at least 6 characters)
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      await new Promise((r) => setTimeout(r, 700));
      console.log("submit", { email, password });
    } catch (err) {
      setError("Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-sm bg-white rounded-xl border border-gray-200 shadow-md p-6">
        <h1 className="text-center text-2xl font-semibold mb-6 text-black">Login</h1>

        <form onSubmit={handleSubmit} className="space-y-4 text-gray-600">
          <div>
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <input
              id="email"
              name="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email..."
              className={`w-full border ${error && email && !emailRegex.test(email) ? 'border-red-600' : 'border-gray-300'} rounded-md px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 `}
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
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password..."
              className={`w-full border ${error && password.length < 6 ? 'border-red-600' : 'border-gray-300'} rounded-md px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 `}
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-medium py-2 rounded-md transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Don't have an account?{" "}
          <Link href="/signup" className="text-green-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}