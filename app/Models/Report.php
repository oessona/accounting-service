<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    protected $fillable = ['user_id', 'report_type', 'period_start', 'period_end', 'total_amount'];

    public function user(){
        return $this->belongsTo(User::class);
    }
}
