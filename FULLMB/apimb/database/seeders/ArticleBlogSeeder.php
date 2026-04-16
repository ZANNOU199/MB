<?php

namespace Database\Seeders;

use App\Models\ArticleBlog;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ArticleBlogSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        ArticleBlog::create([
            'slug' => 'weekend-detente-cotonou',
            'titre_fr' => 'Week-end Détente à Cotonou',
            'titre_en' => 'Relaxing Weekend in Cotonou',
            'contenu_fr' => "Découvrez un week-end de luxe à Cotonou avec un hébergement 5 étoiles, une cuisine locale raffinée et des activités exclusives.",
            'contenu_en' => "Enjoy a relaxing weekend in Cotonou with luxury accommodation, fine local cuisine, and exclusive activities.",
            'categorie' => 'Voyage',
            'image_url' => '/storage/articles/test-cotonou.jpg',
            'publie_le' => now(),
            'statut' => 'published',
            'excerpt_fr' => 'Vivez un séjour inoubliable à Cotonou dans notre résidence de prestige.',
            'excerpt_en' => 'Experience an unforgettable stay in Cotonou at our luxury residence.',
        ]);
    }
}
