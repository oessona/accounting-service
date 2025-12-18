<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Account;
use App\Models\Transaction;
use App\Models\Category;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class HistorySeeder extends Seeder
{
    public function run(): void
    {
        // Try to find the common users
        $users = User::whereIn('email', ['test@example.com', 'test1@gmail.com'])->get();
        if ($users->isEmpty()) {
            $users = User::limit(2)->get();
        }

        if ($users->isEmpty()) {
            $this->command->error('No users found to seed history.');
            return;
        }

        foreach ($users as $user) {
            // Find or create an account
            $account = $user->accounts()->first();
            if (!$account) {
                $account = Account::create([
                    'user_id' => $user->id,
                    'name' => 'Main Bank',
                    'type' => 'checking',
                    'balance' => 0
                ]);
            }

            // Categories
            $food = Category::firstOrCreate(['name' => 'Food', 'type' => 'expense']);
            $salary = Category::firstOrCreate(['name' => 'Salary', 'type' => 'income']);
            $rent = Category::firstOrCreate(['name' => 'Rent', 'type' => 'expense']);
            $freelance = Category::firstOrCreate(['name' => 'Freelance', 'type' => 'income']);

            // Create transactions for the last 5 months
            for ($i = 5; $i >= 0; $i--) {
                $date = Carbon::now()->subMonths($i)->startOfMonth()->addDays(rand(1, 20));

                // Salary (Income)
                Transaction::create([
                    'user_id' => $user->id,
                    'account_id' => $account->id,
                    'category_id' => $salary->id,
                    'type' => 'income',
                    'amount' => 3000 + rand(0, 500),
                    'description' => 'Monthly Salary',
                    'transaction_date' => $date->toDateString(),
                    'status' => 'completed'
                ]);

                // Freelance (Income)
                if (rand(0, 1)) {
                    Transaction::create([
                        'user_id' => $user->id,
                        'account_id' => $account->id,
                        'category_id' => $freelance->id,
                        'type' => 'income',
                        'amount' => 500 + rand(0, 1000),
                        'description' => 'Freelance project',
                        'transaction_date' => $date->copy()->addDays(rand(1, 5))->toDateString(),
                        'status' => 'completed'
                    ]);
                }

                // Rent (Expense)
                Transaction::create([
                    'user_id' => $user->id,
                    'account_id' => $account->id,
                    'category_id' => $rent->id,
                    'type' => 'expense',
                    'amount' => 1000,
                    'description' => 'Monthly Rent',
                    'transaction_date' => $date->copy()->addDays(1)->toDateString(),
                    'status' => 'completed'
                ]);

                // Food (Expense)
                for ($j = 0; $j < 3; $j++) {
                    Transaction::create([
                        'user_id' => $user->id,
                        'account_id' => $account->id,
                        'category_id' => $food->id,
                        'type' => 'expense',
                        'amount' => 50 + rand(0, 100),
                        'description' => 'Groceries ' . ($j + 1),
                        'transaction_date' => $date->copy()->addDays(rand(2, 25))->toDateString(),
                        'status' => 'completed'
                    ]);
                }
            }
        }

        $this->command->info('History seeded successfully for ' . $users->count() . ' users.');
    }
}
