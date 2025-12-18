<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $userId = Auth::id();

        // Basic stats
        $totalIncome = Transaction::where('user_id', $userId)->where('type', 'income')->sum('amount');
        $totalExpense = Transaction::where('user_id', $userId)->where('type', 'expense')->sum('amount');

        $todayStats = Transaction::where('user_id', $userId)
            ->whereDate('transaction_date', Carbon::today())
            ->get();

        $todayActivity = $todayStats->count();

        // Monthly growth (simple comparison with last month)
        $thisMonth = Carbon::now()->startOfMonth();
        $lastMonth = Carbon::now()->subMonth()->startOfMonth();

        $thisMonthBalance = Transaction::where('user_id', $userId)
            ->where('transaction_date', '>=', $thisMonth)
            ->selectRaw("SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END) as balance")
            ->value('balance') ?? 0;

        $lastMonthBalance = Transaction::where('user_id', $userId)
            ->where('transaction_date', '>=', $lastMonth)
            ->where('transaction_date', '<', $thisMonth)
            ->selectRaw("SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END) as balance")
            ->value('balance') ?? 0;

        $growth = 0;
        if ($lastMonthBalance > 0) {
            $growth = (($thisMonthBalance - $lastMonthBalance) / $lastMonthBalance) * 100;
        } elseif ($thisMonthBalance > 0) {
            $growth = 100;
        }

        // Monthly data for chart (last 6 months)
        $monthlyData = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = Carbon::now()->subMonths($i);
            $start = $month->copy()->startOfMonth();
            $end = $month->copy()->endOfMonth();

            $income = Transaction::where('user_id', $userId)
                ->where('type', 'income')
                ->whereBetween('transaction_date', [$start, $end])
                ->sum('amount');

            $expense = Transaction::where('user_id', $userId)
                ->where('type', 'expense')
                ->whereBetween('transaction_date', [$start, $end])
                ->sum('amount');

            $monthlyData[] = [
                'month' => $month->format('M'),
                'income' => (float) $income,
                'expense' => (float) $expense
            ];
        }

        return response()->json([
            'userName' => Auth::user()->name,
            'TotalValue' => (float) ($totalIncome - $totalExpense),
            'IncomeValue' => (float) $totalIncome,
            'ExpenseValue' => (float) $totalExpense,
            'todaysActivity' => $todayActivity,
            'growthInPercen' => ($growth >= 0 ? '+' : '') . round($growth, 1) . '%',
            'monthlyData' => [
                'income' => array_column($monthlyData, 'income'),
                'expense' => array_column($monthlyData, 'expense'),
                'months' => array_column($monthlyData, 'month'),
                'chartData' => $monthlyData // For easier use in Recharts
            ]
        ]);
    }
}
