'use client';

import { useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';

interface StockSummary {
  title: string;
  amount: number;
  percentage: number | null;
  description: string;
}

interface Transaction {
  id: string;
  timestamp: string;
  type: 'income' | 'expence';
  value: number;
}

export default function TransactionsPage() {
  const [value, setvalue] = useState('');
  const [type, setType] = useState('');
  const [category, setCategory] = useState('');
  
  // Mock transactions data
  const transactions: Transaction[] = [
    {
      id: '1',
      timestamp: '2025-11-09 09:15',
      type: 'income',
      value: 10
    },
    {
      id: '2',
      timestamp: '2025-11-09 10:30',
      type: 'expence',
      value: 25
    },
    {
      id: '3',
      timestamp: '2025-11-09 11:45',
      type: 'income',
      value: 50
    },
    {
      id: '4',
      timestamp: '2025-11-09 13:20',
      type: 'income',
      value: -5
    }
  ];

  const summaries: StockSummary[] = [
    {
      title: 'Total income for Today',
      amount: 150,
      percentage: 25,
      description: 'vs yesterday'
    },
    {
      title: 'Total expence for Today',
      amount: 120,
      percentage: 15,
      description: 'vs yesterday'
    },
    {
      title: 'Pending Orders',
      amount: 45,
      percentage: null,
      description: 'Need processing'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Demo submission
    alert('Transaction submitted (demo only)');
    console.log({ value, type, category });
  };

  const handleEdit = (id: string) => {
    alert(`Edit transaction ${id}`);
    // Add edit modal or navigation logic here
  };

  const handleDelete = (id: string) => {
    if (confirm(`Delete transaction ${id}?`)) {
      alert(`Transaction ${id} deleted`);
      // Add deletion logic here
    }
  };

  return (
    <div className="p-6 flex-1 bg-gray-50 text-black p-10">
      <h1 className="text-2xl font-semibold mb-6">Transactions</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {summaries.map((summary, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm text-gray-600">{summary.title}</h3>
            <p className="text-2xl font-semibold mt-2">{summary.amount}</p>
            <p className={`text-sm mt-1 ${!summary.percentage ? "text-gray-500" : summary.percentage > 0 ? "text-teal-500" : "text-red-500"}`}>
              {!summary.percentage ? "" : summary.percentage > 0 ? "↑" : "↓"} {summary.percentage}{summary.percentage ? "%" : ""} {summary.description}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Add new transaction</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <option value="expence">Expence</option>
              </select>
            </div>
            <div>
              <label htmlFor="value" className="block text-sm font-medium text-gray-700 mb-1">
                Value
              </label>
              <input
                type="number"
                id="value"
                value={value}
                onChange={(e) => setvalue(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent"
                placeholder="0"
              />
            </div>
            
          </div>
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
          >
            Record Movement
          </button>
        </form>
      </div>

      {/* Transactions Table */}
      <div className="bg-white mt-8 p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">value</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Edit</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Delete</th>

              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.timestamp}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                      ${transaction.type === 'income' ? 'bg-green-100 text-green-800' : 
                        transaction.type === 'expence' ? 'bg-blue-100 text-blue-800' : 
                        'bg-yellow-100 text-yellow-800'}`}>
                      {transaction.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className={transaction.value >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {transaction.value > 0 ? '+' : ''}{transaction.value}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleEdit(transaction.id)}
                      className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 rounded"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleDelete(transaction.id)}
                      className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}