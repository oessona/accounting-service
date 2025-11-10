'use client';

import { useState } from 'react';

interface StockSummary {
  title: string;
  amount: number;
  percentage: number | null;
  description: string;
}

interface Transaction {
  id: string;
  timestamp: string;
  name: string;
  type: 'receiving' | 'shipping' | 'adjustment';
  sku: string;
  category: string;
  quantity: number;
}

export default function TransactionsPage() {
  const [quantity, setQuantity] = useState('');
  const [type, setType] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('');
  
  // Mock transactions data
  const transactions: Transaction[] = [
    {
      id: '1',
      timestamp: '2025-11-09 09:15',
      name: 'Dell XPS 15 Laptop',
      type: 'receiving',
      sku: 'DELL-XPS15-2025',
      category: 'Electronics',
      quantity: 10
    },
    {
      id: '2',
      timestamp: '2025-11-09 10:30',
      name: 'Wireless Mouse',
      type: 'shipping',
      sku: 'ACC-MOUSE-001',
      category: 'Electronics',
      quantity: 25
    },
    {
      id: '3',
      timestamp: '2025-11-09 11:45',
      name: 'USB-C Hub',
      type: 'receiving',
      sku: 'ACC-HUB-002',
      category: 'Furniture',
      quantity: 50
    },
    {
      id: '4',
      timestamp: '2025-11-09 13:20',
      name: 'Monitor Stand',
      type: 'adjustment',
      sku: 'ACC-STAND-003',
      category: 'Office Supplies',
      quantity: -5
    }
  ];

  const summaries: StockSummary[] = [
    {
      title: 'Total Received Today',
      amount: 150,
      percentage: 25,
      description: 'vs yesterday'
    },
    {
      title: 'Total Shipped Today',
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
    console.log({ quantity, type, sku, category });
  };

  return (
    <div className="p-6 flex-1 bg-gray-50 text-black p-16">
      <h1 className="text-2xl font-semibold mb-6">Stock Transactions</h1>
      
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
        <h2 className="text-lg font-semibold mb-4">Record Stock Movement</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                Movement Type
              </label>
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:border-transparent"
              >
                <option value="">Select type...</option>
                <option value="receiving">Receiving</option>
                <option value="shipping">Shipping</option>
                <option value="adjustment">Stock Adjustment</option>
              </select>
            </div>
            <div>
              <label htmlFor="sku" className="block text-sm font-medium text-gray-700 mb-1">
                SKU
              </label>
              <input
                type="text"
                id="sku"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Enter SKU..."
              />
            </div>
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                Quantity
              </label>
              <input
                type="number"
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent"
                placeholder="0"
              />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <input
                type="text"
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Add category..."
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
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.timestamp}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {transaction.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                      ${transaction.type === 'receiving' ? 'bg-green-100 text-green-800' : 
                        transaction.type === 'shipping' ? 'bg-blue-100 text-blue-800' : 
                        'bg-yellow-100 text-yellow-800'}`}>
                      {transaction.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                    {transaction.sku}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                    {transaction.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className={transaction.quantity >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {transaction.quantity > 0 ? '+' : ''}{transaction.quantity}
                    </span>
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