'use client';

import React, { useEffect, useState } from 'react';
import Navigation from '../components/Navigation';
import AccountMenu from '../components/acc_menu';
import { useRouter, usePathname } from 'next/navigation';
import { Calendar, Layout } from 'lucide-react';

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [currentDate, setCurrentDate] = useState<Date | null>(null);

  useEffect(() => {
    setCurrentDate(new Date());

    // Check authentication on mount and route changes
    const token = localStorage.getItem('auth_token');
    if (!token) {
      router.push('/login?redirect=' + encodeURIComponent(pathname));
    }
  }, [router, pathname]);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-4">
          <div className="flex justify-between items-center">
            {/* Logo and System Name */}
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                <Layout className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-black text-slate-900 leading-none">Accounting Service</h1>
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mt-1">Financial OS</p>
              </div>
            </div>

            {/* Navigation (Integrated in Header) */}
            <div className="hidden md:block">
              <Navigation />
            </div>

            {/* Right side items */}
            <div className="flex items-center space-x-6">
              <div className="hidden lg:flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                <Calendar className="w-4 h-4 text-indigo-600" />
                <span className="text-sm font-bold text-slate-600 italic">
                  {currentDate ? formatDate(currentDate) : <span className="opacity-0">Loading...</span>}
                </span>
              </div>
              <AccountMenu />
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden mt-4 overflow-x-auto pb-2">
            <Navigation />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-0 lg:px-4 py-0 lg:py-4">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          {children}
        </div>
      </main>

      {/* Footer Decoration */}
      <footer className="py-10 text-center text-slate-300 text-xs font-medium uppercase tracking-[0.2em]">
        &copy; 2025 Accounting Service &bull; Secure Financial Infrastructure
      </footer>
    </div>
  );
}