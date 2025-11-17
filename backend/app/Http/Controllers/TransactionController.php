<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TransactionController extends Controller
{
    public function index()
    {
        return Transaction::where('user_id', Auth::id())->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'account_id' => 'required|integer',
            'type' => 'required|in:income,expense',
            'category' => 'required|string',
            'amount' => 'required|numeric',
            'description' => 'nullable|string',
            'transaction_date' => 'required|date'
        ]);

        $data['user_id'] = Auth::id();

        return Transaction::create($data);
    }

    public function show($id)
    {
        return Transaction::where('user_id', Auth::id())->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $transaction = Transaction::where('user_id', Auth::id())->findOrFail($id);

        $data = $request->validate([
            'account_id' => 'integer',
            'type' => 'in:income,expense',
            'category' => 'string',
            'amount' => 'numeric',
            'description' => 'nullable|string',
            'transaction_date' => 'date'
        ]);

        $transaction->update($data);

        return $transaction;
    }

    public function destroy($id)
    {
        $transaction = Transaction::where('user_id', Auth::id())->findOrFail($id);

        $transaction->delete();

        return response()->json(['status' => 'deleted']);
    }

    public function today()
    {
        $today = now()->toDateString();

        $query = Transaction::where('user_id', Auth::id())
            ->where('transaction_date', $today);

        return [
            'income' => (clone $query)->where('type', 'income')->sum('amount'),
            'expense' => (clone $query)->where('type', 'expense')->sum('amount'),
        ];
    }

    public function report()
    {
        $query = Transaction::where('user_id', Auth::id());

        return [
            'income' => (clone $query)->where('type', 'income')->sum('amount'),
            'expense' => (clone $query)->where('type', 'expense')->sum('amount'),
            'by_category' => $query->selectRaw('category, type, SUM(amount) as total')
                ->groupBy('category', 'type')
                ->get()
        ];
    }
}
