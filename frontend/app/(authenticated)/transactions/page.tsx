"use client";

import { useEffect, useState } from 'react';
import apiFetch from '../../../utils/api';
import { Edit, Trash2 } from 'lucide-react';

interface TransactionSummary {
  title: string;
  amount: number;
  percentage: number | null;
  description: string;
}

interface Transaction {
  id: number;
  account_id: number;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string | null;
  transaction_date: string;
  created_at: string;
  updated_at: string;
}

interface Account {
  id: number;
  name: string;
  type: string;
  balance: number;
}

interface TodayStats {
  income: number;
  expense: number;
}

export default function TransactionsPage() {
  const [accountId, setAccountId] = useState('');
  const [type, setType] = useState('');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [transactionDate, setTransactionDate] = useState(new Date().toISOString().split('T')[0]);

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingTx, setLoadingTx] = useState(false);
  const [txError, setTxError] = useState<string | null>(null);
  const [todayStats, setTodayStats] = useState<TodayStats>({ income: 0, expense: 0 });
  const [loadingStats, setLoadingStats] = useState(false);

  useEffect(() => {
    let mounted = true;

    // Load accounts
    apiFetch('/api/accounts', { method: 'GET' })
      .then((data: any) => {
        if (!mounted) return;
        if (Array.isArray(data)) {
          setAccounts(data as Account[]);
          if (data.length > 0 && !accountId) {
            setAccountId(String(data[0].id));
          }
        }
      })
      .catch((err) => {
        console.error('Failed to load accounts:', err);
      });

    // Load transactions
    setLoadingTx(true);
    apiFetch('/api/transactions', { method: 'GET' })
      .then((data: any) => {
        if (!mounted) return;
        if (Array.isArray(data)) setTransactions(data as Transaction[]);
        else setTransactions([]);
      })
      .catch((err) => {
        console.error(err);
        // surface useful debug info
        const msg = err?.message || 'Failed to load transactions';
        const url = err?.url ? ` (url: ${err.url})` : '';
        setTxError(msg + url);
      })
      .finally(() => mounted && setLoadingTx(false));

    // Load today's stats
    setLoadingStats(true);
    apiFetch('/api/transactions/stats/today', { method: 'GET' })
      .then((data: any) => {
        if (!mounted) return;
        if (data && typeof data === 'object') {
          setTodayStats({
            income: data.income || 0,
            expense: data.expense || 0
          });
        }
      })
      .catch((err) => {
        console.error('Failed to load today stats:', err);
      })
      .finally(() => mounted && setLoadingStats(false));

    return () => { mounted = false; };
  }, []);

  const summaries: TransactionSummary[] = [
    {
      title: 'Total income for Today',
      amount: todayStats.income,
      percentage: null,
      description: loadingStats ? 'Loading...' : ''
    },
    {
      title: 'Total expense for Today',
      amount: todayStats.expense,
      percentage: null,
      description: loadingStats ? 'Loading...' : ''
    },
    {
      title: 'Net Balance Today',
      amount: todayStats.income - todayStats.expense,
      percentage: null,
      description: loadingStats ? 'Loading...' : ''
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // submit to backend
    (async () => {
      try {
        const payload = {
          account_id: Number(accountId),
          type,
          category,
          amount: Number(amount),
          description: description || null,
          transaction_date: transactionDate
        };
        const created = await apiFetch('/api/transactions', { method: 'POST', body: JSON.stringify(payload) });
        // optimistic add to list if backend returns created record
        if (created && created.id) {
          setTransactions((s) => [created, ...s]);
          // Refresh today's stats
          const stats = await apiFetch('/api/transactions/stats/today', { method: 'GET' });
          if (stats) {
            setTodayStats({
              income: stats.income || 0,
              expense: stats.expense || 0
            });
          }
        }
        setAmount(''); setType(''); setCategory(''); setDescription('');
        alert('Transaction submitted');
      } catch (err: any) {
        alert(err?.message || 'Failed to submit');
      }
    })();
  };

  const handleEdit = (id: number) => {
    alert(`Edit transaction ${id}`);
    // Add edit modal or navigation logic here
  };

  const handleDelete = (id: number) => {
    if (confirm(`Delete transaction ${id}?`)) {
      (async () => {
        try {
          await apiFetch(`/api/transactions/${id}`, { method: 'DELETE' });
          setTransactions((s) => s.filter((t) => t.id !== id));
          // Refresh today's stats
          const stats = await apiFetch('/api/transactions/stats/today', { method: 'GET' });
          if (stats) {
            setTodayStats({
              income: stats.income || 0,
              expense: stats.expense || 0
            });
          }
        } catch (err: any) {
          alert(err?.message || 'Delete failed');
        }
      })();
    }
  };

  return (
    <div className="p-10 flex-1 bg-gray-50 text-black">
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
              <label htmlFor="account_id" className="block text-sm font-medium text-gray-700 mb-1">
                Account *
              </label>
              <select
                id="account_id"
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:border-transparent"
                required
              >
                <option value="">Select account...</option>
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.name} ({account.type})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                Type *
              </label>
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:border-transparent"
                required
              >
                <option value="">Select type...</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <input
              type="text"
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent"
              placeholder="e.g., Food, Salary, Rent"
              required
            />
          </div>
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
              Amount *
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent"
              placeholder="0.00"
              step="0.01"
              min="0"
              required
            />
          </div>
          <div>
            <label htmlFor="transaction_date" className="block text-sm font-medium text-gray-700 mb-1">
              Transaction Date *
            </label>
            <input
              type="date"
              id="transaction_date"
              value={transactionDate}
              onChange={(e) => setTransactionDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              type="text"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent"
              placeholder="Optional description"
            />
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
        {loadingTx && (
          <div className="text-sm text-gray-600 mb-3">Loading transactions...</div>
        )}
        {txError && (
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded mb-3">{txError}</div>
        )}
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Edit</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Delete</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.length === 0 && !loadingTx && !txError && (
                <tr>
                  <td colSpan={7} className="px-6 py-6 text-center text-sm text-gray-500">No transactions found</td>
                </tr>
              )}

              {transactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(transaction.transaction_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                      ${transaction.type === 'income' ? 'bg-green-100 text-green-800' :
                        transaction.type === 'expense' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'}`}>
                      {transaction.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                      {transaction.type === 'income' ? '+' : '-'}{transaction.amount.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {transaction.description || '-'}
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