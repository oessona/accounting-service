<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $email = 'admin@example.com';

        $admin = User::where('email', $email)->first();

        if (!$admin) {
            User::create([
                'name' => 'System Admin',
                'email' => $email,
                'password' => Hash::make('password'),
                'role' => 'admin',
            ]);
            $this->command->info("Admin user created successfully.");
            $this->command->info("Email: $email");
            $this->command->info("Password: password");
        } else {
            $admin->role = 'admin';
            $admin->save();
            $this->command->info("User $email updated to admin role.");
        }
    }
}
