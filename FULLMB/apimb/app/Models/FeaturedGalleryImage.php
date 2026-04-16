<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FeaturedGalleryImage extends Model
{
    use HasFactory;

    protected $fillable = [
        'appartement_id',
        'photo_url',
        'display_order',
    ];

    public function appartement()
    {
        return $this->belongsTo(Appartement::class);
    }
}
