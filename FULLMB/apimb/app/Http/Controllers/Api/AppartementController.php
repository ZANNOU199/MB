<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appartement;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AppartementController extends Controller
{
    /**
     * Affiche un appartement par son slug
     */
    public function showBySlug($slug): JsonResponse
    {
        $appartement = Appartement::where('slug', $slug)->with(['disponibilites', 'tarifs'])->first();
        if (!$appartement) {
            return response()->json(['message' => 'Appartement non trouvé'], 404);
        }
        $appartement->equipements = is_string($appartement->equipements) ? json_decode($appartement->equipements, true) : $appartement->equipements;
        return response()->json($appartement);
    }

    public function index(): JsonResponse
    {
        $appartements = Appartement::with(['disponibilites', 'tarifs'])
            ->orderBy('created_at', 'desc')
            ->get();
        foreach ($appartements as $apt) {
            $apt->equipements = is_string($apt->equipements) ? json_decode($apt->equipements, true) : $apt->equipements;
            $apt->photos = is_string($apt->photos) ? json_decode($apt->photos, true) : $apt->photos;
        }
        return response()->json($appartements);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'slug' => 'required|string|unique:appartements,slug',
            'titre_fr' => 'required|string',
            'titre_en' => 'required|string',
            'description_fr' => 'nullable|string',
            'description_en' => 'nullable|string',
            'capacite' => 'nullable|integer|min:1',
            'prix_nuit' => 'nullable|numeric|min:0',
            'statut' => 'nullable|string',
            'smoobu_id' => 'nullable|string',
            'type' => 'nullable|string',
            'equipements' => 'nullable|array',
            'photos.*' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp,bmp,tiff|max:30728', // 20 Mo
        ]);

        // Upload multiple images to R2
        $photoUrls = [];
        if ($request->hasFile('photos')) {
            foreach ($request->file('photos') as $photo) {
                $path = $photo->store('appartements', 'r2');
                $photoUrls[] = \Storage::disk('r2')->url($path);
            }
        }
        $data['photos'] = $photoUrls;
        // Correction : décoder chaque string JSON si besoin
        if (isset($data['equipements']) && is_array($data['equipements'])) {
            $data['equipements'] = array_map(function ($item) {
                if (is_string($item)) {
                    $decoded = json_decode($item, true);
                    return $decoded !== null ? $decoded : $item;
                }
                return $item;
            }, $data['equipements']);
        } else if (isset($data['equipements']) && !is_array($data['equipements'])) {
            $data['equipements'] = json_decode($data['equipements'], true);
        }
        $appartement = Appartement::create($data);
        $appartement->equipements = is_string($appartement->equipements) ? json_decode($appartement->equipements, true) : $appartement->equipements;
        return response()->json($appartement, 201);
    }

    public function show(Appartement $appartement): JsonResponse
    {
        $appartement->equipements = is_string($appartement->equipements) ? json_decode($appartement->equipements, true) : $appartement->equipements;
        return response()->json($appartement->load(['disponibilites', 'tarifs']));
    }

    public function update(Request $request, Appartement $appartement): JsonResponse
    {
        $data = $request->validate([
            'slug' => 'required|string|unique:appartements,slug,' . $appartement->id,
            'titre_fr' => 'required|string',
            'titre_en' => 'required|string',
            'description_fr' => 'nullable|string',
            'description_en' => 'nullable|string',
            'capacite' => 'nullable|integer|min:1',
            'prix_nuit' => 'nullable|numeric|min:0',
            'statut' => 'nullable|string',
            'smoobu_id' => 'nullable|string',
            'type' => 'nullable|string',
            'equipements' => 'nullable|array',
            'photos.*' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp,bmp,tiff|max:30728',
        ]);

        // Gestion upload images
        // On récupère la liste des URLs à garder (venant du front)
        if ($request->has('photos_to_keep')) {
            $photoUrls = $request->input('photos_to_keep', []);
        } else {
            $photoUrls = $appartement->photos ?? [];
        }
        // Ajout des nouvelles images uploadées
        if ($request->hasFile('photos')) {
            foreach ($request->file('photos') as $photo) {
                $path = $photo->store('appartements', 'r2');
                $publicUrl = rtrim(config('filesystems.disks.r2.url'), '/') . '/' . ltrim($path, '/');
                $photoUrls[] = $publicUrl;
            }
        }
        $data['photos'] = $photoUrls;
        // Correction : décoder chaque string JSON si besoin
        if (isset($data['equipements']) && is_array($data['equipements'])) {
            $data['equipements'] = array_map(function ($item) {
                if (is_string($item)) {
                    $decoded = json_decode($item, true);
                    return $decoded !== null ? $decoded : $item;
                }
                return $item;
            }, $data['equipements']);
        } else if (isset($data['equipements']) && !is_array($data['equipements'])) {
            $data['equipements'] = json_decode($data['equipements'], true);
        }

        $appartement->update($data);
        $appartement->equipements = is_string($appartement->equipements) ? json_decode($appartement->equipements, true) : $appartement->equipements;

        return response()->json($appartement);
    }

    public function destroy(Appartement $appartement): void
    {
        $appartement->delete();
    }
}
