<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ArticleBlog;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class ArticleBlogController extends Controller
{
    public function index(): JsonResponse
    {
        // Utilise Eloquent pour exclure automatiquement les soft deleted
        $articles = ArticleBlog::orderBy('publie_le', 'desc')->get();
        return response()->json($articles);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'slug' => 'required|string|unique:articles_blog,slug',
            'titre_fr' => 'required|string',
            'titre_en' => 'nullable|string',
            'contenu_fr' => 'nullable|string',
            'contenu_en' => 'nullable|string',
            'categorie' => 'nullable|string',
            'image_url' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp,bmp,tiff|max:5120',
            'publie_le' => 'nullable|date',
            'statut' => 'nullable|string',
            'excerpt_fr' => 'nullable|string',
            'excerpt_en' => 'nullable|string',
        ]);

        // Handle file upload
        if ($request->hasFile('image_url')) {
            $file = $request->file('image_url');
            $path = $file->store('articles', 'r2');
            $data['image_url'] = Storage::disk('r2')->url($path);
        }

        $article = ArticleBlog::create($data);

        return response()->json($article, 201);
    }

    public function show(ArticleBlog $article): JsonResponse
    {
        return response()->json($article);
    }

    public function showBySlug($slug): JsonResponse
    {
        $article = ArticleBlog::where('slug', $slug)->first();
        if (!$article) {
            return response()->json(['error' => 'Article non trouvé'], 404);
        }
        return response()->json($article);
    }

    public function update(Request $request, ArticleBlog $article): JsonResponse
    {
        $rules = [
            'slug' => 'sometimes|required|string|unique:articles_blog,slug,' . $article->id,
            'titre_fr' => 'sometimes|required|string',
            'titre_en' => 'nullable|string',
            'contenu_fr' => 'nullable|string',
            'contenu_en' => 'nullable|string',
            'categorie' => 'nullable|string',
            'image_url' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp,bmp,tiff|max:5120',
            'publie_le' => 'nullable|date',
            'statut' => 'nullable|string',
            'excerpt_fr' => 'nullable|string',
            'excerpt_en' => 'nullable|string',
        ];
        $data = $request->validate($rules);

        // Remplit les champs requis manquants avec la valeur existante
        if (!array_key_exists('slug', $data)) {
            $data['slug'] = $article->slug;
        }
        if (!array_key_exists('titre_fr', $data)) {
            $data['titre_fr'] = $article->titre_fr;
        }

        // Handle file upload
        if ($request->hasFile('image_url')) {
            $file = $request->file('image_url');
            $path = $file->store('articles', 'r2');
            $data['image_url'] = Storage::disk('r2')->url($path);
        } else {
            // If no new file, keep the existing image
            unset($data['image_url']);
        }

        $article->update($data);

        return response()->json($article);
    }

   
public function destroy($id)
{
    $article = ArticleBlog::find($id);
    if (!$article) {
        \Log::error('API DELETE: Article not found', ['id' => $id]);
        return response()->json(['success' => false, 'error' => 'Article not found'], 404);
    }
    \Log::debug('API DELETE', [
        'id' => $article->id,
        'slug' => $article->slug,
        'deleted_at_before' => $article->deleted_at,
    ]);
    $article->delete();
    \Log::debug('API DELETE after', [
        'id' => $article->id,
        'deleted_at_after' => $article->fresh()->deleted_at,
    ]);
    return response()->json([
        'success' => true,
        'deleted_at' => $article->fresh()->deleted_at,
    ]);
}
}
