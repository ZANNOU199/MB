<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Paiement;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PaiementController extends Controller
{
    public function index(): JsonResponse
    {
        $paiements = Paiement::with('reservation')
            ->orderBy('paid_at', 'desc')
            ->get();

        return response()->json($paiements);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'reservation_id' => 'required|exists:reservations,id',
            'provider' => 'nullable|string',
            'transaction_id' => 'nullable|string',
            'statut' => 'nullable|string',
            'montant' => 'nullable|numeric|min:0',
            'paid_at' => 'nullable|date',
            'details' => 'nullable|array',
        ]);

        $paiement = Paiement::create($data);

        return response()->json($paiement, 201);
    }

    public function show(Paiement $paiement): JsonResponse
    {
        return response()->json($paiement->load('reservation'));
    }

    public function update(Request $request, Paiement $paiement): JsonResponse
    {
        $data = $request->validate([
            'reservation_id' => 'nullable|exists:reservations,id',
            'provider' => 'nullable|string',
            'transaction_id' => 'nullable|string',
            'statut' => 'nullable|string',
            'montant' => 'nullable|numeric|min:0',
            'paid_at' => 'nullable|date',
            'details' => 'nullable|array',
        ]);

        $paiement->update($data);

        return response()->json($paiement);
    }

    public function destroy(Paiement $paiement): void
    {
        $paiement->delete();
    }
}
