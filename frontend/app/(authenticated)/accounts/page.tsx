"use client";

import { useEffect, useState } from 'react';
import apiFetch from '../../../utils/api';
import { Plus, Wallet, TrendingUp, TrendingDown, PiggyBank } from 'lucide-react';

interface Account {
    id: number;
    name: string;
    type: 'income' | 'expense' | 'savings';
    balance: number;
}

export default function AccountsPage() {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);

    // Form state
    const [name, setName] = useState('');
    const [type, setType] = useState('expense');
    const [balance, setBalance] = useState('');

    const fetchAccounts = () => {
        setLoading(true);
        apiFetch('/api/accounts', { method: 'GET' })
            .then((data: any) => {
                if (Array.isArray(data)) {
                    // Backend returns numeric strings for decimals sometimes, ensure proper display
                    setAccounts(data);
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await apiFetch('/api/accounts', {
                method: 'POST',
                body: JSON.stringify({
                    name,
                    type,
                    balance: parseFloat(balance)
                })
            });
            setShowForm(false);
            setName('');
            setBalance('');
            fetchAccounts();
        } catch (error) {
            alert('Failed to create account');
            console.error(error);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'income': return <TrendingUp className="text-green-600" />;
            case 'expense': return <TrendingDown className="text-red-600" />;
            case 'savings': return <PiggyBank className="text-blue-600" />;
            default: return <Wallet className="text-gray-600" />;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Accounts</h1>
                    <p className="text-gray-500">Manage your financial sources</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center space-x-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition"
                >
                    <Plus className="w-5 h-5" />
                    <span>Add Account</span>
                </button>
            </div>

            {showForm && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
                    <h2 className="text-lg font-semibold mb-4 text-black">New Account Details</h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Account Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full rounded-lg border-gray-300 border p-2 focus:ring-teal-500 focus:border-teal-500 text-black"
                                placeholder="e.g., Main Bank"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                className="w-full rounded-lg border-gray-300 border p-2 focus:ring-teal-500 focus:border-teal-500 text-black"
                            >
                                <option value="income">Income Source</option>
                                <option value="expense">Expense Source</option>
                                <option value="savings">Savings</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Initial Balance</label>
                            <input
                                type="number"
                                value={balance}
                                onChange={(e) => setBalance(e.target.value)}
                                className="w-full rounded-lg border-gray-300 border p-2 focus:ring-teal-500 focus:border-teal-500 text-black"
                                placeholder="0.00"
                                step="0.01"
                                required
                            />
                        </div>
                        <div className="md:col-span-3 flex justify-end space-x-3 mt-2">
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                            >
                                Create Account
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {loading ? (
                <div className="text-center py-12 text-gray-500">Loading accounts...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {accounts.map((account) => (
                        <div key={account.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    {getIcon(account.type)}
                                </div>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize
                  ${account.type === 'income' ? 'bg-green-100 text-green-800' :
                                        account.type === 'expense' ? 'bg-red-100 text-red-800' :
                                            'bg-blue-100 text-blue-800'}`}>
                                    {account.type}
                                </span>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">{account.name}</h3>
                            <p className="text-2xl font-bold text-gray-900">${Number(account.balance).toFixed(2)}</p>
                        </div>
                    ))}
                </div>
            )}

            {!loading && accounts.length === 0 && (
                <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                    <Wallet className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-gray-900">No accounts yet</h3>
                    <p className="text-gray-500 mt-1">Create your first account to start tracking transactions.</p>
                </div>
            )}
        </div>
    );
}
