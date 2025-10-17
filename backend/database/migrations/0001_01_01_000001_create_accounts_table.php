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
        Schema::create('accounts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->OnDelete('cascade');
            $table->string('name');
            $table->enum('type', ['income', 'expense', 'savings']);
            $table->decimal('balance', 15, 2)->default(0);
            $table->timestamps();
        });
    }

};
