<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            $table->enum('type', ['income', 'expense']);
            $table->foreignId('category_id')->constrained()->onDelete('cascade');

            $table->decimal('amount', 15, 2)->default(0);
            $table->text('description')->nullable();
            $table->enum('status', ['processing', 'done', 'failed'])->default('done');

            $table->date('transaction_date');
            $table->timestamps();
        });
    }
};
