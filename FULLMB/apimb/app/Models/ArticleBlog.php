<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ArticleBlog extends Model
{
    use SoftDeletes;

    protected $table = 'articles_blog';

    protected $fillable = [
        'slug',
        'titre_fr',
        'titre_en',
        'contenu_fr',
        'contenu_en',
        'categorie',
        'image_url',
        'publie_le',
        'statut',
        'excerpt_fr',
        'excerpt_en',
    ];

    protected $casts = [
        'publie_le' => 'datetime',
    ];
}
