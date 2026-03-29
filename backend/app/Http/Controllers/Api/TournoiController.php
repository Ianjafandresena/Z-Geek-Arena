<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tournoi;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TournoiController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Tournoi::with(['event', 'jeu']);

        if ($request->has('event_id')) {
            $query->where('event_id', $request->event_id);
        }

        return response()->json($query->orderBy('date_debut')->get());
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'event_id'    => 'required|exists:events,id',
            'jeu_id'      => 'required|exists:jeux,id',
            'nom'         => 'nullable|string|max:150',
            'date_debut'  => 'required|date',
            'date_fin'    => 'nullable|date|after_or_equal:date_debut',
            'phase'       => 'in:poules,top8,finale,exhibition',
            'format'      => 'in:double_elimination,single_elimination,round_robin,swiss',
            'max_joueurs' => 'integer|min:2',
        ]);

        $tournoi = Tournoi::create($validated);

        return response()->json($tournoi->load(['event', 'jeu']), 201);
    }

    public function show(Tournoi $tournoi): JsonResponse
    {
        return response()->json(
            $tournoi->load(['event.lieu', 'jeu.regles', 'joueurs'])
        );
    }

    public function update(Request $request, Tournoi $tournoi): JsonResponse
    {
        $validated = $request->validate([
            'event_id'    => 'exists:events,id',
            'jeu_id'      => 'exists:jeux,id',
            'nom'         => 'nullable|string|max:150',
            'date_debut'  => 'date',
            'date_fin'    => 'nullable|date|after_or_equal:date_debut',
            'phase'       => 'in:poules,top8,finale,exhibition',
            'format'      => 'in:double_elimination,single_elimination,round_robin,swiss',
            'max_joueurs' => 'integer|min:2',
        ]);

        $tournoi->update($validated);

        return response()->json($tournoi->load(['event', 'jeu']));
    }

    public function destroy(Tournoi $tournoi): JsonResponse
    {
        $tournoi->delete();

        return response()->json(null, 204);
    }
}
