<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Tarif extends Model
{
    protected $fillable = [
        'appartement_id',
        'date_debut',
        'date_fin',
        'prix_nuit',
        'type',
        'description',
    ];

    protected $casts = [
        'date_debut' => 'date',
        'date_fin' => 'date',
    ];

    public function appartement(): BelongsTo
    {
        return $this->belongsTo(Appartement::class);
    }
}
