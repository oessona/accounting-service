<?php

namespace App\Http\Controllers;

use App\Models\Account;
use App\Models\User;
use Illuminate\Http\Request;

/**
 * @OA\Tag(
 *     name="Accounts",
 *     description="API Endpoints of Accounts"
 * )
 */
class AccountController extends Controller
{
    /**
     * @OA\Get(
     *      path="/api/accounts",
     *      operationId="getAccountsList",
     *      tags={"Accounts"},
     *      summary="Get list of accounts",
     *      description="Returns list of accounts",
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
        $user = auth()->user();

        if ($user->isAdmin()) {
            $accounts = Account::all();
        } else {
            $accounts = Account::where('user_id', $user->id)->get();
        }
        return response()->json($accounts);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:checking,savings,credit_card,cash,investment',
            'balance' => 'required|numeric|min:0'
        ]);

        $validated['user_id'] = auth()->id();

        $account = Account::create($validated);

        return response()->json([
            'message' => 'Account created',
            'data' => $account
        ], 201);
    }
    public function show($id)
    {
        $account = Account::find($id);

        if (!$account) {
            return response()->json(['message' => 'Account not found'], 404);
        }

        $user = auth()->user();

        if ($user->isAdmin()) {
            $accounts = Account::all();
        } else {
            $accounts = Account::where('user_id', $user->id)->get();
        }
        return response()->json($accounts);
    }

    public function update(Request $request, $id)
    {
        $account = Account::findOrFail($id);
        $user = auth()->user();

        if (!$user->isAdmin() && $account->user_id !== $user->id) {
            return response()->json(['message' => 'Access denied'], 403);
        }

        $validated = $request->validate([
            'user_id' => 'integer',
            'name' => 'sometimes|string|max:255',
            'type' => 'sometimes|in:checking,savings,credit_card,cash,investment',
            'balance' => 'sometimes|numeric|min:0'
        ]);

        $account->update($validated);

        return response()->json([
            'message' => 'Account updated successfully!',
            'data' => $account
        ]);
    }

    public function destroy($id)
    {
        $account = Account::find($id);

        if (!$account) {
            return response()->json(['message' => 'Account not found'], 404);
        }

        $user = auth()->user();

        if (!$user->isAdmin() && $account->user_id !== $user->id) {
            return response()->json(['message' => 'Access denied'], 403);
        }
        $account->delete();

        return response()->json(['message' => 'Account deleted successfully!']);
    }
}
