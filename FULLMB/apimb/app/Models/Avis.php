<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Avis extends Model
{
    protected $fillable = [
        'reservation_id',
        'client_id',
        'note',
        'commentaire',
        'statut',
        'reponse_admin',
        'publie_le',
    ];

    protected $casts = [
        'publie_le' => 'datetime',
    ];

    public function reservation(): BelongsTo
    {
        return $this->belongsTo(Reservation::class);
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }
}
