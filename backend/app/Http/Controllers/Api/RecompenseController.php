<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CategorieRecompense;
use App\Models\Vote;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RecompenseController extends Controller
{
    /**
     * Liste toutes les catégories actives.
     */
    public function index(): JsonResponse
    {
        $categories = CategorieRecompense::where('active', true)
                                          ->orderBy('nom')
                                          ->get();

        return response()->json($categories);
    }

    /**
     * Détail d'une catégorie avec ses votes.
     */
    public function show(CategorieRecompense $categorie): JsonResponse
    {
        return response()->json($categorie->load('votes.joueur'));
    }

    /**
     * Soumettre un vote.
     */
    public function vote(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'joueur_id'               => 'required|exists:joueurs,id',
            'categorie_recompense_id' => 'required|exists:categories_recompense,id',
            'valeur'                  => 'required|string|max:255',
        ]);

        $vote = Vote::updateOrCreate(
            [
                'joueur_id'               => $validated['joueur_id'],
                'categorie_recompense_id' => $validated['categorie_recompense_id'],
            ],
            ['valeur' => $validated['valeur']]
        );

        return response()->json($vote->load(['joueur', 'categorieRecompense']), 201);
    }
}
