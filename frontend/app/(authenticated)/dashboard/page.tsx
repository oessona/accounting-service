'use client';

import { useState, useEffect } from 'react';
import {
  AreaChart, Area,
  ResponsiveContainer,
  XAxis, YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

interface MonthlyData {
  income: number[];
  expense: number[];
  months: string[];
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
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    userName: '',
    TotalValue: 0,
    IncomeValue: 0,
    ExpenseValue: 0,
    todaysActivity: 0,
    growthInPercen: '',
    monthlyData: {
      income: [],
      expense: [],
      months: []
    }
  });

  useEffect(() => {
    async function fetchDashboardData() {
      setIsLoading(true);
      try {
        const [userRes, summaryRes, todayRes] = await Promise.all([
          import('../../../utils/api').then(m => m.default('/api/user', { method: 'GET' }).catch(() => ({ name: 'User' }))),
          import('../../../utils/api').then(m => m.default('/api/reports/summary', { method: 'GET' }).catch(() => ({ total: { income: 0, expense: 0, balance: 0 } }))),
          import('../../../utils/api').then(m => m.default('/api/transactions/stats/today', { method: 'GET' }).catch(() => ({ income: 0, expense: 0 }))),
        ]);

        const income = summaryRes?.total?.income || 0;
        const expense = summaryRes?.total?.expense || 0;
        const balance = summaryRes?.total?.balance || (income - expense);
        
        setDashboardData({
          userName: userRes?.name || 'User',
          TotalValue: balance,
          IncomeValue: income,
          ExpenseValue: expense,
          todaysActivity: (todayRes?.income || 0) + (todayRes?.expense || 0),
          growthInPercen: "+0%",
          monthlyData: {
            income: [income / 4, income / 4, income / 4, income / 4],
            expense: [expense / 4, expense / 4, expense / 4, expense / 4],
            months: ['Sep', 'Oct', 'Nov', 'Dec']
          },
        });
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
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-gray-600">Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard Overview</h1>
          <p className="text-sm text-gray-600 mt-1">Key metrics</p>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">


          {/* Total Value */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col">
              <p className="text-sm text-gray-600 mb-1">Total Value</p>
              <div>
                <h2 className="text-3xl font-semibold text-gray-900">
                  {formatCurrency(dashboardData.TotalValue)}
                </h2>
                <p className="text-sm text-green-600 mt-1">+12% from last month</p>
              </div>
            </div>
          </div>

          {/* Income Value */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col">
              <p className="text-sm text-gray-600 mb-1">Income</p>
              <div>
                <h2 className="text-3xl font-semibold text-gray-900">
                  {formatCurrency(dashboardData.IncomeValue)}
                </h2>
                <p className="text-sm text-green-600 mt-1">+6% from last month</p>
              </div>
            </div>
          </div>

          {/* expense Value */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col">
              <p className="text-sm text-gray-600 mb-1">expense</p>
              <div>
                <h2 className="text-3xl font-semibold text-gray-900">
                  {formatCurrency(dashboardData.ExpenseValue)}
                </h2>
                <p className="text-sm text-red-600 mt-1">-12% from last month</p>
              </div>
            </div>
          </div>

          {/* Transactions */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col">
              <p className="text-sm text-gray-800 mb-1">Transactions processed</p>
              <h2 className="text-3xl font-semibold text-gray-600">{4}</h2>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1">
          {/* Monthly Activity Chart */}
          <div className="bg-white rounded-lg shadow-sm p-6 w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Monthly Activity</h3>
            <p className="text-sm text-gray-600 mb-4">Income vs expense trends</p>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={[
                    { month: 'Sep', income: 4500, expense: 3800 },
                    { month: 'Oct', income: 5100, expense: 4200 },
                    { month: 'Nov', income: 4600, expense: 4500 },
                    { month: 'Dec', income: 5900, expense: 5100 }
                  ]}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorexpense" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="month" 
                    stroke="#6B7280"
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                  />
                  <YAxis 
                    stroke="#6B7280"
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                    domain={[0, 800]}
                    ticks={[0, 200, 400, 600, 800]}
                  />
                  <Tooltip labelStyle={{ color: '#8B5CF6', fontWeight: 700 }} />
                  <Area
                    type="monotone"
                    dataKey="income"
                    stroke="#4F46E5"
                    strokeWidth={2}
                    fill="url(#colorIncome)"
                    dot={{ stroke: '#4F46E5', strokeWidth: 2, fill: '#fff', r: 4 }}
                    name="Income"
                  />
                  <Area
                    type="monotone"
                    dataKey="expense"
                    stroke="#10B981"
                    strokeWidth={2}
                    fill="url(#colorexpense)"
                    dot={{ stroke: '#10B981', strokeWidth: 2, fill: '#fff', r: 4 }}
                    name="expense"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Income & Expense Table */}
        <div className="bg-white rounded-lg shadow-sm p-8 mt-20 w-full">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Income & Expense Summary</h3>
          <p className="text-sm text-gray-600 mb-4">Monthly breakdown</p>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Income</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Expense</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Net</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dashboardData.monthlyData.months.map((month, index) => {
                  const income = dashboardData.monthlyData.income[index];
                  const expense = dashboardData.monthlyData.expense[index];
                  const net = income - expense;
                  return (
                    <tr key={month} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{month}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">{income}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">{expense}</td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${net >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                        {net >= 0 ? '+' : ''}{net}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}