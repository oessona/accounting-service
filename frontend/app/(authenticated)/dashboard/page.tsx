'use client';

import { useState, useEffect } from 'react';
import apiFetch from '../../../utils/api';
import {
  AreaChart, Area,
  ResponsiveContainer,
  XAxis, YAxis,
  Tooltip,
  CartesianGrid,
  Cell
} from 'recharts';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Activity,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  LayoutDashboard
} from 'lucide-react';

interface MonthlyDataPoint {
  month: string;
  income: number;
  expense: number;
}

interface MonthlyData {
  income: number[];
  expense: number[];
  months: string[];
  chartData: MonthlyDataPoint[];
}

interface DashboardData {
  userName: string;
  TotalValue: number;
  IncomeValue: number;
  ExpenseValue: number;
  todaysActivity: number;
  growthInPercen: string;
  monthlyData: MonthlyData;
}

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  useEffect(() => {
    async function fetchDashboardData() {
      setIsLoading(true);
      try {
        const data = await apiFetch('/api/dashboard', { method: 'GET' });
        if (data) {
          setDashboardData(data);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[80vh] bg-white/50 backdrop-blur-sm rounded-3xl m-6">
        <div className="relative w-24 h-24 mb-4">
          <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p className="text-indigo-900 font-medium animate-pulse text-lg">Preparing your financial overview...</p>
      </div>
    );
  }

  if (!dashboardData) return null;

  const isGrowthPositive = dashboardData.growthInPercen.startsWith('+');

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-10 text-slate-900">
      <div className="max-w-7xl mx-auto">

        {/* Header section */}
        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm uppercase tracking-widest mb-1">
              <LayoutDashboard size={16} />
              <span>Real-time Analytics</span>
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">{dashboardData.userName}</span>
            </h1>
            <p className="text-slate-500 mt-2 text-lg">Your financial health is looking <span className="font-semibold text-indigo-600">strong</span> today.</p>
          </div>

          <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
            <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600">
              <Calendar size={20} />
            </div>
            <div className="pr-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Current Period</p>
              <p className="font-bold text-slate-700">{new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
            </div>
          </div>
        </header>

        {/* Top Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

          {/* Total Balance Card */}
          <div className="group bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110 duration-500"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-200">
                <Wallet size={24} />
              </div>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-1">Net Worth</p>
              <h3 className="text-3xl font-black text-slate-900 mb-2">{formatCurrency(dashboardData.TotalValue)}</h3>
              <div className={`flex items-center gap-1 text-sm font-bold ${isGrowthPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                {isGrowthPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                <span>{dashboardData.growthInPercen}</span>
                <span className="text-slate-400 font-medium ml-1">this month</span>
              </div>
            </div>
          </div>

          {/* Income Card */}
          <div className="group bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
              <TrendingUp size={24} />
            </div>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-1">Total Savings</p>
            <h3 className="text-3xl font-black text-slate-900 mb-2">{formatCurrency(dashboardData.IncomeValue)}</h3>
            <p className="text-emerald-600/70 text-sm font-bold bg-emerald-50 px-3 py-1 rounded-full w-fit">Incoming flow</p>
          </div>

          {/* Expense Card */}
          <div className="group bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mb-6">
              <TrendingDown size={24} />
            </div>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-1">Expenditures</p>
            <h3 className="text-3xl font-black text-slate-900 mb-2">{formatCurrency(dashboardData.ExpenseValue)}</h3>
            <p className="text-rose-600/70 text-sm font-bold bg-rose-50 px-3 py-1 rounded-full w-fit">Outbound funds</p>
          </div>

          {/* Activity Card */}
          <div className="group bg-indigo-600 rounded-[2.5rem] p-8 shadow-lg shadow-indigo-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative overflow-hidden">
            <div className="absolute bottom-0 left-0 w-full h-1/2 opacity-20 pointer-events-none">
              <svg viewBox="0 0 400 200" className="w-full h-full">
                <path d="M0,150 Q100,50 200,150 T400,100" fill="none" stroke="white" strokeWidth="4" />
              </svg>
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/20 text-white backdrop-blur-md rounded-2xl flex items-center justify-center mb-6">
                <Activity size={24} />
              </div>
              <p className="text-indigo-100 font-bold text-xs uppercase tracking-widest mb-1">Today's Pulse</p>
              <h3 className="text-4xl font-black text-white mb-2">{dashboardData.todaysActivity}</h3>
              <p className="text-indigo-100/70 text-sm font-medium">Ops recorded today</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">

          {/* Main Chart Section */}
          <div className="lg:col-span-2 bg-white rounded-[3rem] p-8 lg:p-10 shadow-sm border border-slate-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
              <div>
                <h3 className="text-2xl font-black text-slate-900 leading-none mb-2">Cash Flow Trends</h3>
                <p className="text-slate-500 font-medium italic">Performance overview for the last 6 months</p>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-indigo-600"></span>
                  <span className="text-sm font-bold text-slate-600">Income</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                  <span className="text-sm font-bold text-slate-600">Expense</span>
                </div>
              </div>
            </div>

            <div className="h-[420px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={dashboardData.monthlyData.chartData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#F43F5E" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#94A3B8', fontSize: 13, fontWeight: 600 }}
                    dy={15}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 600 }}
                    tickFormatter={(val) => `$${val >= 1000 ? (val / 1000).toFixed(0) + 'k' : val}`}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '24px',
                      border: 'none',
                      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
                      padding: '16px 24px'
                    }}
                    cursor={{ stroke: '#4F46E5', strokeWidth: 2, strokeDasharray: '5 5' }}
                    formatter={(value: number) => [<span className="font-bold text-slate-900">{formatCurrency(value)}</span>]}
                  />
                  <Area
                    type="monotone"
                    dataKey="income"
                    stroke="#4F46E5"
                    strokeWidth={4}
                    fillOpacity={1}
                    fill="url(#colorIncome)"
                    name="Income"
                    animationDuration={1500}
                  />
                  <Area
                    type="monotone"
                    dataKey="expense"
                    stroke="#F43F5E"
                    strokeWidth={4}
                    fillOpacity={1}
                    fill="url(#colorExpense)"
                    name="Expense"
                    animationDuration={2000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Breakdown / Side Card */}
          <div className="bg-white rounded-[3rem] p-8 shadow-sm border border-slate-100 flex flex-col h-full">
            <h3 className="text-2xl font-black text-slate-900 mb-6">Quick Stats</h3>

            <div className="space-y-6 flex-1">
              <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 transition-all hover:bg-white hover:shadow-lg hover:border-transparent group">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Net Profit Average</p>
                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-2xl font-black text-slate-900">
                      {formatCurrency(dashboardData.TotalValue / 6)}
                    </span>
                    <span className="text-slate-400 text-sm ml-1">/mo</span>
                  </div>
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-indigo-600 shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <TrendingUp size={18} />
                  </div>
                </div>
              </div>

              <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 transition-all hover:bg-white hover:shadow-lg hover:border-transparent group">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Top Spending Month</p>
                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-2xl font-black text-slate-900">
                      {dashboardData.monthlyData.months[dashboardData.monthlyData.expense.indexOf(Math.max(...dashboardData.monthlyData.expense))]}
                    </span>
                    <p className="text-rose-500 font-bold text-sm mt-1">
                      {formatCurrency(Math.max(...dashboardData.monthlyData.expense))}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-rose-600 shadow-sm group-hover:bg-rose-600 group-hover:text-white transition-colors">
                    <TrendingDown size={18} />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2rem] p-6 text-white text-center shadow-lg shadow-indigo-200">
              <p className="font-bold text-sm mb-2 text-indigo-100 opacity-80">PRO TIP</p>
              <p className="text-sm font-medium leading-relaxed">
                Try setting a limit on categories where your spending exceeded <span className="font-black text-white">$500</span> last month.
              </p>
            </div>
          </div>
        </div>

        {/* Historical Breakdown Table */}
        <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-8 lg:p-10 border-b border-slate-50 flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-black text-slate-900">Financial History</h3>
              <p className="text-slate-500 font-medium">Detailed monthly tracking</p>
            </div>
            <button className="bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 px-6 py-3 rounded-2xl font-bold text-sm transition-all border border-slate-100">
              Download CSV
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/50 text-left">
                  <th className="px-10 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Month</th>
                  <th className="px-10 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Revenue</th>
                  <th className="px-10 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Spending</th>
                  <th className="px-10 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Net Cash Flow</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {[...dashboardData.monthlyData.months].map((month, index) => {
                  const income = dashboardData.monthlyData.income[index];
                  const expense = dashboardData.monthlyData.expense[index];
                  const net = income - expense;
                  return (
                    <tr key={month} className="hover:bg-slate-50/30 transition-colors group">
                      <td className="px-10 py-6">
                        <span className="text-lg font-black text-slate-700 group-hover:text-indigo-600 transition-colors">{month}</span>
                      </td>
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                          <span className="text-lg font-bold text-emerald-600">{formatCurrency(income)}</span>
                        </div>
                      </td>
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div>
                          <span className="text-lg font-bold text-rose-600">{formatCurrency(expense)}</span>
                        </div>
                      </td>
                      <td className="px-10 py-6 text-right">
                        <span className={`text-lg font-black px-4 py-2 rounded-2xl ${net >= 0 ? 'bg-indigo-50 text-indigo-600' : 'bg-rose-50 text-rose-600'}`}>
                          {net >= 0 ? '+' : ''}{formatCurrency(net)}
                        </span>
                      </td>
                    </tr>
                  );
                }).reverse()}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}