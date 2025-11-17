<?php

use App\Http\Controllers\AccountController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\TransactionController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

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
});


