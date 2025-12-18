'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  CreditCard,
  History,
  LayoutDashboard
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Accounts', path: '/accounts', icon: CreditCard },
  { name: 'Transactions', path: '/transactions', icon: History },
  { name: 'Reports', path: '/reports', icon: BarChart3 },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      {navItems.map((item) => {
        const isActive = pathname === item.path;
        const Icon = item.icon;

        return (
          <Link
            key={item.path}
            href={item.path}
            className={`flex items-center px-4 py-2.5 rounded-xl transition-all duration-300 group ${isActive
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
              : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600'
              }`}
          >
            <Icon className={`w-4 h-4 mr-2.5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
            <span className="text-sm font-bold tracking-tight">
              {item.name}
            </span>
            {isActive && (
              <span className="ml-1.5 w-1 h-1 bg-white rounded-full animate-pulse"></span>
            )}
          </Link>
        );
      })}
    </div>
  );
}