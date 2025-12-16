'use client';

import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface CategoryData {
  name: string;
  value: number;
  [key: string]: string | number; // Index signature for Recharts
}

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState('profitLoss');
  const [loading, setLoading] = useState(false);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [incomeData, setIncomeData] = useState<CategoryData[]>([]);
  const [expenceData, setExpenceData] = useState<CategoryData[]>([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [transactionCount, setTransactionCount] = useState(0);

  React.useEffect(() => {
    async function fetchReports() {
      setLoading(true);
      try {
        const apiFetch = (await import('../../../utils/api')).default;
        const summary = await apiFetch('/api/reports/summary', { method: 'GET' });
        const transactions = await apiFetch('/api/reports/transactions', { method: 'GET' });
        
        const income = summary?.total?.income || 0;
        const expense = summary?.total?.expense || 0;
        
        setTotalIncome(income);
        setTotalExpense(expense);
        setTransactionCount(transactions?.data?.length || 0);
        
        setCategoryData([
          { name: 'Expense', value: expense },
          { name: 'Income', value: income }
        ]);
        
        const incomeCategories = Object.entries(summary?.categories?.income || {}).map(([name, value]) => ({ name, value: Number(value) }));
        const expenseCategories = Object.entries(summary?.categories?.expense || {}).map(([name, value]) => ({ name, value: Number(value) }));
        
        setIncomeData(incomeCategories.length > 0 ? incomeCategories : [{ name: 'No data', value: 0 }]);
        setExpenceData(expenseCategories.length > 0 ? expenseCategories : [{ name: 'No data', value: 0 }]);
      } catch (error) {
        console.error('Failed to fetch reports:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchReports();
  }, []);

  // merge income and expense categories into combined rows and sort by total (desc)
  const combinedNames = Array.from(new Set([...incomeData, ...expenceData].map((d) => d.name)));
  const combinedData = combinedNames
    .map((name) => {
      const income = incomeData.find((d) => d.name === name)?.value || 0;
      const expense = expenceData.find((d) => d.name === name)?.value || 0;
      return { name, income, expense, total: income + expense };
    })
    .sort((a, b) => b.total - a.total);
  const sortedIncomeData = [...incomeData].sort((a, b) => b.value - a.value);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-0 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Insights and performance metrics</p>
        </header>

        <div className="mb-8">
          <select
            value={selectedReport}
            onChange={(e) => setSelectedReport(e.target.value)}
            className="w-full md:w-64 p-2 border border-gray-900 rounded-lg bg-white text-gray-900"
          >
            <option value="profitLoss">Profit & Loss</option>
            <option value="categories">Transaction Summary</option>
          </select>
        </div>
        {/* Profit & Loss / Inventory Valuation view */}
        {selectedReport === 'profitLoss' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Total Value */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Value</h3>
              <p className="text-sm text-gray-600 mb-4">Distribution of total value</p>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={(entry: any) => `${entry.name}: ${formatCurrency(entry.value)}`}
                      labelLine={false}
                    >
                      {categoryData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={["#6366f1", "#10b981", "#f59e0b", "#8b5cf6"][index % 4]}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category Breakdown Table */}
            <div className="bg-white p-6 rounded-lg shadow-sm text-gray-600 h-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Category Breakdown</h3>
              <p className="text-sm text-gray-600 mb-4">Value by category</p>
              <div className="overflow-auto h-70">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm font-medium text-gray-900 border-b">
                      <th className="pb-3">Category</th>
                      <th className="pb-3">Type</th>
                      <th className="pb-3">Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {
                      // merge income and expense datasets and render with type badge
                      [...incomeData.map((c) => ({ ...c, type: 'Income' })), ...expenceData.map((c) => ({ ...c, type: 'Expense' }))].map((category) => (
                        <tr key={`${category.type}-${category.name}`} className="text-sm">
                          <td className="py-3">{category.name}</td>
                          <td className="py-3">
                            <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded ${category.type === 'Income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {category.type}
                            </span>
                          </td>
                          <td className="py-3">{formatCurrency(category.value)}</td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
            </div>

            {/* Expence Value (horizontal sorted bars) - full width */}
            <div className="bg-white p-6 rounded-lg shadow-sm w-full md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Profit/Loss details</h3>
              <p className="text-sm text-gray-600 mb-4">Top categories (sorted)</p>
              {/* compute a chart height based on number of rows, capped for layout */}
              {
                (() => {
                  const rowHeight = 40;
                  const maxVisible = 8; // allow more rows visible before scrolling on full width
                  const chartHeight = Math.min(combinedData.length * rowHeight, maxVisible * rowHeight);
                  return (
                    <div style={{ height: chartHeight, overflowY: combinedData.length > maxVisible ? 'auto' : 'hidden' }}>
                      <ResponsiveContainer width="100%" height={chartHeight}>
                        <BarChart layout="vertical" data={combinedData} margin={{ top: 8, right: 12, left: 12, bottom: 8 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis type="number" tick={{ fill: '#6b7280' }} />
                          <YAxis dataKey="name" type="category" width={150} tick={{ fill: '#374151', fontSize: 13 }} />
                          <Tooltip formatter={(value: number) => formatCurrency(value)} />
                          <Bar dataKey="expense" fill="#6366f1" barSize={18} />
                          <Bar dataKey="income" fill="#10b981" barSize={18} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  );
                })()
              }
            </div>
          </div>
          
        )}


        {/* Category Analysis / Transaction Summary view */}
        {selectedReport === 'categories' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <p className="text-gray-600 text-sm">Total Transactions</p>
                <div className="mt-4">
                  <div className="text-2xl font-semibold text-gray-900">{transactionCount}</div>
                  <p className="text-gray-500 text-xs mt-1">All time</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <p className="text-gray-600 text-sm">Total Income</p>
                <div className="mt-4">
                  <div className="text-2xl font-semibold text-gray-900">{formatCurrency(totalIncome)}</div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <p className="text-gray-600 text-sm">Total Expense</p>
                <div className="mt-4">
                  <div className="text-2xl font-semibold text-gray-900">{formatCurrency(totalExpense)}</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Transaction Type Distribution</h3>
              <p className="text-sm text-gray-600 mb-4">Breakdown of transaction types</p>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[{ type: 'Income', count: incomeData.reduce((sum, d) => sum + d.value, 0) }, 
                                  { type: 'Expense', count: expenceData.reduce((sum, d) => sum + d.value, 0) }, 
                                  ]} 
                                  margin={{ left: 0, right: 0, top: 62, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="type" tick={{ fill: '#6b7280' }} />
                    <YAxis tick={{ fill: '#6b7280' }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#2b6ef6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

