<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tarif;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class TarifController extends Controller
{
    public function index(): JsonResponse
    {
        $tarifs = Tarif::with('appartement')
            ->orderBy('date_debut', 'asc')
            ->get();

        return response()->json($tarifs);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'appartement_id' => 'required|exists:appartements,id',
            'date_debut' => 'required|date',
            'date_fin' => 'nullable|date|after_or_equal:date_debut',
            'prix_nuit' => 'nullable|numeric|min:0',
            'type' => 'nullable|string',
            'description' => 'nullable|string',
        ]);

        $tarif = Tarif::create($data);

        return response()->json($tarif, 201);
    }

    public function show(Tarif $tarif): JsonResponse
    {
        return response()->json($tarif->load('appartement'));
    }

    public function update(Request $request, Tarif $tarif): JsonResponse
    {
        $data = $request->validate([
            'appartement_id' => 'nullable|exists:appartements,id',
            'date_debut' => 'nullable|date',
            'date_fin' => 'nullable|date|after_or_equal:date_debut',
            'prix_nuit' => 'nullable|numeric|min:0',
            'type' => 'nullable|string',
            'description' => 'nullable|string',
        ]);

        $tarif->update($data);

        return response()->json($tarif);
    }

    public function destroy(Tarif $tarif): void
    {
        $tarif->delete();
    }
}
