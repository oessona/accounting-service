<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $income = [
            'salary',
            'sales',
            'refund',
            'bonus',
        ];

        $expense = [
            'rent',
            'utilities',
            'subscriptions',
            'transport',
            'food',
        ];

        foreach ($income as $c) {
            Category::create([
                'type' => 'income',
                'name' => $c
            ]);
        }

        foreach ($expense as $c) {
            Category::create([
                'type' => 'expense',
                'name' => $c
            ]);
        }
    }
}
