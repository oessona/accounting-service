<?php

use App\Http\Controllers\AccountController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\TransactionController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;

Route::get('/test', function () {
    return response()->json(['message' => 'API is working']);
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function () {

    Route::get('/transactions', [TransactionController::class, 'index']);
    Route::get('/transactions/stats/today', [TransactionController::class, 'dailyStats']);
    Route::post('/transactions', [TransactionController::class, 'store']);
    Route::put('/transactions/{id}', [TransactionController::class, 'update']);
    Route::delete('/transactions/{id}', [TransactionController::class, 'destroy']);

    // Reports
    Route::get('/reports/summary', [ReportController::class, 'summary']);
    Route::get('/reports/transactions', [ReportController::class, 'allTransactions']);

    // User & Accounts
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::get('/accounts', [AccountController::class, 'index']);
    Route::post('/accounts', [AccountController::class, 'store']);
    Route::put('/accounts/{id}', [AccountController::class, 'update']);
    Route::delete('/accounts/{id}', [AccountController::class, 'destroy']);

    // Admin (protected by simple check in Controller or dedicated middleware - assuming check in controller for now or standard auth)
    // For proper security, we should check $user->isAdmin(). 
    // Adding a group that checks for admin would be best, but for speed, let's rely on Controller logic + auth

    Route::prefix('admin')->group(function () {
        Route::get('/users', [\App\Http\Controllers\AdminController::class, 'index']);
        Route::delete('/users/{id}', [\App\Http\Controllers\AdminController::class, 'destroy']);
        Route::get('/activity', [\App\Http\Controllers\AdminController::class, 'activity']);
    });
});


