'use client';

import { useState } from 'react';

interface TransactionSummary {
  title: string;
  amount: number;
  percentage: number | null;
  description: string;
}

export default function TransactionsPage() {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('');
  const [details, setDetails] = useState('');

  const summaries: TransactionSummary[] = [
    {
      title: 'Net Income (This Month)',
      amount: 8200.00,
      percentage: 2.5,
      description: 'from last month'
    },
    {
      title: 'Total Expenses (This Month)',
      amount: 4500.00,
      percentage: 2.0,
      description: 'Expenses month'
    },
    {
      title: 'Estimated Tax (This Month)',
      amount: 820.00,
      percentage: null,
      description: 'Based on Current'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle transaction submission
    console.log({ amount, type, details });
  };

  return (
    <div className="p-6 flex-1 bg-gray-50 text-black p-16">
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {summaries.map((summary, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm text-gray-600">{summary.title}</h3>
            <p className="text-2xl font-semibold mt-2">${summary.amount.toFixed(2)}</p>
            <p className={`text-sm text-gray-500 mt-1 ${!summary.percentage ? "" : summary.percentage > 0 ? "!text-green-500" : "!text-red-500"}`}>{!summary.percentage ? "" : summary.percentage > 0 ? "+" : "-"}{summary.percentage}{summary.percentage ? "%" : ""} {summary.description}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Record New Transaction</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                Amount ($)
              </label>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent"
                placeholder="0.00"
              />
            </div>
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:border-transparent"
              >
                <option value="">Select type...</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <div>
              <label htmlFor="details" className="block text-sm font-medium text-gray-700 mb-1">
                Description / Notes
              </label>
              <input
                type="text"
                id="details"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter details..."
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Save Transaction
          </button>
        </form>
      </div>
    </div>
  );
}
