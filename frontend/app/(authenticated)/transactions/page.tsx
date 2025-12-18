"use client";

import { useEffect, useState } from 'react';
import apiFetch from '../../../utils/api';
import {
  Edit,
  Trash2,
  Plus,
  History,
  ArrowUpCircle,
  ArrowDownCircle,
  Scale,
  RefreshCcw,
  CheckCircle2,
  XCircle,
  Briefcase,
  Layers,
  DollarSign,
  Calendar as CalendarIcon,
  Search,
  Activity
} from 'lucide-react';

interface TransactionSummary {
  title: string;
  amount: number;
  icon: any;
  color: string;
  bgColor: string;
}

interface Transaction {
  id: number;
  account_id: number;
  type: 'income' | 'expense';
  category_id: number;
  amount: number;
  description: string | null;
  transaction_date: string;
  created_at: string;
  updated_at: string;
  account?: Account;
  category?: { id: number; name: string };
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
  const [editingId, setEditingId] = useState<number | null>(null);
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
  const [searchTerm, setSearchTerm] = useState('');

  const loadData = async () => {
    try {
      const accountsData = await apiFetch('/api/accounts', { method: 'GET' });
      if (Array.isArray(accountsData)) {
        setAccounts(accountsData as Account[]);
        if (accountsData.length > 0 && !accountId) {
          setAccountId(String(accountsData[0].id));
        }
      }

      setLoadingStats(true);
      const stats = await apiFetch('/api/transactions/stats/today', { method: 'GET' });
      if (stats && typeof stats === 'object') {
        setTodayStats({
          income: stats.income || 0,
          expense: stats.expense || 0
        });
      }
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  const loadTransactions = async () => {
    setLoadingTx(true);
    try {
      const data = await apiFetch('/api/transactions', { method: 'GET' });
      if (Array.isArray(data)) setTransactions(data as Transaction[]);
      else setTransactions([]);
    } catch (err: any) {
      console.error(err);
      setTxError(err?.message || 'Failed to load transactions');
    } finally {
      setLoadingTx(false);
    }
  };

  useEffect(() => {
    loadData();
    loadTransactions();
  }, []);

  const summaries: TransactionSummary[] = [
    {
      title: "Today's Revenue",
      amount: todayStats.income,
      icon: ArrowUpCircle,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      title: "Today's Spent",
      amount: todayStats.expense,
      icon: ArrowDownCircle,
      color: "text-rose-600",
      bgColor: "bg-rose-50",
    },
    {
      title: "Daily Net Flow",
      amount: todayStats.income - todayStats.expense,
      icon: Scale,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    }
  ];

  const resetForm = () => {
    setEditingId(null);
    setAmount('');
    setType('');
    setCategory('');
    setDescription('');
    setTransactionDate(new Date().toISOString().split('T')[0]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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

        if (editingId) {
          const updated = await apiFetch(`/api/transactions/${editingId}`, {
            method: 'PUT',
            body: JSON.stringify(payload)
          });
          if (updated && updated.id) {
            setTransactions(prev => prev.map(t => t.id === editingId ? updated : t));
          }
        } else {
          const created = await apiFetch('/api/transactions', {
            method: 'POST',
            body: JSON.stringify(payload)
          });
          if (created && created.id) {
            setTransactions(prev => [created, ...prev]);
          }
        }

        resetForm();
        loadData();
      } catch (err: any) {
        alert(err?.message || 'Action failed');
      }
    })();
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingId(transaction.id);
    setAccountId(String(transaction.account_id));
    setType(transaction.type);
    setCategory(transaction.category?.name || '');
    setAmount(String(transaction.amount));
    setDescription(transaction.description || '');
    setTransactionDate(transaction.transaction_date);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: number) => {
    if (confirm(`Are you sure you want to delete this transaction?`)) {
      (async () => {
        try {
          await apiFetch(`/api/transactions/${id}`, { method: 'DELETE' });
          setTransactions((s) => s.filter((t) => t.id !== id));
          loadData();
        } catch (err: any) {
          alert(err?.message || 'Delete failed');
        }
      })();
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const filteredTransactions = transactions.filter(t =>
  (t.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.category?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.account?.name?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-10">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm uppercase tracking-widest mb-1">
              <History size={16} />
              <span>General Ledger</span>
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Transactions</h1>
            <p className="text-slate-500 mt-2 text-lg">Manage and track every financial movement.</p>
          </div>

          <button
            onClick={loadTransactions}
            className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-600 px-6 py-3 rounded-2xl font-bold text-sm transition-all border border-slate-100 shadow-sm"
          >
            <RefreshCcw size={18} className={loadingTx ? 'animate-spin' : ''} />
            Sync Data
          </button>
        </header>

        {/* Summaries */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {summaries.map((summary, index) => (
            <div key={index} className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex items-center gap-5">
              <div className={`w-14 h-14 ${summary.bgColor} ${summary.color} rounded-2xl flex items-center justify-center`}>
                <summary.icon size={28} />
              </div>
              <div>
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-1">{summary.title}</p>
                <h3 className={`text-2xl font-black ${summary.amount < 0 && summary.title.includes('Net') ? 'text-rose-600' : 'text-slate-900'}`}>
                  {formatCurrency(summary.amount)}
                </h3>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">

          {/* Form Card */}
          <div className="bg-white rounded-[2.5rem] p-8 lg:p-10 shadow-sm border border-slate-100 sticky top-28">
            <div className="flex items-center gap-3 mb-8">
              <div className={`w-10 h-10 ${editingId ? 'bg-amber-100 text-amber-600' : 'bg-indigo-100 text-indigo-600'} rounded-xl flex items-center justify-center`}>
                {editingId ? <Edit size={20} /> : <Plus size={20} />}
              </div>
              <h2 className="text-xl font-black text-slate-900">
                {editingId ? 'Edit Entry' : 'Quick Entry'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Briefcase size={14} className="text-indigo-500" /> Account
                </label>
                <select
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
                  className="w-full h-14 px-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none font-bold text-slate-700 transition-all"
                  required
                >
                  <option value="">Select account...</option>
                  {accounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.name} (Balance: {formatCurrency(account.balance)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Activity size={14} className="text-indigo-500" /> Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full h-14 px-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none font-bold text-slate-700 transition-all"
                    required
                  >
                    <option value="">Choose...</option>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Layers size={14} className="text-indigo-500" /> Category
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full h-14 px-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none font-bold text-slate-700 transition-all placeholder:text-slate-300"
                    placeholder="e.g. Health"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <DollarSign size={14} className="text-indigo-500" /> Amount
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full h-14 px-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none font-bold text-slate-700 transition-all placeholder:text-slate-300"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <CalendarIcon size={14} className="text-indigo-500" /> Date
                  </label>
                  <input
                    type="date"
                    value={transactionDate}
                    onChange={(e) => setTransactionDate(e.target.value)}
                    className="w-full h-14 px-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none font-bold text-slate-700 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Notes</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none font-bold text-slate-700 transition-all placeholder:text-slate-300 h-24 resize-none"
                  placeholder="Memo or context..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className={`flex-1 h-14 rounded-2xl font-black text-white shadow-lg transition-all active:scale-95 ${editingId ? 'bg-amber-500 shadow-amber-100 hover:bg-amber-600' : 'bg-indigo-600 shadow-indigo-100 hover:bg-indigo-700 leading-none'}`}
                >
                  {editingId ? 'Save Changes' : 'Confirm Movement'}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 h-14 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Table Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-8 lg:p-10 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 leading-none mb-1">Recent History</h3>
                  <p className="text-slate-400 font-medium">Tracking all verified movements</p>
                </div>
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                  <input
                    type="text"
                    placeholder="Search ledgers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 pr-6 h-12 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-bold text-slate-700 w-full md:w-64"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50/50 text-left">
                      <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Date & Context</th>
                      <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Stream</th>
                      <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Magnitude</th>
                      <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Ops</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredTransactions.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-8 py-20 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <History size={48} className="text-slate-100" />
                            <p className="text-slate-400 font-black uppercase tracking-widest text-sm">No records found</p>
                          </div>
                        </td>
                      </tr>
                    )}
                    {filteredTransactions.map((tx) => (
                      <tr key={tx.id} className="group hover:bg-slate-50/30 transition-colors">
                        <td className="px-8 py-6">
                          <div className="flex flex-col">
                            <span className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                              {tx.account?.name || 'Primary Vault'}
                            </span>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                {new Date(tx.transaction_date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                              </span>
                              <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                              <span className="text-[10px] font-extrabold text-indigo-500/70 uppercase tracking-tighter">
                                {tx.category?.name || 'General'}
                              </span>
                            </div>
                            {tx.description && (
                              <p className="text-xs text-slate-400 mt-2 font-medium italic line-clamp-1">{tx.description}</p>
                            )}
                          </div>
                        </td>
                        <td className="px-8 py-6 leading-none">
                          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${tx.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                            {tx.type === 'income' ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                            {tx.type}
                          </div>
                        </td>
                        <td className="px-8 py-6 text-right font-black">
                          <span className={`text-lg ${tx.type === 'income' ? 'text-emerald-600' : 'text-slate-900 underline decoration-rose-200 decoration-4'}`}>
                            {tx.type === 'income' ? '+' : ''}{formatCurrency(tx.amount)}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleEdit(tx)}
                              className="w-10 h-10 flex items-center justify-center bg-white text-slate-500 hover:text-indigo-600 hover:shadow-md rounded-xl transition-all border border-slate-100"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(tx.id)}
                              className="w-10 h-10 flex items-center justify-center bg-white text-slate-500 hover:text-rose-600 hover:shadow-md rounded-xl transition-all border border-slate-100"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
