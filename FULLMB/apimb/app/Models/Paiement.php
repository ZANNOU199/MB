<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Paiement extends Model
{
    protected $fillable = [
        'reservation_id',
        'provider',
        'transaction_id',
        'statut',
        'montant',
        'paid_at',
        'details',
    ];

    protected $casts = [
        'paid_at' => 'datetime',
        'details' => 'array',
    ];

    public function reservation(): BelongsTo
    {
        return $this->belongsTo(Reservation::class);
    }
}
