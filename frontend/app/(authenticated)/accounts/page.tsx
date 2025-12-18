"use client";

import { useEffect, useState } from 'react';
import apiFetch from '../../../utils/api';
import {
    Plus,
    Wallet,
    PiggyBank,
    CreditCard,
    TrendingUp,
    ArrowUpRight,
    ShieldCheck,
    Banknote,
    Search,
    LayoutGrid,
    Activity,
    ArrowDownRight,
    Briefcase,
    Layers,
    DollarSign,
    MonitorCheck,
    RefreshCcw,
    PlusCircle,
    ChevronRight,
    ArrowRight
} from 'lucide-react';

interface Account {
    id: number;
    name: string;
    type: 'checking' | 'savings' | 'credit_card' | 'cash' | 'investment';
    balance: number;
    updated_at: string;
}

export default function AccountsPage() {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Form state
    const [name, setName] = useState('');
    const [type, setType] = useState('checking');
    const [balance, setBalance] = useState('');

    const fetchAccounts = async () => {
        setLoading(true);
        try {
            const data = await apiFetch('/api/accounts', { method: 'GET' });
            if (Array.isArray(data)) {
                setAccounts(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
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

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'checking': return <Wallet className="text-white" size={24} />;
            case 'savings': return <PiggyBank className="text-white" size={24} />;
            case 'credit_card': return <CreditCard className="text-white" size={24} />;
            case 'cash': return <Banknote className="text-white" size={24} />;
            case 'investment': return <TrendingUp className="text-white" size={24} />;
            default: return <Wallet className="text-white" size={24} />;
        }
    };

    const getTheme = (type: string) => {
        switch (type) {
            case 'checking': return 'bg-gradient-to-br from-indigo-600 to-indigo-700 shadow-indigo-200';
            case 'savings': return 'bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-emerald-200';
            case 'credit_card': return 'bg-gradient-to-br from-slate-800 to-slate-900 shadow-slate-300';
            case 'cash': return 'bg-gradient-to-br from-amber-400 to-amber-500 shadow-amber-200';
            case 'investment': return 'bg-gradient-to-br from-violet-500 to-violet-600 shadow-violet-200';
            default: return 'bg-gradient-to-br from-slate-600 to-slate-700';
        }
    };

    const filteredAccounts = accounts.filter(acc =>
        acc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        acc.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalNetWorth = accounts.reduce((acc, curr) => acc + Number(curr.balance), 0);

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-10">
            <div className="max-w-7xl mx-auto">
                <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm uppercase tracking-widest mb-1">
                            <Briefcase size={16} />
                            <span>Financial Vaults</span>
                        </div>
                        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Account Portfolio</h1>
                        <p className="text-slate-500 mt-2 text-lg">Central hub for all your liquid and invested assets.</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative group flex-1 md:flex-none">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Search vaults..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-12 pr-6 h-12 bg-white border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-slate-700 w-full md:w-64 shadow-sm"
                            />
                        </div>
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-indigo-100 active:scale-95"
                        >
                            <PlusCircle size={20} />
                            <span>New Vault</span>
                        </button>
                    </div>
                </header>

                {/* Summary Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex items-center gap-5">
                        <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                            <Activity size={28} />
                        </div>
                        <div>
                            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-1">Aggregate Net Worth</p>
                            <h3 className="text-2xl font-black text-slate-900">{formatCurrency(totalNetWorth)}</h3>
                        </div>
                    </div>
                    <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex items-center gap-5">
                        <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                            <Layers size={28} />
                        </div>
                        <div>
                            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-1">Active Accounts</p>
                            <h3 className="text-2xl font-black text-slate-900">{accounts.length} <span className="text-slate-300 text-sm font-medium">Vaults</span></h3>
                        </div>
                    </div>
                    <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex items-center gap-5">
                        <div className="w-14 h-14 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center">
                            <ShieldCheck size={28} />
                        </div>
                        <div>
                            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-1">Security Status</p>
                            <h3 className="text-2xl font-black text-slate-900">Stable</h3>
                        </div>
                    </div>
                </div>

                {/* Form Transition */}
                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${showForm ? 'max-h-[600px] opacity-100 mb-10' : 'max-h-0 opacity-0'}`}>
                    <div className="bg-white/60 backdrop-blur-xl border border-white rounded-[2.5rem] p-8 lg:p-10 shadow-2xl shadow-indigo-100/50">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
                                <Plus size={20} />
                            </div>
                            <h2 className="text-xl font-black text-slate-900 leading-none">Initialize New Vault</h2>
                        </div>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Vault Designation</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full h-14 px-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-700 transition-all placeholder:text-slate-300"
                                    placeholder="e.g. Master Checking"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Account Class</label>
                                <select
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    className="w-full h-14 px-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-700 transition-all cursor-pointer"
                                >
                                    <option value="checking">Checking Account</option>
                                    <option value="savings">Savings Account</option>
                                    <option value="credit_card">Credit Card</option>
                                    <option value="cash">Cash/Wallet</option>
                                    <option value="investment">Investment Portfolio</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Initial Magnitude</label>
                                <input
                                    type="number"
                                    value={balance}
                                    onChange={(e) => setBalance(e.target.value)}
                                    className="w-full h-14 px-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-700 transition-all"
                                    placeholder="0.00"
                                    step="0.01"
                                    required
                                />
                            </div>
                            <div className="md:col-span-3 flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="px-8 h-14 text-slate-500 font-bold hover:bg-slate-50 rounded-2xl transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-10 h-14 bg-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
                                >
                                    Authorize Creation
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col justify-center items-center h-64">
                        <RefreshCcw className="animate-spin text-indigo-600 mb-4" size={40} />
                        <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Syncing vaults...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredAccounts.map((account) => (
                            <div key={account.id} className="group relative">
                                <div className={`relative overflow-hidden p-8 rounded-[2.5rem] shadow-xl transition-all duration-300 group-hover:-translate-y-2 h-[240px] flex flex-col justify-between ${getTheme(account.type)}`}>
                                    {/* Mock Card Details */}
                                    <div className="absolute top-8 right-8 text-white/10 group-hover:text-white/20 transition-colors">
                                        <ShieldCheck size={48} strokeWidth={1} />
                                    </div>

                                    <div className="relative z-10">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="w-12 h-8 bg-white/20 rounded-md border border-white/10 flex items-center justify-center backdrop-blur-sm">
                                                <div className="w-[80%] h-[1px] bg-white/30" />
                                            </div>
                                            <div className="flex -space-x-3">
                                                <div className="w-8 h-8 rounded-full bg-white/20" />
                                                <div className="w-8 h-8 rounded-full bg-white/10" />
                                            </div>
                                        </div>

                                        <div className="mt-6">
                                            <h3 className="text-white font-black text-xl tracking-tight leading-none mb-1">{account.name}</h3>
                                            <p className="text-white/60 text-[10px] font-bold uppercase tracking-[0.2em]">{account.type.replace('_', ' ')}</p>
                                        </div>
                                    </div>

                                    <div className="relative z-10 flex items-end justify-between">
                                        <div>
                                            <p className="text-white/50 text-[10px] font-black uppercase tracking-widest mb-1">Available Funds</p>
                                            <h4 className="text-3xl font-black text-white tracking-tighter">
                                                {formatCurrency(account.balance)}
                                            </h4>
                                        </div>
                                        <div className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors cursor-pointer">
                                            <ArrowUpRight size={20} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Empty Space / CTA */}
                        <button
                            onClick={() => setShowForm(true)}
                            className="border-2 border-dashed border-slate-200 rounded-[2.5rem] p-8 flex flex-col items-center justify-center gap-4 hover:border-indigo-400 hover:bg-white transition-all group min-h-[240px]"
                        >
                            <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                                <Plus size={32} />
                            </div>
                            <div className="text-center">
                                <p className="text-slate-400 group-hover:text-indigo-600 font-black uppercase tracking-widest text-xs transition-colors">Launch New Vault</p>
                                <p className="text-slate-300 text-[10px] mt-1 italic">Scale your financial landscape</p>
                            </div>
                        </button>
                    </div>
                )}

                {!loading && filteredAccounts.length === 0 && searchTerm && (
                    <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
                        <MonitorCheck className="w-16 h-16 text-slate-100 mx-auto mb-4" />
                        <h3 className="text-xl font-black text-slate-900">No matching vaults</h3>
                        <p className="text-slate-400 mt-1">Try adjusting your search criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
