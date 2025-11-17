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
            ->with('category')
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
