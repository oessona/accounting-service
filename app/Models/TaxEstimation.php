<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TaxEstimation extends Model
{
    protected $fillable = ['user_id', 'total_income', 'total_expenses', 'estimated-tax', 'period_start', 'period_end'];

    public function user(){
        return $this->belongsTo(User::class);
    }
}
