<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Reservation extends Model
{
    protected $fillable = [
        'appartement_id',
        'client_id',
        'date_arrivee',
        'date_depart',
        'nombre_personnes',
        'montant_total',
        'statut',
        'smoobu_id',
        'notes',
    ];

    protected $casts = [
        'date_arrivee' => 'date',
        'date_depart' => 'date',
    ];

    public function appartement(): BelongsTo
    {
        return $this->belongsTo(Appartement::class);
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function paiements(): HasMany
    {
        return $this->hasMany(Paiement::class);
    }

    public function avis(): HasMany
    {
        return $this->hasMany(Avis::class);
    }
}
