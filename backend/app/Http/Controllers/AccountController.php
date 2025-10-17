<?php

namespace App\Http\Controllers;

use App\Models\Account;
use App\Models\User;
use Illuminate\Http\Request;

class AccountController extends Controller
{
    public function index(){
        $user = auth()->user();

        if($user -> isAdmin()) {
            $accounts = Account::all();
        }else{
            $accounts = Account::where('user_id', $user->id)->get();
        }
        return response()->json($accounts);
    }

    public function store(Request $request){
        $validated = $request->validate([
            'user_id' => 'integer',
            'name' => 'required|string|max:255',
            'type' => 'required|in:income,expense,savings',
            'balance' => 'required|numeric|min:0'
        ]);

        $account = Account::create($validated);

        return response()->json([
            'message' => 'Account created',
            'data' => $account
        ], 201);
    }
    public function show($id){
        $account = Account::find($id);

        if(!$account){
            return response()->json(['message' => 'Account not found'], 404);
        }

        $user = auth()->user();

        if($user -> isAdmin()) {
            $accounts = Account::all();
        }else{
            $accounts = Account::where('user_id', $user->id)->get();
        }
        return response()->json($accounts);
    }

    public function update(Request $request, $id){
        $account = Account::findOrFail($id);
        $user = auth()->user();

        if(!$user->isAdmin() && $account->user_id !== $user->id){
            return response()->json(['message' => 'Access denied'], 403);
        }

        $validated = $request->validate([
            'user_id' => 'integer',
            'name' => 'sometimes|string|max:255',
            'type' => 'sometimes|in:income,expense,savings',
            'balance' => 'sometimes|numeric|min:0'
        ]);

        $account->update($validated);

        return response()->json([
            'message' => 'Account updated successfully!',
            'data' => $account
        ]);
    }

    public function destroy($id){
        $account = Account::find($id);

        if(!$account){
            return response()->json(['message' => 'Account not found'], 404);
        }

        $user = auth()->user();

        if(!$user->isAdmin() && $account->user_id !== $user->id){
            return response()->json(['message' => 'Access denied'], 403);
        }
        $account->delete();

        return response()->json(['message' => 'Account deleted successfully!']);
    }
}
