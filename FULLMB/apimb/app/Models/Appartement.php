<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Appartement extends Model
{
    protected $fillable = [
        'slug',
        'titre_fr',
        'titre_en',
        'description_fr',
        'description_en',
        'capacite',
        'prix_nuit',
        'statut',
        'smoobu_id',
        'type',
        'equipements',
        'photos',
    ];

    protected $casts = [
        'equipements' => 'array',
        'photos' => 'array',
    ];

    public function reservations(): HasMany
    {
        return $this->hasMany(Reservation::class);
    }

    public function disponibilites(): HasMany
    {
        return $this->hasMany(Disponibilite::class);
    }

    public function tarifs(): HasMany
    {
        return $this->hasMany(Tarif::class);
    }
}
