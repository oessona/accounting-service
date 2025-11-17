'use client';

import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface CategoryData {
  name: string;
  items: number;
  value: number;
  [key: string]: string | number; // Index signature for Recharts
}

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState('inventory');

  const categoryData: CategoryData[] = [
    { name: 'Expence', items: 478, value: 9295.22 },
    { name: 'Income', items: 43, value: 12349.57 }
  ];
  const incomeData: CategoryData[] = [
    { name: 'sales', items: 478, value: 9295.22 },
    { name: 'refunds', items: 43, value: 12349.57 },
    { name: 'salary received', items: 43, value: 12349.57 }
  ];
  const expenceData: CategoryData[] = [
    { name: 'rent', items: 478, value: 9295.22 },
    { name: 'utilities', items: 43, value: 12349.57 },
    { name: 'software', items: 478, value: 9295.22 },
    { name: 'subscriptions', items: 43, value: 12349.57 },
    { name: 'transport', items: 478, value: 9295.22 }
  ];

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
            <option value="inventory">Inventory Valuation</option>
            <option value="categories">Transaction Summary</option>
          </select>
        </div>
        {/* Inventory Valuation view */}
        {selectedReport === 'inventory' && (
          <>
            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="mb-4">
                  <p className="text-gray-600 text-sm">Total Inventory Value</p>
                  <div className="flex items-baseline">
                    <span className="text-green-600 text-2xl font-semibold">{formatCurrency(27751.12)}</span>
                  </div>
                  <p className="text-gray-500 text-xs mt-1">Across all categories</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="mb-4">
                  <p className="text-gray-600 text-sm">Total transactions</p>
                  <div className="flex items-baseline">
                    <span className="text-gray-900 text-2xl font-semibold">84</span>
                  </div>
                  <p className="text-gray-500 text-xs mt-1">Units </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="mb-4">
                  <p className="text-gray-600 text-sm">Average Unit Value</p>
                  <div className="flex items-baseline">
                    <span className="text-purple-600 text-2xl font-semibold">{formatCurrency(31.25)}</span>
                  </div>
                  <p className="text-gray-500 text-xs mt-1">Per unit</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Total Value Chart */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Value</h3>
                <p className="text-sm text-gray-600 mb-4">Distribution of total value</p>
                <div className="h-64">
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
                      >
                        {categoryData.map((_, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={[
                              '#10b981', // teal
                              '#6366f1', // indigo
                              '#f59e0b', // amber
                              '#8b5cf6'  // purple
                            ][index % 4]} 
                          />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: number) => formatCurrency(value)} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Category Breakdown Table
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Income value</h3>
                <p className="text-sm text-gray-600 mb-4">Distribution of income value</p>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={incomeData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={(entry: any) => `${entry.name}: ${formatCurrency(entry.value)}`}
                      >
                        {categoryData.map((_, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={[
                              '#10b981', // teal
                              '#6366f1', // indigo
                              '#f59e0b', // amber
                              '#8b5cf6'  // purple
                            ][index % 4]} 
                          />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: number) => formatCurrency(value)} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category Value Chart */}
              {/* <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Expence Value</h3>
                <p className="text-sm text-gray-600 mb-4">Distribution of expence value</p>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={expenceData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={(entry: any) => `${entry.name}: ${formatCurrency(entry.value)}`}
                      >
                        {categoryData.map((_, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={[
                              '#10b981', // teal
                              '#6366f1', // indigo
                              '#f59e0b', // amber
                              '#8b5cf6'  // purple
                            ][index % 4]} 
                          />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: number) => formatCurrency(value)} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div> */}

              {/* Category Breakdown Table */}
              <div className="bg-white p-6 rounded-lg shadow-sm text-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Category Breakdown</h3>
                <p className="text-sm text-gray-600 mb-4">Value and quantity by category</p>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-sm font-medium text-gray-900 border-b">
                        <th className="pb-3">Category</th>
                        <th className="pb-3">Value</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {categoryData.map((category) => (
                        <tr key={category.name} className="text-sm">
                          <td className="py-3">{category.name}</td>
                          <td className="py-3">{formatCurrency(category.value)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div> 
            </>
            )}


        {/* Category Analysis / Transaction Summary view */}
        {selectedReport === 'categories' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <p className="text-gray-600 text-sm">Total Transactions</p>
                <div className="mt-4">
                  <div className="text-2xl font-semibold text-gray-900">84</div>
                  <p className="text-gray-500 text-xs mt-1">All time</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <p className="text-gray-600 text-sm">Income from Transactions</p>
                <div className="mt-4">
                  <div className="text-2xl font-semibold text-gray-900">52</div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <p className="text-gray-600 text-sm">Expence from Transactions</p>
                <div className="mt-4">
                  <div className="text-2xl font-semibold text-gray-900">32</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Transaction Type Distribution</h3>
              <p className="text-sm text-gray-600 mb-4">Breakdown of transaction types</p>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[{ type: 'Income', count: 52 }, { type: 'Expence', count: 32 }, ]} margin={{ left: 0, right: 0, top: 62, bottom: 0 }}>
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

