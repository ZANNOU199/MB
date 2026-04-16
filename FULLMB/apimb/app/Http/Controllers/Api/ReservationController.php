<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ReservationController extends Controller
{
    public function index(): JsonResponse
    {
        $reservations = Reservation::with(['appartement', 'client', 'paiements', 'avis'])
            ->orderBy('date_arrivee', 'desc')
            ->get();

        return response()->json($reservations);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'appartement_id' => 'required|exists:appartements,id',
            'client_id' => 'required|exists:clients,id',
            'date_arrivee' => 'required|date',
            'date_depart' => 'required|date|after_or_equal:date_arrivee',
            'nombre_personnes' => 'nullable|integer|min:1',
            'montant_total' => 'nullable|numeric|min:0',
            'statut' => 'nullable|string',
            'smoobu_id' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $reservation = Reservation::create($data);

        return response()->json($reservation, 201);
    }

    public function show(Reservation $reservation): JsonResponse
    {
        return response()->json($reservation->load(['appartement', 'client', 'paiements', 'avis']));
    }

    public function update(Request $request, Reservation $reservation): JsonResponse
    {
        $data = $request->validate([
            'appartement_id' => 'nullable|exists:appartements,id',
            'client_id' => 'nullable|exists:clients,id',
            'date_arrivee' => 'nullable|date',
            'date_depart' => 'nullable|date|after_or_equal:date_arrivee',
            'nombre_personnes' => 'nullable|integer|min:1',
            'montant_total' => 'nullable|numeric|min:0',
            'statut' => 'nullable|string',
            'smoobu_id' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $reservation->update($data);

        return response()->json($reservation);
    }

    public function destroy(Reservation $reservation): void
    {
        $reservation->delete();
    }
}
