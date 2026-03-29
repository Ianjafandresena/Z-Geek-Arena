<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Joueur;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class JoueurController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(Joueur::all());
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nom'        => 'required|string|max:100',
            'email'      => 'required|email|max:150|unique:joueurs',
            'pseudo'     => 'required|string|max:50|unique:joueurs',
            'avatar_url' => 'nullable|string|max:500',
        ]);

        $joueur = Joueur::create($validated);

        return response()->json($joueur, 201);
    }

    public function show(Joueur $joueur): JsonResponse
    {
        return response()->json($joueur->load(['inscriptions.tournoi.jeu', 'votes.categorieRecompense']));
    }

    public function update(Request $request, Joueur $joueur): JsonResponse
    {
        $validated = $request->validate([
            'nom'        => 'string|max:100',
            'email'      => 'email|max:150|unique:joueurs,email,' . $joueur->id,
            'pseudo'     => 'string|max:50|unique:joueurs,pseudo,' . $joueur->id,
            'avatar_url' => 'nullable|string|max:500',
        ]);

        $joueur->update($validated);

        return response()->json($joueur);
    }

    public function destroy(Joueur $joueur): JsonResponse
    {
        $joueur->delete();

        return response()->json(null, 204);
    }
}
