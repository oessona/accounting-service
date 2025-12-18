<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

/**
 * @OA\Tag(
 *     name="Transactions",
 *     description="API Endpoints of Transactions"
 * )
 */
class TransactionController extends Controller
{
    /**
     * @OA\Get(
     *      path="/api/transactions",
     *      operationId="getTransactionsList",
     *      tags={"Transactions"},
     *      summary="Get list of transactions",
     *      description="Returns list of transactions",
     *      security={{"sanctum":{}}},
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *       ),
     *      @OA\Response(
     *          response=401,
     *          description="Unauthenticated",
     *      ),
     *      @OA\Response(
     *          response=403,
     *          description="Forbidden"
     *      )
     *     )
     */
    public function index()
    {
        return Transaction::with(['account', 'category'])->where('user_id', Auth::id())->get();
    }

    /**
     * @OA\Post(
     *      path="/api/transactions",
     *      operationId="storeTransaction",
     *      tags={"Transactions"},
     *      summary="Store new transaction",
     *      description="Returns transaction data",
     *      security={{"sanctum":{}}},
     *      @OA\RequestBody(
     *          required=true,
     *          @OA\JsonContent(
     *              required={"account_id","type","category","amount","transaction_date"},
     *              @OA\Property(property="account_id", type="integer", example=1),
     *              @OA\Property(property="type", type="string", example="expense"),
     *              @OA\Property(property="category", type="string", example="Groceries"),
     *              @OA\Property(property="amount", type="number", format="float", example=50.25),
     *              @OA\Property(property="transaction_date", type="string", format="date", example="2023-10-25"),
     *              @OA\Property(property="description", type="string", example="Weekly grocery shopping"),
     *          ),
     *      ),
     *      @OA\Response(
     *          response=201,
     *          description="Successful operation",
     *       ),
     *      @OA\Response(
     *          response=400,
     *          description="Bad Request"
     *      ),
     *      @OA\Response(
     *          response=401,
     *          description="Unauthenticated",
     *      )
     * )
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'account_id' => 'required|integer|exists:accounts,id',
            'type' => 'required|in:income,expense',
            'category' => 'required|string',
            'amount' => 'required|numeric',
            'description' => 'nullable|string',
            'transaction_date' => 'required|date'
        ]);

        $categoryName = $data['category'];
        $type = $data['type'];

        // Find or create category
        $category = \App\Models\Category::firstOrCreate(
            ['name' => $categoryName, 'type' => $type],
            ['name' => $categoryName, 'type' => $type]
        );

        $data['user_id'] = Auth::id();
        $data['category_id'] = $category->id;
        unset($data['category']); // parsing category name to create/find category_id

        $transaction = Transaction::create($data);
        return $transaction->load(['account', 'category']);
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

        if (isset($data['category'])) {
            $category = \App\Models\Category::firstOrCreate(
                ['name' => $data['category'], 'type' => $transaction->type],
                ['name' => $data['category'], 'type' => $transaction->type]
            );
            $data['category_id'] = $category->id;
            unset($data['category']);
        }

        $transaction->update($data);

        return $transaction->load(['account', 'category']);
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

    public function dailyStats()
    {
        return $this->today();
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
