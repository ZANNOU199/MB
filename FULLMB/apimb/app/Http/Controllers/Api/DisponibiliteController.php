<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Disponibilite;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class DisponibiliteController extends Controller
{
    public function index(): JsonResponse
    {
        $disponibilites = Disponibilite::with('appartement')
            ->orderBy('date_debut', 'asc')
            ->get();

        return response()->json($disponibilites);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'appartement_id' => 'required|exists:appartements,id',
            'date_debut' => 'required|date',
            'date_fin' => 'required|date|after_or_equal:date_debut',
            'source' => 'nullable|string',
            'bloque' => 'nullable|boolean',
            'notes' => 'nullable|string',
        ]);

        $disponibilite = Disponibilite::create($data);

        return response()->json($disponibilite, 201);
    }

    public function show(Disponibilite $disponibilite): JsonResponse
    {
        return response()->json($disponibilite->load('appartement'));
    }

    public function update(Request $request, Disponibilite $disponibilite): JsonResponse
    {
        $data = $request->validate([
            'appartement_id' => 'nullable|exists:appartements,id',
            'date_debut' => 'nullable|date',
            'date_fin' => 'nullable|date|after_or_equal:date_debut',
            'source' => 'nullable|string',
            'bloque' => 'nullable|boolean',
            'notes' => 'nullable|string',
        ]);

        $disponibilite->update($data);

        return response()->json($disponibilite);
    }

    public function destroy(Disponibilite $disponibilite): void
    {
        $disponibilite->delete();
    }
}
