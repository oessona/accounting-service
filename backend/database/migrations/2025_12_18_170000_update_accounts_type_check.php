<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Drop the old constraint first so we can update data to new values that might have been restricted
        DB::statement("ALTER TABLE accounts DROP CONSTRAINT IF EXISTS accounts_type_check");

        // 2. Fix existing conflicting data: map 'expense' and 'income' (if any) to 'checking'
        // This ensures all data conforms to the new list before we re-apply the constraint
        DB::table('accounts')->whereIn('type', ['expense', 'income'])->update(['type' => 'checking']);

        // 3. Add the new constraint with the complete list of allowed types from the frontend
        DB::statement("ALTER TABLE accounts ADD CONSTRAINT accounts_type_check CHECK (type::text = ANY (ARRAY['checking'::text, 'savings'::text, 'credit_card'::text, 'cash'::text, 'investment'::text]))");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // To reverse, we drop the new constraint. 
        // We can't easily revert the data changes (expense/income -> checking), so we leave that.
        // We define a fallback constraint if needed, but for now just dropping is safer than failing.
        DB::statement("ALTER TABLE accounts DROP CONSTRAINT IF EXISTS accounts_type_check");
    }
};
