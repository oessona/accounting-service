<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $fillable = ['account_id', 'user_id', 'category', 'amount', 'description', 'transaction_date'];

    public function account(){
        return $this->belongsTo(Account::class);
    }
    public function user(){
        return $this->belongsTo(User::class);
    }
}
