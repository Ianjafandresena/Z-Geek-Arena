<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Actualite;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ActualiteController extends Controller
{
    public function index(): JsonResponse
    {
        $actualites = Actualite::with('event')
                               ->where('publie', true)
                               ->orderByDesc('date_publication')
                               ->get();

        return response()->json($actualites);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'event_id'         => 'nullable|exists:events,id',
            'titre'            => 'required|string|max:255',
            'slug'             => 'required|string|max:255|unique:actualites',
            'contenu'          => 'required|string',
            'extrait'          => 'nullable|string|max:500',
            'image_url'        => 'nullable|string|max:500',
            'categorie'        => 'in:nouvelles,communaute,esport,culture,partenaires',
            'publie'           => 'boolean',
            'date_publication' => 'nullable|date',
        ]);

        $actualite = Actualite::create($validated);

        return response()->json($actualite, 201);
    }

    public function show(string $slug): JsonResponse
    {
        $actualite = Actualite::with('event')
                              ->where('slug', $slug)
                              ->firstOrFail();

        return response()->json($actualite);
    }

    public function update(Request $request, Actualite $actualite): JsonResponse
    {
        $validated = $request->validate([
            'event_id'         => 'nullable|exists:events,id',
            'titre'            => 'string|max:255',
            'slug'             => 'string|max:255|unique:actualites,slug,' . $actualite->id,
            'contenu'          => 'string',
            'extrait'          => 'nullable|string|max:500',
            'image_url'        => 'nullable|string|max:500',
            'categorie'        => 'in:nouvelles,communaute,esport,culture,partenaires',
            'publie'           => 'boolean',
            'date_publication' => 'nullable|date',
        ]);

        $actualite->update($validated);

        return response()->json($actualite);
    }

    public function destroy(Actualite $actualite): JsonResponse
    {
        $actualite->delete();

        return response()->json(null, 204);
    }
}
