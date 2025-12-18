<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $fillable = ['account_id', 'user_id', 'category_id', 'type', 'amount', 'description', 'transaction_date', 'status'];

    protected static function booted()
    {
        static::created(function ($transaction) {
            $account = $transaction->account;
            if ($transaction->type === 'income') {
                $account->increment('balance', $transaction->amount);
            } else {
                $account->decrement('balance', $transaction->amount);
            }
        });

        static::updating(function ($transaction) {
            if ($transaction->isDirty(['amount', 'type', 'account_id'])) {
                // Revert the old transaction amount from the old account
                $oldAccountId = $transaction->getOriginal('account_id');
                $oldType = $transaction->getOriginal('type');
                $oldAmount = $transaction->getOriginal('amount');

                $oldAccount = Account::find($oldAccountId);
                if ($oldAccount) {
                    if ($oldType === 'income') {
                        $oldAccount->decrement('balance', $oldAmount);
                    } else {
                        $oldAccount->increment('balance', $oldAmount);
                    }
                }
            }
        });

        static::updated(function ($transaction) {
            if ($transaction->wasChanged(['amount', 'type', 'account_id'])) {
                // Apply the new transaction amount to the new account
                $account = $transaction->account;
                if ($transaction->type === 'income') {
                    $account->increment('balance', $transaction->amount);
                } else {
                    $account->decrement('balance', $transaction->amount);
                }
            }
        });

        static::deleted(function ($transaction) {
            $account = $transaction->account;
            if ($account) {
                if ($transaction->type === 'income') {
                    $account->decrement('balance', $transaction->amount);
                } else {
                    $account->increment('balance', $transaction->amount);
                }
            }
        });
    }

    public function account()
    {
        return $this->belongsTo(Account::class);
    }
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
