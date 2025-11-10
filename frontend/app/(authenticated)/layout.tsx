'use client';

import React from 'react';
import Navigation from '../components/Navigation';
import { useRouter } from 'next/navigation';

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            {/* Logo and System Name */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-teal-600 rounded flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Accounting System</h1>
                <p className="text-sm text-gray-500">Management Portal</p>
              </div>
            </div>

            {/* Right side items */}
            <div className="flex items-center space-x-6">
              <div className="text-sm text-gray-500">
                Today's Date<br />
                <span className="font-medium text-gray-900">{formatDate(new Date())}</span>
              </div>
              <button
                onClick={() => {
                  localStorage.removeItem('auth_token');
                  router.push('/login');
                }}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="mt-6">
            <Navigation />
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}