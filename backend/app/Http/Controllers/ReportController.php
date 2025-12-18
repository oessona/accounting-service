<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\Category;

class ReportController extends Controller
{
    public function summary()
    {
        $userId = auth()->id();

        $transactions = Transaction::where('user_id', $userId)
            ->with(['category', 'account'])
            ->get();

        $totalIncome = $transactions->where('type', 'income')->sum('amount');
        $totalExpense = $transactions->where('type', 'expense')->sum('amount');

        $incomeByCategory = $transactions
            ->where('type', 'income')
            ->groupBy('category.name')
            ->map->sum('amount');

        $expenseByCategory = $transactions
            ->where('type', 'expense')
            ->groupBy('category.name')
            ->map->sum('amount');

        // Account specific data
        $accounts = $transactions->groupBy('account_id')->map(function ($txs) {
            $first = $txs->first();
            return [
                'id' => $first->account_id,
                'name' => $first->account->name ?? 'Unknown',
                'income' => $txs->where('type', 'income')->sum('amount'),
                'expense' => $txs->where('type', 'expense')->sum('amount'),
                'categories' => [
                    'income' => $txs->where('type', 'income')->groupBy('category.name')->map->sum('amount'),
                    'expense' => $txs->where('type', 'expense')->groupBy('category.name')->map->sum('amount'),
                ]
            ];
        })->values();

        return response()->json([
            'success' => true,
            'total' => [
                'income' => $totalIncome,
                'expense' => $totalExpense,
                'balance' => $totalIncome - $totalExpense,
            ],
            'categories' => [
                'income' => $incomeByCategory,
                'expense' => $expenseByCategory,
            ],
            'accounts' => $accounts
        ]);
    }

    public function allTransactions()
    {
        $transactions = Transaction::where('user_id', auth()->id())
            ->with('category')
            ->orderBy('transaction_date', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $transactions,
        ]);
    }
}
