<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Avis;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AvisController extends Controller
{
    public function index(): JsonResponse
    {
        $avis = Avis::with(['client', 'reservation'])
            ->orderBy('publie_le', 'desc')
            ->get();

        return response()->json($avis);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'reservation_id' => 'required|exists:reservations,id',
            'client_id' => 'required|exists:clients,id',
            'note' => 'nullable|numeric|min:0|max:5',
            'commentaire' => 'nullable|string',
            'statut' => 'nullable|string',
            'reponse_admin' => 'nullable|string',
            'publie_le' => 'nullable|date',
        ]);

        $avis = Avis::create($data);

        return response()->json($avis, 201);
    }

    public function show(Avis $avi): JsonResponse
    {
        return response()->json($avi->load(['client', 'reservation']));
    }

    public function update(Request $request, Avis $avi): JsonResponse
    {
        $data = $request->validate([
            'reservation_id' => 'nullable|exists:reservations,id',
            'client_id' => 'nullable|exists:clients,id',
            'note' => 'nullable|numeric|min:0|max:5',
            'commentaire' => 'nullable|string',
            'statut' => 'nullable|string',
            'reponse_admin' => 'nullable|string',
            'publie_le' => 'nullable|date',
        ]);

        $avi->update($data);

        return response()->json($avi);
    }

    public function destroy(Avis $avi): void
    {
        $avi->delete();
    }
}
