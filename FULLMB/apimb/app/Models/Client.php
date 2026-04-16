<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Client extends Model
{
    protected $fillable = [
        'nom',
        'prenom',
        'email',
        'telephone',
        'nationalite',
        'consentement_rgpd',
        'consentement_rgpd_at',
    ];

    protected $casts = [
        'consentement_rgpd' => 'boolean',
        'consentement_rgpd_at' => 'datetime',
    ];

    public function reservations(): HasMany
    {
        return $this->hasMany(Reservation::class);
    }

    public function avis(): HasMany
    {
        return $this->hasMany(Avis::class);
    }
}
