<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

// Add this import:
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    // Add HasApiTokens to the traits:
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = ['name', 'email', 'password', 'role'];

    public function isAdmin(): bool{
        return $this->role ==='admin';
    }
    public function accounts(){
        return $this->hasMany(Account::class);
    }

    public function transactions(){
        return $this->hasMany(Transaction::class);
    }

    public function reports(){
        return $this->hasMany(Report::class);
    }

    public function taxEstimations(){
        return $this->hasMany(TaxEstimation::class);
    }
}
