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
        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->OnDelete('cascade');
            $table->enum('report_type', ['income_summary', 'expense_summary', 'balance', 'tax_estimation']);
            $table->date("period_start");
            $table->date("period_end");
            $table->decimal('balance', 15, 2)->default(0);
            $table->timestamps();
        });

    }

};
