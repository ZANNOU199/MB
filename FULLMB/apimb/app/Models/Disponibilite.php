<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Disponibilite extends Model
{
    protected $fillable = [
        'appartement_id',
        'date_debut',
        'date_fin',
        'source',
        'bloque',
        'notes',
    ];

    protected $casts = [
        'date_debut' => 'date',
        'date_fin' => 'date',
        'bloque' => 'boolean',
    ];

    public function appartement(): BelongsTo
    {
        return $this->belongsTo(Appartement::class);
    }
}
