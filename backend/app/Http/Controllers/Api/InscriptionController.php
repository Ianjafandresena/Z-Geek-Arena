<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Inscription;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InscriptionController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Inscription::with(['joueur', 'tournoi.jeu', 'event']);

        if ($request->has('tournoi_id')) {
            $query->where('tournoi_id', $request->tournoi_id);
        }

        if ($request->has('event_id')) {
            $query->where('event_id', $request->event_id);
        }

        if ($request->has('joueur_id')) {
            $query->where('joueur_id', $request->joueur_id);
        }

        return response()->json($query->get());
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'joueur_id'  => 'required|exists:joueurs,id',
            'tournoi_id' => 'nullable|exists:tournois,id',
            'event_id'   => 'required|exists:events,id',
            'statut'     => 'in:inscrit,confirme,annule,disqualifie',
        ]);

        $inscription = Inscription::create($validated);

        return response()->json($inscription->load(['joueur', 'tournoi', 'event']), 201);
    }

    public function show(Inscription $inscription): JsonResponse
    {
        return response()->json($inscription->load(['joueur', 'tournoi.jeu', 'event']));
    }

    public function update(Request $request, Inscription $inscription): JsonResponse
    {
        $validated = $request->validate([
            'statut'     => 'in:inscrit,confirme,annule,disqualifie',
            'classement' => 'nullable|integer|min:1',
        ]);

        $inscription->update($validated);

        return response()->json($inscription->load(['joueur', 'tournoi', 'event']));
    }

    public function destroy(Inscription $inscription): JsonResponse
    {
        $inscription->delete();

        return response()->json(null, 204);
    }
}
