<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Client;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ClientController extends Controller
{
    public function index(): JsonResponse
    {
        $clients = Client::with(['reservations', 'avis'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($clients);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'nom' => 'required|string',
            'prenom' => 'required|string',
            'email' => 'required|email|unique:clients,email',
            'telephone' => 'nullable|string',
            'nationalite' => 'nullable|string',
            'consentement_rgpd' => 'nullable|boolean',
            'consentement_rgpd_at' => 'nullable|date',
        ]);

        $client = Client::create($data);

        return response()->json($client, 201);
    }

    public function show(Client $client): JsonResponse
    {
        return response()->json($client->load(['reservations', 'avis']));
    }

    public function update(Request $request, Client $client): JsonResponse
    {
        $data = $request->validate([
            'nom' => 'required|string',
            'prenom' => 'required|string',
            'email' => 'required|email|unique:clients,email,' . $client->id,
            'telephone' => 'nullable|string',
            'nationalite' => 'nullable|string',
            'consentement_rgpd' => 'nullable|boolean',
            'consentement_rgpd_at' => 'nullable|date',
        ]);

        $client->update($data);

        return response()->json($client);
    }

    public function destroy(Client $client): void
    {
        $client->delete();
    }
}
