'use client';

import React, { useState } from 'react';
import {
  PieChart, Pie, Cell,
  ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis,
  CartesianGrid
} from 'recharts';
import {
  BarChart3,
  Target,
  PieChart as PieChartIcon,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Filter
} from 'lucide-react';

interface CategoryData {
  name: string;
  value: number;
  [key: string]: string | number; // Index signature for Recharts
}

interface AccountReport {
  id: number;
  name: string;
  income: number;
  expense: number;
  categories: {
    income: Record<string, number>;
    expense: Record<string, number>;
  };
}

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState('profitLoss');
  const [selectedAccountId, setSelectedAccountId] = useState<string>('all');
  const [loading, setLoading] = useState(false);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [incomeData, setIncomeData] = useState<CategoryData[]>([]);
  const [expenceData, setExpenceData] = useState<CategoryData[]>([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [transactionCount, setTransactionCount] = useState(0);
  const [accountsReport, setAccountsReport] = useState<AccountReport[]>([]);

  const [rawSummary, setRawSummary] = useState<any>(null);

  React.useEffect(() => {
    async function fetchReports() {
      setLoading(true);
      try {
        const apiFetch = (await import('../../../utils/api')).default;
        const summary = await apiFetch('/api/reports/summary', { method: 'GET' });
        const transactions = await apiFetch('/api/reports/transactions', { method: 'GET' });

        setRawSummary(summary);
        setAccountsReport(summary?.accounts || []);
        processReportData(summary, 'all');

        setTransactionCount(transactions?.data?.length || 0);
      } catch (error) {
        console.error('Failed to fetch reports:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchReports();
  }, []);

  const processReportData = (summary: any, accountId: string) => {
    let income = 0;
    let expense = 0;
    let incomeCats: CategoryData[] = [];
    let expenseCats: CategoryData[] = [];

    if (accountId === 'all') {
      income = summary?.total?.income || 0;
      expense = summary?.total?.expense || 0;
      incomeCats = Object.entries(summary?.categories?.income || {}).map(([name, value]) => ({ name, value: Number(value) }));
      expenseCats = Object.entries(summary?.categories?.expense || {}).map(([name, value]) => ({ name, value: Number(value) }));
    } else {
      const account = summary?.accounts?.find((a: any) => String(a.id) === accountId);
      if (account) {
        income = account.income || 0;
        expense = account.expense || 0;
        incomeCats = Object.entries(account.categories?.income || {}).map(([name, value]) => ({ name, value: Number(value) }));
        expenseCats = Object.entries(account.categories?.expense || {}).map(([name, value]) => ({ name, value: Number(value) }));
      }
    }

    setTotalIncome(income);
    setTotalExpense(expense);
    setCategoryData([
      { name: 'Expense', value: expense },
      { name: 'Income', value: income }
    ]);
    setIncomeData(incomeCats.length > 0 ? incomeCats : [{ name: 'No data', value: 0 }]);
    setExpenceData(expenseCats.length > 0 ? expenseCats : [{ name: 'No data', value: 0 }]);
  };

  const handleAccountChange = (id: string) => {
    setSelectedAccountId(id);
    if (rawSummary) {
      processReportData(rawSummary, id);
    }
  };

  const combinedNames = Array.from(new Set([...incomeData, ...expenceData].map((d) => d.name).filter(n => n !== 'No data')));
  const combinedData = combinedNames
    .map((name) => {
      const income = incomeData.find((d) => d.name === name)?.value || 0;
      const expense = expenceData.find((d) => d.name === name)?.value || 0;
      return { name, income, expense, total: income + expense };
    })
    .sort((a, b) => b.total - a.total);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-10">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm uppercase tracking-widest mb-1">
              <BarChart3 size={16} />
              <span>Performance Insights</span>
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Reports & Analytics</h1>
            <p className="text-slate-500 mt-2 text-lg">Visualizing your financial impact and status.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 p-2 bg-white rounded-3xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100">
              <Filter size={16} className="text-indigo-600" />
              <select
                value={selectedReport}
                onChange={(e) => setSelectedReport(e.target.value)}
                className="bg-transparent border-none outline-none font-bold text-slate-700 text-sm cursor-pointer"
              >
                <option value="profitLoss">Profit & Loss</option>
                <option value="categories">Summary View</option>
              </select>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100">
              <Target size={16} className="text-indigo-600" />
              <select
                value={selectedAccountId}
                onChange={(e) => handleAccountChange(e.target.value)}
                className="bg-transparent border-none outline-none font-bold text-slate-700 text-sm cursor-pointer"
              >
                <option value="all">Total Ledger</option>
                {accountsReport.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </header>

        {loading ? (
          <div className="flex flex-col justify-center items-center h-[60vh]">
            <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-slate-400 font-black uppercase tracking-widest text-xs animate-pulse">Analyzing...</p>
          </div>
        ) : (
          <div className="animate-in fade-in duration-700">
            {selectedReport === 'profitLoss' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <div className="bg-white rounded-[2.5rem] p-8 lg:p-10 shadow-sm border border-slate-100">
                  <div className="mb-8">
                    <h3 className="text-2xl font-black text-slate-900 leading-none mb-1">Magnitude Distribution</h3>
                    <p className="text-slate-400 font-medium">Income to Expense ratio visualization</p>
                  </div>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData.filter(d => d.value > 0)}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          innerRadius={75}
                          paddingAngle={8}
                          stroke="none"
                        >
                          {categoryData.map((_, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={["#F43F5E", "#10B981", "#F59E0B", "#6366F1"][index % 4]}
                              className="hover:opacity-80 transition-opacity cursor-pointer outline-none"
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                          formatter={(value: number) => [<span className="font-bold">{formatCurrency(value)}</span>]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-center gap-6 mt-4">
                    {categoryData.map((d, i) => d.value > 0 && (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ background: ["#F43F5E", "#10B981"][i % 2] }}></div>
                        <span className="text-xs font-black text-slate-500 uppercase tracking-widest">{d.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-[2.5rem] p-8 lg:p-10 shadow-sm border border-slate-100 h-full">
                  <div className="mb-8">
                    <h3 className="text-2xl font-black text-slate-900 leading-none mb-1">Stream Breakdown</h3>
                    <p className="text-slate-400 font-medium">Segmented categories in current view</p>
                  </div>
                  <div className="overflow-auto h-[16rem] pr-2 custom-scrollbar">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50">
                          <th className="pb-4 px-2">Category</th>
                          <th className="pb-4 px-2">Magnitude</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {[...incomeData.filter(d => d.name !== 'No data').map(c => ({ ...c, type: 'Income' })),
                        ...expenceData.filter(d => d.name !== 'No data').map(c => ({ ...c, type: 'Expense' }))].map((cat) => (
                          <tr key={`${cat.type}-${cat.name}`} className="group hover:bg-slate-50/50 transition-colors">
                            <td className="py-4 px-2">
                              <div className="flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full ${cat.type === 'Income' ? 'bg-emerald-500 shadow-lg shadow-emerald-200' : 'bg-rose-500 shadow-lg shadow-rose-200'}`}></div>
                                <span className="text-sm font-black text-slate-700">{cat.name}</span>
                              </div>
                            </td>
                            <td className="py-4 px-2 text-right">
                              <span className={`text-sm font-bold ${cat.type === 'Income' ? 'text-emerald-600' : 'text-slate-900'}`}>
                                {formatCurrency(cat.value)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-white rounded-[3rem] p-8 lg:p-10 shadow-sm border border-slate-100 col-span-1 md:col-span-2">
                  <div className="mb-10">
                    <h3 className="text-2xl font-black text-slate-900 leading-none mb-1">Relative Magnitude</h3>
                    <p className="text-slate-400 font-medium">Head-to-head category comparison</p>
                  </div>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart layout="vertical" data={combinedData} margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={false} stroke="#F1F5F9" />
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" width={120} tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 700 }} axisLine={false} tickLine={false} />
                        <Tooltip
                          cursor={{ fill: '#F8FAFC' }}
                          contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                          formatter={(value: number) => [<span className="font-bold">{formatCurrency(value)}</span>]}
                        />
                        <Bar dataKey="expense" fill="#F43F5E" radius={[0, 6, 6, 0]} barSize={14} name="Expense" />
                        <Bar dataKey="income" fill="#10B981" radius={[0, 6, 6, 0]} barSize={14} name="Income" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {selectedReport === 'categories' && (
              <div className="space-y-8 animate-in slide-in-from-bottom-5 duration-700">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 flex items-center gap-6 group hover:translate-y-[-4px] transition-all">
                    <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-[1.5rem] flex items-center justify-center">
                      <Activity size={32} />
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Volume</p>
                      <h3 className="text-4xl font-black text-slate-900 tracking-tight">{transactionCount}</h3>
                    </div>
                  </div>

                  <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 flex items-center gap-6 group hover:translate-y-[-4px] transition-all">
                    <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-[1.5rem] flex items-center justify-center">
                      <ArrowUpRight size={32} />
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Inbound</p>
                      <h3 className="text-4xl font-black text-emerald-600 tracking-tight">{formatCurrency(totalIncome)}</h3>
                    </div>
                  </div>

                  <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 flex items-center gap-6 group hover:translate-y-[-4px] transition-all">
                    <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-[1.5rem] flex items-center justify-center">
                      <ArrowDownRight size={32} />
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Outbound</p>
                      <h3 className="text-4xl font-black text-rose-600 tracking-tight">{formatCurrency(totalExpense)}</h3>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-[3rem] p-8 lg:p-12 shadow-sm border border-slate-100">
                  <div className="mb-10 text-center">
                    <h3 className="text-3xl font-black text-slate-900">Magnitude Analysis</h3>
                    <p className="text-slate-400 font-medium">Visualizing flow volume against historical context</p>
                  </div>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { type: 'Revenue', amount: totalIncome },
                          { type: 'Expense', amount: totalExpense }
                        ]}
                        margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="gradRev" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10B981" />
                            <stop offset="100%" stopColor="#34D399" />
                          </linearGradient>
                          <linearGradient id="gradExp" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#F43F5E" />
                            <stop offset="100%" stopColor="#FB7185" />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                        <XAxis dataKey="type" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 13, fontWeight: 800 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 600 }} tickFormatter={(v) => `$${v}`} />
                        <Tooltip cursor={{ fill: '#F8FAFC' }} contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 25px 30px -5px rgb(0 0 0 / 0.1)' }} formatter={(v: number) => [<span className="font-bold">{formatCurrency(v)}</span>]} />
                        <Bar
                          dataKey="amount"
                          radius={[12, 12, 0, 0]}
                          barSize={80}
                        >
                          <Cell fill="url(#gradRev)" />
                          <Cell fill="url(#gradExp)" />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
