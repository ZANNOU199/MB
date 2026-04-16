<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\FeaturedGalleryImage;
use Illuminate\Support\Facades\Validator;

class FeaturedGalleryImageController extends Controller
{
    // GET: Liste des 9 images à la une (ordre)
    public function index()
    {
        return FeaturedGalleryImage::with('appartement')
            ->orderBy('display_order')
            ->get();
    }

    // PUT: Met à jour la sélection (remplace tout)
    public function update(Request $request)
    {
        $data = $request->validate([
            'images' => 'required|array|min:1',
            'images.*.appartement_id' => 'required|exists:appartements,id',
            'images.*.photo_url' => 'required|string',
        ]);

        // On supprime tout et on remplace
        FeaturedGalleryImage::truncate();
        $order = 1;
        foreach ($data['images'] as $img) {
            FeaturedGalleryImage::create([
                'appartement_id' => $img['appartement_id'],
                'photo_url' => $img['photo_url'],
                'display_order' => $order,
            ]);
            $order++;
        }
        return response()->json(['success' => true]);
    }
}
